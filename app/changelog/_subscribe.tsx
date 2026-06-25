"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "../_components/icons";

// Subscribe form — client island. The page itself stays a Server Component
// so it can export metadata.
export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (email.includes("@")) setSubscribed(true);
      }}
      className="flex items-center gap-2"
    >
      {subscribed ? (
        <span className="text-sm text-foreground inline-flex items-center gap-2">
          <Check size={14} className="text-moss" />
          Got it — we&apos;ll email you when something ships.
        </span>
      ) : (
        <>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-ink transition-colors"
          />
          <Button type="submit" className="rounded-full bg-ink text-paper hover:bg-ink/90">
            Subscribe
            <ArrowRight size={12} />
          </Button>
        </>
      )}
    </form>
  );
}
