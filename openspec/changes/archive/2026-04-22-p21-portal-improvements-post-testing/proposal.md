## Why

Comprehensive testing by Manus AI revealed UX gaps in both customer and admin portal experiences. While the underlying data model is sound, the presentation layer doesn't always translate system data into user-friendly summaries. Key issues include:

**Customer-side:** The Contracts list shows contract records but doesn't summarize usage meaningfully. Staff names are missing from time entries and reports. Request submitters are blank. Customers must navigate to separate Reports pages to understand contract health.

**Admin-side:** The Customers list shows "No customers found" despite dashboard showing 8 active customers. Staff attribution is blank across time logs, contract history, and reports. Priority create form doesn't submit (select values not bound to payload). Customer Users settings shows empty despite working customer logins. Contracts Over Limit shows suspicious "6.0 / 0.0 hrs" values.

## What Changes

- **Contract list redesign**: Replace generic "Hours" column with contract-type-aware summary showing period usage, remaining hours, rollover (subscription), used/total (bucket), or hours logged (on-demand)
- **Contract health indicators**: Add derived status badges (Low Hours, Over Allocation, Approaching Renewal) to contracts list and detail views
- **Staff attribution fix**: Display staff names on customer-visible time entry tables and reports
- **Request submitter fix**: Display submitter names on requests list and detail pages
- **Contract activity integration**: Add mini-reporting module to contract detail pages with date filters and totals
- **CSV export headers**: Ensure report exports include header row with column names
- **Access denied messaging**: Show explanatory toast when customer users attempt internal routes
- **Empty state improvements**: Better messaging for empty team section on dashboard

### Admin-Side Fixes
- **Customers list fix**: Fix query/filter issue causing empty list despite existing records
- **Priority form fix**: Fix select control binding so customer, status, level IDs submit correctly
- **Customer Users settings fix**: Reconcile query with actual customer portal access state
- **Over-limit reporting fix**: Correct period allocation calculation for contracts with zero/null allocation
- **Staff Users name fallback**: Show email or "Unknown" when name is missing

## Capabilities

### New Capabilities
- `contract-summary-display`: Contract-type-aware summary rendering for list and detail views with usage metrics and health indicators
- `customer-attribution`: Staff and submitter name display on customer-visible tables (time entries, reports, requests)
- `contract-activity-module`: Embedded reporting module on contract detail pages with filters and totals
- `csv-export-headers`: Proper header row generation for CSV exports
- `access-denied-feedback`: User-friendly messaging when customers attempt restricted routes
- `admin-customers-list-fix`: Fix customers list query to surface existing records
- `admin-priority-form-fix`: Fix priority create form select control binding
- `admin-customer-users-fix`: Fix customer users settings query
- `admin-reporting-fix`: Fix over-limit calculation for edge cases

### Modified Capabilities
- None (all changes are new capabilities or bug fixes)

## Impact

- **Components affected**: 
  - `app/(portal)/contracts/page.tsx` - Contract list with new summary display
  - `app/(portal)/contracts/[id]/page.tsx` - Contract detail with activity module
  - `components/contracts/` - New summary and health indicator components
  - `app/(portal)/requests/page.tsx` - Submitter name display
  - `app/(portal)/requests/[id]/page.tsx` - Submitter name display
  - `app/(portal)/reports/page.tsx` - Staff name in table, CSV headers
  - `middleware.ts` - Access denied toast trigger
  - `components/dashboard/customer-dashboard-redesigned.tsx` - Empty state messaging
- **Database queries**: Time entries and requests queries need profile/contact joins for names
- **Admin components affected**:
  - `app/(portal)/customers/page.tsx` - Fix customers list query
  - `app/(portal)/priorities/new/page.tsx` - Fix form select binding
  - `components/priorities/priority-form.tsx` - Fix form select binding
  - `app/(portal)/settings/customer-users/page.tsx` - Fix query
  - `app/(portal)/reports/page.tsx` - Fix over-limit calculation
  - `components/settings/user-table.tsx` - Add name fallback
- **No breaking changes**: All changes are bug fixes or additive improvements
