import { getProfile, getCurrentUser } from "@/lib/supabase/profile";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerDashboard } from "@/components/dashboard/customer-dashboard";

async function getCustomerName(customerId: string): Promise<string> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("customers")
    .select("name")
    .eq("id", customerId)
    .single();
  return data?.name || "Your Company";
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

  const roleLabels: Record<string, string> = {
    admin: "Administrator",
    staff: "Staff Member",
    customer_user: "Customer User",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {displayName}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Your Role</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{roleLabels[role]}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Email</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">{user?.email}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent" />
              <span className="text-lg">Active</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>
            This is the NextMove AI Customer Portal. The dashboard will display
            relevant information based on your role once the system is fully
            configured.
          </p>
          <ul className="mt-4 list-disc list-inside space-y-1">
            <li>Internal users can manage customers, contracts, and time logs</li>
            <li>Customer users can view their own data and submit requests</li>
            <li>Admins have access to system settings and user management</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
