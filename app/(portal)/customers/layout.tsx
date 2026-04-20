import { redirect } from "next/navigation";
import { getProfile } from "@/lib/supabase/profile";

export default async function CustomersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();

  if (!profile || profile.role === "customer_user") {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
