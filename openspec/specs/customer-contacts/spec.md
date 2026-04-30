# customer-contacts Specification

## Purpose
TBD - created by archiving change p3-customer-and-contact-management. Update Purpose after archive.
## Requirements
### Requirement: Contact list within customer
The system SHALL display all contacts for a customer on the customer detail page.

#### Scenario: View customer contacts
- **WHEN** internal user views customer detail page
- **THEN** system displays a table of contacts with name, title, email, phone, active status, and portal access status

#### Scenario: Empty contact list
- **WHEN** customer has no contacts
- **THEN** system displays "No contacts yet" message with add contact button

### Requirement: Contact creation
The system SHALL allow internal users to add contacts to a customer.

#### Scenario: Create contact with required fields
- **WHEN** internal user submits contact form with full name
- **THEN** system creates the contact linked to the customer with is_active=true

#### Scenario: Create contact with all fields
- **WHEN** internal user submits form with full name, title, email, phone, and notes
- **THEN** system creates the contact with all provided values

#### Scenario: Validation error on empty name
- **WHEN** internal user submits the form without full name
- **THEN** system displays validation error "Full name is required"

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

### Requirement: Contact deletion
The system SHALL allow internal users to delete contact records.

#### Scenario: Delete contact
- **WHEN** internal user confirms contact deletion
- **THEN** system deletes the contact and refreshes the contact list

#### Scenario: Delete contact with portal access
- **WHEN** internal user deletes a contact that has portal_access_enabled
- **THEN** system deletes the contact (linked profile cleanup handled separately)

### Requirement: Contact access control
The system SHALL restrict contact data access based on user role.

#### Scenario: Internal user accesses contacts
- **WHEN** admin or staff user views customer contacts
- **THEN** system displays all contacts for that customer

#### Scenario: Customer user views contacts
- **WHEN** customer_user accesses their customer's contacts via API
- **THEN** system returns only contacts for their linked customer

#### Scenario: Customer user cannot modify contacts
- **WHEN** customer_user attempts to create, edit, or delete a contact
- **THEN** system denies the action

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

