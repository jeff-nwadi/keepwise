// Arcjet rules for the auth surface.
//
// In production (LIVE) these block bad traffic. In dev (DRY_RUN) they
// still log decisions but never block — so we don't lock ourselves out
// while iterating. Flip to LIVE in deploy.
//
//   shield        — protects against common attacks (SQLi, XSS, etc.)
//   detectBot     — blocks automated clients on auth endpoints
//   slidingWindow — rate-limit: max 10 requests / minute per IP
//
// This is the DoS / SPOOFING control from the security-requirement
// traceability matrix. The plan calls for 10/min, matching common
// sign-in rate limits.

import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/next";

const isProd = process.env.NODE_ENV === "production";

export const authArcjet = arcjet({
  key: process.env.ARCJET_KEY ?? "",
  rules: [
    shield({ mode: isProd ? "LIVE" : "DRY_RUN" }),
    detectBot({ mode: isProd ? "LIVE" : "DRY_RUN", allow: [] }),
    slidingWindow({ mode: isProd ? "LIVE" : "DRY_RUN", interval: "1m", max: 10 }),
  ],
});