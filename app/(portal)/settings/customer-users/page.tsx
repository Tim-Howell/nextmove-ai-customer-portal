import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCustomerUsers } from "@/app/actions/users";
import { SetPasswordButton } from "@/components/settings/set-password-button";

export default async function CustomerUsersPage() {
  const users = await getCustomerUsers();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Customer Users</h2>
        <p className="text-sm text-muted-foreground">
          All customer portal users across all customers
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Portal Access</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No customer contacts found
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.full_name || user.email?.split("@")[0] || "Unknown"}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.title || "—"}</TableCell>
                <TableCell>
                  <Link
                    href={`/customers/${user.customer_id}`}
                    className="hover:underline text-primary"
                  >
                    {user.customer_name || "Unknown"}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant={user.portal_access_enabled ? "default" : "outline"}>
                    {user.portal_access_enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.is_active ? "default" : "secondary"}>
                    {user.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <SetPasswordButton
                    userId={user.user_id}
                    userName={user.full_name || user.email || "User"}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
