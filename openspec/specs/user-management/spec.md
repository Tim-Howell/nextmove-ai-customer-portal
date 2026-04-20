# user-management Specification

## Purpose
TBD - created by archiving change p2-reference-data-and-admin-foundations. Update Purpose after archive.
## Requirements
### Requirement: Internal user list
The system SHALL display a list of all internal users (admin, staff) for admin users.

#### Scenario: View user list
- **WHEN** admin navigates to /settings/users
- **THEN** system displays table with name, email, role, and status

#### Scenario: Filter by role
- **WHEN** admin filters by role
- **THEN** system displays only users matching that role

### Requirement: Invite internal user
The system SHALL allow admin users to invite new internal users via email.

#### Scenario: Send invitation
- **WHEN** admin submits invite form with email and role
- **THEN** system sends Magic Link invitation email to the address

#### Scenario: Duplicate email rejected
- **WHEN** admin attempts to invite an email that already exists
- **THEN** system displays "User with this email already exists"

### Requirement: Edit user role
The system SHALL allow admin users to change roles of other internal users.

#### Scenario: Change staff to admin
- **WHEN** admin changes a staff user's role to admin
- **THEN** system updates the role and user gains admin privileges

#### Scenario: Cannot demote self
- **WHEN** admin attempts to change their own role
- **THEN** system prevents the change with "Cannot modify your own role"

### Requirement: Deactivate user
The system SHALL allow admin users to deactivate internal user accounts.

#### Scenario: Deactivate user
- **WHEN** admin deactivates a user account
- **THEN** user can no longer log in and is marked as inactive

#### Scenario: Reactivate user
- **WHEN** admin reactivates a previously deactivated user
- **THEN** user can log in again

#### Scenario: Cannot deactivate self
- **WHEN** admin attempts to deactivate their own account
- **THEN** system prevents with "Cannot deactivate your own account"

### Requirement: User management access control
The system SHALL restrict user management to admin users only.

#### Scenario: Admin accesses user management
- **WHEN** admin user navigates to /settings/users
- **THEN** system displays user management interface

#### Scenario: Staff cannot access user management
- **WHEN** staff user attempts to access /settings/users
- **THEN** system redirects to dashboard

