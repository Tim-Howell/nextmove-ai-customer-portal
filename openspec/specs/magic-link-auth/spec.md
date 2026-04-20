# magic-link-auth Specification

## Purpose
TBD - created by archiving change p2-reference-data-and-admin-foundations. Update Purpose after archive.
## Requirements
### Requirement: Magic Link as default login
The system SHALL use Magic Links as the primary login method.

#### Scenario: Request Magic Link
- **WHEN** user enters email and clicks "Send Magic Link"
- **THEN** system sends a login link to the email address

#### Scenario: Magic Link login success
- **WHEN** user clicks valid Magic Link
- **THEN** system logs user in and redirects to dashboard

#### Scenario: Magic Link expired
- **WHEN** user clicks expired Magic Link
- **THEN** system displays "Link expired" message with option to request new link

### Requirement: Email/password fallback
The system SHALL provide email/password login as a fallback option.

#### Scenario: Show password option
- **WHEN** user clicks "Sign in with password" on login page
- **THEN** system displays password input field

#### Scenario: Password login success
- **WHEN** user enters valid email and password
- **THEN** system logs user in and redirects to dashboard

#### Scenario: Return to Magic Link
- **WHEN** user clicks "Use Magic Link instead" from password form
- **THEN** system returns to Magic Link input view

### Requirement: Magic Link email content
The system SHALL send branded Magic Link emails.

#### Scenario: Email branding
- **WHEN** system sends Magic Link email
- **THEN** email includes NextMove AI branding and clear call-to-action

#### Scenario: Email security notice
- **WHEN** system sends Magic Link email
- **THEN** email includes note that link expires and should not be shared

### Requirement: Magic Link for invitations
The system SHALL use Magic Links for new user invitations.

#### Scenario: Invite new user
- **WHEN** admin invites a new user
- **THEN** system sends Magic Link that creates account on first click

#### Scenario: Invited user sets profile
- **WHEN** invited user clicks Magic Link for first time
- **THEN** system prompts for full name before completing login

