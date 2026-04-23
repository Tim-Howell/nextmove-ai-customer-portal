## ADDED Requirements

### Requirement: Auto-confirm contact email
The system SHALL automatically confirm contact email addresses when creating portal-enabled contacts, eliminating the need for email verification.

#### Scenario: Contact created with auto-confirmed email
- **WHEN** admin creates a contact with portal access enabled
- **THEN** the contact's email SHALL be marked as confirmed in Supabase Auth

#### Scenario: Contact can use magic link immediately
- **WHEN** a newly created contact attempts to log in via magic link
- **THEN** the magic link SHALL work without requiring prior email verification

### Requirement: No automatic invitation email
The system SHALL NOT automatically send invitation emails when creating contacts.

#### Scenario: Contact created without automatic email
- **WHEN** admin creates a contact with portal access enabled
- **THEN** no invitation email SHALL be sent automatically

#### Scenario: Invitation text removed from form
- **WHEN** admin views the add/edit contact form
- **THEN** the "Invitation will be sent" text SHALL NOT be displayed

### Requirement: Manual invitation sending
The system SHALL provide a manual "Send Invitation" button for contacts with portal access.

#### Scenario: Send Invitation button visible
- **WHEN** admin views a contact with portal access enabled
- **THEN** a "Send Invitation" button SHALL be visible

#### Scenario: Manual invitation sends email
- **WHEN** admin clicks "Send Invitation" button
- **THEN** an invitation email SHALL be sent to the contact's email address

### Requirement: Phone number formatting
The system SHALL format phone numbers in (000)000-0000 format.

#### Scenario: Phone number formatted on input
- **WHEN** admin enters a phone number in the contact form
- **THEN** the phone number SHALL be displayed in (000)000-0000 format

#### Scenario: Phone number stored as digits only
- **WHEN** admin saves a contact with a phone number
- **THEN** the phone number SHALL be stored as digits only in the database

### Requirement: Email lowercase formatting
The system SHALL format contact email addresses to lowercase.

#### Scenario: Email converted to lowercase on blur
- **WHEN** admin enters an email address and leaves the field
- **THEN** the email SHALL be converted to lowercase in the input

#### Scenario: Email saved as lowercase
- **WHEN** admin saves a contact with an email address
- **THEN** the email SHALL be stored in lowercase in the database
