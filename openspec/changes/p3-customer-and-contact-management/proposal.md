## Why

The portal needs a foundation for managing customer data before contracts, time logs, and other features can be built. Customers and their contacts are the core entities that all other modules reference.

## What Changes

- Create `customers` table with name, status, primary/secondary NextMove contacts, notes, and timestamps
- Create `customer_contacts` table for customer-specific people with portal access flags
- Build customer list screen with search and filtering
- Build customer detail screen showing contacts and assignments
- Build create/edit forms for customers and contacts
- Implement RLS policies for customer data access
- Add customer management to internal navigation

## Capabilities

### New Capabilities
- `customer-management`: CRUD operations for customer profiles including status, notes, and NextMove AI contact assignments
- `customer-contacts`: CRUD operations for customer contacts with portal access flags and contact details

### Modified Capabilities
- `user-profiles`: Link customer_user profiles to customer_contacts for portal access (updates existing profiles table)

## Impact

- **Database**: New `customers` and `customer_contacts` tables with foreign keys to `profiles`
- **Navigation**: Add "Customers" section to internal user sidebar (already stubbed)
- **Routes**: New `/customers`, `/customers/[id]`, `/customers/new`, `/customers/[id]/edit` routes
- **RLS**: Internal users can read/write all customers; customer_users can only read their linked customer
