## Context

Phases 1-3 established auth, profiles, customers, and contacts. Customer contacts exist but cannot log in. We need to:
- Allow contacts to become portal users
- Scope their access to their customer's data only
- Provide a customer-focused dashboard

Current state:
- `customer_contacts` table has `portal_access_enabled` boolean
- `profiles` table has `role` (admin, staff, customer_user) and `customer_id`
- RLS policies exist but need validation for customer scoping

## Goals / Non-Goals

**Goals:**
- Link customer contacts to auth users
- Build invitation flow for customer contacts
- Create customer-scoped dashboard
- Validate all RLS policies for customer data isolation

**Non-Goals:**
- Multiple customers per user (future enhancement)
- Customer self-registration (admin/staff invite only)
- Customer editing their own profile (read-only for now)

## Decisions

### 1. Contact-User Linking

Add `user_id` to `customer_contacts` to link contact to auth user:

```sql
alter table customer_contacts
  add column user_id uuid references auth.users(id);
```

When a contact is invited:
1. Staff enables `portal_access_enabled` on contact
2. Staff clicks "Send Invitation" 
3. System sends Magic Link to contact's email
4. Contact clicks link → creates auth user → profile created with `customer_user` role
5. `customer_contacts.user_id` and `profiles.customer_id` are set

**Rationale:** Direct link from contact to user enables easy lookup. Profile's `customer_id` enables RLS.

### 2. Invitation Flow

```
Staff: Enable portal access → Send Invitation
  ↓
System: Create pending invitation, send Magic Link email
  ↓
Contact: Click Magic Link → Redirected to /auth/callback
  ↓
System: Create auth user, create profile (customer_user, customer_id), link contact.user_id
  ↓
Contact: Redirected to customer dashboard
```

Store pending invitations in `customer_invitations` table:
```sql
customer_invitations (
  id uuid primary key,
  contact_id uuid references customer_contacts(id),
  email text not null,
  invited_by uuid references profiles(id),
  invited_at timestamptz default now(),
  accepted_at timestamptz,
  expires_at timestamptz default now() + interval '7 days'
)
```

**Rationale:** Track invitation state for audit and expiration handling.

### 3. Customer Dashboard

Customer users see `/dashboard` with:
- Welcome message with customer name
- Active contracts summary
- Recent time entries
- Open priorities count
- Quick link to submit request

**Rationale:** Focused view of what matters to customers.

### 4. Data Scoping

Customer users only see data where:
- `customers.id = profiles.customer_id` (their customer)
- Related records (contracts, time, priorities, requests) linked to their customer

RLS policies use `profiles.customer_id` to filter.

### 5. Route Access

| Route | Admin | Staff | Customer |
|-------|-------|-------|----------|
| /dashboard | ✓ | ✓ | ✓ (scoped) |
| /customers | ✓ | ✓ | ✗ |
| /contracts | ✓ | ✓ | ✓ (scoped) |
| /time-logs | ✓ | ✓ | ✓ (scoped) |
| /priorities | ✓ | ✓ | ✓ (scoped) |
| /requests | ✓ | ✓ | ✓ (scoped) |
| /settings | ✓ | ✗ | ✗ |

**Rationale:** Customers access same routes but see filtered data.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Customer sees other customer's data | Thorough RLS testing, UI-level filtering as backup |
| Invitation email not received | Show resend option, log invitation attempts |
| Contact email changes after invitation | Validate email matches on acceptance |
