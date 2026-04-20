## ADDED Requirements

### Requirement: Contact portal access management
The system SHALL display portal access status and invitation controls on contact detail.

#### Scenario: Show invitation status
- **WHEN** staff views contact with portal_access_enabled
- **THEN** system displays invitation status (Not Invited, Pending, Active)

#### Scenario: Show send invitation button
- **WHEN** contact has portal_access_enabled, valid email, and no active user
- **THEN** "Send Invitation" button is visible

#### Scenario: Show user status
- **WHEN** contact has linked user account
- **THEN** system displays "Portal Access: Active" with last login date if available
