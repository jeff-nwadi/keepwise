// (app) route group layout.
//
// Fetches the caller's session, household membership, and queued-alert
// count on the server, then passes them to the shared AppShell. The
// proxy at proxy.ts has already redirected unauthenticated requests to
// /sign-in, so by the time this layout runs there is a valid session.
//
// The shell itself stays a server component — it never needs to react
// to client state. Sign-out lives in a tiny client island below.

import type { ReactNode } from "react";
import { eq, and, count } from "drizzle-orm";
import { AppShell } from "../_components/app-shell";
import { currentSession } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { alert, item, householdMember } from "@/lib/db/schema";

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "··";
  if (parts.length === 1) return (parts[0]![0] ?? "·").toUpperCase();
  return ((parts[0]![0] ?? "") + (parts[parts.length - 1]![0] ?? "")).toUpperCase();
}

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await currentSession();
  let identity = {
    initials: "··",
    name: "",
    email: "",
    unreadCount: 0,
  };

  if (user) {
    identity = {
      initials: initialsOf(user.name),
      name: user.name,
      email: user.email,
      unreadCount: 0,
    };

    const [m] = await db
      .select({ hid: householdMember.householdId })
      .from(householdMember)
      .where(eq(householdMember.userId, user.id))
      .limit(1);

    if (m) {
      const rows = await db
        .select({ n: count() })
        .from(alert)
        .innerJoin(item, eq(alert.itemId, item.id))
        .where(and(eq(item.householdId, m.hid), eq(alert.status, "queued")));
      identity.unreadCount = Number(rows[0]?.n ?? 0);
    }
  }

  return <AppShell identity={identity}>{children}</AppShell>;
}