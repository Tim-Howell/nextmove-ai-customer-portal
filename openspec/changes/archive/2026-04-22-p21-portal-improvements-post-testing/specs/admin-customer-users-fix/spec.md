## ADDED Requirements

### Requirement: Customer Users settings shows portal users
The Customer Users settings page SHALL display all customer contacts who have portal access enabled.

#### Scenario: Customer users list populated
- **WHEN** an admin navigates to Settings > Customer Users
- **AND** customer contacts with portal access exist
- **THEN** the page SHALL display those customer users

#### Scenario: Consistency with customer detail
- **WHEN** a customer detail page shows a contact with portal access enabled
- **THEN** that contact SHALL also appear in the Customer Users settings list

#### Scenario: Consistency with customer login
- **WHEN** a customer user can successfully log in to the portal
- **THEN** that user SHALL appear in the Customer Users settings list

### Requirement: Customer Users shows relevant information
The Customer Users list SHALL display customer association, access status, and identity details.

#### Scenario: Customer association visible
- **WHEN** viewing the Customer Users list
- **THEN** each row SHALL display the associated customer organization name

#### Scenario: Access status visible
- **WHEN** viewing the Customer Users list
- **THEN** each row SHALL display the portal access status (enabled/disabled)

#### Scenario: User identity visible
- **WHEN** viewing the Customer Users list
- **THEN** each row SHALL display the user's name and email
