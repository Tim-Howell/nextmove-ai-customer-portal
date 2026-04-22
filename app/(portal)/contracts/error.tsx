"use client";

import { ErrorBoundary } from "@/components/ui/error-boundary";

export default function ContractsError({
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
      title="Failed to load contracts"
      description="We couldn't load the contracts list. Please try again."
    />
  );
}
