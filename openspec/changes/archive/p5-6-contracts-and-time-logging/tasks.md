## 1. Database Setup - Contracts

- [x] 1.1 Create `contracts` table migration with customer_id, name, type_id, status_id, dates, total_hours, description
- [x] 1.2 Create `contract_documents` table migration for file metadata
- [x] 1.3 Create indexes on contracts (customer_id, status_id)
- [x] 1.4 Create RLS policies for contracts (internal full access, customer read-only for their customer_id)
- [x] 1.5 Run migrations and verify

## 2. Database Setup - Time Entries

- [x] 2.1 Create `time_entries` table migration with customer_id, contract_id, staff_id, date, hours, category_id, description, is_billable
- [x] 2.2 Create indexes on time_entries (customer_id, contract_id, staff_id, entry_date)
- [x] 2.3 Create RLS policies for time_entries (internal full access, customer read-only for their customer_id)
- [x] 2.4 Run migrations and verify

## 3. Storage Setup

- [x] 3.1 Create Supabase storage bucket "portal-documents"
- [x] 3.2 Configure storage RLS policies (internal upload/delete, customer read for their contracts)
- [x] 3.3 Set file size limit (10MB) and allowed file types

## 4. Contract Types and Validation

- [x] 4.1 Create TypeScript types for Contract, ContractDocument
- [x] 4.2 Create Zod schema for contract validation
- [x] 4.3 Add contract type constants and helpers

## 5. Contract Server Actions

- [x] 5.1 Create getContracts action with filters (customer, status)
- [x] 5.2 Create getContract action for single contract with hours calculation
- [x] 5.3 Create createContract action with validation
- [x] 5.4 Create updateContract action
- [x] 5.5 Create deleteContract action (admin only, warn if has time entries)

## 6. Contract UI - List and Detail

- [x] 6.1 Create `/contracts` page with contract list
- [x] 6.2 Add customer and status filter dropdowns
- [x] 6.3 Display hours used/remaining for hour-based contracts
- [x] 6.4 Create `/contracts/[id]` detail page
- [x] 6.5 Display contract info, hours summary, and linked time entries
- [x] 6.6 Add documents section to contract detail

## 7. Contract UI - Forms

- [x] 7.1 Create ContractForm component with all fields
- [x] 7.2 Add contract type dropdown from reference_values
- [x] 7.3 Add contract status dropdown from reference_values
- [x] 7.4 Conditionally require total_hours for hour-based types
- [x] 7.5 Create `/contracts/new` page
- [x] 7.6 Create `/contracts/[id]/edit` page
- [x] 7.7 Add delete contract button for admin

## 8. Contract Documents

- [x] 8.1 Create document upload component
- [x] 8.2 Create document list component with download links
- [x] 8.3 Create uploadDocument server action
- [x] 8.4 Create deleteDocument server action
- [x] 8.5 Create getDocuments server action

## 9. Time Entry Types and Validation

- [x] 9.1 Create TypeScript types for TimeEntry
- [x] 9.2 Create Zod schema for time entry validation
- [x] 9.3 Add time category constants

## 10. Time Entry Server Actions

- [x] 10.1 Create getTimeEntries action with filters (customer, contract, date range, staff, category)
- [x] 10.2 Create getTimeEntry action for single entry
- [x] 10.3 Create createTimeEntry action with validation
- [x] 10.4 Create updateTimeEntry action
- [x] 10.5 Create deleteTimeEntry action
- [x] 10.6 Create getHoursUsed action for contract rollup

## 11. Time Entry UI - List

- [x] 11.1 Create `/time-logs` page with time entry list
- [x] 11.2 Add customer filter dropdown
- [x] 11.3 Add contract filter dropdown (filtered by selected customer)
- [x] 11.4 Add date range filter
- [x] 11.5 Add staff filter dropdown
- [x] 11.6 Add category filter dropdown
- [x] 11.7 Display totals row with hours sum

## 12. Time Entry UI - Forms

- [x] 12.1 Create TimeEntryForm component
- [x] 12.2 Add customer dropdown (auto-populates contract options)
- [x] 12.3 Add contract dropdown (optional)
- [x] 12.4 Add category dropdown from reference_values
- [x] 12.5 Add date picker, hours input, description textarea
- [x] 12.6 Create `/time-logs/new` page
- [x] 12.7 Create `/time-logs/[id]/edit` page

## 13. Customer Views

- [x] 13.1 Update `/contracts` to show customer's contracts only for customer_user
- [x] 13.2 Update `/contracts/[id]` to be read-only for customer_user
- [x] 13.3 Update `/time-logs` to show customer's time entries only for customer_user
- [x] 13.4 Hide create/edit/delete actions for customer_user

## 14. Customer Dashboard Updates

- [x] 14.1 Update active contracts widget with real count
- [x] 14.2 Update hours this month widget with real sum
- [x] 14.3 Add recent time entries list to dashboard

## 15. Final Verification

- [x] 15.1 Test contract CRUD operations
- [x] 15.2 Test document upload/download
- [x] 15.3 Test time entry CRUD operations
- [x] 15.4 Test hours calculation accuracy
- [x] 15.5 Test customer read-only access
- [x] 15.6 Test filters on list pages
- [x] 15.7 Update project.md Phase 5 and 6 tasks as complete
- [x] 15.8 Commit all changes
