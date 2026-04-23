import { createClient } from "@/lib/supabase/server";
import { RequestForm } from "@/components/requests/request-form";
import { getReferenceValues } from "@/app/actions/reference";
import { getShowDemoData } from "@/app/actions/settings";
import type { Customer } from "@/types/database";

interface NewRequestPageProps {
  searchParams: Promise<{ customerId?: string }>;
}

async function getCustomers(): Promise<Customer[]> {
  const supabase = await createClient();
  const showDemoData = await getShowDemoData();
  
  let query = supabase
    .from("customers")
    .select("id, name, is_demo")
    .eq("status", "active")
    .is("archived_at", null)
    .order("name");
  
  if (!showDemoData) {
    query = query.eq("is_demo", false);
  }
  
  const { data } = await query;
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

export default async function NewRequestPage({ searchParams }: NewRequestPageProps) {
  const { customerId } = await searchParams;
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
        defaultCustomerId={customerId}
      />
    </div>
  );
}
