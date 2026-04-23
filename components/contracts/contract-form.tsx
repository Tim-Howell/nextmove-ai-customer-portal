"use client";

import { useState } from "react";
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
import {
  contractSchema,
  type ContractFormData,
  CONTRACT_TYPE_VALUES,
} from "@/lib/validations/contract";
import { createContract, updateContract } from "@/app/actions/contracts";
import type { Contract, Customer, ReferenceValue, ContractType } from "@/types/database";
import { showSuccess, showError } from "@/lib/toast";

interface ContractFormProps {
  contract?: Contract;
  customers: Customer[];
  contractTypes: ContractType[];
  contractStatuses: ReferenceValue[];
  defaultCustomerId?: string;
}

export function ContractForm({
  contract,
  customers,
  contractTypes,
  contractStatuses,
  defaultCustomerId,
}: ContractFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContractFormData>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      customer_id: contract?.customer_id || defaultCustomerId || "",
      name: contract?.name || "",
      contract_type_id: contract?.contract_type_id || "",
      status_id: contract?.status_id || "",
      start_date: contract?.start_date || "",
      end_date: contract?.end_date || "",
      total_hours: contract?.total_hours || null,
      description: contract?.description || "",
      // Billing fields
      billing_day: contract?.billing_day || null,
      hours_per_period: contract?.hours_per_period || null,
      rollover_enabled: contract?.rollover_enabled ?? false,
      rollover_expiration_days: contract?.rollover_expiration_days || null,
      max_rollover_hours: contract?.max_rollover_hours || null,
      fixed_cost: contract?.fixed_cost || null,
    },
  });

  const customerId = watch("customer_id");
  const contractTypeId = watch("contract_type_id");
  const statusId = watch("status_id");
  const rolloverEnabled = watch("rollover_enabled");

  const selectedType = contractTypes.find((t) => t.id === contractTypeId);
  const typeValue = selectedType?.value || "";
  
  // Determine which fields to show based on contract type
  const isHoursBucket = typeValue === CONTRACT_TYPE_VALUES.HOURS_BUCKET;
  const isHoursSubscription = typeValue === CONTRACT_TYPE_VALUES.HOURS_SUBSCRIPTION;
  const isFixedCost = typeValue === CONTRACT_TYPE_VALUES.FIXED_COST;
  const showTotalHours = isHoursBucket;
  const showSubscriptionFields = isHoursSubscription;
  const showFixedCost = isFixedCost;

  async function onSubmit(data: ContractFormData) {
    setIsLoading(true);
    setError(null);

    const result = contract
      ? await updateContract(contract.id, data)
      : await createContract(data);

    if (result?.error) {
      setError(result.error);
      showError(result.error);
      setIsLoading(false);
    } else {
      showSuccess(contract ? "Contract updated successfully" : "Contract created successfully");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{contract ? "Edit Contract" : "New Contract"}</CardTitle>
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
            <Label htmlFor="name">Contract Name *</Label>
            <Input
              id="name"
              {...register("name")}
              disabled={isLoading}
              placeholder="Enter contract name"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contract_type_id">Contract Type *</Label>
              <Select
                value={contractTypeId}
                onValueChange={(value) => setValue("contract_type_id", value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {contractTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.contract_type_id && (
                <p className="text-sm text-destructive">{errors.contract_type_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status_id">Status *</Label>
              <Select
                value={statusId}
                onValueChange={(value) => setValue("status_id", value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {contractStatuses.map((status) => (
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                {...register("start_date")}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                {...register("end_date")}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Hours Bucket: Total Hours */}
          {showTotalHours && (
            <div className="space-y-2">
              <Label htmlFor="total_hours">Total Hours in Bucket *</Label>
              <Input
                id="total_hours"
                type="number"
                step="0.5"
                min="0"
                {...register("total_hours")}
                disabled={isLoading}
                placeholder="Total hours available in this bucket"
              />
              {errors.total_hours && (
                <p className="text-sm text-destructive">{errors.total_hours.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Fixed pool of hours to be used within the contract period
              </p>
            </div>
          )}

          {/* Hours Subscription: Period Hours & Billing Day */}
          {showSubscriptionFields && (
            <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
              <h4 className="font-medium">Subscription Settings</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hours_per_period">Hours Per Month *</Label>
                  <Input
                    id="hours_per_period"
                    type="number"
                    step="0.5"
                    min="0"
                    {...register("hours_per_period")}
                    disabled={isLoading}
                    placeholder="e.g., 10"
                  />
                  {errors.hours_per_period && (
                    <p className="text-sm text-destructive">{errors.hours_per_period.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billing_day">Billing Day (1-28) *</Label>
                  <Input
                    id="billing_day"
                    type="number"
                    min="1"
                    max="28"
                    {...register("billing_day")}
                    disabled={isLoading}
                    placeholder="e.g., 1"
                  />
                  {errors.billing_day && (
                    <p className="text-sm text-destructive">{errors.billing_day.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Day of month when hours refresh
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rollover_enabled"
                    checked={rolloverEnabled}
                    onCheckedChange={(checked) => setValue("rollover_enabled", checked === true)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="rollover_enabled" className="font-normal">
                    Enable rollover of unused hours
                  </Label>
                </div>

                {rolloverEnabled && (
                  <div className="grid grid-cols-2 gap-4 pl-6">
                    <div className="space-y-2">
                      <Label htmlFor="rollover_expiration_days">Rollover Expiration (days)</Label>
                      <Input
                        id="rollover_expiration_days"
                        type="number"
                        min="1"
                        {...register("rollover_expiration_days")}
                        disabled={isLoading}
                        placeholder="e.g., 90"
                      />
                      <p className="text-xs text-muted-foreground">
                        Leave empty to expire at end of contract
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="max_rollover_hours">Max Rollover Hours</Label>
                      <Input
                        id="max_rollover_hours"
                        type="number"
                        step="0.5"
                        min="0"
                        {...register("max_rollover_hours")}
                        disabled={isLoading}
                        placeholder="e.g., 20"
                      />
                      <p className="text-xs text-muted-foreground">
                        Maximum hours that can accumulate
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Fixed Cost */}
          {showFixedCost && (
            <div className="space-y-2">
              <Label htmlFor="fixed_cost">Contract Value ($)</Label>
              <Input
                id="fixed_cost"
                type="number"
                step="0.01"
                min="0"
                {...register("fixed_cost")}
                disabled={isLoading}
                placeholder="e.g., 5000.00"
              />
              <p className="text-xs text-muted-foreground">
                Fixed price for reference. Hours are tracked but not billed by hour.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              disabled={isLoading}
              placeholder="Contract description or notes"
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href={contract ? `/contracts/${contract.id}` : "/contracts"}>
            <Button type="button" variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : contract ? "Save Changes" : "Create Contract"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
