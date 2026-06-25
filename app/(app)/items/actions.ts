// Server actions for receipt CRUD. Every action goes through
// currentHouseholdId() and joins on it in the WHERE clause — a signed-in
// user can never read or write rows that belong to a different
// household (EOP control).
//
// All inputs are validated with zod (TAMPERING control). All actions
// call revalidatePath() for the affected pages so the server component
// re-renders with fresh data.

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, asc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { item, alert } from "@/lib/db/schema";
import { currentHouseholdId } from "@/lib/auth-helpers";

// ---------- snooze --------------------------------------------------------

const SnoozeInput = z.object({
  itemId: z.string().min(1).max(120),
  days: z.number().int().min(1).max(365),
});

export type SnoozeResult = { error?: string; ok?: boolean };

export async function snoozeItem(input: z.infer<typeof SnoozeInput>): Promise<SnoozeResult> {
  const hid = await currentHouseholdId();
  if (!hid) return { error: "Not signed in" };
  const parsed = SnoozeInput.safeParse(input);
  if (!parsed.success) return { error: "Invalid input" };

  const [row] = await db
    .select()
    .from(item)
    .where(and(eq(item.id, parsed.data.itemId), eq(item.householdId, hid)))
    .limit(1);
  if (!row) return { error: "Item not found" };

  const newDeadline = new Date(row.deadline);
  newDeadline.setUTCDate(newDeadline.getUTCDate() + parsed.data.days);
  const newStatus = computeStatusFromDeadline(newDeadline);

  await db
    .update(item)
    .set({ deadline: newDeadline, status: newStatus })
    .where(eq(item.id, row.id));

  revalidatePath(`/items/${row.id}`);
  revalidatePath("/items");
  return { ok: true };
}

// ---------- delete --------------------------------------------------------

const DeleteInput = z.object({ itemId: z.string().min(1).max(120) });

export type DeleteResult =
  | { error?: string; ok?: true; redirect?: string }
  | undefined;

export async function deleteItem(input: z.infer<typeof DeleteInput>): Promise<DeleteResult> {
  const hid = await currentHouseholdId();
  if (!hid) return { error: "Not signed in" };
  const parsed = DeleteInput.safeParse(input);
  if (!parsed.success) return { error: "Invalid input" };

  await db
    .delete(item)
    .where(and(eq(item.id, parsed.data.itemId), eq(item.householdId, hid)));

  revalidatePath("/items");
  return { ok: true, redirect: "/items" };
}

// ---------- add -----------------------------------------------------------

const AddItemInput = z.object({
  merchant: z.string().min(1).max(120),
  itemName: z.string().min(1).max(200),
  total: z.string().min(1).max(40),
  currency: z.enum(["USD", "NGN"]),
  purchaseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  deadlineType: z.enum(["return", "warranty", "custom"]),
  lineItems: z
    .array(
      z.object({
        name: z.string().min(1).max(200),
        price: z.string().min(1).max(40),
      }),
    )
    .max(50),
  policyNote: z.string().max(500).optional().default(""),
});

export type AddResult =
  | { error?: string; ok?: true; id?: string; redirect?: string }
  | undefined;

export async function addItem(
  input: z.infer<typeof AddItemInput>,
): Promise<AddResult> {
  const hid = await currentHouseholdId();
  if (!hid) return { error: "Not signed in" };
  const parsed = AddItemInput.safeParse(input);
  if (!parsed.success) return { error: "Invalid input" };

  const id = slugify(parsed.data.itemName) + "-" + Date.now().toString(36);
  const deadline = new Date(parsed.data.deadline + "T00:00:00Z");
  const purchase = new Date(parsed.data.purchaseDate + "T00:00:00Z");
  const status = computeStatusFromDeadline(deadline);

  await db.insert(item).values({
    id,
    householdId: hid,
    merchant: parsed.data.merchant,
    merchantInitial: parsed.data.merchant.charAt(0).toUpperCase(),
    itemName: parsed.data.itemName,
    category: "Uncategorized",
    total: parsed.data.total,
    currency: parsed.data.currency,
    purchaseDate: purchase,
    deadline,
    deadlineType: parsed.data.deadlineType,
    status,
    confidence: 100,
    receiptVariant: "bestbuy",
    lineItems: parsed.data.lineItems,
    policyNote: parsed.data.policyNote ?? "",
  });

  revalidatePath("/items");
  return { ok: true, id, redirect: `/items/${id}` };
}

// ---------- helpers -------------------------------------------------------

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function computeStatusFromDeadline(d: Date): "soon" | "covered" | "expired" | "active" {
  const days = Math.round((d.getTime() - Date.now()) / 86_400_000);
  if (days < 0) return "expired";
  if (days <= 14) return "soon";
  if (days <= 90) return "covered";
  return "active";
}