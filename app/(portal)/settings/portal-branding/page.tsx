import { redirect } from "next/navigation";
import { getProfile } from "@/lib/supabase/profile";
import { getPortalSettings } from "@/app/actions/portal-settings";
import { PortalBrandingForm } from "@/components/settings/portal-branding-form";

export default async function PortalBrandingPage() {
  const profile = await getProfile();
  
  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  const settings = await getPortalSettings();

  return (
    <div className="max-w-2xl mx-auto">
      <PortalBrandingForm settings={settings} />
    </div>
  );
}
