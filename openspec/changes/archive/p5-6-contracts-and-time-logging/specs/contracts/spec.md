## ADDED Requirements

### Requirement: Contract list
The system SHALL display a list of contracts for internal users.

#### Scenario: View all contracts
- **WHEN** internal user navigates to /contracts
- **THEN** system displays contracts with name, customer, type, status, dates, and hours summary

#### Scenario: Filter by customer
- **WHEN** internal user selects a customer filter
- **THEN** system displays only contracts for that customer

#### Scenario: Filter by status
- **WHEN** internal user selects a status filter
- **THEN** system displays only contracts with that status

### Requirement: Contract creation
The system SHALL allow internal users to create contracts.

#### Scenario: Create contract with required fields
- **WHEN** internal user submits contract form with customer, name, type, and status
- **THEN** system creates the contract and redirects to contract detail

#### Scenario: Create hour-based contract
- **WHEN** internal user creates contract with type "Hours Subscription" or "Hours Bucket"
- **THEN** system requires total_hours field

#### Scenario: Validation errors
- **WHEN** internal user submits form with missing required fields
- **THEN** system displays validation errors

### Requirement: Contract editing
The system SHALL allow internal users to edit contracts.

#### Scenario: Edit contract fields
- **WHEN** internal user updates contract fields and saves
- **THEN** system updates the contract and shows success message

#### Scenario: Change contract status
- **WHEN** internal user changes status to "Closed"
- **THEN** system updates status and contract remains viewable

### Requirement: Contract detail
The system SHALL display contract details with hours summary.

#### Scenario: View contract detail
- **WHEN** internal user views contract detail page
- **THEN** system displays all contract fields, hours used, hours remaining, and linked time entries

#### Scenario: Hours calculation
- **WHEN** viewing hour-based contract
- **THEN** system displays total hours, hours used (sum of time entries), and hours remaining

### Requirement: Contract access control
The system SHALL restrict contract access based on user role.

#### Scenario: Customer views own contracts
- **WHEN** customer user navigates to /contracts
- **THEN** system displays only contracts for their customer (read-only)

#### Scenario: Customer cannot edit contracts
- **WHEN** customer user attempts to access /contracts/[id]/edit
- **THEN** system denies access or redirects

### Requirement: Contract deletion
The system SHALL allow admin users to delete contracts.

#### Scenario: Delete contract without time entries
- **WHEN** admin deletes a contract with no time entries
- **THEN** system deletes the contract

#### Scenario: Delete contract with time entries
- **WHEN** admin attempts to delete a contract with time entries
- **THEN** system warns about linked time entries and requires confirmation
