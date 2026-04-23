## ADDED Requirements

### Requirement: Customer website URL field
The system SHALL provide a website URL field on the customer profile that stores the customer's website address.

#### Scenario: Adding website URL when creating customer
- **WHEN** admin creates a new customer and enters a website URL
- **THEN** the website URL SHALL be saved to the customer record

#### Scenario: Website URL formatted to lowercase
- **WHEN** admin enters a website URL with mixed case (e.g., "Www.Example.COM")
- **THEN** the system SHALL convert the URL to lowercase before saving (e.g., "www.example.com")

#### Scenario: Editing website URL
- **WHEN** admin edits an existing customer and modifies the website URL
- **THEN** the updated URL SHALL be saved in lowercase format

#### Scenario: Website URL displayed on customer profile
- **WHEN** viewing a customer profile page
- **THEN** the website URL SHALL be displayed as a clickable link (if present)

#### Scenario: Website URL is optional
- **WHEN** admin creates or edits a customer without entering a website URL
- **THEN** the customer record SHALL be saved successfully with a null website value
