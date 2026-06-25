// Better Auth catch-all route — exposes the auth API at /api/auth/*.
// Every endpoint Better Auth serves (sign-in, sign-out, session, OAuth
// callback, magic-link verification, etc.) goes through this one file.

import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);