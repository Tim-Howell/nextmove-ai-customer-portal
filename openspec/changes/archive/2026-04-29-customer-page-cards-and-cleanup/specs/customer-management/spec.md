## ADDED Requirements

### Requirement: Customer detail summary cards
The system SHALL display three summary cards on the customer detail page for Contracts, Priorities, and Requests, positioned between the "Points of Contact" section and the "Customer Contacts" section. Each card shows a count of open/active items, a descriptive label, and a link to the full list.

#### Scenario: Card placement
- **WHEN** an admin or staff user views the customer detail page
- **THEN** the page renders, in order: customer header, Points of Contact, **[Contracts card, Priorities card, Requests card]**, Customer Contacts, Internal Notes
- **AND** the three cards appear together as a row/grid between POCs and Customer Contacts

#### Scenario: Contracts card content
- **WHEN** an admin views the Contracts card for a customer
- **THEN** it displays the count of contracts where `status = 'active'` and `archived_at IS NULL` as a large number
- **AND** below it the label "Active Contracts"
- **AND** below that a "View All Contracts" button linking to the customer's contract list
- **AND** clicking the number links to the contract list filtered to Active status

#### Scenario: Priorities card content
- **WHEN** an admin views the Priorities card for a customer
- **THEN** it displays the count of priorities where `status IN ('backlog', 'next_up', 'active')` and `is_read_only = false` as a large number
- **AND** below it the label "Open Priorities"
- **AND** below that a "View All Priorities" button linking to the customer's priority list
- **AND** clicking the number links to the priority list filtered to open statuses

#### Scenario: Requests card content
- **WHEN** an admin views the Requests card for a customer
- **THEN** it displays the count of requests where `status IN ('new', 'in_review', 'in_progress')` and `is_read_only = false` as a large number
- **AND** below it the label "Open Requests"
- **AND** below that a "View All Requests" button linking to the customer's request list
- **AND** clicking the number links to the request list filtered to open statuses

#### Scenario: Zero counts render cleanly
- **WHEN** a card's count is zero
- **THEN** the card still renders with "0" as the number and both the label and View All link remain functional
