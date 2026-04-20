## ADDED Requirements

### Requirement: Customer dashboard view
The system SHALL display a customer-specific dashboard for customer_user role.

#### Scenario: Customer sees welcome
- **WHEN** customer user views dashboard
- **THEN** system displays welcome message with their customer name

#### Scenario: Customer sees contracts summary
- **WHEN** customer user views dashboard
- **THEN** system displays count of active contracts

#### Scenario: Customer sees time summary
- **WHEN** customer user views dashboard
- **THEN** system displays recent time entries for their customer

#### Scenario: Customer sees priorities
- **WHEN** customer user views dashboard
- **THEN** system displays count of open priorities

### Requirement: Quick actions
The system SHALL provide quick action links on customer dashboard.

#### Scenario: Submit request link
- **WHEN** customer user views dashboard
- **THEN** "Submit Request" quick action is visible

#### Scenario: View contracts link
- **WHEN** customer user views dashboard
- **THEN** "View Contracts" quick action is visible

### Requirement: Dashboard role detection
The system SHALL display appropriate dashboard based on user role.

#### Scenario: Internal user dashboard
- **WHEN** admin or staff views /dashboard
- **THEN** system displays internal dashboard with all customers overview

#### Scenario: Customer user dashboard
- **WHEN** customer_user views /dashboard
- **THEN** system displays customer-specific dashboard
