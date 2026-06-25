// Sign-out. One click handler, two renderers:
//
//   <SignOutButton />              — plain button. Used by the Settings
//                                   page's "Sign out" card.
//   <SignOutMenuItem />            — Radix DropdownMenu.Item. Used by
//                                   the avatar menu in AppShell.
//
// Both call Better Auth's signOut(), then navigate to /sign-in and
// force a server refresh so the (app) layout re-runs without a session
// and the proxy bounces to /sign-in if the user clicks "back".

"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Logout } from "./icons";
import { authClient } from "@/lib/auth-client";

// Shared click handler — both renderers use this. Keeps the side
// effects in one place: clear the server-side session, then redirect
// to /sign-in, then force the server tree to re-render.
function useSignOut() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return {
    pending,
    signOut: () =>
      startTransition(async () => {
        await authClient.signOut();
        router.push("/sign-in");
        router.refresh();
      }),
  };
}

// --- Plain button ----------------------------------------------------------

export function SignOutButton({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { pending, signOut } = useSignOut();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={signOut}
      className={
        className ??
        "relative flex w-full cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground data-[highlighted]:bg-muted data-[highlighted]:text-foreground disabled:opacity-50"
      }
    >
      <Logout size={14} />
      <span>{pending ? "Signing out…" : children ?? "Sign out"}</span>
    </button>
  );
}

// --- Dropdown menu item (avatar menu) -------------------------------------

export function SignOutMenuItem() {
  const { pending, signOut } = useSignOut();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={signOut}
      className="relative flex w-full cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground data-[highlighted]:bg-muted data-[highlighted]:text-foreground disabled:opacity-50"
    >
      <Logout size={14} />
      <span>{pending ? "Signing out…" : "Sign out"}</span>
    </button>
  );
}
