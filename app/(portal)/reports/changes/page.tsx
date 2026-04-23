import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface ChangeLogPageProps {
  searchParams: Promise<{
    page?: string;
    entity?: string;
  }>;
}

async function getAuditLogs(page: number = 1, entityFilter?: string) {
  const supabase = await createClient();
  const pageSize = 50;
  const offset = (page - 1) * pageSize;

  let query = supabase
    .from("audit_logs")
    .select(`
      id,
      table_name,
      record_id,
      action,
      user_email,
      changed_fields,
      created_at
    `, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (entityFilter) {
    query = query.eq("table_name", entityFilter);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching audit logs:", error);
    return { logs: [], total: 0 };
  }

  return { logs: data || [], total: count || 0 };
}

function getActionBadgeVariant(action: string): "default" | "secondary" | "destructive" | "outline" {
  switch (action) {
    case "INSERT":
      return "default";
    case "UPDATE":
      return "secondary";
    case "DELETE":
      return "destructive";
    default:
      return "outline";
  }
}

function formatTableName(tableName: string): string {
  return tableName
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

export default async function ChangeLogPage({ searchParams }: ChangeLogPageProps) {
  const profile = await getProfile();

  if (!profile) {
    redirect("/login");
  }

  // Only admin and staff can view change log
  if (profile.role === "customer_user") {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const entityFilter = params.entity;

  const { logs, total } = await getAuditLogs(page, entityFilter);
  const totalPages = Math.ceil(total / 50);

  const entityTypes = [
    "customers",
    "customer_contacts",
    "contracts",
    "priorities",
    "requests",
    "time_entries",
    "profiles",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Change Log</h1>
        <p className="text-muted-foreground">
          Audit trail of all changes made in the system
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Changes</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Filter:</span>
              <select
                className="text-sm border rounded px-2 py-1"
                defaultValue={entityFilter || ""}
                onChange={(e) => {
                  const url = new URL(window.location.href);
                  if (e.target.value) {
                    url.searchParams.set("entity", e.target.value);
                  } else {
                    url.searchParams.delete("entity");
                  }
                  url.searchParams.delete("page");
                  window.location.href = url.toString();
                }}
              >
                <option value="">All Entities</option>
                {entityTypes.map((type) => (
                  <option key={type} value={type}>
                    {formatTableName(type)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No changes recorded yet.
            </p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date/Time</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Changed Fields</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log: any) => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(log.created_at), "MMM d, yyyy h:mm a")}
                      </TableCell>
                      <TableCell>{formatTableName(log.table_name)}</TableCell>
                      <TableCell>
                        <Badge variant={getActionBadgeVariant(log.action)}>
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {log.user_email || "System"}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {log.changed_fields?.join(", ") || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing page {page} of {totalPages} ({total} total records)
                  </p>
                  <div className="flex gap-2">
                    {page > 1 && (
                      <a
                        href={`?page=${page - 1}${entityFilter ? `&entity=${entityFilter}` : ""}`}
                        className="px-3 py-1 text-sm border rounded hover:bg-muted"
                      >
                        Previous
                      </a>
                    )}
                    {page < totalPages && (
                      <a
                        href={`?page=${page + 1}${entityFilter ? `&entity=${entityFilter}` : ""}`}
                        className="px-3 py-1 text-sm border rounded hover:bg-muted"
                      >
                        Next
                      </a>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
