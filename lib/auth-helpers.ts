// Shared auth helpers. Centralises the "who is the caller, and which
// household do they belong to" lookup so the same query is not repeated
// in every server component and server action.
//
// Used by:
//   - app/_data/items.ts (listItems / getItem / listAlerts)
//   - app/(app)/items/actions.ts (snooze / delete / add)
//   - app/(app)/items/[id]/page.tsx (getItem)
//   - app/(app)/layout.tsx (identity + unread count)
//   - app/(app)/settings/page.tsx (identity)
//
// The EOP control lives here: every code path that reads a keepwise
// domain row goes through currentHouseholdId() and uses it as a filter.
// A user authenticated as member of household A can never read rows
// belonging to household B.
//
// `currentIdentity()` is the convenience wrapper for pages that need
// the full signed-in shape (avatar initials, household name, plan,
// unread count). It runs two queries — one to resolve the household,
// one for the unread count — but both are indexed lookups, and the
// result covers the entire `(app)/...` layout subtree.

import "server-only";
import { headers } from "next/headers";
import { and, count, eq } from "drizzle-orm";
import { auth } from "./auth";
import { db } from "./db";
import { alert, household, householdMember, item } from "./db/schema";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
};

export type Identity = {
  userId: string;
  initials: string;
  name: string;
  email: string;
  householdId: string | null;
  householdName: string | null;
  role: "owner" | "member" | null;
  plan: "free" | "plus" | null;
  unreadCount: number;
};

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "··";
  if (parts.length === 1) return (parts[0]![0] ?? "·").toUpperCase();
  return ((parts[0]![0] ?? "") + (parts[parts.length - 1]![0] ?? "")).toUpperCase();
}

export async function currentSession(): Promise<SessionUser | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;
  return {
    id: session.user.id,
    name: session.user.name ?? "",
    email: session.user.email ?? "",
  };
}

export async function currentHouseholdId(): Promise<string | null> {
  const user = await currentSession();
  if (!user) return null;
  const [m] = await db
    .select({ householdId: householdMember.householdId })
    .from(householdMember)
    .where(eq(householdMember.userId, user.id))
    .limit(1);
  return m?.householdId ?? null;
}

// Full signed-in shape, used by the (app) layout, settings page, and
// anything else that needs to render "who is this person and what
// household do they belong to". Returns a safe default when the caller
// is unauthenticated — callers that require auth are already behind
// proxy.ts, but the default makes this safe to call anywhere.
export async function currentIdentity(): Promise<Identity> {
  const fallback: Identity = {
    userId: "",
    initials: "··",
    name: "",
    email: "",
    householdId: null,
    householdName: null,
    role: null,
    plan: null,
    unreadCount: 0,
  };

  const user = await currentSession();
  if (!user) return fallback;

  const [row] = await db
    .select({
      householdId: householdMember.householdId,
      role: householdMember.role,
      householdName: household.name,
      plan: household.plan,
    })
    .from(householdMember)
    .innerJoin(household, eq(household.id, householdMember.householdId))
    .where(eq(householdMember.userId, user.id))
    .limit(1);

  let unreadCount = 0;
  if (row) {
    const counts = await db
      .select({ n: count() })
      .from(alert)
      .innerJoin(item, eq(alert.itemId, item.id))
      .where(and(eq(item.householdId, row.householdId), eq(alert.status, "queued")));
    unreadCount = Number(counts[0]?.n ?? 0);
  }

  return {
    userId: user.id,
    initials: initialsOf(user.name),
    name: user.name,
    email: user.email,
    householdId: row?.householdId ?? null,
    householdName: row?.householdName ?? null,
    role: row?.role ?? null,
    plan: row?.plan ?? null,
    unreadCount,
  };
}
