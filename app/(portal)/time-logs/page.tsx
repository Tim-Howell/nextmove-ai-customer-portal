import { Suspense } from "react";
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
import { Plus } from "lucide-react";
import { getTimeEntries, getStaffMembers } from "@/app/actions/time-entries";
import { getReferenceValues } from "@/app/actions/reference";
import { TimeLogsFilter } from "@/components/time-logs/time-logs-filter";
import { DeleteTimeEntryButton } from "@/components/time-logs/delete-time-entry-button";
import type { TimeEntryWithRelations, Customer, ReferenceValue } from "@/types/database";

interface TimeLogsPageProps {
  searchParams: Promise<{
    customerId?: string;
    contractId?: string;
    staffId?: string;
    categoryId?: string;
    startDate?: string;
    endDate?: string;
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

async function getContracts(customerId?: string): Promise<{ id: string; name: string; customer_id: string }[]> {
  const supabase = await createClient();
  let query = supabase.from("contracts").select("id, name, customer_id").order("name");
  if (customerId) {
    query = query.eq("customer_id", customerId);
  }
  const { data } = await query;
  return data || [];
}

async function getCurrentUserRole(): Promise<string> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return "customer_user";
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  
  return profile?.role || "customer_user";
}

function TimeEntryListContent({
  timeEntries,
  totalHours,
  isInternal,
}: {
  timeEntries: TimeEntryWithRelations[];
  totalHours: number;
  isInternal: boolean;
}) {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Contract</TableHead>
            <TableHead>Staff</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Hours</TableHead>
            {isInternal && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {timeEntries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isInternal ? 8 : 7} className="text-center text-muted-foreground">
                No time entries found
              </TableCell>
            </TableRow>
          ) : (
            <>
              {timeEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    {new Date(entry.entry_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/customers/${entry.customer?.id}`}
                      className="hover:underline text-muted-foreground"
                    >
                      {entry.customer?.name || "—"}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {entry.contract ? (
                      <Link
                        href={`/contracts/${entry.contract.id}`}
                        className="hover:underline text-muted-foreground"
                      >
                        {entry.contract.name}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>{entry.staff?.full_name || "—"}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{entry.category?.label || "—"}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {entry.description || "—"}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {Number(entry.hours).toFixed(1)}
                    {!entry.is_billable && (
                      <span className="ml-1 text-xs text-muted-foreground">(NB)</span>
                    )}
                  </TableCell>
                  {isInternal && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Link href={`/time-logs/${entry.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <DeleteTimeEntryButton entryId={entry.id} />
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              <TableRow className="bg-muted/50 font-medium">
                <TableCell colSpan={isInternal ? 6 : 5} className="text-right">
                  Total Hours:
                </TableCell>
                <TableCell className="text-right">{totalHours.toFixed(1)}</TableCell>
                {isInternal && <TableCell />}
              </TableRow>
            </>
          )}
        </TableBody>
      </Table>
    </>
  );
}

export default async function TimeLogsPage({ searchParams }: TimeLogsPageProps) {
  const params = await searchParams;
  const { customerId, contractId, staffId, categoryId, startDate, endDate } = params;

  const [
    { data: timeEntries, totalHours },
    customers,
    contracts,
    staffMembers,
    categories,
    userRole,
  ] = await Promise.all([
    getTimeEntries({ customerId, contractId, staffId, categoryId, startDate, endDate }),
    getCustomers(),
    getContracts(customerId),
    getStaffMembers(),
    getReferenceValues("time_category"),
    getCurrentUserRole(),
  ]);

  const isInternal = userRole === "admin" || userRole === "staff";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Time Logs</h1>
          <p className="text-muted-foreground">
            Track time spent on customer work
          </p>
        </div>
        {isInternal && (
          <Link href="/time-logs/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Log Time
            </Button>
          </Link>
        )}
      </div>

      <TimeLogsFilter
        customers={customers}
        contracts={contracts}
        staffMembers={staffMembers}
        categories={categories}
        currentCustomerId={customerId}
        currentContractId={contractId}
        currentStaffId={staffId}
        currentCategoryId={categoryId}
        currentStartDate={startDate}
        currentEndDate={endDate}
        isInternal={isInternal}
      />

      <Suspense fallback={<div>Loading...</div>}>
        <TimeEntryListContent
          timeEntries={timeEntries}
          totalHours={totalHours}
          isInternal={isInternal}
        />
      </Suspense>
    </div>
  );
}
