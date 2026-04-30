## ADDED Requirements

### Requirement: Customer hours-over-time chart
The system SHALL display a stacked bar chart of billable and non-billable hours over time on the customer dashboard, with a daily view defaulting to the last 30 days and a weekly view defaulting to the last 6 months.

#### Scenario: Default view on first load
- **WHEN** a `customer_user` lands on `/dashboard` with no chart-related search params
- **THEN** the system displays a daily-bucketed stacked bar chart covering the trailing 30 days
- **AND** every day in the range is represented on the x-axis, including days with zero hours

#### Scenario: Switch to weekly view
- **WHEN** the user toggles the bucket control to "Weekly"
- **THEN** the URL gains `?bucket=week` and `?days=180`
- **AND** the chart re-renders showing 26 weekly bars covering the trailing 6 months

#### Scenario: Stacked billable + non-billable
- **WHEN** the chart renders for a period containing both billable and non-billable entries
- **THEN** each bar shows two stacked segments: billable (using `--color-accent`) on bottom, non-billable (using `--color-fg-muted`) on top

#### Scenario: Empty period
- **WHEN** the customer has no `time_entries` in the selected range
- **THEN** the chart renders the empty axis with a centered "No time logged in this period" overlay

### Requirement: Customer chart filters
The system SHALL provide three filter controls above the customer hours chart: a daily/weekly toggle, a contract multi-select, and a billable-mode segmented toggle.

#### Scenario: Contract filter narrows the data
- **WHEN** the user selects one or more contracts in the contract multi-select
- **THEN** the URL gains `?contracts=<id>,<id>`
- **AND** the chart re-renders aggregating only `time_entries` whose `contract_id` is in the selection

#### Scenario: Billable-mode filter narrows the data
- **WHEN** the user selects "Billable" in the billable-mode toggle
- **THEN** the URL gains `?billable=yes`
- **AND** the chart shows only billable hours (the non-billable stack is hidden)

#### Scenario: Filters preserved across navigation
- **WHEN** a user copies the URL with filters set and opens it in a new tab while signed in
- **THEN** the dashboard re-renders with identical filter state and chart contents

### Requirement: Per-contract burndown cards
The system SHALL display a burndown card on the customer dashboard for each contract whose contract type has both `tracks_hours = true` and `has_hour_limit = true`.

#### Scenario: Active hours-bucket contract renders a burndown
- **WHEN** a customer has an active Hours Bucket contract with a 100-hour allotment and 35 hours logged in the current period
- **THEN** the dashboard renders a burndown card showing "35 / 100 hours used", "65 hours remaining", a fill bar at 35%, and the current period's start/end dates

#### Scenario: Rollover hours included in allotment
- **WHEN** the contract type has `supports_rollover = true` and the previous period rolled over 10 hours
- **THEN** the card shows the effective allotment (e.g., "35 / 110 hours used") and "75 hours remaining"

#### Scenario: Customer with no qualifying contracts
- **WHEN** a customer has no contracts where both `tracks_hours` and `has_hour_limit` are true
- **THEN** no burndown row is rendered and no empty state is shown

#### Scenario: Over-budget contract
- **WHEN** logged hours exceed the allotment
- **THEN** the fill bar caps at 100% with an over-budget visual treatment and the remaining-hours number displays as a negative value

### Requirement: Admin/staff hours-by-person chart
The system SHALL display a single stacked bar chart on the internal dashboard showing total billable and non-billable hours per staff person over the trailing 90 days, weekly buckets, with no user-adjustable filters.

#### Scenario: Default view for admin
- **WHEN** an `admin` or `staff` user lands on `/dashboard`
- **THEN** the system displays a stacked bar chart with one bar per staff person who logged any time in the last 90 days
- **AND** each bar stacks billable hours on bottom (using `--color-accent`) and non-billable hours on top (using `--color-fg-muted`)
- **AND** bars are sorted descending by total hours

#### Scenario: No staff time logged
- **WHEN** no `time_entries` exist in the trailing 90 days
- **THEN** the chart container renders an empty state "No time logged in the last 90 days"

### Requirement: Dashboard layout — charts on top
The system SHALL render time charts and burndown cards above the existing summary tiles on both dashboards.

#### Scenario: Customer dashboard order
- **WHEN** a `customer_user` views `/dashboard`
- **THEN** the rendered order from top to bottom is: filter bar, hours-over-time chart, burndown card grid (if any), summary tiles (priorities, requests, recent activity)

#### Scenario: Internal dashboard order
- **WHEN** an `admin` or `staff` user views `/dashboard`
- **THEN** the rendered order from top to bottom is: hours-by-person chart, existing summary tiles

### Requirement: Server-side aggregation
The system SHALL compute all chart datasets on the server via aggregation queries on `time_entries` and SHALL NOT load raw rows into the client.

#### Scenario: Customer chart data fetch
- **WHEN** the customer dashboard renders
- **THEN** the server action `getCustomerHoursSeries` returns one row per bucket with pre-summed `billableHours` and `nonBillableHours` values

#### Scenario: Burndown data fetch
- **WHEN** the customer dashboard renders
- **THEN** the server action `getContractBurndowns` returns one row per qualifying contract with `usedHours`, `allotmentHours`, `remainingHours`, `periodStart`, `periodEnd`
