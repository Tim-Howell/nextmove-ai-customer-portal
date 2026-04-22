<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# NextMove AI Customer Portal - Development Context

## Project Overview
Customer portal for NextMove AI to manage customers, contracts, time tracking, priorities, and requests. Built with Next.js 15, Supabase, and TypeScript.

## Current Status (April 2026)
- **All Phases Complete (1-21)** ✅
- Phase 21: Portal improvements based on admin/customer testing
- MVP ready for production deployment
- Demo data seeding scripts available
- Playwright E2E tests created

## Key Architecture Decisions

### Database
- **Supabase PostgreSQL** with Row Level Security (RLS)
- `profiles` table extends Supabase auth.users
- `reference_values` table for dropdowns (status, category, level)
- `contract_types` table with behavior flags (tracks_hours, has_hour_limit, is_recurring, supports_rollover)
- `audit_logs` table with database triggers for change tracking

### Authentication
- Supabase Auth with Magic Link (primary) and email/password (fallback)
- Roles: `admin`, `staff`, `customer_user`
- Customer users scoped to single customer via `customer_contacts` table
- Middleware checks archive status and portal_access_enabled

### File Structure
```
app/
  (auth)/           # Login, password reset
  (portal)/         # Main app (dashboard, customers, contracts, etc.)
  actions/          # Server actions
components/
  ui/               # shadcn/ui components
  customers/        # Customer-specific components
  contracts/        # Contract-specific components
  audit/            # Audit log components
lib/
  supabase/         # Supabase client helpers
  errors/           # Error code system
  validations/      # Zod schemas
types/
  database.ts       # TypeScript interfaces
```

### Key Patterns
- Server Components by default, Client Components when needed
- Server Actions for mutations (`app/actions/*.ts`)
- Zod validation schemas in `lib/validations/`
- Error codes: `DOMAIN-OPERATION-NUMBER` (e.g., `CUS-CRE-001`)

## Important Tables

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles with role |
| `customers` | Customer organizations |
| `customer_contacts` | Customer staff (portal users) |
| `contracts` | Customer contracts with billing config |
| `contract_types` | Contract behavior definitions |
| `time_entries` | Time logs |
| `priorities` | Customer priorities/projects |
| `requests` | Customer requests |
| `audit_logs` | Change tracking |
| `portal_settings` | Branding (org name, logo) |
| `reference_values` | Dropdown options |

## Archive System
- `archived_at` timestamp on customers, contracts, contacts
- `is_read_only` flag on priorities, requests
- Cascade: archiving customer → archives contracts, disables contacts, marks priorities/requests read-only
- Middleware denies login for archived customer users

## OpenSpec Workflow
- `/opsx-propose` - Create new change with proposal and tasks
- `/opsx-apply` - Implement tasks from a change
- `/opsx-archive` - Archive completed change
- Changes stored in `openspec/changes/`
- Archived changes in `openspec/changes/archive/`

## Deployment (Vercel)
- Vercel auto-deploys on every push to `main`
- **Skip deployment** for docs-only changes by adding `[skip ci]` to commit message
  - Example: `git commit -m "Update README [skip ci]"`
  - Use for: README, docs/, AGENTS.md, comments, non-code changes
  - Do NOT use for: Any code changes, even minor ones

## Testing

### E2E Tests (Playwright)
- `pnpm test:e2e` - Run all E2E tests
- `pnpm test:e2e:ui` - Run with Playwright UI
- Tests in `tests/e2e/admin/` and `tests/e2e/customer/`

### RLS Validation
- `pnpm test:rls` - Run RLS policy validation
- Script in `scripts/test-rls.ts`

## Documentation
- `docs/TESTING-ADMIN.md` - Admin testing script
- `docs/TESTING-CUSTOMER.md` - Customer testing script
- `docs/PRODUCTION-DEPLOYMENT-CHECKLIST.md` - Go-live checklist
- `docs/DEFERRED-ITEMS-TRIAGE.md` - Deferred items categorization

## Deferred Items (Post-MVP Backlog)
- Migration consolidation (do before production data)
- Billing model filter on reports
- Period history display on contract detail
- Industry/website/renewal fields on customers
