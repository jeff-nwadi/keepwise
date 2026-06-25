import Link from "next/link";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-paper/75 border-b border-line">
      <div className="mx-auto max-w-6xl px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-xl text-ink tracking-tight hover:opacity-80 transition-opacity"
        >
          Keepwise<span className="text-amber">.</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
          <Link
            href="#how-it-works"
            className="text-sm text-ink-2 hover:text-ink transition-colors"
          >
            How it works
          </Link>
          <Link
            href="#pricing"
            className="text-sm text-ink-2 hover:text-ink transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="#alerts"
            className="text-sm text-ink-2 hover:text-ink transition-colors"
          >
            Alerts
          </Link>
        </nav>

        <Link
          href="/sign-in"
          className="inline-flex items-center gap-2 rounded-full bg-ink text-paper px-4 py-2 text-sm font-medium hover:bg-ink-2 transition-colors"
        >
          Get started
        </Link>
      </div>
    </header>
  );
}
