import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TimeEntryForm } from "@/components/time-logs/time-entry-form";
import { getTimeEntry } from "@/app/actions/time-entries";
import { getReferenceValues } from "@/app/actions/reference";
import type { Customer } from "@/types/database";

interface EditTimeEntryPageProps {
  params: Promise<{ id: string }>;
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

export default async function EditTimeEntryPage({ params }: EditTimeEntryPageProps) {
  const { id } = await params;
  
  const [{ data: timeEntry }, customers, contracts, categories] = await Promise.all([
    getTimeEntry(id),
    getCustomers(),
    getContracts(),
    getReferenceValues("time_category"),
  ]);

  if (!timeEntry) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <TimeEntryForm
        timeEntry={timeEntry}
        customers={customers}
        contracts={contracts}
        categories={categories}
      />
    </div>
  );
}
