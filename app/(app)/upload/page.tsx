"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Reveal } from "../../_components/reveal";
import { Check, Refresh, ScanText, Warning, Camera, Gallery, Close, Info } from "../../_components/icons";
import { addItem } from "../items/actions";

type Stage = "capture" | "extracting" | "review";

const EXTRACT_FIELDS_INIT = [
  { label: "Merchant", value: "Best Buy — Lekki Phase 1", confidence: 98 },
  { label: "Purchased", value: "Jun 18, 2026", confidence: 99 },
  { label: "Total", value: "₦863,500", confidence: 97 },
  { label: "Category", value: "Electronics › Audio", confidence: 92 },
];

export default function UploadPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("capture");
  const [progress, setProgress] = useState(0);
  const [extracted, setExtracted] = useState(EXTRACT_FIELDS_INIT);
  const [pending, startTransition] = useTransition();
  const [fileError, setFileError] = useState<string | null>(null);

  function fileReceipt() {
    setFileError(null);
    startTransition(async () => {
      // The review stage's "File receipt" button — demo data is already on
      // screen, so we synthesize a server-action payload from it.
      const total = extracted.find((f) => f.label === "Total")?.value ?? "₦0";
      const merchant = extracted.find((f) => f.label === "Merchant")?.value ?? "Unknown merchant";
      const itemName = merchant.split("—")[0].trim();
      const today = new Date();
      const purchaseDate = today.toISOString().slice(0, 10);
      const deadline = new Date(today);
      deadline.setDate(deadline.getDate() + 15);
      const deadlineIso = deadline.toISOString().slice(0, 10);
      const res = await addItem({
        merchant,
        itemName,
        total,
        currency: "NGN",
        purchaseDate,
        deadline: deadlineIso,
        deadlineType: "return",
        lineItems: [
          { name: itemName, price: total.replace(/[₦$]/g, "") },
        ],
        policyNote: "15-day electronics return policy",
      });
      if (res?.error) {
        setFileError(res.error);
        return;
      }
      if (res?.redirect) router.push(res.redirect);
      router.refresh();
    });
  }

  const startExtraction = () => {
    setStage("extracting");
    setProgress(0);
    const tick = (n: number) => {
      setProgress(n);
      if (n < 100) {
        setTimeout(() => tick(n + 12 + Math.random() * 8), 120);
      } else {
        setTimeout(() => setStage("review"), 250);
      }
    };
    tick(0);
  };

  const rerunExtraction = () => {
    setStage("extracting");
    setProgress(0);
    setExtracted((prev) =>
      prev.map((f) => ({
        ...f,
        confidence: Math.max(85, Math.min(99, f.confidence + Math.round((Math.random() - 0.5) * 6))),
      })),
    );
    const tick = (n: number) => {
      setProgress(n);
      if (n < 100) {
        setTimeout(() => tick(n + 14 + Math.random() * 6), 110);
      } else {
        setTimeout(() => setStage("review"), 250);
      }
    };
    tick(0);
  };

  return (
    <div className="mx-auto max-w-5xl px-6 lg:px-10 py-10 lg:py-14">
      {/* Header */}
      <Reveal>
        <p className="eyebrow text-amber">Add a receipt</p>
        <h1 className="font-display text-4xl md:text-5xl text-ink mt-2 leading-[1.05]">
          Snap it. We&apos;ll handle the rest.
        </h1>
        <p className="text-sm text-ink-2 mt-3 max-w-xl">
          Drop a photo, gallery image, or PDF. Keepwise reads the merchant, date,
          and total, then infers a return or warranty deadline from the policy
          rules for that store.
        </p>
      </Reveal>

      {/* Stage: capture */}
      {stage === "capture" && (
        <Reveal delay={80}>
          <div className="mt-8 grid lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2 border-line bg-card">
              <CardContent className="p-8">
                <p className="eyebrow text-ink-3">Step 1 of 2</p>
                <p className="font-display text-2xl text-foreground mt-2">
                  Drop a receipt or take a photo
                </p>
                <p className="text-sm text-muted-foreground mt-2 max-w-md">
                  JPG, PNG, HEIC, or PDF. Up to 10 MB. We never keep a copy of
                  the image after extraction finishes.
                </p>
                <div
                  className="mt-6 rounded-2xl border-2 border-dashed border-line bg-muted/40 p-10 text-center"
                  onClick={startExtraction}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && startExtraction()}
                >
                  <div className="size-14 rounded-full bg-background text-foreground mx-auto flex items-center justify-center border border-line">
                    <ScanText size={22} />
                  </div>
                  <p className="font-display text-xl text-foreground mt-4">
                    Drop file here, or click to use the demo receipt
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Demo mode · the demo receipt is pre-loaded for the walkthrough
                  </p>
                </div>
                <div className="mt-4 grid sm:grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="rounded-full border-line bg-background hover:bg-muted"
                    onClick={startExtraction}
                  >
                    <Camera size={14} />
                    Take a photo
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full border-line bg-background hover:bg-muted"
                    onClick={startExtraction}
                  >
                    <Gallery size={14} />
                    Choose from gallery
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="border-line bg-card">
              <CardContent className="p-6">
                <p className="eyebrow text-ink-3 flex items-center gap-2">
                  <Info size={12} />
                  What we read
                </p>
                <ul className="mt-3 space-y-2.5 text-sm text-foreground">
                  <li className="flex items-start gap-2">
                    <Check size={14} className="text-moss mt-0.5 shrink-0" />
                    Merchant name &amp; address
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={14} className="text-moss mt-0.5 shrink-0" />
                    Purchase date &amp; total
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={14} className="text-moss mt-0.5 shrink-0" />
                    Line items (for warranty claims)
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={14} className="text-moss mt-0.5 shrink-0" />
                    Card last 4 (so you can match it)
                  </li>
                </ul>
                <p className="text-[11px] text-muted-foreground mt-5 leading-relaxed">
                  We ask for a custom deadline when no policy rule matches
                  rather than guess. You can override any field below.
                </p>
              </CardContent>
            </Card>
          </div>
        </Reveal>
      )}

      {/* Stage: extracting */}
      {stage === "extracting" && (
        <Reveal delay={80}>
          <Card className="mt-8 border-line bg-card">
            <CardContent className="p-8">
              <p className="eyebrow text-ink-3">Step 2 of 2</p>
              <p className="font-display text-2xl text-foreground mt-2">
                Reading the receipt…
              </p>
              <p className="text-sm text-muted-foreground mt-2 max-w-md">
                OCR, layout parsing, then matching the merchant against our
                policy library. Usually under 4 seconds.
              </p>
              <Progress value={progress} className="mt-6 h-2" />
              <div className="mt-4 grid sm:grid-cols-3 gap-3 text-xs">
                <Step done={progress > 25} label="Detect edges" />
                <Step done={progress > 55} label="Parse line items" />
                <Step done={progress > 90} label="Match policy rule" />
              </div>
              <div className="mt-8 flex items-center gap-3 opacity-50 pointer-events-none">
                <div className="receipt p-4 w-[180px]">
                  <p className="text-[9px] tracking-[0.2em] text-ink-3 uppercase text-center">
                    Best Buy
                  </p>
                  <div className="my-2 border-t border-dashed border-line" />
                  <div className="space-y-1 text-[10px] leading-tight text-ink">
                    <div className="flex justify-between">
                      <span>Sony WH-1000XM5</span>
                      <span className="tabular-nums">845,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>USB-C cable</span>
                      <span className="tabular-nums">18,500</span>
                    </div>
                  </div>
                  <div className="my-2 border-t border-dashed border-line" />
                  <div className="flex justify-between text-[10px] font-semibold text-ink">
                    <span>Total</span>
                    <span className="tabular-nums">₦863,500</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Reveal>
      )}

      {/* Stage: review */}
      {stage === "review" && (
        <>
          <Reveal delay={80}>
            <Alert className="mt-8 rounded-2xl border-amber/30 bg-amber-soft/40 text-foreground">
              <Check className="size-4 text-amber" />
              <AlertTitle className="font-display text-lg">Extraction complete</AlertTitle>
              <AlertDescription className="text-sm text-ink-2">
                All fields look good. Edit anything that&apos;s off, then file
                the receipt to your household.
              </AlertDescription>
            </Alert>
          </Reveal>

          <Reveal delay={140}>
            <div className="mt-6 grid lg:grid-cols-5 gap-4">
              {/* Left: extracted fields form */}
              <Card className="lg:col-span-3 border-line bg-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <p className="eyebrow text-amber">Review &amp; edit</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={rerunExtraction}
                      className="rounded-full text-ink hover:bg-muted"
                    >
                      <Refresh size={12} />
                      Re-run extraction
                    </Button>
                  </div>
                  <div className="mt-4 space-y-4">
                    {extracted.map((f, idx) => (
                      <div key={f.label}>
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`f-${idx}`} className="eyebrow text-ink-3">
                            {f.label}
                          </Label>
                          <span className="font-mono text-[10px] text-moss tracking-[0.1em]">
                            {f.confidence}%
                          </span>
                        </div>
                        <Input
                          id={`f-${idx}`}
                          defaultValue={f.value}
                          className="mt-1.5 bg-background border-border"
                        />
                      </div>
                    ))}
                    <div>
                      <Label htmlFor="deadline" className="eyebrow text-ink-3">
                        Inferred deadline
                      </Label>
                      <Input
                        id="deadline"
                        defaultValue="Jun 28, 2026"
                        className="mt-1.5 bg-background border-border"
                      />
                      <p className="text-[11px] text-muted-foreground mt-1.5">
                        15-day electronics return policy · Best Buy
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="notes" className="eyebrow text-ink-3">
                        Notes
                      </Label>
                      <Textarea
                        id="notes"
                        rows={3}
                        placeholder="Anything to remember about this purchase…"
                        className="mt-1.5 bg-background border-border"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Right: receipt preview + actions */}
              <div className="lg:col-span-2 space-y-4">
                <Card className="border-line bg-card">
                  <CardContent className="p-6">
                    <p className="eyebrow text-ink-3 flex items-center gap-2">
                      <ScanText className="size-3.5" />
                      Source
                    </p>
                    <div className="mt-4 flex justify-center">
                      <div className="receipt p-5 w-full max-w-[220px]">
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
                  </CardContent>
                </Card>
                <Card className="border-line bg-card">
                  <CardContent className="p-6 space-y-2">
                    <Button
                      onClick={fileReceipt}
                      disabled={pending}
                      className="w-full rounded-full bg-ink text-paper hover:bg-ink/90"
                    >
                      <Check size={14} />
                      {pending ? "Filing…" : "File receipt"}
                    </Button>
                    <Button asChild variant="ghost" className="w-full rounded-full text-ink-2 hover:bg-muted">
                      <Link href="/items">Save &amp; file another</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setStage("capture")}
                      className="w-full rounded-full text-muted-foreground hover:bg-muted"
                    >
                      <Close size={14} />
                      Discard
                    </Button>
                    {fileError && (
                      <p className="text-xs text-[hsl(0_56%_39%)] pt-1">{fileError}</p>
                    )}
                  </CardContent>
                </Card>
                <Alert className="rounded-xl border-border bg-paper-2">
                  <Warning className="size-4 text-ink-3" />
                  <AlertDescription className="text-xs text-ink-2 leading-relaxed">
                    The demo receipt pre-fills the fields above. Filing writes
                    to your household ledger and queues the first alert.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </Reveal>
        </>
      )}

      {/* Footer note */}
      <Reveal delay={200}>
        <div className="mt-12 pt-6 border-t border-line text-xs text-muted-foreground">
          <p>
            Stuck on a blurry photo? Re-shoot in even light and avoid glare.
            Keepwise asks for a fresh capture rather than guessing on a bad
            read.
          </p>
        </div>
      </Reveal>
    </div>
  );
}

function Step({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 text-ink-2">
      <div
        className={`size-4 rounded-full inline-flex items-center justify-center ${
          done ? "bg-moss text-white" : "bg-muted text-muted-foreground"
        }`}
      >
        {done ? <Check size={10} /> : null}
      </div>
      <span className={done ? "text-foreground" : ""}>{label}</span>
    </div>
  );
}
