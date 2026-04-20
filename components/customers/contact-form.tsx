"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  customerContactSchema,
  type CustomerContactFormData,
} from "@/lib/validations/customer";
import {
  createCustomerContact,
  updateCustomerContact,
} from "@/app/actions/customers";
import type { CustomerContact } from "@/types/database";

interface ContactFormProps {
  customerId: string;
  contact?: CustomerContact;
}

export function ContactForm({ customerId, contact }: ContactFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CustomerContactFormData>({
    resolver: zodResolver(customerContactSchema),
    defaultValues: {
      full_name: contact?.full_name || "",
      title: contact?.title || "",
      email: contact?.email || "",
      phone: contact?.phone || "",
      is_active: contact?.is_active ?? true,
      portal_access_enabled: contact?.portal_access_enabled ?? false,
      notes: contact?.notes || "",
    },
  });

  const isActive = watch("is_active");
  const portalAccessEnabled = watch("portal_access_enabled");

  async function onSubmit(data: CustomerContactFormData) {
    setIsLoading(true);
    setError(null);

    const result = contact
      ? await updateCustomerContact(customerId, contact.id, data)
      : await createCustomerContact(customerId, data);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{contact ? "Edit Contact" : "New Contact"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name *</Label>
            <Input
              id="full_name"
              {...register("full_name")}
              disabled={isLoading}
              placeholder="Enter full name"
            />
            {errors.full_name && (
              <p className="text-sm text-destructive">
                {errors.full_name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register("title")}
              disabled={isLoading}
              placeholder="e.g. CEO, Project Manager"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                disabled={isLoading}
                placeholder="email@example.com"
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                {...register("phone")}
                disabled={isLoading}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_active"
              checked={isActive}
              onCheckedChange={(checked: boolean | "indeterminate") => setValue("is_active", checked === true)}
              disabled={isLoading}
            />
            <Label htmlFor="is_active" className="font-normal">
              Active contact
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="portal_access_enabled"
              checked={portalAccessEnabled}
              onCheckedChange={(checked: boolean | "indeterminate") =>
                setValue("portal_access_enabled", checked === true)
              }
              disabled={isLoading}
            />
            <Label htmlFor="portal_access_enabled" className="font-normal">
              Enable portal access (invitation will be sent in Phase 4)
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              disabled={isLoading}
              placeholder="Additional notes about this contact"
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href={`/customers/${customerId}`}>
            <Button type="button" variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : contact ? "Save Changes" : "Add Contact"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
