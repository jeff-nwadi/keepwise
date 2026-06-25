// Item detail page — Server Component. Reads the route param, looks the
// item up in the DB (already filtered by householdId inside getItem),
// and renders the detail layout. The two dialogs (Snooze / Delete) live
// in the sibling client component _actions.tsx so the page itself stays
// a Server Component.

import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Reveal } from "../../../_components/reveal";
import { StatusPill } from "../../../_components/status-pill";
import {
  getItem,
  formatDeadlineDate,
  daysUntil,
  type Item,
  type AlertEntry,
} from "../../../_data/items";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Calendar,
  Check,
  Edit,
  ScanText,
  Warning,
} from "../../../_components/icons";
import { SnoozeDialog, DeleteDialog } from "./_actions";

type Params = Promise<{ id: string }>;

// Pages are now dynamic — the data lives in the caller's household and
// cannot be statically generated.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Params }) {
  const { id } = await params;
  const item = await getItem(id);
  return { title: item ? `${item.itemName} · Keepwise` : "Item · Keepwise" };
}

export default async function ItemDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const item = await getItem(id);
  if (!item) notFound();

  const d = daysUntil(item.deadline);
  const relativeDeadline =
    item.status === "expired"
      ? `Closed ${Math.abs(d)} day${Math.abs(d) === 1 ? "" : "s"} ago`
      : d === 0
        ? "Closes today"
        : `${d} day${d === 1 ? "" : "s"} from today`;

  return (
    <div className="mx-auto max-w-5xl px-6 lg:px-10 py-10 lg:py-14">
      {/* Back link */}
      <Reveal>
        <Link
          href="/items"
          className="inline-flex items-center gap-1.5 text-sm text-ink-2 hover:text-ink transition-colors"
        >
          <ArrowLeft size={14} />
          Back to items
        </Link>
      </Reveal>

      {/* Header */}
      <Reveal delay={60}>
        <div className="mt-6 flex flex-wrap items-start justify-between gap-6">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-xl bg-secondary text-foreground flex items-center justify-center font-display text-2xl">
                {item.merchantInitial}
              </div>
              <div>
                <p className="eyebrow text-ink-3">{item.merchant}</p>
                <h1 className="font-display text-3xl md:text-4xl text-ink leading-[1.1] mt-1">
                  {item.itemName}
                </h1>
              </div>
            </div>
            <p className="text-sm text-ink-2 mt-4">
              Purchased {formatDeadlineDate(item.purchaseDate)} · {item.category}
            </p>
          </div>
          <div className="text-right">
            <p className="eyebrow text-ink-3">Total</p>
            <p className="font-mono text-2xl text-foreground mt-1 tabular-nums">{item.total}</p>
            <div className="mt-3 flex items-center justify-end gap-2">
              <StatusPill item={item} />
            </div>
          </div>
        </div>
      </Reveal>

      {/* Actions bar */}
      <Reveal delay={120}>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-full border-line bg-background hover:bg-muted">
            <Edit size={14} />
            Edit details
          </Button>
          <SnoozeDialog itemName={item.itemName} itemId={item.id} />
          <Button variant="outline" size="sm" className="rounded-full border-line bg-background hover:bg-muted">
            <Bell size={14} />
            Alert history
          </Button>
          <div className="ml-auto">
            <DeleteDialog itemName={item.itemName} itemId={item.id} />
          </div>
        </div>
      </Reveal>

      {/* Deadline hero card */}
      <Reveal delay={180}>
        <Card className="mt-8 border-line bg-card overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <p className="eyebrow text-amber">Inferred deadline</p>
                <p className="font-display text-4xl md:text-5xl text-ink mt-2 leading-[1.05]">
                  {formatDeadlineDate(item.deadline)}
                </p>
                <p className="text-sm text-ink-2 mt-2">{relativeDeadline}</p>
                <p className="text-xs text-muted-foreground mt-3 max-w-md leading-relaxed">
                  {item.policyNote}
                </p>
              </div>
              <ConfidenceRing value={item.confidence} />
            </div>
            {item.deadlineType === "custom" && (
              <div className="mt-6 rounded-lg border border-amber/30 bg-amber-soft/40 p-4 flex items-start gap-3">
                <Warning size={16} className="text-amber mt-0.5 shrink-0" />
                <p className="text-xs text-ink-2 leading-relaxed">
                  Custom deadline — no policy rule matched for this merchant.
                  Keepwise asked for a date rather than guessing.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </Reveal>

      {/* Receipt + extraction */}
      <Reveal delay={240}>
        <section className="mt-8">
          <h2 className="font-display text-2xl text-ink mb-4">Receipt & extraction</h2>
          <ItemExtraction item={item} />
        </section>
      </Reveal>

      {/* Line items */}
      <Reveal delay={300}>
        <section className="mt-8">
          <h2 className="font-display text-2xl text-ink mb-4">Line items</h2>
          <Card className="border-line bg-card">
            <CardContent className="p-0">
              <ul className="divide-y divide-border">
                {item.lineItems.map((li) => (
                  <li key={li.name} className="flex items-baseline justify-between px-5 py-3.5">
                    <span className="text-sm text-foreground truncate">{li.name}</span>
                    <span className="font-mono text-sm text-foreground tabular-nums shrink-0">{li.price}</span>
                  </li>
                ))}
              </ul>
              <Separator />
              <div className="flex items-baseline justify-between px-5 py-3.5">
                <span className="text-sm font-medium text-foreground">Total</span>
                <span className="font-mono text-sm font-semibold text-foreground tabular-nums">{item.total}</span>
              </div>
            </CardContent>
          </Card>
        </section>
      </Reveal>

      {/* Alert history */}
      <Reveal delay={360}>
        <section className="mt-8">
          <div className="flex items-end justify-between mb-4">
            <h2 className="font-display text-2xl text-ink">Alert history</h2>
            <Badge variant="secondary" className="rounded-full bg-muted text-muted-foreground">
              {item.alerts.length} {item.alerts.length === 1 ? "entry" : "entries"}
            </Badge>
          </div>
          {item.alerts.length === 0 ? (
            <Card className="border-line bg-card">
              <CardContent className="p-8 text-center">
                <div className="size-12 rounded-full bg-muted text-muted-foreground mx-auto flex items-center justify-center">
                  <Bell size={18} />
                </div>
                <p className="font-display text-xl text-foreground mt-4">No alerts yet</p>
                <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
                  We&apos;ll queue a heads-up {relativeDeadline.toLowerCase()}.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-line bg-card">
              <CardContent className="p-0">
                <ol className="relative">
                  {item.alerts.map((alert, idx) => (
                    <AlertRow key={alert.id} alert={alert} isLast={idx === item.alerts.length - 1} />
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}
        </section>
      </Reveal>

      {/* Footer nav within detail */}
      <Reveal delay={420}>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-line">
          <Link
            href="/items"
            className="inline-flex items-center gap-1.5 text-sm text-ink-2 hover:text-ink transition-colors"
          >
            <ArrowLeft size={14} />
            All items
          </Link>
          <Button asChild className="rounded-full bg-ink text-paper hover:bg-ink/90">
            <Link href="/upload">
              Add another receipt
              <ArrowRight size={14} />
            </Link>
          </Button>
        </div>
      </Reveal>
    </div>
  );
}

function ConfidenceRing({ value }: { value: number }) {
  const r = 28;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative size-20 shrink-0">
      <svg viewBox="0 0 64 64" className="size-full -rotate-90">
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke="hsl(42 23% 81%)"
          strokeWidth="4"
        />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke="hsl(26 90% 37%)"
          strokeWidth="4"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-sm font-semibold text-foreground tabular-nums">{value}%</span>
        <span className="text-[9px] tracking-[0.12em] text-ink-3 uppercase">Confidence</span>
      </div>
    </div>
  );
}

function ItemExtraction({ item }: { item: Item }) {
  const fields = [
    { label: "Merchant", value: item.merchant, confidence: `${item.confidence}%` },
    { label: "Purchased", value: formatDeadlineDate(item.purchaseDate), confidence: "99%" },
    { label: "Total", value: item.total, confidence: "97%" },
    { label: "Category", value: item.category, confidence: "92%" },
  ];
  return (
    <div className="rounded-2xl border border-line bg-white shadow-[0_1px_0_rgba(24,23,21,0.04),0_20px_40px_-20px_rgba(24,23,21,0.18)] overflow-hidden">
      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-line">
        {/* Left: receipt preview */}
        <div className="p-6 bg-paper-2">
          <p className="eyebrow text-ink-3 flex items-center gap-2">
            <ScanText className="size-3.5" />
            Receipt scan
          </p>
          <div className="mt-4 flex justify-center">
            <div className="receipt p-5 w-full max-w-[230px]">
              <p className="text-[10px] tracking-[0.2em] text-ink-3 uppercase text-center">
                {item.merchant}
              </p>
              <div className="my-3 border-t border-dashed border-line" />
              <div className="space-y-1.5 text-[11px] leading-tight text-ink">
                {item.lineItems.map((li) => (
                  <div key={li.name} className="flex justify-between gap-3">
                    <span className="truncate">{li.name}</span>
                    <span className="shrink-0 tabular-nums">{li.price.replace(/[₦$]/g, "")}</span>
                  </div>
                ))}
              </div>
              <div className="my-3 border-t border-dashed border-line" />
              <div className="flex justify-between text-[12px] font-semibold text-ink">
                <span>Total</span>
                <span className="tabular-nums">{item.total}</span>
              </div>
              <div className="mt-4 flex justify-between text-[9px] text-ink-3 tracking-[0.18em] uppercase">
                <span>{item.purchaseDate.slice(5).replace(/-/g, "/")}/{item.purchaseDate.slice(0, 4)}</span>
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
            {fields.map((f) => (
              <div
                key={f.label}
                className="flex items-baseline justify-between gap-3 border-b border-line pb-2"
              >
                <div className="min-w-0">
                  <dt className="eyebrow text-ink-3">{f.label}</dt>
                  <dd className="text-sm text-ink mt-0.5 truncate">{f.value}</dd>
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
              {item.deadlineType === "return" ? "Return by" : "Coverage through"}{" "}
              <span className="text-amber">{formatDeadlineDate(item.deadline)}</span>
            </p>
            <p className="text-[11px] text-ink-3 mt-0.5">{item.policyNote}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertRow({ alert, isLast }: { alert: AlertEntry; isLast: boolean }) {
  const statusClass =
    alert.status === "delivered"
      ? "bg-moss/10 text-moss"
      : alert.status === "opened"
        ? "bg-amber-soft/60 text-amber"
        : "bg-paper-3 text-ink-2";
  const statusLabel =
    alert.status === "delivered" ? "Delivered"
    : alert.status === "opened" ? "Opened"
    : "Queued";
  return (
    <li className="relative flex items-start gap-4 px-5 py-4">
      {!isLast && (
        <span
          className="absolute left-[1.7rem] top-9 bottom-0 w-px bg-border"
          aria-hidden="true"
        />
      )}
      <div className="size-7 rounded-full bg-secondary text-foreground flex items-center justify-center shrink-0 z-10">
        {alert.channel === "email" ? <Bell size={12} /> : <Calendar size={12} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground truncate">{alert.subject}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          {formatDeadlineDate(alert.date)} · {alert.channel}
        </p>
      </div>
      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium tracking-[0.06em] uppercase ${statusClass}`}>
        {statusLabel}
      </span>
    </li>
  );
}
