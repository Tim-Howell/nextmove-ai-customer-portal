import { createClient } from "@/lib/supabase/server";
import { PriorityForm } from "@/components/priorities/priority-form";
import { getReferenceValues } from "@/app/actions/reference";
import type { Customer } from "@/types/database";

async function getCustomers(): Promise<Customer[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("customers")
    .select("id, name")
    .eq("status", "active")
    .order("name");
  return (data || []) as Customer[];
}

export default async function NewPriorityPage() {
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
      />
    </div>
  );
}
