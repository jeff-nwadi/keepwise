// Better Auth server configuration. The Drizzle adapter reuses the pg
// pool from lib/db — one connection per request rather than a separate
// pool, which keeps resource use low.
//
// Session config follows the better-auth-best-practices skill defaults:
// 7-day expiry, refresh-once-per-day, 5-minute cookie cache to skip the
// DB lookup on the hot path. The cookie cache is safe because the
// user's session list doesn't change between requests most of the time
// — Better Auth's gotcha #4 explicitly notes that custom session fields
// are NOT cached, only the basic user/session info.
//
// `trustedOrigins` is the CSRF allowlist — keep in sync with the
// BETTER_AUTH_URL env var.

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./db/schema";

const baseURL = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

export const auth = betterAuth({
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7d
    updateAge: 60 * 60 * 24, // refresh once per day
    cookieCache: { enabled: true, maxAge: 60 * 5 },
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    defaultCookieAttributes: {
      sameSite: "lax",
      httpOnly: true,
    },
  },
  // CSRF allowlist. Includes the configured baseURL plus the localhost /
  // 127.0.0.1 variants on common dev ports so probes and the manual QA
  // server both succeed without an env-var swap.
  trustedOrigins: [
    baseURL,
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
  ],
});

export type Auth = typeof auth;