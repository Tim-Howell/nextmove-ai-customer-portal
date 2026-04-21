import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PriorityForm } from "@/components/priorities/priority-form";
import { getPriority } from "@/app/actions/priorities";
import { getReferenceValues } from "@/app/actions/reference";
import type { Customer } from "@/types/database";

interface EditPriorityPageProps {
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

export default async function EditPriorityPage({ params }: EditPriorityPageProps) {
  const { id } = await params;
  
  const [{ data: priority }, customers, statuses, priorityLevels] = await Promise.all([
    getPriority(id),
    getCustomers(),
    getReferenceValues("priority_status"),
    getReferenceValues("priority_level"),
  ]);

  if (!priority) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <PriorityForm
        priority={priority}
        customers={customers}
        statuses={statuses}
        priorityLevels={priorityLevels}
      />
    </div>
  );
}
