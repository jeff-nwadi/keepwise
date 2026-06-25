"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bell, Trash } from "../../../_components/icons";
import { snoozeItem, deleteItem } from "../actions";

const CHOICES: Array<{ label: string; days: number }> = [
  { label: "1 day", days: 1 },
  { label: "3 days", days: 3 },
  { label: "7 days", days: 7 },
  { label: "30 days", days: 30 },
];

export function SnoozeDialog({
  itemName,
  itemId,
}: {
  itemName: string;
  itemId: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [days, setDays] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function confirm() {
    if (!days) return;
    startTransition(async () => {
      const res = await snoozeItem({ itemId, days });
      if (res?.error) {
        setError(res.error);
        return;
      }
      setOpen(false);
      setDays(null);
      setError(null);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setError(null); }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full border-line bg-background hover:bg-muted">
          <Bell size={14} />
          Snooze
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-popover border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Snooze alerts</DialogTitle>
          <DialogDescription>
            Push the deadline for <span className="text-foreground">{itemName}</span>{" "}
            out by a chosen period. We&apos;ll re-evaluate alert timing afterwards.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-2">
          {CHOICES.map((c) => (
            <button
              key={c.days}
              type="button"
              onClick={() => setDays(c.days)}
              className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                days === c.days
                  ? "border-ink bg-ink text-paper"
                  : "border-border bg-background text-foreground hover:bg-muted"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        {error && <p className="text-xs text-[hsl(0_56%_39%)]">{error}</p>}
        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)} className="rounded-full">
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={!days || pending}
            onClick={confirm}
            className="rounded-full bg-ink text-paper hover:bg-ink/90"
          >
            {pending
              ? "Saving…"
              : days
                ? `Push ${CHOICES.find((c) => c.days === days)?.label}`
                : "Pick a duration"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteDialog({
  itemName,
  itemId,
}: {
  itemName: string;
  itemId: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function confirm() {
    startTransition(async () => {
      const res = await deleteItem({ itemId });
      if (res?.error) {
        setError(res.error);
        return;
      }
      setOpen(false);
      router.push(res?.redirect ?? "/items");
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setError(null); }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full border-line bg-background hover:bg-muted text-[hsl(0_56%_39%)] hover:text-[hsl(0_56%_39%)]">
          <Trash size={14} />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-popover border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Delete this receipt?</DialogTitle>
          <DialogDescription>
            <span className="text-foreground">{itemName}</span> and its alert history will be removed
            from your household. This can&apos;t be undone.
          </DialogDescription>
        </DialogHeader>
        {error && <p className="text-xs text-[hsl(0_56%_39%)]">{error}</p>}
        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)} className="rounded-full">
            Keep it
          </Button>
          <Button
            size="sm"
            disabled={pending}
            onClick={confirm}
            className="rounded-full bg-[hsl(0_56%_39%)] text-white hover:bg-[hsl(0_56%_34%)]"
          >
            {pending ? "Deleting…" : "Yes, delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
