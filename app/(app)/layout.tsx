// (app) route group layout.
//
// Single source of truth for the signed-in identity. Calls
// currentIdentity() once, then passes the result to AppShell.
//
// The proxy at proxy.ts has already redirected truly anonymous requests
// (no cookie) to /sign-in. If we land here with a cookie but
// currentIdentity() returns no user, the cookie is stale (server-side
// session was revoked or expired) — redirect to /sign-in. Better Auth
// will overwrite the stale cookie when the user signs in fresh.
//
// The shell itself stays a server component — it never needs to react
// to client state. Sign-out lives in a tiny client island in the
// avatar dropdown menu.

import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { AppShell } from "../_components/app-shell";
import { currentIdentity } from "@/lib/auth-helpers";
import { auth } from "@/lib/auth";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const identity = await currentIdentity();

  // Stale cookie: proxy let us through because the cookie shape was
  // valid, but Better Auth's getSession returned nothing. Sign the
  // stale session out server-side (clears the cookie on the response)
  // and redirect to /sign-in.
  if (!identity.userId) {
    try {
      await auth.api.signOut({ headers: await headers() });
    } catch {
      // Best effort. Redirect either way.
    }
    redirect("/sign-in?next=%2Fitems");
  }

  return (
    <AppShell
      identity={{
        initials: identity.initials,
        name: identity.name,
        email: identity.email,
        unreadCount: identity.unreadCount,
      }}
    >
      {children}
    </AppShell>
  );
}
