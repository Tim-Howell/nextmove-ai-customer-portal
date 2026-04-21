## Why

Contracts and time logging are core to NextMove AI's service delivery. Customers need visibility into their contracts, hours used, and hours remaining. Internal staff need to log time against contracts and track utilization.

## What Changes

**Contracts:**
- Create contracts table with customer link, type, status, dates, and hour tracking
- Build contract list and detail screens for internal users
- Build create/edit contract forms with reference data dropdowns
- Implement contract status logic (Draft, Active, Expired, Closed)
- Calculate hours used/remaining from time entries
- Expose contracts on customer dashboard
- Integrate Supabase storage for contract documents

**Time Logging:**
- Create time_entries table linked to contracts and customers
- Build internal time entry list with filtering (customer, contract, date, category, staff)
- Build time entry create/edit forms
- Calculate hours used per contract (rollup from time entries)
- Build customer-facing read-only time log view

## Capabilities

### New Capabilities
- `contracts`: Contract CRUD, status management, hour tracking
- `contract-documents`: File upload/download for contract documents
- `time-entries`: Time entry CRUD, filtering, contract rollup
- `time-log-view`: Customer-facing read-only time log display

### Modified Capabilities
- `customer-dashboard`: Add active contracts count and hours summary widgets

## Impact

- **Database**: contracts table, time_entries table, RLS policies for customer scoping
- **Storage**: portal-documents bucket for contract files
- **UI**: Contract list/detail/form pages, time entry list/form pages, customer time log view
- **Dashboard**: Update customer dashboard widgets with real data
