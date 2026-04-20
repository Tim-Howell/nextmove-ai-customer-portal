## MODIFIED Requirements

### Requirement: Customer users linked to customer
The system SHALL require customer_user profiles to have a customer_id linking them to their customer account, which now references the customers table.

#### Scenario: Customer user has customer_id
- **WHEN** a user has role "customer_user"
- **THEN** their profile has a non-null customer_id referencing a valid customers record

#### Scenario: Internal user has no customer_id
- **WHEN** a user has role "admin" or "staff"
- **THEN** their profile has a null customer_id

#### Scenario: Customer_id references valid customer
- **WHEN** a profile has a non-null customer_id
- **THEN** the customer_id references an existing record in the customers table

## ADDED Requirements

### Requirement: Profile customer_id foreign key
The system SHALL enforce referential integrity between profiles.customer_id and customers.id.

#### Scenario: Valid customer reference
- **WHEN** profile is updated with a customer_id
- **THEN** system validates the customer_id exists in customers table

#### Scenario: Invalid customer reference rejected
- **WHEN** profile is updated with a non-existent customer_id
- **THEN** system rejects the update with foreign key violation
