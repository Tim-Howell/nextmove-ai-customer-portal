"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Customer, ReferenceValue } from "@/types/database";

interface PrioritiesFilterProps {
  customers: Customer[];
  statuses: ReferenceValue[];
  priorityLevels: ReferenceValue[];
  currentCustomerId?: string;
  currentStatusId?: string;
  currentPriorityLevelId?: string;
  isInternal: boolean;
}

export function PrioritiesFilter({
  customers,
  statuses,
  priorityLevels,
  currentCustomerId,
  currentStatusId,
  currentPriorityLevelId,
  isInternal,
}: PrioritiesFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/priorities?${params.toString()}`);
  }

  return (
    <div className="flex gap-4">
      {isInternal && (
        <Select
          value={currentCustomerId || "all"}
          onValueChange={(value) => updateFilter("customerId", value === "all" ? null : value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Customers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Customers</SelectItem>
            {customers.map((customer) => (
              <SelectItem key={customer.id} value={customer.id}>
                {customer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Select
        value={currentStatusId || "all"}
        onValueChange={(value) => updateFilter("statusId", value === "all" ? null : value)}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {statuses.map((status) => (
            <SelectItem key={status.id} value={status.id}>
              {status.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={currentPriorityLevelId || "all"}
        onValueChange={(value) => updateFilter("priorityLevelId", value === "all" ? null : value)}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="All Levels" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Levels</SelectItem>
          {priorityLevels.map((level) => (
            <SelectItem key={level.id} value={level.id}>
              {level.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
