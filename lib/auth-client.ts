// Better Auth React client. Used by client components for sign-in,
// sign-out, and session reads via useSession().
//
// Note: baseURL must be a public env var (NEXT_PUBLIC_*) because client
// code can't see server-only envs. We default to the same value the
// server uses, so a misconfigured public var is the only failure mode.

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL:
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ??
    process.env.BETTER_AUTH_URL ??
    "http://localhost:3000",
});