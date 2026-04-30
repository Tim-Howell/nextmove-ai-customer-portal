# Tasks: time-entry-quick-mode

## 1. Schema

- [ ] 1.1 Create migration `<timestamp>_profiles_preferences_jsonb.sql` adding `preferences jsonb NOT NULL DEFAULT '{}'::jsonb` to `profiles`.
- [ ] 1.2 Update `types/database.ts` to reflect the new column.
- [ ] 1.3 Add a Zod schema `UserPreferencesSchema` in `lib/validations/user-preferences.ts` with a tolerant parse helper that returns sensible defaults for missing keys:
  ```ts
  { time_entry?: { last_customer_id?: string; last_contract_id?: string } }
  ```

## 2. Validation + server action

- [ ] 2.1 In `lib/validations/time-entry.ts`, add `QuickTimeEntrySchema` covering `customer_id`, `contract_id`, `entry_date` (default today), `hours` (positive number), `category_id` (optional), `description` (string), `is_billable` (default true).
- [ ] 2.2 In `app/actions/time-entries.ts`, add `createQuickTimeEntry(input)`:
  - Resolve `auth.uid()`; reject if role is `customer_user`.
  - Validate input with `QuickTimeEntrySchema`.
  - Insert `time_entries` row with `internal_note = null`, `staff_id = auth.uid()`.
  - Update `profiles.preferences.time_entry = { last_customer_id, last_contract_id }` (jsonb merge).
  - `revalidatePath('/time-logs')` and `revalidatePath('/dashboard')`.
- [ ] 2.3 In `app/actions/profile.ts` (or similar), add `getUserPreferences()` that reads and parses `profiles.preferences` for the current user.

## 3. Quick Entry dialog

- [ ] 3.1 Create `components/time-logs/quick-time-entry-dialog.tsx` (client component):
  - Controlled `<Dialog>` with the field set listed in the spec.
  - On open, fetch preferences and contracts-for-customer as needed; pre-fill if `last_customer_id` and `last_contract_id` are still valid.
  - Customer change clears contract; if new customer has exactly one non-archived contract, auto-select it.
  - On submit, call `createQuickTimeEntry`; close on success and toast.
- [ ] 3.2 Reuse existing `CustomerSelect`, `ContractSelect`, `CategorySelect`, and date-picker primitives from the detailed form; do not duplicate logic.

## 4. Sidebar

- [ ] 4.1 Identify the sidebar component (likely `components/layout/sidebar.tsx` or similar) and add a "Submit Time" section gated on `role IN ('admin','staff')`.
- [ ] 4.2 Add two buttons:
  - "Quick Entry" — opens the dialog (uses a small client wrapper to manage open state).
  - "Detailed Entry" — `<Link>` to `/time-logs/new`.
- [ ] 4.3 Confirm the section is invisible to `customer_user`.

## 5. Tests

- [ ] 5.1 Add e2e test `tests/e2e/admin/time-entry-quick.spec.ts`:
  - Login as admin; assert "Submit Time" section is visible with both buttons.
  - Click Quick Entry; submit a valid entry; assert toast and that the row appears in `/time-logs`.
  - Re-open Quick Entry; assert customer and contract are pre-filled from the previous submission.
- [ ] 5.2 Add e2e test `tests/e2e/customer/time-entry-hidden.spec.ts`:
  - Login as a `customer_user`; assert the Submit Time section is not present.
- [ ] 5.3 Run `pnpm lint`, `pnpm build`, `pnpm test:e2e` — all green.

## 6. Manual verification

- [ ] 6.1 As admin, log a Quick Entry; confirm DB row matches expected (`internal_note IS NULL`, `staff_id = my user`).
- [ ] 6.2 Re-open and confirm the last customer/contract is remembered.
- [ ] 6.3 Archive the last-used contract; reopen Quick Entry; confirm contract field starts empty and customer is still pre-filled.
- [ ] 6.4 Confirm customer_user does not see the section.
