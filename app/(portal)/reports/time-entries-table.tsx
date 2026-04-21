"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";
import { exportToCSV } from "@/lib/utils/csv-export";
import type { TimeEntryReportRow } from "@/app/actions/reports";

interface TimeEntriesReportTableProps {
  entries: TimeEntryReportRow[];
  showCustomer?: boolean;
}

export function TimeEntriesReportTable({
  entries,
  showCustomer = true,
}: TimeEntriesReportTableProps) {
  function handleExport() {
    const columns = [
      { key: "entry_date" as const, header: "Date" },
      ...(showCustomer ? [{ key: "customer" as const, header: "Customer" }] : []),
      { key: "contract" as const, header: "Contract" },
      { key: "category" as const, header: "Category" },
      { key: "hours" as const, header: "Hours" },
      { key: "is_billable" as const, header: "Billable" },
      { key: "description" as const, header: "Description" },
    ];

    const exportData = entries.map((entry) => ({
      entry_date: entry.entry_date,
      customer: entry.customer?.name || "",
      contract: entry.contract?.name || "",
      category: entry.category?.label || "",
      hours: entry.hours,
      is_billable: entry.is_billable ? "Yes" : "No",
      description: entry.description || "",
    }));

    const today = new Date().toISOString().split("T")[0];
    exportToCSV(exportData, columns as { key: keyof typeof exportData[0]; header: string }[], `time-entries-${today}`);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Time Entries</CardTitle>
        <Button variant="outline" size="sm" onClick={handleExport} disabled={entries.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No time entries found for the selected filters
          </p>
        ) : (
          <div className="max-h-[500px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  {showCustomer && <TableHead>Customer</TableHead>}
                  <TableHead>Contract</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Hours</TableHead>
                  <TableHead>Billable</TableHead>
                  <TableHead className="max-w-[200px]">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      {new Date(entry.entry_date).toLocaleDateString()}
                    </TableCell>
                    {showCustomer && (
                      <TableCell className="truncate max-w-[150px]">
                        {entry.customer?.name || "—"}
                      </TableCell>
                    )}
                    <TableCell className="truncate max-w-[150px]">
                      {entry.contract?.name || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{entry.category?.label || "—"}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {Number(entry.hours).toFixed(1)}
                    </TableCell>
                    <TableCell>
                      {entry.is_billable ? (
                        <Badge variant="default">Yes</Badge>
                      ) : (
                        <Badge variant="secondary">No</Badge>
                      )}
                    </TableCell>
                    <TableCell className="truncate max-w-[200px]">
                      {entry.description || "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
