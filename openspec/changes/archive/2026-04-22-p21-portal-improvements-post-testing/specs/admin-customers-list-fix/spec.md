## ADDED Requirements

### Requirement: Customers list displays existing customer records
The Customers list page SHALL display all customer records that exist in the database, matching the count shown on the dashboard.

#### Scenario: Customers list shows records
- **WHEN** an admin user navigates to the Customers page
- **AND** the dashboard shows active customers exist
- **THEN** the Customers list SHALL display those customer records

#### Scenario: Customers list matches dashboard count
- **WHEN** the dashboard shows "8 active customers"
- **THEN** the Customers list SHALL show at least 8 customer records (or filtered subset)

#### Scenario: Demo customers visible when demo mode enabled
- **WHEN** Show Demo Data is enabled in settings
- **THEN** the Customers list SHALL include demo customer records

### Requirement: Customers list query consistency
The Customers list query SHALL use the same data source and filters as the dashboard customer count.

#### Scenario: Query parity with dashboard
- **WHEN** comparing the Customers list query to the dashboard count query
- **THEN** both queries SHALL return consistent results for the same filter state
