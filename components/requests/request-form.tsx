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
import {
  requestSchema,
  customerRequestSchema,
  type RequestFormData,
  type CustomerRequestFormData,
} from "@/lib/validations/request";
import { createRequest, updateRequest } from "@/app/actions/requests";
import type { Request, Customer, ReferenceValue } from "@/types/database";

interface RequestFormProps {
  request?: Request;
  customers?: Customer[];
  statuses?: ReferenceValue[];
  isInternal: boolean;
}

export function RequestForm({
  request,
  customers = [],
  statuses = [],
  isInternal,
}: RequestFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const schema = isInternal ? requestSchema : customerRequestSchema;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RequestFormData | CustomerRequestFormData>({
    resolver: zodResolver(schema),
    defaultValues: isInternal
      ? {
          customer_id: request?.customer_id || "",
          title: request?.title || "",
          description: request?.description || "",
          status_id: request?.status_id || "",
          internal_notes: request?.internal_notes || "",
        }
      : {
          title: request?.title || "",
          description: request?.description || "",
        },
  });

  const customerId = watch("customer_id" as keyof (RequestFormData | CustomerRequestFormData));
  const statusId = watch("status_id" as keyof (RequestFormData | CustomerRequestFormData));

  async function onSubmit(data: RequestFormData | CustomerRequestFormData) {
    setIsLoading(true);
    setError(null);

    const result = request
      ? await updateRequest(request.id, data as RequestFormData)
      : await createRequest(data);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {request ? "Edit Request" : isInternal ? "New Request" : "Submit Request"}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}

          {isInternal && (
            <div className="space-y-2">
              <Label htmlFor="customer_id">Customer *</Label>
              <Select
                value={customerId as string}
                onValueChange={(value) => setValue("customer_id" as keyof RequestFormData, value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(errors as Record<string, { message?: string }>).customer_id && (
                <p className="text-sm text-destructive">
                  {(errors as Record<string, { message?: string }>).customer_id?.message}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...register("title")}
              disabled={isLoading}
              placeholder="Brief summary of your request"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              disabled={isLoading}
              placeholder="Provide details about your request"
              rows={6}
            />
          </div>

          {isInternal && (
            <>
              <div className="space-y-2">
                <Label htmlFor="status_id">Status</Label>
                <Select
                  value={statusId as string}
                  onValueChange={(value) => setValue("status_id" as keyof RequestFormData, value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status.id} value={status.id}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="internal_notes">Internal Notes</Label>
                <Textarea
                  id="internal_notes"
                  {...register("internal_notes" as keyof RequestFormData)}
                  disabled={isLoading}
                  placeholder="Notes visible only to internal staff"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  These notes are not visible to customers.
                </p>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href={request ? `/requests/${request.id}` : "/requests"}>
            <Button type="button" variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? "Saving..."
              : request
                ? "Save Changes"
                : isInternal
                  ? "Create Request"
                  : "Submit Request"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
