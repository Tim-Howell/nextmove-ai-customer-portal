import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CustomerForm } from "@/components/customers/customer-form";
import type { Customer } from "@/types/database";

interface EditCustomerPageProps {
  params: Promise<{ id: string }>;
}

async function getCustomer(id: string): Promise<Customer | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching customer:", error);
    return null;
  }

  return data;
}

async function getStaffMembers() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .in("role", ["admin", "staff"])
    .order("full_name");

  if (error) {
    console.error("Error fetching staff:", error);
    return [];
  }

  return data;
}

export default async function EditCustomerPage({ params }: EditCustomerPageProps) {
  const { id } = await params;
  const [customer, staffMembers] = await Promise.all([
    getCustomer(id),
    getStaffMembers(),
  ]);

  if (!customer) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <CustomerForm customer={customer} staffMembers={staffMembers} />
    </div>
  );
}
