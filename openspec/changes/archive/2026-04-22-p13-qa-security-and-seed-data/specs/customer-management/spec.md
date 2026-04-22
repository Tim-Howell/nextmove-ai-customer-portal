## MODIFIED Requirements

### Requirement: Customer list view
The system SHALL display a paginated list of all customers for internal users (admin, staff) with search, filtering, and pagination.

#### Scenario: View customer list
- **WHEN** internal user navigates to /customers
- **THEN** system displays a table with customer name, status, primary contact, and action buttons

#### Scenario: Search customers
- **WHEN** internal user enters text in the search field
- **THEN** system filters the list to customers whose name contains the search text (case-insensitive)

#### Scenario: Filter by status
- **WHEN** internal user selects a status filter
- **THEN** system displays only customers matching that status

#### Scenario: Paginate customers
- **WHEN** customer list exceeds 20 items
- **THEN** system displays pagination controls with page numbers

#### Scenario: Navigate pages
- **WHEN** internal user clicks page 2
- **THEN** system displays items 21-40 and updates URL with page parameter

#### Scenario: Search with pagination reset
- **WHEN** internal user searches while on page 2
- **THEN** system resets to page 1 and applies search filter

#### Scenario: Filter with pagination reset
- **WHEN** internal user changes status filter while on page 2
- **THEN** system resets to page 1 and applies status filter

#### Scenario: URL reflects filter state
- **WHEN** internal user applies search and filter
- **THEN** URL contains query parameters for search, status, and page

#### Scenario: Direct URL navigation
- **WHEN** internal user navigates to /customers?search=acme&page=2
- **THEN** system displays page 2 of customers matching "acme"
