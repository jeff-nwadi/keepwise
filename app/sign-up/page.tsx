"use client";

import { Suspense, useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Label } from "@/components/ui/label";
import { Reveal } from "../_components/reveal";
import { ArrowRight, Check, Lock, Sms, User as UserIcon, Eye, EyeOff } from "../_components/icons";
import {
  signUpWithPassword,
  type SignInState as SignUpState,
} from "../(app)/sign-in-actions";

const initial: SignUpState = null;

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams?.get("next") ?? "";

  const { data: session, isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const sessionData = await authClient.getSession();
      return sessionData?.data?.user ?? null;

    },
  });

  if (isLoading) {
    return (
      <Suspense fallback={<SignUpSkeleton />}>
        <SignUpInner />
      </Suspense>
    );
  }

  if (session) {
    return <RedirectTo href={decodeURIComponent(next) || "/items"} />;
  }

  return (
    <Suspense fallback={<SignUpSkeleton />}>
      <SignUpInner />
    </Suspense>
  );
}

function SignUpSkeleton() {
  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-10 lg:p-14 bg-paper-2 border-r border-line relative overflow-hidden" />
      <div className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
        <div className="w-full max-w-md">
          <Card className="border-line bg-card">
            <CardContent className="p-7 sm:p-9">
              <p className="eyebrow text-ink-3">Create your account</p>
              <h2 className="font-display text-3xl text-ink mt-2">Welcome to Keepwise</h2>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SignUpInner() {
  const [state, action, pending] = useActionState(signUpWithPassword, initial);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      {/* Left: brand panel */}
      <div className="hidden lg:flex flex-col justify-between p-10 lg:p-14 bg-paper-2 border-r border-line relative overflow-hidden">
        <Link
          href="/"
          className="font-display text-2xl text-ink tracking-tight hover:opacity-80 transition-opacity"
        >
          Keepwise<span className="text-amber">.</span>
        </Link>

        <Reveal>
          <div className="max-w-md">
            <p className="eyebrow text-amber">New here</p>
            <h1 className="font-display text-5xl text-ink leading-[1.05] mt-3">
              Start your household ledger.
            </h1>
            <p className="text-base text-ink-2 mt-4 leading-relaxed">
              One account covers up to five tracked items on the Free plan.
              Snap a receipt, get a deadline inferred, and let Keepwise tell
              you only when it matters.
            </p>

            <ul className="mt-8 space-y-3">
              {[
                "Snap a receipt — deadline inferred in seconds.",
                "Five items free. Invite your partner on Plus.",
                "Alerts by email and in-app, never silent charges.",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3 text-sm text-ink-2">
                  <span className="mt-0.5 size-5 rounded-full bg-amber-soft/60 text-amber inline-flex items-center justify-center shrink-0">
                    <Check size={12} />
                  </span>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <p className="text-[11px] text-ink-3 tracking-[0.04em]">
          Keepwise · A quiet way to keep what you bought
        </p>
      </div>

      {/* Right: form */}
      <div className="flex items-center justify-center p-6 sm:p-10 lg:p-14">
        <Reveal delay={60} className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link
              href="/"
              className="font-display text-2xl text-ink tracking-tight hover:opacity-80 transition-opacity"
            >
              Keepwise<span className="text-amber">.</span>
            </Link>
          </div>

          <Card className="border-line bg-card">
            <CardContent className="p-7 sm:p-9">
              <p className="eyebrow text-ink-3">Create your account</p>
              <h2 className="font-display text-3xl text-ink mt-2">
                Welcome to Keepwise
              </h2>
              <p className="text-sm text-ink-2 mt-2">
                Free for your first five items. No card required.
              </p>

              <form action={action} className="mt-7 space-y-4">
                <div>
                  <Label htmlFor="name" className="eyebrow text-ink-3">
                    Your name
                  </Label>
                  <div className="mt-1.5 flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background focus-within:border-ink transition-colors">
                    <UserIcon size={14} className="text-ink-3" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      minLength={1}
                      maxLength={80}
                      autoComplete="name"
                      placeholder="Bola Adesanmi"
                      className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="eyebrow text-ink-3">
                    Email
                  </Label>
                  <div className="mt-1.5 flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background focus-within:border-ink transition-colors">
                    <Sms size={14} className="text-ink-3" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                      className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password" className="eyebrow text-ink-3">
                    Password
                  </Label>
                  <div className="mt-1.5 flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background focus-within:border-ink transition-colors">
                    <Lock size={14} className="text-ink-3" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      placeholder="At least 8 characters"
                      className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="text-ink-3 hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1.5">
                    8+ characters. Use a phrase you&apos;ll remember.
                  </p>
                </div>

                {state?.error && (
                  <p className="text-xs text-[hsl(0_56%_39%)]">{state.error}</p>
                )}

                <Button
                  type="submit"
                  disabled={pending}
                  className="w-full rounded-full bg-ink text-paper hover:bg-ink/90"
                >
                  {pending ? (
                    <>
                      <span className="inline-block size-3 rounded-full border-2 border-paper/30 border-t-paper animate-spin" />
                      Creating account…
                    </>
                  ) : (
                    <>
                      Create account
                      <ArrowRight size={14} />
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  <Lock size={11} className="inline-block mr-1 -mt-0.5" />
                  Sessions expire after 7 days of inactivity.
                </p>
              </form>
            </CardContent>
          </Card>

          <p className="text-sm text-ink-2 text-center mt-6">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-ink underline underline-offset-4 decoration-line hover:decoration-ink transition-colors"
            >
              Sign in
            </Link>
          </p>

          <p className="text-[11px] text-muted-foreground text-center mt-8 leading-relaxed">
            By continuing you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-2 hover:text-foreground">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
              Privacy Policy
            </Link>
            .
          </p>
        </Reveal>
      </div>
    </div>
  );
}

function RedirectTo({ href }: { href: string }) {
  const router = useRouter();

  const { data: session } = useQuery({
    queryKey: ["redirect-check"],
    queryFn: async () => {
      const sessionData = await authClient.getSession();
      return sessionData?.data?.user ?? null;
    },
  });

  useEffect(() => {
    if (session) {
      router.push(href);
    }
  }, [session, router, href]);

  return null;
}