## ADDED Requirements

### Requirement: Password reset flow redirects correctly
The system SHALL redirect users to the password reset page after clicking the reset link in their email.

#### Scenario: Password reset link redirects to reset page
- **WHEN** user clicks the password reset link in their email
- **THEN** the system SHALL redirect to the reset-password page (not the login page)

#### Scenario: Reset page allows password entry
- **WHEN** user arrives at the reset-password page via email link
- **THEN** the system SHALL display a form to enter a new password

#### Scenario: Password successfully reset
- **WHEN** user enters a valid new password and submits
- **THEN** the system SHALL update the password and redirect to login with success message

#### Scenario: Reset link expired
- **WHEN** user clicks an expired password reset link
- **THEN** the system SHALL display an error message and option to request a new reset link

### Requirement: Custom domain email sending
The system SHALL send authentication emails from the nextmoveaiservices.com domain via Resend.

#### Scenario: Magic link email from custom domain
- **WHEN** user requests a magic link login
- **THEN** the email SHALL be sent from an @nextmoveaiservices.com address

#### Scenario: Password reset email from custom domain
- **WHEN** user requests a password reset
- **THEN** the email SHALL be sent from an @nextmoveaiservices.com address

#### Scenario: Invitation email from custom domain
- **WHEN** admin sends an invitation to a contact
- **THEN** the email SHALL be sent from an @nextmoveaiservices.com address
