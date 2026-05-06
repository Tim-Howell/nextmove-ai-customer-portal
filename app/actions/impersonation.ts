"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getRealProfile } from "@/lib/supabase/profile";
import { createClient } from "@/lib/supabase/server";
import {
  setViewAsCustomerCookie,
  clearViewAsCustomerCookie,
  getViewAsCustomerId,
} from "@/lib/auth/impersonation";

/**
 * Server actions for the "View as Customer" feature.
 *
 * These actions deliberately use `getRealProfile()` (never `getProfile()`)
 * because they make decisions based on the admin's true identity, not on
 * the synthesized customer-view profile.
 */

export interface ImpersonationActionResult {
  success?: true;
  error?: string;
}

/**
 * Enter customer-view mode. Verifies caller is a real admin and that the
 * target customer exists, sets the cookie, and redirects to /dashboard so
 * the layout re-renders with the customer-user shell.
 */
export async function enterCustomerView(
  customerId: string
): Promise<ImpersonationActionResult> {
  const real = await getRealProfile();
  if (!real || real.role !== "admin") {
    return { error: "Only admins can use customer view." };
  }

  if (!customerId || typeof customerId !== "string") {
    return { error: "A valid customer is required." };
  }

  const supabase = await createClient();
  const { data: customer, error } = await supabase
    .from("customers")
    .select("id, name")
    .eq("id", customerId)
    .maybeSingle();

  if (error || !customer) {
    return { error: "Customer not found." };
  }

  await setViewAsCustomerCookie(customer.id);

  // Best-effort log of the impersonation start. Visible in server logs.
  console.info(
    `[impersonation] start: admin=${real.email} (${real.id}) viewing customer=${customer.name} (${customer.id})`
  );

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

/**
 * Exit customer-view mode. Safe to call when no impersonation is active —
 * it will simply no-op and redirect the caller back to the customer they
 * were last viewing (or the customers index if unknown).
 */
export async function exitCustomerView(): Promise<void> {
  const real = await getRealProfile();
  const viewAsId = await getViewAsCustomerId();

  if (real && viewAsId) {
    console.info(
      `[impersonation] exit: admin=${real.email} (${real.id}) was viewing customer=${viewAsId}`
    );
  }

  await clearViewAsCustomerCookie();
  revalidatePath("/", "layout");

  // Send the admin back to the specific customer record they were
  // previewing, when we know it. Otherwise drop them on the customers
  // index — never to a broken page.
  if (viewAsId) {
    redirect(`/customers/${viewAsId}`);
  }
  redirect("/customers");
}
