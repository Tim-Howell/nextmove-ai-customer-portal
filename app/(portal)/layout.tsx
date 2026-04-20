import { redirect } from "next/navigation";
import { getProfile, getCurrentUser } from "@/lib/supabase/profile";
import { AppShell } from "@/components/layouts/app-shell";

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

  return (
    <AppShell user={userInfo} role={role}>
      {children}
    </AppShell>
  );
}
