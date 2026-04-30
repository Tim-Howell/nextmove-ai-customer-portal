# time-entry-quick-mode Specification

## Purpose
TBD - created by archiving change time-entry-quick-mode. Update Purpose after archive.
## Requirements
### Requirement: Quick time-entry form
The system SHALL provide a Quick Entry modal dialog that captures the minimal field set needed to create a time entry: customer, contract, date, hours, category, description, billable.

#### Scenario: Open Quick Entry from sidebar
- **WHEN** an `admin` or `staff` user clicks the "Quick Entry" button in the sidebar's Submit Time section
- **THEN** a modal dialog opens with fields: customer, contract, date, hours, category, description, billable

#### Scenario: Default field values
- **WHEN** the Quick Entry modal opens for the first time for a user
- **THEN** the date defaults to today, billable is checked, and customer/contract are empty

#### Scenario: Defaults from last-used preferences
- **WHEN** the user has previously submitted a Quick Entry and opens the modal again
- **THEN** the customer field is pre-filled with `profiles.preferences.time_entry.last_customer_id`
- **AND** the contract field is pre-filled with `last_contract_id` if it belongs to that customer and is still active

#### Scenario: Customer change resets contract
- **WHEN** the user changes the customer to a different customer than the remembered one
- **THEN** the contract field clears
- **AND** if the new customer has exactly one non-archived contract, the contract field auto-selects it

#### Scenario: Quick Entry omits detailed-only fields
- **WHEN** the Quick Entry modal renders
- **THEN** there is no field for internal note
- **AND** there is no control to log time on behalf of another staff person

### Requirement: Quick time-entry submission
The system SHALL persist a Quick Entry submission as a `time_entries` row identical in shape to a row created via the detailed form, with `internal_note = NULL` and `staff_id = current_user`.

#### Scenario: Successful submission
- **WHEN** a user submits a valid Quick Entry
- **THEN** the system inserts a `time_entries` row with the submitted values, `internal_note = NULL`, and `staff_id = auth.uid()`
- **AND** the modal closes
- **AND** the user sees a success toast "Time entry created"

#### Scenario: Validation failure
- **WHEN** a user submits with hours <= 0 or a missing required field
- **THEN** the modal stays open with inline validation errors and no DB write occurs

#### Scenario: Last-used preferences persisted
- **WHEN** a user successfully submits a Quick Entry
- **THEN** `profiles.preferences.time_entry.last_customer_id` is updated to the submitted customer
- **AND** `last_contract_id` is updated to the submitted contract

### Requirement: Customer-user has no time-entry capability
The system SHALL NOT expose any time-entry creation surface to `customer_user` role.

#### Scenario: Customer user does not see Submit Time section
- **WHEN** a `customer_user` views the sidebar
- **THEN** the Submit Time section, Quick Entry button, and Detailed Entry button are absent

#### Scenario: Direct API call denied
- **WHEN** a `customer_user` somehow invokes `createQuickTimeEntry`
- **THEN** the server action returns an authorization error and no DB write occurs

### Requirement: User preferences storage
The system SHALL store per-user time-entry preferences in `profiles.preferences` (jsonb), tolerant of missing or unexpected shapes.

#### Scenario: Reading missing preferences
- **WHEN** the Quick Entry modal opens for a user whose `profiles.preferences` is `{}` or `NULL`
- **THEN** the modal renders without errors and uses the global defaults (date today, billable checked)

#### Scenario: Stale contract reference
- **WHEN** `last_contract_id` references a contract that has been archived since
- **THEN** the contract field starts empty and the customer field still pre-fills from `last_customer_id`

