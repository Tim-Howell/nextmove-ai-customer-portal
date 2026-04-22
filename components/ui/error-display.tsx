"use client";

import { AlertCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  error: string;
  code?: string;
  title?: string;
  onDismiss?: () => void;
  variant?: "default" | "destructive" | "inline";
}

export function ErrorDisplay({
  error,
  code,
  title = "Error",
  onDismiss,
  variant = "default",
}: ErrorDisplayProps) {
  const isDev = process.env.NODE_ENV === "development";

  if (variant === "inline") {
    return (
      <p className="text-sm text-destructive flex items-center gap-1">
        <AlertCircle className="h-4 w-4" />
        {error}
        {isDev && code && (
          <span className="text-xs text-muted-foreground ml-1">({code})</span>
        )}
      </p>
    );
  }

  return (
    <div className="relative p-4 border border-destructive/50 bg-destructive/10 rounded-md">
      {onDismiss && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-6 w-6 p-0"
          onClick={onDismiss}
        >
          <XCircle className="h-4 w-4" />
        </Button>
      )}
      <div className="flex gap-3">
        <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
        <div>
          <h4 className="font-medium text-destructive">{title}</h4>
          <p className="text-sm text-destructive/90 mt-1">
            {error}
            {isDev && code && (
              <span className="block text-xs mt-1 opacity-70">
                Error code: {code}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

interface FormErrorProps {
  error?: string;
  code?: string;
}

export function FormError({ error, code }: FormErrorProps) {
  if (!error) return null;

  return (
    <ErrorDisplay
      error={error}
      code={code}
      variant="inline"
    />
  );
}

interface ActionErrorProps {
  error?: string;
  code?: string;
  onRetry?: () => void;
}

export function ActionError({ error, code, onRetry }: ActionErrorProps) {
  if (!error) return null;

  return (
    <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
      <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
      <span className="text-sm text-destructive flex-1">{error}</span>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      )}
      {process.env.NODE_ENV === "development" && code && (
        <span className="text-xs text-muted-foreground">({code})</span>
      )}
    </div>
  );
}
