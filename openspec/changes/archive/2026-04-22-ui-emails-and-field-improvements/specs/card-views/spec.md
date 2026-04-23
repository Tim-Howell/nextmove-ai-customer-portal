## ADDED Requirements

### Requirement: Customer card view
The system SHALL display customers in a card-based layout instead of a table view.

#### Scenario: Customers displayed as cards
- **WHEN** admin or staff views the Customers page
- **THEN** customers SHALL be displayed as cards in a responsive grid layout

#### Scenario: Customer card content
- **WHEN** viewing a customer card
- **THEN** the card SHALL display:
  - Customer logo (or placeholder if no logo)
  - Customer name

#### Scenario: Customer card navigation
- **WHEN** admin clicks on a customer card
- **THEN** the system SHALL navigate to the customer detail page

#### Scenario: Customer cards responsive layout
- **WHEN** viewing customers on different screen sizes
- **THEN** the card grid SHALL adjust columns responsively (e.g., 4 columns on desktop, 2 on tablet, 1 on mobile)

### Requirement: Priority card view
The system SHALL display priorities in a card-based layout instead of a table view.

#### Scenario: Priorities displayed as cards
- **WHEN** admin, staff, or customer user views the Priorities page
- **THEN** priorities SHALL be displayed as cards in a responsive grid layout

#### Scenario: Priority card content
- **WHEN** viewing a priority card
- **THEN** the card SHALL display:
  - Priority icon (or default icon if none selected)
  - Priority name
  - Priority level badge

#### Scenario: Priority card navigation
- **WHEN** user clicks on a priority card
- **THEN** the system SHALL navigate to the priority detail page

#### Scenario: Priority cards responsive layout
- **WHEN** viewing priorities on different screen sizes
- **THEN** the card grid SHALL adjust columns responsively

### Requirement: Customer profile related sections
The system SHALL display related entities on the customer profile page.

#### Scenario: Active contracts section on customer profile
- **WHEN** viewing a customer profile page
- **THEN** an "Active Contracts" section SHALL be displayed below Contacts with an "Add Contract" button

#### Scenario: Active priorities section on customer profile
- **WHEN** viewing a customer profile page
- **THEN** an "Active Priorities" section SHALL be displayed below Contracts with an "Add Priority" button

#### Scenario: Active requests section on customer profile
- **WHEN** viewing a customer profile page
- **THEN** an "Active Requests" section SHALL be displayed below Priorities with an "Add Request" button

#### Scenario: Add buttons pre-fill customer
- **WHEN** admin clicks "Add Contract", "Add Priority", or "Add Request" from customer profile
- **THEN** the new item form SHALL have the customer pre-selected
