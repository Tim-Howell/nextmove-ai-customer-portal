"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUserRole, toggleUserActive, type InternalUser } from "@/app/actions/users";
import { Edit } from "lucide-react";

interface UserTableProps {
  users: InternalUser[];
}

export function UserTable({ users }: UserTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "staff">("all");

  const filteredUsers = useMemo(() => {
    if (roleFilter === "all") return users;
    return users.filter((user) => user.role === roleFilter);
  }, [users, roleFilter]);

  async function handleRoleChange(userId: string, newRole: "admin" | "staff") {
    setLoadingId(userId);
    const result = await updateUserRole(userId, newRole);
    if (result.error) {
      alert(result.error);
    }
    setLoadingId(null);
  }

  async function handleToggleActive(userId: string, currentActive: boolean) {
    setLoadingId(userId);
    const result = await toggleUserActive(userId, !currentActive);
    if (result.error) {
      alert(result.error);
    }
    setLoadingId(null);
  }

  if (users.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No users found
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Filter by role:</span>
        <Select
          value={roleFilter}
          onValueChange={(value) => setRoleFilter(value as "all" | "admin" | "staff")}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="staff">Staff</SelectItem>
          </SelectContent>
        </Select>
        {roleFilter !== "all" && (
          <span className="text-sm text-muted-foreground">
            Showing {filteredUsers.length} of {users.length} users
          </span>
        )}
      </div>
      <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Active</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredUsers.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">
              <div>
                <div className="font-medium">
                  {user.first_name && user.last_name 
                    ? `${user.first_name} ${user.last_name}`
                    : user.full_name || "â"}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm text-muted-foreground">
                {user.title || "â"}
              </div>
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Select
                value={user.role}
                onValueChange={(value) =>
                  handleRoleChange(user.id, value as "admin" | "staff")
                }
                disabled={loadingId === user.id}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>
              {user.is_active ? (
                <Badge variant="default">Active</Badge>
              ) : (
                <Badge variant="secondary">Inactive</Badge>
              )}
            </TableCell>
            <TableCell>
              <Switch
                checked={user.is_active}
                onCheckedChange={() =>
                  handleToggleActive(user.id, user.is_active)
                }
                disabled={loadingId === user.id}
              />
            </TableCell>
            <TableCell>
              <Link href={`/settings/users/${user.id}/edit`}>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      </Table>
    </div>
  );
}
