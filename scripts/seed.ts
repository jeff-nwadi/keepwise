// Seed script — creates one demo user (Bola Adesanmi), one household,
// and the same 6 items + alert entries that the in-memory mock used,
// now persisted in Postgres. Run with `npx tsx scripts/seed.ts`.
//
// Idempotent: re-running this won't double-seed. We check for the user
// by email first and exit early if it exists.

import "dotenv/config";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { auth } from "../lib/auth";
import * as schema from "../lib/db/schema";

const DEMO_EMAIL = "bola@example.com";
const DEMO_PASSWORD = "keepwise-demo";
const DEMO_NAME = "Bola Adesanmi";
const HOUSEHOLD_NAME = "Our apartment";

const ITEMS: Array<{
  id: string;
  merchant: string;
  itemName: string;
  category: string;
  total: string;
  currency: "USD" | "NGN";
  purchaseOffset: number;
  deadlineOffset: number;
  deadlineType: "return" | "warranty" | "custom";
  status: "soon" | "covered" | "expired" | "active";
  confidence: number;
  receiptVariant:
    | "bestbuy"
    | "allbirds"
    | "frametv"
    | "williams"
    | "amazon"
    | "apple";
  lineItems: Array<{ name: string; price: string }>;
  policyNote: string;
}> = [
  {
    id: "sony-wh1000xm5",
    merchant: "Best Buy",
    itemName: "Sony WH-1000XM5",
    category: "Electronics › Audio",
    total: "₦863,500",
    currency: "NGN",
    purchaseOffset: -9,
    deadlineOffset: 6,
    deadlineType: "return",
    status: "soon",
    confidence: 98,
    receiptVariant: "bestbuy",
    lineItems: [
      { name: "Sony WH-1000XM5", price: "₦845,000" },
      { name: "USB-C cable", price: "₦18,500" },
    ],
    policyNote: "15-day electronics return policy · Best Buy",
  },
  {
    id: "allbirds-tree-runner",
    merchant: "Allbirds",
    itemName: "Tree Runner (×2)",
    category: "Apparel › Footwear",
    total: "$220",
    currency: "USD",
    purchaseOffset: -30,
    deadlineOffset: 335,
    deadlineType: "warranty",
    status: "covered",
    confidence: 94,
    receiptVariant: "allbirds",
    lineItems: [
      { name: "Tree Runner 10", price: "$110" },
      { name: "Tree Runner 9.5", price: "$110" },
    ],
    policyNote: "12-month manufacturer warranty · Allbirds footwear",
  },
  {
    id: "frame-tv-65",
    merchant: "Frame TV Co.",
    itemName: '65" The Frame + 5yr plan',
    category: "Electronics › Display",
    total: "$2,077",
    currency: "USD",
    purchaseOffset: -167,
    deadlineOffset: 1658,
    deadlineType: "warranty",
    status: "active",
    confidence: 96,
    receiptVariant: "frametv",
    lineItems: [
      { name: '65" The Frame', price: "$1,799" },
      { name: "No-gap mount", price: "$79" },
      { name: "Extended 5yr", price: "$199" },
    ],
    policyNote: "5-year extended warranty · Frame TV Co.",
  },
  {
    id: "le-creuset-dutch-oven",
    merchant: "Williams Sonoma",
    itemName: "Le Creuset Dutch oven",
    category: "Home › Cookware",
    total: "$449",
    currency: "USD",
    purchaseOffset: -22,
    deadlineOffset: -7,
    deadlineType: "return",
    status: "expired",
    confidence: 91,
    receiptVariant: "williams",
    lineItems: [
      { name: "Le Creuset 5.5qt", price: "$420" },
      { name: "Lid knob", price: "$29" },
    ],
    policyNote: "30-day return window · Williams Sonoma",
  },
  {
    id: "amazon-echo-dot",
    merchant: "Amazon",
    itemName: "Echo Dot (5th gen)",
    category: "Electronics › Smart home",
    total: "$49",
    currency: "USD",
    purchaseOffset: -3,
    deadlineOffset: 27,
    deadlineType: "return",
    status: "covered",
    confidence: 99,
    receiptVariant: "amazon",
    lineItems: [{ name: "Echo Dot (5th gen)", price: "$49" }],
    policyNote: "30-day return policy · Amazon",
  },
  {
    id: "apple-airpods-pro",
    merchant: "Apple",
    itemName: "AirPods Pro 2",
    category: "Electronics › Audio",
    total: "$249",
    currency: "USD",
    purchaseOffset: -12,
    deadlineOffset: 353,
    deadlineType: "warranty",
    status: "covered",
    confidence: 97,
    receiptVariant: "apple",
    lineItems: [{ name: "AirPods Pro 2", price: "$249" }],
    policyNote: "1-year manufacturer warranty · Apple",
  },
];

const ALERTS: Array<{
  itemId: string;
  offset: number;
  channel: "email" | "in-app";
  subject: string;
  status: "delivered" | "queued" | "opened";
}> = [
  { itemId: "sony-wh1000xm5", offset: -3, channel: "email", subject: "Return window for Sony WH-1000XM5 closes in 9 days", status: "delivered" },
  { itemId: "sony-wh1000xm5", offset: 0, channel: "in-app", subject: "Return window for Sony WH-1000XM5 closes in 6 days", status: "queued" },
  { itemId: "allbirds-tree-runner", offset: -1, channel: "email", subject: "Allbirds warranty summary", status: "opened" },
  { itemId: "le-creuset-dutch-oven", offset: -14, channel: "email", subject: "Le Creuset return window closes in 16 days", status: "opened" },
  { itemId: "le-creuset-dutch-oven", offset: -8, channel: "email", subject: "Le Creuset return window closes tomorrow", status: "opened" },
  { itemId: "le-creuset-dutch-oven", offset: -7, channel: "in-app", subject: "Le Creuset return window has closed", status: "delivered" },
];

function addDays(base: Date, n: number): Date {
  const d = new Date(base);
  d.setUTCDate(d.getUTCDate() + n);
  return d;
}

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 2,
  });
  const db = drizzle(pool, { schema });

  // 1. Sign up the demo user via Better Auth (so the password is hashed
  //    the same way the live app would hash it).
  let userId: string;
  try {
    const res = await auth.api.signUpEmail({
      body: { email: DEMO_EMAIL, password: DEMO_PASSWORD, name: DEMO_NAME },
    });
    if (!res?.user?.id) throw new Error("signUp returned no user");
    userId = res.user.id;
    console.log(`✓ Created user ${DEMO_EMAIL} (id=${userId})`);
  } catch (err: any) {
    // Better Auth throws USER_ALREADY_EXISTS for duplicates. Look up the
    // existing user and reuse the id.
    const [existing] = await db
      .select({ id: schema.user.id })
      .from(schema.user)
      .where(eq(schema.user.email, DEMO_EMAIL))
      .limit(1);
    if (!existing) throw err;
    userId = existing.id;
    console.log(`↺ User ${DEMO_EMAIL} already exists (id=${userId})`);
  }

  // 2. Check for an existing household owned by this user.
  const [existingH] = await db
    .select({ id: schema.household.id })
    .from(schema.household)
    .where(eq(schema.household.ownerUserId, userId))
    .limit(1);

  let householdId: string;
  if (existingH) {
    householdId = existingH.id;
    console.log(`↺ Household already exists (id=${householdId})`);
  } else {
    householdId = `hh_${Date.now().toString(36)}`;
    await db.insert(schema.household).values({
      id: householdId,
      name: HOUSEHOLD_NAME,
      ownerUserId: userId,
      plan: "free",
    });
    console.log(`✓ Created household (id=${householdId})`);
  }

  // 3. Membership row.
  await db
    .insert(schema.householdMember)
    .values({ householdId, userId, role: "owner" })
    .onConflictDoNothing();

  // 4. Items.
  const today = new Date();
  for (const it of ITEMS) {
    const purchase = addDays(today, it.purchaseOffset);
    const deadline = addDays(today, it.deadlineOffset);
    await db
      .insert(schema.item)
      .values({
        id: it.id,
        householdId,
        merchant: it.merchant,
        merchantInitial: it.merchant.charAt(0).toUpperCase(),
        itemName: it.itemName,
        category: it.category,
        total: it.total,
        currency: it.currency,
        purchaseDate: purchase,
        deadline,
        deadlineType: it.deadlineType,
        status: it.status,
        confidence: it.confidence,
        receiptVariant: it.receiptVariant,
        lineItems: it.lineItems,
        policyNote: it.policyNote,
      })
      .onConflictDoNothing();
  }
  console.log(`✓ Seeded ${ITEMS.length} items`);

  // 5. Alerts.
  let alertsInserted = 0;
  for (const a of ALERTS) {
    const scheduled = addDays(today, a.offset);
    await db
      .insert(schema.alert)
      .values({
        id: `al_${a.itemId}_${a.offset}_${a.channel}`.replace(/[^a-z0-9_]/g, "_"),
        itemId: a.itemId,
        scheduledFor: scheduled,
        channel: a.channel,
        subject: a.subject,
        status: a.status,
      })
      .onConflictDoNothing();
    alertsInserted++;
  }
  console.log(`✓ Seeded ${alertsInserted} alerts`);

  await pool.end();
  console.log(`\nDemo credentials:`);
  console.log(`  email:    ${DEMO_EMAIL}`);
  console.log(`  password: ${DEMO_PASSWORD}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});