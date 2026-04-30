## MODIFIED Requirements

### Requirement: Contact editing
The system SHALL allow internal users to edit contact records. When an edit disables portal access or deactivates the contact, the system SHALL delete the associated auth user.

#### Scenario: Edit contact fields
- **WHEN** internal user updates contact fields and saves
- **THEN** system updates the contact record and shows success message

#### Scenario: Toggle contact active status to false
- **WHEN** internal user toggles `is_active` from true to false on a contact that has a linked auth user
- **THEN** system marks contact as inactive
- **AND** system deletes the linked `auth.users` row
- **AND** system sets `customer_contacts.user_id` to null
- **AND** subsequent login attempts with that email fail

#### Scenario: Toggle contact active status with no auth user
- **WHEN** internal user toggles `is_active` to false on a contact with no linked auth user
- **THEN** system marks contact as inactive
- **AND** no auth deletion occurs

#### Scenario: Toggle portal access off
- **WHEN** internal user disables `portal_access_enabled` on a contact that has a linked auth user
- **THEN** system updates the contact
- **AND** system deletes the linked `auth.users` row
- **AND** system sets `customer_contacts.user_id` to null

#### Scenario: Toggle portal access on
- **WHEN** internal user enables `portal_access_enabled` on an active contact with an email and no existing auth user
- **THEN** system creates a new auth user for the contact (existing behavior preserved)
- **AND** contact is marked as eligible for portal access
