## MODIFIED Requirements

### Requirement: Login page default view
The system SHALL display Magic Link input as the default login view, with password login as secondary option.

#### Scenario: Default login view
- **WHEN** user navigates to /login
- **THEN** system displays email input with "Send Magic Link" button and "Sign in with password" link

#### Scenario: Toggle to password view
- **WHEN** user clicks "Sign in with password"
- **THEN** system displays email and password inputs with "Sign in" button
