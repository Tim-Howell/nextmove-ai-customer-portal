"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { showError } from "@/lib/toast";

export function AccessDeniedToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error === "access_denied") {
      showError("You don't have permission to access that page.");
      // Remove the error param from URL
      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      router.replace(url.pathname);
    }
  }, [error, router]);

  return null;
}
