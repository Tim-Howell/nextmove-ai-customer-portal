## ADDED Requirements

### Requirement: Staff/Admin sidebar has grouped navigation
The system SHALL display a grouped sidebar navigation for admin and staff users.

#### Scenario: Enter Time button at top
- **WHEN** a staff or admin user views the sidebar
- **THEN** an "Enter Time" button SHALL appear at the top of the navigation

#### Scenario: Dashboard and Customers links
- **WHEN** a staff or admin user views the sidebar
- **THEN** Dashboard and Customers links SHALL appear below the Enter Time button

#### Scenario: Customer Info category with sub-items
- **WHEN** a staff or admin user views the sidebar
- **THEN** a "Customer Info" category SHALL appear with sub-items: All Contracts, All Contacts, All Priorities, All Requests

#### Scenario: Reports category with sub-items
- **WHEN** a staff or admin user views the sidebar
- **THEN** a "Reports" category SHALL appear with sub-items: Time Reports, Change Log

#### Scenario: Settings button at bottom for admin
- **WHEN** an admin user views the sidebar
- **THEN** a "Settings" button SHALL appear at the bottom of the navigation

#### Scenario: Settings not visible to staff
- **WHEN** a staff user views the sidebar
- **THEN** the Settings button SHALL NOT be visible

### Requirement: Customer sidebar has grouped navigation
The system SHALL display a grouped sidebar navigation for customer users.

#### Scenario: Dashboard link
- **WHEN** a customer user views the sidebar
- **THEN** a Dashboard link SHALL appear at the top

#### Scenario: Customer Info category with sub-items
- **WHEN** a customer user views the sidebar
- **THEN** a "Customer Info" category SHALL appear with sub-items: My Contracts, My Priorities, My Requests

#### Scenario: Reports category with sub-items
- **WHEN** a customer user views the sidebar
- **THEN** a "Reports" category SHALL appear with sub-items: Time Report

#### Scenario: Submit Request button
- **WHEN** a customer user views the sidebar
- **THEN** a "Submit Request" button SHALL appear at the bottom of the navigation

### Requirement: Navigation items link to correct pages
The system SHALL link navigation items to their respective pages.

#### Scenario: Enter Time links to new time entry
- **WHEN** a user clicks "Enter Time"
- **THEN** they SHALL be navigated to `/time-logs/new`

#### Scenario: Customer Info links to landing page
- **WHEN** a user clicks "Customer Info"
- **THEN** they SHALL be navigated to `/customer-info`

#### Scenario: Reports links to landing page
- **WHEN** a user clicks "Reports"
- **THEN** they SHALL be navigated to `/reports`

#### Scenario: Submit Request links to new request
- **WHEN** a customer user clicks "Submit Request"
- **THEN** they SHALL be navigated to `/requests/new`

#### Scenario: All Contracts links to contracts page
- **WHEN** a staff/admin user clicks "All Contracts"
- **THEN** they SHALL be navigated to `/contracts`

#### Scenario: My Contracts links to contracts page
- **WHEN** a customer user clicks "My Contracts"
- **THEN** they SHALL be navigated to `/contracts`

### Requirement: Sub-items are visually indented
The system SHALL display category sub-items with visual indentation.

#### Scenario: Sub-items indented under category
- **WHEN** a user views a navigation category with sub-items
- **THEN** the sub-items SHALL be visually indented to show hierarchy

#### Scenario: All items visible without expanding
- **WHEN** a user views the sidebar
- **THEN** all navigation items and sub-items SHALL be visible without clicking to expand
