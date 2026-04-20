## ADDED Requirements

### Requirement: Unauthenticated users redirected to login
The system SHALL redirect unauthenticated users to the login page when accessing protected routes.

#### Scenario: Access protected route without session
- **WHEN** unauthenticated user navigates to a protected route (e.g., /dashboard)
- **THEN** system redirects to /login

#### Scenario: Access protected route with valid session
- **WHEN** authenticated user navigates to a protected route
- **THEN** system allows access and renders the page

### Requirement: Authenticated users redirected from auth pages
The system SHALL redirect authenticated users away from login/auth pages.

#### Scenario: Authenticated user visits login
- **WHEN** authenticated user navigates to /login
- **THEN** system redirects to /dashboard

### Requirement: Session refreshed on request
The system SHALL refresh the user's session on each request to prevent expiration during active use.

#### Scenario: Active session refresh
- **WHEN** user with valid session makes a request
- **THEN** system refreshes the session cookie

### Requirement: Internal routes restricted to internal users
The system SHALL restrict internal-only routes to users with admin or staff roles.

#### Scenario: Internal user accesses internal route
- **WHEN** user with role "admin" or "staff" accesses an internal route
- **THEN** system allows access

#### Scenario: Customer user accesses internal route
- **WHEN** user with role "customer_user" accesses an internal-only route
- **THEN** system redirects to customer dashboard or shows access denied

### Requirement: Customer routes enforce customer scoping
The system SHALL ensure customer users can only access data for their assigned customer.

#### Scenario: Customer user accesses own customer data
- **WHEN** customer_user accesses a route for their assigned customer
- **THEN** system allows access

#### Scenario: Customer user attempts cross-customer access
- **WHEN** customer_user attempts to access another customer's data
- **THEN** system denies access
