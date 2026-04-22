# Phase 16: Archive Capabilities - Tasks

## 1. Database Schema Updates

- [x] 1.1 Add `is_archived` boolean to `customer_contacts` table (default false)
- [x] 1.2 Add `archived_at` timestamp to `customers` table
- [x] 1.3 Add `archived_at` timestamp to `contracts` table
- [x] 1.4 Add `archived_at` timestamp to `customer_contacts` table
- [x] 1.5 Add `is_read_only` boolean to `priorities` table (default false)
- [x] 1.6 Add `is_read_only` boolean to `requests` table (default false)
- [x] 1.7 Create migration for all schema changes

## 2. Customer Archive Logic

- [x] 2.1 Update `archiveCustomer` action to set `archived_at` timestamp
- [x] 2.2 Implement cascade: archive all customer contracts when customer archived
- [x] 2.3 Implement cascade: disable portal access for all customer contacts
- [x] 2.4 Implement cascade: mark all open priorities as read-only
- [x] 2.5 Implement cascade: mark all open requests as read-only
- [x] 2.6 Update `unarchiveCustomer` to restore customer (but not cascade restore)
- [x] 2.7 Add confirmation dialog explaining cascade effects

## 3. Contract Archive Logic

- [x] 3.1 Update `archiveContract` action to set `archived_at` timestamp
- [x] 3.2 Ensure archived contracts excluded from time entry dropdown
- [x] 3.3 Ensure archived contracts still appear in reports
- [x] 3.4 Update `unarchiveContract` to restore contract

## 4. User Access Control

- [x] 4.1 Update auth middleware to check customer archive status
- [x] 4.2 Update auth middleware to check contact portal_access_enabled
- [x] 4.3 Deny login if customer is archived
- [x] 4.4 Deny login if contact portal_access_enabled is false
- [x] 4.5 Show appropriate error message on login denial
- [x] 4.6 Handle edge case: user logged in when customer archived (force logout)

## 5. Dropdown Filtering

- [x] 5.1 Update time entry form to exclude archived customers
- [x] 5.2 Update time entry form to exclude archived contracts
- [x] 5.3 Update priority form to exclude archived customers
- [x] 5.4 Update request form to exclude archived customers
- [x] 5.5 Verify reports include archived data (no filtering)

## 6. List View Toggle

- [x] 6.1 Add "Show Archived" toggle to customers list page
- [x] 6.2 Add "Show Archived" toggle to contracts list page
- [x] 6.3 Default toggle to OFF (hide archived)
- [x] 6.4 Persist toggle state in URL params for shareability
- [x] 6.5 Style archived items distinctly (grayed out or badge)

## 7. Read-Only Enforcement

- [x] 7.1 Prevent editing of read-only priorities (UI + API)
- [x] 7.2 Prevent editing of read-only requests (UI + API)
- [x] 7.3 Show read-only indicator on affected items
- [x] 7.4 Prevent adding time entries to archived contracts
- [x] 7.5 Prevent creating priorities for archived customers
- [x] 7.6 Prevent creating requests for archived customers

## 8. UI Updates

- [x] 8.1 Update customer detail page to show archive status
- [x] 8.2 Update contract detail page to show archive status
- [x] 8.3 Add "Archived" badge to archived items in lists
- [x] 8.4 Update archive button to show "Restore" when archived
- [x] 8.5 Add archive cascade warning dialog for customers

## 9. Testing & Validation

- [ ] 9.1 Test customer archive cascade (contracts, contacts, priorities, requests)
- [ ] 9.2 Test login denial for archived customer users
- [ ] 9.3 Test dropdown filtering excludes archived items
- [ ] 9.4 Test reports include archived data
- [ ] 9.5 Test show/hide archived toggle
- [ ] 9.6 Test unarchive functionality
- [ ] 9.7 Test read-only enforcement on priorities/requests
- [ ] 9.8 Verify existing time entries remain visible after archive
