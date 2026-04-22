import { createClient } from "@/lib/supabase/server";
import { RequestForm } from "@/components/requests/request-form";
import { getReferenceValues } from "@/app/actions/reference";
import type { Customer } from "@/types/database";

async function getCustomers(): Promise<Customer[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("customers")
    .select("id, name")
    .eq("status", "active")
    .is("archived_at", null)
    .order("name");
  return (data || []) as Customer[];
}

async function getCurrentUserRole(): Promise<{ role: string; customerId: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { role: "customer_user", customerId: null };
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, customer_id")
    .eq("id", user.id)
    .single();
  
  return {
    role: profile?.role || "customer_user",
    customerId: profile?.customer_id || null,
  };
}

export default async function NewRequestPage() {
  const { role } = await getCurrentUserRole();
  const isInternal = role === "admin" || role === "staff";

  const [customers, statuses] = await Promise.all([
    isInternal ? getCustomers() : Promise.resolve([]),
    isInternal ? getReferenceValues("request_status") : Promise.resolve([]),
  ]);

  return (
    <div className="max-w-2xl mx-auto">
      <RequestForm
        customers={customers}
        statuses={statuses}
        isInternal={isInternal}
      />
    </div>
  );
}
