## MODIFIED Requirements

### Requirement: Customer time logs view
The time logs page SHALL display a simplified view for customer users.

#### Scenario: Customer views time logs
- **WHEN** customer_user navigates to /time-logs
- **THEN** system hides customer dropdown filter
- **AND** system hides Staff column from table
- **AND** system displays customer-friendly page description

### Requirement: Customer reports view
The reports page SHALL display a simplified view for customer users.

#### Scenario: Customer views reports
- **WHEN** customer_user navigates to /reports
- **THEN** system hides customer dropdown filter
- **AND** system displays customer-friendly page description

### Requirement: Customer contracts view
The contracts page SHALL display appropriate content for customer users.

#### Scenario: Customer views contracts
- **WHEN** customer_user navigates to /contracts
- **THEN** system displays only their contracts
- **AND** system displays customer-friendly page description

### Requirement: Customer priorities view
The priorities page SHALL display appropriate content for customer users.

#### Scenario: Customer views priorities
- **WHEN** customer_user navigates to /priorities
- **THEN** system hides customer dropdown filter
- **AND** system displays customer-friendly page description

### Requirement: Customer requests view
The requests page SHALL display appropriate content for customer users.

#### Scenario: Customer views requests
- **WHEN** customer_user navigates to /requests
- **THEN** system hides customer dropdown filter
- **AND** system hides internal_notes field
- **AND** system displays customer-friendly page description
