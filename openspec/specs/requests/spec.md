# requests Specification

## Purpose
Defines the request entity (customer-submitted ask) — its data model, submission flow, statuses, and notification behavior.

## Requirements

### Requirement: Request data model
The system SHALL store requests with customer association, submitter, title, description, status, internal notes, and timestamps.

#### Scenario: Request created by customer
- **WHEN** customer user submits a request with title and description
- **THEN** system stores request with customer_id from user's profile, submitted_by as current user, and status as "New"

#### Scenario: Request created by internal user
- **WHEN** internal user creates request on behalf of customer
- **THEN** system stores request with specified customer_id and submitted_by as internal user

### Requirement: Request status workflow
The system SHALL support request statuses: New, In Review, In Progress, Closed. Status values SHALL come from reference_values table.

#### Scenario: Request status updated by internal user
- **WHEN** internal user changes request status from "New" to "In Review"
- **THEN** system updates status_id and updated_at timestamp

#### Scenario: Customer cannot change request status
- **WHEN** customer user views their request
- **THEN** system does not display status change controls

### Requirement: Internal notes visibility
The system SHALL store internal notes on requests. Internal notes SHALL be visible only to internal users (admin, staff).

#### Scenario: Internal user adds internal notes
- **WHEN** internal user enters text in internal notes field
- **THEN** system saves internal notes with the request

#### Scenario: Customer cannot see internal notes
- **WHEN** customer user views their request details
- **THEN** system does not display internal notes field or content

### Requirement: Customer request submission
Customer users SHALL be able to submit new requests for their customer.

#### Scenario: Customer submits new request
- **WHEN** customer user fills out request form with title and description
- **THEN** system creates request with status "New" and redirects to requests list

#### Scenario: Customer views submission confirmation
- **WHEN** request is successfully submitted
- **THEN** system displays success message and shows request in list

### Requirement: Customer request viewing
Customer users SHALL view only requests belonging to their customer. Customer users SHALL NOT edit or delete requests.

#### Scenario: Customer views their requests
- **WHEN** customer user navigates to requests page
- **THEN** system displays only requests for their customer_id

#### Scenario: Customer views request details
- **WHEN** customer user clicks on a request
- **THEN** system displays request title, description, status, and timestamps (excluding internal notes)

### Requirement: Internal user full access to requests
Internal users (admin, staff) SHALL have full CRUD access to all requests including internal notes.

#### Scenario: Internal user views all requests
- **WHEN** internal user navigates to requests page
- **THEN** system displays requests from all customers

#### Scenario: Internal user edits request
- **WHEN** internal user updates request status and adds internal notes
- **THEN** system saves all changes including internal notes

#### Scenario: Internal user deletes request
- **WHEN** internal user confirms request deletion
- **THEN** system removes request from database

### Requirement: Request list filtering
The system SHALL support filtering requests by customer and status.

#### Scenario: Filter by customer
- **WHEN** internal user selects customer filter
- **THEN** system displays only requests for selected customer

#### Scenario: Filter by status
- **WHEN** user selects status filter "New"
- **THEN** system displays only requests with New status

### Requirement: Request detail view
The system SHALL display request details including customer name, submitter, title, description, status, and timestamps. Internal users SHALL also see internal notes.

#### Scenario: Internal user views request details
- **WHEN** internal user clicks on request in list
- **THEN** system displays full request information including internal notes

#### Scenario: Customer views request details
- **WHEN** customer user clicks on their request
- **THEN** system displays request information excluding internal notes

### Requirement: Notify internal users of new requests
When a customer submits a request, the system SHALL notify internal users via email.

#### Scenario: New request notification sent
- **WHEN** customer user submits a new request
- **THEN** system creates request AND sends notification email to internal staff

#### Scenario: No internal staff to notify
- **WHEN** customer user submits a request AND no internal staff emails are configured
- **THEN** system creates request AND logs warning about missing recipients

### Requirement: Notify customers of request status changes
When an internal user changes a request's status, the system SHALL notify the customer via email.

#### Scenario: Status change notification sent
- **WHEN** internal user changes request status from "New" to "In Review"
- **THEN** system updates request AND sends status update email to customer contacts with portal access

#### Scenario: Status unchanged
- **WHEN** internal user updates request without changing status
- **THEN** system updates request AND does not send status notification email
