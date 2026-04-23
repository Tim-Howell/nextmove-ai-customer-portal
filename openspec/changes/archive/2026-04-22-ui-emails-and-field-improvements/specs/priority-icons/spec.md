## ADDED Requirements

### Requirement: Priority icon field
The system SHALL allow selection of an icon for each priority using Lucide icons.

#### Scenario: Icon picker on priority form
- **WHEN** admin creates or edits a priority
- **THEN** an icon picker component SHALL be available to select an icon

#### Scenario: Icon picker displays curated icons
- **WHEN** admin opens the icon picker
- **THEN** a grid of curated Lucide icons SHALL be displayed (approximately 50 relevant icons)

#### Scenario: Icon picker search
- **WHEN** admin types in the icon picker search field
- **THEN** icons SHALL be filtered by name to match the search term

#### Scenario: Icon selection saved
- **WHEN** admin selects an icon and saves the priority
- **THEN** the icon name SHALL be stored in the priority record

#### Scenario: Icon is optional
- **WHEN** admin saves a priority without selecting an icon
- **THEN** the priority SHALL be saved with a null icon value

### Requirement: Priority icon display
The system SHALL display the selected icon on priority views.

#### Scenario: Icon displayed on priority card
- **WHEN** viewing a priority card
- **THEN** the selected icon SHALL be displayed (or a default icon if none selected)

#### Scenario: Icon displayed on priority detail page
- **WHEN** viewing a priority detail page
- **THEN** the selected icon SHALL be displayed next to the priority title

#### Scenario: Icon displayed in priority lists
- **WHEN** viewing priorities in any list context
- **THEN** the selected icon SHALL be displayed for each priority

### Requirement: Default priority icon
The system SHALL display a default icon when no icon is selected.

#### Scenario: Default icon for priorities without selection
- **WHEN** viewing a priority that has no icon selected
- **THEN** a default icon (e.g., "flag" or "target") SHALL be displayed
