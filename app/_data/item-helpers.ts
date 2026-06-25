// Pure, client-safe helpers for the keepwise Item shape. This file
// must NOT import anything from the DB layer — it is imported by both
// server components (page.tsx, layout.tsx) and client islands
// (settings/_tabs.tsx, items/_list.tsx, status-pill.tsx).
//
// The server-side data layer in `./items.ts` re-exports these helpers
// for the server side. If you change a signature here, the data
// layer's re-export must update too.

export type ItemStatus = "soon" | "covered" | "expired" | "active";
export type DeadlineType = "return" | "warranty" | "custom";
export type Currency = "USD" | "NGN";

export type LineItem = { name: string; price: string };

export type AlertEntry = {
  id: string;
  date: string;
  channel: "email" | "in-app";
  subject: string;
  status: "delivered" | "queued" | "opened";
};

export type Item = {
  id: string;
  merchant: string;
  merchantInitial: string;
  itemName: string;
  category: string;
  total: string;
  currency: Currency;
  purchaseDate: string;
  deadline: string;
  deadlineType: DeadlineType;
  status: ItemStatus;
  confidence: number;
  receiptVariant:
    | "bestbuy"
    | "allbirds"
    | "frametv"
    | "williams"
    | "amazon"
    | "apple";
  lineItems: LineItem[];
  policyNote: string;
  alerts: AlertEntry[];
};

function todayMidnight(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function daysUntil(iso: string): number {
  if (!iso) return 0;
  const target = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
  if (Number.isNaN(target.getTime())) return 0;
  const ms = target.getTime() - todayMidnight().getTime();
  return Math.round(ms / 86400000);
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function formatDeadlineDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
  if (Number.isNaN(d.getTime())) return "—";
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export function statusLabel(item: Pick<Item, "status" | "deadline">): {
  label: string;
  className: string;
  dotClassName: string;
} {
  const d = daysUntil(item.deadline);
  if (item.status === "soon") {
    return {
      label: d === 0 ? "Closes today" : `${d} days left`,
      className: "bg-amber-soft/60 text-amber",
      dotClassName: "bg-amber",
    };
  }
  if (item.status === "expired") {
    const ago = Math.abs(d);
    return {
      label: `Expired ${ago === 0 ? "today" : `${ago} day${ago === 1 ? "" : "s"} ago`}`,
      className: "bg-[hsl(0_56%_39%/0.1)] text-[hsl(0_56%_39%)]",
      dotClassName: "bg-rose",
    };
  }
  if (item.status === "covered") {
    return {
      label: `${d} days left`,
      className: "bg-[hsl(134_33%_27%/0.1)] text-moss",
      dotClassName: "bg-moss",
    };
  }
  // active
  const years = Math.floor(d / 365);
  const months = Math.floor((d % 365) / 30);
  if (years >= 1) {
    return {
      label: `${years} yr${years === 1 ? "" : "s"}, ${months} mo left`,
      className: "bg-paper-3 text-ink-2",
      dotClassName: "bg-ink-3",
    };
  }
  return {
    label: `${months} mo left`,
    className: "bg-paper-3 text-ink-2",
    dotClassName: "bg-ink-3",
  };
}