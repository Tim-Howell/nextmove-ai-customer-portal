# NextMove AI Customer Portal

A secure web application for NextMove AI staff and customer staff to manage customer information, contracts, time logs, priorities, requests, and reporting.

## Project Status

**MVP Progress: Phases 1-18 Complete**

| Phase | Status | Description |
|-------|--------|-------------|
| 0-12 | ✅ Complete | Core functionality (auth, customers, contracts, time, priorities, requests, dashboards, reports, files, notifications) |
| 13 | ✅ Complete | Quality, Security, and Seed Data (manual testing deferred to Phase 20) |
| 14-15 | ✅ Complete | Customer UX Refinement, Portal Enhancements |
| 16 | ✅ Complete | Archive Capabilities (cascade archive, user access control) |
| 17 | ✅ Complete | Contract Types Enhancement (billing models, hours buckets, rollover) |
| 18 | ✅ Complete | Audit Logging & Error Handling |
| 20 | 🔲 Pending | Validation, Cleanup, Test, and Go-Live Prep |

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (Magic Link + Email/Password)
- **Storage**: Supabase Storage (portal-assets, portal-documents)
- **Email**: Resend (transactional)
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)

### Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Tim-Howell/nextmove-ai-customer-portal.git
   cd nextmove-ai-customer-portal
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Add your Supabase credentials to `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (server-side only)

5. Set up Supabase Storage buckets (see [Storage Buckets](#storage-buckets) below)

6. Start the development server:
   ```bash
   pnpm dev
   ```

7. Open [http://localhost:3000](http://localhost:3000)

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting

## Project Structure

```
├── app/              # Next.js App Router pages and layouts
├── components/       # Reusable UI components
│   └── ui/          # shadcn/ui components
├── features/        # Domain-specific modules
├── lib/             # Shared utilities and clients
│   └── supabase/    # Supabase client helpers
├── types/           # TypeScript type definitions
├── supabase/        # Database migrations and config
└── public/          # Static assets
```

## Deployment

### Vercel

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel project settings
3. Deploy

Preview deployments are automatically created for pull requests.

## Storage Buckets

This application requires two Supabase Storage buckets:

### `portal-assets` (Public)
Used for publicly accessible branding assets:
- Organization logo
- Customer logos
- Priority images

**Setup:**
1. Create bucket named `portal-assets` in Supabase Storage
2. Set bucket to **Public**
3. Run the following SQL to add policies:
   ```sql
   -- Allow authenticated users to upload
   create policy "Allow authenticated uploads to portal-assets"
   on storage.objects for insert
   to authenticated
   with check (bucket_id = 'portal-assets');

   -- Allow public read access
   create policy "Allow public read access to portal-assets"
   on storage.objects for select
   to public
   using (bucket_id = 'portal-assets');
   ```

### `portal-documents` (Private)
Used for secure documents with access control:
- Contract PDFs
- Request attachments

**Setup:**
1. Create bucket named `portal-documents` in Supabase Storage
2. Keep bucket **Private**
3. RLS policies control access based on user role and customer association

## Key Features

### User Roles
- **Admin**: Full system access, user management, settings
- **Staff**: Manage customers, contracts, time entries, priorities, requests
- **Customer User**: View own customer data, submit requests/priorities

### Contract Types
- **Hours Subscription**: Recurring monthly hours with rollover support
- **Hours Bucket**: Fixed pool of hours
- **Fixed Cost**: No hour tracking
- **Service Subscription**: Recurring service without hours

### Archive System
- Cascade archive: archiving a customer archives all related contracts, contacts, priorities, requests
- Archived customers' users cannot log in
- Archived items excluded from dropdowns but preserved in reports
- "Show Archived" toggle on list views

### Audit Logging
- All CRUD operations logged with before/after values
- User context captured (who, when, what changed)
- Admin-only audit log viewer at `/settings/audit-log`
- Record history on detail pages

## Database Migrations

Migrations are in `supabase/migrations/`. Key migrations:
- `20240422000001_archive_capabilities.sql` - Archive fields and triggers
- `20240422000002_audit_logging.sql` - Audit log table and triggers

Run migrations:
```bash
npx supabase db push
```

## Development Workflow

This project uses **OpenSpec** for structured development:
- `openspec/project.md` - Master project specification
- `openspec/changes/` - Active change proposals
- `openspec/changes/archive/` - Completed changes

## Demo Data

For testing and demonstration purposes, you can seed the database with demo data.

### Seeding Demo Data

```bash
# Seed demo customers, contracts, time entries, priorities, requests
npx tsx scripts/seed-demo-data.ts

# Create demo user accounts (run after seeding data)
npx tsx scripts/create-demo-accounts.ts
```

### Demo Login Credentials

| Email | Password | Customer |
|-------|----------|----------|
| `demo-acme1@example.com` | `DemoPass123!` | Acme Corporation |
| `demo-techstart@example.com` | `DemoPass123!` | TechStart Solutions |

**Note:** Demo accounts only work when the "Show Demo Data" setting is enabled in System Settings. When disabled, demo users cannot log in.

### Demo Data Summary

- **10 Customers** (8 active, 2 archived)
- **25 Contacts** (13 with portal access)
- **15 Contracts** (retainer, project, ad-hoc types)
- **100 Time Entries** (for pagination testing)
- **65+ Priorities** (Acme: 25, TechStart: 22, others spread)
- **75+ Requests** (Acme: 25, TechStart: 22, others spread)

All demo records have `is_demo = true` and can be filtered using the "Show Demo Data" toggle.

## Documentation

- `openspec/project.md` - Full project specification with all phases
- `AGENTS.md` - AI assistant context and guidelines
- `README.md` - This file
