## ADDED Requirements

### Requirement: Playwright test infrastructure
The system SHALL have Playwright configured for E2E testing with TypeScript support.

#### Scenario: Playwright configuration exists
- **WHEN** developer runs `pnpm test:e2e`
- **THEN** Playwright executes tests in the `tests/e2e/` directory

#### Scenario: Tests can authenticate as different roles
- **WHEN** a test needs to run as admin, staff, or customer_user
- **THEN** test fixtures provide authenticated browser contexts for each role

### Requirement: Admin authentication tests
The system SHALL have E2E tests for admin authentication flows.

#### Scenario: Admin magic link login
- **WHEN** admin enters email and requests magic link
- **THEN** test verifies magic link email flow works

#### Scenario: Admin password login
- **WHEN** admin enters email and password
- **THEN** test verifies successful login and redirect to dashboard

#### Scenario: Admin logout
- **WHEN** admin clicks sign out
- **THEN** test verifies redirect to login page and session cleared

### Requirement: Admin customer management tests
The system SHALL have E2E tests for customer CRUD operations.

#### Scenario: Create customer
- **WHEN** admin fills customer form and submits
- **THEN** test verifies customer appears in list with correct data

#### Scenario: Edit customer
- **WHEN** admin modifies customer fields and saves
- **THEN** test verifies changes are persisted

#### Scenario: Archive customer
- **WHEN** admin archives a customer
- **THEN** test verifies customer moves to archived state

### Requirement: Admin contract management tests
The system SHALL have E2E tests for contract operations.

#### Scenario: Create hours bucket contract
- **WHEN** admin creates a contract with Hours Bucket type
- **THEN** test verifies contract is created with total hours field

#### Scenario: Create hours subscription contract
- **WHEN** admin creates a contract with Hours Subscription type
- **THEN** test verifies contract is created with hours per period and rollover settings

### Requirement: Customer portal tests
The system SHALL have E2E tests for customer user flows.

#### Scenario: Customer dashboard loads
- **WHEN** customer user logs in
- **THEN** test verifies dashboard displays with customer-specific data

#### Scenario: Customer can create request
- **WHEN** customer user submits a new request
- **THEN** test verifies request appears in their request list

#### Scenario: Customer cannot access admin pages
- **WHEN** customer user attempts to navigate to /customers or /settings
- **THEN** test verifies access is denied or redirected

### Requirement: Data isolation tests
The system SHALL have E2E tests verifying customer data isolation.

#### Scenario: Customer only sees own contracts
- **WHEN** customer user views contracts page
- **THEN** test verifies only contracts for their customer are visible

#### Scenario: Customer cannot access other customer data via URL
- **WHEN** customer user attempts to access another customer's contract by ID
- **THEN** test verifies access is denied
