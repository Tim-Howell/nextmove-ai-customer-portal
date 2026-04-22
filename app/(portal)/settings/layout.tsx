import { redirect } from "next/navigation";
import Link from "next/link";
import { getProfile } from "@/lib/supabase/profile";
import { cn } from "@/lib/utils";

const settingsNav = [
  { href: "/settings", label: "General" },
  { href: "/settings/reference-data", label: "Reference Data" },
  { href: "/settings/users", label: "Staff Users" },
  { href: "/settings/customer-users", label: "Customer Users" },
  { href: "/settings/portal-branding", label: "Portal Branding" },
  { href: "/settings/audit-log", label: "Audit Log" },
];

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Settings</h1>
        <p className="text-muted-foreground">Manage system configuration</p>
      </div>

      <div className="flex gap-6">
        <nav className="w-48 shrink-0">
          <ul className="space-y-1">
            {settingsNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "block px-3 py-2 rounded-md text-sm font-medium hover:bg-muted"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
