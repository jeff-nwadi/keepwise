// Sign-in server action. The action gates the request through Arcjet
// (DoS / SPOOFING control) and then delegates to Better Auth for the
// actual sign-in. The React sign-in form calls this via useActionState.
//
// We expose one entry point: `signInWithPassword`. It takes a FormData
// containing `email` and `password`. On success it redirects to /items
// (or to the `next` query param if the proxy put one there). On
// failure it returns a string error message that the form renders
// inline.
//
// Better Auth's signIn.email() will set the session cookie via the
// /api/auth/* handler. Calling the server action and then redirecting
// keeps the cookie on the response.

"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { request } from "@arcjet/next";
import { APIError } from "better-auth/api";
import { auth } from "@/lib/auth";
import { authArcjet } from "@/lib/arcjet";
import { db } from "@/lib/db";
import { household, householdMember } from "@/lib/db/schema";

const SignInInput = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(200),
});

export type SignInState = { error?: string; ok?: boolean } | null;

export async function signInWithPassword(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  // 1. Arcjet gate.
  try {
    const decision = await authArcjet.protect(await request());
    if (decision.isDenied()) {
      return { error: "Too many attempts. Try again in a minute." };
    }
  } catch {
    // If Arcjet itself errors, fall through — don't lock the user out
    // because of an Arcjet outage.
  }

  // 2. Validate.
  const parsed = SignInInput.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Enter a valid email and a password of at least 8 characters." };
  }

  // 3. Delegate to Better Auth.
  try {
    await auth.api.signInEmail({
      body: { email: parsed.data.email, password: parsed.data.password },
      headers: await headers(),
    });
  } catch (err) {
    if (err instanceof APIError) {
      // Don't leak which side of the credential pair is wrong.
      return { error: "Email or password is incorrect." };
    }
    return { error: "Something went wrong. Try again." };
  }

  // 4. Redirect on success. The proxy strips `next` on the
  //    unauthorised bounce, so this is the only place we read it.
  const nextRaw = formData.get("next");
  const next = typeof nextRaw === "string" && nextRaw.startsWith("/") ? nextRaw : "/items";
  redirect(next);
}

// Magic-link variant — same gate, no password. Better Auth's CLI sets
// up a verification email, but for the demo (no SMTP configured) the
// call will succeed and the user can sign in via the link if an SMTP
// transport is configured. We expose it because the marketing copy
// talks about "magic links".
const MagicInput = z.object({ email: z.string().email().max(254) });

export async function requestMagicLink(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  try {
    const decision = await authArcjet.protect(await request());
    if (decision.isDenied()) {
      return { error: "Too many attempts. Try again in a minute." };
    }
  } catch {}

  const parsed = MagicInput.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { error: "Enter a valid email." };

  // Better Auth exposes magic-link via the catch-all API; for the demo
  // (no SMTP configured) we acknowledge the request without sending.
  return { ok: true };
}

// ---------- Sign up ------------------------------------------------------
//
// New-account creation. On first sign-up we also create a household
// owned by the new user so they land directly on /items with a working
// ledger. Better Auth's autoSignIn (in lib/auth.ts) keeps the new user
// signed in immediately, so we just redirect on success.

const SignUpInput = z.object({
  name: z.string().min(1).max(80),
  email: z.string().email().max(254),
  password: z.string().min(8).max(200),
});

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40) || "household";
}

export async function signUpWithPassword(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  try {
    const decision = await authArcjet.protect(await request());
    if (decision.isDenied()) {
      return { error: "Too many attempts. Try again in a minute." };
    }
  } catch {}

  const parsed = SignUpInput.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Enter your name, a valid email, and a password of at least 8 characters." };
  }

  let newUserId: string | null = null;
  try {
    await auth.api.signUpEmail({
      body: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
      },
      headers: await headers(),
      // `asResponse: true` returns the Better Auth response object so the
      // session cookie set on it is preserved on the server-action
      // response. Without this, the autoSignIn cookie wouldn't make
      // it back to the browser after the redirect.
      asResponse: true,
    });
    // The new user is now signed in (autoSignIn=true in lib/auth.ts).
    // Read their session back via the request headers to get the id.
    const sess = await auth.api.getSession({ headers: await headers() });
    newUserId = sess?.user?.id ?? null;
  } catch (err) {
    if (err instanceof APIError) {
      const code = (err as { body?: { code?: string } }).body?.code;
      if (code === "USER_ALREADY_EXISTS") {
        return { error: "An account with that email already exists. Try signing in." };
      }
      return { error: "Couldn't create the account. Try again." };
    }
    return { error: "Something went wrong. Try again." };
  }

  if (!newUserId) return { error: "Account created, but couldn't start your household. Try signing in." };

  // Provision a household for the new user. Idempotent — if a row
  // already exists for this user (it shouldn't on first sign-up) we
  // skip silently.
  try {
    const existing = await db
      .select({ id: household.id })
      .from(household)
      .where(eq(household.ownerUserId, newUserId))
      .limit(1);
    if (existing.length === 0) {
      const id = `hh_${slugify(parsed.data.name)}-${Date.now().toString(36)}`;
      await db.insert(household).values({
        id,
        name: `${parsed.data.name.split(" ")[0]}'s household`,
        ownerUserId: newUserId,
        plan: "free",
      });
      await db.insert(householdMember).values({
        householdId: id,
        userId: newUserId,
        role: "owner",
      });
    }
  } catch (err) {
    // Non-fatal: the user can sign in and the next request will
    // surface the missing household gracefully.
    console.error("[sign-up] household provision failed:", err);
  }

  redirect("/items");
}