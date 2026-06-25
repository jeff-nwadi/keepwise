// Changelog — public editorial timeline of releases. Rendered with the
// marketing nav (no AppShell). Each entry is a release card with eyebrow
// (date + version), H3, and a bullet list.

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "../_components/reveal";
import { Check, Calendar } from "../_components/icons";
import { SubscribeForm } from "./_subscribe";

const RELEASES = [
  {
    version: "v0.3",
    date: "June 2026",
    title: "Receipt upload + extraction",
    summary:
      "Snap a receipt or upload a PDF — Keepwise reads merchant, date, total, and line items, then matches the merchant against the policy library.",
    bullets: [
      "Camera capture on mobile, gallery or PDF on desktop",
      "OCR with field-level confidence percentages",
      "Custom deadline fallback when no policy rule matches",
      "Re-run extraction if the first pass looks off",
    ],
  },
  {
    version: "v0.2",
    date: "May 2026",
    title: "Household sharing",
    summary:
      "Share one receipt ledger across the people in your home. Everyone sees the same deadlines; alerts can route to one inbox or many.",
    bullets: [
      "Invite by email, no second login to manage",
      "Per-member notification preferences",
      "Activity log: who filed what, who snoozed what",
      "Free plan capped at 1 member; Keepwise+ covers up to 5",
    ],
  },
  {
    version: "v0.1",
    date: "April 2026",
    title: "Manual deadline tracking",
    summary:
      "The first version — paste a date, pick a category, and we'll bug you before it closes. No camera yet, no extraction, just the core loop.",
    bullets: [
      "Manual item entry with merchant + deadline",
      "Email alerts 7 days and 1 day before close",
      "In-app queue with snooze",
      "Three policy presets: return window, warranty, custom",
    ],
  },
];

export const metadata = {
  title: "Changelog · Keepwise",
  description: "Every release, every fix, no marketing-speak.",
};

export default function ChangelogPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 lg:px-10 py-14 lg:py-20">
      <Reveal>
        <Link
          href="/"
          className="text-xs text-ink-3 hover:text-ink transition-colors tracking-[0.04em]"
        >
          ← Back home
        </Link>
        <p className="eyebrow text-amber mt-8">Changelog</p>
        <h1 className="font-display text-4xl md:text-5xl text-ink mt-2 leading-[1.05]">
          Every release, every fix.
        </h1>
        <p className="text-base text-ink-2 mt-4 max-w-xl leading-relaxed">
          No marketing-speak. If something shipped, it&apos;s here. If it
          didn&apos;t, the issue tracker does.
        </p>
      </Reveal>

      {/* Subscribe inline */}
      <Reveal delay={80}>
        <Card className="mt-10 border-line bg-card">
          <CardContent className="p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-display text-xl text-foreground">Get updates by email</p>
              <p className="text-sm text-muted-foreground mt-1">
                Roughly monthly. No product news, no nudges.
              </p>
            </div>
            <SubscribeForm />
          </CardContent>
        </Card>
      </Reveal>

      {/* Release timeline */}
      <ol className="mt-12 relative space-y-8">
        <span
          className="absolute left-[1.4rem] top-3 bottom-3 w-px bg-border hidden sm:block"
          aria-hidden="true"
        />
        {RELEASES.map((r, idx) => (
          <Reveal as="li" delay={idx * 80} key={r.version}>
            <article className="relative sm:pl-16">
              <span
                className="absolute left-2.5 top-2 size-4 rounded-full bg-ink border-4 border-paper hidden sm:block"
                aria-hidden="true"
              />
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="rounded-full bg-muted text-muted-foreground font-mono">
                  {r.version}
                </Badge>
                <span className="text-xs text-ink-3 flex items-center gap-1.5">
                  <Calendar size={11} />
                  {r.date}
                </span>
              </div>
              <Card className="border-line bg-card">
                <CardContent className="p-6 md:p-8">
                  <h2 className="font-display text-2xl md:text-3xl text-ink">
                    {r.title}
                  </h2>
                  <p className="text-sm text-ink-2 mt-3 leading-relaxed">
                    {r.summary}
                  </p>
                  <ul className="mt-5 space-y-2">
                    {r.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-3 text-sm text-foreground"
                      >
                        <span className="mt-0.5 size-4 rounded-full bg-moss/15 text-moss inline-flex items-center justify-center shrink-0">
                          <Check size={10} />
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </article>
          </Reveal>
        ))}
      </ol>

      <Reveal delay={300}>
        <p className="mt-16 text-sm text-ink-2 text-center">
          Looking for older history? See the{" "}
          <Link href="#" className="underline underline-offset-4 hover:text-ink">
            public roadmap
          </Link>{" "}
          for what&apos;s planned next.
        </p>
      </Reveal>
    </div>
  );
}