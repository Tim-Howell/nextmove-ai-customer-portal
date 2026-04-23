## ADDED Requirements

### Requirement: Magic link email template
The system SHALL use a professionally designed branded email template for magic link authentication emails.

#### Scenario: Magic link email branding
- **WHEN** a user requests a magic link login
- **THEN** the email SHALL include NextMove AI branding (logo, brand colors #0F172A primary)

#### Scenario: Magic link email content
- **WHEN** a user receives a magic link email
- **THEN** the email SHALL contain:
  - NextMove AI logo centered at top
  - Professional greeting (e.g., "Sign in to NextMove AI")
  - Brief explanation of the magic link
  - Prominent "Sign In" button with brand styling
  - Link expiration notice (e.g., "This link expires in 1 hour")
  - Security notice (e.g., "If you didn't request this, you can safely ignore this email")
  - Footer with company info and support contact

### Requirement: Invitation email template
The system SHALL use a professionally designed branded email template for user invitation emails.

#### Scenario: Invitation email branding
- **WHEN** admin sends an invitation to a contact
- **THEN** the email SHALL include NextMove AI branding (logo, brand colors)

#### Scenario: Invitation email content
- **WHEN** a contact receives an invitation email
- **THEN** the email SHALL contain:
  - NextMove AI logo centered at top
  - Welcoming headline (e.g., "Welcome to NextMove AI")
  - Personal greeting with their name if available
  - Brief description of the customer portal and its benefits
  - Prominent "Access Portal" button with brand styling
  - Information about what they can do in the portal
  - Footer with company info and support contact

### Requirement: Password reset email template
The system SHALL use a professionally designed branded email template for password reset emails.

#### Scenario: Password reset email branding
- **WHEN** a user requests a password reset
- **THEN** the email SHALL include NextMove AI branding (logo, brand colors)

#### Scenario: Password reset email content
- **WHEN** a user receives a password reset email
- **THEN** the email SHALL contain:
  - NextMove AI logo centered at top
  - Clear headline (e.g., "Reset Your Password")
  - Brief explanation of the reset request
  - Prominent "Reset Password" button with brand styling
  - Link expiration notice (e.g., "This link expires in 1 hour")
  - Security notice (e.g., "If you didn't request this, you can safely ignore this email. Your password won't be changed.")
  - Footer with company info and support contact

### Requirement: Email template consistency
All email templates SHALL maintain consistent branding and styling.

#### Scenario: Consistent header across emails
- **WHEN** any authentication email is sent
- **THEN** the email header SHALL include the NextMove AI logo

#### Scenario: Consistent footer across emails
- **WHEN** any authentication email is sent
- **THEN** the email footer SHALL include support contact information and company details

#### Scenario: Consistent color scheme
- **WHEN** any authentication email is sent
- **THEN** the email SHALL use the NextMove AI brand colors
