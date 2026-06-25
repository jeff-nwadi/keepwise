// Terms of service — same editorial reading layout as Privacy. Sections
// are short, plain-language summaries of the legal bits.

import Link from "next/link";
import { Reveal } from "../_components/reveal";

export const metadata = {
  title: "Terms · Keepwise",
  description: "Plain-language terms for using Keepwise.",
};

const SECTIONS = [
  {
    id: "using-keepwise",
    eyebrow: "Section 1",
    title: "Using Keepwise",
    body: [
      "Keepwise is a personal and household service for tracking receipts, warranties, and return windows. By using it, you agree to these terms.",
      "If you're using Keepwise on behalf of an organization (e.g. a small business inventory), additional terms apply — email us.",
    ],
  },
  {
    id: "your-account",
    eyebrow: "Section 2",
    title: "Your account",
    body: [
      "You're responsible for what happens under your account. Use a strong email, don't share your magic link, and tell us if you see something weird at security@keepwise.app.",
      "Household members you invite are bound by these same terms. If one of them deletes the wrong receipt, that's between the two of you.",
    ],
  },
  {
    id: "your-content",
    eyebrow: "Section 3",
    title: "Your content",
    body: [
      "You own the receipts you upload and the data we extract from them. We keep them only to power the product — to infer deadlines, send alerts, and let you search.",
      "We never train third-party AI models on your receipts. If we ever build a first-party model (e.g. to better match policy rules), we'll ask for opt-in first.",
    ],
  },
  {
    id: "acceptable-use",
    eyebrow: "Section 4",
    title: "Acceptable use",
    body: [
      "Don't use Keepwise to track receipts that aren't yours. Don't try to extract our policy database. Don't reverse-engineer the alert engine to spam other users.",
      "Don't upload anything illegal. If we get a valid legal order, we'll comply — and tell you we did, unless we're legally prohibited from doing so.",
    ],
  },
  {
    id: "subscriptions",
    eyebrow: "Section 5",
    title: "Subscriptions",
    body: [
      "Free plan stays free for up to 5 items and 1 household member. No trials, no countdown timers, no auto-upgrade.",
      "Keepwise+ is $4/month or $36/year. Cancel any time from Settings → Billing; the subscription stays active through the end of the period you paid for. No refunds for partial months.",
    ],
  },
  {
    id: "liability",
    eyebrow: "Section 6",
    title: "Liability",
    body: [
      "Keepwise is a tracking tool, not a legal record. We do our best to infer the right deadline from the merchant's published policy, but the merchant's actual policy wins. If a return is denied because Keepwise got the date wrong, we'll credit your account — but we're not liable for the difference.",
      "In plain language: use Keepwise as a heads-up, double-check the merchant's policy before you act.",
    ],
  },
  {
    id: "termination",
    eyebrow: "Section 7",
    title: "Termination",
    body: [
      "You can delete your account at any time from Settings → Profile. Your data is purged within 30 days; backups roll off within 90 days.",
      "We can suspend accounts that violate these terms, but we'll always email first and explain. The only exception is for things that are clearly illegal or actively harmful.",
    ],
  },
  {
    id: "changes",
    eyebrow: "Section 8",
    title: "Changes to these terms",
    body: [
      "Material changes (price, liability, anything that gives us more rights over your data) get 30 days' notice by email.",
      "Editorial changes (clarifications, examples) ship without notice. The \"Last updated\" date at the top is the source of truth.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 lg:px-10 py-14 lg:py-20">
      <Reveal>
        <Link
          href="/"
          className="text-xs text-ink-3 hover:text-ink transition-colors tracking-[0.04em]"
        >
          ← Back home
        </Link>
        <p className="eyebrow text-amber mt-8">Terms</p>
        <h1 className="font-display text-4xl md:text-5xl text-ink mt-2 leading-[1.05]">
          Plain language. No gotchas.
        </h1>
        <p className="text-base text-ink-2 mt-4 max-w-xl leading-relaxed">
          The terms you agree to by using Keepwise. Last updated{" "}
          <span className="text-ink">June 25, 2026</span>.
        </p>
      </Reveal>

      <Reveal delay={80}>
        <nav className="mt-10 rounded-2xl border border-line bg-card p-5">
          <p className="eyebrow text-ink-3">Contents</p>
          <ul className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-ink-2 hover:text-ink transition-colors"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Reveal>

      <div className="mt-12 space-y-12">
        {SECTIONS.map((s, idx) => (
          <Reveal as="section" delay={idx * 40} key={s.id}>
            <a
              id={s.id}
              className="block scroll-mt-24"
              href={`#${s.id}`}
            >
              <p className="eyebrow text-amber">{s.eyebrow}</p>
              <h2 className="font-display text-3xl text-ink mt-2">
                {s.title}
              </h2>
            </a>
            <div className="mt-4 space-y-4">
              {s.body.map((p, i) => (
                <p
                  key={i}
                  className="text-base text-ink-2 leading-relaxed"
                >
                  {p}
                </p>
              ))}
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={320}>
        <div className="mt-16 rounded-2xl border border-line bg-card p-6 md:p-8">
          <p className="eyebrow text-ink-3">Questions</p>
          <p className="font-display text-2xl text-foreground mt-2">
            Need to talk to a human?
          </p>
          <p className="text-sm text-ink-2 mt-3 max-w-md">
            Email{" "}
            <a
              href="mailto:legal@keepwise.app"
              className="underline underline-offset-4 text-ink"
            >
              legal@keepwise.app
            </a>{" "}
            and a real person will respond within two business days.
          </p>
        </div>
      </Reveal>
    </div>
  );
}