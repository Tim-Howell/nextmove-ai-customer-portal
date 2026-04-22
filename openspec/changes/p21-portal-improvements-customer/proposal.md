## Why

Customer testing revealed that while the portal stores and exposes operational data correctly, it does not present that data in a customer-native way. The Contracts list shows contract records but doesn't summarize usage meaningfully. Staff names are missing from time entries and reports. Request submitters are blank. Customers must navigate to separate Reports pages to understand contract health when that information should be visible directly on contract views.

## What Changes

- **Contract list redesign**: Replace generic "Hours" column with contract-type-aware summary showing period usage, remaining hours, rollover (subscription), used/total (bucket), or hours logged (on-demand)
- **Contract health indicators**: Add derived status badges (Low Hours, Over Allocation, Approaching Renewal) to contracts list and detail views
- **Staff attribution fix**: Display staff names on customer-visible time entry tables and reports
- **Request submitter fix**: Display submitter names on requests list and detail pages
- **Contract activity integration**: Add mini-reporting module to contract detail pages with date filters and totals
- **CSV export headers**: Ensure report exports include header row with column names
- **Access denied messaging**: Show explanatory toast when customer users attempt internal routes
- **Empty state improvements**: Better messaging for empty team section on dashboard

## Capabilities

### New Capabilities
- `contract-summary-display`: Contract-type-aware summary rendering for list and detail views with usage metrics and health indicators
- `customer-attribution`: Staff and submitter name display on customer-visible tables (time entries, reports, requests)
- `contract-activity-module`: Embedded reporting module on contract detail pages with filters and totals
- `csv-export-headers`: Proper header row generation for CSV exports
- `access-denied-feedback`: User-friendly messaging when customers attempt restricted routes

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
- **No breaking changes**: All changes are additive improvements to customer UX
