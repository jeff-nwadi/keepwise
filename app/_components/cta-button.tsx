import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "./icons";

// Two button variants. Primary is the dark ink fill; ghost is outlined for
// secondary actions. Both share the same hover/transition language.

type Props = {
  href: string;
  variant?: "primary" | "ghost";
  children: ReactNode;
  withArrow?: boolean;
  className?: string;
};

export function CTA({ href, variant = "primary", children, withArrow, className = "" }: Props) {
  const base =
    "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber";
  const styles =
    variant === "primary"
      ? "bg-ink text-paper hover:bg-ink-2 hover:-translate-y-px hover:shadow-lg"
      : "border border-line text-ink hover:bg-paper-2";
  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      {children}
      {withArrow && <ArrowRight className="size-4" />}
    </Link>
  );
}
