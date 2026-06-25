import Link from "next/link";
import { Nav } from "./_components/nav";
import { CTA } from "./_components/cta-button";
import {
  BestBuyReceipt,
  AllbirdsReceipt,
  FrameTVReceipt,
} from "./_components/receipt-card";
import { DashboardMock } from "./_components/dashboard-mock";
import { ExtractionMock } from "./_components/extraction-mock";
import { Reveal } from "./_components/reveal";
import {
  ArrowRight,
  Bell,
  Camera,
  Check,
  Download,
  Quote,
  ScanText,
  Users,
} from "./_components/icons";

// Footer column structure. Each link maps to a real route where one exists;
// the rest stay as `#anchor` for sections that live on this page or that
// are planned for later (status page, API docs, etc.).
const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Pricing", href: "#pricing" },
      { label: "Changelog", href: "/changelog" },
      { label: "Roadmap", href: "#roadmap" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help center", href: "#help" },
      { label: "Status", href: "#status" },
      { label: "API", href: "#api" },
      { label: "Brand", href: "#brand" },
    ],
  },
];

export default function Home() {
  return (
    <>
      <Nav />

      {/* ─── HERO ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 lg:px-10 pt-20 pb-24 lg:pt-28 lg:pb-32 grid lg:grid-cols-12 gap-12 items-center">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow text-amber flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-amber animate-pulse-soft" />
              Receipt &amp; warranty tracker
            </p>
            <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02] text-ink mt-6">
              Receipts that remember so you don&apos;t have to.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-ink-2 leading-relaxed">
              Snap a photo. Keepwise reads the merchant, date, and total,
              figures out when the return window or warranty expires, and
              reminds you before it&apos;s too late to act.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CTA href="/sign-up" variant="primary" withArrow>
                Start tracking free
              </CTA>
              <CTA href="#how-it-works" variant="ghost">
                See how it works
              </CTA>
            </div>
            <p className="mt-6 text-xs text-ink-3 tracking-[0.04em]">
              Free for five items per household · No card required to start
            </p>
          </Reveal>

          {/* Receipt collage — receipt-host triggers .receipt-hero hover float */}
          <div className="lg:col-span-5 relative h-[480px] hidden md:block receipt-host">
            <div className="absolute top-0 left-2 receipt-hero">
              <BestBuyReceipt tilt="left" />
            </div>
            <div className="absolute top-24 right-0 z-10 receipt-hero">
              <AllbirdsReceipt tilt="right" />
            </div>
            <div className="absolute bottom-0 left-12 z-20 receipt-hero">
              <FrameTVReceipt tilt="left" />
            </div>
          </div>
        </div>

        {/* Bottom hairline */}
        <div className="mx-auto max-w-6xl px-6 lg:px-10 border-t border-line" />
      </section>

      {/* ─── TRUST STRIP ────────────────────────────────────────────── */}
      <section className="border-b border-line bg-paper-2/40">
        <Reveal>
          <div className="mx-auto max-w-6xl px-6 lg:px-10 py-6 flex flex-wrap justify-center gap-x-12 gap-y-3 text-[11px] tracking-[0.18em] uppercase text-ink-2">
            <span className="flex items-center gap-2">
              <Check className="size-3.5 text-moss" />
              Encrypted at rest
            </span>
            <span className="hidden md:inline text-ink-3">·</span>
            <span className="flex items-center gap-2">
              <Bell className="size-3.5 text-moss" />
              Email + in-app alerts
            </span>
            <span className="hidden md:inline text-ink-3">·</span>
            <span className="flex items-center gap-2">
              <Users className="size-3.5 text-moss" />
              One household per account
            </span>
            <span className="hidden md:inline text-ink-3">·</span>
            <span className="flex items-center gap-2">
              <Download className="size-3.5 text-moss" />
              CSV export on the paid plan
            </span>
          </div>
        </Reveal>
      </section>

      {/* ─── HOW IT WORKS ───────────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="border-b border-line scroll-mt-24"
      >
        <div className="mx-auto max-w-6xl px-6 lg:px-10 py-24">
          <Reveal>
            <div className="max-w-2xl">
              <p className="eyebrow text-amber">How it works</p>
              <h2 className="font-display text-4xl md:text-5xl text-ink mt-4 leading-[1.05]">
                From a crumpled thermal-paper receipt to a reminder in your inbox
                &mdash; in under ten seconds.
              </h2>
            </div>
          </Reveal>

          <div className="mt-16 grid lg:grid-cols-3 gap-10 lg:gap-8">
            {[
              {
                step: "01",
                title: "Snap",
                icon: Camera,
                body:
                  "Take a photo with your phone or drop a PDF. Camera capture is built in, so there's nothing to install.",
              },
              {
                step: "02",
                title: "Read",
                icon: ScanText,
                body:
                  "The receipt is parsed automatically. Merchant, date, total, and line items land in editable fields, prefilled.",
              },
              {
                step: "03",
                title: "Remind",
                icon: Bell,
                body:
                  "We match the merchant and category against a maintained policy-rules table and schedule an alert 7 and 1 days before the deadline.",
              },
            ].map(({ step, title, body, icon: Icon }, idx) => (
              <Reveal delay={idx * 100} key={step}>
                <div className="relative">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs tracking-[0.18em] text-ink-3 uppercase">
                      Step {step}
                    </span>
                    <span className="flex-1 border-t border-line" />
                  </div>
                  <h3 className="font-display text-3xl text-ink mt-5 flex items-center gap-3">
                    <Icon className="size-6 text-amber" strokeWidth={1.4} />
                    {title}
                  </h3>
                  <p className="mt-4 text-ink-2 leading-relaxed">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Inline extraction mock — the proof of step 2. */}
          <Reveal delay={300}>
            <div className="mt-20">
              <ExtractionMock />
              <p className="mt-4 text-center text-[11px] text-ink-3 tracking-[0.04em]">
                Mock data — real extraction is structured JSON, fields are
                editable before filing, and every line item is checked against a
                maintained policy-rules table.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── DASHBOARD PREVIEW ──────────────────────────────────────── */}
      <section className="bg-paper-2/40 border-b border-line scroll-mt-24" id="alerts">
        <div className="mx-auto max-w-6xl px-6 lg:px-10 py-24">
          <Reveal>
            <div className="max-w-2xl">
              <p className="eyebrow text-amber">What you see</p>
              <h2 className="font-display text-4xl md:text-5xl text-ink mt-4 leading-[1.05]">
                Every deadline in one place, colour-coded by how soon you should
                act.
              </h2>
              <p className="mt-5 text-ink-2 leading-relaxed">
                The dashboard surfaces what needs attention first. Items with
                return windows closing inside seven days pulse amber; covered
                items sit quiet; expired ones don&apos;t disappear, they just move
                to a separate filter so you can revisit them.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-14">
              <DashboardMock />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── WHY IT MATTERS ─────────────────────────────────────────── */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-6 lg:px-10 py-24 grid lg:grid-cols-12 gap-12 items-start">
          <Reveal className="lg:col-span-5 lg:sticky lg:top-28">
            <Quote className="size-8 text-amber" />
            <p className="font-display text-3xl md:text-4xl text-ink leading-[1.15] mt-4">
              The most expensive receipt is the one you find after the warranty
              has already expired.
            </p>
          </Reveal>
          <Reveal delay={100} className="lg:col-span-7 space-y-6 text-ink-2 leading-relaxed">
            <p>
              We&apos;ve all been there: you buy something, the box goes in the
              closet, the receipt ends up in a drawer or never leaves your
              inbox. Three months later the device fails, you reach for proof
              of purchase, and the return window has already closed &mdash; the
              manufacturer&apos;s warranty, too.
            </p>
            <p>
              Keepwise treats that moment as the failure case it is. Every
              deadline gets surfaced in the dashboard; if the policy is
              uncertain we say so explicitly and ask you to add a custom date
              rather than guess. The whole product is built around the idea
              that a wrong reminder is worse than no reminder.
            </p>
            <p>
              Multi-person households share one workspace. If your partner
              files a new receipt, it shows up in your list the moment they
              hit save &mdash; no &ldquo;please forward me the photo&rdquo; chain
              required.
            </p>
            <div className="pt-4 border-t border-line">
              <p className="eyebrow text-ink-3">Built around three rules</p>
              <ul className="mt-4 space-y-3">
                {[
                  "Never silent-best-guess. If the deadline is uncertain, we ask.",
                  "Never overwrite your data. Re-running rules against existing items needs explicit approval.",
                  "Never lock you out. Export every item as CSV anytime.",
                ].map((line) => (
                  <li
                    key={line}
                    className="flex gap-3 text-sm text-ink-2 leading-relaxed"
                  >
                    <Check className="size-4 mt-1 text-amber shrink-0" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── PRICING ────────────────────────────────────────────────── */}
      <section id="pricing" className="scroll-mt-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-10 py-24">
          <Reveal>
            <div className="max-w-2xl">
              <p className="eyebrow text-amber">Pricing</p>
              <h2 className="font-display text-4xl md:text-5xl text-ink mt-4 leading-[1.05]">
                Five items is enough to know if it&apos;s useful. More than that,
                it&apos;s ₹3,500/month.
              </h2>
            </div>
          </Reveal>

          <div className="mt-14 grid md:grid-cols-2 gap-6">
            {/* Free */}
            <Reveal delay={80}>
              <div className="rounded-2xl border border-line bg-white p-8 lg:p-10 flex flex-col h-full">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl text-ink">Free</h3>
                  <span className="rounded-full bg-moss/10 text-moss eyebrow px-3 py-1">
                    Start here
                  </span>
                </div>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-display text-5xl text-ink">$0</span>
                  <span className="text-ink-3 text-sm">/ month</span>
                </div>
                <p className="mt-3 text-sm text-ink-2">
                  Everything you need to know if Keepwise is right for you.
                </p>
                <ul className="mt-8 space-y-3 text-sm text-ink-2 flex-1">
                  {[
                    "Up to 5 tracked items per household",
                    "Email and in-app deadline alerts",
                    "Receipt scanning with editable pre-fill",
                    "Manual deadline entry on any item",
                    "One shared household workspace",
                  ].map((line) => (
                    <li key={line} className="flex gap-3">
                      <Check className="size-4 mt-1 text-moss shrink-0" />
                      {line}
                    </li>
                  ))}
                </ul>
                <div className="mt-10">
                  <CTA href="#get-started" variant="primary" withArrow>
                    Start tracking free
                  </CTA>
                </div>
              </div>
            </Reveal>

            {/* Plus */}
            <Reveal delay={160}>
              <div className="rounded-2xl border-2 border-ink bg-ink text-paper p-8 lg:p-10 flex flex-col relative h-full">
                <span className="absolute -top-3 left-8 eyebrow bg-amber text-ink px-3 py-1 rounded-full">
                  For the over-buyers
                </span>
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl">Keepwise+</h3>
                </div>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="font-display text-5xl">$5</span>
                  <span className="text-paper/60 text-sm">/ month</span>
                </div>
                <p className="mt-3 text-sm text-paper/70">
                  Unlimited items, unlimited household members, export.
                </p>
                <ul className="mt-8 space-y-3 text-sm text-paper/85 flex-1">
                  {[
                    "Unlimited tracked items",
                    "Unlimited household members",
                    "CSV export of every item and deadline",
                    "Configurable alert schedule per item",
                    "Priority extraction queue",
                  ].map((line) => (
                    <li key={line} className="flex gap-3">
                      <Check className="size-4 mt-1 text-amber shrink-0" />
                      {line}
                    </li>
                  ))}
                </ul>
                <div className="mt-10">
                  <CTA
                    href="#upgrade"
                    variant="primary"
                    withArrow
                    className="bg-paper text-ink hover:bg-paper-2"
                  >
                    Upgrade to Keepwise+
                  </CTA>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ──────────────────────────────────────────────── */}
      <section id="get-started" className="border-t border-line bg-paper-2/60">
        <div className="mx-auto max-w-3xl px-6 lg:px-10 py-24 text-center">
          <Reveal>
            <p className="eyebrow text-amber">One last thing</p>
            <h2 className="font-display text-4xl md:text-5xl text-ink mt-4 leading-[1.05]">
              Your next receipt is the one you&apos;ll thank yourself for filing.
            </h2>
            <p className="mt-5 text-ink-2 leading-relaxed max-w-xl mx-auto">
              Open an account, file one receipt, and watch the deadline calendar
              do its job. Five items are free forever.
            </p>
            <div className="mt-8 inline-flex flex-wrap gap-3 justify-center">
              <CTA href="#sign-up" variant="primary" withArrow>
                Create free account
              </CTA>
              <CTA href="#demo" variant="ghost">
                Watch a 60-second demo
              </CTA>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────────────── */}
      <footer className="border-t border-line bg-paper">
        <div className="mx-auto max-w-6xl px-6 lg:px-10 py-14 grid sm:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="font-display text-2xl text-ink tracking-tight"
            >
              Keepwise<span className="text-amber">.</span>
            </Link>
            <p className="mt-4 text-sm text-ink-2 max-w-xs leading-relaxed">
              Receipts that remember so you don&apos;t have to. Built for the
              people who already lose track.
            </p>
          </div>
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="eyebrow text-ink-3">{col.title}</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-ink-2 hover:text-ink transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mx-auto max-w-6xl px-6 lg:px-10 pb-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <p className="text-xs text-ink-3 tracking-[0.04em]">
            © 2026 Keepwise Labs · Lagos &amp; everywhere
          </p>
          <p className="text-xs text-ink-3 tracking-[0.04em] flex items-center gap-2">
            <ArrowRight className="size-3" />
            Backed by people who&apos;ve returned things in the last 30 days
          </p>
        </div>
      </footer>
    </>
  );
}