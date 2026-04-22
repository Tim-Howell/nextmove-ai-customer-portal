"use client";

import { ErrorBoundary } from "@/components/ui/error-boundary";

export default function CustomersError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorBoundary
      error={error}
      reset={reset}
      title="Failed to load customers"
      description="We couldn't load the customers list. Please try again."
    />
  );
}
