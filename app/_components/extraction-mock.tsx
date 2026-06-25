// Inline mock of the AI extraction result. Shows the left half = scanned receipt,
// the right half = structured fields the AI pulled out. Both halves are visually
// distinct (paper vs. card) so the "extraction" concept is legible at a glance.

import { Check, ScanText } from "./icons";

const FIELDS = [
  { label: "Merchant", value: "Best Buy — Lekki Phase 1", confidence: "98%" },
  { label: "Purchased", value: "June 18, 2026", confidence: "99%" },
  { label: "Total", value: "₦863,500", confidence: "97%" },
  { label: "Category", value: "Electronics › Audio", confidence: "92%" },
];

export function ExtractionMock() {
  return (
    <div className="rounded-2xl border border-line bg-white shadow-[0_1px_0_rgba(24,23,21,0.04),0_20px_40px_-20px_rgba(24,23,21,0.18)] overflow-hidden">
      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-line">
        {/* Left: the scanned receipt */}
        <div className="p-6 bg-paper-2 relative">
          <p className="eyebrow text-ink-3 flex items-center gap-2">
            <ScanText className="size-3.5" />
            Receipt scan
          </p>
          <div className="mt-4 flex justify-center">
            <div className="receipt p-5 w-full max-w-[230px]">
              <p className="text-[10px] tracking-[0.2em] text-ink-3 uppercase text-center">
                Best Buy
              </p>
              <div className="my-3 border-t border-dashed border-line" />
              <div className="space-y-1.5 text-[11px] leading-tight text-ink">
                <div className="flex justify-between">
                  <span>Sony WH-1000XM5</span>
                  <span className="tabular-nums">845,000</span>
                </div>
                <div className="flex justify-between">
                  <span>USB-C cable</span>
                  <span className="tabular-nums">18,500</span>
                </div>
              </div>
              <div className="my-3 border-t border-dashed border-line" />
              <div className="flex justify-between text-[12px] font-semibold text-ink">
                <span>Total</span>
                <span className="tabular-nums">₦863,500</span>
              </div>
              <div className="mt-4 flex justify-between text-[9px] text-ink-3 tracking-[0.18em] uppercase">
                <span>06/18/2026</span>
                <span>VISA •• 4242</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: extracted fields */}
        <div className="p-6">
          <p className="eyebrow text-amber flex items-center gap-2">
            <Check className="size-3.5" />
            Extracted · ready to file
          </p>
          <dl className="mt-4 space-y-3">
            {FIELDS.map((f) => (
              <div
                key={f.label}
                className="flex items-baseline justify-between gap-3 border-b border-line pb-2"
              >
                <div className="min-w-0">
                  <dt className="eyebrow text-ink-3">{f.label}</dt>
                  <dd className="text-sm text-ink mt-0.5 truncate">
                    {f.value}
                  </dd>
                </div>
                <span className="font-mono text-[10px] text-moss tracking-[0.1em] shrink-0">
                  {f.confidence}
                </span>
              </div>
            ))}
          </dl>
          <div className="mt-5 rounded-lg bg-paper-2 border border-line p-3">
            <p className="eyebrow text-ink-3">Inferred deadline</p>
            <p className="font-display text-lg text-ink mt-1">
              Return by <span className="text-amber">Jun 28</span>
            </p>
            <p className="text-[11px] text-ink-3 mt-0.5">
              15-day electronics return policy · Best Buy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
