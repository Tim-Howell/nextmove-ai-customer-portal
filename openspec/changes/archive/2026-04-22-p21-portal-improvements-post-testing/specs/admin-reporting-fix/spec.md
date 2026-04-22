## ADDED Requirements

### Requirement: Over-limit calculation handles edge cases
The Contracts Over Limit report SHALL correctly handle contracts with zero or null period allocation.

#### Scenario: Zero allocation display
- **WHEN** a contract has zero period allocation
- **THEN** the over-limit card SHALL NOT display "X / 0.0 hrs" format
- **AND** SHALL either exclude the contract or display an appropriate label like "No allocation set"

#### Scenario: Null allocation handling
- **WHEN** a contract has null/undefined period allocation
- **THEN** the system SHALL handle gracefully without displaying misleading metrics

#### Scenario: On-demand contracts
- **WHEN** an on-demand contract has no period cap
- **THEN** the contract SHALL NOT appear in the over-limit section (or be labeled appropriately)

### Requirement: Over-limit calculation by contract type
The over-limit calculation SHALL respect contract type semantics.

#### Scenario: Hours Subscription over-limit
- **WHEN** an Hours Subscription contract has used more than the monthly allocation
- **THEN** the contract SHALL appear in the over-limit section with correct used/allocated values

#### Scenario: Hours Bucket over-limit
- **WHEN** an Hours Bucket contract has used more than the total allocation
- **THEN** the contract SHALL appear in the over-limit section with correct used/total values

### Requirement: Staff name fallback in user tables
Staff user tables SHALL display a fallback when the name field is empty.

#### Scenario: Missing name fallback
- **WHEN** a staff user record has no name set
- **THEN** the table SHALL display the user's email address or "Unknown User" instead of blank
