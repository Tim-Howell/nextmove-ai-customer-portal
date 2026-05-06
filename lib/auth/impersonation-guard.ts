import { getViewAsCustomerId } from "./impersonation";
import { getRealProfile } from "@/lib/supabase/profile";

/**
 * Standard error message rendered to the user when a mutation is blocked
 * because the admin is currently in "View as Customer" preview mode.
 */
export const IMPERSONATION_READ_ONLY_MESSAGE =
  "Preview mode is read-only. Exit the customer view to make changes.";

/**
 * Returns `true` when the caller is currently impersonating a customer.
 * Use this from server actions whose return type is a result object to
 * surface a friendly error in the UI:
 *
 *   if (await isImpersonating()) {
 *     return { error: IMPERSONATION_READ_ONLY_MESSAGE };
 *   }
 */
export async function isImpersonating(): Promise<boolean> {
  const real = await getRealProfile();
  if (!real || real.role !== "admin") return false;
  const viewAsId = await getViewAsCustomerId();
  return Boolean(viewAsId);
}

/**
 * Throws when the caller is currently impersonating. Use from server
 * actions that already throw on error rather than returning a result
 * object, or wrap with try/catch and surface the message.
 */
export async function assertNotImpersonating(): Promise<void> {
  if (await isImpersonating()) {
    throw new Error(IMPERSONATION_READ_ONLY_MESSAGE);
  }
}
