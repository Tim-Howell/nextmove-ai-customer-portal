## ADDED Requirements

### Requirement: Contact-user linking
The system SHALL link customer contacts to auth users via a user_id column.

#### Scenario: Contact linked to user
- **WHEN** a customer contact accepts an invitation
- **THEN** the contact's user_id is set to the new auth user's id

#### Scenario: Profile linked to customer
- **WHEN** a customer contact accepts an invitation
- **THEN** a profile is created with role=customer_user and customer_id set to the contact's customer

### Requirement: Portal access toggle
The system SHALL allow staff/admin to enable or disable portal access for customer contacts.

#### Scenario: Enable portal access
- **WHEN** staff enables portal_access_enabled on a contact
- **THEN** the "Send Invitation" button becomes available

#### Scenario: Disable portal access
- **WHEN** staff disables portal_access_enabled on a contact with existing user
- **THEN** the user can no longer log in (profile.is_active set to false)

### Requirement: Customer data scoping
The system SHALL ensure customer users only see data belonging to their customer.

#### Scenario: Customer views contracts
- **WHEN** customer user navigates to /contracts
- **THEN** only contracts for their customer are displayed

#### Scenario: Customer cannot access other customers
- **WHEN** customer user attempts to access another customer's data via URL
- **THEN** system returns 404 or redirects to dashboard

### Requirement: Customer navigation
The system SHALL hide internal-only navigation items from customer users.

#### Scenario: Customer sidebar
- **WHEN** customer user views the sidebar
- **THEN** "Customers" link is not visible

#### Scenario: Customer settings hidden
- **WHEN** customer user views the sidebar
- **THEN** "Settings" link is not visible
