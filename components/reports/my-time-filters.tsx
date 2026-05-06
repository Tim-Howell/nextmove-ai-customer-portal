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
import type { Customer } from "@/types/database";

interface MyTimeFiltersProps {
  customers: Customer[];
}

/**
 * Filter bar for the "My Time Entries" report. The report is automatically
 * scoped to the logged-in user server-side, so this only exposes the three
 * filters the user can vary: customer, date range, and billable mode.
 */
export function MyTimeFilters({ customers }: MyTimeFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [customerId, setCustomerId] = useState(
    searchParams.get("customerId") || "all"
  );
  const [dateFrom, setDateFrom] = useState(searchParams.get("dateFrom") || "");
  const [dateTo, setDateTo] = useState(searchParams.get("dateTo") || "");
  const [billable, setBillable] = useState(
    searchParams.get("billable") || "all"
  );

  function applyFilters() {
    const params = new URLSearchParams();
    if (customerId && customerId !== "all") params.set("customerId", customerId);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    if (billable && billable !== "all") params.set("billable", billable);
    router.push(`/reports/my-time?${params.toString()}`);
  }

  function clearFilters() {
    setCustomerId("all");
    setDateFrom("");
    setDateTo("");
    setBillable("all");
    router.push("/reports/my-time");
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

          <div className="flex items-end gap-2 lg:col-span-4">
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
