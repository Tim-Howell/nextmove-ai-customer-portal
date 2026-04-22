"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle, RefreshCw } from "lucide-react";
import { CONTRACT_TYPE_VALUES } from "@/lib/validations/contract";
import {
  calculateContractHours,
  type ContractForCalculation,
  type TimeEntryForCalculation,
} from "@/lib/contracts/hours-calculator";

interface ContractHoursStatsProps {
  contract: {
    id: string;
    contract_type?: {
      value: string;
      label: string;
    };
    total_hours: number | null;
    hours_per_period: number | null;
    billing_day: number | null;
    start_date: string | null;
    end_date: string | null;
    rollover_enabled: boolean;
    rollover_expiration_days: number | null;
    max_rollover_hours: number | null;
    fixed_cost: number | null;
    hours_used?: number;
  };
  timeEntries: TimeEntryForCalculation[];
}

export function ContractHoursStats({ contract, timeEntries }: ContractHoursStatsProps) {
  const typeValue = contract.contract_type?.value || "";
  
  // Prepare contract for calculation
  const contractForCalc: ContractForCalculation = {
    id: contract.id,
    contract_type_value: typeValue,
    total_hours: contract.total_hours,
    hours_per_period: contract.hours_per_period,
    billing_day: contract.billing_day,
    start_date: contract.start_date,
    end_date: contract.end_date,
    rollover_enabled: contract.rollover_enabled || false,
    rollover_expiration_days: contract.rollover_expiration_days,
    max_rollover_hours: contract.max_rollover_hours,
  };

  const result = calculateContractHours(contractForCalc, timeEntries);

  // Hours Bucket display
  if (typeValue === CONTRACT_TYPE_VALUES.HOURS_BUCKET) {
    const totalHours = contract.total_hours || 0;
    const hoursUsed = result.totalHoursUsed;
    const hoursRemaining = result.bucketHoursRemaining || 0;
    const isOverLimit = result.isBucketExceeded;
    const percentUsed = totalHours > 0 ? Math.min(100, (hoursUsed / totalHours) * 100) : 0;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Hours Bucket
            {isOverLimit && (
              <Badge variant="destructive" className="ml-2">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Over Limit
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{totalHours}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{hoursUsed.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">Used</p>
            </div>
            <div>
              <p className={`text-2xl font-bold ${isOverLimit ? "text-destructive" : ""}`}>
                {isOverLimit ? `-${Math.abs(hoursRemaining).toFixed(1)}` : hoursRemaining.toFixed(1)}
              </p>
              <p className="text-sm text-muted-foreground">
                {isOverLimit ? "Over" : "Remaining"}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${isOverLimit ? "bg-destructive" : "bg-primary"}`}
                style={{ width: `${percentUsed}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Hours Subscription display
  if (typeValue === CONTRACT_TYPE_VALUES.HOURS_SUBSCRIPTION) {
    const hoursPerPeriod = contract.hours_per_period || 0;
    const periodHoursUsed = result.periodHoursUsed || 0;
    const rolloverAvailable = result.rolloverHoursAvailable || 0;
    const totalAvailable = result.totalAvailableThisPeriod || hoursPerPeriod;
    const periodRemaining = result.periodHoursRemaining || 0;
    const isOverLimit = result.isOverLimit;
    const percentUsed = totalAvailable > 0 ? Math.min(100, (periodHoursUsed / totalAvailable) * 100) : 0;

    const currentPeriod = result.currentPeriod;
    const periodLabel = currentPeriod
      ? `${currentPeriod.start.toLocaleDateString()} - ${currentPeriod.end.toLocaleDateString()}`
      : "Current Period";

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Hours Subscription
            {isOverLimit && (
              <Badge variant="destructive" className="ml-2">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Over Limit
              </Badge>
            )}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{periodLabel}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{hoursPerPeriod}</p>
              <p className="text-sm text-muted-foreground">Monthly</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{periodHoursUsed.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">Used</p>
            </div>
            <div>
              <p className={`text-2xl font-bold ${isOverLimit ? "text-destructive" : ""}`}>
                {isOverLimit ? `-${Math.abs(periodRemaining).toFixed(1)}` : periodRemaining.toFixed(1)}
              </p>
              <p className="text-sm text-muted-foreground">
                {isOverLimit ? "Over" : "Remaining"}
              </p>
            </div>
          </div>

          {contract.rollover_enabled && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Rollover Hours Available</span>
                <span className="font-medium">{rolloverAvailable.toFixed(1)}</span>
              </div>
              {rolloverAvailable > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  Rollover hours are used first before monthly allocation
                </p>
              )}
            </div>
          )}

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Period Usage</span>
              <span>{periodHoursUsed.toFixed(1)} / {totalAvailable.toFixed(1)} hrs</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${isOverLimit ? "bg-destructive" : "bg-primary"}`}
                style={{ width: `${percentUsed}%` }}
              />
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            <p>Billing day: {contract.billing_day || 1} of each month</p>
            {contract.rollover_expiration_days && (
              <p>Rollover expires after {contract.rollover_expiration_days} days</p>
            )}
            {contract.max_rollover_hours && (
              <p>Max rollover: {contract.max_rollover_hours} hours</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Fixed Cost display
  if (typeValue === CONTRACT_TYPE_VALUES.FIXED_COST) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Fixed Cost Contract
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            {contract.fixed_cost && (
              <div>
                <p className="text-2xl font-bold">${contract.fixed_cost.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Contract Value</p>
              </div>
            )}
            <div>
              <p className="text-2xl font-bold">{result.totalHoursUsed.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">Hours Logged</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Hours are tracked for visibility but not billed by hour
          </p>
        </CardContent>
      </Card>
    );
  }

  // Service Subscription or On-Demand display
  if (typeValue === CONTRACT_TYPE_VALUES.SERVICE_SUBSCRIPTION || typeValue === CONTRACT_TYPE_VALUES.ON_DEMAND) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {typeValue === CONTRACT_TYPE_VALUES.SERVICE_SUBSCRIPTION ? "Service Subscription" : "On-Demand"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="text-2xl font-bold">{result.totalHoursUsed.toFixed(1)}</p>
            <p className="text-sm text-muted-foreground">Hours Logged</p>
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            {typeValue === CONTRACT_TYPE_VALUES.SERVICE_SUBSCRIPTION
              ? "Ongoing service with hours tracked for visibility"
              : "Ad-hoc billing with no set parameters"}
          </p>
        </CardContent>
      </Card>
    );
  }

  // Default: just show hours logged
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Hours Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <p className="text-2xl font-bold">{result.totalHoursUsed.toFixed(1)}</p>
          <p className="text-sm text-muted-foreground">Hours Logged</p>
        </div>
      </CardContent>
    </Card>
  );
}
