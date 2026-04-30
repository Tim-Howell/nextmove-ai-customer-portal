## Context

The detailed form at `components/time-logs/time-entry-form.tsx` collects everything required for a time entry plus a few staff-affordances (internal notes, log-on-behalf-of). It works but is heavy for the "I billed 30 minutes to Acme just now" case.

The user's intent is intentionally narrow: add a sidebar section with two buttons, route Detailed to the existing flow, and route Quick to a leaner modal. No changes to `/time-logs` listing, edit, or delete paths.

## Goals / Non-Goals

**Goals:**
- One-click quick entry from anywhere in the portal via the sidebar.
- Sensible defaults that reduce typing on the second entry of the day (last customer + contract; today's date; billable=true).
- Quick form validates and writes a fully-formed `time_entries` row indistinguishable from one created via the detailed form (no schema bifurcation).
- Persistence of last-used preferences survives logout/login.

**Non-Goals:**
- A user-configurable default category or default billable. Defaults are global (`Billable=true`, `Category=null`) until users ask otherwise.
- Quick entry for `customer_user`. They don't log time.
- Editing or deleting via Quick form. Edits go through the detailed form.
- A keyboard shortcut. Add later if usage warrants.

## Decisions

### Decision 1: Quick Entry is a modal dialog, not a page

Reasons:
- Preserves context — the user doesn't lose their current page (e.g., a customer detail view) when logging.
- Lower implementation cost — no new route, no new layout.
- Consistent with the Detailed Entry flow today, which is itself a form/modal in places.

The Detailed button in the sidebar navigates to `/time-logs/new` (the existing detailed-form route). Only Quick is new.

### Decision 2: Persist last-used customer/contract on `profiles.preferences jsonb`, not a new table

Reasons:
- Single row to update; no JOIN.
- shape: `profiles.preferences = { time_entry: { last_customer_id, last_contract_id } }`.
- Keeps the migration trivial: `ALTER TABLE profiles ADD COLUMN preferences jsonb NOT NULL DEFAULT '{}'::jsonb`.
- Future preferences (e.g., default dashboard period) can extend the same column without schema churn.

Considered a `user_preferences` table; rejected as premature normalization for a single-user-keyed key/value pair.

### Decision 3: Server action shape

```ts
// app/actions/time-entries.ts
export async function createQuickTimeEntry(input: QuickTimeEntryInput): Promise<...>;
// where QuickTimeEntryInput omits internal_note and staff_id (staff_id is set to auth.uid).
```

Internally, the action:
1. Validates with `QuickTimeEntrySchema`.
2. Constructs the full `time_entries` insert payload — `internal_note: null`, `staff_id: <session.user.id>`.
3. Inserts the row.
4. Updates `profiles.preferences.time_entry.last_customer_id` and `last_contract_id`.
5. `revalidatePath('/time-logs')` and any dashboard chart paths.

### Decision 4: Contract picker scopes to customer

When the user selects a customer, the contract dropdown re-queries to show only that customer's non-archived contracts. If the previously remembered `last_contract_id` belongs to a different customer than the currently chosen one, it's ignored and the contract field starts empty.

If the chosen customer has exactly one non-archived hours-tracked contract, it's auto-selected.

### Decision 5: Sidebar UI

The sidebar gets a new section header **"Submit Time"** between the existing primary nav and any future sections, visible only to `admin` and `staff`. Two adjacent buttons sized for tap targets:

```
SUBMIT TIME
[ ⚡ Quick Entry ]
[ ✎ Detailed Entry ]
```

Quick Entry opens the modal dialog; Detailed Entry navigates to `/time-logs/new`.

If `frontend-makeover` ships first, the buttons inherit its tokens automatically. If this ships first, neutral shadcn defaults are fine.

### Decision 6: Validation parity with the detailed form

`QuickTimeEntrySchema` extends the same primitives used by the detailed form for `customer_id`, `contract_id`, `date`, `hours`, `category`, `description`, `is_billable`. It just omits `internal_note` and `staff_id`. The DB row written is identical in shape to one created from the detailed path.

## Risks / Trade-offs

- **Risk: stale `last_contract_id` references an archived contract** → Mitigation: server action verifies the contract is still active and writeable; if not, falls back to no default and surfaces a non-blocking note.
- **Risk: users want a fast Detailed entry too** → Out of scope. The existing flow stays.
- **Trade-off: jsonb preferences** can drift in shape over time → Accepted; code paths that read it should use a Zod parse-or-default to be tolerant.

## Migration Plan

1. Migration adds `profiles.preferences jsonb NOT NULL DEFAULT '{}'::jsonb`.
2. Deploy. Existing users get an empty preferences object; first quick entry seeds their last-used.
3. Rollback: drop the column. No data loss for time entries themselves.

## Open Questions

- Should the modal stay open for "log another" after a successful submit? Default: close on success. Revisit if usage suggests batched entry.
