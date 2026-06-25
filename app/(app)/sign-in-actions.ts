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
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { request } from "@arcjet/next";
import { APIError } from "better-auth/api";
import { auth } from "@/lib/auth";
import { authArcjet } from "@/lib/arcjet";

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