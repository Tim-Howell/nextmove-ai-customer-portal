# Tasks: dashboard-time-charts

## 1. Dependencies + chart base

- [ ] 1.1 Add `recharts` to `package.json`. Confirm `date-fns` is already present (it is used in time-entries flows).
- [ ] 1.2 Create `components/charts/recharts-base.tsx` exporting a `<ChartContainer>` wrapper that sets responsive sizing, default tooltip styles, and dark-theme axis/grid colors via `var(--color-border)` / `var(--color-fg-muted)`.
- [ ] 1.3 In `app/globals.css`, expose HSL component variables alongside the hex tokens (`--color-accent-hsl`, `--color-fg-muted-hsl`, `--color-primary-hsl`) so recharts `fill="hsl(var(--color-accent-hsl))"` works. Coordinate with `frontend-makeover` if it lands first.

## 2. Server actions

- [ ] 2.1 Create `app/actions/dashboard-charts.ts`.
- [ ] 2.2 Implement `getCustomerHoursSeries({ customerId, bucket, from, to, contractIds, billableMode })`:
  - SQL: `SELECT date_trunc($bucket, entry_date) AS bucket_start, sum(hours) FILTER (WHERE is_billable) AS billable_hours, sum(hours) FILTER (WHERE NOT is_billable) AS non_billable_hours FROM time_entries WHERE customer_id = $1 AND entry_date BETWEEN $2 AND $3 [AND contract_id = ANY($4)] [AND is_billable = $5] GROUP BY bucket_start ORDER BY bucket_start`.
  - Fill missing buckets with zero values in app code so the axis is contiguous.
- [ ] 2.3 Implement `getContractBurndowns(customerId)`:
  - Select contracts joined to `contract_types` where `tracks_hours AND has_hour_limit AND archived_at IS NULL`.
  - For each contract, compute current period (extract shared helper from contract detail page if not yet shared).
  - Sum `time_entries.hours` for the period.
  - Return `{ contractId, contractName, usedHours, allotmentHours, remainingHours, periodStart, periodEnd, isOverBudget }`.
- [ ] 2.4 Implement `getStaffHoursLast90Days()`:
  - SQL: `SELECT staff_id, profiles.full_name, sum(hours) FILTER (WHERE is_billable) AS billable, sum(hours) FILTER (WHERE NOT is_billable) AS non_billable FROM time_entries JOIN profiles ON profiles.id = staff_id WHERE entry_date >= now() - interval '90 days' GROUP BY staff_id, profiles.full_name HAVING sum(hours) > 0 ORDER BY (billable + non_billable) DESC`.

## 3. Customer dashboard

- [ ] 3.1 Extract today's customer-specific code from `app/(portal)/dashboard/page.tsx` into a new `app/(portal)/dashboard/customer-dashboard.tsx` server component.
- [ ] 3.2 Add a `DashboardFilterBar` client component with three controls: bucket toggle, contract multi-select (popover), billable-mode toggle. All controls update URL search params via `router.replace()` (shallow).
- [ ] 3.3 Create `components/dashboard/customer-time-chart.tsx` (client component) that takes pre-aggregated series data and renders a stacked recharts `<BarChart>` with billable bottom / non-billable top, axis ticks formatted by bucket size.
- [ ] 3.4 Create `components/dashboard/customer-burndown-card.tsx` — surface card with contract name, fill bar, big "X / Y hours used" numeric, "Z remaining" subtext, period dates. Over-budget treatment when `isOverBudget`.
- [ ] 3.5 Compose `customer-dashboard.tsx` in this order: welcome heading → `<DashboardFilterBar>` → chart → burndown grid → summary tiles → recent activity.
- [ ] 3.6 Read filter values from `searchParams` (Next 15 await pattern) with safe defaults: `bucket="day"`, `days=30` (or `180` when bucket=week), `contracts=undefined`, `billable="all"`.

## 4. Internal dashboard

- [ ] 4.1 Extract today's internal code into `app/(portal)/dashboard/internal-dashboard.tsx` server component.
- [ ] 4.2 Create `components/dashboard/admin-staff-hours-chart.tsx` — stacked bar chart, one bar per staff person, billable + non-billable, no filters, fixed 90-day weekly window.
- [ ] 4.3 Compose `internal-dashboard.tsx`: hours-by-person chart at top, existing summary tiles below.

## 5. Page composition

- [ ] 5.1 Reduce `app/(portal)/dashboard/page.tsx` to a thin server component: `getProfile()`, role check, render either `<CustomerDashboard searchParams={...} />` or `<InternalDashboard />`.
- [ ] 5.2 Update `app/(portal)/dashboard/loading.tsx` to show appropriate skeleton (chart-shaped) for the role.

## 6. Tests

- [ ] 6.1 Add e2e test `tests/e2e/customer/dashboard-charts.spec.ts`:
  - Login as customer; assert chart container is present.
  - Toggle to weekly; assert URL gains `?bucket=week`.
  - Open contract multi-select, deselect one contract; assert URL gains `?contracts=...`.
  - Burndown card visible when seeded customer has an Hours Bucket contract.
- [ ] 6.2 Add e2e test `tests/e2e/admin/dashboard-staff-hours.spec.ts`:
  - Login as admin; assert hours-by-person chart is present.
  - Assert at least one staff bar renders (using seeded data).
- [ ] 6.3 Run full e2e suite, lint, and build — all green.

## 7. Manual verification

- [ ] 7.1 Re-run `scripts/seed-demo-customer.ts`.
- [ ] 7.2 Log in as the demo customer; verify chart, filters, and burndowns.
- [ ] 7.3 Log in as admin; verify hours-by-person chart.
- [ ] 7.4 Test a customer with zero time entries — verify "No time logged" overlay.
- [ ] 7.5 Test a customer with no qualifying contracts — verify no burndown row renders.
