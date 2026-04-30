## MODIFIED Requirements

### Requirement: Reference data seeding
The system SHALL seed default reference values on initial setup. Contract status seed is reduced to three values.

#### Scenario: Seed contract types
- **WHEN** system initializes
- **THEN** contract_type values include: Hours Subscription, Hours Bucket, Fixed Cost, Service Subscription

#### Scenario: Seed contract statuses
- **WHEN** system initializes
- **THEN** contract_status values are exactly: Active (default), Expired, Archived
- **AND** no `Draft` or `Closed` contract_status reference values exist

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

## REMOVED Requirements

### Requirement: Draft and Closed contract statuses
**Reason**: Status set simplified per user direction. `Draft` overlaps with newly-created `Active` contracts in practice, and `Closed` is semantically identical to `Archived`.
**Migration**: A Supabase migration remaps existing contracts: `draft` → `active` and `closed` → `archived`. The `is_default` flag is moved from `draft` to `active` before the two rows are deleted from `reference_values`. No prod data exists at migration time, so the migration primarily prunes reference rows.
