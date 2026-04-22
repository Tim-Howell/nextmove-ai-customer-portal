# Phase 16: Archive Capabilities

## Summary
Implement comprehensive archive functionality for customers and contracts that preserves data integrity while keeping the system clean. Archived items remain in reports but are excluded from selection dropdowns. Cascading archive behavior ensures related entities (contacts, contracts, priorities, requests) are properly handled.

## Goals
1. Allow customers and contracts to be archived without deletion
2. Exclude archived items from selection dropdowns (time entry, priorities, requests)
3. Include archived items in reports and historical views
4. Cascade archive effects to related entities appropriately
5. Prevent user login when customer/contact is archived or deleted
6. Provide UI toggle to show/hide archived items in list views

## Key Behaviors

### Customer Archive Cascade
When a customer is archived:
- All customer contacts are marked read-only (portal_access_enabled = false)
- All customer contracts are archived
- All open priorities are marked read-only (status → closed/archived)
- All open requests are marked read-only (status → closed/archived)
- Customer users cannot log in

### Contract Archive
When a contract is archived:
- Contract is excluded from time entry dropdown
- Existing time entries remain visible in reports
- Contract remains visible in contract list with "Archived" badge

### User Access Control
- Customer users whose customer is archived cannot log in
- Customer users whose contact has portal_access_enabled = false cannot log in
- Deleted contacts/customers result in login denial

## Downstream Implications
- Time entry form must filter out archived customers/contracts
- Priority form must filter out archived customers
- Request form must filter out archived customers
- Reports must include archived data (no filtering)
- Dashboard stats should clarify active vs archived
- RLS policies may need updates for archived state checks
