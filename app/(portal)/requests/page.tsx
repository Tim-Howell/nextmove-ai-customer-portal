import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
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
import { Plus, MessageSquare } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { getRequests } from "@/app/actions/requests";
import { getReferenceValues } from "@/app/actions/reference";
import { RequestsFilter } from "@/components/requests/requests-filter";
import type { Customer, ReferenceValue } from "@/types/database";

interface RequestsPageProps {
  searchParams: Promise<{
    customerId?: string;
    statusId?: string;
  }>;
}

async function getCustomers(): Promise<Customer[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("customers")
    .select("id, name")
    .order("name");
  return (data || []) as Customer[];
}

async function getCurrentUserRole(): Promise<{ role: string; customerId: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { role: "customer_user", customerId: null };
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, customer_id")
    .eq("id", user.id)
    .single();
  
  return {
    role: profile?.role || "customer_user",
    customerId: profile?.customer_id || null,
  };
}

function getStatusBadgeVariant(statusValue: string): "default" | "secondary" | "destructive" | "outline" {
  switch (statusValue) {
    case "new":
      return "default";
    case "in_review":
      return "secondary";
    case "in_progress":
      return "default";
    case "closed":
      return "outline";
    default:
      return "secondary";
  }
}

export default async function RequestsPage({ searchParams }: RequestsPageProps) {
  const params = await searchParams;
  const { customerId, statusId } = params;
  const { role, customerId: userCustomerId } = await getCurrentUserRole();
  const isInternal = role === "admin" || role === "staff";

  // For customer users, always filter by their customer
  const effectiveCustomerId = isInternal ? customerId : userCustomerId || undefined;

  const [{ data: requests }, customers, statuses] = await Promise.all([
    getRequests({ customerId: effectiveCustomerId, statusId }),
    isInternal ? getCustomers() : Promise.resolve([]),
    getReferenceValues("request_status"),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Requests</h1>
          <p className="text-muted-foreground">
            {isInternal ? "Manage customer requests" : "Submit and track your requests"}
          </p>
        </div>
        <Link href="/requests/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {isInternal ? "New Request" : "Submit Request"}
          </Button>
        </Link>
      </div>

      <RequestsFilter
        customers={customers}
        statuses={statuses}
        currentCustomerId={customerId}
        currentStatusId={statusId}
        isInternal={isInternal}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            {isInternal && <TableHead>Customer</TableHead>}
            <TableHead>Submitted By</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            {isInternal && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isInternal ? 6 : 4} className="p-0">
                <EmptyState
                  icon={MessageSquare}
                  title="No requests found"
                  description={isInternal ? "No customer requests have been submitted" : "Submit a request to get started"}
                  action={{ label: isInternal ? "New Request" : "Submit Request", href: "/requests/new" }}
                />
              </TableCell>
            </TableRow>
          ) : (
            requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <Link
                    href={`/requests/${request.id}`}
                    className="font-medium hover:underline"
                  >
                    {request.title}
                  </Link>
                </TableCell>
                {isInternal && (
                  <TableCell>
                    <Link
                      href={`/customers/${request.customer?.id}`}
                      className="text-muted-foreground hover:underline"
                    >
                      {request.customer?.name || "—"}
                    </Link>
                  </TableCell>
                )}
                <TableCell>{request.submitter?.full_name || "Unknown"}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(request.status?.value || "")}>
                    {request.status?.label || "—"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(request.created_at).toLocaleDateString()}
                </TableCell>
                {isInternal && (
                  <TableCell className="text-right">
                    <Link href={`/requests/${request.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
