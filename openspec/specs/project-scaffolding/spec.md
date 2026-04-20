## ADDED Requirements

### Requirement: Next.js App Router project initialization
The system SHALL be initialized as a Next.js 14+ project using the App Router with TypeScript enabled.

#### Scenario: Project runs in development mode
- **WHEN** developer runs `pnpm dev`
- **THEN** the development server starts on localhost:3000 with hot reload enabled

#### Scenario: TypeScript compilation succeeds
- **WHEN** developer runs `pnpm build`
- **THEN** the project compiles without TypeScript errors

### Requirement: Tailwind CSS with brand tokens
The system SHALL include Tailwind CSS configured with NextMove AI brand tokens as CSS variables.

#### Scenario: Brand colors are available
- **WHEN** developer uses `bg-primary` or `text-accent` classes
- **THEN** the Primary Navy (#2C3E50) and NextMove Green (#6FCF97) colors are applied

#### Scenario: Montserrat font is loaded
- **WHEN** the application renders
- **THEN** all text uses the Montserrat font family

### Requirement: shadcn/ui component library
The system SHALL include shadcn/ui initialized with a base set of components.

#### Scenario: Button component is available
- **WHEN** developer imports Button from `@/components/ui/button`
- **THEN** a styled, accessible button component is rendered

#### Scenario: Components follow brand styling
- **WHEN** shadcn/ui components are rendered
- **THEN** they use the configured brand colors and typography

### Requirement: Project folder structure
The system SHALL follow the folder structure defined in AGENTS.md.

#### Scenario: Required directories exist
- **WHEN** developer inspects the project root
- **THEN** directories `app/`, `components/`, `features/`, `lib/`, `types/`, `supabase/`, and `public/` exist

### Requirement: Code quality tooling
The system SHALL include ESLint, Prettier, and strict TypeScript configuration.

#### Scenario: Linting catches errors
- **WHEN** developer runs `pnpm lint`
- **THEN** ESLint reports any code quality issues

#### Scenario: Formatting is consistent
- **WHEN** developer runs `pnpm format`
- **THEN** Prettier formats all source files consistently

#### Scenario: TypeScript strict mode is enabled
- **WHEN** developer writes code with implicit `any` types
- **THEN** TypeScript reports a compilation error
