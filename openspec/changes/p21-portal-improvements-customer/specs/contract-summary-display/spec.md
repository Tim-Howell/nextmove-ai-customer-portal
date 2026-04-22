## ADDED Requirements

### Requirement: Contract list displays type-aware usage summary
The Contracts list page SHALL display a usage summary for each contract that is appropriate to the contract type. The system SHALL NOT display generic dashes when meaningful usage data exists.

#### Scenario: Hours Subscription contract in list
- **WHEN** a customer views the Contracts list containing an Hours Subscription contract
- **THEN** the list SHALL display: current period dates, hours used this period, hours remaining this period, and rollover balance

#### Scenario: Hours Bucket contract in list
- **WHEN** a customer views the Contracts list containing an Hours Bucket contract
- **THEN** the list SHALL display: hours used, total hours, hours remaining, and a progress indicator

#### Scenario: On-Demand contract in list
- **WHEN** a customer views the Contracts list containing an On-Demand contract
- **THEN** the list SHALL display: hours logged this month and total hours logged

#### Scenario: Fixed Cost contract in list
- **WHEN** a customer views the Contracts list containing a Fixed Cost or Service Subscription contract
- **THEN** the list SHALL display: active status and billing period (if applicable)

### Requirement: Contract health indicators
The system SHALL compute and display health status indicators for contracts based on usage thresholds.

#### Scenario: Low hours remaining indicator
- **WHEN** an Hours Subscription contract has less than 20% of period allocation remaining
- **THEN** the system SHALL display a "Low Hours" badge in amber color

#### Scenario: Over allocation indicator
- **WHEN** an Hours Subscription contract has used more hours than the period allocation
- **THEN** the system SHALL display an "Over Allocation" badge in red color

#### Scenario: Near exhaustion indicator
- **WHEN** an Hours Bucket contract has less than 15% of total hours remaining
- **THEN** the system SHALL display a "Near Exhaustion" badge in amber color

#### Scenario: Approaching renewal indicator
- **WHEN** a contract has an end date within 30 days
- **THEN** the system SHALL display an "Approaching Renewal" badge in blue color

### Requirement: Contract detail page shows consistent summary
The contract detail page SHALL display the same type-aware summary information shown in the list view, with additional detail as appropriate.

#### Scenario: Subscription detail summary
- **WHEN** a customer views an Hours Subscription contract detail page
- **THEN** the page SHALL display: current period, monthly allocation, used hours, remaining hours, rollover hours, and billing day

#### Scenario: Bucket detail summary
- **WHEN** a customer views an Hours Bucket contract detail page
- **THEN** the page SHALL display: total allocated hours, used hours, remaining hours, and a progress bar
