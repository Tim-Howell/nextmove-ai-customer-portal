## 1. Diagnose Change Log error

- [x] 1.1 Reproduce the `/audit` page error in dev; capture the error message, stack, and failing query/component
- [x] 1.2 Identify root cause (query bug, RLS, component error, etc.) and document it in a short note in the PR
- [x] 1.3 Apply the minimal fix so `/audit` renders for admins
- [x] 1.4 Verify empty-state path: temporarily clear `audit_logs` and confirm empty-state renders without error

## 2. Remove inline change history from item detail pages

- [x] 2.1 Locate every inline audit/change-history component usage across item detail pages (customer, contract, priority, request, contact)
- [x] 2.2 Remove each usage; delete the component file if no other consumers remain
- [x] 2.3 Remove now-unused imports, props, and any server-side queries that only fed the removed component
- [x] 2.4 Manually verify each item detail page no longer shows change history and pages still render correctly

## 3. Reduce contract statuses to Active / Expired / Archived

- [x] 3.1 Create migration `supabase/migrations/<timestamp>_contract_statuses_to_three.sql`
- [x] 3.2 In the migration: remap `contracts.status_id` from `draft` → `active` and `closed` → `archived`
- [x] 3.3 In the migration: set `is_default = true` on `active` and `false` on other `contract_status` rows
- [x] 3.4 In the migration: delete `reference_values` rows for `contract_status` where value IN ('draft','closed')
- [x] 3.5 Update any code constants or type unions referencing `draft` or `closed` contract status (grep for both)
- [x] 3.6 Update contract status filter UI (status dropdowns) to reflect the new set
- [x] 3.7 Update `scripts/seed-demo-customer.ts` if it still references removed statuses
- [x] 3.8 Apply the migration locally and confirm contracts list, detail, and create/edit flows all work
- [x] 3.9 Remove redundant `/settings/audit-log` page and supporting `AuditLogTable`/`AuditLogFilters` components; drop nav entry in settings layout

## 4. Delete auth user when portal access or active flag disabled

- [x] 4.1 In `app/actions/customers.ts::updateCustomerContact`, fetch the existing contact row (user_id, is_active, portal_access_enabled) before updating
- [x] 4.2 Detect transitions to false on `is_active` or `portal_access_enabled` where a `user_id` exists
- [x] 4.3 After a successful contact update, call `createAdminClient().auth.admin.deleteUser(priorUserId)` and null out `user_id` on the contact row
- [x] 4.4 Handle delete-failure path: log and surface an error so the admin knows the auth user still exists (contact row already updated)
- [x] 4.5 Add a small UI note/tooltip on the disable toggles indicating that login access will be permanently revoked
- [x] 4.6 Manually test: enable portal → confirm auth user exists → disable → confirm auth user is gone → re-enable → confirm new auth user created

## 5. Customer detail summary cards

- [x] 5.1 Create a `CustomerSummaryCards` server component that takes `customerId` and runs three count queries (contracts/priorities/requests) with the definitions from the spec
- [x] 5.2 Build a single `SummaryCard` presentational component using shadcn `Card` — big clickable number, label, "View All" button
- [x] 5.3 Wire each number link to the filtered list view (e.g., `/contracts?customer_id=<id>&status=active`); wire each "View All" to the unfiltered list scoped to the customer
- [x] 5.4 Slot `<CustomerSummaryCards />` into the customer detail page between Points of Contact and Customer Contacts
- [x] 5.5 Verify zero-count rendering (new customer with no data) and non-zero rendering (Demo Customer)
- [x] 5.6 Confirm mobile layout stacks the three cards reasonably and desktop shows them as a 3-up row

## 6. Verification and wrap-up

- [x] 6.1 Re-run `scripts/seed-demo-customer.ts` and verify all three cards, Change Log, item pages without inline history, and contract status filters look correct
- [x] 6.2 Run `pnpm lint` and `pnpm build` — both green
- [x] 6.3 Run E2E test suite (`pnpm test:e2e`) and fix any regressions caused by the removed inline history or status changes
- [x] 6.4 Manually test disable-portal-access flow end-to-end (enable, set password, log in, admin disables, verify login fails)
- [x] 6.5 Open PR with conventional commit messages and a brief summary referencing this OpenSpec change
