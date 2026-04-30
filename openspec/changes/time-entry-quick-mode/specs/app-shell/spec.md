## ADDED Requirements

### Requirement: Sidebar Submit Time section
The system SHALL display a "Submit Time" section in the sidebar for `admin` and `staff` roles, containing two buttons: Quick Entry and Detailed Entry.

#### Scenario: Section visible to admin and staff
- **WHEN** a user with role `admin` or `staff` views any portal page
- **THEN** the sidebar displays a "Submit Time" section header followed by a "Quick Entry" button and a "Detailed Entry" button

#### Scenario: Section hidden from customer_user
- **WHEN** a user with role `customer_user` views any portal page
- **THEN** the sidebar does not display the Submit Time section, Quick Entry button, or Detailed Entry button

#### Scenario: Quick Entry opens modal
- **WHEN** an admin or staff user clicks the Quick Entry button
- **THEN** the system opens the Quick time-entry modal dialog without navigating away from the current page

#### Scenario: Detailed Entry navigates to existing form
- **WHEN** an admin or staff user clicks the Detailed Entry button
- **THEN** the system navigates to `/time-logs/new` (the existing detailed time-entry form)
