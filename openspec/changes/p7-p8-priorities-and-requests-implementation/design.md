## Context

The portal has completed Phases 1-6 covering authentication, customers, contracts, and time logging. Phase 7-8 adds two related but distinct features:
- **Priorities**: Internal tracking of planned/active customer work items
- **Requests**: Customer-submitted items needing review or action

Both features follow established patterns from contracts/time-entries implementation: database tables with RLS, TypeScript types, Zod validation, server actions, and React UI components.

## Goals / Non-Goals

**Goals:**
- Enable internal users to create, manage, and track customer priorities
- Enable customer users to view their priorities (read-only)
- Enable customer users to submit requests to NextMove AI
- Enable internal users to manage and respond to customer requests
- Provide internal notes on requests visible only to internal users
- Update dashboards with priority and request counts

**Non-Goals:**
- Complex workflow automation or approval chains
- Email notifications (deferred to Phase 12)
- File attachments on requests (deferred to Phase 11)
- Priority/request comments or conversation threads
- Customer editing of submitted requests

## Decisions

### 1. Schema Design

**Priorities Table:**
```sql
priorities (
  id uuid primary key,
  customer_id uuid references customers(id),
  title text not null,
  description text,
  status_id uuid references reference_values(id),  -- priority_status
  priority_level_id uuid references reference_values(id),  -- priority_level
  due_date date,
  created_by uuid references profiles(id),
  updated_by uuid references profiles(id),
  created_at timestamptz,
  updated_at timestamptz
)
```

**Requests Table:**
```sql
requests (
  id uuid primary key,
  customer_id uuid references customers(id),
  submitted_by uuid references profiles(id),  -- the user who created it
  title text not null,
  description text,
  status_id uuid references reference_values(id),  -- request_status
  internal_notes text,  -- visible only to internal users
  created_at timestamptz,
  updated_at timestamptz
)
```

**Rationale**: Follows existing patterns from contracts/time_entries. Uses reference_values for statuses to maintain consistency.

### 2. RLS Policies

**Priorities:**
- Internal users (admin, staff): Full CRUD access
- Customer users: SELECT only, scoped to their customer_id

**Requests:**
- Internal users (admin, staff): Full CRUD access
- Customer users: SELECT and INSERT, scoped to their customer_id
- Customer users cannot see `internal_notes` field (handled in server actions, not RLS)

**Rationale**: Customers can submit requests but cannot edit/delete them. Internal notes are filtered at the application layer for flexibility.

### 3. Customer Priority Submission (Optional Feature)

Per project.md, customers may optionally submit new priorities as "suggestions". Implementation:
- Customer-submitted priorities get a special status (e.g., "Suggested" or use existing "Backlog")
- Internal users review and can promote/modify/reject
- For MVP, we'll allow customer INSERT on priorities with status defaulting to "Backlog"

**Rationale**: Simpler than a separate suggestions table. Internal users can filter by created_by to see customer-submitted items.

### 4. Route Structure

**Internal Routes:**
- `/priorities` - List with filters (customer, status, priority level)
- `/priorities/new` - Create form
- `/priorities/[id]` - Detail view
- `/priorities/[id]/edit` - Edit form
- `/requests` - List with filters (customer, status)
- `/requests/[id]` - Detail view with internal notes

**Customer Routes:**
- `/priorities` - Read-only list filtered to their customer
- `/requests` - List of their requests
- `/requests/new` - Submit new request form

**Rationale**: Reuses existing route patterns. Same routes work for both roles with conditional rendering.

### 5. Reference Values

Uses existing seeded values from `20240420000014_seed_reference_values.sql`:
- `priority_status`: backlog, next_up, active, complete, on_hold
- `priority_level`: high, medium, low
- `request_status`: new, in_review, in_progress, closed

## Risks / Trade-offs

**Risk**: Internal notes visible to customers via API
→ **Mitigation**: Server actions explicitly exclude `internal_notes` for customer users. Add integration test.

**Risk**: Customer-submitted priorities cluttering internal workflow
→ **Mitigation**: Filter by `created_by` role or add a "suggested" status. Can enhance post-MVP.

**Risk**: No notification when requests are submitted
→ **Mitigation**: Documented as Phase 12 scope. Dashboard shows counts for visibility.
