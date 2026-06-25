// Hand-crafted receipt cards. Pure HTML/CSS — no external images, no AI generation.
// Used in three places: hero collage, "How it works" middle step, dashboard preview.
// Each variant takes a small set of props and renders a torn-edge paper card in mono.

type ReceiptProps = {
  merchant: string;
  date: string;
  items: { name: string; price: string }[];
  total: string;
  cardNumber?: string;
  className?: string;
  rotate?: number;
  tilt?: "left" | "right" | "none";
};

export function Receipt({
  merchant,
  date,
  items,
  total,
  cardNumber = "VISA •• 4242",
  className = "",
  rotate = 0,
  tilt = "none",
}: ReceiptProps) {
  const tiltClass =
    tilt === "left"
      ? "-rotate-3"
      : tilt === "right"
        ? "rotate-3"
        : "";
  return (
    <div
      className={`receipt p-5 w-[260px] ${tiltClass} ${className}`}
      style={{ transform: rotate ? `rotate(${rotate}deg)` : undefined }}
      aria-hidden="true"
    >
      <p className="text-[10px] tracking-[0.2em] text-ink-3 uppercase text-center">
        {merchant}
      </p>
      <div className="my-3 border-t border-dashed border-line" />
      <div className="space-y-1.5 text-[11px] leading-tight text-ink">
        {items.map((item) => (
          <div key={item.name} className="flex justify-between gap-3">
            <span className="truncate">{item.name}</span>
            <span className="shrink-0 tabular-nums">{item.price}</span>
          </div>
        ))}
      </div>
      <div className="my-3 border-t border-dashed border-line" />
      <div className="flex justify-between text-[11px] text-ink-2">
        <span>Subtotal</span>
        <span className="tabular-nums">{total}</span>
      </div>
      <div className="flex justify-between text-[12px] font-semibold text-ink mt-1">
        <span>Total</span>
        <span className="tabular-nums">{total}</span>
      </div>
      <div className="mt-4 flex justify-between text-[9px] text-ink-3 tracking-[0.18em] uppercase">
        <span>{date}</span>
        <span>{cardNumber}</span>
      </div>
    </div>
  );
}

// Three specific receipts used in the hero collage. Real-sounding merchants + dates
// pulled from the PRD's "Over-Buyer" persona: electronics, apparel, home goods.
export function BestBuyReceipt({ tilt = "left" }: { tilt?: "left" | "right" | "none" }) {
  return (
    <Receipt
      merchant="Best Buy"
      date="06/18/2026"
      items={[
        { name: "Sony WH-1000XM5", price: "₦845,000" },
        { name: "USB-C cable", price: "₦18,500" },
      ]}
      total="₦863,500"
      rotate={tilt === "left" ? -6 : tilt === "right" ? 4 : 0}
      tilt={tilt}
    />
  );
}

export function AllbirdsReceipt({ tilt = "right" }: { tilt?: "left" | "right" | "none" }) {
  return (
    <Receipt
      merchant="Allbirds"
      date="05/02/2026"
      items={[
        { name: "Tree Runner", price: "$110" },
        { name: "Wool Lounger", price: "$95" },
      ]}
      total="$205"
      rotate={tilt === "right" ? 5 : tilt === "left" ? -4 : 0}
      tilt={tilt}
    />
  );
}

export function FrameTVReceipt({ tilt = "left" }: { tilt?: "left" | "right" | "none" }) {
  return (
    <Receipt
      merchant="Frame TV Co."
      date="01/14/2026"
      items={[
        { name: "65\" The Frame", price: "$1,799" },
        { name: "No-gap mount", price: "$79" },
        { name: "Extended 5yr", price: "$199" },
      ]}
      total="$2,077"
      rotate={tilt === "left" ? -4 : tilt === "right" ? 6 : 0}
      tilt={tilt}
    />
  );
}
