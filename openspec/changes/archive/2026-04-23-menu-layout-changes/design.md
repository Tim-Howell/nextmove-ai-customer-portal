## Context

The current sidebar navigation is a flat list defined in `components/layouts/sidebar-nav.tsx` with separate arrays for `internalNavItems`, `adminNavItems`, and `customerNavItems`. The navigation lacks visual grouping and doesn't scale well as more features are added. Users need clearer organization to find related functionality.

## Goals / Non-Goals

**Goals:**
- Create visually grouped navigation with clear categories
- Add landing pages for "Customer Info" and "Reports" with icon card grids
- Provide quick-action buttons (Enter Time, Submit Request, Settings)
- Add user menu dropdown in header for profile/logout
- Maintain role-based visibility (staff/admin vs customer)
- Keep navigation simple - no nested dropdowns, all items visible

**Non-Goals:**
- Collapsible/expandable menu sections
- Breadcrumb navigation
- Mobile hamburger menu redesign (keep existing behavior)
- Changing the actual functionality of any existing pages

## Decisions

### 1. Navigation Structure

**Staff/Admin Sidebar:**
```
[Enter Time] (Button - primary color)
─────────────────
Dashboard
Customers
─────────────────
Customer Info →
  All Contracts
  All Contacts
  All Priorities
  All Requests
─────────────────
Reports →
  Time Reports
  Change Log
─────────────────
[Settings] (Button - bottom, ghost style)
```

**Customer Sidebar:**
```
Dashboard
─────────────────
Customer Info →
  My Contracts
  My Priorities
  My Requests
─────────────────
Reports →
  Time Report
─────────────────
[Submit Request] (Button - primary color)
```

### 2. Category Display Style

**Decision**: Categories show as section headers with indented sub-items, all visible at once (no collapse/expand).

**Rationale**: Keeps navigation simple and scannable. Users can see all options without clicking to expand.

### 3. Landing Pages

**Decision**: Create `/customer-info` and `/reports` landing pages with icon card grids.

Each landing page displays:
- Page title and brief description
- Grid of cards (2-3 columns) with:
  - Large Lucide icon
  - Item name
  - Brief description
  - Clickable to navigate to the page

**Icons for Customer Info landing page:**
- Contracts: `FileText`
- Contacts: `Users`
- Priorities: `Flag`
- Requests: `MessageSquare`

**Icons for Reports landing page:**
- Time Reports: `BarChart3`
- Change Log: `History`

### 4. User Menu

**Decision**: Add dropdown menu in header (top-right) next to user name/avatar.

Menu items:
- My Profile → `/profile`
- Log Off → triggers logout action

Use shadcn/ui `DropdownMenu` component.

### 5. Quick Action Buttons

**Decision**: Style prominent actions as buttons rather than nav links.

- "Enter Time" (staff/admin): Primary button at top of sidebar, links to `/time-logs/new`
- "Submit Request" (customer): Primary button at bottom of sidebar, links to `/requests/new`
- "Settings" (admin only): Ghost button at bottom of sidebar, links to `/settings`

### 6. Customer Dashboard Enhancements

**Decision**: Add three sections to customer dashboard:

1. **This Month's Time** - Summary card showing hours logged this billing period
2. **Active Items** - Count cards for active contracts, priorities, requests
3. **NextMove AI Contacts** - Display assigned primary/secondary contacts from their customer record

## Risks / Trade-offs

**[Navigation Complexity]** → More items visible at once
- Mitigation: Clear visual grouping with separators and indentation

**[Landing Page Overhead]** → Extra click to reach some pages
- Mitigation: Sub-items still directly accessible from sidebar; landing pages are optional entry points

**[Mobile Experience]** → More items may not fit well on mobile
- Mitigation: Keep existing mobile drawer behavior; test on mobile devices
