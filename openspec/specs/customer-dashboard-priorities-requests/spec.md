# customer-dashboard-priorities-requests Specification

## Purpose
Defines the customer dashboard widgets that surface open priorities and requests counts/lists for the signed-in customer.

## Requirements

### Requirement: Open priorities count widget
The customer dashboard SHALL display a count of open priorities (non-complete status) for the customer.

#### Scenario: Customer has open priorities
- **WHEN** customer user views dashboard with 3 priorities in Active/Next Up status
- **THEN** system displays "3" in the Open Priorities widget

#### Scenario: Customer has no open priorities
- **WHEN** customer user views dashboard with all priorities Complete or no priorities
- **THEN** system displays "0" in the Open Priorities widget

### Requirement: Open requests count widget
The customer dashboard SHALL display a count of open requests (non-closed status) for the customer.

#### Scenario: Customer has open requests
- **WHEN** customer user views dashboard with 2 requests in New/In Review/In Progress status
- **THEN** system displays "2" in the Open Requests widget

#### Scenario: Customer has no open requests
- **WHEN** customer user views dashboard with all requests Closed or no requests
- **THEN** system displays "0" in the Open Requests widget

### Requirement: Dashboard widget links
Dashboard widgets SHALL link to their respective list pages.

#### Scenario: Click priorities widget
- **WHEN** customer user clicks Open Priorities widget
- **THEN** system navigates to /priorities page

#### Scenario: Click requests widget
- **WHEN** customer user clicks Open Requests widget
- **THEN** system navigates to /requests page

### Requirement: Internal dashboard priority and request counts
The internal dashboard SHALL display total open priorities and open requests across all customers.

#### Scenario: Internal user views dashboard
- **WHEN** internal user views dashboard
- **THEN** system displays aggregate counts of open priorities and open requests
