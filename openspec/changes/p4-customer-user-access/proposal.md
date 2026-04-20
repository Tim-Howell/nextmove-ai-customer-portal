## Why

Customer contacts need the ability to access the portal to view their contracts, time logs, priorities, and submit requests. This requires linking customer contacts to auth users, controlling portal access, and ensuring customers only see their own data.

## What Changes

- Link customer contacts to Supabase auth users via `user_id` column
- Build invite flow to send Magic Link to customer contacts with `portal_access_enabled`
- Add enable/disable portal access toggle on contact management
- Implement customer-scoped data access in UI (dashboard shows only their customer's data)
- Validate RLS policies ensure customers cannot access other customers' data
- Create customer-specific dashboard with relevant widgets

## Capabilities

### New Capabilities
- `customer-portal-access`: Linking contacts to auth users and managing portal access
- `customer-invitation`: Sending Magic Link invitations to customer contacts
- `customer-dashboard`: Customer-specific dashboard showing their contracts, time, priorities

### Modified Capabilities
- `customer-contacts`: Add user_id linking and portal access management
- `user-profiles`: Ensure customer_user role is properly scoped

## Impact

- **Database**: Add `user_id` column to `customer_contacts`, update RLS policies
- **Auth**: Handle customer user signup via Magic Link invitation
- **UI**: Customer dashboard, scoped navigation, contact portal access toggle
- **Routes**: Customer users see filtered data on existing routes
