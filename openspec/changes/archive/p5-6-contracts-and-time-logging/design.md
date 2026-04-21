## Context

Phases 1-4 established auth, customers, contacts, and customer portal access. Now we need:
- Contract management for tracking customer agreements
- Time logging for tracking work against contracts
- Hour calculations for subscription/bucket contracts

## Goals / Non-Goals

**Goals:**
- Full contract CRUD with status workflow
- Time entry CRUD with contract linking
- Hours used/remaining calculations
- Customer-facing read-only views
- Document storage for contracts

**Non-Goals:**
- Invoice generation (future)
- Automated billing (future)
- Time entry approval workflow (future)
- Recurring contract auto-renewal (future)

## Decisions

### 1. Contracts Schema

```sql
contracts (
  id uuid primary key,
  customer_id uuid references customers(id),
  name text not null,
  contract_type_id uuid references reference_values(id),
  status_id uuid references reference_values(id),
  start_date date,
  end_date date,
  total_hours numeric(10,2),  -- null for non-hour contracts
  description text,
  created_by uuid references profiles(id),
  created_at timestamptz,
  updated_at timestamptz
)
```

**Rationale:** 
- `contract_type_id` and `status_id` link to reference_values for flexibility
- `total_hours` nullable for fixed cost/service subscription contracts
- Hours used computed from time_entries sum

### 2. Time Entries Schema

```sql
time_entries (
  id uuid primary key,
  customer_id uuid references customers(id),
  contract_id uuid references contracts(id),  -- nullable
  staff_id uuid references profiles(id),
  entry_date date not null,
  hours numeric(5,2) not null,
  category_id uuid references reference_values(id),
  description text,
  is_billable boolean default true,
  created_at timestamptz,
  updated_at timestamptz
)
```

**Rationale:**
- `contract_id` nullable to allow time without specific contract
- `is_billable` for future billing features
- `category_id` links to reference_values (Administrative, Research, Technical, Meetings)

### 3. Hours Calculation

Hours used = SUM(time_entries.hours) WHERE contract_id = contract.id AND is_billable = true
Hours remaining = total_hours - hours_used (null if total_hours is null)

Computed in queries, not stored, to avoid sync issues.

### 4. Contract Documents

Use Supabase Storage bucket `portal-documents`:
- Path: `contracts/{contract_id}/{filename}`
- RLS: Internal users can upload/delete, customers can view their contracts' documents

Store document metadata in contracts or separate table:
```sql
contract_documents (
  id uuid primary key,
  contract_id uuid references contracts(id),
  file_name text not null,
  file_path text not null,
  file_size bigint,
  uploaded_by uuid references profiles(id),
  uploaded_at timestamptz default now()
)
```

### 5. Route Structure

**Internal:**
- `/contracts` - Contract list with filters
- `/contracts/new` - Create contract
- `/contracts/[id]` - Contract detail with time entries and documents
- `/contracts/[id]/edit` - Edit contract
- `/time-logs` - Time entry list with filters
- `/time-logs/new` - Create time entry
- `/time-logs/[id]/edit` - Edit time entry

**Customer:**
- `/contracts` - Customer's contracts (read-only)
- `/contracts/[id]` - Contract detail (read-only)
- `/time-logs` - Customer's time entries (read-only)

### 6. RLS Policies

**Contracts:**
- Internal users: full access
- Customer users: read-only for their customer_id

**Time Entries:**
- Internal users: full access
- Customer users: read-only for their customer_id

**Contract Documents:**
- Internal users: full access
- Customer users: read-only for their customer's contracts

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Large time entry lists | Add pagination and date range filters |
| Document storage costs | Set reasonable file size limits |
| Hours calculation performance | Index contract_id on time_entries |
