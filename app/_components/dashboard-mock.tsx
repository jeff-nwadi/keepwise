import { Bell, Filter, Search } from "./icons";

// The single most important image on the page — the product surface itself.
// Three fake items in different deadline states: one expiring soon (amber),
// one active warranty (moss), one with a custom deadline (rose, expired).

type Item = {
  merchant: string;
  item: string;
  total: string;
  deadline: string;
  deadlineLabel: string;
  status: "soon" | "covered" | "expired" | "active";
};

const ITEMS: Item[] = [
  {
    merchant: "Best Buy",
    item: "Sony WH-1000XM5",
    total: "₦863,500",
    deadline: "Jun 28, 2026",
    deadlineLabel: "Return window closes",
    status: "soon",
  },
  {
    merchant: "Allbirds",
    item: "Tree Runner (×2)",
    total: "$220",
    deadline: "May 2, 2027",
    deadlineLabel: "Manufacturer warranty",
    status: "covered",
  },
  {
    merchant: "Frame TV Co.",
    item: "65\" The Frame + 5yr plan",
    total: "$2,077",
    deadline: "Jan 14, 2031",
    deadlineLabel: "Extended warranty",
    status: "active",
  },
  {
    merchant: "Williams Sonoma",
    item: "Le Creuset Dutch oven",
    total: "$449",
    deadline: "Jun 12, 2026",
    deadlineLabel: "Return window — expired",
    status: "expired",
  },
];

function StatusDot({ status }: { status: Item["status"] }) {
  const color =
    status === "soon"
      ? "bg-amber"
      : status === "expired"
        ? "bg-rose"
        : status === "covered"
          ? "bg-moss"
          : "bg-ink-3";
  return (
    <span className="relative inline-flex items-center">
      <span
        className={`size-2 rounded-full ${color}`}
        aria-hidden="true"
      />
      {status === "soon" && (
        <span
          className="absolute inset-0 size-2 rounded-full bg-amber animate-ping opacity-60"
          aria-hidden="true"
        />
      )}
    </span>
  );
}

function StatusPill({ status }: { status: Item["status"] }) {
  const map = {
    soon: { label: "6 days left", className: "bg-amber-soft text-amber" },
    covered: { label: "11 months left", className: "bg-paper-3 text-moss" },
    active: { label: "4.5 years left", className: "bg-paper-3 text-ink-2" },
    expired: { label: "Expired", className: "bg-rose/10 text-rose" },
  } as const;
  const { label, className } = map[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium tracking-[0.06em] uppercase ${className}`}
    >
      <StatusDot status={status} />
      {label}
    </span>
  );
}

export function DashboardMock() {
  return (
    <div className="relative">
      {/* Soft halo behind the card. inset-0 + paper-grain gives the warm glow
          without spilling past the container (negative insets caused 8px
          horizontal overflow at <1024px viewports). */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-br from-paper-2 via-paper to-paper-2 rounded-3xl paper-grain"
      />

      <div className="rounded-2xl border border-line bg-white shadow-[0_1px_0_rgba(24,23,21,0.04),0_30px_60px_-30px_rgba(24,23,21,0.18)] overflow-hidden">
        {/* Window chrome */}
        <div className="flex items-center gap-1.5 px-4 h-9 border-b border-line bg-paper-2">
          <span className="size-2.5 rounded-full bg-line" />
          <span className="size-2.5 rounded-full bg-line" />
          <span className="size-2.5 rounded-full bg-line" />
          <span className="ml-3 eyebrow text-ink-3">app.keepwise.io / items</span>
        </div>

        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex flex-wrap items-end justify-between gap-4 border-b border-line">
          <div>
            <p className="eyebrow text-ink-3">Your household</p>
            <h3 className="font-display text-2xl text-ink mt-1">
              4 items · 1 deadline this week
            </h3>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-ink text-paper px-3.5 py-2 text-xs font-medium hover:bg-ink-2 transition-colors"
          >
            <Bell className="size-3.5" />
            1 alert queued
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3 flex flex-wrap items-center gap-3 border-b border-line">
          <div className="flex items-center gap-2 flex-1 min-w-[220px] rounded-lg border border-line bg-paper px-3 py-2">
            <Search className="size-3.5 text-ink-3" />
            <span className="text-xs text-ink-3">
              Search merchants, items, dates…
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <Filter className="size-3.5 text-ink-3" />
            {[
              { label: "All", active: true },
              { label: "Expiring soon", active: false },
              { label: "Covered", active: false },
              { label: "Expired", active: false },
            ].map((chip) => (
              <span
                key={chip.label}
                className={`px-2.5 py-1 rounded-full border tracking-[0.04em] ${
                  chip.active
                    ? "border-ink bg-ink text-paper"
                    : "border-line text-ink-2 bg-paper-2"
                }`}
              >
                {chip.label}
              </span>
            ))}
          </div>
        </div>

        {/* Rows */}
        <ul className="divide-y divide-line">
          {ITEMS.map((item) => (
            <li
              key={item.merchant + item.item}
              className="px-6 py-4 flex flex-wrap items-center gap-4 hover:bg-paper-2/60 transition-colors"
            >
              <div className="size-10 rounded-lg bg-paper-3 flex items-center justify-center shrink-0">
                <span className="font-display text-lg text-ink-2">
                  {item.merchant[0]}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink truncate">
                  {item.item}
                </p>
                <p className="text-[11px] text-ink-3 mt-0.5 tracking-[0.04em]">
                  {item.merchant} · {item.deadlineLabel.toLowerCase()}
                </p>
              </div>
              <div className="text-right">
                <StatusPill status={item.status} />
                <p className="text-[11px] text-ink-3 mt-1 tabular-nums">
                  {item.deadline}
                </p>
              </div>
              <div className="text-right shrink-0 w-24 hidden sm:block">
                <p className="font-mono text-[11px] text-ink-3 uppercase tracking-[0.12em]">
                  Total
                </p>
                <p className="font-mono text-sm text-ink mt-0.5 tabular-nums">
                  {item.total}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-line bg-paper-2 flex items-center justify-between">
          <span className="text-[11px] text-ink-3 tracking-[0.04em]">
            Showing all 4 items · last refreshed just now
          </span>
          <span className="text-[11px] text-ink-3 tracking-[0.04em]">
            Free plan · 1 of 5 items used
          </span>
        </div>
      </div>
    </div>
  );
}
