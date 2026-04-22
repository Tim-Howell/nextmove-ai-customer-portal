"use client";

import { AlertTriangle, Clock, Info } from "lucide-react";
import { CONTRACT_TYPE_VALUES } from "@/lib/validations/contract";
import {
  calculateContractHours,
  formatHoursRemaining,
  type ContractForCalculation,
  type TimeEntryForCalculation,
} from "@/lib/contracts/hours-calculator";

export interface ContractWithHoursInfo {
  id: string;
  name: string;
  customer_id: string;
  is_default?: boolean;
  contract_type_value?: string;
  total_hours?: number | null;
  hours_per_period?: number | null;
  billing_day?: number | null;
  start_date?: string | null;
  end_date?: string | null;
  rollover_enabled?: boolean;
  rollover_expiration_days?: number | null;
  max_rollover_hours?: number | null;
  time_entries?: TimeEntryForCalculation[];
}

interface ContractHoursContextProps {
  contract: ContractWithHoursInfo | null;
  pendingHours?: number;
}

export function ContractHoursContext({ contract, pendingHours = 0 }: ContractHoursContextProps) {
  if (!contract || !contract.contract_type_value) {
    return null;
  }

  const typeValue = contract.contract_type_value;
  
  // Only show context for contracts with hour limits
  if (
    typeValue !== CONTRACT_TYPE_VALUES.HOURS_BUCKET &&
    typeValue !== CONTRACT_TYPE_VALUES.HOURS_SUBSCRIPTION
  ) {
    return null;
  }

  const contractForCalc: ContractForCalculation = {
    id: contract.id,
    contract_type_value: typeValue,
    total_hours: contract.total_hours || null,
    hours_per_period: contract.hours_per_period || null,
    billing_day: contract.billing_day || null,
    start_date: contract.start_date || null,
    end_date: contract.end_date || null,
    rollover_enabled: contract.rollover_enabled || false,
    rollover_expiration_days: contract.rollover_expiration_days || null,
    max_rollover_hours: contract.max_rollover_hours || null,
  };

  const timeEntries = contract.time_entries || [];
  const result = calculateContractHours(contractForCalc, timeEntries);

  // Calculate what happens if we add pending hours
  let hoursRemaining: number;
  let isCurrentlyOver = false;
  let willBeOver = false;

  if (typeValue === CONTRACT_TYPE_VALUES.HOURS_BUCKET) {
    hoursRemaining = result.bucketHoursRemaining || 0;
    isCurrentlyOver = result.isBucketExceeded || false;
    willBeOver = (hoursRemaining - pendingHours) < 0;
  } else {
    hoursRemaining = result.periodHoursRemaining || 0;
    isCurrentlyOver = result.isOverLimit || false;
    willBeOver = (hoursRemaining - pendingHours) < 0;
  }

  const statusMessage = formatHoursRemaining(result, typeValue);

  // Determine styling based on status
  let bgColor = "bg-blue-50 border-blue-200";
  let textColor = "text-blue-700";
  let Icon = Info;

  if (isCurrentlyOver) {
    bgColor = "bg-red-50 border-red-200";
    textColor = "text-red-700";
    Icon = AlertTriangle;
  } else if (willBeOver && pendingHours > 0) {
    bgColor = "bg-amber-50 border-amber-200";
    textColor = "text-amber-700";
    Icon = AlertTriangle;
  }

  return (
    <div className={`p-3 rounded-lg border ${bgColor}`}>
      <div className={`flex items-start gap-2 ${textColor}`}>
        <Icon className="h-4 w-4 mt-0.5 shrink-0" />
        <div className="text-sm">
          <p className="font-medium">{statusMessage}</p>
          {willBeOver && pendingHours > 0 && !isCurrentlyOver && (
            <p className="mt-1 text-xs">
              Adding {pendingHours} hours will exceed the limit
            </p>
          )}
          {isCurrentlyOver && (
            <p className="mt-1 text-xs">
              This contract is already over its hour limit
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
