# app-shell Specification

## Purpose
TBD - created by archiving change p1-auth-and-app-foundations. Update Purpose after archive.
## Requirements
### Requirement: App shell displays navigation sidebar
The system SHALL display a navigation sidebar for authenticated users.

#### Scenario: Sidebar visible on portal pages
- **WHEN** authenticated user views any portal page
- **THEN** a navigation sidebar is displayed on the left side

### Requirement: Internal navigation shows all modules
The system SHALL display full navigation for internal users (admin/staff).

#### Scenario: Internal user navigation
- **WHEN** user with role "admin" or "staff" views the sidebar
- **THEN** navigation includes: Dashboard, Customers, Contracts, Time Logs, Priorities, Requests, Reports, Admin (admin only)

#### Scenario: Admin-only items hidden from staff
- **WHEN** user with role "staff" views the sidebar
- **THEN** Admin section is not visible

### Requirement: Customer navigation shows limited modules
The system SHALL display limited navigation for customer users.

#### Scenario: Customer user navigation
- **WHEN** user with role "customer_user" views the sidebar
- **THEN** navigation includes: Dashboard, Profile, Contracts, Time Logs, Priorities, Requests, Reports

### Requirement: App shell displays header
The system SHALL display a header with user information and actions.

#### Scenario: Header shows user info
- **WHEN** authenticated user views any portal page
- **THEN** header displays user's name or email

#### Scenario: Header has sign out action
- **WHEN** user views the header
- **THEN** a sign out button or menu option is available

### Requirement: Active navigation item highlighted
The system SHALL highlight the current page in the navigation.

#### Scenario: Current page highlighted
- **WHEN** user is on the Dashboard page
- **THEN** Dashboard item in navigation is visually highlighted

### Requirement: Navigation uses brand styling
The system SHALL style the sidebar, top bar, and active-state indicators using the configured brand theme tokens, rendering an Apple-style soft-light aesthetic.

#### Scenario: Brand tokens applied to chrome
- **WHEN** an authenticated user views any portal page
- **THEN** the sidebar background resolves to `--brand-surface` (derived from the configured `background_base`)
- **AND** the active navigation item uses the configured `primary_color` (or `accent_color` where used as a highlight) for its indicator
- **AND** primary text uses `--brand-fg` (the configured `foreground_base`)

#### Scenario: Admin updates accent color
- **WHEN** an admin changes `accent_color` in portal settings and reloads
- **THEN** the focus ring, active state highlights, and CTA buttons reflect the new color without any code deployment

### Requirement: App shell page-load motion
The system SHALL apply a subtle staggered reveal animation to the main content region on initial page load using the `motion` React library.

#### Scenario: First paint of a portal page
- **WHEN** a user navigates to any portal route
- **THEN** the top-level page sections fade and rise into place with a 40ms stagger and approximately 240ms duration
- **AND** the animation respects `prefers-reduced-motion: reduce` by collapsing to instant render

### Requirement: Distinctive typography across the app shell
The system SHALL render page titles in a serif display font and body/UI text in a geometric sans font, both loaded via `next/font`.

#### Scenario: Page heading typography
- **WHEN** a portal page renders an `<h1>`, `<h2>`, or `<h3>` heading
- **THEN** the heading uses the configured display serif family (Fraunces) with a slight negative letter-spacing

#### Scenario: Body text typography
- **WHEN** a portal page renders running text, table cells, form labels, or button labels
- **THEN** the text uses the configured body sans family (Plus Jakarta Sans)

### Requirement: Responsive navigation
The system SHALL provide responsive navigation for different screen sizes.

#### Scenario: Mobile navigation
- **WHEN** user views on mobile screen width
- **THEN** sidebar collapses to a hamburger menu or slide-out drawer

#### Scenario: Desktop navigation
- **WHEN** user views on desktop screen width
- **THEN** sidebar is always visible

### Requirement: Sidebar Submit Time section
The system SHALL display a "Submit Time" section in the sidebar for `admin` and `staff` roles, containing two buttons: Quick Entry and Detailed Entry.

#### Scenario: Section visible to admin and staff
- **WHEN** a user with role `admin` or `staff` views any portal page
- **THEN** the sidebar displays a "Submit Time" section header followed by a "Quick Entry" button and a "Detailed Entry" button

#### Scenario: Section hidden from customer_user
- **WHEN** a user with role `customer_user` views any portal page
- **THEN** the sidebar does not display the Submit Time section, Quick Entry button, or Detailed Entry button

#### Scenario: Quick Entry opens modal
- **WHEN** an admin or staff user clicks the Quick Entry button
- **THEN** the system opens the Quick time-entry modal dialog without navigating away from the current page

#### Scenario: Detailed Entry navigates to existing form
- **WHEN** an admin or staff user clicks the Detailed Entry button
- **THEN** the system navigates to `/time-logs/new` (the existing detailed time-entry form)

