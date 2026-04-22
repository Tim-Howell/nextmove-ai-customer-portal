import Link from "next/link";
import { getProfile, getCurrentUser } from "@/lib/supabase/profile";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CustomerDashboardRedesigned } from "@/components/dashboard/customer-dashboard-redesigned";
import { Users, FileText, Clock, Flag, MessageSquare, Plus, BarChart3 } from "lucide-react";
import { getOpenPrioritiesCount } from "@/app/actions/priorities";
import { getOpenRequestsCount } from "@/app/actions/requests";
import { getRecentRequests } from "@/app/actions/reports";
import { getRecentTimeEntries } from "@/app/actions/time-entries";

async function getCustomerName(customerId: string): Promise<string> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("customers")
    .select("name")
    .eq("id", customerId)
    .single();
  return data?.name || "Your Company";
}

async function getInternalStats(): Promise<{
  customerCount: number;
  activeContractCount: number;
  hoursThisMonth: number;
  openPriorities: number;
  openRequests: number;
}> {
  const supabase = await createClient();

  const [customersResult, contractsResult, timeEntriesResult, openPriorities, openRequests] = await Promise.all([
    supabase.from("customers").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("contracts").select("id, status:reference_values!contracts_status_id_fkey(value)"),
    supabase.from("time_entries").select("hours").gte("entry_date", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0]),
    getOpenPrioritiesCount(),
    getOpenRequestsCount(),
  ]);

  const activeContracts = (contractsResult.data || []).filter((c) => {
    const status = c.status as unknown as { value: string } | null;
    return status?.value === "active";
  });
  const totalHours = (timeEntriesResult.data || []).reduce((sum: number, e: { hours: number }) => sum + Number(e.hours), 0);

  return {
    customerCount: customersResult.count || 0,
    activeContractCount: activeContracts.length,
    hoursThisMonth: totalHours,
    openPriorities,
    openRequests,
  };
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const profile = await getProfile();

  const displayName = profile?.full_name || user?.email || "User";
  const role = profile?.role || "staff";

  if (role === "customer_user" && profile?.customer_id) {
    const customerName = await getCustomerName(profile.customer_id);
    return (
      <CustomerDashboardRedesigned
        customerName={customerName}
        customerId={profile.customer_id}
      />
    );
  }

  const stats = await getInternalStats();
  const [recentRequests, recentTimeEntries] = await Promise.all([
    getRecentRequests(undefined, 5),
    getRecentTimeEntries(undefined, 5),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {displayName}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Link href="/customers">
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.customerCount}</div>
              <p className="text-xs text-muted-foreground">Active customers</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/contracts">
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contracts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeContractCount}</div>
              <p className="text-xs text-muted-foreground">Active contracts</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/time-logs">
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hours This Month</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.hoursThisMonth.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">Total logged</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/priorities">
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Priorities</CardTitle>
              <Flag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.openPriorities}</div>
              <p className="text-xs text-muted-foreground">Across all customers</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/requests">
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Requests</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.openRequests}</div>
              <p className="text-xs text-muted-foreground">Pending review</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/time-logs/new" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Log Time
              </Button>
            </Link>
            <Link href="/requests/new" className="block">
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                New Request
              </Button>
            </Link>
            <Link href="/priorities/new" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Flag className="mr-2 h-4 w-4" />
                New Priority
              </Button>
            </Link>
            <Link href="/reports" className="block">
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Reports
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Requests</CardTitle>
            <Link href="/requests">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No recent requests
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium truncate max-w-[150px]">
                        <Link href={`/requests/${request.id}`} className="hover:underline">
                          {request.title}
                        </Link>
                      </TableCell>
                      <TableCell className="truncate max-w-[100px]">
                        {request.customer?.name || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{request.status?.label || "—"}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Time Entries</CardTitle>
            <Link href="/time-logs">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentTimeEntries.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No recent time entries
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Hours</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTimeEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        {new Date(entry.entry_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="truncate max-w-[100px]">
                        {entry.customer?.name || "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        {Number(entry.hours).toFixed(1)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
