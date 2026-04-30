import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerDashboardRedesigned } from "@/components/dashboard/customer-dashboard-redesigned";
import { DashboardFilterBar } from "@/components/dashboard/dashboard-filter-bar";
import { CustomerTimeChart } from "@/components/dashboard/customer-time-chart";
import { CustomerBurndownCard } from "@/components/dashboard/customer-burndown-card";
import { getContracts } from "@/app/actions/contracts";
import {
  getCustomerHoursSeries,
  getContractBurndowns,
  type HoursBucket,
  type BillableMode,
} from "@/app/actions/dashboard-charts";

/**
 * Customer-facing dashboard. Composition order:
 *   1. Time chart + filter bar (top)
 *   2. Per-contract burndown grid (when the customer has qualifying contracts)
 *   3. Existing summary stack: stats, team, active contracts, priorities, quick actions
 *
 * The chart and burndowns are the new value; everything below them is the
 * pre-existing `CustomerDashboardRedesigned` component, kept verbatim so we
 * don't churn that work.
 */
export interface CustomerDashboardProps {
  customerName: string;
  customerId: string;
  searchParams: Record<string, string | string[] | undefined>;
}

export async function CustomerDashboard({
  customerName,
  customerId,
  searchParams,
}: CustomerDashboardProps) {
  const filters = parseFilters(searchParams);

  // Range computation: daily defaults to last 30 days, weekly to last 180.
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - filters.days + 1);

  const [series, burndowns, contractsResult] = await Promise.all([
    getCustomerHoursSeries({
      customerId,
      bucket: filters.bucket,
      from,
      to,
      contractIds:
        filters.contractIds.length > 0 ? filters.contractIds : undefined,
      billableMode: filters.billableMode,
    }),
    getContractBurndowns(customerId),
    getContracts({ customerId }),
  ]);

  const allContracts = (contractsResult.data || []).map((c) => ({
    id: c.id,
    name: c.name,
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-xl">Hours over time</CardTitle>
          <DashboardFilterBar
            bucket={filters.bucket}
            billableMode={filters.billableMode}
            selectedContractIds={filters.contractIds}
            contracts={allContracts}
          />
        </CardHeader>
        <CardContent>
          <CustomerTimeChart data={series} bucket={filters.bucket} />
        </CardContent>
      </Card>

      {burndowns.length > 0 && (
        <section aria-labelledby="burndowns-heading" className="space-y-3">
          <h2
            id="burndowns-heading"
            className="text-lg font-semibold text-foreground"
          >
            Hours by contract
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {burndowns.map((burndown) => (
              <CustomerBurndownCard
                key={burndown.contractId}
                burndown={burndown}
              />
            ))}
          </div>
        </section>
      )}

      <CustomerDashboardRedesigned
        customerName={customerName}
        customerId={customerId}
      />
    </div>
  );
}

interface ParsedFilters {
  bucket: HoursBucket;
  billableMode: BillableMode;
  contractIds: string[];
  /** Inclusive range size in days; matches what the chart x-axis spans. */
  days: number;
}

function parseFilters(
  searchParams: Record<string, string | string[] | undefined>
): ParsedFilters {
  const bucket: HoursBucket = first(searchParams.bucket) === "week" ? "week" : "day";

  const billable = first(searchParams.billable);
  const billableMode: BillableMode =
    billable === "billable" || billable === "non_billable" ? billable : "all";

  const contractIds = (first(searchParams.contracts) || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  // Default windows: 30 daily / 180 weekly. Admins / power users can pass
  // ?days=N to widen, capped server-side by the bucket-fill safety cap.
  const daysParam = Number(first(searchParams.days));
  const days = Number.isFinite(daysParam) && daysParam > 0
    ? Math.min(daysParam, bucket === "day" ? 365 : 540)
    : bucket === "day"
      ? 30
      : 180;

  return { bucket, billableMode, contractIds, days };
}

function first(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}
