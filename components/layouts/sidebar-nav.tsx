"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  FileText,
  Clock,
  Flag,
  MessageSquare,
  BarChart3,
  Settings,
  FolderOpen,
  Plus,
  Zap,
  PenLine,
} from "lucide-react";
import { QuickTimeEntryDialog } from "@/components/time-logs/quick-time-entry-dialog";

interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface NavCategory {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavItem[];
}

// Staff/Admin navigation structure
const internalCustomerInfoItems: NavItem[] = [
  { title: "Contracts", href: "/contracts" },
  { title: "Contacts", href: "/contacts" },
  { title: "Priorities", href: "/priorities" },
  { title: "Requests", href: "/requests" },
];

const internalReportsItems: NavItem[] = [
  { title: "Time Reports", href: "/reports/time" },
  { title: "Change Log", href: "/reports/changes" },
];

// Customer navigation structure
const customerInfoItems: NavItem[] = [
  { title: "Contracts", href: "/contracts" },
  { title: "Priorities", href: "/priorities" },
  { title: "Requests", href: "/requests" },
];

const customerReportsItems: NavItem[] = [
  { title: "Time Report", href: "/reports/time" },
];

interface SidebarNavProps {
  role: "admin" | "staff" | "customer_user";
}

function NavLink({ item, pathname, indented = false }: { item: NavItem; pathname: string; indented?: boolean }) {
  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        indented && "ml-4 pl-4",
        isActive
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {item.title}
    </Link>
  );
}

function NavCategorySection({ 
  category, 
  pathname 
}: { 
  category: NavCategory; 
  pathname: string;
}) {
  const Icon = category.icon;
  const isActive = pathname === category.href || 
    category.items.some(item => pathname === item.href || pathname.startsWith(`${item.href}/`));

  return (
    <div className="space-y-1">
      <Link
        href={category.href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-accent/50 text-accent-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <Icon className="h-4 w-4" />
        {category.title}
      </Link>
      <div className="space-y-1">
        {category.items.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} indented />
        ))}
      </div>
    </div>
  );
}

function Separator() {
  return <div className="my-3 border-t border-border" />;
}

export function SidebarNav({ role }: SidebarNavProps) {
  const pathname = usePathname();
  const isInternal = role === "admin" || role === "staff";

  if (isInternal) {
    return (
      <nav className="flex flex-col h-full px-2">
        <div className="space-y-1 flex-1">
          {/* Submit Time section */}
          <div className="px-3 pt-1 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Submit Time
          </div>
          <QuickTimeEntryDialog>
            <Button
              type="button"
              className="w-full justify-start gap-2"
              size="sm"
            >
              <Zap className="h-4 w-4" />
              Quick Entry
            </Button>
          </QuickTimeEntryDialog>
          <Link href="/time-logs/new">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 mt-1 mb-2"
              size="sm"
            >
              <PenLine className="h-4 w-4" />
              Detailed Entry
            </Button>
          </Link>

          <Separator />

          {/* Main Nav */}
          <NavLink item={{ title: "Dashboard", href: "/dashboard", icon: LayoutDashboard }} pathname={pathname} />
          <NavLink item={{ title: "Customers", href: "/customers", icon: Users }} pathname={pathname} />

          <Separator />

          {/* Customer Info Category */}
          <NavCategorySection
            category={{
              title: "Customer Info",
              href: "/customer-info",
              icon: FolderOpen,
              items: internalCustomerInfoItems,
            }}
            pathname={pathname}
          />

          <Separator />

          {/* Reports Category */}
          <NavCategorySection
            category={{
              title: "Reports",
              href: "/reports",
              icon: BarChart3,
              items: internalReportsItems,
            }}
            pathname={pathname}
          />
        </div>

        {/* Settings at bottom for admin */}
        {role === "admin" && (
          <div className="mt-auto pt-4 border-t border-border">
            <Link href="/settings">
              <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </Link>
          </div>
        )}
      </nav>
    );
  }

  // Customer navigation
  return (
    <nav className="flex flex-col h-full px-2">
      <div className="space-y-1 flex-1">
        {/* Main Nav */}
        <NavLink item={{ title: "Dashboard", href: "/dashboard", icon: LayoutDashboard }} pathname={pathname} />

        <Separator />

        {/* Customer Info Category */}
        <NavCategorySection
          category={{
            title: "Customer Info",
            href: "/customer-info",
            icon: FolderOpen,
            items: customerInfoItems,
          }}
          pathname={pathname}
        />

        <Separator />

        {/* Reports Category */}
        <NavCategorySection
          category={{
            title: "Reports",
            href: "/reports",
            icon: BarChart3,
            items: customerReportsItems,
          }}
          pathname={pathname}
        />
      </div>

      {/* Submit Request at bottom */}
      <div className="mt-auto pt-4 border-t border-border">
        <Link href="/requests/new">
          <Button className="w-full justify-start gap-2" size="sm">
            <Plus className="h-4 w-4" />
            Submit Request
          </Button>
        </Link>
      </div>
    </nav>
  );
}
