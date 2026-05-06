import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/supabase/profile";
import {
  getTimeEntriesReport,
  getCustomersForReport,
  type ReportFilters,
} from "@/app/actions/reports";
import { ReportSummaryCards } from "@/components/reports/report-summary";
import { MyTimeFilters } from "@/components/reports/my-time-filters";
import { MyTimeTable } from "./my-time-table";

interface MyTimeReportPageProps {
  searchParams: Promise<{
    customerId?: string;
    dateFrom?: string;
    dateTo?: string;
    billable?: string;
  }>;
}

/**
 * "My Time Entries" report — auto-scoped to the logged-in user's staff_id.
 * Admin/staff only; customer users don't log time.
 */
export default async function MyTimeReportPage({
  searchParams,
}: MyTimeReportPageProps) {
  const params = await searchParams;
  const profile = await getProfile();

  if (!profile) {
    redirect("/login");
  }

  const isInternal = profile.role === "admin" || profile.role === "staff";
  if (!isInternal) {
    redirect("/reports/time");
  }

  // Hardcode staffIds to the current user; the rest come from the URL.
  const filters: ReportFilters = {
    customerId: params.customerId,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
    billable: params.billable as "yes" | "no" | undefined,
    staffIds: [profile.id],
  };

  const [{ summary, entries }, customers] = await Promise.all([
    getTimeEntriesReport(filters),
    getCustomersForReport(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">My Time Entries</h1>
        <p className="text-muted-foreground">
          Time entries logged by you, with customer and date filters.
        </p>
      </div>

      <Suspense fallback={<div>Loading filters...</div>}>
        <MyTimeFilters customers={customers} />
      </Suspense>

      <ReportSummaryCards summary={summary} />

      <MyTimeTable entries={entries} />
    </div>
  );
}
