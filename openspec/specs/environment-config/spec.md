# environment-config Specification

## Purpose
Defines the required environment variables and their documentation surface for local and deployed environments.

## Requirements

### Requirement: Environment variable template
The system SHALL include a `.env.example` file documenting all required environment variables.

#### Scenario: Template lists Supabase variables
- **WHEN** developer views `.env.example`
- **THEN** it contains `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` placeholders

#### Scenario: Template lists server-side variables
- **WHEN** developer views `.env.example`
- **THEN** it contains `SUPABASE_SERVICE_ROLE_KEY` placeholder marked as server-only

### Requirement: Local environment file
The system SHALL use `.env.local` for local development secrets, excluded from git.

#### Scenario: Local env file is gitignored
- **WHEN** developer creates `.env.local` with secrets
- **THEN** git status does not show the file as tracked

### Requirement: Supabase client configuration
The system SHALL include a Supabase client helper that reads from environment variables.

#### Scenario: Client initializes with env vars
- **WHEN** application imports the Supabase client
- **THEN** it connects using `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### Scenario: Missing env vars show clear error
- **WHEN** required Supabase environment variables are not set
- **THEN** the application throws a descriptive error at startup
