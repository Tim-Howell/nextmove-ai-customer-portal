import Link from "next/link";
import { getProfile, getCurrentUser } from "@/lib/supabase/profile";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerDashboard } from "@/components/dashboard/customer-dashboard";
import { Users, FileText, Clock, Flag, MessageSquare } from "lucide-react";
import { getOpenPrioritiesCount } from "@/app/actions/priorities";
import { getOpenRequestsCount } from "@/app/actions/requests";

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
      <CustomerDashboard
        customerName={customerName}
        customerId={profile.customer_id}
      />
    );
  }

  const stats = await getInternalStats();

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
    </div>
  );
}
