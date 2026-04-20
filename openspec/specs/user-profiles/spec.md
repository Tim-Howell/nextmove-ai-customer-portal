# user-profiles Specification

## Purpose
TBD - created by archiving change p1-auth-and-app-foundations. Update Purpose after archive.
## Requirements
### Requirement: Profile created on user signup
The system SHALL automatically create a profile record when a new user signs up via Supabase Auth.

#### Scenario: New user signup
- **WHEN** a new user completes signup via Supabase Auth
- **THEN** a profile record is created with the user's ID, email, and default role "staff"

### Requirement: Profile stores user role
The system SHALL store each user's role in their profile record.

#### Scenario: Role values
- **WHEN** a profile is created or updated
- **THEN** the role field contains one of: "admin", "staff", or "customer_user"

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

### Requirement: Users can view their own profile
The system SHALL allow users to read their own profile data.

#### Scenario: Read own profile
- **WHEN** authenticated user requests their profile
- **THEN** system returns their profile data including role and customer_id

### Requirement: Admins can view all profiles
The system SHALL allow admin users to read all profile records.

#### Scenario: Admin reads profiles
- **WHEN** admin user requests profile list
- **THEN** system returns all profiles

#### Scenario: Non-admin cannot read other profiles
- **WHEN** staff or customer_user requests another user's profile
- **THEN** system denies access

### Requirement: Users can update limited profile fields
The system SHALL allow users to update their own full_name and avatar_url.

#### Scenario: Update own name
- **WHEN** user updates their full_name
- **THEN** system saves the change

#### Scenario: Cannot update own role
- **WHEN** user attempts to update their own role
- **THEN** system denies the change

### Requirement: Profile timestamps maintained
The system SHALL maintain created_at and updated_at timestamps on profiles.

#### Scenario: Created timestamp set
- **WHEN** profile is created
- **THEN** created_at is set to current timestamp

#### Scenario: Updated timestamp refreshed
- **WHEN** profile is modified
- **THEN** updated_at is set to current timestamp

### Requirement: Profile customer_id foreign key
The system SHALL enforce referential integrity between profiles.customer_id and customers.id.

#### Scenario: Valid customer reference
- **WHEN** profile is updated with a customer_id
- **THEN** system validates the customer_id exists in customers table

#### Scenario: Invalid customer reference rejected
- **WHEN** profile is updated with a non-existent customer_id
- **THEN** system rejects the update with foreign key violation

