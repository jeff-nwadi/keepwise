"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "better-auth/react";
import { useRouter as useNextRouter } from "next/navigation";

interface RedirectIfAuthenticatedProps {
  children?: React.ReactNode;
  redirectTo?: string;
}

export function RedirectIfAuthenticated({ 
  children, 
  redirectTo = "/items" 
}: RedirectIfAuthenticatedProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const nextRouter = useNextRouter();

  useEffect(() => {
    if (status === "authenticated") {
      // Redirect to the intended page or home
      router.push(redirectTo);
    }
  }, [status, router, redirectTo]);

  if (status === "loading") {
    return null; // or return a loading spinner if you want to show it during redirect
  }

  // If not authenticated, render children (the form)
  return children || null;
}
