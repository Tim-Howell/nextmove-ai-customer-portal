import { createClient } from "@/lib/supabase/server";
import { ContractForm } from "@/components/contracts/contract-form";
import { getReferenceValues } from "@/app/actions/reference";
import { getContractTypes } from "@/app/actions/contracts";
import type { Customer } from "@/types/database";

interface NewContractPageProps {
  searchParams: Promise<{ customerId?: string }>;
}

async function getCustomers(): Promise<Customer[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("customers")
    .select("id, name")
    .eq("status", "active")
    .order("name");
  return (data || []) as Customer[];
}

export default async function NewContractPage({ searchParams }: NewContractPageProps) {
  const { customerId } = await searchParams;
  const [customers, contractTypes, contractStatuses] = await Promise.all([
    getCustomers(),
    getContractTypes(),
    getReferenceValues("contract_status"),
  ]);

  return (
    <div className="max-w-2xl mx-auto">
      <ContractForm
        customers={customers}
        contractTypes={contractTypes}
        contractStatuses={contractStatuses}
        defaultCustomerId={customerId}
      />
    </div>
  );
}
