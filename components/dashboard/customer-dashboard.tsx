import Link from "next/link";
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
import { FileText, Clock, Flag, MessageSquare, Plus } from "lucide-react";
import { getContracts } from "@/app/actions/contracts";
import {
  getCustomerHoursThisMonth,
  getRecentTimeEntries,
} from "@/app/actions/time-entries";
import { getOpenPrioritiesCount } from "@/app/actions/priorities";
import { getOpenRequestsCount } from "@/app/actions/requests";
import { CONTRACT_STATUS_VALUES } from "@/lib/validations/contract";

interface CustomerDashboardProps {
  customerName: string;
  customerId: string;
}

export async function CustomerDashboard({ customerName, customerId }: CustomerDashboardProps) {
  const [{ data: contracts }, hoursThisMonth, recentTimeEntries, openPriorities, openRequests] = await Promise.all([
    getContracts({ customerId }),
    getCustomerHoursThisMonth(customerId),
    getRecentTimeEntries(customerId, 5),
    getOpenPrioritiesCount(customerId),
    getOpenRequestsCount(customerId),
  ]);

  const activeContracts = contracts.filter(
    (c) => c.status?.value === CONTRACT_STATUS_VALUES.ACTIVE
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Welcome back!</h1>
        <p className="text-muted-foreground">{customerName}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeContracts.length}</div>
            <p className="text-xs text-muted-foreground">
              {contracts.length} total contracts
            </p>
          </CardContent>
        </Card>

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

        <Link href="/priorities">
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Priorities</CardTitle>
              <Flag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{openPriorities}</div>
              <p className="text-xs text-muted-foreground">Active work items</p>
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
              <div className="text-2xl font-bold">{openRequests}</div>
              <p className="text-xs text-muted-foreground">Pending requests</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/requests/new" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Submit New Request
              </Button>
            </Link>
            <Link href="/contracts" className="block">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                View Contracts
              </Button>
            </Link>
            <Link href="/time-logs" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Clock className="mr-2 h-4 w-4" />
                View Time Logs
              </Button>
            </Link>
            <Link href="/priorities" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Flag className="mr-2 h-4 w-4" />
                View Priorities
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Time Entries</CardTitle>
            <Link href="/time-logs">
              <Button variant="ghost" size="sm">
                View All
              </Button>
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
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Hours</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTimeEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        {new Date(entry.entry_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{entry.category?.label || "—"}</TableCell>
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
