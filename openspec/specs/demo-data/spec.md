## ADDED Requirements

### Requirement: Demo customer data
The system SHALL include seed data for demo customers with realistic variety.

#### Scenario: Seed creates demo customers
- **WHEN** seed.sql is executed
- **THEN** system creates 10 customers with varied names, statuses, and notes

#### Scenario: Demo customers marked as demo
- **WHEN** demo customers are created
- **THEN** each customer has is_demo = true

#### Scenario: Mix of active and archived customers
- **WHEN** demo customers are created
- **THEN** at least 2 customers are archived (archived_at set)

### Requirement: Demo customer contacts
The system SHALL include seed data for customer contacts.

#### Scenario: Seed creates demo contacts
- **WHEN** seed.sql is executed
- **THEN** system creates 2-3 contacts per customer (25 total)

#### Scenario: Contacts have varied portal access
- **WHEN** demo contacts are created
- **THEN** some contacts have portal_access_enabled = true, others false

### Requirement: Demo contracts
The system SHALL include seed data for contracts with various types and statuses.

#### Scenario: Seed creates demo contracts
- **WHEN** seed.sql is executed
- **THEN** system creates 15 contracts across customers

#### Scenario: Contracts use all contract types
- **WHEN** demo contracts are created
- **THEN** contracts include Hours Subscription, Hours Bucket, Fixed Cost, and Service Subscription types

#### Scenario: Contracts have varied statuses
- **WHEN** demo contracts are created
- **THEN** contracts include Active, Expired, and Draft statuses

### Requirement: Demo time entries
The system SHALL include seed data for time entries.

#### Scenario: Seed creates demo time entries
- **WHEN** seed.sql is executed
- **THEN** system creates 100 time entries spread across contracts

#### Scenario: Time entries span date range
- **WHEN** demo time entries are created
- **THEN** entries span the past 6 months

#### Scenario: Time entries use all categories
- **WHEN** demo time entries are created
- **THEN** entries include Administrative, Research, Technical, and Meetings categories

### Requirement: Demo priorities
The system SHALL include seed data for priorities.

#### Scenario: Seed creates demo priorities
- **WHEN** seed.sql is executed
- **THEN** system creates 20 priorities across customers

#### Scenario: Priorities have varied statuses
- **WHEN** demo priorities are created
- **THEN** priorities include Backlog, Next Up, Active, Complete, and On Hold statuses

#### Scenario: Priorities have varied levels
- **WHEN** demo priorities are created
- **THEN** priorities include High, Medium, and Low levels

### Requirement: Demo requests
The system SHALL include seed data for requests.

#### Scenario: Seed creates demo requests
- **WHEN** seed.sql is executed
- **THEN** system creates 30 requests across customers

#### Scenario: Requests have varied statuses
- **WHEN** demo requests are created
- **THEN** requests include New, In Review, In Progress, and Closed statuses

### Requirement: Demo data idempotency
The system SHALL handle re-running seed script gracefully.

#### Scenario: Re-run seed script
- **WHEN** seed.sql is executed multiple times
- **THEN** system does not create duplicate demo data (uses ON CONFLICT or checks)

### Requirement: Demo data cleanup
The system SHALL support removing demo data.

#### Scenario: Delete demo data
- **WHEN** admin toggles "Show Demo Data" off in settings
- **THEN** demo records (is_demo = true) are hidden from views
