# reference-data Specification

## Purpose
TBD - created by archiving change p2-reference-data-and-admin-foundations. Update Purpose after archive.
## Requirements
### Requirement: Reference values table
The system SHALL store all dropdown/select values in a single reference_values table with type categorization.

#### Scenario: Create reference value
- **WHEN** admin creates a new reference value with type, value, and label
- **THEN** system stores the value and it becomes available in dropdowns of that type

#### Scenario: Reference value uniqueness
- **WHEN** admin attempts to create a duplicate value for the same type
- **THEN** system rejects with "Value already exists for this type"

### Requirement: Reference value types
The system SHALL support the following reference value types: contract_type, contract_status, time_category, priority_status, priority_level, request_status.

#### Scenario: Filter by type
- **WHEN** application requests reference values for a specific type
- **THEN** system returns only values matching that type, ordered by sort_order

### Requirement: Reference value management
The system SHALL allow admin users to create, edit, and deactivate reference values.

#### Scenario: Edit reference value
- **WHEN** admin updates a reference value's label or sort_order
- **THEN** system saves changes and existing records using this value remain valid

#### Scenario: Deactivate reference value
- **WHEN** admin deactivates a reference value
- **THEN** value no longer appears in dropdowns but existing records retain the value

#### Scenario: Set default value
- **WHEN** admin marks a reference value as default for its type
- **THEN** that value is pre-selected in new record forms

### Requirement: Reference data seeding
The system SHALL seed default reference values on initial setup.

#### Scenario: Seed contract types
- **WHEN** system initializes
- **THEN** contract_type values include: Hours Subscription, Hours Bucket, Fixed Cost, Service Subscription

#### Scenario: Seed contract statuses
- **WHEN** system initializes
- **THEN** contract_status values include: Draft, Active, Expired, Closed

#### Scenario: Seed time categories
- **WHEN** system initializes
- **THEN** time_category values include: Administrative, Research, Technical, Meetings / Presentations

#### Scenario: Seed priority statuses
- **WHEN** system initializes
- **THEN** priority_status values include: Backlog, Next Up, Active, Complete, On Hold

#### Scenario: Seed priority levels
- **WHEN** system initializes
- **THEN** priority_level values include: High, Medium, Low

#### Scenario: Seed request statuses
- **WHEN** system initializes
- **THEN** request_status values include: New, In Review, In Progress, Closed

### Requirement: Reference data access control
The system SHALL restrict reference data management to admin users.

#### Scenario: Admin manages reference data
- **WHEN** admin user accesses /settings/reference-data
- **THEN** system displays management interface

#### Scenario: Non-admin cannot manage reference data
- **WHEN** staff or customer_user attempts to access /settings/reference-data
- **THEN** system redirects to dashboard

