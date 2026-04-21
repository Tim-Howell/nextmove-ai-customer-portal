# customer-invitation Specification

## Purpose
TBD - created by archiving change p4-customer-user-access. Update Purpose after archive.
## Requirements
### Requirement: Send customer invitation
The system SHALL allow staff/admin to send portal invitations to customer contacts.

#### Scenario: Send invitation
- **WHEN** staff clicks "Send Invitation" for a contact with portal_access_enabled and valid email
- **THEN** system sends Magic Link email and records the invitation

#### Scenario: Contact without email
- **WHEN** staff attempts to invite a contact without email
- **THEN** system displays error "Contact must have an email address"

#### Scenario: Portal access not enabled
- **WHEN** staff attempts to invite a contact without portal_access_enabled
- **THEN** "Send Invitation" button is disabled

### Requirement: Track invitations
The system SHALL track invitation status for audit purposes.

#### Scenario: Pending invitation
- **WHEN** invitation is sent but not accepted
- **THEN** invitation status shows "Pending" with sent date

#### Scenario: Accepted invitation
- **WHEN** contact clicks Magic Link and completes signup
- **THEN** invitation status shows "Accepted" with acceptance date

#### Scenario: Expired invitation
- **WHEN** invitation is older than 7 days and not accepted
- **THEN** invitation status shows "Expired"

### Requirement: Resend invitation
The system SHALL allow staff to resend expired or pending invitations.

#### Scenario: Resend to pending
- **WHEN** staff clicks "Resend" for a pending invitation
- **THEN** system sends new Magic Link and updates invitation timestamp

#### Scenario: Resend to expired
- **WHEN** staff clicks "Resend" for an expired invitation
- **THEN** system creates new invitation and sends Magic Link

### Requirement: Invitation acceptance
The system SHALL create user account when customer accepts invitation.

#### Scenario: Accept invitation
- **WHEN** contact clicks valid Magic Link
- **THEN** system creates auth user, profile, and links contact

#### Scenario: First login redirect
- **WHEN** customer user logs in for the first time
- **THEN** system redirects to customer dashboard

### Requirement: Send invitation email
When a customer contact is invited to the portal, the system SHALL send an email invitation containing a magic link.

#### Scenario: Invitation email sent successfully
- **WHEN** internal user invites a customer contact
- **THEN** system creates invitation record AND sends email with magic link to contact's email address

#### Scenario: Invitation created but email fails
- **WHEN** internal user invites a customer contact AND email delivery fails
- **THEN** system creates invitation record AND logs email error AND does not block the invitation flow

