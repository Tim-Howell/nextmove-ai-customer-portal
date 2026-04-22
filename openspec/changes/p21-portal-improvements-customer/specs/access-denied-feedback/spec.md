## ADDED Requirements

### Requirement: Access denied shows explanatory message
When a customer user attempts to access an internal-only route, the system SHALL display a clear explanatory message instead of silently redirecting.

#### Scenario: Customer attempts internal route
- **WHEN** a customer user navigates to an internal route (e.g., /customers, /settings, /time-logs)
- **THEN** the system SHALL redirect to the dashboard AND display a toast message explaining that the page is only available to internal staff

#### Scenario: Toast message content
- **WHEN** an access denied redirect occurs
- **THEN** the toast message SHALL clearly state that the requested page is not available to customer users

### Requirement: Empty team section shows intentional message
The dashboard team section SHALL display an intentional empty state message when no team contacts are assigned.

#### Scenario: No team contacts assigned
- **WHEN** a customer views their dashboard and no NextMove AI contacts are assigned
- **THEN** the system SHALL display a message such as "Your NextMove AI team contacts will appear here once assigned" instead of "No contacts assigned yet"
