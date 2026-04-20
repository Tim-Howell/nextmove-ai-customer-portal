import { createClient } from "@/lib/supabase/server";
import { CustomerForm } from "@/components/customers/customer-form";

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

export default async function NewCustomerPage() {
  const staffMembers = await getStaffMembers();

  return (
    <div className="max-w-2xl mx-auto">
      <CustomerForm staffMembers={staffMembers} />
    </div>
  );
}
