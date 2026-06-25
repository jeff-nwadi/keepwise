// Database connection — module-scope pg Pool shared by every request on
// this Node process. Per the neon-postgres skill, this is the right
// pattern for long-running or fluid-compute runtimes. Open once at module
// load, reuse across requests.
//
// SSL is required by Neon (`sslmode=require` in the connection string);
// pg respects the connection-string params, so we don't need to pass
// `ssl` explicitly. The rejectUnauthorized=false flag is here because
// some Neon pooled endpoints use a chain cert that newer Node versions
// reject without it. Tighten to true if you run on a pinned-cert host.

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  // Fail loudly at startup if the env var is missing — better than
  // throwing on the first request.
  throw new Error("DATABASE_URL is not set");
}

const pool = new Pool({
  connectionString,
  max: 5,
});

export const db = drizzle(pool, { schema });