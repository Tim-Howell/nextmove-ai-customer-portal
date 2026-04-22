"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react";
import type { AuditLogWithUser, AuditAction } from "@/types/database";

interface AuditLogTableProps {
  logs: AuditLogWithUser[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

const ACTION_COLORS: Record<AuditAction, string> = {
  create: "bg-green-100 text-green-700",
  update: "bg-blue-100 text-blue-700",
  delete: "bg-red-100 text-red-700",
  archive: "bg-amber-100 text-amber-700",
  restore: "bg-purple-100 text-purple-700",
};

const TABLE_LABELS: Record<string, string> = {
  customers: "Customer",
  customer_contacts: "Contact",
  contracts: "Contract",
  time_entries: "Time Entry",
  priorities: "Priority",
  requests: "Request",
  profiles: "User",
  portal_settings: "Portal Settings",
  reference_values: "Reference Data",
  contract_types: "Contract Type",
};

const TABLE_ROUTES: Record<string, string> = {
  customers: "/customers",
  customer_contacts: "/customers",
  contracts: "/contracts",
  time_entries: "/time-logs",
  priorities: "/priorities",
  requests: "/requests",
  profiles: "/settings/users",
};

function getRecordLink(tableName: string, recordId: string): string | null {
  const baseRoute = TABLE_ROUTES[tableName];
  if (!baseRoute) return null;
  
  if (tableName === "customer_contacts") {
    return null; // Contacts don't have their own page
  }
  
  return `${baseRoute}/${recordId}`;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString();
}

function AuditLogRow({ log }: { log: AuditLogWithUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const recordLink = getRecordLink(log.table_name, log.record_id);

  return (
    <>
      <TableRow 
        className="cursor-pointer hover:bg-muted/50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <TableCell>
          <Button variant="ghost" size="sm" className="p-0 h-auto">
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </TableCell>
        <TableCell className="text-muted-foreground text-sm">
          {formatTimeAgo(new Date(log.created_at))}
        </TableCell>
        <TableCell>
          <Badge variant="outline">
            {TABLE_LABELS[log.table_name] || log.table_name}
          </Badge>
        </TableCell>
        <TableCell>
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
              ACTION_COLORS[log.action]
            }`}
          >
            {log.action}
          </span>
        </TableCell>
        <TableCell>
          {log.user?.full_name || log.user_email || "System"}
        </TableCell>
        <TableCell className="text-muted-foreground text-sm font-mono">
          {log.record_id.slice(0, 8)}...
          {recordLink && (
            <Link 
              href={recordLink} 
              className="ml-2 inline-flex"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-3 w-3" />
            </Link>
          )}
        </TableCell>
      </TableRow>
      {isOpen && (
        <TableRow className="bg-muted/30">
          <TableCell colSpan={6} className="p-4">
            <AuditLogDetails log={log} />
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

function AuditLogDetails({ log }: { log: AuditLogWithUser }) {
  const changedFields = log.changed_fields || [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium">Record ID:</span>{" "}
          <span className="font-mono">{log.record_id}</span>
        </div>
        <div>
          <span className="font-medium">Timestamp:</span>{" "}
          {new Date(log.created_at).toLocaleString()}
        </div>
        {log.user_role && (
          <div>
            <span className="font-medium">User Role:</span> {log.user_role}
          </div>
        )}
        {changedFields.length > 0 && (
          <div>
            <span className="font-medium">Changed Fields:</span>{" "}
            {changedFields.join(", ")}
          </div>
        )}
      </div>

      {(log.old_values || log.new_values) && (
        <div className="grid grid-cols-2 gap-4">
          {log.old_values && (
            <div>
              <h4 className="font-medium text-sm mb-2">Before</h4>
              <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-48">
                {JSON.stringify(filterSensitiveFields(log.old_values), null, 2)}
              </pre>
            </div>
          )}
          {log.new_values && (
            <div>
              <h4 className="font-medium text-sm mb-2">After</h4>
              <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-48">
                {JSON.stringify(filterSensitiveFields(log.new_values), null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function filterSensitiveFields(
  values: Record<string, unknown>
): Record<string, unknown> {
  const sensitiveFields = ["password", "password_hash", "token", "secret"];
  const filtered: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(values)) {
    if (sensitiveFields.some((f) => key.toLowerCase().includes(f))) {
      filtered[key] = "[REDACTED]";
    } else {
      filtered[key] = value;
    }
  }
  
  return filtered;
}

export function AuditLogTable({ logs, pagination }: AuditLogTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10"></TableHead>
            <TableHead>When</TableHead>
            <TableHead>Entity</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Record</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No audit logs found
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => <AuditLogRow key={log.id} log={log} />)
          )}
        </TableBody>
      </Table>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{" "}
            {pagination.total} entries
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => goToPage(pagination.page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => goToPage(pagination.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
