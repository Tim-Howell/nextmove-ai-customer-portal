"use client";

import { useState, useEffect } from "react";
import { SidebarNav } from "./sidebar-nav";
import { Header } from "./header";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPortalSettings } from "@/app/actions/portal-settings";
import type { PortalSettings } from "@/lib/validations/portal-settings";

interface AppShellProps {
  children: React.ReactNode;
  user: {
    email: string;
    full_name: string | null;
  };
  role: "admin" | "staff" | "customer_user";
  customerName?: string | null;
}

export function AppShell({ children, user, role, customerName }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [portalSettings, setPortalSettings] = useState<PortalSettings | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      const settings = await getPortalSettings();
      setPortalSettings(settings);
    }
    fetchSettings();
  }, []);

  const organizationName = portalSettings?.organization_name || "NextMove AI";
  const logoUrl = portalSettings?.logo_url;

  return (
    <div className="flex min-h-screen">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-sidebar border-r transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b px-4">
          <div className="flex items-center space-x-2">
            {logoUrl && (
              <img
                src={logoUrl}
                alt="Organization logo"
                className="h-8 w-8 object-contain"
              />
            )}
            <span className="text-lg font-bold text-primary">{organizationName}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="py-4">
          <SidebarNav role={role} />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <Header user={user} customerName={customerName} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
