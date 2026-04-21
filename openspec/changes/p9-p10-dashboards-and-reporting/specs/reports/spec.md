## ADDED Requirements

### Requirement: Reports page access
The system SHALL provide a reports page accessible to all authenticated users.

#### Scenario: Internal user accesses reports
- **WHEN** internal user navigates to /reports
- **THEN** system displays reports page with all customers' data

#### Scenario: Customer user accesses reports
- **WHEN** customer user navigates to /reports
- **THEN** system displays reports page filtered to their customer only

### Requirement: Time entries report filtering
The reports page SHALL allow filtering time entries by date range and category.

#### Scenario: Filter by date range
- **WHEN** user selects date from and date to
- **THEN** system displays time entries within that date range

#### Scenario: Filter by category (internal only)
- **WHEN** internal user selects a category filter
- **THEN** system displays only time entries with that category

#### Scenario: Filter by customer (internal only)
- **WHEN** internal user selects a customer filter
- **THEN** system displays only time entries for that customer

### Requirement: Report summary
The reports page SHALL display summary statistics for filtered data.

#### Scenario: View summary cards
- **WHEN** user views reports with filters applied
- **THEN** system displays total hours, billable hours, and entry count

### Requirement: CSV export
The reports page SHALL allow exporting filtered data to CSV.

#### Scenario: Export time entries
- **WHEN** user clicks Export CSV button
- **THEN** system downloads CSV file with filtered time entries data

### Requirement: Navigation to reports
The sidebar SHALL include a link to the reports page.

#### Scenario: Reports link in navigation
- **WHEN** user views sidebar
- **THEN** system displays Reports link that navigates to /reports
