import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { FileText, Clock, Flag, MessageSquare, Plus, Users, Building, Mail, Phone } from "lucide-react";
import { getContracts } from "@/app/actions/contracts";
import {
  getCustomerHoursThisMonth,
} from "@/app/actions/time-entries";
import { getOpenPrioritiesCount } from "@/app/actions/priorities";
import { getOpenRequestsCount } from "@/app/actions/requests";
import { getRecentPriorities } from "@/app/actions/reports";
import { CONTRACT_STATUS_VALUES } from "@/lib/validations/contract";
import { getCustomers } from "@/app/actions/customers";
import { createClient } from "@/lib/supabase/server";

interface CustomerDashboardProps {
  customerName: string;
  customerId: string;
}

export async function CustomerDashboardRedesigned({ customerName, customerId }: CustomerDashboardProps) {
  const [{ data: contracts }, hoursThisMonth, openPriorities, openRequests, recentPriorities] = await Promise.all([
    getContracts({ customerId }),
    getCustomerHoursThisMonth(customerId),
    getOpenPrioritiesCount(customerId),
    getOpenRequestsCount(customerId),
    getRecentPriorities(customerId, 5),
  ]);

  // Get customer details including logo and contacts
  const customers = await getCustomers();
  const customer = customers.find(c => c.id === customerId);
  
  // Get NextMove AI contacts (staff assigned to this customer)
  const staffContacts = await getStaffContacts(customerId);

  const activeContracts = contracts.filter(
    (c) => c.status?.value === CONTRACT_STATUS_VALUES.ACTIVE
  );

  return (
    <div className="space-y-6">
      {/* Customer Info Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-4">
            {customer?.logo_url ? (
              <div className="h-16 w-16 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                <img
                  src={customer.logo_url}
                  alt={customerName}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
                <Building className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-primary">{customerName}</h1>
              <p className="text-muted-foreground">Welcome back! Here's your project overview.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours This Month</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hoursThisMonth.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Billable hours logged</p>
          </CardContent>
        </Card>

        <Link href="/requests">
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Requests</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{openRequests}</div>
              <p className="text-xs text-muted-foreground">Pending requests</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/priorities">
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Priorities</CardTitle>
              <Flag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{openPriorities}</div>
              <p className="text-xs text-muted-foreground">Active work items</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/contracts">
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeContracts.length}</div>
              <p className="text-xs text-muted-foreground">Current contracts</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* NextMove AI Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Your NextMove AI Team
            </CardTitle>
          </CardHeader>
          <CardContent>
            {staffContacts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No contacts assigned yet
              </p>
            ) : (
              <div className="space-y-3">
                {staffContacts.map((contact: any) => (
                  <div key={contact.id} className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {contact.first_name?.[0]}{contact.last_name?.[0]}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {contact.first_name} {contact.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {contact.title || "Team Member"}
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      {contact.email && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`mailto:${contact.email}`}>
                            <Mail className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Contracts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Active Contracts
            </CardTitle>
            <Link href="/contracts">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {activeContracts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No active contracts
              </p>
            ) : (
              <div className="space-y-3">
                {activeContracts.map((contract) => (
                  <div key={contract.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{contract.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {contract.contract_type?.label || "Contract"}
                      </p>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Active Priorities */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5" />
            Active Priorities
          </CardTitle>
          <Link href="/priorities">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentPriorities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No active priorities
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPriorities
                  .filter(p => p.status?.value !== 'complete')
                  .slice(0, 5)
                  .map((priority) => (
                    <TableRow key={priority.id}>
                      <TableCell className="font-medium">
                        <Link href={`/priorities/${priority.id}`} className="hover:underline">
                          {priority.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          priority.priority_level?.value === 'high' ? 'destructive' :
                          priority.priority_level?.value === 'medium' ? 'default' :
                          'secondary'
                        }>
                          {priority.priority_level?.label || "â"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{priority.status?.label || "â"}</Badge>
                      </TableCell>
                      <TableCell>
                        {priority.due_date
                          ? new Date(priority.due_date).toLocaleDateString()
                          : "â"}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            <Link href="/requests/new" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Submit New Request
              </Button>
            </Link>
            <Link href="/contracts" className="block">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                View All Contracts
              </Button>
            </Link>
            <Link href="/priorities" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Flag className="mr-2 h-4 w-4" />
                View All Priorities
              </Button>
            </Link>
            <Link href="/requests" className="block">
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                View All Requests
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

async function getStaffContacts(customerId: string) {
  const supabase = await createClient();
  
  // Get staff members who are primary or secondary contacts for this customer
  const { data: customer } = await supabase
    .from("customers")
    .select("primary_contact_id, secondary_contact_id")
    .eq("id", customerId)
    .single();
  
  if (!customer) return [];
  
  const contactIds = [
    customer.primary_contact_id,
    customer.secondary_contact_id
  ].filter(Boolean);
  
  if (contactIds.length === 0) return [];
  
  const { data: contacts } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, title, email")
    .in("id", contactIds)
    .eq("is_active", true);
  
  return contacts || [];
}
