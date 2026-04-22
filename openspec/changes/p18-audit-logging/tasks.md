# Phase 18: Audit Logging & Error Handling - Tasks

## 1. Audit Log Database Schema

- [x] 1.1 Create `audit_logs` table with all required columns
- [x] 1.2 Add indexes for common query patterns
- [x] 1.3 Create RLS policy: admin read-only access
- [x] 1.4 Create migration file

## 2. Database Triggers

- [x] 2.1 Create audit trigger function for INSERT operations
- [x] 2.2 Create audit trigger function for UPDATE operations
- [x] 2.3 Create audit trigger function for DELETE operations
- [x] 2.4 Add trigger to `customers` table
- [x] 2.5 Add trigger to `customer_contacts` table
- [x] 2.6 Add trigger to `contracts` table
- [x] 2.7 Add trigger to `time_entries` table
- [x] 2.8 Add trigger to `priorities` table
- [x] 2.9 Add trigger to `requests` table
- [x] 2.10 Add trigger to `profiles` table (role/status changes only)
- [x] 2.11 Add trigger to `portal_settings` table
- [x] 2.12 Add trigger to `reference_values` table

## 3. User Context Capture

- [x] 3.1 Create mechanism to pass user context to database session
- [x] 3.2 Set `app.current_user_id` session variable in Supabase client
- [x] 3.3 Update triggers to read user context from session
- [x] 3.4 Capture user email and role in audit record

## 4. Audit Log Actions

- [x] 4.1 Create `getAuditLogs` action with filtering
- [x] 4.2 Support filter by table_name
- [x] 4.3 Support filter by action type
- [x] 4.4 Support filter by user_id
- [x] 4.5 Support filter by date range
- [x] 4.6 Support filter by record_id
- [x] 4.7 Implement pagination
- [x] 4.8 Create `getAuditLogForRecord` action (single record history)

## 5. Audit Log Viewer Page

- [x] 5.1 Create `/settings/audit-log` page (admin only)
- [x] 5.2 Add "Audit Log" to settings navigation
- [x] 5.3 Create filter controls (table, action, user, date range)
- [x] 5.4 Create audit log table with columns
- [x] 5.5 Implement expandable rows for change details
- [x] 5.6 Show before/after values in diff format
- [x] 5.7 Highlight changed fields
- [x] 5.8 Add pagination controls
- [x] 5.9 Add "View Record" link to jump to affected entity

## 6. Record History Component

- [x] 6.1 Create reusable `RecordHistory` component
- [x] 6.2 Show audit history on customer detail page
- [x] 6.3 Show audit history on contract detail page
- [x] 6.4 Show audit history on priority detail page
- [x] 6.5 Show audit history on request detail page
- [x] 6.6 Collapsible history section

## 7. Error Code System

- [x] 7.1 Create `lib/errors/codes.ts` with all error code constants
- [x] 7.2 Create `lib/errors/messages.ts` with user-friendly messages
- [x] 7.3 Create `AppError` class extending Error
- [x] 7.4 Create `createError` utility function
- [x] 7.5 Create `formatErrorResponse` utility function

## 8. Error Handling Utilities

- [x] 8.1 Create `lib/errors/index.ts` barrel export
- [x] 8.2 Create error type guards (isAppError, isValidationError)
- [x] 8.3 Create error logging utility (console + future tracking)
- [x] 8.4 Create `withErrorHandling` wrapper for server actions

## 9. Update Server Actions - Customers

- [x] 9.1 Update `createCustomer` with error codes
- [x] 9.2 Update `updateCustomer` with error codes
- [x] 9.3 Update `deleteCustomer` with error codes
- [x] 9.4 Update `archiveCustomer` with error codes
- [x] 9.5 Update contact actions with error codes

## 10. Update Server Actions - Contracts

- [x] 10.1 Update `createContract` with error codes
- [x] 10.2 Update `updateContract` with error codes
- [x] 10.3 Update `deleteContract` with error codes
- [x] 10.4 Update `archiveContract` with error codes

## 11. Update Server Actions - Time Entries

- [x] 11.1 Update `createTimeEntry` with error codes
- [x] 11.2 Update `updateTimeEntry` with error codes
- [x] 11.3 Update `deleteTimeEntry` with error codes
- [x] 11.4 Add validation for archived customer/contract

## 12. Update Server Actions - Priorities & Requests

- [x] 12.1 Update priority actions with error codes
- [x] 12.2 Update request actions with error codes

## 13. Update Server Actions - Users & Auth

- [x] 13.1 Update user actions with error codes
- [x] 13.2 Update auth-related actions with error codes
- [x] 13.3 Add specific codes for login denial reasons

## 14. UI Error Display

- [x] 14.1 Create `ErrorDisplay` component for consistent error UI
- [x] 14.2 Update forms to use ErrorDisplay
- [x] 14.3 Show error code in dev mode
- [x] 14.4 Create toast notifications for action errors
- [x] 14.5 Create error boundary for unexpected errors

## 15. Testing & Validation (Deferred to Phase 20)

- [ ] 15.1 Test audit log creation on CRUD operations
- [ ] 15.2 Test audit log captures user context
- [ ] 15.3 Test audit log viewer filtering
- [ ] 15.4 Test record history display
- [ ] 15.5 Test error codes returned correctly
- [ ] 15.6 Test error messages user-friendly
- [ ] 15.7 Test error handling in UI
- [ ] 15.8 Verify admin-only access to audit log
- [ ] 15.9 Test pagination of audit logs
- [ ] 15.10 Test before/after value display
