## 1. Server Actions for Reports

- [x] 1.1 Create `app/actions/reports.ts` with `getTimeEntriesReport` function
- [x] 1.2 Add `getRecentRequests` function to reports.ts
- [x] 1.3 Add `getRecentPriorities` function to reports.ts
- [x] 1.4 Add report summary calculation (total hours, billable hours, count)

## 2. Internal Dashboard Enhancements

- [x] 2.1 Add recent requests section to internal dashboard
- [x] 2.2 Add recent time entries section to internal dashboard
- [x] 2.3 Add quick actions section to internal dashboard

## 3. Customer Dashboard Enhancements

- [x] 3.1 Add recent requests section to customer dashboard
- [x] 3.2 Add recent priorities section to customer dashboard

## 4. Reports Page - UI Components

- [x] 4.1 Create `components/reports/report-filters.tsx` with date range and category filters
- [x] 4.2 Create `components/reports/report-summary.tsx` for summary cards
- [x] 4.3 Create CSV export utility function

## 5. Reports Page - Routes

- [x] 5.1 Create `app/(portal)/reports/page.tsx` for internal users
- [x] 5.2 Implement customer-specific filtering for customer_user role
- [x] 5.3 Add time entries table with pagination or scroll

## 6. Navigation

- [x] 6.1 Add Reports link to sidebar navigation (already present)

## 7. Final Verification

- [x] 7.1 Test internal dashboard with recent activity
- [x] 7.2 Test customer dashboard with recent activity
- [x] 7.3 Test reports page filters and export
- [x] 7.4 Mark Phase 9 and 10 tasks as complete in project.md
- [x] 7.5 Commit all changes

**Note:** Customer UI needs refinement - customer users see internal-focused views (customer dropdowns, etc.). Created follow-up phase for customer UX improvements.
