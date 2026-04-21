"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { timeEntrySchema, type TimeEntryFormData } from "@/lib/validations/time-entry";
import { createTimeEntry, updateTimeEntry } from "@/app/actions/time-entries";
import type { TimeEntry, Customer, ReferenceValue } from "@/types/database";

interface TimeEntryFormProps {
  timeEntry?: TimeEntry;
  customers: Customer[];
  contracts: { id: string; name: string; customer_id: string; is_default?: boolean }[];
  categories: ReferenceValue[];
  staff?: { id: string; full_name: string }[];
  defaultCustomerId?: string;
  defaultContractId?: string;
  isInternal?: boolean;
}

export function TimeEntryForm({
  timeEntry,
  customers,
  contracts,
  categories,
  staff = [],
  defaultCustomerId,
  defaultContractId,
  isInternal = false,
}: TimeEntryFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TimeEntryFormData>({
    resolver: zodResolver(timeEntrySchema),
    defaultValues: {
      customer_id: timeEntry?.customer_id || defaultCustomerId || "",
      contract_id: timeEntry?.contract_id || defaultContractId || "",
      entry_date: timeEntry?.entry_date || today,
      hours: timeEntry?.hours || undefined,
      category_id: timeEntry?.category_id || "",
      description: timeEntry?.description || "",
      internal_notes: timeEntry?.internal_notes || "",
      is_billable: timeEntry?.is_billable ?? true,
      staff_id: undefined,
    },
  });

  const customerId = watch("customer_id");
  const contractId = watch("contract_id");
  const categoryId = watch("category_id");
  const isBillable = watch("is_billable");
  const staffId = watch("staff_id");

  const filteredContracts = customerId
    ? contracts.filter((c) => c.customer_id === customerId)
    : [];

  // Auto-select default contract when customer changes
  useEffect(() => {
    if (customerId && !contractId) {
      const defaultContract = filteredContracts.find((c) => c.is_default);
      if (defaultContract) {
        setValue("contract_id", defaultContract.id);
      }
    }
  }, [customerId, contractId, filteredContracts, setValue]);

  useEffect(() => {
    if (customerId && contractId) {
      const contractBelongsToCustomer = contracts.some(
        (c) => c.id === contractId && c.customer_id === customerId
      );
      if (!contractBelongsToCustomer) {
        setValue("contract_id", "");
      }
    }
  }, [customerId, contractId, contracts, setValue]);

  async function onSubmit(data: TimeEntryFormData) {
    setIsLoading(true);
    setError(null);

    const result = timeEntry
      ? await updateTimeEntry(timeEntry.id, data)
      : await createTimeEntry(data);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{timeEntry ? "Edit Time Entry" : "Log Time"}</CardTitle>
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
              value={customerId}
              onValueChange={(value) => setValue("customer_id", value)}
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
            <Label htmlFor="contract_id">Contract *</Label>
            <Select
              value={contractId || ""}
              onValueChange={(value) => setValue("contract_id", value)}
              disabled={isLoading || !customerId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select contract" />
              </SelectTrigger>
              <SelectContent>
                {filteredContracts.map((contract) => (
                  <SelectItem key={contract.id} value={contract.id}>
                    {contract.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!customerId && (
              <p className="text-xs text-muted-foreground">Select a customer first</p>
            )}
            {errors.contract_id && (
              <p className="text-sm text-destructive">{errors.contract_id.message}</p>
            )}
          </div>

          {isInternal && staff.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="staff_id">Log Time For</Label>
              <Select
                value={staffId || "self"}
                onValueChange={(value) => setValue("staff_id", value === "self" ? undefined : value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Myself" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="self">Myself</SelectItem>
                  {staff.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Select a staff member to log time on their behalf
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="entry_date">Date *</Label>
              <Input
                id="entry_date"
                type="date"
                {...register("entry_date")}
                disabled={isLoading}
              />
              {errors.entry_date && (
                <p className="text-sm text-destructive">{errors.entry_date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hours">Hours *</Label>
              <Input
                id="hours"
                type="number"
                step="0.25"
                min="0.25"
                max="24"
                {...register("hours")}
                disabled={isLoading}
                placeholder="0.00"
              />
              {errors.hours && (
                <p className="text-sm text-destructive">{errors.hours.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category_id">Category *</Label>
            <Select
              value={categoryId}
              onValueChange={(value) => setValue("category_id", value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category_id && (
              <p className="text-sm text-destructive">{errors.category_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              disabled={isLoading}
              placeholder="What did you work on?"
              rows={3}
            />
          </div>

          {isInternal && (
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

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_billable"
              checked={isBillable}
              onCheckedChange={(checked: boolean | "indeterminate") =>
                setValue("is_billable", checked === true)
              }
              disabled={isLoading}
            />
            <Label htmlFor="is_billable" className="font-normal">
              Billable time
            </Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/time-logs">
            <Button type="button" variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : timeEntry ? "Save Changes" : "Log Time"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
