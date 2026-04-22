# Phase 18: Audit Logging & Error Handling - Tasks

## 1. Audit Log Database Schema

- [ ] 1.1 Create `audit_logs` table with all required columns
- [ ] 1.2 Add indexes for common query patterns
- [ ] 1.3 Create RLS policy: admin read-only access
- [ ] 1.4 Create migration file

## 2. Database Triggers

- [ ] 2.1 Create audit trigger function for INSERT operations
- [ ] 2.2 Create audit trigger function for UPDATE operations
- [ ] 2.3 Create audit trigger function for DELETE operations
- [ ] 2.4 Add trigger to `customers` table
- [ ] 2.5 Add trigger to `customer_contacts` table
- [ ] 2.6 Add trigger to `contracts` table
- [ ] 2.7 Add trigger to `time_entries` table
- [ ] 2.8 Add trigger to `priorities` table
- [ ] 2.9 Add trigger to `requests` table
- [ ] 2.10 Add trigger to `profiles` table (role/status changes only)
- [ ] 2.11 Add trigger to `portal_settings` table
- [ ] 2.12 Add trigger to `reference_values` table

## 3. User Context Capture

- [ ] 3.1 Create mechanism to pass user context to database session
- [ ] 3.2 Set `app.current_user_id` session variable in Supabase client
- [ ] 3.3 Update triggers to read user context from session
- [ ] 3.4 Capture user email and role in audit record

## 4. Audit Log Actions

- [ ] 4.1 Create `getAuditLogs` action with filtering
- [ ] 4.2 Support filter by table_name
- [ ] 4.3 Support filter by action type
- [ ] 4.4 Support filter by user_id
- [ ] 4.5 Support filter by date range
- [ ] 4.6 Support filter by record_id
- [ ] 4.7 Implement pagination
- [ ] 4.8 Create `getAuditLogForRecord` action (single record history)

## 5. Audit Log Viewer Page

- [ ] 5.1 Create `/settings/audit-log` page (admin only)
- [ ] 5.2 Add "Audit Log" to settings navigation
- [ ] 5.3 Create filter controls (table, action, user, date range)
- [ ] 5.4 Create audit log table with columns
- [ ] 5.5 Implement expandable rows for change details
- [ ] 5.6 Show before/after values in diff format
- [ ] 5.7 Highlight changed fields
- [ ] 5.8 Add pagination controls
- [ ] 5.9 Add "View Record" link to jump to affected entity

## 6. Record History Component

- [ ] 6.1 Create reusable `RecordHistory` component
- [ ] 6.2 Show audit history on customer detail page
- [ ] 6.3 Show audit history on contract detail page
- [ ] 6.4 Show audit history on priority detail page
- [ ] 6.5 Show audit history on request detail page
- [ ] 6.6 Collapsible history section

## 7. Error Code System

- [ ] 7.1 Create `lib/errors/codes.ts` with all error code constants
- [ ] 7.2 Create `lib/errors/messages.ts` with user-friendly messages
- [ ] 7.3 Create `AppError` class extending Error
- [ ] 7.4 Create `createError` utility function
- [ ] 7.5 Create `formatErrorResponse` utility function

## 8. Error Handling Utilities

- [ ] 8.1 Create `lib/errors/index.ts` barrel export
- [ ] 8.2 Create error type guards (isAppError, isValidationError)
- [ ] 8.3 Create error logging utility (console + future tracking)
- [ ] 8.4 Create `withErrorHandling` wrapper for server actions

## 9. Update Server Actions - Customers

- [ ] 9.1 Update `createCustomer` with error codes
- [ ] 9.2 Update `updateCustomer` with error codes
- [ ] 9.3 Update `deleteCustomer` with error codes
- [ ] 9.4 Update `archiveCustomer` with error codes
- [ ] 9.5 Update contact actions with error codes

## 10. Update Server Actions - Contracts

- [ ] 10.1 Update `createContract` with error codes
- [ ] 10.2 Update `updateContract` with error codes
- [ ] 10.3 Update `deleteContract` with error codes
- [ ] 10.4 Update `archiveContract` with error codes

## 11. Update Server Actions - Time Entries

- [ ] 11.1 Update `createTimeEntry` with error codes
- [ ] 11.2 Update `updateTimeEntry` with error codes
- [ ] 11.3 Update `deleteTimeEntry` with error codes
- [ ] 11.4 Add validation for archived customer/contract

## 12. Update Server Actions - Priorities & Requests

- [ ] 12.1 Update priority actions with error codes
- [ ] 12.2 Update request actions with error codes

## 13. Update Server Actions - Users & Auth

- [ ] 13.1 Update user actions with error codes
- [ ] 13.2 Update auth-related actions with error codes
- [ ] 13.3 Add specific codes for login denial reasons

## 14. UI Error Display

- [ ] 14.1 Create `ErrorDisplay` component for consistent error UI
- [ ] 14.2 Update forms to use ErrorDisplay
- [ ] 14.3 Show error code in dev mode
- [ ] 14.4 Create toast notifications for action errors
- [ ] 14.5 Create error boundary for unexpected errors

## 15. Testing & Validation

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
