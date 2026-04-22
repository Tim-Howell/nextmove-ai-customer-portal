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
import { Plus, Image as ImageIcon } from "lucide-react";
import { getPriorities } from "@/app/actions/priorities";
import { getReferenceValues } from "@/app/actions/reference";
import { PrioritiesFilter } from "@/components/priorities/priorities-filter";
import type { Customer, ReferenceValue } from "@/types/database";

interface PrioritiesPageProps {
  searchParams: Promise<{
    customerId?: string;
    statusId?: string;
    priorityLevelId?: string;
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

function getPriorityLevelBadgeVariant(levelValue: string): "default" | "secondary" | "destructive" | "outline" {
  switch (levelValue) {
    case "high":
      return "destructive";
    case "medium":
      return "default";
    case "low":
      return "secondary";
    default:
      return "outline";
  }
}

function getStatusBadgeVariant(statusValue: string): "default" | "secondary" | "destructive" | "outline" {
  switch (statusValue) {
    case "active":
      return "default";
    case "next_up":
      return "secondary";
    case "complete":
      return "outline";
    case "on_hold":
      return "destructive";
    default:
      return "secondary";
  }
}

export default async function PrioritiesPage({ searchParams }: PrioritiesPageProps) {
  const params = await searchParams;
  const { customerId, statusId, priorityLevelId } = params;
  const { role, customerId: userCustomerId } = await getCurrentUserRole();
  const isInternal = role === "admin" || role === "staff";

  // For customer users, always filter by their customer
  const effectiveCustomerId = isInternal ? customerId : userCustomerId || undefined;

  const [{ data: priorities }, customers, statuses, priorityLevels] = await Promise.all([
    getPriorities({ customerId: effectiveCustomerId, statusId, priorityLevelId }),
    isInternal ? getCustomers() : Promise.resolve([]),
    getReferenceValues("priority_status"),
    getReferenceValues("priority_level"),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Priorities</h1>
          <p className="text-muted-foreground">
            {isInternal ? "Manage customer priorities" : "View your priorities"}
          </p>
        </div>
        {isInternal && (
          <Link href="/priorities/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Priority
            </Button>
          </Link>
        )}
      </div>

      <PrioritiesFilter
        customers={customers}
        statuses={statuses}
        priorityLevels={priorityLevels}
        currentCustomerId={customerId}
        currentStatusId={statusId}
        currentPriorityLevelId={priorityLevelId}
        isInternal={isInternal}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Title</TableHead>
            {isInternal && <TableHead>Customer</TableHead>}
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Due Date</TableHead>
            {isInternal && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {priorities.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isInternal ? 7 : 5} className="text-center text-muted-foreground">
                No priorities found
              </TableCell>
            </TableRow>
          ) : (
            priorities.map((priority) => (
              <TableRow key={priority.id}>
                <TableCell>
                  {priority.image_url ? (
                    <img
                      src={priority.image_url}
                      alt={`${priority.title} image`}
                      className="w-8 h-8 object-cover rounded"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                      <ImageIcon className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/priorities/${priority.id}`}
                    className="font-medium hover:underline"
                  >
                    {priority.title}
                  </Link>
                </TableCell>
                {isInternal && (
                  <TableCell>
                    <Link
                      href={`/customers/${priority.customer?.id}`}
                      className="text-muted-foreground hover:underline"
                    >
                      {priority.customer?.name || "—"}
                    </Link>
                  </TableCell>
                )}
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(priority.status?.value || "")}>
                    {priority.status?.label || "—"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getPriorityLevelBadgeVariant(priority.priority_level?.value || "")}>
                    {priority.priority_level?.label || "—"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {priority.due_date
                    ? new Date(priority.due_date).toLocaleDateString()
                    : "—"}
                </TableCell>
                {isInternal && (
                  <TableCell className="text-right">
                    <Link href={`/priorities/${priority.id}/edit`}>
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
