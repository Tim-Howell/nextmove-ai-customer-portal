## ADDED Requirements

### Requirement: Customer Info landing page exists
The system SHALL have a Customer Info landing page at `/customer-info`.

#### Scenario: Page accessible to all authenticated users
- **WHEN** an authenticated user navigates to `/customer-info`
- **THEN** the page SHALL load successfully

#### Scenario: Page has title and description
- **WHEN** a user views the Customer Info page
- **THEN** a page title "Customer Info" and brief description SHALL be displayed

### Requirement: Staff/Admin Customer Info shows all categories
The system SHALL display icon cards for all customer info categories for staff/admin users.

#### Scenario: All Contracts card displayed
- **WHEN** a staff or admin user views the Customer Info page
- **THEN** a card with FileText icon, "All Contracts" title, and description SHALL be displayed

#### Scenario: All Contacts card displayed
- **WHEN** a staff or admin user views the Customer Info page
- **THEN** a card with Users icon, "All Contacts" title, and description SHALL be displayed

#### Scenario: All Priorities card displayed
- **WHEN** a staff or admin user views the Customer Info page
- **THEN** a card with Flag icon, "All Priorities" title, and description SHALL be displayed

#### Scenario: All Requests card displayed
- **WHEN** a staff or admin user views the Customer Info page
- **THEN** a card with MessageSquare icon, "All Requests" title, and description SHALL be displayed

### Requirement: Customer Customer Info shows their categories
The system SHALL display icon cards for customer-specific categories for customer users.

#### Scenario: My Contracts card displayed
- **WHEN** a customer user views the Customer Info page
- **THEN** a card with FileText icon, "My Contracts" title, and description SHALL be displayed

#### Scenario: My Priorities card displayed
- **WHEN** a customer user views the Customer Info page
- **THEN** a card with Flag icon, "My Priorities" title, and description SHALL be displayed

#### Scenario: My Requests card displayed
- **WHEN** a customer user views the Customer Info page
- **THEN** a card with MessageSquare icon, "My Requests" title, and description SHALL be displayed

#### Scenario: Contacts not shown to customers
- **WHEN** a customer user views the Customer Info page
- **THEN** a Contacts card SHALL NOT be displayed

### Requirement: Cards link to respective pages
The system SHALL make each card clickable to navigate to the respective page.

#### Scenario: Clicking Contracts card navigates to contracts
- **WHEN** a user clicks the Contracts card
- **THEN** they SHALL be navigated to `/contracts`

#### Scenario: Clicking Contacts card navigates to contacts
- **WHEN** a staff/admin user clicks the Contacts card
- **THEN** they SHALL be navigated to `/contacts`

#### Scenario: Clicking Priorities card navigates to priorities
- **WHEN** a user clicks the Priorities card
- **THEN** they SHALL be navigated to `/priorities`

#### Scenario: Clicking Requests card navigates to requests
- **WHEN** a user clicks the Requests card
- **THEN** they SHALL be navigated to `/requests`
