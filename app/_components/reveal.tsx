"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Wraps a block of content and reveals it once it scrolls into view.
// Uses IntersectionObserver and disconnects after the first reveal — no
// continuous observation, no re-hide on scroll-up. The CSS `.reveal`
// + `.is-revealed` classes in globals.css drive the actual transition.
//
// Props:
//   delay    — stagger multiple Reveals inside one section (ms)
//   as       — wrapper element (defaults to <div>)
//   className — additional utility classes for layout/spacing
//
// Reduced motion is handled globally in globals.css — the reveal class
// forces opacity 1 + transform 0 under @media (prefers-reduced-motion).

type Props = {
  children: ReactNode;
  delay?: number;
  as?: "div" | "section" | "article" | "ul" | "li";
  className?: string;
};

export function Reveal({ children, delay = 0, as: Tag = "div", className = "" }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={`reveal ${shown ? "is-revealed" : ""} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
