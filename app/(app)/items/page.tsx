// Items dashboard page.
//
// Server component: fetches the caller's items from the DB (already
// filtered by householdId inside listItems) and the signed-in identity
// (for the household name eyebrow). The list, the queued-alert
// dropdown, and the side cards all render from this fetched data.
//
// Search/filter state lives in the client component below — the server
// fetches the raw list, the client filters it in-memory.

import { Reveal } from "../../_components/reveal";
import { ItemsList } from "./_list";
import { listItems } from "../../_data/items";
import { currentIdentity } from "@/lib/auth-helpers";

export const dynamic = "force-dynamic";

export default async function ItemsPage() {
  const items = await listItems();
  const identity = await currentIdentity();
  const soonCount = items.filter((i) => i.status === "soon").length;
  const householdLabel = identity.householdName ?? "Your household";
  return (
    <div className="mx-auto max-w-6xl px-6 lg:px-10 py-10 lg:py-14">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-amber">{householdLabel}</p>
            <h1 className="font-display text-4xl md:text-5xl text-ink mt-2 leading-[1.05]">
              {items.length} items · {soonCount} deadline this week
            </h1>
            <p className="text-sm text-ink-2 mt-2">
              Keepwise · {identity.plan === "plus" ? "Plus" : "Free"} plan ·{" "}
              {items.length} of {identity.plan === "plus" ? "∞" : 5} items used
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <ItemsList initialItems={items} />
      </Reveal>
    </div>
  );
}
