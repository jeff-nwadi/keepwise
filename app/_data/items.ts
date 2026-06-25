// Item data layer — DB-backed. The TypeScript types and pure formatters
// live in `./item-helpers.ts` (client-safe); this module re-exports them
// and adds the server-only read functions.
//
// What changed from the in-memory mock:
//   - `ITEMS` (sync array export) is gone. Callers use `listItems()`.
//   - `getItem(id)` is async and returns `Item | null` (was `Item | undefined`).
//   - Reads always filter by the caller's householdId — a signed-in user
//     can never read another household's receipts.

import "server-only";
import { db } from "@/lib/db";
import { item, alert } from "@/lib/db/schema";
import { and, asc, desc, eq } from "drizzle-orm";
import { currentHouseholdId } from "@/lib/auth-helpers";
import {
  formatDeadlineDate,
  daysUntil,
  statusLabel,
  type AlertEntry,
  type Item,
} from "./item-helpers";

// Re-export the public surface used by every existing server-side call
// site. Importing from "@/app/_data/items" keeps working.
export { formatDeadlineDate, daysUntil, statusLabel };
export type { AlertEntry, Item };

// ---------- DB row → Item ------------------------------------------------

type ItemRow = typeof item.$inferSelect;
type AlertRow = typeof alert.$inferSelect;

function isoDate(d: Date | string): string {
  const dt = typeof d === "string" ? new Date(d) : d;
  return dt.toISOString().slice(0, 10);
}

function rowToItem(row: ItemRow, alerts: AlertRow[]): Item {
  return {
    id: row.id,
    merchant: row.merchant,
    merchantInitial: row.merchantInitial,
    itemName: row.itemName,
    category: row.category,
    total: row.total,
    currency: row.currency,
    purchaseDate: isoDate(row.purchaseDate),
    deadline: isoDate(row.deadline),
    deadlineType: row.deadlineType,
    status: row.status,
    confidence: row.confidence,
    receiptVariant: row.receiptVariant,
    lineItems: row.lineItems,
    policyNote: row.policyNote,
    alerts: alerts.map((a) => ({
      id: a.id,
      date: isoDate(a.scheduledFor),
      channel: a.channel,
      subject: a.subject,
      status: a.status,
    })),
  };
}

// ---------- Reads (DB-backed, household-scoped) --------------------------

export async function listItems(): Promise<Item[]> {
  const hid = await currentHouseholdId();
  if (!hid) return [];
  const rows = await db
    .select()
    .from(item)
    .where(eq(item.householdId, hid))
    .orderBy(asc(item.deadline));
  if (rows.length === 0) return [];
  // Pull alerts per item in parallel (small N, no need for inArray).
  const grouped = await Promise.all(
    rows.map(async (r) => {
      const a = await db
        .select()
        .from(alert)
        .where(eq(alert.itemId, r.id))
        .orderBy(desc(alert.scheduledFor));
      return [r.id, a] as const;
    }),
  );
  const byItem = new Map(grouped);
  return rows.map((r) => rowToItem(r, byItem.get(r.id) ?? []));
}

export async function getItem(id: string): Promise<Item | null> {
  const hid = await currentHouseholdId();
  if (!hid) return null;
  const [row] = await db
    .select()
    .from(item)
    .where(and(eq(item.id, id), eq(item.householdId, hid)))
    .limit(1);
  if (!row) return null;
  const a = await db
    .select()
    .from(alert)
    .where(eq(alert.itemId, id))
    .orderBy(desc(alert.scheduledFor));
  return rowToItem(row, a);
}