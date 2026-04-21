import { createClient } from "@/lib/supabase/server";
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

async function getContracts(): Promise<{ id: string; name: string; customer_id: string }[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("contracts")
    .select("id, name, customer_id")
    .order("name");
  return data || [];
}

export default async function NewTimeEntryPage({ searchParams }: NewTimeEntryPageProps) {
  const params = await searchParams;
  
  const [customers, contracts, categories] = await Promise.all([
    getCustomers(),
    getContracts(),
    getReferenceValues("time_category"),
  ]);

  return (
    <div className="max-w-2xl mx-auto">
      <TimeEntryForm
        customers={customers}
        contracts={contracts}
        categories={categories}
        defaultCustomerId={params.customerId}
        defaultContractId={params.contractId}
      />
    </div>
  );
}
