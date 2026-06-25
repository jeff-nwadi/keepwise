// Sign-out menu item. Renders as a Radix DropdownMenu.Item — meaning it
// inherits the menu's data-state styling and keyboard nav. Clicking it
// calls Better Auth's signOut, then navigates to /sign-in.

"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Logout } from "./icons";
import { authClient } from "@/lib/auth-client";

export function SignOutMenuItem() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await authClient.signOut();
          router.push("/sign-in");
          router.refresh();
        })
      }
      className="relative flex w-full cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground data-[highlighted]:bg-muted data-[highlighted]:text-foreground disabled:opacity-50"
    >
      <Logout size={14} />
      <span>{pending ? "Signing out…" : "Sign out"}</span>
    </button>
  );
}