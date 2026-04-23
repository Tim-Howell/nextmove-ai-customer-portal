## ADDED Requirements

### Requirement: User menu in header
The system SHALL display a user menu dropdown in the top-right of the header.

#### Scenario: User menu trigger displays user info
- **WHEN** a user views the header
- **THEN** a clickable element SHALL display the user's name or avatar

#### Scenario: Clicking user menu opens dropdown
- **WHEN** a user clicks the user menu trigger
- **THEN** a dropdown menu SHALL appear with menu options

### Requirement: User menu contains profile link
The system SHALL include a "My Profile" link in the user menu.

#### Scenario: My Profile option visible
- **WHEN** a user opens the user menu dropdown
- **THEN** a "My Profile" option SHALL be visible

#### Scenario: My Profile navigates to profile page
- **WHEN** a user clicks "My Profile"
- **THEN** they SHALL be navigated to `/profile`

### Requirement: User menu contains logout option
The system SHALL include a "Log Off" option in the user menu.

#### Scenario: Log Off option visible
- **WHEN** a user opens the user menu dropdown
- **THEN** a "Log Off" option SHALL be visible

#### Scenario: Log Off triggers logout
- **WHEN** a user clicks "Log Off"
- **THEN** the system SHALL log the user out and redirect to the login page
