## Context

This is a greenfield Next.js project for the NextMove AI Customer Portal. No existing codebase exists. The project will use:
- **Next.js 14+** with App Router for the frontend framework
- **Supabase** for database, auth, and storage (external hosted service)
- **Vercel** for hosting with preview deployments
- **shadcn/ui** for accessible, customizable components
- **Tailwind CSS** with NextMove AI brand tokens

The project structure must follow AGENTS.md conventions and support the MVP delivery sequence starting with auth foundations.

## Goals / Non-Goals

**Goals:**
- Establish a working Next.js development environment with hot reload
- Configure Tailwind CSS with brand colors (Primary Navy #2C3E50, NextMove Green #6FCF97) and Montserrat font
- Install shadcn/ui with a subset of commonly needed components
- Set up strict TypeScript, ESLint, and Prettier for code quality
- Create environment variable patterns for Supabase connection strings
- Configure Vercel project with environment separation
- Create the base folder structure per AGENTS.md

**Non-Goals:**
- Implementing any auth logic (Phase 1)
- Creating database migrations or RLS policies
- Building any UI pages beyond a placeholder
- Setting up Resend email integration

## Decisions

### 1. Next.js Version and Package Manager
**Decision**: Use Next.js 14+ with App Router and pnpm as package manager.
**Rationale**: App Router is the recommended approach for new Next.js projects. pnpm provides faster installs and better disk efficiency than npm/yarn.
**Alternatives considered**: npm (slower), yarn (less disk efficient), Bun (less mature ecosystem support).

### 2. Tailwind CSS Configuration
**Decision**: Use Tailwind CSS v3 with CSS variables for brand tokens.
**Rationale**: CSS variables allow theme tokens to be referenced in both Tailwind classes and raw CSS, and support future dark mode implementation.
**Alternatives considered**: Hardcoded Tailwind theme values (less flexible for dark mode).

### 3. Component Library
**Decision**: Use shadcn/ui with manual component installation.
**Rationale**: shadcn/ui provides accessible, unstyled components that can be customized to match branding. Components are copied into the codebase, giving full control.
**Alternatives considered**: Radix UI directly (more boilerplate), Chakra UI (heavier, opinionated styling), MUI (heavy, different design system).

### 4. Environment Variables
**Decision**: Use `.env.local` for local development with a `.env.example` template committed to git.
**Rationale**: Standard Next.js pattern. Vercel automatically injects environment variables per deployment environment.
**Alternatives considered**: dotenv-vault (adds complexity), runtime config (less secure for secrets).

### 5. Folder Structure
**Decision**: Follow AGENTS.md structure: `app/`, `components/`, `features/`, `lib/`, `types/`, `supabase/`, `public/`.
**Rationale**: Aligns with project conventions and supports domain-driven organization.
**Alternatives considered**: Flat structure (doesn't scale), pages-based (legacy pattern).

### 6. TypeScript Strictness
**Decision**: Enable strict mode with `noUncheckedIndexedAccess` and `noImplicitReturns`.
**Rationale**: Catches more bugs at compile time, aligns with AGENTS.md requirement to avoid `any`.
**Alternatives considered**: Default strictness (misses edge cases).

## Risks / Trade-offs

- **Risk**: pnpm may not be installed on all developer machines → Mitigation: Document installation in README, pnpm is easy to install globally.
- **Risk**: shadcn/ui components require manual updates → Mitigation: Components are stable; updates are infrequent and can be done selectively.
- **Risk**: Supabase connection may fail if project not created → Mitigation: Environment variables will be empty initially; app will show clear error.
- **Trade-off**: Strict TypeScript slows initial development → Benefit: Fewer runtime bugs, better maintainability long-term.
