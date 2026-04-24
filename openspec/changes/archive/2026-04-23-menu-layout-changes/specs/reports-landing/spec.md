## ADDED Requirements

### Requirement: Reports landing page exists
The system SHALL have a Reports landing page at `/reports`.

#### Scenario: Page accessible to all authenticated users
- **WHEN** an authenticated user navigates to `/reports`
- **THEN** the page SHALL load successfully

#### Scenario: Page has title and description
- **WHEN** a user views the Reports page
- **THEN** a page title "Reports" and brief description SHALL be displayed

### Requirement: Staff/Admin Reports shows all report types
The system SHALL display icon cards for all report types for staff/admin users.

#### Scenario: Time Reports card displayed
- **WHEN** a staff or admin user views the Reports page
- **THEN** a card with BarChart3 icon, "Time Reports" title, and description SHALL be displayed

#### Scenario: Change Log card displayed
- **WHEN** a staff or admin user views the Reports page
- **THEN** a card with History icon, "Change Log" title, and description SHALL be displayed

### Requirement: Customer Reports shows their report types
The system SHALL display icon cards for customer-accessible reports for customer users.

#### Scenario: Time Report card displayed for customer
- **WHEN** a customer user views the Reports page
- **THEN** a card with BarChart3 icon, "Time Report" title, and description SHALL be displayed

#### Scenario: Change Log not shown to customers
- **WHEN** a customer user views the Reports page
- **THEN** a Change Log card SHALL NOT be displayed

### Requirement: Report cards link to respective pages
The system SHALL make each card clickable to navigate to the respective report.

#### Scenario: Clicking Time Reports card navigates to time reports
- **WHEN** a user clicks the Time Reports card
- **THEN** they SHALL be navigated to `/reports/time` (or existing time reports path)

#### Scenario: Clicking Change Log card navigates to audit log
- **WHEN** a staff/admin user clicks the Change Log card
- **THEN** they SHALL be navigated to `/reports/changes` (audit log page)
