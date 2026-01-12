"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Providers({ children }) {
  // Create a client inside the component to ensure it persists across re-renders
  // but is unique per request on the server (if we were using SSR features, though this is client-side mostly)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Cache data for 5 minutes
            staleTime: 5 * 60 * 1000,
            // Refetch on window focus for fresh data
            refetchOnWindowFocus: true,
            // Don't retry immediately on error to avoid spamming if auth fails
            retry: 1,
            refetchOnMount: true,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
