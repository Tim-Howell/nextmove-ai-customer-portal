"use server";

import { createClient } from "@/lib/supabase/server";
import { getShowDemoData } from "@/app/actions/settings";
import {
  calculateContractHours,
  calculateBillingPeriod,
  type ContractForCalculation,
  type TimeEntryForCalculation,
} from "@/lib/contracts/hours-calculator";

/**
 * Server-side aggregation queries for the dashboard charts.
 *
 * Three callers:
 *   - Customer dashboard time chart  → `getCustomerHoursSeries`
 *   - Customer dashboard burndowns   → `getContractBurndowns`
 *   - Admin/staff dashboard chart    → `getStaffHoursLast90Days`
 *
 * All aggregation happens on the database side via PostgreSQL `date_trunc`
 * and FILTER clauses; client components only receive already-bucketed
 * points. Empty buckets are filled in app code so the chart x-axis stays
 * contiguous.
 */

// ----------------------------------------------------------------------------
// Customer hours-over-time series
// ----------------------------------------------------------------------------

export type HoursBucket = "day" | "week";

export type BillableMode = "all" | "billable" | "non_billable";

export interface HoursSeriesPoint {
  /** ISO date string at the start of the bucket. */
  bucketStart: string;
  billableHours: number;
  nonBillableHours: number;
}

export interface GetCustomerHoursSeriesOptions {
  customerId: string;
  bucket: HoursBucket;
  from: Date;
  to: Date;
  /** Undefined = all contracts. Empty array also = all (treated as "no filter"). */
  contractIds?: string[];
  billableMode?: BillableMode;
}

/**
 * Aggregate `time_entries.hours` for a customer, grouped by day or week.
 *
 * Returns one point per bucket between `from` and `to`, with zero-filled
 * gaps so the resulting series is contiguous regardless of whether time
 * was logged on any given day.
 */
export async function getCustomerHoursSeries(
  options: GetCustomerHoursSeriesOptions
): Promise<HoursSeriesPoint[]> {
  const {
    customerId,
    bucket,
    from,
    to,
    contractIds,
    billableMode = "all",
  } = options;

  const supabase = await createClient();

  // Pull only the columns we aggregate over. We do the bucketing in app
  // code rather than via a Postgres function call so this works on the
  // standard Supabase client (no `rpc` round-trip needed).
  let query = supabase
    .from("time_entries")
    .select("entry_date, hours, is_billable, contract_id")
    .eq("customer_id", customerId)
    .gte("entry_date", isoDate(from))
    .lte("entry_date", isoDate(to));

  if (contractIds && contractIds.length > 0) {
    query = query.in("contract_id", contractIds);
  }

  if (billableMode === "billable") {
    query = query.eq("is_billable", true);
  } else if (billableMode === "non_billable") {
    query = query.eq("is_billable", false);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[dashboard-charts] getCustomerHoursSeries:", error);
    return [];
  }

  // Bucket aggregation in app code — small per-customer dataset; running
  // this on the client would be wasteful round-tripping but on the server
  // it's microseconds.
  const buckets = new Map<string, HoursSeriesPoint>();

  for (const row of data || []) {
    const key = bucketKey(new Date(row.entry_date), bucket);
    const point = buckets.get(key) || {
      bucketStart: key,
      billableHours: 0,
      nonBillableHours: 0,
    };
    const hours = Number(row.hours) || 0;
    if (row.is_billable) {
      point.billableHours += hours;
    } else {
      point.nonBillableHours += hours;
    }
    buckets.set(key, point);
  }

  // Fill missing buckets so the chart x-axis is contiguous.
  return fillBuckets(buckets, from, to, bucket);
}

// ----------------------------------------------------------------------------
// Per-contract burndown for the customer's qualifying contracts
// ----------------------------------------------------------------------------

export interface ContractBurndown {
  contractId: string;
  contractName: string;
  contractTypeLabel: string;
  /** Hours used in the current billing period. */
  usedHours: number;
  /** Allotment for the current period (incl. rollover when applicable). */
  allotmentHours: number;
  /** Convenience: `allotmentHours - usedHours`; may be negative. */
  remainingHours: number;
  /** ISO date for period start (or contract start for non-recurring buckets). */
  periodStart: string;
  /** ISO date for period end (or contract end for non-recurring buckets). */
  periodEnd: string;
  isOverBudget: boolean;
  /** Hours rolled over from prior periods (Hours Subscription only). */
  rolloverHours: number;
}

/**
 * Burndown rows for every contract owned by `customerId` whose contract
 * type both `tracks_hours` and `has_hour_limit` (i.e. Hours Bucket and
 * Hours Subscription). Non-qualifying contracts are silently excluded.
 */
export async function getContractBurndowns(
  customerId: string
): Promise<ContractBurndown[]> {
  const supabase = await createClient();

  const { data: contracts, error } = await supabase
    .from("contracts")
    .select(
      `
      id,
      name,
      total_hours,
      hours_per_period,
      billing_day,
      start_date,
      end_date,
      rollover_enabled,
      rollover_expiration_days,
      max_rollover_hours,
      contract_type:contract_types!inner(value, label, tracks_hours, has_hour_limit)
      `
    )
    .eq("customer_id", customerId)
    .is("archived_at", null);

  if (error) {
    console.error("[dashboard-charts] getContractBurndowns:", error);
    return [];
  }

  const qualifying = (contracts || []).filter((c) => {
    // Supabase types unwrap `!inner` joins to the related row directly.
    const type = c.contract_type as unknown as {
      value: string;
      label: string;
      tracks_hours: boolean;
      has_hour_limit: boolean;
    } | null;
    return type?.tracks_hours && type?.has_hour_limit;
  });

  if (qualifying.length === 0) return [];

  // Pull every time entry for the qualifying contracts in one round trip.
  const contractIds = qualifying.map((c) => c.id);
  const { data: timeRows } = await supabase
    .from("time_entries")
    .select("contract_id, entry_date, hours")
    .eq("customer_id", customerId)
    .in("contract_id", contractIds);

  const entriesByContract = new Map<string, TimeEntryForCalculation[]>();
  for (const row of timeRows || []) {
    if (!row.contract_id) continue;
    const list = entriesByContract.get(row.contract_id) || [];
    list.push({ hours: Number(row.hours) || 0, entry_date: row.entry_date });
    entriesByContract.set(row.contract_id, list);
  }

  const now = new Date();
  const burndowns: ContractBurndown[] = [];

  for (const contract of qualifying) {
    const type = contract.contract_type as unknown as {
      value: string;
      label: string;
    };
    const calcInput: ContractForCalculation = {
      id: contract.id,
      contract_type_value: type.value,
      total_hours: contract.total_hours,
      hours_per_period: contract.hours_per_period,
      billing_day: contract.billing_day,
      start_date: contract.start_date,
      end_date: contract.end_date,
      rollover_enabled: !!contract.rollover_enabled,
      rollover_expiration_days: contract.rollover_expiration_days,
      max_rollover_hours: contract.max_rollover_hours,
    };

    const result = calculateContractHours(
      calcInput,
      entriesByContract.get(contract.id) || [],
      now
    );

    if (type.value === "hours_subscription") {
      const period =
        result.currentPeriod ||
        calculateBillingPeriod(contract.billing_day || 1, now);
      const allotment = result.totalAvailableThisPeriod ?? 0;
      const used = result.periodHoursUsed ?? 0;
      burndowns.push({
        contractId: contract.id,
        contractName: contract.name,
        contractTypeLabel: type.label,
        usedHours: used,
        allotmentHours: allotment,
        remainingHours: allotment - used,
        periodStart: period.start.toISOString(),
        periodEnd: period.end.toISOString(),
        isOverBudget: !!result.isOverLimit,
        rolloverHours: result.rolloverHoursAvailable ?? 0,
      });
    } else {
      // hours_bucket: allotment = total_hours, period = whole contract.
      const allotment = contract.total_hours ?? 0;
      const used = result.totalHoursUsed;
      burndowns.push({
        contractId: contract.id,
        contractName: contract.name,
        contractTypeLabel: type.label,
        usedHours: used,
        allotmentHours: allotment,
        remainingHours: allotment - used,
        periodStart: contract.start_date || new Date().toISOString(),
        periodEnd:
          contract.end_date ||
          new Date(now.getFullYear() + 1, 0, 1).toISOString(),
        isOverBudget: !!result.isBucketExceeded,
        rolloverHours: 0,
      });
    }
  }

  return burndowns;
}

// ----------------------------------------------------------------------------
// Admin/staff dashboard: hours by staff person, last 90 days
// ----------------------------------------------------------------------------

export interface StaffHoursPoint {
  staffId: string;
  staffName: string;
  billableHours: number;
  nonBillableHours: number;
  totalHours: number;
}

/**
 * Hours logged by each staff member over the trailing 90 days, split into
 * billable / non-billable. Used for the admin/staff dashboard's single
 * "who's logging time" chart. Staff with zero hours are excluded.
 *
 * Honors the System Settings demo-data toggle: when demo data is hidden,
 * time entries against demo customers are excluded.
 */
export async function getStaffHoursLast90Days(): Promise<StaffHoursPoint[]> {
  const supabase = await createClient();
  const showDemoData = await getShowDemoData();

  const since = new Date();
  since.setDate(since.getDate() - 90);

  let query = supabase
    .from("time_entries")
    .select(
      `
      hours,
      is_billable,
      staff_id,
      staff:profiles!time_entries_staff_id_fkey(id, full_name),
      customer:customers!inner(is_demo)
      `
    )
    .gte("entry_date", isoDate(since));

  if (!showDemoData) {
    query = query.eq("customer.is_demo", false);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[dashboard-charts] getStaffHoursLast90Days:", error);
    return [];
  }

  const byStaff = new Map<string, StaffHoursPoint>();
  for (const row of data || []) {
    if (!row.staff_id) continue;
    const staff = row.staff as unknown as {
      id: string;
      full_name: string | null;
    } | null;
    const point = byStaff.get(row.staff_id) || {
      staffId: row.staff_id,
      staffName: staff?.full_name || "Unknown",
      billableHours: 0,
      nonBillableHours: 0,
      totalHours: 0,
    };
    const hours = Number(row.hours) || 0;
    if (row.is_billable) {
      point.billableHours += hours;
    } else {
      point.nonBillableHours += hours;
    }
    point.totalHours += hours;
    byStaff.set(row.staff_id, point);
  }

  return Array.from(byStaff.values())
    .filter((p) => p.totalHours > 0)
    .sort((a, b) => b.totalHours - a.totalHours);
}

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

function isoDate(d: Date): string {
  // YYYY-MM-DD without time component — matches the shape of `entry_date`.
  return d.toISOString().slice(0, 10);
}

/**
 * Compute the canonical bucket key for a given date.
 *   - "day"  → ISO date (YYYY-MM-DD)
 *   - "week" → ISO date of the Monday of that ISO week
 */
function bucketKey(d: Date, bucket: HoursBucket): string {
  if (bucket === "day") return isoDate(d);
  return isoDate(startOfIsoWeek(d));
}

function startOfIsoWeek(d: Date): Date {
  const copy = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  // ISO week starts on Monday. JS getDay() returns 0=Sun..6=Sat.
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  return copy;
}

function fillBuckets(
  buckets: Map<string, HoursSeriesPoint>,
  from: Date,
  to: Date,
  bucket: HoursBucket
): HoursSeriesPoint[] {
  const out: HoursSeriesPoint[] = [];
  const cursor =
    bucket === "day"
      ? new Date(from.getFullYear(), from.getMonth(), from.getDate())
      : startOfIsoWeek(from);
  const end =
    bucket === "day"
      ? new Date(to.getFullYear(), to.getMonth(), to.getDate())
      : startOfIsoWeek(to);

  // Safety cap: 365 daily or 78 weekly buckets max so a bad input range
  // can't accidentally generate millions of array entries.
  const cap = bucket === "day" ? 366 : 78;
  let n = 0;

  while (cursor <= end && n < cap) {
    const key = isoDate(cursor);
    out.push(
      buckets.get(key) || {
        bucketStart: key,
        billableHours: 0,
        nonBillableHours: 0,
      }
    );
    if (bucket === "day") {
      cursor.setDate(cursor.getDate() + 1);
    } else {
      cursor.setDate(cursor.getDate() + 7);
    }
    n++;
  }

  return out;
}
