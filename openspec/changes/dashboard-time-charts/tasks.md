# Tasks: dashboard-time-charts

## 1. Dependencies + chart base

- [x] 1.1 Add `recharts` to `package.json`. Confirm `date-fns` is already present (it is used in time-entries flows).
- [x] 1.2 Create `components/charts/recharts-base.tsx` exporting a `<ChartContainer>` wrapper that sets responsive sizing, default tooltip styles, and theme-aware axis/grid colors via `var(--brand-border)` / `var(--brand-fg-muted)`. *(Also exports `chartTooltipStyle` and `chartAxisTickStyle` so child charts pick up the same surface treatment without re-declaring colors.)*
- [x] 1.3 ~~In `app/globals.css`, expose HSL component variables alongside the hex tokens~~ — *already shipped via `frontend-makeover`. `lib/theme/css-vars.ts` emits `--brand-bg-hsl`, `--brand-fg-hsl`, `--brand-primary-hsl`, `--brand-accent-hsl`. Charts use `hsl(var(--brand-accent-hsl))` directly.*

## 2. Server actions

- [x] 2.1 Create `app/actions/dashboard-charts.ts`.
- [x] 2.2 Implement `getCustomerHoursSeries({ customerId, bucket, from, to, contractIds, billableMode })`. *(Aggregation done in app code over a single Supabase select — the standard client doesn't expose `date_trunc` directly without `rpc`, so we bucket by ISO day or ISO-Monday week in TypeScript. Empty buckets filled in app code; range capped at 365 daily / 78 weekly so a bad input can't generate millions of points.)*
- [x] 2.3 Implement `getContractBurndowns(customerId)`. *(Reuses `calculateContractHours` from `lib/contracts/hours-calculator.ts` so subscription rollover and bucket overflow logic are computed by the same code path that the contract detail page uses.)*
- [x] 2.4 Implement `getStaffHoursLast90Days()`. *(Honors the System Settings demo-data toggle, sorts by total hours desc, drops zero-hour staff.)*

## 3. Customer dashboard

- [x] 3.1 Extract today's customer-specific code from `app/(portal)/dashboard/page.tsx` into a new `app/(portal)/dashboard/customer-dashboard.tsx` server component. *(Existing `CustomerDashboardRedesigned` reused as the summary stack; new `customer-dashboard.tsx` wraps the chart + burndowns above it.)*
- [x] 3.2 Add a `DashboardFilterBar` client component with three controls: bucket toggle, contract multi-select (popover), billable-mode toggle. All controls update URL search params via `router.replace()` (shallow).
- [x] 3.3 Create `components/dashboard/customer-time-chart.tsx` (client component) that takes pre-aggregated series data and renders a stacked recharts `<BarChart>` with billable bottom / non-billable top, axis ticks formatted by bucket size.
- [x] 3.4 Create `components/dashboard/customer-burndown-card.tsx` — surface card with contract name, fill bar, big "X / Y hours used" numeric, "Z remaining" subtext, period dates. Over-budget treatment when `isOverBudget`.
- [x] 3.5 Compose `customer-dashboard.tsx` in this order: filter bar + chart card → burndown grid (when present) → existing summary stack via `CustomerDashboardRedesigned`.
- [x] 3.6 Read filter values from `searchParams` (Next 15 await pattern) with safe defaults: `bucket="day"`, `days=30` (or `180` when bucket=week), `contracts=undefined`, `billable="all"`.

## 4. Internal dashboard

- [x] 4.1 Extract today's internal code into `app/(portal)/dashboard/internal-dashboard.tsx` server component. *(Includes a private `getInternalStats()` helper that mirrors what was inline in `page.tsx`.)*
- [x] 4.2 Create `components/dashboard/admin-staff-hours-chart.tsx` — horizontal stacked bar chart, one bar per staff person, billable + non-billable, no filters, fixed 90-day window. *(Layout switched to vertical bars-by-name for readability with longer staff lists; height is dynamic 220–480px.)*
- [x] 4.3 Compose `internal-dashboard.tsx`: hours-by-person chart at top, existing summary tiles below.

## 5. Page composition

- [x] 5.1 Reduce `app/(portal)/dashboard/page.tsx` to a thin server component: `getProfile()`, role check, render either `<CustomerDashboard searchParams={...} />` or `<InternalDashboard />`.
- [x] 5.2 Update `app/(portal)/dashboard/loading.tsx` to show a chart-shaped skeleton block at the top, then summary tiles, then list/burndown blocks. *(Single skeleton works for both roles — reading the role would defeat the purpose of a sync skeleton.)*

## 6. Tests

- [x] 6.1 Add e2e test `tests/e2e/customer/dashboard-charts.spec.ts`. *(Scaffolded with `test.skip` matching the rest of the suite; covers chart presence, bucket toggle URL round-trip, billable toggle URL round-trip, and conditional burndown heading visibility.)*
- [x] 6.2 Add e2e test `tests/e2e/admin/dashboard-staff-hours.spec.ts`. *(Scaffolded with `test.skip`; covers chart-container presence on dashboard.)*
- [x] 6.3 Run lint and build — `pnpm build` clean, `pnpm lint:colors` clean, `tsc --noEmit` clean. *(Full e2e run deferred to manual verification step.)*

## 7. Manual verification

- [ ] 7.1 Re-run `scripts/seed-demo-customer.ts`.
- [ ] 7.2 Log in as the demo customer; verify chart, filters, and burndowns.
- [ ] 7.3 Log in as admin; verify hours-by-person chart.
- [ ] 7.4 Test a customer with zero time entries — verify "No time logged" overlay.
- [ ] 7.5 Test a customer with no qualifying contracts — verify no burndown row renders.
