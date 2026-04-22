"use client";

import { ErrorBoundary } from "@/components/ui/error-boundary";

export default function RequestsError({
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
      title="Failed to load requests"
      description="We couldn't load the requests list. Please try again."
    />
  );
}
