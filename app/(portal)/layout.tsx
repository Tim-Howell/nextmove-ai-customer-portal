import { redirect } from "next/navigation";
import { getProfile, getCurrentUser } from "@/lib/supabase/profile";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layouts/app-shell";

async function getCustomerName(customerId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("customers")
    .select("name")
    .eq("id", customerId)
    .single();
  return data?.name || null;
}

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getProfile();

  // If no profile exists yet (edge case during signup), use defaults
  const userInfo = {
    email: user.email || "",
    full_name: profile?.full_name || null,
  };

  const role = profile?.role || "staff";

  let customerName: string | null = null;
  if (role === "customer_user" && profile?.customer_id) {
    customerName = await getCustomerName(profile.customer_id);
  }

  return (
    <AppShell user={userInfo} role={role} customerName={customerName}>
      {children}
    </AppShell>
  );
}
