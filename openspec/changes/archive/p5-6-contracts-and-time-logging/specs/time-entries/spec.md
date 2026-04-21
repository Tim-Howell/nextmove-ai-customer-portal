## ADDED Requirements

### Requirement: Time entry list
The system SHALL display a list of time entries for internal users.

#### Scenario: View all time entries
- **WHEN** internal user navigates to /time-logs
- **THEN** system displays time entries with date, staff, customer, contract, category, hours, and description

#### Scenario: Filter by customer
- **WHEN** internal user selects a customer filter
- **THEN** system displays only time entries for that customer

#### Scenario: Filter by contract
- **WHEN** internal user selects a contract filter
- **THEN** system displays only time entries for that contract

#### Scenario: Filter by date range
- **WHEN** internal user selects start and end date
- **THEN** system displays only time entries within that range

#### Scenario: Filter by staff
- **WHEN** internal user selects a staff member filter
- **THEN** system displays only time entries by that staff member

#### Scenario: Filter by category
- **WHEN** internal user selects a category filter
- **THEN** system displays only time entries with that category

### Requirement: Time entry creation
The system SHALL allow internal users to create time entries.

#### Scenario: Create time entry with required fields
- **WHEN** internal user submits form with date, customer, hours, and category
- **THEN** system creates the time entry with staff_id set to current user

#### Scenario: Create time entry with contract
- **WHEN** internal user selects a contract
- **THEN** system links the time entry to that contract for hour tracking

#### Scenario: Validation errors
- **WHEN** internal user submits form with missing required fields
- **THEN** system displays validation errors

#### Scenario: Hours validation
- **WHEN** internal user enters hours less than 0.25 or greater than 24
- **THEN** system displays validation error

### Requirement: Time entry editing
The system SHALL allow internal users to edit time entries.

#### Scenario: Edit own time entry
- **WHEN** internal user edits their own time entry
- **THEN** system updates the time entry

#### Scenario: Admin edits any time entry
- **WHEN** admin edits any time entry
- **THEN** system updates the time entry

### Requirement: Time entry deletion
The system SHALL allow authorized users to delete time entries.

#### Scenario: Delete own time entry
- **WHEN** internal user deletes their own time entry
- **THEN** system deletes the entry and updates contract hours

#### Scenario: Admin deletes any time entry
- **WHEN** admin deletes any time entry
- **THEN** system deletes the entry

### Requirement: Time entry access control
The system SHALL restrict time entry access based on user role.

#### Scenario: Customer views own time entries
- **WHEN** customer user navigates to /time-logs
- **THEN** system displays only time entries for their customer (read-only)

#### Scenario: Customer cannot create time entries
- **WHEN** customer user attempts to access /time-logs/new
- **THEN** system denies access or redirects

#### Scenario: Customer cannot edit time entries
- **WHEN** customer user attempts to edit a time entry
- **THEN** system denies the action

### Requirement: Contract hours rollup
The system SHALL calculate hours used from time entries.

#### Scenario: Hours used calculation
- **WHEN** viewing a contract
- **THEN** hours_used equals sum of billable time entries for that contract

#### Scenario: Hours remaining calculation
- **WHEN** viewing an hour-based contract
- **THEN** hours_remaining equals total_hours minus hours_used
