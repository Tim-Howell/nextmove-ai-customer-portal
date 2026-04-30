import { Suspense } from "react";
import { getProfile, getCurrentUser } from "@/lib/supabase/profile";
import { createClient } from "@/lib/supabase/server";
import { AccessDeniedToast } from "@/components/dashboard/access-denied-toast";
import { CustomerDashboard } from "./customer-dashboard";
import { InternalDashboard } from "./internal-dashboard";

/**
 * Thin role-routing dashboard. Customer users see the customer dashboard
 * (time chart + burndowns + summary stack); admin/staff see the internal
 * dashboard (hours-by-staff chart + summary stack).
 *
 * URL search params are forwarded to the customer dashboard for filter
 * state (bucket, contracts, billable). The internal dashboard takes none.
 */
interface DashboardPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

async function getCustomerName(customerId: string): Promise<string> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("customers")
    .select("name")
    .eq("id", customerId)
    .single();
  return data?.name || "Your Company";
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const user = await getCurrentUser();
  const profile = await getProfile();

  const displayName = profile?.full_name || user?.email || "User";
  const role = profile?.role || "staff";

  if (role === "customer_user" && profile?.customer_id) {
    const customerName = await getCustomerName(profile.customer_id);
    const params = await searchParams;
    return (
      <>
        <Suspense fallback={null}>
          <AccessDeniedToast />
        </Suspense>
        <CustomerDashboard
          customerName={customerName}
          customerId={profile.customer_id}
          searchParams={params}
        />
      </>
    );
  }

  return <InternalDashboard displayName={displayName} />;
}
