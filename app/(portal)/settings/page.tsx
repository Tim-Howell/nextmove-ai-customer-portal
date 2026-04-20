import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Users, Settings2 } from "lucide-react";
import { DemoDataToggle } from "@/components/settings/demo-data-toggle";
import { getShowDemoData } from "@/app/actions/settings";

export default async function SettingsPage() {
  const showDemoData = await getShowDemoData();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>System-wide configuration options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Show Demo Data</p>
              <p className="text-sm text-muted-foreground">
                Include demo records in lists and queries
              </p>
            </div>
            <DemoDataToggle initialValue={showDemoData} />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/settings/reference-data">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Reference Data
              </CardTitle>
              <CardDescription>
                Manage dropdown values for contracts, time entries, priorities, and requests
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/settings/users">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>
                Invite users, manage roles, and deactivate accounts
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
