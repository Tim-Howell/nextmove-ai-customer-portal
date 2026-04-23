## ADDED Requirements

### Requirement: Billing contact designations
The system SHALL allow designation of primary and secondary billing contacts for each customer.

#### Scenario: Assign primary billing contact
- **WHEN** admin edits a customer and selects a contact as Primary Billing Contact
- **THEN** the selected contact SHALL be saved as the customer's primary billing contact

#### Scenario: Assign secondary billing contact
- **WHEN** admin edits a customer and selects a contact as Secondary Billing Contact
- **THEN** the selected contact SHALL be saved as the customer's secondary billing contact

#### Scenario: Billing contacts displayed on customer profile
- **WHEN** viewing a customer profile page
- **THEN** the primary and secondary billing contacts SHALL be displayed in a Billing Contacts section

### Requirement: Point of Contact designations
The system SHALL allow designation of primary and secondary points of contact for each customer.

#### Scenario: Assign primary point of contact
- **WHEN** admin edits a customer and selects a contact as Primary Point of Contact
- **THEN** the selected contact SHALL be saved as the customer's primary POC

#### Scenario: Assign secondary point of contact
- **WHEN** admin edits a customer and selects a contact as Secondary Point of Contact
- **THEN** the selected contact SHALL be saved as the customer's secondary POC

#### Scenario: POC contacts displayed on customer profile
- **WHEN** viewing a customer profile page
- **THEN** the primary and secondary points of contact SHALL be displayed in a Point of Contact section

### Requirement: Contact role selection from customer contacts
The system SHALL only allow selection of contacts that belong to the customer for role assignments.

#### Scenario: Contact dropdown shows only customer contacts
- **WHEN** admin opens the contact selection dropdown for any role
- **THEN** only contacts belonging to that customer SHALL be available for selection

#### Scenario: Contact roles are optional
- **WHEN** admin saves a customer without selecting contacts for any role
- **THEN** the customer record SHALL be saved successfully with null values for unassigned roles

#### Scenario: Same contact can have multiple roles
- **WHEN** admin assigns the same contact to multiple roles (e.g., Primary Billing and Primary POC)
- **THEN** the system SHALL allow this assignment
