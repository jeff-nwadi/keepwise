// Privacy policy — single-column editorial reading layout, hand-styled
// (no @tailwindcss/typography to avoid another dep). Sections each have an
// eyebrow, an H3, and prose paragraphs.

import Link from "next/link";
import { Reveal } from "../_components/reveal";

export const metadata = {
  title: "Privacy · Keepwise",
  description: "What we collect, what we don't, and how to delete it.",
};

const SECTIONS = [
  {
    id: "what-we-collect",
    eyebrow: "Section 1",
    title: "What we collect",
    body: [
      "We collect the receipts you upload (images, PDFs), the structured fields we extract from them (merchant, date, total, line items), and the deadline we infer from the merchant's policy rules.",
      "We also keep basic account information: the email you sign up with, your timezone, and your alert preferences. We do not collect your name, address, phone number, or payment card numbers unless you give them to us explicitly.",
    ],
  },
  {
    id: "what-we-dont",
    eyebrow: "Section 2",
    title: "What we don't do",
    body: [
      "We don't sell your data. We don't share it with advertisers. We don't train third-party AI models on your receipts.",
      "We don't track you across the web. There's no advertising pixel, no retargeting, no third-party analytics that follows you off our site.",
    ],
  },
  {
    id: "how-we-use-it",
    eyebrow: "Section 3",
    title: "How we use it",
    body: [
      "Receipts power the product: extracting fields, inferring deadlines, scheduling alerts. Account information lets us send those alerts and recognize you when you come back.",
      "Aggregate, non-personal usage data (e.g. \"42% of items filed this month were returnable\") may appear in product updates. This is never linked to your account.",
    ],
  },
  {
    id: "who-can-see-it",
    eyebrow: "Section 4",
    title: "Who can see it",
    body: [
      "You. Members of your household, if you've invited them. Our infrastructure providers (e.g. file storage, email delivery), bound by contract to use the data only to provide the service to us.",
      "Nobody else. Not law enforcement without a valid subpoena, not acquirers in a hypothetical sale — though if Keepwise is ever acquired, this policy stays in force until you accept a new one.",
    ],
  },
  {
    id: "your-data",
    eyebrow: "Section 5",
    title: "Your data, your call",
    body: [
      "Export everything as CSV or JSON from Settings → Billing → Export. Delete your account from Settings → Profile → Delete account; we'll purge your data within 30 days.",
      "If you only want to delete a single receipt, open it and click Delete. The item, its extraction, and its alert history are gone immediately. No recovery.",
    ],
  },
  {
    id: "changes",
    eyebrow: "Section 6",
    title: "Changes to this policy",
    body: [
      "If we change something material — what we collect, who we share it with, how long we keep it — we'll email every account on file at least 30 days before the change takes effect.",
      "Editorial changes (typos, clarifications, examples) go out without notice. The \"Last updated\" date at the top of this page reflects the most recent material change.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 lg:px-10 py-14 lg:py-20">
      <Reveal>
        <Link
          href="/"
          className="text-xs text-ink-3 hover:text-ink transition-colors tracking-[0.04em]"
        >
          ← Back home
        </Link>
        <p className="eyebrow text-amber mt-8">Privacy</p>
        <h1 className="font-display text-4xl md:text-5xl text-ink mt-2 leading-[1.05]">
          Treat your receipts like bank statements.
        </h1>
        <p className="text-base text-ink-2 mt-4 max-w-xl leading-relaxed">
          Carefully, on your behalf, and never shared. Last updated{" "}
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

      <Reveal delay={300}>
        <div className="mt-16 rounded-2xl border border-line bg-card p-6 md:p-8">
          <p className="eyebrow text-ink-3">Questions</p>
          <p className="font-display text-2xl text-foreground mt-2">
            Want to know something specific?
          </p>
          <p className="text-sm text-ink-2 mt-3 max-w-md">
            Email{" "}
            <a
              href="mailto:privacy@keepwise.app"
              className="underline underline-offset-4 text-ink"
            >
              privacy@keepwise.app
            </a>{" "}
            and a human will answer within two business days.
          </p>
        </div>
      </Reveal>
    </div>
  );
}