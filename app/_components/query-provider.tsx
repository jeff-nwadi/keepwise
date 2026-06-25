"use client";

// Client-side wrapper around @tanstack/react-query's QueryClientProvider.
// Owns the QueryClient instance so it's instantiated on the client (and
// not passed across the Server -> Client boundary, which is forbidden
// because QueryClient is a class instance).
//
// Rendered by app/layout.tsx (a server component).

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function QueryProvider({ children }: { children: ReactNode }) {
  // useState ensures a single client per browser tab across re-renders.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}