import Link from "next/link";
import { getInternalUsers } from "@/app/actions/users";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import { UserTable } from "@/components/settings/user-table";

export default async function UsersPage() {
  const users = await getInternalUsers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground">
            Manage internal user accounts and roles
          </p>
        </div>
        <Link href="/settings/users/invite">
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite User
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Internal Users</CardTitle>
        </CardHeader>
        <CardContent>
          <UserTable users={users} />
        </CardContent>
      </Card>
    </div>
  );
}
