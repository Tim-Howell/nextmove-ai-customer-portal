## ADDED Requirements

### Requirement: Internal notes table exists
The system SHALL have an `internal_notes` table that stores notes linked to customers, priorities, or requests.

#### Scenario: Table schema
- **WHEN** the internal_notes table is created
- **THEN** it SHALL have columns: id (UUID PK), entity_type (TEXT), entity_id (UUID), note_text (TEXT), created_by (UUID FK to profiles), created_at (TIMESTAMPTZ)

#### Scenario: Entity type constraint
- **WHEN** inserting a note
- **THEN** entity_type SHALL be one of: 'customer', 'priority', 'request'

### Requirement: Staff can view internal notes
The system SHALL allow admin and staff users to view internal notes on customer, priority, and request detail pages.

#### Scenario: Admin views notes on customer page
- **WHEN** an admin user views a customer detail page
- **THEN** the system SHALL display an "Internal Notes" section with all notes for that customer

#### Scenario: Staff views notes on priority page
- **WHEN** a staff user views a priority detail page
- **THEN** the system SHALL display an "Internal Notes" section with all notes for that priority

#### Scenario: Staff views notes on request page
- **WHEN** a staff user views a request detail page
- **THEN** the system SHALL display an "Internal Notes" section with all notes for that request

#### Scenario: Notes display order
- **WHEN** internal notes are displayed
- **THEN** they SHALL be ordered by created_at descending (newest first)

#### Scenario: Note display format
- **WHEN** a note is displayed
- **THEN** it SHALL show the author's full name, the created_at timestamp, and the note text

### Requirement: Customer users cannot see internal notes
The system SHALL NOT display internal notes to customer_user role.

#### Scenario: Customer user views customer page
- **WHEN** a customer_user views their customer detail page
- **THEN** the Internal Notes section SHALL NOT be visible

#### Scenario: RLS blocks customer user read
- **WHEN** a customer_user attempts to query internal_notes via API
- **THEN** the system SHALL return zero results

### Requirement: Staff can add internal notes
The system SHALL allow admin and staff users to add new internal notes.

#### Scenario: Add note to customer
- **WHEN** a staff user clicks "Add Note" on a customer page and submits note text
- **THEN** the system SHALL create a new internal_note with entity_type='customer', entity_id=customer.id, created_by=current user, created_at=now()

#### Scenario: Add note to priority
- **WHEN** a staff user clicks "Add Note" on a priority page and submits note text
- **THEN** the system SHALL create a new internal_note with entity_type='priority', entity_id=priority.id, created_by=current user, created_at=now()

#### Scenario: Add note to request
- **WHEN** a staff user clicks "Add Note" on a request page and submits note text
- **THEN** the system SHALL create a new internal_note with entity_type='request', entity_id=request.id, created_by=current user, created_at=now()

#### Scenario: Note text required
- **WHEN** a user attempts to add a note with empty text
- **THEN** the system SHALL reject the submission with a validation error

#### Scenario: New note appears immediately
- **WHEN** a user successfully adds a note
- **THEN** the new note SHALL appear at the top of the notes list without page refresh

### Requirement: Notes are append-only
The system SHALL NOT allow editing or deleting internal notes.

#### Scenario: No edit capability
- **WHEN** a note is displayed
- **THEN** there SHALL be no edit button or edit functionality

#### Scenario: No delete capability
- **WHEN** a note is displayed
- **THEN** there SHALL be no delete button or delete functionality

#### Scenario: RLS blocks update
- **WHEN** any user attempts to UPDATE an internal_note via API
- **THEN** the system SHALL reject the operation

#### Scenario: RLS blocks delete
- **WHEN** any user attempts to DELETE an internal_note via API
- **THEN** the system SHALL reject the operation

### Requirement: Old internal_notes columns are dropped
The system SHALL remove the internal_notes column from customers, priorities, and requests tables.

#### Scenario: Customer table column dropped
- **WHEN** the migration runs
- **THEN** the internal_notes column SHALL be removed from the customers table

#### Scenario: Priority table column dropped
- **WHEN** the migration runs
- **THEN** the internal_notes column SHALL be removed from the priorities table

#### Scenario: Request table column dropped
- **WHEN** the migration runs
- **THEN** the internal_notes column SHALL be removed from the requests table

### Requirement: Internal notes field removed from forms
The system SHALL remove the internal_notes text field from customer, priority, and request create/edit forms.

#### Scenario: Customer form has no internal notes field
- **WHEN** a user views the customer create or edit form
- **THEN** there SHALL be no internal_notes textarea field

#### Scenario: Priority form has no internal notes field
- **WHEN** a user views the priority create or edit form
- **THEN** there SHALL be no internal_notes textarea field

#### Scenario: Request form has no internal notes field
- **WHEN** a user views the request create or edit form
- **THEN** there SHALL be no internal_notes textarea field
