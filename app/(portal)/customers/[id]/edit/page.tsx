import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CustomerForm } from "@/components/customers/customer-form";
import { getProfile } from "@/lib/supabase/profile";
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

async function getStaffMembers(currentlyAssignedIds: string[] = []) {
  const supabase = await createClient();

  const { data: activeStaff, error } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .in("role", ["admin", "staff"])
    .eq("is_active", true)
    .order("full_name");

  if (error) {
    console.error("Error fetching staff:", error);
    return [];
  }

  const activeList = activeStaff || [];
  const activeIds = new Set(activeList.map((s) => s.id));
  const missingIds = currentlyAssignedIds.filter(
    (id) => id && !activeIds.has(id)
  );

  if (missingIds.length === 0) {
    return activeList;
  }

  const { data: inactiveAssigned } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .in("id", missingIds);

  const inactiveTagged = (inactiveAssigned || []).map((s) => ({
    ...s,
    full_name: s.full_name ? `${s.full_name} (Inactive)` : "(Inactive user)",
  }));

  return [...activeList, ...inactiveTagged];
}

async function getCustomerContacts(customerId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("customer_contacts")
    .select("id, full_name, email")
    .eq("customer_id", customerId)
    .eq("is_active", true)
    .order("full_name");

  if (error) {
    console.error("Error fetching customer contacts:", error);
    return [];
  }

  return data;
}

export default async function EditCustomerPage({ params }: EditCustomerPageProps) {
  const { id } = await params;
  const [customer, customerContacts, profile] = await Promise.all([
    getCustomer(id),
    getCustomerContacts(id),
    getProfile(),
  ]);

  if (!customer) {
    notFound();
  }

  const assignedIds = [
    customer.primary_contact_id,
    customer.secondary_contact_id,
  ].filter((id): id is string => !!id);

  const staffMembers = await getStaffMembers(assignedIds);

  return (
    <div className="max-w-2xl mx-auto">
      <CustomerForm customer={customer} staffMembers={staffMembers} customerContacts={customerContacts} isAdmin={profile?.role === "admin"} />
    </div>
  );
}
