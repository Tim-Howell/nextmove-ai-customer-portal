# customer-management Specification

## Purpose
TBD - created by archiving change p3-customer-and-contact-management. Update Purpose after archive.
## Requirements
### Requirement: Customer list view
The system SHALL display a paginated list of all customers for internal users (admin, staff).

#### Scenario: View customer list
- **WHEN** internal user navigates to /customers
- **THEN** system displays a table with customer name, status, primary contact, and action buttons

#### Scenario: Search customers
- **WHEN** internal user enters text in the search field
- **THEN** system filters the list to customers whose name contains the search text

#### Scenario: Filter by status
- **WHEN** internal user selects a status filter
- **THEN** system displays only customers matching that status

### Requirement: Customer creation
The system SHALL allow internal users to create new customer records.

#### Scenario: Create customer with required fields
- **WHEN** internal user submits the create customer form with name
- **THEN** system creates the customer with status "active" and redirects to customer detail

#### Scenario: Create customer with all fields
- **WHEN** internal user submits the form with name, status, primary contact, secondary contact, and notes
- **THEN** system creates the customer with all provided values

#### Scenario: Validation error on empty name
- **WHEN** internal user submits the form without a name
- **THEN** system displays validation error "Customer name is required"

### Requirement: Customer detail view
The system SHALL display customer details including contacts and assignments.

#### Scenario: View customer detail
- **WHEN** internal user navigates to /customers/[id]
- **THEN** system displays customer name, status, notes, assigned NextMove contacts, and list of customer contacts

#### Scenario: Customer not found
- **WHEN** user navigates to /customers/[id] with invalid id
- **THEN** system displays 404 not found page

### Requirement: Customer editing
The system SHALL allow internal users to edit existing customer records.

#### Scenario: Edit customer fields
- **WHEN** internal user updates customer fields and saves
- **THEN** system updates the customer record and shows success message

#### Scenario: Change customer status
- **WHEN** internal user changes status from active to inactive
- **THEN** system updates the status and displays the new status

### Requirement: Customer deletion
The system SHALL allow admin users to delete customer records.

#### Scenario: Admin deletes customer
- **WHEN** admin user confirms customer deletion
- **THEN** system deletes the customer and all associated contacts, redirects to customer list

#### Scenario: Staff cannot delete customer
- **WHEN** staff user attempts to delete a customer
- **THEN** system denies the action with "Only admins can delete customers"

### Requirement: Customer access control
The system SHALL restrict customer data access based on user role.

#### Scenario: Internal user accesses customer list
- **WHEN** admin or staff user navigates to /customers
- **THEN** system displays all customers

#### Scenario: Customer user cannot access customer list
- **WHEN** customer_user navigates to /customers
- **THEN** system redirects to dashboard or shows access denied

#### Scenario: Customer user views own customer
- **WHEN** customer_user accesses their linked customer's data via API
- **THEN** system returns only their customer's information

