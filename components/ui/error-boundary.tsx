"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  description?: string;
}

export function ErrorBoundary({ 
  error, 
  reset, 
  title = "Something went wrong",
  description = "An error occurred while loading this page."
}: ErrorBoundaryProps) {
  useEffect(() => {
    console.error("Error boundary caught:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground">
          <p>{description}</p>
          {process.env.NODE_ENV === "development" && error.message && (
            <p className="mt-2 text-sm font-mono bg-muted p-2 rounded text-left overflow-auto max-h-32">
              {error.message}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={reset} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
