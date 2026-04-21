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
import type { Customer, ReferenceValue } from "@/types/database";

interface ReportFiltersProps {
  customers?: Customer[];
  categories: ReferenceValue[];
  showCustomerFilter?: boolean;
}

export function ReportFilters({
  customers = [],
  categories,
  showCustomerFilter = true,
}: ReportFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [customerId, setCustomerId] = useState(searchParams.get("customerId") || "all");
  const [dateFrom, setDateFrom] = useState(searchParams.get("dateFrom") || "");
  const [dateTo, setDateTo] = useState(searchParams.get("dateTo") || "");
  const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") || "all");

  function applyFilters() {
    const params = new URLSearchParams();
    if (customerId && customerId !== "all") params.set("customerId", customerId);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    if (categoryId && categoryId !== "all") params.set("categoryId", categoryId);
    router.push(`/reports?${params.toString()}`);
  }

  function clearFilters() {
    setCustomerId("all");
    setDateFrom("");
    setDateTo("");
    setCategoryId("all");
    router.push("/reports");
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-4 items-end">
          {showCustomerFilter && (
            <div className="space-y-2 min-w-[200px]">
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
              className="w-[160px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateTo">Date To</Label>
            <Input
              id="dateTo"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-[160px]"
            />
          </div>

          <div className="space-y-2 min-w-[180px]">
            <Label htmlFor="category">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger id="category">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
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
