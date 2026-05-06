import { getImpersonationContext } from "@/lib/supabase/profile";
import { exitCustomerView } from "@/app/actions/impersonation";
import { Eye } from "lucide-react";

/**
 * Sticky banner rendered at the top of the portal shell whenever an admin
 * is in "View as Customer" preview mode. Renders nothing otherwise.
 *
 * Lives outside the customer-shell role-gating because the banner needs
 * to know about the *real* admin identity, not the synthesized profile.
 */
export async function ImpersonationBanner() {
  const ctx = await getImpersonationContext();
  if (!ctx) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="sticky top-0 z-50 w-full border-b border-amber-300 bg-amber-100 text-amber-900"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 text-sm">
        <div className="flex items-center gap-2 min-w-0">
          <Eye className="h-4 w-4 shrink-0" aria-hidden="true" />
          <p className="truncate">
            <span className="font-medium">Customer view:</span>{" "}
            <span className="truncate">
              previewing as{" "}
              <span className="font-semibold">{ctx.customer.name}</span>
            </span>
            <span className="ml-2 hidden sm:inline text-amber-900/70">
              · changes are disabled
            </span>
          </p>
        </div>
        <form action={exitCustomerView}>
          <button
            type="submit"
            className="shrink-0 rounded-md border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900 transition-colors hover:bg-amber-200 focus-visible:outline-2 focus-visible:outline-amber-600"
          >
            Exit preview
          </button>
        </form>
      </div>
    </div>
  );
}
