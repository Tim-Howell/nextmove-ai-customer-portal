## Context

`time_entries` is the highest-volume table that drives most product value. It has `customer_id`, `contract_id`, `staff_id` (the `profiles.id` of who logged time), `entry_date`, `hours` (decimal), `is_billable bool`. Aggregating it well yields meaningful charts.

The dashboard today is two divergent paths inside one `page.tsx`: an internal view (counts of customers, contracts, requests, priorities) and a customer view (their counts plus a recent activity feed). Both are server-rendered.

`contracts` has type metadata via `contract_types` with behavior flags including `tracks_hours` and `has_hour_limit`. Burndown only makes sense for contracts where both flags are true.

Charts must work on the Apple-style soft-light theme that landed via `frontend-makeover` and stay re-skinnable through the same `--brand-*` token layer without library churn.

## Goals / Non-Goals

**Goals:**
- Customer dashboard answers "how am I trending?" in two seconds.
- Per-contract burndowns are scannable — fill bar, remaining hours, period boundaries.
- Admin dashboard answers "are people logging time?" in one chart.
- All filter state lives in URL search params so views are shareable and SSR-friendly.
- Server-side aggregation; client-side rendering only of the chart with already-aggregated points.

**Non-Goals:**
- Cross-customer drill-down for staff (e.g., a staff person filtering to a single customer). Stays in `/reports` if needed.
- Forecasting / trend lines / "you'll run out by X". Punt.
- Scheduled emails / digests. Punt.
- Contract burndowns for non-hours contracts (Fixed Cost, Service Subscription).
- Realtime / streaming updates. Pages re-fetch on navigation.

## Decisions

### Decision 1: Chart library = recharts

shadcn ships chart wrappers built on recharts (`components/ui/chart.tsx` is a documented pattern). Recharts plays nicely with CSS variables for colors via the `fill`/`stroke` props receiving `var(--color-accent)`. SSR-friendly. Mature.

Considered tremor (heavier; opinionated layout system that fights shadcn), visx (lower-level than we need), nivo (D3-y, more setup). Recharts wins on time-to-value.

### Decision 2: Role split into two dashboard components

`app/(portal)/dashboard/page.tsx` becomes a thin server component that calls `getProfile()` and renders either `<CustomerDashboard />` or `<InternalDashboard />`. Each lives in its own file. This stops the cross-cutting if/else mess that already exists today.

### Decision 3: Customer aggregation server action shape

```ts
// app/actions/dashboard-charts.ts
export async function getCustomerHoursSeries(opts: {
  customerId: string;
  bucket: "day" | "week";
  from: Date;
  to: Date;
  contractIds?: string[];          // undefined = all
  billableMode?: "all" | "billable" | "non_billable";
}): Promise<HoursSeriesPoint[]>;

type HoursSeriesPoint = {
  bucketStart: string;             // ISO
  billableHours: number;
  nonBillableHours: number;
};
```

SQL uses `date_trunc(bucket, entry_date)` + `sum(hours) FILTER (WHERE is_billable)` and `sum(hours) FILTER (WHERE NOT is_billable)`. Single query, single round-trip. Empty buckets are filled in app code so the chart x-axis is contiguous.

### Decision 4: Burndown definition

For each contract where `contract_types.tracks_hours = true AND has_hour_limit = true`:

- **Period:** the contract's current billing period (already a concept — `contracts.period_start`, `period_end`, or computed from recurrence).
- **Allotment:** `contracts.hour_limit` for the period, plus rollover from previous period if `supports_rollover` and the existing rollover field has a positive value.
- **Used:** `sum(hours)` from `time_entries` where `contract_id = X` and `entry_date BETWEEN period_start AND period_end`.
- **Display:** fill bar (`used / allotment`), big numeric for remaining, period label.

`getContractBurndowns(customerId)` returns one row per qualifying contract. Non-qualifying contracts are silently excluded.

### Decision 5: URL state shape

Customer dashboard search params:
- `?bucket=day|week` (default `day`)
- `?days=30|180|365` (default `30` when `bucket=day`, `180` when `bucket=week`)
- `?contracts=<id>,<id>` (default unset = all)
- `?billable=all|yes|no` (default `all`)

Admin dashboard takes none. Hardcoded last-90-days, weekly bucket, all staff.

### Decision 6: Color sourcing

Chart components do not hardcode colors. They read `var(--brand-accent)` for billable, `var(--brand-fg-muted)` for non-billable, `var(--brand-primary)` for emphasis lines, `var(--brand-border)` for axes. This means an admin re-skinning the portal via `/settings/portal-branding` automatically reskins charts.

Recharts accepts string colors directly; we pass them inline:
```tsx
<Bar dataKey="billableHours" fill="hsl(var(--brand-accent-hsl))" />
```
The HSL companion variables (`--brand-bg-hsl`, `--brand-fg-hsl`, `--brand-primary-hsl`, `--brand-accent-hsl`) are already emitted by the theme injection layer (`lib/theme/css-vars.ts`) so no globals.css change is needed.

### Decision 7: Filter UI placement

A small filter bar sits between the page title and the first chart on the customer dashboard. It's a sticky-on-scroll bar with three controls:
- Daily/Weekly segmented toggle.
- Contract multi-select (popover with checkboxes; "All contracts" is the default label).
- Billable mode segmented toggle (`All` / `Billable` / `Non-billable`).

All three update the URL via `router.replace()` (shallow), preserving SSR.

### Decision 8: Layout — top-of-page charts, summary tiles below

```
[Page title + filter bar]
[Hours-over-time chart, full width]
[Burndown card | Burndown card | Burndown card] (auto-flow grid, 3 per row desktop)
[Existing summary tiles: open priorities, open requests, recent activity]
```

If the customer has no qualifying contracts, the burndown row is omitted entirely (no empty state — it would just look broken).

## Risks / Trade-offs

- **Risk: aggregation queries get slow on large `time_entries`** → Mitigation: add a partial index on `time_entries (customer_id, entry_date)` if the dashboard takes >300ms in production. Not added pre-emptively.
- **Risk: empty data ranges look like a bug** → Mitigation: app-side bucket filling guarantees a contiguous axis with zero values rendered as flat bars.
- **Risk: customer multi-select adds friction** → Mitigation: defaults to "All contracts"; users only touch it if they care.
- **Risk: burndown rollover calc is wrong** → Mitigation: use the existing rollover logic from contract detail page (extract into a shared helper) — single source of truth.
- **Trade-off: admin dashboard is intentionally minimal** — accepted; richer staff time analytics already live in `/reports`.

## Migration Plan

No data migration. Code-only change. Rollback = revert.

## Open Questions

- Should the customer dashboard include a "today" callout (hours logged today)? Out of scope unless trivially cheap during implementation.
