## Context

Phase 1 and 3 established auth, profiles, and customer management. The portal now needs:
- Reference data for dropdowns used in contracts, time entries, priorities, and requests
- Admin tools for managing users and system settings
- Demo data controls for testing/training
- Improved login UX with Magic Links

Current state:
- Profiles table with roles (admin, staff, customer_user)
- Customers and contacts tables exist
- Basic email/password login implemented

## Goals / Non-Goals

**Goals:**
- Create normalized reference tables for all dropdown values
- Build admin UI for CRUD operations on reference data
- Build user management screens for internal users
- Implement Magic Links as primary login method
- Add demo data flag infrastructure

**Non-Goals:**
- Customer user invitation (Phase 4)
- Actual demo data seeding (Phase 13)
- External SSO providers

## Decisions

### 1. Reference Tables Schema

Single flexible table for all reference types:

```sql
reference_values (
  id uuid primary key,
  type text not null, -- 'contract_type', 'contract_status', 'time_category', etc.
  value text not null,
  label text not null,
  sort_order int default 0,
  is_active boolean default true,
  is_default boolean default false,
  is_demo boolean default false,
  created_at timestamptz,
  updated_at timestamptz,
  unique(type, value)
)
```

**Rationale:** Single table is simpler to manage than separate tables per type. The `type` column distinguishes categories.

Reference types:
- `contract_type`: Hours Subscription, Hours Bucket, Fixed Cost, Service Subscription
- `contract_status`: Draft, Active, Expired, Closed
- `time_category`: Administrative, Research, Technical, Meetings / Presentations
- `priority_status`: Backlog, Next Up, Active, Complete, On Hold
- `priority_level`: High, Medium, Low
- `request_status`: New, In Review, In Progress, Closed

### 2. Demo Data Flag

Add `is_demo` boolean column to:
- `customers`
- `customer_contacts`
- `reference_values`
- Future tables (contracts, time_entries, priorities, requests)

Admin setting stored in a `system_settings` table:
```sql
system_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz
)
```

**Rationale:** Simple key-value store for system-wide settings. `show_demo_data` setting controls visibility.

### 3. User Management

Admin users can:
- View all internal users (admin, staff)
- Invite new internal users via email
- Change user roles (admin ↔ staff)
- Deactivate users (soft delete via `is_active` flag on profiles)

**Rationale:** Keeps user management simple for MVP. No self-service role changes.

### 4. Magic Links

Update login flow:
1. Default: Email input → Send Magic Link → User clicks link → Logged in
2. Fallback: "Sign in with password" link → Shows password field

**Rationale:** Magic Links are more secure and user-friendly. Password fallback for users who prefer it.

### 5. Route Structure

```
/settings                    → Admin settings dashboard
/settings/reference-data     → Manage reference values
/settings/users              → Manage internal users
/settings/users/invite       → Invite new user form
```

**Rationale:** Group admin functions under /settings, accessible only to admin role.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Single reference table could get large | Index on (type, is_active), pagination |
| Magic Link emails delayed | Keep password fallback visible |
| Demo data mixed with real data | Clear UI indicators, filter by default |
