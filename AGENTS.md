# AGENTS.md

## Purpose
This repository contains the NextMove AI Customer Portal. The goal is to build a production-minded MVP using OpenSpec, Supabase, and Vercel with a codebase that is clear, maintainable, and reusable.

This file defines how AI coding agents should operate in this repo.

## Core Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui or similarly structured component primitives
- Supabase for database, auth, and file storage
- Vercel for hosting
- Resend for low-volume transactional email

## Product Context
The application has two primary experiences:
1. Internal portal for NextMove AI staff and admins
2. Customer portal for customer users limited to their own organization's data

Primary domains:
- customers
- contacts
- contracts
- time entries
- priorities
- requests
- reporting
- admin reference data

## Primary Roles
- `admin`
- `staff`
- `customer_user`

Agents must preserve strict role boundaries in both frontend and backend logic.

## Working Principles

### 1. Respect OpenSpec
- Treat `project.md` as the canonical product specification.
- Derive implementation tasks from `project.md`.
- Keep implementation aligned to MVP scope.
- Do not add major features that are not in scope unless explicitly requested.

### 2. Build in Small, Reviewable Increments
- Prefer small pull-request-sized changes.
- Complete one module cleanly before starting another.
- When possible, create vertical slices that include schema, backend access, UI, and permissions together.

### 3. Default to Simplicity
- Prefer simple, maintainable solutions over clever abstractions.
- Avoid premature generalization.
- Avoid introducing unnecessary libraries.
- Use table-driven reference data instead of hardcoding dropdowns where practical.

### 4. Security First
- Enforce authorization at the database layer using Supabase Row Level Security.
- Also enforce authorization in server actions, route handlers, and UI.
- Never rely on client-side checks alone.
- Keep internal-only fields hidden from customer users.
- Validate file access paths and storage policies carefully.

### 5. Type Safety and Validation
- Use TypeScript strictly.
- Validate inputs with Zod or equivalent schema validation.
- Validate server-side even if forms validate client-side.
- Avoid `any` unless absolutely necessary.

### 6. Good UI Defaults
- Keep the UI clean, modern, and data-first.
- Optimize internal workflows for speed and clarity.
- Optimize customer workflows for simplicity and confidence.
- Favor tables, summary cards, filters, and clear detail pages.
- Prefer accessibility-friendly components and semantics.

## Required Implementation Patterns

### Data Access
- Centralize Supabase access helpers.
- Use server-side data fetching where appropriate.
- Keep query logic close to the relevant domain module.
- Avoid scattering raw SQL or duplicated business logic across the codebase.

### Authorization
- Every domain query must consider role and customer scope.
- Customer users must only access records tied to their own customer account.
- Internal users can access all customer data.
- Admin-only pages and operations must be gated at both UI and backend layers.

### Domain Modeling
When building features, keep the domain structure clear:
- customer profiles are organizational records
- customer contacts are people tied to a customer
- contracts belong to a customer
- time entries belong to a customer and optionally a contract
- priorities belong to a customer
- requests belong to a customer and may include internal-only notes

### File Handling
- Use Supabase Storage buckets
- Store metadata in the database if needed
- Enforce per-record access rules for file visibility
- Avoid public buckets unless explicitly required

### Emails
- Use Resend only for transactional email
- Keep email templates simple
- Do not build a marketing email system
- Make email sending optional and resilient to provider errors

## Suggested Repository Structure
Agents should prefer a structure similar to this unless the repo already establishes a different convention:

- `app/` - routes, layouts, pages
- `components/` - reusable UI components
- `features/` - domain-specific modules
- `lib/` - shared utilities, clients, helpers
- `types/` - shared TypeScript types
- `supabase/` - migrations, seeds, config
- `public/` - static assets
- `docs/` - supporting notes if needed

Within `features/`, organize by domain, for example:
- `features/customers`
- `features/contracts`
- `features/time-entries`
- `features/priorities`
- `features/requests`
- `features/reporting`
- `features/admin`

## Delivery Sequence
Unless directed otherwise, agents should implement in this order:
1. app shell and auth foundations
2. roles and profile model
3. reference data
4. customers and contacts
5. customer portal access
6. contracts
7. time entries and hour calculations
8. priorities
9. requests
10. dashboards
11. reporting
12. files
13. notifications
14. polish and hardening

## Coding Standards
- Prefer server components where appropriate
- Use client components only when necessary
- Keep components small and composable
- Use descriptive names
- Avoid deeply nested conditional rendering
- Prefer explicit loading, error, and empty states
- Add comments only when they clarify non-obvious logic
- Do not leave dead code or placeholder TODOs without context

## Database and Migration Rules
- All schema changes must be made through migrations
- Seed reference data intentionally
- Do not edit production data manually in code
- Keep calculated values reproducible from source data when practical
- Document important RLS assumptions in migration comments or related docs

## Testing Expectations
At minimum, agents should verify:
- auth flows work
- role checks work
- customer scoping works
- contract hour calculations are correct
- internal-only fields are not exposed
- dashboard queries return expected scoped results

If automated tests are added, prioritize:
- utility logic
- authorization-sensitive code
- calculation logic
- critical server actions

## What Agents Should Avoid
- Do not introduce enterprise-only features into MVP
- Do not add broad integration frameworks
- Do not build invoice or billing systems
- Do not over-engineer notifications
- Do not create a generic CRM platform abstraction
- Do not bypass RLS for convenience
- Do not rely solely on client-side role gating

## Definition of Done
A feature is done when:
- schema and migrations are complete if needed
- authorization is implemented correctly
- UI is functional and reasonably polished
- loading/error/empty states exist
- the feature works for the correct role scopes
- code quality is consistent with the rest of the repo

## Agent Behavior
When implementing work:
- read the relevant section of `project.md`
- identify the smallest sensible unit of work
- implement with minimal scope creep
- preserve consistency with existing patterns
- surface tradeoffs when they matter
- prefer reversible decisions

If requirements are ambiguous:
- make the most conservative MVP-friendly choice
- document the assumption briefly in code comments or notes only when useful


## Branding Requirements
Follow NextMove AI branding strictly:
- Use Montserrat font
- Use defined color palette
- Maintain clean, professional UI
- Ensure consistency across all screens

Do not invent new styles outside branding unless necessary for usability.
