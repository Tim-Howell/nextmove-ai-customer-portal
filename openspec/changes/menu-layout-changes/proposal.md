## Why

The current sidebar navigation is a flat list of pages that lacks visual hierarchy and professional grouping. As the portal has grown, the menu needs better organization to help users find related features quickly. Staff/admin and customer users have different needs, and the navigation should reflect role-appropriate groupings with clear visual categories.

## What Changes

- Restructure sidebar navigation with grouped categories (Customer Info, Reports)
- Create landing pages for "Customer Info" and "Reports" categories with icon cards linking to sub-items
- Add "Enter Time" prominent button at top of staff/admin sidebar
- Add "Submit a Request" button for customer users
- Move "System Settings" to bottom of sidebar as a button
- Add user menu in top-right with "My Profile" and "Log Off" options
- Rename pages for customer context ("My Contracts" vs "All Contracts")
- Update customer dashboard to show this month's time stats, active items, and NextMove AI contacts

## Capabilities

### New Capabilities

- `navigation-structure`: Grouped sidebar navigation with categories, landing pages, and role-based menu items
- `user-menu`: Top-right user dropdown with profile and logout options
- `customer-info-landing`: Landing page with icon cards for Contracts, Contacts, Priorities, Requests
- `reports-landing`: Landing page with icon cards for Time Reports and Change Log

### Modified Capabilities

(None - this restructures UI without changing existing page requirements)

## Impact

- **Components**: Sidebar navigation component restructured with groups
- **New Pages**: `/customer-info` and `/reports` landing pages
- **Layout**: Header updated with user menu dropdown
- **Routing**: Some pages may get new paths under category prefixes
- **Dashboard**: Customer dashboard enhanced with time stats and contacts
