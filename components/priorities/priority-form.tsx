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
import { IconPicker } from "@/components/ui/icon-picker";
import { prioritySchema, type PriorityFormData } from "@/lib/validations/priority";
import { createPriority, updatePriority } from "@/app/actions/priorities";
import type { Priority, Customer, ReferenceValue } from "@/types/database";
import { showSuccess, showError } from "@/lib/toast";

interface PriorityFormProps {
  priority?: Priority;
  customers: Customer[];
  statuses: ReferenceValue[];
  priorityLevels: ReferenceValue[];
  defaultCustomerId?: string;
}

export function PriorityForm({
  priority,
  customers,
  statuses,
  priorityLevels,
  defaultCustomerId,
}: PriorityFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PriorityFormData>({
    resolver: zodResolver(prioritySchema),
    defaultValues: {
      customer_id: priority?.customer_id || defaultCustomerId || undefined,
      title: priority?.title || "",
      description: priority?.description || "",
      image_url: priority?.image_url || "",
      icon: priority?.icon || null,
      status_id: priority?.status_id || undefined,
      priority_level_id: priority?.priority_level_id || undefined,
      due_date: priority?.due_date || "",
    },
  });

  const customerId = watch("customer_id");
  const statusId = watch("status_id");
  const priorityLevelId = watch("priority_level_id");
  const iconValue = watch("icon");

  async function onSubmit(data: PriorityFormData) {
    setIsLoading(true);
    setError(null);

    const result = priority
      ? await updatePriority(priority.id, data)
      : await createPriority(data);

    if (result?.error) {
      setError(result.error);
      showError(result.error);
      setIsLoading(false);
    } else {
      showSuccess(priority ? "Priority updated successfully" : "Priority created successfully");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{priority ? "Edit Priority" : "New Priority"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="customer_id">Customer *</Label>
            <Select
              value={customerId || ""}
              onValueChange={(value) => setValue("customer_id", value, { shouldValidate: true })}
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
            {errors.customer_id && (
              <p className="text-sm text-destructive">{errors.customer_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...register("title")}
              disabled={isLoading}
              placeholder="Enter priority title"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <IconPicker
            value={iconValue}
            onChange={(iconName) => setValue("icon", iconName)}
            disabled={isLoading}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status_id">Status *</Label>
              <Select
                value={statusId || ""}
                onValueChange={(value) => setValue("status_id", value, { shouldValidate: true })}
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
              {errors.status_id && (
                <p className="text-sm text-destructive">{errors.status_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority_level_id">Priority Level *</Label>
              <Select
                value={priorityLevelId || ""}
                onValueChange={(value) => setValue("priority_level_id", value, { shouldValidate: true })}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {priorityLevels.map((level) => (
                    <SelectItem key={level.id} value={level.id}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.priority_level_id && (
                <p className="text-sm text-destructive">{errors.priority_level_id.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="due_date">Due Date (Optional)</Label>
            <Input
              id="due_date"
              type="date"
              {...register("due_date")}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              disabled={isLoading}
              placeholder="Priority description or notes"
              rows={4}
            />
          </div>

        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href={priority ? `/priorities/${priority.id}` : "/priorities"}>
            <Button type="button" variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : priority ? "Save Changes" : "Create Priority"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
