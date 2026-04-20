## Why

This is the foundational setup for the NextMove AI Customer Portal. Before any features can be built, the project needs proper scaffolding with Next.js, TypeScript, Tailwind CSS, shadcn/ui components, and connections to Supabase and Vercel. This establishes the development environment, tooling, and deployment pipeline that all subsequent work depends on.

## What Changes

- Initialize Next.js 14+ with App Router and TypeScript
- Configure Tailwind CSS with NextMove AI brand tokens (colors, typography)
- Install and configure shadcn/ui component library
- Set up ESLint, Prettier, and strict TypeScript configuration
- Create environment variable strategy for local, staging, and production
- Connect to Supabase project (database, auth, storage)
- Configure Vercel project with deployment environments
- Create base project structure per AGENTS.md conventions

## Capabilities

### New Capabilities
- `project-scaffolding`: Next.js App Router project with TypeScript, Tailwind CSS, and shadcn/ui configured
- `environment-config`: Environment variable management for Supabase and deployment targets
- `deployment-pipeline`: Vercel project configuration with preview and production environments

### Modified Capabilities
(none - this is a greenfield setup)

## Impact

- **Code**: Creates the entire initial project structure (`app/`, `components/`, `lib/`, `features/`, `types/`, `supabase/`, `public/`)
- **Dependencies**: Adds Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, Supabase client libraries
- **Systems**: Connects to external Supabase project and Vercel hosting
- **Configuration**: Establishes ESLint, Prettier, TypeScript, and Tailwind configs that all future code must follow
