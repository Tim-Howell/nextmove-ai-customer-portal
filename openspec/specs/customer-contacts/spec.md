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
The system SHALL allow internal users to edit contact records.

#### Scenario: Edit contact fields
- **WHEN** internal user updates contact fields and saves
- **THEN** system updates the contact record and shows success message

#### Scenario: Toggle contact active status
- **WHEN** internal user toggles is_active to false
- **THEN** system marks contact as inactive

#### Scenario: Toggle portal access
- **WHEN** internal user enables portal_access_enabled
- **THEN** system marks contact as eligible for portal access (actual invitation handled in Phase 4)

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

