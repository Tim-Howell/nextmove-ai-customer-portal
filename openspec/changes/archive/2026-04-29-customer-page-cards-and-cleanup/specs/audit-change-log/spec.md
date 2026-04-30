## ADDED Requirements

### Requirement: Single audit history surface
The system SHALL surface audit history in exactly one location: the Change Log page at `/reports/changes`. Individual item detail pages (customer, contract, priority, request, contact) SHALL NOT display an inline change history section.

#### Scenario: Change Log is the only audit surface
- **WHEN** an admin views any item detail page (customer, contract, priority, request, or contact)
- **THEN** the page SHALL NOT contain a "Change History", "Audit Log", or equivalent inline section
- **AND** the admin can navigate to `/reports/changes` to view all history

#### Scenario: Item-specific history via Change Log filter
- **WHEN** an admin wants history for a specific record
- **THEN** they navigate to `/reports/changes` and filter by entity (table name)

### Requirement: Change Log page loads successfully for admins and staff
The system SHALL render the Change Log page without error for users with the `admin` or `staff` role.

#### Scenario: Admin opens Change Log
- **WHEN** an admin navigates to `/reports/changes`
- **THEN** the page renders a list of recent audit log entries
- **AND** no error, 500, or blank state is shown when `audit_logs` contains data

#### Scenario: Change Log with empty audit_logs
- **WHEN** an admin navigates to `/reports/changes` and `audit_logs` is empty
- **THEN** the page renders an empty-state message (e.g., "No changes recorded yet")
- **AND** no error is shown

#### Scenario: Customer user access
- **WHEN** a customer_user attempts to access `/reports/changes`
- **THEN** the system redirects to the customer dashboard
