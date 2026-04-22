"use client";

import { ErrorBoundary } from "@/components/ui/error-boundary";

export default function PrioritiesError({
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
      title="Failed to load priorities"
      description="We couldn't load the priorities list. Please try again."
    />
  );
}
