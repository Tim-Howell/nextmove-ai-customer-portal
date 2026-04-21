import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, DollarSign, FileText } from "lucide-react";
import type { ReportSummary } from "@/app/actions/reports";

interface ReportSummaryCardsProps {
  summary: ReportSummary;
}

export function ReportSummaryCards({ summary }: ReportSummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.totalHours.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground">All time entries</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Billable Hours</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.billableHours.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground">
            {summary.totalHours > 0
              ? `${((summary.billableHours / summary.totalHours) * 100).toFixed(0)}% of total`
              : "No entries"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Entries</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.entryCount}</div>
          <p className="text-xs text-muted-foreground">Time entries</p>
        </CardContent>
      </Card>
    </div>
  );
}
