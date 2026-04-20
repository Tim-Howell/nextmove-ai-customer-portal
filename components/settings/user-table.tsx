"use client";

import { useState } from "react";
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

interface UserTableProps {
  users: InternalUser[];
}

export function UserTable({ users }: UserTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Active</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">
              {user.full_name || "—"}
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
