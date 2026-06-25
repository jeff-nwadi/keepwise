// Items list client island. Owns search + filter state, renders the
// rows. The drop-in side cards (Upgrade / Policy / Activity) are
// rendered by the server page above, not here.

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Reveal } from "../../_components/reveal";
import { StatusPill } from "../../_components/status-pill";
import { type Item, formatDeadlineDate } from "../../_data/item-helpers";
import {
  ArrowRight,
  Bell,
  Calendar,
  ChevronDown,
  Edit,
  Filter,
  Plus,
  Search,
  Trash,
} from "../../_components/icons";

type Filter = "all" | "soon" | "covered" | "expired";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "soon", label: "Expiring soon" },
  { id: "covered", label: "Covered" },
  { id: "expired", label: "Expired" },
];

export function ItemsList({ initialItems }: { initialItems: Item[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const items = useMemo(() => {
    return initialItems.filter((item) => {
      if (filter === "soon" && item.status !== "soon") return false;
      if (filter === "covered" && item.status !== "covered" && item.status !== "active") return false;
      if (filter === "expired" && item.status !== "expired") return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        return (
          item.merchant.toLowerCase().includes(q) ||
          item.itemName.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [initialItems, query, filter]);

  const alertCount = initialItems
    .flatMap((i) => i.alerts)
    .filter((a) => a.status === "queued").length;

  return (
    <>
      {/* Toolbar */}
      <div className="mt-10 flex flex-wrap items-center gap-3 border border-line rounded-2xl bg-card p-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px] rounded-lg bg-muted px-3 py-2">
          <Search size={14} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search merchants, items, dates…"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            aria-label="Search items"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter size={14} />
          {FILTERS.map((f) => {
            const active = f.id === filter;
            const count =
              f.id === "all"
                ? initialItems.length
                : f.id === "soon"
                ? initialItems.filter((i) => i.status === "soon").length
                : f.id === "covered"
                ? initialItems.filter((i) => i.status === "covered" || i.status === "active").length
                : initialItems.filter((i) => i.status === "expired").length;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs transition-colors ${
                  active
                    ? "bg-ink text-paper"
                    : "border border-line text-ink-2 bg-background hover:bg-muted"
                }`}
              >
                {f.label}
                <span className={`tabular-nums ${active ? "text-paper/70" : "text-muted-foreground"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Alerts dropdown is in its own row above the list, on small screens */}
      <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-full border-line bg-background hover:bg-muted">
              <Bell size={14} />
              <span>{alertCount} alert{alertCount === 1 ? "" : "s"} queued</span>
              <ChevronDown size={12} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-72 bg-popover border-border">
            <div className="px-3 py-2 border-b border-border">
              <p className="text-xs eyebrow text-muted-foreground">Queued alerts</p>
            </div>
            {initialItems.flatMap((i) =>
              i.alerts
                .filter((a) => a.status === "queued")
                .map((a) => (
                  <DropdownMenuItem key={a.id} asChild>
                    <Link href={`/items/${i.id}`} className="flex flex-col items-start gap-0.5 cursor-pointer">
                      <span className="text-sm text-foreground truncate max-w-full">{a.subject}</span>
                      <span className="text-[11px] text-muted-foreground">{i.itemName} · {a.channel}</span>
                    </Link>
                  </DropdownMenuItem>
                ))
            )}
            {alertCount === 0 && (
              <div className="px-3 py-4 text-sm text-muted-foreground">No queued alerts.</div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button asChild className="rounded-full bg-ink text-paper hover:bg-ink/90">
          <Link href="/upload">
            <Plus size={14} />
            Add receipt
          </Link>
        </Button>
      </div>

      {/* Items list */}
      <div className="mt-6 rounded-2xl border border-line bg-card overflow-hidden">
        {items.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="divide-y divide-border">
            {items.map((item, idx) => (
              <Reveal as="li" delay={idx * 50} key={item.id}>
                <ItemRow item={item} />
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

function ItemRow({ item }: { item: Item }) {
  return (
    <div className="group flex flex-wrap items-center gap-4 px-5 py-4 hover:bg-muted/60 transition-colors">
      <Link
        href={`/items/${item.id}`}
        className="flex flex-wrap items-center gap-4 flex-1 min-w-0"
      >
        <div className="size-10 rounded-lg bg-secondary text-foreground flex items-center justify-center shrink-0 font-display text-lg">
          {item.merchantInitial}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground truncate">{item.itemName}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 tracking-[0.04em]">
            {item.merchant} · {item.category.toLowerCase()}
          </p>
        </div>
        <div className="text-right shrink-0 hidden sm:block">
          <StatusPill item={item} />
          <p className="text-[11px] text-muted-foreground mt-1 tabular-nums">
            {formatDeadlineDate(item.deadline)}
          </p>
        </div>
      </Link>

      <div className="hidden md:block text-right shrink-0 w-28">
        <p className="text-[10px] tracking-[0.12em] text-muted-foreground uppercase">Total</p>
        <p className="font-mono text-sm text-foreground mt-0.5 tabular-nums">{item.total}</p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={`Actions for ${item.itemName}`}
            className="size-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted inline-flex items-center justify-center transition-colors"
          >
            <ChevronDown size={14} className="-rotate-90" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44 bg-popover border-border">
          <DropdownMenuItem asChild>
            <Link href={`/items/${item.id}`} className="cursor-pointer">
              <ArrowRight size={14} />
              <span>Open</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Edit size={14} />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Bell size={14} />
            <span>Snooze alerts</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer text-[hsl(0_56%_39%)] focus:text-[hsl(0_56%_39%)]">
            <Trash size={14} />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="px-8 py-16 text-center">
      <div className="size-14 rounded-full bg-muted text-muted-foreground mx-auto flex items-center justify-center">
        <Calendar size={20} />
      </div>
      <h3 className="font-display text-2xl text-foreground mt-4">No items match</h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
        Try a different search or clear the filter to see every tracked receipt in your household.
      </p>
      <Button asChild className="mt-6 rounded-full bg-ink text-paper hover:bg-ink/90">
        <Link href="/upload">
          <Plus size={14} />
          Snap a receipt
        </Link>
      </Button>
    </div>
  );
}