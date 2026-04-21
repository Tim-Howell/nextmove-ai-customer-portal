"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Customer, ReferenceValue } from "@/types/database";

interface TimeLogsFilterProps {
  customers: Customer[];
  contracts: { id: string; name: string; customer_id: string }[];
  staffMembers: { id: string; full_name: string | null }[];
  categories: ReferenceValue[];
  currentCustomerId?: string;
  currentContractId?: string;
  currentStaffId?: string;
  currentCategoryId?: string;
  currentStartDate?: string;
  currentEndDate?: string;
  isInternal: boolean;
}

export function TimeLogsFilter({
  customers,
  contracts,
  staffMembers,
  categories,
  currentCustomerId,
  currentContractId,
  currentStaffId,
  currentCategoryId,
  currentStartDate,
  currentEndDate,
  isInternal,
}: TimeLogsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key === "customerId") {
      params.delete("contractId");
    }
    router.push(`/time-logs?${params.toString()}`);
  }

  const filteredContracts = currentCustomerId
    ? contracts.filter((c) => c.customer_id === currentCustomerId)
    : contracts;

  return (
    <div className="flex flex-wrap gap-4">
      {isInternal && (
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Customer</Label>
          <Select
            value={currentCustomerId || "all"}
            onValueChange={(value) => updateFilter("customerId", value === "all" ? null : value)}
          >
            <SelectTrigger className="w-[180px]">
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
        </div>
      )}

      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Contract</Label>
        <Select
          value={currentContractId || "all"}
          onValueChange={(value) => updateFilter("contractId", value === "all" ? null : value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Contracts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Contracts</SelectItem>
            {filteredContracts.map((contract) => (
              <SelectItem key={contract.id} value={contract.id}>
                {contract.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isInternal && (
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Staff</Label>
          <Select
            value={currentStaffId || "all"}
            onValueChange={(value) => updateFilter("staffId", value === "all" ? null : value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Staff" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Staff</SelectItem>
              {staffMembers.map((staff) => (
                <SelectItem key={staff.id} value={staff.id}>
                  {staff.full_name || "Unknown"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Category</Label>
        <Select
          value={currentCategoryId || "all"}
          onValueChange={(value) => updateFilter("categoryId", value === "all" ? null : value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Start Date</Label>
        <Input
          type="date"
          value={currentStartDate || ""}
          onChange={(e) => updateFilter("startDate", e.target.value || null)}
          className="w-[150px]"
        />
      </div>

      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">End Date</Label>
        <Input
          type="date"
          value={currentEndDate || ""}
          onChange={(e) => updateFilter("endDate", e.target.value || null)}
          className="w-[150px]"
        />
      </div>
    </div>
  );
}
