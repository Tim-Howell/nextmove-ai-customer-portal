## ADDED Requirements

### Requirement: Vercel deployment configuration
The system SHALL include a `vercel.json` configuration file for deployment settings.

#### Scenario: Build command is specified
- **WHEN** Vercel deploys the project
- **THEN** it uses `pnpm build` as the build command

#### Scenario: Output directory is configured
- **WHEN** Vercel deploys the project
- **THEN** it serves from the `.next` output directory

### Requirement: Preview deployments
The system SHALL support automatic preview deployments for pull requests.

#### Scenario: PR creates preview URL
- **WHEN** a pull request is opened on GitHub
- **THEN** Vercel creates a unique preview deployment URL

### Requirement: Environment separation
The system SHALL support separate environment variables for preview and production deployments.

#### Scenario: Production uses production Supabase
- **WHEN** the main branch is deployed
- **THEN** production environment variables are used

#### Scenario: Preview uses staging Supabase
- **WHEN** a preview deployment is created
- **THEN** preview environment variables are used (can be same as production for MVP)

### Requirement: README documentation
The system SHALL include a README.md with setup and deployment instructions.

#### Scenario: README explains local setup
- **WHEN** developer reads README.md
- **THEN** it contains steps to clone, install dependencies, configure env vars, and run locally

#### Scenario: README explains deployment
- **WHEN** developer reads README.md
- **THEN** it contains instructions for connecting to Vercel and deploying
