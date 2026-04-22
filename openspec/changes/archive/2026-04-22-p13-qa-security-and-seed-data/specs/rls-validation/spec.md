## ADDED Requirements

### Requirement: Customer user read-only access to contracts
The system SHALL prevent customer_user role from creating, updating, or deleting contracts.

#### Scenario: Customer user cannot create contract
- **WHEN** customer_user attempts to insert a contract via API
- **THEN** system returns permission denied error

#### Scenario: Customer user cannot update contract
- **WHEN** customer_user attempts to update a contract via API
- **THEN** system returns permission denied error

#### Scenario: Customer user cannot delete contract
- **WHEN** customer_user attempts to delete a contract via API
- **THEN** system returns permission denied error

#### Scenario: Customer user can view own contracts
- **WHEN** customer_user queries contracts for their customer_id
- **THEN** system returns the contracts

### Requirement: Customer user read-only access to time entries
The system SHALL prevent customer_user role from creating, updating, or deleting time entries.

#### Scenario: Customer user cannot create time entry
- **WHEN** customer_user attempts to insert a time entry via API
- **THEN** system returns permission denied error

#### Scenario: Customer user cannot update time entry
- **WHEN** customer_user attempts to update a time entry via API
- **THEN** system returns permission denied error

#### Scenario: Customer user cannot delete time entry
- **WHEN** customer_user attempts to delete a time entry via API
- **THEN** system returns permission denied error

#### Scenario: Customer user can view own time entries
- **WHEN** customer_user queries time entries for their customer_id
- **THEN** system returns the time entries

### Requirement: Customer user read-only access to customer contacts
The system SHALL prevent customer_user role from creating, updating, or deleting customer contacts.

#### Scenario: Customer user cannot create contact
- **WHEN** customer_user attempts to insert a customer contact via API
- **THEN** system returns permission denied error

#### Scenario: Customer user cannot update contact
- **WHEN** customer_user attempts to update a customer contact via API
- **THEN** system returns permission denied error

#### Scenario: Customer user cannot delete contact
- **WHEN** customer_user attempts to delete a customer contact via API
- **THEN** system returns permission denied error

#### Scenario: Customer user can view own customer contacts
- **WHEN** customer_user queries customer contacts for their customer_id
- **THEN** system returns the contacts

### Requirement: Customer user read-only access to profiles
The system SHALL prevent customer_user role from viewing or modifying other users' profiles.

#### Scenario: Customer user cannot view other profiles
- **WHEN** customer_user queries profiles for users not matching their own id
- **THEN** system returns empty result or permission denied

#### Scenario: Customer user can view own profile
- **WHEN** customer_user queries their own profile
- **THEN** system returns their profile data

### Requirement: Customer user limited access to priorities
The system SHALL allow customer_user to view and create priorities for their customer, but not update or delete.

#### Scenario: Customer user can create priority
- **WHEN** customer_user creates a priority for their customer_id
- **THEN** system creates the priority successfully

#### Scenario: Customer user cannot update priority
- **WHEN** customer_user attempts to update a priority via API
- **THEN** system returns permission denied error

#### Scenario: Customer user cannot delete priority
- **WHEN** customer_user attempts to delete a priority via API
- **THEN** system returns permission denied error

### Requirement: Customer user limited access to requests
The system SHALL allow customer_user to view and create requests for their customer, but not update or delete.

#### Scenario: Customer user can create request
- **WHEN** customer_user creates a request for their customer_id
- **THEN** system creates the request successfully

#### Scenario: Customer user cannot update request
- **WHEN** customer_user attempts to update a request via API
- **THEN** system returns permission denied error

#### Scenario: Customer user cannot delete request
- **WHEN** customer_user attempts to delete a request via API
- **THEN** system returns permission denied error

### Requirement: Customer user cannot access other customers' data
The system SHALL prevent customer_user from accessing data belonging to other customers.

#### Scenario: Customer user cannot view other customer's contracts
- **WHEN** customer_user queries contracts with a different customer_id
- **THEN** system returns empty result

#### Scenario: Customer user cannot view other customer's priorities
- **WHEN** customer_user queries priorities with a different customer_id
- **THEN** system returns empty result

#### Scenario: Customer user cannot view other customer's requests
- **WHEN** customer_user queries requests with a different customer_id
- **THEN** system returns empty result
