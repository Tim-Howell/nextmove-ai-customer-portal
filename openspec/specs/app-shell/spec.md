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
The system SHALL style navigation using NextMove AI brand colors.

#### Scenario: Brand colors applied
- **WHEN** user views the navigation
- **THEN** Primary Navy is used for structure and NextMove Green for active/accent states

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

