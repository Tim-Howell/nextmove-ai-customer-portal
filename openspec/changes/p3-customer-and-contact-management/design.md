## Context

Phase 1 established authentication, profiles, and the app shell. The portal now needs customer data management as the foundation for contracts, time logs, and other features. Customers and contacts are referenced by nearly every other module.

Current state:
- `profiles` table exists with `role` and `customer_id` (nullable) columns
- Internal navigation already has "Customers" link stubbed
- RLS patterns established in Phase 1

## Goals / Non-Goals

**Goals:**
- Create normalized schema for customers and their contacts
- Build full CRUD UI for internal users to manage customers
- Establish RLS patterns for customer-scoped data access
- Link customer_user profiles to customer_contacts for portal access

**Non-Goals:**
- Customer user invitation flow (Phase 4)
- Contract management (Phase 5)
- Industry, website, renewal date fields (nice-to-have, deferred)

## Decisions

### 1. Schema Design

**Customers table:**
```sql
customers (
  id uuid primary key,
  name text not null,
  status text not null default 'active', -- active, inactive
  primary_contact_id uuid references profiles(id),
  secondary_contact_id uuid references profiles(id),
  notes text,
  created_at timestamptz,
  updated_at timestamptz
)
```

**Customer contacts table:**
```sql
customer_contacts (
  id uuid primary key,
  customer_id uuid references customers(id) on delete cascade,
  full_name text not null,
  title text,
  email text,
  phone text,
  is_active boolean default true,
  portal_access_enabled boolean default false,
  notes text,
  created_at timestamptz,
  updated_at timestamptz
)
```

**Rationale:** Separating contacts from profiles allows multiple contacts per customer without requiring auth accounts. The `portal_access_enabled` flag prepares for Phase 4 invitation flow.

### 2. Profile Linking

Update `profiles.customer_id` to reference `customers(id)` when a customer_user is created. This links the auth user to their customer account.

**Rationale:** Keeps the existing profile structure while enabling customer scoping.

### 3. Route Structure

```
/customers              → List all customers (internal only)
/customers/new          → Create customer form
/customers/[id]         → Customer detail with contacts
/customers/[id]/edit    → Edit customer form
/customers/[id]/contacts/new   → Add contact form
/customers/[id]/contacts/[contactId]/edit → Edit contact form
```

**Rationale:** RESTful nested routes match the data hierarchy.

### 4. RLS Policies

- **Internal users (admin, staff):** Full read/write on customers and contacts
- **Customer users:** Read-only access to their linked customer and its contacts

**Rationale:** Matches the access patterns defined in project.md.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Orphaned contacts if customer deleted | Use `on delete cascade` for customer_contacts |
| Primary/secondary contact references stale profiles | Allow null, validate on assignment |
| Large customer lists slow to load | Add pagination from the start |
