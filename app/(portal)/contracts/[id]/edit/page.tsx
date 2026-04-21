import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ContractForm } from "@/components/contracts/contract-form";
import { ContractDocuments } from "@/components/contracts/contract-documents";
import { getContract, getContractDocuments } from "@/app/actions/contracts";
import { getReferenceValues } from "@/app/actions/reference";
import type { Customer } from "@/types/database";

interface EditContractPageProps {
  params: Promise<{ id: string }>;
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

export default async function EditContractPage({ params }: EditContractPageProps) {
  const { id } = await params;
  
  const [{ data: contract }, { data: documents }, customers, contractTypes, contractStatuses] = await Promise.all([
    getContract(id),
    getContractDocuments(id),
    getCustomers(),
    getReferenceValues("contract_type"),
    getReferenceValues("contract_status"),
  ]);

  if (!contract) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <ContractForm
        contract={contract}
        customers={customers}
        contractTypes={contractTypes}
        contractStatuses={contractStatuses}
      />
      <ContractDocuments
        contractId={id}
        documents={documents}
        isInternal={true}
      />
    </div>
  );
}
