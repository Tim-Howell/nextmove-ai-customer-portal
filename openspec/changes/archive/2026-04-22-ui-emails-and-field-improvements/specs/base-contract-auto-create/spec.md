## ADDED Requirements

### Requirement: Auto-create base contract for new customers
The system SHALL automatically create a base contract when a new customer is created to serve as a catch-all for ad-hoc/on-demand hours.

#### Scenario: Base contract created with new customer
- **WHEN** admin creates a new customer
- **THEN** the system SHALL automatically create a base contract with the following properties:
  - Name: "{Customer Name} - Base Contract"
  - Contract Type: hours_bucket
  - Status: Active
  - Total Hours: NULL (unlimited)
  - Start Date: NULL
  - End Date: NULL

#### Scenario: Base contract linked to customer
- **WHEN** a base contract is auto-created
- **THEN** the contract SHALL be associated with the newly created customer via customer_id

#### Scenario: Customer creation fails if base contract cannot be created
- **WHEN** admin creates a new customer but base contract creation fails
- **THEN** the entire operation SHALL be rolled back and an error message displayed

#### Scenario: Base contract visible in customer contracts
- **WHEN** viewing a customer's contracts list
- **THEN** the base contract SHALL appear in the list of contracts

#### Scenario: Base contract is editable
- **WHEN** admin views the auto-created base contract
- **THEN** the contract SHALL be editable like any other contract
