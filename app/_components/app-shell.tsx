import Link from "next/link";
import type { ReactNode } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Home,
  Plus,
  Setting,
  Upload,
  User,
} from "./icons";
import { SignOutMenuItem } from "./sign-out-button";

// Shared chrome for the in-app product surfaces (items dashboard, item
// detail, upload, settings). The marketing landing uses its own Nav and
// footer in app/page.tsx — they have different copy/links.
//
// Layout: slim sticky header with the wordmark on the left, primary nav
// in the middle, and an avatar + bell on the right. Page content lives
// in a single centered column. A condensed footer at the bottom shows
// the legal/utility links.

type NavLink = { href: string; label: string; icon: React.ComponentType<{ size?: number | string }> };

const NAV_LINKS: NavLink[] = [
  { href: "/items", label: "Items", icon: Home },
  { href: "/upload", label: "Upload", icon: Upload },
  { href: "/settings", label: "Settings", icon: Setting },
];

type Identity = {
  initials: string;
  name: string;
  email: string;
  unreadCount: number;
};

export function AppShell({
  children,
  current,
  identity,
}: {
  children: ReactNode;
  current?: string;
  identity: Identity;
}) {
  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-paper/80 border-b border-line">
        <div className="mx-auto max-w-6xl px-6 lg:px-10 h-14 flex items-center justify-between gap-6">
          <Link
            href="/items"
            className="font-display text-lg text-ink tracking-tight hover:opacity-80 transition-opacity"
          >
            Keepwise<span className="text-amber">.</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const active = current === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-colors ${
                    active
                      ? "bg-ink text-paper"
                      : "text-ink-2 hover:text-ink hover:bg-paper-2"
                  }`}
                >
                  <Icon size={14} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/upload"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-ink text-paper px-3.5 py-1.5 text-sm font-medium hover:bg-ink-2 transition-colors"
            >
              <Plus size={14} />
              Add receipt
            </Link>
            <button
              type="button"
              aria-label="Notifications"
              className="relative inline-flex items-center justify-center size-8 rounded-full text-ink-2 hover:text-ink hover:bg-paper-2 transition-colors"
            >
              <Bell size={16} />
              {identity.unreadCount > 0 ? (
                <span className="absolute top-1.5 right-1.5 min-w-3.5 h-3.5 px-1 rounded-full bg-amber text-[9px] font-medium text-ink flex items-center justify-center">
                  {identity.unreadCount > 9 ? "9+" : identity.unreadCount}
                </span>
              ) : null}
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Account menu"
                  className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
                >
                  <Avatar className="size-8 border border-line">
                    <AvatarFallback className="bg-paper-2 text-ink text-xs font-medium">
                      {identity.initials}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-popover border-border">
                <DropdownMenuLabel className="font-normal">
                  <p className="text-sm font-medium text-foreground">{identity.name || "Signed in"}</p>
                  <p className="text-xs text-muted-foreground">{identity.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <User size={14} />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Setting size={14} />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <SignOutMenuItem />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-line bg-paper">
        <div className="mx-auto max-w-6xl px-6 lg:px-10 py-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-ink-3 tracking-[0.04em]">
            © 2026 Keepwise Labs
          </p>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/changelog" className="text-xs text-ink-3 hover:text-ink-2 transition-colors">
              Changelog
            </Link>
            <Link href="/privacy" className="text-xs text-ink-3 hover:text-ink-2 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-xs text-ink-3 hover:text-ink-2 transition-colors">
              Terms
            </Link>
            <Link href="/" className="text-xs text-ink-3 hover:text-ink-2 transition-colors">
              Marketing
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
