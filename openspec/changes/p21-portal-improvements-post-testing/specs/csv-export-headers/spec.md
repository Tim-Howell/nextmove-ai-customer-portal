## ADDED Requirements

### Requirement: CSV export includes header row
Report CSV exports SHALL include a header row with column names as the first row of the file.

#### Scenario: Export with headers
- **WHEN** a customer clicks "Export CSV" on the Reports page
- **THEN** the downloaded CSV file SHALL begin with a header row containing column names

#### Scenario: Header column names
- **WHEN** a CSV file is exported
- **THEN** the header row SHALL include: Date, Contract, Category, Hours, Billable, Staff, Description

### Requirement: CSV export matches on-screen data
The CSV export SHALL include the same data visible on screen, respecting any applied filters.

#### Scenario: Filtered export
- **WHEN** a customer exports CSV with filters applied (date range, contract, category)
- **THEN** the exported data SHALL only include entries matching the applied filters

#### Scenario: Staff column in export
- **WHEN** a CSV file is exported
- **THEN** the Staff column SHALL contain the staff member's name for each entry
