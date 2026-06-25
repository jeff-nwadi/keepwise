// Shared auth helpers. Centralises the "who is the caller, and which
// household do they belong to" lookup so the same query is not repeated
// in every server component and server action.
//
// Used by:
//   - app/_data/items.ts (listItems / getItem / listAlerts)
//   - app/(app)/items/actions.ts (snooze / delete / add)
//   - app/(app)/items/[id]/page.tsx (getItem)
//   - app/(app)/layout.tsx (identity + unread count)
//
// The EOP control lives here: every code path that reads a keepwise
// domain row goes through currentHouseholdId() and uses it as a filter.
// A user authenticated as member of household A can never read rows
// belonging to household B.

import "server-only";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { auth } from "./auth";
import { db } from "./db";
import { householdMember } from "./db/schema";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
};

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