import { createClient } from "@/lib/supabase/server";
import { PriorityForm } from "@/components/priorities/priority-form";
import { getReferenceValues } from "@/app/actions/reference";
import { getShowDemoData } from "@/app/actions/settings";
import type { Customer } from "@/types/database";

interface NewPriorityPageProps {
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

export default async function NewPriorityPage({ searchParams }: NewPriorityPageProps) {
  const { customerId } = await searchParams;
  const [customers, statuses, priorityLevels] = await Promise.all([
    getCustomers(),
    getReferenceValues("priority_status"),
    getReferenceValues("priority_level"),
  ]);

  return (
    <div className="max-w-2xl mx-auto">
      <PriorityForm
        customers={customers}
        statuses={statuses}
        priorityLevels={priorityLevels}
        defaultCustomerId={customerId}
      />
    </div>
  );
}
