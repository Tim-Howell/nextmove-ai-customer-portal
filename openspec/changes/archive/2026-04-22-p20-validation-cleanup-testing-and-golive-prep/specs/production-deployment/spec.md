## ADDED Requirements

### Requirement: Production deployment checklist
The system SHALL have a documented checklist for production deployment.

#### Scenario: Checklist covers all deployment steps
- **WHEN** operator follows deployment checklist
- **THEN** all necessary steps are documented including Vercel, Supabase, DNS, and monitoring

### Requirement: Custom SMTP configuration
The system SHALL use custom SMTP for production emails.

#### Scenario: Magic link emails use custom SMTP
- **WHEN** user requests magic link in production
- **THEN** email is sent via configured SMTP provider (not Supabase default)

#### Scenario: Invitation emails use custom SMTP
- **WHEN** admin invites new user
- **THEN** invitation email is sent via configured SMTP provider

### Requirement: Email templates configured
The system SHALL have branded email templates for authentication flows.

#### Scenario: Magic link email has branding
- **WHEN** magic link email is sent
- **THEN** email includes NextMove AI branding and clear call-to-action

#### Scenario: Invitation email has branding
- **WHEN** invitation email is sent
- **THEN** email includes NextMove AI branding and welcome message

#### Scenario: Password reset email has branding
- **WHEN** password reset email is sent
- **THEN** email includes NextMove AI branding and security notice

### Requirement: Environment variables documented
The system SHALL have all required environment variables documented.

#### Scenario: .env.example is complete
- **WHEN** developer sets up new environment
- **THEN** .env.example contains all required variables with descriptions

### Requirement: Vercel production configuration
The system SHALL have Vercel configured for production deployment.

#### Scenario: Production environment variables set
- **WHEN** Vercel deployment runs
- **THEN** all required environment variables are configured in Vercel dashboard

#### Scenario: Custom domain configured
- **WHEN** user accesses production URL
- **THEN** custom domain (portal.nextmoveaiservices.com) resolves correctly
