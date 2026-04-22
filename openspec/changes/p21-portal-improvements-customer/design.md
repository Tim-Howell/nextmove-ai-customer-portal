## Context

Customer testing by Manus AI revealed significant UX gaps in the customer portal. While the underlying data model is sound and contract detail pages contain useful information, the presentation layer doesn't translate system data into customer-friendly summaries. The Contracts list shows generic dashes instead of meaningful usage metrics, staff names are missing from time entries, and customers must navigate to separate Reports pages to understand contract health.

Current state:
- Contracts list shows type and status but not usage summary
- Time entry tables show `—` for staff column
- Requests show `—` for submitted by field
- Reports page works well but is disconnected from contract views
- CSV export lacks header row
- Access denied redirects silently to dashboard

## Goals / Non-Goals

**Goals:**
- Make Contracts list a useful contract review dashboard with type-aware summaries
- Display staff attribution on all customer-visible time entries
- Display submitter names on requests
- Integrate reporting context into contract detail pages
- Improve CSV export usability with headers
- Provide clear feedback when customers attempt restricted routes

**Non-Goals:**
- Redesigning the admin-side contract management
- Adding new contract types or billing models
- Changing the underlying data model (only query/display changes)
- Mobile-specific optimizations (existing responsive design is adequate)

## Decisions

### 1. Contract Summary Component Architecture

**Decision**: Create a `ContractSummaryCard` component that renders differently based on contract type.

**Rationale**: Rather than adding more columns to the table, a summary card approach allows rich, type-specific information display. Each contract type has different metrics that matter:
- Hours Subscription: current period, used/remaining this period, rollover balance
- Hours Bucket: used/total, remaining, progress bar
- On-Demand: hours this month, total hours logged
- Fixed Cost/Service: active status, billing period

**Alternative considered**: Adding multiple conditional columns to existing table. Rejected because it would create many empty cells and poor information density.

### 2. Staff Name Resolution

**Decision**: Add `entered_by_name` to time entry queries by joining to profiles table. Use `COALESCE(p.full_name, p.first_name || ' ' || p.last_name, 'Unknown')` pattern.

**Rationale**: The `entered_by` field already exists on time_entries and references profiles.id. The issue is the customer-facing queries don't include the join. This is a query fix, not a schema change.

### 3. Request Submitter Resolution

**Decision**: Add `submitted_by_name` to request queries. Requests are created by customer_contacts, so join to customer_contacts table and use contact name.

**Rationale**: Requests have a `created_by` or similar field that should reference the contact who submitted. If missing, we may need to add it.

### 4. Contract Activity Module

**Decision**: Create a reusable `ContractActivitySummary` component that can be embedded in contract detail pages. It will:
- Accept a contract ID as prop
- Fetch time entries for that contract with date range filter
- Display totals (total hours, billable hours, entry count)
- Provide "View Full Report" link with pre-applied filters

**Rationale**: Reuses existing report query logic but presents it in contract context. Avoids duplicating the full reports page.

### 5. Health Indicators

**Decision**: Compute health status client-side based on contract data already fetched:
- `low-hours`: remaining < 20% of allocation
- `over-allocation`: used > allocated (for subscription periods)
- `near-exhaustion`: bucket remaining < 15%
- `approaching-renewal`: end_date within 30 days

**Rationale**: No new database queries needed. Health is derived from existing contract and usage data.

### 6. Access Denied Feedback

**Decision**: Use Sonner toast triggered from middleware via URL parameter, similar to existing error handling pattern.

**Rationale**: Middleware already handles redirects. Adding a query param like `?error=access_denied` and handling it in the dashboard page to show a toast is consistent with existing patterns (e.g., `demo_disabled`, `customer_archived`).

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Performance impact from additional joins | Joins are on indexed foreign keys; impact should be minimal. Monitor query times. |
| Contract summary complexity | Start with simple summary, iterate based on feedback. Don't over-engineer health indicators. |
| Missing `created_by` on requests | Audit the requests table schema first. If field doesn't exist, add migration. |
| CSV header breaking existing integrations | Headers are additive; existing consumers should handle gracefully. |
