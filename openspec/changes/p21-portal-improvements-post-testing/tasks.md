## 1. Customer Attribution (Staff & Submitter Names)

- [ ] 1.1 Audit time_entries table and queries for entered_by field
- [ ] 1.2 Update time entry queries to join profiles table for staff name
- [ ] 1.3 Add staff_name display to contract detail time entry tables
- [ ] 1.4 Add staff_name display to Reports page time entry table
- [ ] 1.5 Audit requests table for submitted_by/created_by field
- [ ] 1.6 Update request queries to join customer_contacts for submitter name
- [ ] 1.7 Add submitter_name display to Requests list page
- [ ] 1.8 Add submitter_name display to Request detail page
- [ ] 1.9 Implement "Unknown" fallback for missing names

## 2. Contract Summary Display

- [ ] 2.1 Create ContractSummaryCard component with type-aware rendering
- [ ] 2.2 Implement Hours Subscription summary (period, used, remaining, rollover)
- [ ] 2.3 Implement Hours Bucket summary (used/total, remaining, progress bar)
- [ ] 2.4 Implement On-Demand summary (hours this month, total logged)
- [ ] 2.5 Implement Fixed Cost/Service summary (active status, billing period)
- [ ] 2.6 Replace generic Hours column in Contracts list with ContractSummaryCard
- [ ] 2.7 Update contract detail pages to use consistent summary display

## 3. Contract Health Indicators

- [ ] 3.1 Create health status computation utility function
- [ ] 3.2 Implement "Low Hours" badge (< 20% remaining for subscription)
- [ ] 3.3 Implement "Over Allocation" badge (used > allocated for subscription)
- [ ] 3.4 Implement "Near Exhaustion" badge (< 15% remaining for bucket)
- [ ] 3.5 Implement "Approaching Renewal" badge (end date within 30 days)
- [ ] 3.6 Add health badges to Contracts list view
- [ ] 3.7 Add health badges to contract detail pages

## 4. Contract Activity Module

- [ ] 4.1 Create ContractActivitySummary component
- [ ] 4.2 Implement date range filter for activity summary
- [ ] 4.3 Display totals (total hours, billable, non-billable, entry count)
- [ ] 4.4 Add "View Full Report" link with pre-applied contract filter
- [ ] 4.5 Integrate ContractActivitySummary into contract detail pages

## 5. CSV Export Headers

- [ ] 5.1 Locate CSV export function in Reports page
- [ ] 5.2 Add header row to CSV output (Date, Contract, Category, Hours, Billable, Staff, Description)
- [ ] 5.3 Ensure Staff column is populated in export data
- [ ] 5.4 Verify export respects applied filters

## 6. Access Denied Feedback

- [ ] 6.1 Add access_denied error type to middleware redirect
- [ ] 6.2 Handle access_denied error in dashboard page to show toast
- [ ] 6.3 Update empty team section message on customer dashboard
- [ ] 6.4 Test customer access to internal routes shows toast

## 7. Admin: Customers List Fix (P1)

- [ ] 7.1 Compare dashboard customer count query with Customers page query
- [ ] 7.2 Check for unintended filters (archived, demo, tenant scope)
- [ ] 7.3 Fix query to return same records as dashboard
- [ ] 7.4 Verify demo customers appear when demo mode enabled
- [ ] 7.5 Test customers list shows expected records

## 8. Admin: Priority Form Fix (P1)

- [ ] 8.1 Audit priority form for select control binding
- [ ] 8.2 Fix customer select to include customer_id in form state
- [ ] 8.3 Fix status select to include status in form state
- [ ] 8.4 Fix priority level select to include priority_level in form state
- [ ] 8.5 Add success/error toast feedback on submission
- [ ] 8.6 Test priority creation works end-to-end

## 9. Admin: Customer Users Settings Fix (P2)

- [ ] 9.1 Audit customer users query vs customer contacts with portal access
- [ ] 9.2 Fix query to join customer_contacts where portal_access_enabled = true
- [ ] 9.3 Display customer organization, name, email, access status
- [ ] 9.4 Test customer users list shows expected records

## 10. Admin: Reporting & Display Fixes (P2)

- [ ] 10.1 Fix over-limit calculation for zero/null allocation
- [ ] 10.2 Handle on-demand contracts appropriately in over-limit section
- [ ] 10.3 Add name fallback in Staff Users table (email or "Unknown User")
- [ ] 10.4 Test over-limit cards show valid values

## 11. Testing & Verification

- [ ] 11.1 Test contract list displays correct summaries for each type
- [ ] 11.2 Test health indicators appear at correct thresholds
- [ ] 11.3 Test staff names appear on time entries and reports
- [ ] 11.4 Test submitter names appear on requests
- [ ] 11.5 Test CSV export includes headers and staff column
- [ ] 11.6 Test access denied toast appears for internal routes
- [ ] 11.7 Test customers list shows records (admin)
- [ ] 11.8 Test priority creation works (admin)
- [ ] 11.9 Test customer users settings shows records (admin)
- [ ] 11.10 Final review of all portal improvements
