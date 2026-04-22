"use client";

import { ErrorBoundary } from "@/components/ui/error-boundary";

export default function TimeLogsError({
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
      title="Failed to load time logs"
      description="We couldn't load the time logs. Please try again."
    />
  );
}
