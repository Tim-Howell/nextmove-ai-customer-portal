"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";
import { updateUser, type InternalUser } from "@/app/actions/users";

const userEditSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  title: z.string().optional(),
  role: z.enum(["admin", "staff", "customer_user"]),
  customer_id: z.string().uuid().nullable().optional(),
  is_active: z.boolean(),
});

type UserEditFormData = z.infer<typeof userEditSchema>;

interface UserEditFormProps {
  user: InternalUser & { customer_id?: string | null };
  customers: { id: string; name: string; status: string }[];
}

export function UserEditForm({ user, customers }: UserEditFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserEditFormData>({
    resolver: zodResolver(userEditSchema),
    defaultValues: {
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      title: user.title || "",
      role: user.role,
      customer_id: user.customer_id || null,
      is_active: user.is_active,
    },
  });

  const role = watch("role");
  const isCustomerUser = role === "customer_user";

  async function onSubmit(data: UserEditFormData) {
    setIsLoading(true);
    setError(null);

    // Clear customer_id for non-customer users
    if (!isCustomerUser) {
      data.customer_id = null;
    }

    const result = await updateUser(user.id, data);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      router.push("/settings/users");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit User</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            Email: {user.email}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                {...register("first_name")}
                disabled={isLoading}
              />
              {errors.first_name && (
                <p className="text-sm text-destructive">{errors.first_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                {...register("last_name")}
                disabled={isLoading}
              />
              {errors.last_name && (
                <p className="text-sm text-destructive">{errors.last_name.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register("title")}
              disabled={isLoading}
              placeholder="Job title or position"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select
              value={role}
              onValueChange={(value) => setValue("role", value as "admin" | "staff" | "customer_user")}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="customer_user">Customer User</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-destructive">{errors.role.message}</p>
            )}
          </div>

          {isCustomerUser && (
            <div className="space-y-2">
              <Label htmlFor="customer_id">Customer</Label>
              <Select
                value={watch("customer_id") || "none"}
                onValueChange={(value) =>
                  setValue("customer_id", value === "none" ? null : value)
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_active"
              checked={watch("is_active")}
              onCheckedChange={(checked: boolean | "indeterminate") =>
                setValue("is_active", checked === true)
              }
              disabled={isLoading}
            />
            <Label htmlFor="is_active" className="font-normal">
              Active
            </Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/settings/users">
            <Button type="button" variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
