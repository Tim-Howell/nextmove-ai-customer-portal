## ADDED Requirements

### Requirement: RLS validation test scripts
The system SHALL have automated scripts to validate all RLS policies.

#### Scenario: RLS test script exists
- **WHEN** developer runs `pnpm test:rls`
- **THEN** script executes RLS validation tests against database

#### Scenario: RLS tests cover all customer_user restrictions
- **WHEN** RLS test script runs
- **THEN** all customer_user read/write restrictions are validated

### Requirement: RLS policies use security definer helper
The system SHALL use the `get_user_role()` security definer function to avoid recursive RLS checks.

#### Scenario: Admin policies use helper function
- **WHEN** admin queries profiles table
- **THEN** RLS policy uses `get_user_role(auth.uid())` instead of subquery

#### Scenario: Staff policies use helper function
- **WHEN** staff queries profiles table
- **THEN** RLS policy uses `get_user_role(auth.uid())` instead of subquery

### Requirement: Customer user data isolation validated
The system SHALL have tests confirming customer_user cannot access other customers' data.

#### Scenario: Cross-customer contract access blocked
- **WHEN** customer_user attempts to read contract from different customer
- **THEN** RLS policy returns empty result

#### Scenario: Cross-customer priority access blocked
- **WHEN** customer_user attempts to read priority from different customer
- **THEN** RLS policy returns empty result

#### Scenario: Cross-customer request access blocked
- **WHEN** customer_user attempts to read request from different customer
- **THEN** RLS policy returns empty result

#### Scenario: Cross-customer time entry access blocked
- **WHEN** customer_user attempts to read time entry from different customer
- **THEN** RLS policy returns empty result
