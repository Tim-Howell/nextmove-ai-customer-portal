## ADDED Requirements

### Requirement: Consolidated baseline migration
The system SHALL have a single consolidated migration file representing the complete schema.

#### Scenario: Baseline migration creates all tables
- **WHEN** baseline migration is run on empty database
- **THEN** all tables are created with correct columns and constraints

#### Scenario: Baseline migration creates all RLS policies
- **WHEN** baseline migration is run
- **THEN** all Row Level Security policies are applied correctly

#### Scenario: Baseline migration creates all functions and triggers
- **WHEN** baseline migration is run
- **THEN** all database functions, triggers, and helper functions are created

### Requirement: Original migrations archived
The system SHALL preserve original migration files for reference.

#### Scenario: Original migrations moved to archive
- **WHEN** consolidation is complete
- **THEN** original migration files exist in `supabase/migrations/archive/`

### Requirement: Migration tested on fresh database
The system SHALL verify consolidated migration works on fresh Supabase project.

#### Scenario: Fresh database deployment succeeds
- **WHEN** consolidated migration is run on new Supabase project
- **THEN** all tables, policies, and functions are created without errors

#### Scenario: Application functions correctly after migration
- **WHEN** application connects to freshly migrated database
- **THEN** all CRUD operations work correctly
