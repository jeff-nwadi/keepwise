"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { StatusPill } from "../../_components/status-pill";
import { type Item, formatDeadlineDate } from "../../_data/item-helpers";
import {
  ArrowRight,
  ArrowSquareRight,
  Bell,
  Check,
  Crown,
  Edit,
  Info,
  Logout,
  People,
  Plus,
  Setting,
  User,
  Warning,
} from "../../_components/icons";

const HOUSEHOLD = [
  { id: "you", name: "You", email: "you@keepwise.app", role: "Owner", initial: "Y" },
];

const SCHEDULE_OPTIONS = [
  { id: "default", label: "7 days + 1 day before", note: "Recommended · covers the close-in window" },
  { id: "30day", label: "30 days before only", note: "Less noise, easier inbox" },
  { id: "custom", label: "Custom per item", note: "Override the schedule on individual receipts" },
];

export function SettingsTabs({ items }: { items: Item[] }) {
  return (
    <div className="mt-8">
      <Tabs defaultValue="household" className="w-full flex-col">
        <TabsList className="w-full sm:w-fit inline-flex bg-muted/60 rounded-full p-1">
          <TabsTrigger
            value="household"
            className="rounded-full data-[state=active]:bg-ink data-[state=active]:text-paper"
          >
            <People size={14} />
            Household
          </TabsTrigger>
          <TabsTrigger
            value="alerts"
            className="rounded-full data-[state=active]:bg-ink data-[state=active]:text-paper"
          >
            <Bell size={14} />
            Alerts
          </TabsTrigger>
          <TabsTrigger
            value="billing"
            className="rounded-full data-[state=active]:bg-ink data-[state=active]:text-paper"
          >
            <Crown size={14} />
            Billing
          </TabsTrigger>
        </TabsList>

        {/* === HOUSEHOLD === */}
        <TabsContent value="household" className="mt-6">
          <div className="grid lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2 border-line bg-card">
              <CardContent className="p-6">
                <p className="eyebrow text-ink-3">Household name</p>
                <Input
                  defaultValue="Our apartment"
                  className="mt-2 bg-background border-border"
                />
                <p className="text-[11px] text-muted-foreground mt-1.5">
                  Used in the in-app switcher and in shared alert emails.
                </p>

                <Separator className="my-6" />

                <div className="flex items-center justify-between">
                  <p className="eyebrow text-ink-3">Members</p>
                  <Button
                    size="sm"
                    disabled
                    className="rounded-full bg-ink text-paper hover:bg-ink/90"
                  >
                    <Plus size={12} />
                    Invite member
                  </Button>
                </div>
                <ul className="mt-3 space-y-2">
                  {HOUSEHOLD.map((m) => (
                    <li
                      key={m.id}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-line bg-background"
                    >
                      <Avatar className="size-9">
                        <AvatarFallback className="bg-secondary text-foreground font-medium text-sm">
                          {m.initial}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-foreground truncate">{m.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {m.email}
                        </p>
                      </div>
                      <Badge variant="secondary" className="rounded-full bg-muted text-muted-foreground">
                        {m.role}
                      </Badge>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 rounded-xl border border-amber/30 bg-amber-soft/40 p-4 flex items-start gap-3">
                  <Crown size={16} className="text-amber mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-foreground">
                      Keepwise+ lets up to 5 people share one household
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Everyone sees the same receipts and gets the same alerts.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card className="border-line bg-card">
                <CardContent className="p-6">
                  <p className="eyebrow text-ink-3">Your profile</p>
                  <div className="mt-3 flex items-center gap-3">
                    <Avatar className="size-12">
                      <AvatarFallback className="bg-secondary text-foreground font-medium">
                        Y
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm text-foreground truncate">You</p>
                      <p className="text-[11px] text-muted-foreground truncate">you@keepwise.app</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full rounded-full border-line bg-background hover:bg-muted"
                  >
                    <User size={12} />
                    Edit profile
                  </Button>
                </CardContent>
              </Card>
              <Card className="border-line bg-card">
                <CardContent className="p-6">
                  <p className="eyebrow text-ink-3">Sign out</p>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    End this session on this device. Receipts stay safe in your household.
                  </p>
                  <Button asChild variant="ghost" size="sm" className="mt-4 w-full rounded-full text-ink-2 hover:bg-muted justify-start">
                    <Link href="/sign-in">
                      <Logout size={12} />
                      Sign out
                      <ArrowSquareRight size={12} className="ml-auto" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* === ALERTS === */}
        <TabsContent value="alerts" className="mt-6">
          <div className="grid lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2 border-line bg-card">
              <CardContent className="p-6">
                <p className="eyebrow text-ink-3">Channels</p>
                <div className="mt-3 space-y-3">
                  <ChannelToggle
                    icon={<Bell size={14} />}
                    title="Email"
                    note="Daily digest at 8am in your local timezone"
                    defaultOn
                  />
                  <ChannelToggle
                    icon={<Info size={14} />}
                    title="In-app"
                    note="Bell icon shows queued alerts on the items dashboard"
                    defaultOn
                  />
                  <ChannelToggle
                    icon={<Setting size={14} />}
                    title="Browser push"
                    note="For items closing in the next 48 hours"
                    defaultOn={false}
                  />
                </div>

                <Separator className="my-6" />

                <p className="eyebrow text-ink-3">Default schedule</p>
                <p className="text-xs text-muted-foreground mt-1">
                  We&apos;ll queue a heads-up for every receipt using this
                  schedule unless you override per item.
                </p>
                <div className="mt-3 space-y-2">
                  {SCHEDULE_OPTIONS.map((opt, idx) => (
                    <label
                      key={opt.id}
                      className="flex items-start gap-3 px-4 py-3 rounded-xl border border-line bg-background cursor-pointer hover:bg-muted/40 transition-colors has-[input:checked]:border-ink has-[input:checked]:bg-muted/60"
                    >
                      <input
                        type="radio"
                        name="schedule"
                        defaultChecked={idx === 0}
                        className="mt-1 accent-ink"
                      />
                      <div>
                        <p className="text-sm text-foreground">{opt.label}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {opt.note}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>

                <Separator className="my-6" />

                <p className="eyebrow text-ink-3">Per-item overrides</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Snooze a specific receipt or change the channel for one
                  item. The default above applies to everything else.
                </p>
                <ul className="mt-3 rounded-xl border border-line bg-background divide-y divide-border">
                  {items.slice(0, 4).map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-3 px-4 py-3"
                    >
                      <div className="size-7 rounded-lg bg-secondary text-foreground flex items-center justify-center text-xs font-display shrink-0">
                        {item.merchantInitial}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-foreground truncate">
                          {item.itemName}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {formatDeadlineDate(item.deadline)}
                        </p>
                      </div>
                      <StatusPill item={item} />
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="rounded-full text-ink-2 hover:bg-muted"
                      >
                        <Link href={`/items/${item.id}`}>
                          <Edit size={12} />
                        </Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card className="border-line bg-card">
                <CardContent className="p-6">
                  <p className="eyebrow text-ink-3">Quiet hours</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    We&apos;ll batch non-urgent alerts into a single digest.
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="from" className="eyebrow text-ink-3">
                        From
                      </Label>
                      <Input
                        id="from"
                        defaultValue="9:00 PM"
                        className="mt-1.5 bg-background border-border"
                      />
                    </div>
                    <div>
                      <Label htmlFor="to" className="eyebrow text-ink-3">
                        To
                      </Label>
                      <Input
                        id="to"
                        defaultValue="7:00 AM"
                        className="mt-1.5 bg-background border-border"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-line bg-card">
                <CardContent className="p-6">
                  <p className="eyebrow text-ink-3">Snooze defaults</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    When you snooze from an item, this is what we use.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {["1 day", "3 days", "7 days", "30 days"].map((d, idx) => (
                      <span
                        key={d}
                        className={`rounded-full px-3 py-1 text-xs ${
                          idx === 2
                            ? "bg-ink text-paper"
                            : "border border-line bg-background text-ink-2"
                        }`}
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* === BILLING === */}
        <TabsContent value="billing" className="mt-6">
          <div className="grid lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2 border-line bg-card">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow text-ink-3">Current plan</p>
                    <p className="font-display text-3xl text-foreground mt-2">
                      Free
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {items.length} of 5 items used · 1 member
                    </p>
                  </div>
                  <Badge variant="secondary" className="rounded-full bg-muted text-muted-foreground">
                    Active
                  </Badge>
                </div>

                <Separator className="my-6" />

                <p className="eyebrow text-ink-3">Usage</p>
                <div className="mt-3 space-y-3">
                  <UsageBar label="Items" used={items.length} max={5} />
                  <UsageBar label="Members" used={1} max={1} />
                  <UsageBar label="Alerts sent this month" used={12} max={50} />
                </div>

                <Separator className="my-6" />

                <p className="eyebrow text-ink-3">Billing history</p>
                <div className="mt-3 rounded-xl border border-dashed border-line bg-background p-6 text-center">
                  <p className="text-sm text-foreground">No charges yet</p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Upgrade to Keepwise+ to start a billing history.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-line bg-ink text-paper">
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Crown size={14} className="text-amber" />
                  <p className="eyebrow text-amber">Keepwise+</p>
                </div>
                <p className="font-display text-4xl text-paper mt-4">
                  $4<span className="text-base text-ink-2 font-sans">/mo</span>
                </p>
                <p className="text-xs text-ink-2 mt-1">
                  Billed monthly. Cancel anytime.
                </p>
                <ul className="mt-5 space-y-2 text-sm">
                  <Feature>Unlimited receipts &amp; items</Feature>
                  <Feature>Up to 5 household members</Feature>
                  <Feature>CSV export for taxes</Feature>
                  <Feature>Priority support</Feature>
                </ul>
                <Button
                  disabled
                  className="mt-6 w-full rounded-full bg-paper text-ink hover:bg-paper/90"
                >
                  Coming soon
                  <ArrowRight size={14} />
                </Button>
                <p className="text-[11px] text-ink-2 mt-3 leading-relaxed">
                  Demo: the upgrade flow isn&apos;t wired. We&apos;ll route
                  to Stripe when payments are enabled.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 rounded-xl border border-line bg-card p-5 flex items-start gap-3">
            <Warning size={16} className="text-ink-3 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-foreground">No silent charges</p>
              <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                Free plan stays free forever for up to 5 items. We&apos;ll
                ask before charging — never auto-upgrade.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ChannelToggle({
  icon,
  title,
  note,
  defaultOn,
}: {
  icon: React.ReactNode;
  title: string;
  note: string;
  defaultOn: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-line bg-background">
      <div className="flex items-center gap-3 min-w-0">
        <div className="size-8 rounded-lg bg-secondary text-foreground inline-flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm text-foreground">{title}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{note}</p>
        </div>
      </div>
      <Switch defaultChecked={defaultOn} />
    </div>
  );
}

function UsageBar({ label, used, max }: { label: string; used: number; max: number }) {
  const pct = Math.min(100, (used / max) * 100);
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-foreground">{label}</span>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {used} / {max}
        </span>
      </div>
      <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-ink"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2 text-paper/90">
      <Check size={14} className="text-amber shrink-0" />
      <span>{children}</span>
    </li>
  );
}