## ADDED Requirements

### Requirement: Priority create form submits all required fields
The Priority create form SHALL include all selected values in the form submission payload, including select/combobox controls.

#### Scenario: Form payload includes customer ID
- **WHEN** an admin selects a customer in the priority form
- **AND** submits the form
- **THEN** the form payload SHALL include the customer_id field with the selected value

#### Scenario: Form payload includes status ID
- **WHEN** an admin selects a status in the priority form
- **AND** submits the form
- **THEN** the form payload SHALL include the status field with the selected value

#### Scenario: Form payload includes priority level ID
- **WHEN** an admin selects a priority level in the priority form
- **AND** submits the form
- **THEN** the form payload SHALL include the priority_level field with the selected value

### Requirement: Priority create form provides feedback
The Priority create form SHALL provide clear feedback on submission success or failure.

#### Scenario: Success feedback
- **WHEN** a priority is successfully created
- **THEN** the system SHALL display a success toast AND redirect to the priorities list or detail page

#### Scenario: Failure feedback
- **WHEN** a priority creation fails
- **THEN** the system SHALL display an error message explaining the failure

### Requirement: Select controls bind to form state
All select/combobox controls in the priority form SHALL properly bind their values to the form state.

#### Scenario: Customer select binding
- **WHEN** an admin selects a customer from the dropdown
- **THEN** the form state SHALL update to include the selected customer_id
