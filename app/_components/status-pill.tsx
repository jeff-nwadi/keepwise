// Status pill + dot, shared by the items dashboard and item detail.
// Renders an amber pulse on "soon" via the animate-ping-soft keyframe.

import { cn } from "@/lib/utils";
import { type Item, statusLabel } from "../_data/item-helpers";

export function StatusDot({ status }: { status: Item["status"] }) {
  const color =
    status === "soon" ? "bg-amber"
    : status === "expired" ? "bg-rose"
    : status === "covered" ? "bg-moss"
    : "bg-ink-3";
  return (
    <span className="relative inline-flex items-center">
      <span className={cn("size-2 rounded-full", color)} aria-hidden="true" />
      {status === "soon" && (
        <span
          className="absolute inset-0 size-2 rounded-full bg-amber animate-ping-soft"
          aria-hidden="true"
        />
      )}
    </span>
  );
}

export function StatusPill({ item }: { item: Item }) {
  const { label, className } = statusLabel(item);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium tracking-[0.06em] uppercase whitespace-nowrap",
        className
      )}
    >
      <StatusDot status={item.status} />
      {label}
    </span>
  );
}
