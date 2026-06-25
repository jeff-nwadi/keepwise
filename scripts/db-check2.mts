import { Pool } from "pg";
import { readFileSync } from "node:fs";
const envLine = readFileSync(".env", "utf8").split("\n").find((l) => l.startsWith("DATABASE_URL="));
const dbUrl = envLine!.replace(/^DATABASE_URL=/, "").replace(/^'/, "").replace(/'$/, "") ?? "";
const pool = new Pool({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });

const r = await pool.query(`SELECT u.id, u.email, u.created_at, u.name FROM "user" u ORDER BY u.created_at DESC LIMIT 5`);
console.log("recent users:");
console.table(r.rows);

const m = await pool.query(`
  SELECT u.email, h.name AS household, hm.role,
         (SELECT count(*) FROM item i WHERE i.household_id = h.id) AS items
  FROM "user" u
  LEFT JOIN household_member hm ON hm.user_id = u.id
  LEFT JOIN household h ON h.id = hm.household_id
  ORDER BY u.created_at DESC LIMIT 5
`);
console.log("household membership for recent users:");
console.table(m.rows);
await pool.end();
