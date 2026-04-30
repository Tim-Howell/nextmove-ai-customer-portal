## Why

Logging time today requires opening a full form with fields most entries don't need (internal note, log-on-behalf-of). For staff who log many small entries per day, the friction adds up. We want a streamlined "Quick" path that captures the essential fields and remembers the last customer/contract used, while preserving the existing detailed form for cases where it matters.

## What Changes

- Add a **"Submit Time"** section header to the portal sidebar, visible to `admin` and `staff` only.
- Under that section, add **two buttons**: **Quick Entry** and **Detailed Entry**.
- **Detailed Entry** opens the existing time-entry form unchanged (it remains the default mode on `/time-logs`).
- **Quick Entry** opens a new, smaller form with these fields only:
  - Customer (defaults to last customer used by this user)
  - Contract (defaults to last contract used by this user, scoped to the selected customer)
  - Date (defaults to today)
  - Hours
  - Category
  - Description
  - Billable (checkbox, defaults to checked)
- The Quick form **excludes** the `internal_note` field and the "log time for someone else" control. Internal notes default to `null`; the entry's `staff_id` is always the current user.
- Remember the last-used customer and contract per user (server-side preference, persisted across sessions and devices).
- The two sidebar buttons are the **only** entry points changed by this proposal — existing entry points on `/time-logs` and elsewhere are not modified.

## Capabilities

### New Capabilities
- `time-entry-quick-mode`: streamlined quick-entry path for time entries with a reduced field set and per-user last-used defaults.

### Modified Capabilities
- `app-shell`: sidebar gains a "Submit Time" section with Quick / Detailed buttons for `admin` and `staff` roles.

## Impact

- **Code**:
  - New: `components/time-logs/quick-time-entry-dialog.tsx` (client component, modal dialog driven by sidebar button).
  - New: `components/layout/sidebar-submit-time.tsx` (client wrapper that opens the appropriate dialog/route).
  - Modify: sidebar component to add the "Submit Time" section + buttons.
  - Modify: `app/actions/time-entries.ts` to expose a `createQuickTimeEntry` server action that applies fixed defaults and persists last-used customer/contract.
  - Modify: `lib/validations/time-entry.ts` to add a `QuickTimeEntrySchema` (subset of the full schema).
- **Database**:
  - Add a `user_preferences` table (or extend `profiles` with a `preferences jsonb` column — decided in design.md). Stores `last_time_entry_customer_id`, `last_time_entry_contract_id` keyed by `user_id`.
- **Roles**:
  - The sidebar section is gated on `role IN ('admin','staff')`. `customer_user` does not log time and SHALL NOT see the section.
- **Tests**:
  - Add e2e test verifying admin sees the section and customer_user does not.
  - Add e2e test that submitting a quick entry creates a `time_entries` row with the expected defaults.
  - Add e2e test that the second quick-entry session pre-fills customer/contract from the previous submission.
- **Out of scope**: changing the `/time-logs` page, the existing detailed form, or any reporting surface; user-configurable default category or default billable value (separate enhancement).
