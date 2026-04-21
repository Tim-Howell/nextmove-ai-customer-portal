import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/profile";
import { TimeEntryForm } from "@/components/time-logs/time-entry-form";
import { getReferenceValues } from "@/app/actions/reference";
import type { Customer } from "@/types/database";

interface NewTimeEntryPageProps {
  searchParams: Promise<{
    customerId?: string;
    contractId?: string;
  }>;
}

async function getCustomers(): Promise<Customer[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("customers")
    .select("id, name")
    .order("name");
  return (data || []) as Customer[];
}

async function getContracts(): Promise<{ id: string; name: string; customer_id: string; is_default?: boolean }[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("contracts")
    .select("id, name, customer_id, is_default")
    .order("name");
  return data || [];
}

async function getStaff(): Promise<{ id: string; full_name: string }[]> {
  const supabase = await createClient();
  const profile = await getProfile();
  
  if (profile?.role !== "admin" && profile?.role !== "staff") {
    return [];
  }
  
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("role", ["admin", "staff"])
    .eq("is_active", true)
    .order("full_name");
  return data || [];
}

export default async function NewTimeEntryPage({ searchParams }: NewTimeEntryPageProps) {
  const params = await searchParams;
  
  const profile = await getProfile();
  const isInternal = profile?.role === "admin" || profile?.role === "staff";
  
  const [customers, contracts, categories, staff] = await Promise.all([
    getCustomers(),
    getContracts(),
    getReferenceValues("time_category"),
    getStaff(),
  ]);

  return (
    <div className="max-w-2xl mx-auto">
      <TimeEntryForm
        customers={customers}
        contracts={contracts}
        categories={categories}
        staff={staff}
        defaultCustomerId={params.customerId}
        defaultContractId={params.contractId}
        isInternal={isInternal}
      />
    </div>
  );
}
