## MODIFIED Requirements

### Requirement: Internal dashboard recent activity
The internal dashboard SHALL display recent requests and recent time entries.

#### Scenario: View recent requests on dashboard
- **WHEN** internal user views dashboard
- **THEN** system displays 5 most recent requests with title, customer, and status

#### Scenario: View recent time entries on dashboard
- **WHEN** internal user views dashboard
- **THEN** system displays 5 most recent time entries with date, customer, and hours

### Requirement: Internal dashboard quick actions
The internal dashboard SHALL provide quick action buttons.

#### Scenario: Quick actions available
- **WHEN** internal user views dashboard
- **THEN** system displays buttons for: Log Time, New Request, New Priority, View Reports

### Requirement: Customer dashboard recent activity
The customer dashboard SHALL display recent requests and priorities.

#### Scenario: View recent requests on customer dashboard
- **WHEN** customer user views dashboard
- **THEN** system displays 5 most recent requests for their customer with title and status

#### Scenario: View recent priorities on customer dashboard
- **WHEN** customer user views dashboard
- **THEN** system displays 5 most recent priorities for their customer with title, status, and level
