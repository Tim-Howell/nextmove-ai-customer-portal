# auth-flow Specification

## Purpose
TBD - created by archiving change p1-auth-and-app-foundations. Update Purpose after archive.
## Requirements
### Requirement: User can log in with email and password
The system SHALL allow users to authenticate using their email address and password via Supabase Auth.

#### Scenario: Successful login
- **WHEN** user enters valid email and password and clicks "Sign In"
- **THEN** system authenticates the user and redirects to the dashboard

#### Scenario: Invalid credentials
- **WHEN** user enters invalid email or password
- **THEN** system displays an error message "Invalid email or password"

#### Scenario: Empty fields
- **WHEN** user clicks "Sign In" with empty email or password
- **THEN** system displays validation errors for required fields

### Requirement: User can log out
The system SHALL allow authenticated users to log out, clearing their session.

#### Scenario: Successful logout
- **WHEN** authenticated user clicks "Sign Out"
- **THEN** system clears the session and redirects to the login page

### Requirement: User can request password reset
The system SHALL allow users to request a password reset email.

#### Scenario: Valid email request
- **WHEN** user enters a registered email on the forgot password page and clicks "Send Reset Link"
- **THEN** system sends a password reset email and displays confirmation message

#### Scenario: Unregistered email request
- **WHEN** user enters an unregistered email
- **THEN** system displays the same confirmation message (to prevent email enumeration)

### Requirement: User can reset password via email link
The system SHALL allow users to set a new password using a valid reset link.

#### Scenario: Valid reset link
- **WHEN** user clicks a valid password reset link from email
- **THEN** system displays the reset password form

#### Scenario: Expired reset link
- **WHEN** user clicks an expired password reset link
- **THEN** system displays an error and prompts to request a new link

#### Scenario: Successful password reset
- **WHEN** user enters a valid new password and confirms it
- **THEN** system updates the password and redirects to login with success message

#### Scenario: Password mismatch
- **WHEN** user enters passwords that do not match
- **THEN** system displays validation error "Passwords do not match"

### Requirement: Login page displays branding
The system SHALL display the NextMove AI logo and brand colors on authentication pages.

#### Scenario: Brand elements visible
- **WHEN** user views the login page
- **THEN** the NextMove AI logo is displayed and the page uses brand colors (Primary Navy, NextMove Green)

### Requirement: Login page default view
The system SHALL display Magic Link input as the default login view, with password login as secondary option.

#### Scenario: Default login view
- **WHEN** user navigates to /login
- **THEN** system displays email input with "Send Magic Link" button and "Sign in with password" link

#### Scenario: Toggle to password view
- **WHEN** user clicks "Sign in with password"
- **THEN** system displays email and password inputs with "Sign in" button

