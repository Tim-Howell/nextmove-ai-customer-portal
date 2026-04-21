"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { MultiSelect } from "@/components/ui/multi-select";
import type { Customer, ReferenceValue } from "@/types/database";

interface ReportFiltersProps {
  customers?: Customer[];
  categories: ReferenceValue[];
  contracts?: { id: string; name: string }[];
  staff?: { id: string; full_name: string }[];
  showCustomerFilter?: boolean;
  showStaffFilter?: boolean;
}

export function ReportFilters({
  customers = [],
  categories,
  contracts = [],
  staff = [],
  showCustomerFilter = true,
  showStaffFilter = true,
}: ReportFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [customerId, setCustomerId] = useState(searchParams.get("customerId") || "all");
  const [dateFrom, setDateFrom] = useState(searchParams.get("dateFrom") || "");
  const [dateTo, setDateTo] = useState(searchParams.get("dateTo") || "");
  const [categoryIds, setCategoryIds] = useState<string[]>(
    searchParams.get("categoryIds")?.split(",").filter(Boolean) || []
  );
  const [contractIds, setContractIds] = useState<string[]>(
    searchParams.get("contractIds")?.split(",").filter(Boolean) || []
  );
  const [billable, setBillable] = useState(searchParams.get("billable") || "all");
  const [staffIds, setStaffIds] = useState<string[]>(
    searchParams.get("staffIds")?.split(",").filter(Boolean) || []
  );

  function applyFilters() {
    const params = new URLSearchParams();
    if (customerId && customerId !== "all") params.set("customerId", customerId);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    if (categoryIds.length > 0) params.set("categoryIds", categoryIds.join(","));
    if (contractIds.length > 0) params.set("contractIds", contractIds.join(","));
    if (billable && billable !== "all") params.set("billable", billable);
    if (staffIds.length > 0) params.set("staffIds", staffIds.join(","));
    router.push(`/reports?${params.toString()}`);
  }

  function clearFilters() {
    setCustomerId("all");
    setDateFrom("");
    setDateTo("");
    setCategoryIds([]);
    setContractIds([]);
    setBillable("all");
    setStaffIds([]);
    router.push("/reports");
  }

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.label }));
  const contractOptions = contracts.map((c) => ({ value: c.id, label: c.name }));
  const staffOptions = staff.map((s) => ({ value: s.id, label: s.full_name || "Unknown" }));

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {showCustomerFilter && (
            <div className="space-y-2">
              <Label htmlFor="customer">Customer</Label>
              <Select value={customerId} onValueChange={setCustomerId}>
                <SelectTrigger id="customer">
                  <SelectValue placeholder="All customers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All customers</SelectItem>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="dateFrom">Date From</Label>
            <Input
              id="dateFrom"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateTo">Date To</Label>
            <Input
              id="dateTo"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Categories</Label>
            <MultiSelect
              options={categoryOptions}
              selected={categoryIds}
              onChange={setCategoryIds}
              placeholder="All categories"
            />
          </div>

          <div className="space-y-2">
            <Label>Contracts</Label>
            <MultiSelect
              options={contractOptions}
              selected={contractIds}
              onChange={setContractIds}
              placeholder="All contracts"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="billable">Billable</Label>
            <Select value={billable} onValueChange={setBillable}>
              <SelectTrigger id="billable">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {showStaffFilter && (
            <div className="space-y-2">
              <Label>Staff</Label>
              <MultiSelect
                options={staffOptions}
                selected={staffIds}
                onChange={setStaffIds}
                placeholder="All staff"
              />
            </div>
          )}

          <div className="flex items-end gap-2">
            <Button onClick={applyFilters}>Apply</Button>
            <Button variant="outline" onClick={clearFilters}>
              Clear
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
