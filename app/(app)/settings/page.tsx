// Settings page — server component shell that fetches the household's
// items and the signed-in identity, then hands them to the client tabs
// island. The tabs component owns all of the interactive state (channel
// toggles, radio selection, etc.) but the data is server-rendered.

import { Reveal } from "../../_components/reveal";
import { listItems, type Item } from "../../_data/items";
import { currentIdentity } from "@/lib/auth-helpers";
import { SettingsTabs } from "./_tabs";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const items: Item[] = await listItems();
  const identity = await currentIdentity();
  return (
    <div className="mx-auto max-w-5xl px-6 lg:px-10 py-10 lg:py-14">
      <Reveal>
        <p className="eyebrow text-ink-3">Household settings</p>
        <h1 className="font-display text-4xl md:text-5xl text-ink mt-2 leading-[1.05]">
          Keep Keepwise the way you want it
        </h1>
        <p className="text-sm text-ink-2 mt-3 max-w-xl">
          Household, alerts, and billing. Free plan is 5 items and 1 member —
          upgrade to share with a partner and track more.
        </p>
      </Reveal>

      <Reveal delay={80}>
        <SettingsTabs items={items} identity={identity} />
      </Reveal>
    </div>
  );
}
