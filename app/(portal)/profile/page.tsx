import { redirect } from "next/navigation";
import { getProfile } from "@/lib/supabase/profile";
import { ProfileForm } from "@/components/profile/profile-form";
import { getCustomers } from "@/app/actions/customers";

export default async function ProfilePage() {
  const profile = await getProfile();
  
  if (!profile) {
    redirect("/login");
  }

  // For customer users, get their customer
  let customers: { id: string; name: string; status: string }[] = [];
  if (profile.role === "customer_user") {
    const allCustomers = await getCustomers();
    customers = allCustomers.filter((c) => c.id === profile.customer_id);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <ProfileForm profile={profile} customers={customers} />
    </div>
  );
}
