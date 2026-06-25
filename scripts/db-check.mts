import { Pool } from "pg";
import { readFileSync } from "node:fs";
const envFile = readFileSync(".env", "utf8");
const envLine = envFile.split("\n").find((l) => l.startsWith("DATABASE_URL="));
const dbUrl = envLine?.replace(/^DATABASE_URL=/, "").replace(/^'/, "").replace(/'$/, "") ?? "";
const pool = new Pool({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });

const membership = await pool.query(`
  SELECT u.id AS user_id, u.email, hm.household_id, h.name AS household_name,
         (SELECT count(*) FROM item i WHERE i.household_id = hm.household_id) AS item_count
  FROM "user" u
  LEFT JOIN household_member hm ON hm.user_id = u.id
  LEFT JOIN household h ON h.id = hm.household_id
  WHERE u.email = 'bola@example.com'
`);
console.log("membership:");
console.table(membership.rows);

const items = await pool.query(`
  SELECT i.id, i.item_name, i.merchant, i.status, i.deadline
  FROM item i
  JOIN household_member hm ON hm.household_id = i.household_id
  JOIN "user" u ON u.id = hm.user_id
  WHERE u.email = 'bola@example.com'
  ORDER BY i.deadline
`);
console.log("items:");
console.table(items.rows);

await pool.end();