"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Pencil } from "lucide-react";
import { exportToCSV } from "@/lib/utils/csv-export";
import { formatDateOnly } from "@/lib/utils/date";
import type { TimeEntryReportRow } from "@/app/actions/reports";

interface MyTimeTableProps {
  entries: TimeEntryReportRow[];
}

/**
 * Compact time-entries table for the "My Time Entries" report.
 *
 * Columns: Date, Customer, Contract, Hours, Description (+ edit shortcut).
 * Staff/Category/Billable are intentionally omitted — staff is implicit
 * (always the current user), and category/billable are filter-only here.
 */
export function MyTimeTable({ entries }: MyTimeTableProps) {
  function handleExport() {
    const columns = [
      { key: "entry_date" as const, header: "Date" },
      { key: "customer" as const, header: "Customer" },
      { key: "contract" as const, header: "Contract" },
      { key: "hours" as const, header: "Hours" },
      { key: "description" as const, header: "Description" },
    ];

    const exportData = entries.map((entry) => ({
      entry_date: entry.entry_date,
      customer: entry.customer?.name || "",
      contract: entry.contract?.name || "",
      hours: entry.hours,
      description: entry.description || "",
    }));

    const today = new Date().toISOString().split("T")[0];
    exportToCSV(
      exportData,
      columns as { key: keyof typeof exportData[0]; header: string }[],
      `my-time-entries-${today}`
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>My Time Entries</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={entries.length === 0}
        >
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
          <div className="max-h-[600px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contract</TableHead>
                  <TableHead className="text-right">Hours</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      {formatDateOnly(entry.entry_date)}
                    </TableCell>
                    <TableCell className="truncate max-w-[180px]">
                      {entry.customer?.name || "—"}
                    </TableCell>
                    <TableCell className="truncate max-w-[180px]">
                      {entry.contract?.name || "—"}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {Number(entry.hours).toFixed(1)}
                    </TableCell>
                    <TableCell className="truncate max-w-[320px]">
                      {entry.description || "—"}
                    </TableCell>
                    <TableCell className="w-12">
                      <Link href={`/time-logs/${entry.id}/edit`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label={`Edit time entry from ${entry.entry_date}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
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
