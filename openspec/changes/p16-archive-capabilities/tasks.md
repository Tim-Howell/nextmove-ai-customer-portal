# Phase 16: Archive Capabilities - Tasks

## 1. Database Schema Updates

- [ ] 1.1 Add `is_archived` boolean to `customer_contacts` table (default false)
- [ ] 1.2 Add `archived_at` timestamp to `customers` table
- [ ] 1.3 Add `archived_at` timestamp to `contracts` table
- [ ] 1.4 Add `archived_at` timestamp to `customer_contacts` table
- [ ] 1.5 Add `is_read_only` boolean to `priorities` table (default false)
- [ ] 1.6 Add `is_read_only` boolean to `requests` table (default false)
- [ ] 1.7 Create migration for all schema changes

## 2. Customer Archive Logic

- [ ] 2.1 Update `archiveCustomer` action to set `archived_at` timestamp
- [ ] 2.2 Implement cascade: archive all customer contracts when customer archived
- [ ] 2.3 Implement cascade: disable portal access for all customer contacts
- [ ] 2.4 Implement cascade: mark all open priorities as read-only
- [ ] 2.5 Implement cascade: mark all open requests as read-only
- [ ] 2.6 Update `unarchiveCustomer` to restore customer (but not cascade restore)
- [ ] 2.7 Add confirmation dialog explaining cascade effects

## 3. Contract Archive Logic

- [ ] 3.1 Update `archiveContract` action to set `archived_at` timestamp
- [ ] 3.2 Ensure archived contracts excluded from time entry dropdown
- [ ] 3.3 Ensure archived contracts still appear in reports
- [ ] 3.4 Update `unarchiveContract` to restore contract

## 4. User Access Control

- [ ] 4.1 Update auth middleware to check customer archive status
- [ ] 4.2 Update auth middleware to check contact portal_access_enabled
- [ ] 4.3 Deny login if customer is archived
- [ ] 4.4 Deny login if contact portal_access_enabled is false
- [ ] 4.5 Show appropriate error message on login denial
- [ ] 4.6 Handle edge case: user logged in when customer archived (force logout)

## 5. Dropdown Filtering

- [ ] 5.1 Update time entry form to exclude archived customers
- [ ] 5.2 Update time entry form to exclude archived contracts
- [ ] 5.3 Update priority form to exclude archived customers
- [ ] 5.4 Update request form to exclude archived customers
- [ ] 5.5 Verify reports include archived data (no filtering)

## 6. List View Toggle

- [ ] 6.1 Add "Show Archived" toggle to customers list page
- [ ] 6.2 Add "Show Archived" toggle to contracts list page
- [ ] 6.3 Default toggle to OFF (hide archived)
- [ ] 6.4 Persist toggle state in URL params for shareability
- [ ] 6.5 Style archived items distinctly (grayed out or badge)

## 7. Read-Only Enforcement

- [ ] 7.1 Prevent editing of read-only priorities (UI + API)
- [ ] 7.2 Prevent editing of read-only requests (UI + API)
- [ ] 7.3 Show read-only indicator on affected items
- [ ] 7.4 Prevent adding time entries to archived contracts
- [ ] 7.5 Prevent creating priorities for archived customers
- [ ] 7.6 Prevent creating requests for archived customers

## 8. UI Updates

- [ ] 8.1 Update customer detail page to show archive status
- [ ] 8.2 Update contract detail page to show archive status
- [ ] 8.3 Add "Archived" badge to archived items in lists
- [ ] 8.4 Update archive button to show "Restore" when archived
- [ ] 8.5 Add archive cascade warning dialog for customers

## 9. Testing & Validation

- [ ] 9.1 Test customer archive cascade (contracts, contacts, priorities, requests)
- [ ] 9.2 Test login denial for archived customer users
- [ ] 9.3 Test dropdown filtering excludes archived items
- [ ] 9.4 Test reports include archived data
- [ ] 9.5 Test show/hide archived toggle
- [ ] 9.6 Test unarchive functionality
- [ ] 9.7 Test read-only enforcement on priorities/requests
- [ ] 9.8 Verify existing time entries remain visible after archive
