## Why

Post-MVP testing surfaced UX and correctness issues: the Change Log page is broken, inline change history on individual item pages duplicates the Change Log and adds clutter, the five contract statuses (draft/active/expired/closed/archived) overlap conceptually and confuse users, disabling a contact's portal access leaves an orphaned auth user that can still attempt login, and the customer detail page has no at-a-glance summary of customer work. This change addresses all five together while the surface area is small and pre-production.

## What Changes

- Fix the Change Log page error so the page loads for admins.
- Remove the inline Change History section from every individual item detail page (customer, contract, priority, request, contact). The Change Log page becomes the single place to view audit history.
- **BREAKING**: Reduce contract statuses from 5 to 3: **Active**, **Expired** (past end date, still active), **Archived** (manually closed). Remove `draft` and `closed`. Existing records in removed statuses are migrated to the nearest equivalent.
- When an admin disables `portal_access_enabled` or `is_active` on a customer contact, delete the associated auth user so login attempts fail cleanly.
- Add three summary cards to the customer detail page — **Contracts**, **Priorities**, **Requests** — showing an open/active count, a label, and a "View All" link, positioned between Points of Contact and Customer Contacts.

## Capabilities

### New Capabilities
- `audit-change-log`: Defines where and how change/audit history is surfaced in the UI. Establishes the principle that the Change Log page is the single source of truth for audit history and item detail pages do not show inline history.

### Modified Capabilities
- `customer-management`: Customer detail page gains three summary cards (Contracts, Priorities, Requests) placed between Points of Contact and Customer Contacts. Each card shows count of open/active items, a label, and a View All link.
- `customer-contacts`: Disabling `portal_access_enabled` or setting `is_active = false` on a contact must delete the associated `auth.users` row (if any) as part of the same operation.
- `reference-data`: Contract status reference values reduced to three: `active`, `expired`, `archived`. `draft` and `closed` are removed. Data migration folds existing `draft` → `active` and existing `closed` → `archived`.

## Impact

- **Code**: `app/actions/customers.ts` (`updateCustomerContact`), `app/(portal)/customers/[id]/page.tsx` (customer detail layout + new cards), `app/(portal)/audit/page.tsx` and supporting components (Change Log fix), all item detail pages that currently render an inline change-history section (remove), contract filter/status components.
- **Database**: Supabase migration to remove `draft` + `closed` from `reference_values` after remapping existing contracts.
- **APIs**: No external API changes. Internal server actions and queries update for status set change.
- **UX**: Customers/contracts with the removed statuses will visibly change status after migration. Admins lose inline change history on item pages but gain it all in one place via Change Log.
- **Risk**: Contract status migration must run idempotently and not orphan any contracts. Auth-user deletion is irreversible — contact re-enablement will create a fresh auth user.
