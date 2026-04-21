import { Suspense } from "react";
import { getProfile } from "@/lib/supabase/profile";
import { getTimeEntriesReport, getCustomersForReport, type ReportFilters } from "@/app/actions/reports";
import { getReferenceValues } from "@/app/actions/reference";
import { ReportFilters as ReportFiltersComponent } from "@/components/reports/report-filters";
import { ReportSummaryCards } from "@/components/reports/report-summary";
import { TimeEntriesReportTable } from "./time-entries-table";

interface ReportsPageProps {
  searchParams: Promise<{
    customerId?: string;
    dateFrom?: string;
    dateTo?: string;
    categoryId?: string;
  }>;
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const params = await searchParams;
  const profile = await getProfile();
  const isInternal = profile?.role === "admin" || profile?.role === "staff";

  const filters: ReportFilters = {
    customerId: isInternal ? params.customerId : profile?.customer_id || undefined,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
    categoryId: params.categoryId,
  };

  const [{ summary, entries }, customers, categories] = await Promise.all([
    getTimeEntriesReport(filters),
    isInternal ? getCustomersForReport() : Promise.resolve([]),
    getReferenceValues("time_category"),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Reports</h1>
        <p className="text-muted-foreground">
          {isInternal
            ? "View and export time entries across all customers"
            : "View and export your time entries"}
        </p>
      </div>

      <Suspense fallback={<div>Loading filters...</div>}>
        <ReportFiltersComponent
          customers={customers}
          categories={categories}
          showCustomerFilter={isInternal}
        />
      </Suspense>

      <ReportSummaryCards summary={summary} />

      <TimeEntriesReportTable entries={entries} showCustomer={isInternal} />
    </div>
  );
}
