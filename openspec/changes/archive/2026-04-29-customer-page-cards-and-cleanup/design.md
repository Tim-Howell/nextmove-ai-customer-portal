## Context

Five loosely related improvements surfaced during pre-go-live testing. They touch different parts of the stack (UI layout, Supabase data migration, server actions, RLS) so collecting them into one coordinated change avoids multiple small migrations and commits. All work lands before real customer data exists, so data-migration risk is minimal.

Current state of affected areas:
- Change Log page (`/audit`) renders an error instead of the expected log of changes.
- Every item detail page (customer, contract, priority, request, contact) renders an inline "Change History" block duplicating the Change Log content.
- `contract_status` reference values include 5 entries: `draft`, `active`, `expired`, `closed`, `archived`. Users find the draft/closed split redundant with archived, and "expired" conflates end-date expiry with manual closure.
- `updateCustomerContact` in `app/actions/customers.ts` updates the `customer_contacts` row but does not delete the associated `auth.users` row when `portal_access_enabled` is flipped off or `is_active` becomes false.
- Customer detail page has no visual summary of open work — admins must click through to each list to see counts.

## Goals / Non-Goals

**Goals:**
- Change Log page loads without error for admins.
- Audit history has exactly one surface in the app: the Change Log page.
- Contract statuses are Active, Expired, Archived — no more, no less.
- Disabling portal access or deactivating a contact cleans up the auth user in the same transaction-like operation.
- Customer detail page shows three scannable summary cards for Contracts, Priorities, Requests between POCs and Customer Contacts.

**Non-Goals:**
- Rework of the audit logging data model or trigger functions. The `audit_logs` table stays as-is.
- Redesigning the Change Log page itself beyond fixing the error and ensuring it remains the sole audit surface.
- Adding counts/aggregations beyond the three cards described (e.g., total hours, dollar amounts — out of scope here).
- Reworking the contract status workflow engine (auto-expiry, etc.). Status changes remain manual except for data migration.

## Decisions

### Decision 1: Remove inline change history by deleting the component usage, not the data
We will remove the `<ChangeHistory />` (or equivalent) block from each item detail page. The underlying `audit_logs` rows remain intact and continue to power the Change Log page. No database changes and no trigger changes.

**Alternative considered**: Hide via feature flag. Rejected — user wants it gone, not toggleable, and there is no production data yet.

### Decision 2: Remap removed contract statuses on migration
Existing contracts in removed statuses are remapped:
- `draft` → `active` (most draft contracts are pre-launch but valid; the current seed marks `draft` as the default but no real records exist).
- `closed` → `archived` (closed and archived are conceptually the same — ended and done).

The migration executes as a single SQL file that:
1. Updates `contracts.status_id` to the `active` or `archived` reference value as appropriate.
2. Deletes the `draft` and `closed` rows from `reference_values` (unique constraint on `type,value` allows safe deletion).
3. Updates any `is_default = true` flag to point to `active` within `contract_status`.

**Alternative considered**: Keep `draft`/`closed` rows but hide from UI. Rejected — leaves confusing ghosts in the database; user explicitly wants 3 statuses.

Pre-go-live means no real contracts need remapping; migration is idempotent and safe to run on empty data.

### Decision 3: Delete auth user from `updateCustomerContact`, not a trigger
When `portal_access_enabled` transitions from `true` → `false`, or `is_active` transitions from `true` → `false`, the server action deletes the auth user via `createAdminClient().auth.admin.deleteUser(userId)` after the contact update succeeds. Order:
1. Capture prior `user_id` and prior flag values from the DB before the update.
2. Update the contact row.
3. If either flag transitioned to false AND `prior user_id` exists, call admin delete and null out `user_id` on the contact.

**Alternative considered**: Database trigger on `customer_contacts`. Rejected — Supabase admin API calls cannot run inside Postgres triggers, and we already delete auth users from TS for the portal-enable flow (consistent pattern).

Re-enabling a contact later requires the existing flow to create a fresh auth user (already implemented in `createCustomerContact`/`updateCustomerContact` for the enable path).

### Decision 4: Summary cards are server-rendered with count queries
Each card is a small server component that runs a scoped count query (`select count(*) where customer_id = ? and archived_at is null and status in (...)`). No new API endpoints. Cards are composed in a simple 3-up grid using the existing shadcn `Card` primitive.

The "number" in the card is itself a link to the filtered list view (e.g., `/contracts?customer_id=<id>&status=active`), matching the request. The "View All" button links to the same list without the status filter.

"Open/active" definitions:
- **Contracts**: `status = 'active'` and `archived_at IS NULL`.
- **Priorities**: `status IN ('backlog', 'next_up', 'active')` and `is_read_only = false`. (Rationale: these are non-terminal states representing open work.)
- **Requests**: `status IN ('new', 'in_review', 'in_progress')` and `is_read_only = false`.

### Decision 5: Change Log error is likely a data/query bug — fix scope
Without reproducing yet, the most likely causes are (a) a query joining a table that doesn't exist or was renamed, (b) a Next.js server-component boundary issue, or (c) a missing RLS grant. Task list includes a diagnostic step first; the fix applied matches the root cause identified.

## Risks / Trade-offs

- **Removing inline change history reduces context on item pages** → Users who relied on inline history must click to the Change Log page and filter. Acceptable per user request; Change Log page already supports filtering by table/record.
- **Auth user deletion is irreversible** → Re-enabling the contact creates a brand new auth user with no history and forces a password reset flow. Documented in a brief admin-facing note in the UI (tooltip on the disable action) so admins know the effect.
- **Status migration collision with `is_default`** → If `draft` was the `is_default` status, deleting it without promoting `active` first would leave no default. Migration sets `is_default = true` on `active` before deleting `draft`.
- **Customer detail page layout shift** → Adding three cards pushes Customer Contacts down. Acceptable and intentional.

## Migration Plan

1. Ship code changes behind normal deploy (no feature flag needed pre-production).
2. Apply single SQL migration `supabase/migrations/<timestamp>_contract_statuses_to_three.sql`:
   - Remap contracts: `UPDATE contracts SET status_id = (select id from reference_values where type='contract_status' and value='active') WHERE status_id IN (select id from reference_values where type='contract_status' and value='draft');`
   - Remap: same for `closed` → `archived`.
   - Promote: `UPDATE reference_values SET is_default = true WHERE type='contract_status' AND value='active';` and set `is_default = false` on other rows of that type.
   - Delete: `DELETE FROM reference_values WHERE type='contract_status' AND value IN ('draft', 'closed');`
3. Verify admin Change Log page loads and item pages no longer show inline history.
4. Rollback strategy: Rollback SQL migration restores the 4 removed rows. Code rollback via git revert. No prod data exists so rollback is safe.
