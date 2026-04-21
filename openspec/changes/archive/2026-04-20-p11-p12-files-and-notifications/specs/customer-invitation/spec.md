## MODIFIED Requirements

### Requirement: Send invitation email
When a customer contact is invited to the portal, the system SHALL send an email invitation containing a magic link.

#### Scenario: Invitation email sent successfully
- **WHEN** internal user invites a customer contact
- **THEN** system creates invitation record AND sends email with magic link to contact's email address

#### Scenario: Invitation created but email fails
- **WHEN** internal user invites a customer contact AND email delivery fails
- **THEN** system creates invitation record AND logs email error AND does not block the invitation flow
