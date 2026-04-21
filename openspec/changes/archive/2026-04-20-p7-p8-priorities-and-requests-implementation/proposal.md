## Why

The portal needs to support tracking customer priorities (planned/active work items) and customer-submitted requests. Internal users need to manage priorities and review requests, while customer users need visibility into their priorities and the ability to submit new requests. This completes the core workflow capabilities for the MVP.

## What Changes

- Add `priorities` table with customer link, title, description, status, priority level, due date, and audit fields
- Add `requests` table with customer link, submitter, title, description, status, internal notes, and audit fields
- Create RLS policies for both tables (internal full access, customer read-only for priorities, customer create/read for requests)
- Build internal CRUD UI for priorities with status and priority level filtering
- Build internal request management UI with status filtering
- Build customer-facing priorities view (read-only)
- Build customer request submission form and status view
- Optionally allow customers to submit new priorities as suggestions
- Update customer dashboard with open priorities and requests counts

## Capabilities

### New Capabilities
- `priorities`: Priority management for tracking planned/active customer work with status workflow and priority levels
- `requests`: Customer request submission and internal management with status tracking and internal notes
- `customer-dashboard-priorities-requests`: Dashboard widgets showing open priorities and requests counts

### Modified Capabilities
<!-- No existing spec-level requirement changes -->

## Impact

- **Database**: New `priorities` and `requests` tables with RLS policies
- **Reference Values**: Uses existing `priority_status`, `priority_level`, `request_status` from seed data
- **Routes**: 
  - `/priorities` - internal list/detail/forms
  - `/requests` - internal management view
  - `/requests/new` - customer submission form (customer users)
  - Customer dashboard updates
- **Components**: New priority and request forms, lists, filters, status badges
- **Server Actions**: CRUD operations for priorities and requests
