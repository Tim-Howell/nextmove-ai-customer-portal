# Proposal: Phase 9-10 Dashboards and Reporting

## Why
The portal needs enhanced dashboards with recent activity views and a dedicated reporting section for both internal users and customers to analyze time usage, contract status, and request history.

## What

### Phase 9 - Dashboards (Enhancement)
Current state: Basic summary cards exist for both internal and customer dashboards.

Enhancements needed:
1. **Internal Dashboard**
   - Add recent activity section (recent time entries, recent requests)
   - Add quick action buttons
   - Ensure all cards link to detail pages (already done)

2. **Customer Dashboard**
   - Already has recent time entries and quick actions
   - Add recent requests section
   - Add recent priorities section

### Phase 10 - Reporting
New reporting screens for data analysis:

1. **Internal Reporting** (`/reports`)
   - Time entries report with filters (customer, date range, category)
   - Contract hours summary
   - Export to CSV

2. **Customer Reporting** (`/reports` for customer_user)
   - Time entries for their customer
   - Contract hours usage
   - Date range filtering
   - Export to CSV

## Out of Scope
- Complex charts/visualizations (can be added later)
- PDF export (CSV only for now)
- Scheduled reports
