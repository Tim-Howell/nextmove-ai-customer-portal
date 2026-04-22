"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "@/components/ui/image-upload";
import { customerSchema, type CustomerFormData } from "@/lib/validations/customer";
import { createCustomer, updateCustomer } from "@/app/actions/customers";
import type { Customer } from "@/types/database";

interface StaffMember {
  id: string;
  full_name: string | null;
  email: string;
}

interface CustomerFormProps {
  customer?: Customer;
  staffMembers: StaffMember[];
  isAdmin?: boolean;
}

export function CustomerForm({ customer, staffMembers, isAdmin = false }: CustomerFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: customer?.name || "",
      status: customer?.status || "active",
      primary_contact_id: customer?.primary_contact_id || null,
      secondary_contact_id: customer?.secondary_contact_id || null,
      notes: customer?.notes || "",
      internal_notes: customer?.internal_notes || "",
      logo_url: customer?.logo_url || "",
      is_demo: customer?.is_demo || false,
    },
  });

  const status = watch("status");
  const primaryContactId = watch("primary_contact_id");
  const secondaryContactId = watch("secondary_contact_id");
  const isDemo = watch("is_demo");

  async function onSubmit(data: CustomerFormData) {
    setIsLoading(true);
    setError(null);

    const result = customer
      ? await updateCustomer(customer.id, data)
      : await createCustomer(data);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{customer ? "Edit Customer" : "New Customer"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Customer Name *</Label>
            <Input
              id="name"
              {...register("name")}
              disabled={isLoading}
              placeholder="Enter customer name"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={(value) => setValue("status", value as "active" | "inactive")}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="primary_contact_id">Primary NextMove Contact</Label>
            <Select
              value={primaryContactId || "none"}
              onValueChange={(value) =>
                setValue("primary_contact_id", value === "none" ? null : value)
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select primary contact" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {staffMembers.map((staff) => (
                  <SelectItem key={staff.id} value={staff.id}>
                    {staff.full_name || staff.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondary_contact_id">Secondary NextMove Contact</Label>
            <Select
              value={secondaryContactId || "none"}
              onValueChange={(value) =>
                setValue("secondary_contact_id", value === "none" ? null : value)
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select secondary contact" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {staffMembers.map((staff) => (
                  <SelectItem key={staff.id} value={staff.id}>
                    {staff.full_name || staff.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Logo</Label>
            <ImageUpload
              value={watch("logo_url")}
              onChange={(url) => setValue("logo_url", url)}
              disabled={isLoading}
              aspectRatio="wide"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              disabled={isLoading}
              placeholder="Additional notes about this customer"
              rows={4}
            />
          </div>

          {isAdmin && (
            <div className="space-y-2">
              <Label htmlFor="internal_notes">Internal Notes</Label>
              <Textarea
                id="internal_notes"
                {...register("internal_notes")}
                disabled={isLoading}
                placeholder="Internal notes (visible to NextMove AI staff only)"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                These notes are only visible to NextMove AI staff members
              </p>
            </div>
          )}

          {isAdmin && (
            <div className="flex items-center space-x-2 pt-2 border-t">
              <Checkbox
                id="is_demo"
                checked={isDemo}
                onCheckedChange={(checked: boolean | "indeterminate") =>
                  setValue("is_demo", checked === true)
                }
                disabled={isLoading}
              />
              <Label htmlFor="is_demo" className="font-normal text-muted-foreground">
                Demo data (only visible when demo mode is enabled)
              </Label>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href={customer ? `/customers/${customer.id}` : "/customers"}>
            <Button type="button" variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : customer ? "Save Changes" : "Create Customer"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
