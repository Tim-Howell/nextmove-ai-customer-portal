## Why

Both dashboards are currently text + count tiles. Time data is the most actionable signal in the portal, and there is no visual representation of it. Customers especially need an at-a-glance read of where their hours are going so they can self-serve answers without asking us. Internal users need a simple snapshot of who's logging billable time.

## What Changes

- **Customer dashboard** (focus): add charts at the top of the page, summary tiles (priorities, requests, etc.) move below the charts.
  - Hours over time (billable + non-billable) with **daily** and **weekly** view toggles, defaulting to **last 30 days daily** and switching to **weekly for the last 6 months** on toggle.
  - **Per-contract burndown card** for every contract that has an hour limit (Hours Bucket, Hours Subscription) — current period only, hours used vs. allotment, visual fill bar + remaining-hours numeric.
  - Contract selector (multi-select, defaults to "all"), billable / non-billable toggle, daily / weekly toggle.
- **Admin / staff dashboard** (minimal): a single "hours by staff person" stacked bar chart (billable + non-billable) with a fixed **3-month** trailing window and no filters. Existing summary tiles move below the chart.
- Introduce `recharts` as the chart library and a small `components/charts/` wrapper layer that reads colors from theme CSS variables (`--color-accent`, `--color-primary`, `--color-fg-muted`) so the charts inherit the brand palette set by `frontend-makeover`.
- All chart data comes from server-side aggregation of `time_entries` via new server actions in `app/actions/dashboard-charts.ts`. No client-side hot loops.

## Capabilities

### New Capabilities
- `dashboard-time-charts`: time-usage charts and per-contract burndown cards on the dashboards, with role-appropriate filters and defaults.

### Modified Capabilities
- `customer-dashboard`: dashboard layout reorders to put time charts and contract burndown cards at the top, with summary tiles below.

## Impact

- **Code**:
  - `app/(portal)/dashboard/page.tsx` — major refactor; split into `customer-dashboard.tsx` and `internal-dashboard.tsx` server components called based on role.
  - New: `components/dashboard/customer-time-chart.tsx`, `components/dashboard/customer-burndown-card.tsx`, `components/dashboard/admin-staff-hours-chart.tsx`, `components/charts/recharts-base.tsx`.
  - New server action file: `app/actions/dashboard-charts.ts` with `getCustomerHoursSeries`, `getContractBurndowns`, `getStaffHoursLast90Days`.
  - URL state: filter selections (period, daily/weekly, contract, billable) stored in search params for shareable views and SSR rendering.
- **Database**: no schema changes. Aggregation is via SQL `date_trunc` and `sum(hours)` on `time_entries`, joined to `contracts` and `profiles` as needed. May add 1-2 partial indexes if pages become slow (decide post-implementation).
- **Dependencies**: add `recharts`. Add `date-fns` if not already present (likely is).
- **Tests**: e2e tests for both dashboards — assert chart container renders, filter changes update URL, burndown card shows expected numbers from seed data.
- **Out of scope**: the visual makeover itself (`frontend-makeover`) — chart colors will be tokens but raw chart aesthetics get refined there. Per-customer drill-down, exports, scheduled reports — backlog.
