"use client";

import Link from "next/link";
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
import { Download, Pencil } from "lucide-react";
import { exportToCSV } from "@/lib/utils/csv-export";
import type { TimeEntryReportRow } from "@/app/actions/reports";

interface TimeEntriesReportTableProps {
  entries: TimeEntryReportRow[];
  showCustomer?: boolean;
  /** When true, renders an Edit action column linking to /time-logs/[id]/edit. */
  canEdit?: boolean;
}

export function TimeEntriesReportTable({
  entries,
  showCustomer = true,
  canEdit = false,
}: TimeEntriesReportTableProps) {
  function handleExport() {
    const columns = [
      { key: "entry_date" as const, header: "Date" },
      ...(showCustomer ? [{ key: "customer" as const, header: "Customer" }] : []),
      { key: "contract" as const, header: "Contract" },
      { key: "staff" as const, header: "Staff" },
      { key: "category" as const, header: "Category" },
      { key: "hours" as const, header: "Hours" },
      { key: "is_billable" as const, header: "Billable" },
      { key: "description" as const, header: "Description" },
    ];

    const exportData = entries.map((entry) => ({
      entry_date: entry.entry_date,
      customer: entry.customer?.name || "",
      contract: entry.contract?.name || "",
      staff: entry.staff?.full_name || "Unknown",
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
                  <TableHead>Staff</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Hours</TableHead>
                  <TableHead>Billable</TableHead>
                  <TableHead className="max-w-[200px]">Description</TableHead>
                  {canEdit && <TableHead className="w-12" />}
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
                      {entry.staff?.full_name || "Unknown"}
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
                    {canEdit && (
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
                    )}
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
