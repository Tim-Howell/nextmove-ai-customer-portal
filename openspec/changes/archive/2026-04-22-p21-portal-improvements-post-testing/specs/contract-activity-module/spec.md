## ADDED Requirements

### Requirement: Contract detail page includes activity summary
Each contract detail page SHALL include an embedded activity summary module that shows time entry totals and provides access to detailed reporting.

#### Scenario: Activity summary displays totals
- **WHEN** a customer views a contract detail page
- **THEN** the page SHALL display: total hours for the contract, billable hours, non-billable hours, and entry count

#### Scenario: Activity summary with date filter
- **WHEN** a customer adjusts the date range filter on the activity summary
- **THEN** the totals SHALL update to reflect only entries within the selected date range

#### Scenario: Link to full report
- **WHEN** a customer clicks "View Full Report" in the activity summary
- **THEN** the system SHALL navigate to the Reports page with the contract filter pre-applied

### Requirement: Activity summary respects contract scope
The activity summary SHALL only display data relevant to the specific contract being viewed.

#### Scenario: Contract-scoped data
- **WHEN** a customer views the activity summary on a contract detail page
- **THEN** the summary SHALL only include time entries associated with that specific contract
