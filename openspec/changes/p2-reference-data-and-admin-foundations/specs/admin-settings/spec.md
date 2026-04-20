## ADDED Requirements

### Requirement: System settings storage
The system SHALL store system-wide settings in a key-value table.

#### Scenario: Read setting
- **WHEN** application requests a system setting by key
- **THEN** system returns the stored value or default if not set

#### Scenario: Update setting
- **WHEN** admin updates a system setting
- **THEN** system saves the new value with updated timestamp

### Requirement: Demo data visibility toggle
The system SHALL allow admin users to toggle visibility of demo data.

#### Scenario: Enable demo data
- **WHEN** admin enables "Show demo data" setting
- **THEN** records with is_demo=true are included in all queries

#### Scenario: Disable demo data
- **WHEN** admin disables "Show demo data" setting
- **THEN** records with is_demo=true are excluded from queries

#### Scenario: Default demo data off
- **WHEN** system initializes without demo data setting
- **THEN** demo data is hidden by default

### Requirement: Demo data flag on records
The system SHALL support is_demo boolean flag on customers, contacts, and future data tables.

#### Scenario: Create demo customer
- **WHEN** admin creates a customer with is_demo=true
- **THEN** customer is only visible when demo data is enabled

#### Scenario: Filter demo data in queries
- **WHEN** application queries customers with demo data disabled
- **THEN** results exclude records where is_demo=true

### Requirement: Admin settings page
The system SHALL provide an admin settings page for system configuration.

#### Scenario: View settings
- **WHEN** admin navigates to /settings
- **THEN** system displays current settings with toggle controls

#### Scenario: Settings access control
- **WHEN** non-admin user attempts to access /settings
- **THEN** system redirects to dashboard
