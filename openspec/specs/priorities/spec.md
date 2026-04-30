# priorities Specification

## Purpose
Defines the priority entity (customer-scoped task/initiative) — its data model, list/detail views, statuses, and access rules.

## Requirements

### Requirement: Priority data model
The system SHALL store priorities with customer association, title, description, status, priority level, optional due date, and audit fields (created_by, updated_by, timestamps).

#### Scenario: Priority created with all fields
- **WHEN** internal user creates a priority with customer, title, description, status, priority level, and due date
- **THEN** system stores the priority with all fields and sets created_by to current user

#### Scenario: Priority created with minimal fields
- **WHEN** internal user creates a priority with only customer, title, status, and priority level
- **THEN** system stores the priority with description and due_date as null

### Requirement: Priority status workflow
The system SHALL support priority statuses: Backlog, Next Up, Active, Complete, On Hold. Status values SHALL come from reference_values table.

#### Scenario: Priority status updated
- **WHEN** internal user changes priority status from "Active" to "Complete"
- **THEN** system updates status_id and sets updated_by to current user

### Requirement: Priority level classification
The system SHALL support priority levels: High, Medium, Low. Priority level values SHALL come from reference_values table.

#### Scenario: Priority level set on creation
- **WHEN** internal user creates a priority with priority level "High"
- **THEN** system stores the priority_level_id referencing the High value

### Requirement: Internal user full access to priorities
Internal users (admin, staff) SHALL have full CRUD access to all priorities.

#### Scenario: Internal user creates priority
- **WHEN** internal user submits priority form with valid data
- **THEN** system creates priority and redirects to priorities list

#### Scenario: Internal user edits priority
- **WHEN** internal user updates priority title and status
- **THEN** system saves changes and updates updated_by and updated_at

#### Scenario: Internal user deletes priority
- **WHEN** internal user confirms priority deletion
- **THEN** system removes priority from database

### Requirement: Customer user read-only access to priorities
Customer users SHALL only view priorities belonging to their customer. Customer users SHALL NOT edit or delete priorities.

#### Scenario: Customer views their priorities
- **WHEN** customer user navigates to priorities page
- **THEN** system displays only priorities for their customer_id

#### Scenario: Customer cannot edit priority
- **WHEN** customer user attempts to access priority edit page
- **THEN** system hides edit controls or redirects to read-only view

### Requirement: Customer priority submission (optional)
Customer users MAY submit new priorities as suggestions. Customer-submitted priorities SHALL default to "Backlog" status.

#### Scenario: Customer submits priority suggestion
- **WHEN** customer user submits new priority form
- **THEN** system creates priority with status "Backlog" and created_by set to customer user

### Requirement: Priority list filtering
The system SHALL support filtering priorities by customer, status, and priority level.

#### Scenario: Filter by customer
- **WHEN** internal user selects customer filter
- **THEN** system displays only priorities for selected customer

#### Scenario: Filter by status
- **WHEN** user selects status filter "Active"
- **THEN** system displays only priorities with Active status

#### Scenario: Filter by priority level
- **WHEN** user selects priority level filter "High"
- **THEN** system displays only High priority items

### Requirement: Priority detail view
The system SHALL display priority details including customer name, title, description, status, priority level, due date, and audit information.

#### Scenario: View priority details
- **WHEN** user clicks on priority in list
- **THEN** system displays full priority information on detail page
