## ADDED Requirements

### Requirement: Staff names displayed on time entries
Customer-visible time entry tables SHALL display the name of the staff member who performed the work.

#### Scenario: Time entry with staff attribution
- **WHEN** a customer views a time entry table on a contract detail page
- **THEN** each time entry row SHALL display the staff member's name in the Staff column

#### Scenario: Time entry in reports with staff attribution
- **WHEN** a customer views the Time Reports page
- **THEN** each time entry row SHALL display the staff member's name

#### Scenario: Staff name fallback
- **WHEN** a time entry has no associated staff profile or the name is unavailable
- **THEN** the system SHALL display "Unknown" instead of a dash

### Requirement: Submitter names displayed on requests
Customer-visible request tables and detail pages SHALL display the name of the person who submitted the request.

#### Scenario: Request list with submitter name
- **WHEN** a customer views the Requests list page
- **THEN** each request row SHALL display the submitter's name in the Submitted By column

#### Scenario: Request detail with submitter name
- **WHEN** a customer views a request detail page
- **THEN** the page SHALL display the submitter's name in the Submitted By field

#### Scenario: Submitter name fallback
- **WHEN** a request has no associated submitter or the name is unavailable
- **THEN** the system SHALL display "Unknown" instead of a dash
