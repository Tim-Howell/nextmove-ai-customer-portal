"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  FileText,
  Clock,
  Flag,
  MessageSquare,
  BarChart3,
  Settings,
  User,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const internalNavItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Customers", href: "/customers", icon: Users },
  { title: "Contracts", href: "/contracts", icon: FileText },
  { title: "Time Logs", href: "/time-logs", icon: Clock },
  { title: "Priorities", href: "/priorities", icon: Flag },
  { title: "Requests", href: "/requests", icon: MessageSquare },
  { title: "Reports", href: "/reports", icon: BarChart3 },
];

const adminNavItems: NavItem[] = [
  { title: "Settings", href: "/settings", icon: Settings },
];

const customerNavItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Profile", href: "/profile", icon: User },
  { title: "Contracts", href: "/contracts", icon: FileText },
  { title: "Time Logs", href: "/time-logs", icon: Clock },
  { title: "Priorities", href: "/priorities", icon: Flag },
  { title: "Requests", href: "/requests", icon: MessageSquare },
  { title: "Reports", href: "/reports", icon: BarChart3 },
];

interface SidebarNavProps {
  role: "admin" | "staff" | "customer_user";
}

export function SidebarNav({ role }: SidebarNavProps) {
  const pathname = usePathname();

  const navItems =
    role === "customer_user"
      ? customerNavItems
      : [...internalNavItems, ...(role === "admin" ? adminNavItems : [])];

  return (
    <nav className="space-y-1 px-2">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
