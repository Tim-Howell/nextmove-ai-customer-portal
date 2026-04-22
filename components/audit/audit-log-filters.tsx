"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

interface AuditLogFiltersProps {
  tableNames: string[];
  users: { id: string; full_name: string | null; email: string }[];
  currentFilters: {
    tableName?: string;
    action?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
  };
}

const ACTION_OPTIONS = [
  { value: "create", label: "Create" },
  { value: "update", label: "Update" },
  { value: "delete", label: "Delete" },
  { value: "archive", label: "Archive" },
  { value: "restore", label: "Restore" },
];

const TABLE_LABELS: Record<string, string> = {
  customers: "Customers",
  customer_contacts: "Contacts",
  contracts: "Contracts",
  time_entries: "Time Entries",
  priorities: "Priorities",
  requests: "Requests",
  profiles: "Users",
  portal_settings: "Portal Settings",
  reference_values: "Reference Data",
  contract_types: "Contract Types",
};

export function AuditLogFilters({
  tableNames,
  users,
  currentFilters,
}: AuditLogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string | undefined) {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Reset to page 1 when filtering
    params.delete("page");
    
    router.push(`${pathname}?${params.toString()}`);
  }

  function clearFilters() {
    router.push(pathname);
  }

  const hasFilters = Object.values(currentFilters).some(Boolean);

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Filters</h3>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="space-y-2">
          <Label>Entity Type</Label>
          <Select
            value={currentFilters.tableName || "all"}
            onValueChange={(value) => updateFilter("tableName", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All entities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All entities</SelectItem>
              {tableNames.map((table) => (
                <SelectItem key={table} value={table}>
                  {TABLE_LABELS[table] || table}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Action</Label>
          <Select
            value={currentFilters.action || "all"}
            onValueChange={(value) => updateFilter("action", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All actions</SelectItem>
              {ACTION_OPTIONS.map((action) => (
                <SelectItem key={action.value} value={action.value}>
                  {action.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>User</Label>
          <Select
            value={currentFilters.userId || "all"}
            onValueChange={(value) => updateFilter("userId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All users" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All users</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.full_name || user.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>From Date</Label>
          <Input
            type="date"
            value={currentFilters.startDate || ""}
            onChange={(e) => updateFilter("startDate", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>To Date</Label>
          <Input
            type="date"
            value={currentFilters.endDate || ""}
            onChange={(e) => updateFilter("endDate", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
