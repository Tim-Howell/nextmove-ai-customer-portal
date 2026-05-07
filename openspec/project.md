# Project: NextMove AI Customer Portal

## 1. Project Summary

A secure web application for NextMove AI staff and customer staff to manage
customer information, contracts, time logs, priorities, requests, and
reporting.

The system is intentionally structured to also serve as a reusable reference
architecture: a small, opinionated stack that other internal tools can be
patterned after.

Stack:
- **Next.js (App Router) + TypeScript** for the application
- **Supabase** for Postgres, Auth, and Storage
- **Vercel** for hosting and preview deployments
- **Resend** for transactional email
- **OpenSpec** for change proposals and spec evolution (`openspec/`)

## 2. Product Goals

- A clean internal portal and a customer-facing portal sharing one codebase
- Secure login with role-based access; customer users scoped to a single
  customer
- Internal users manage customers, contracts, time logs, priorities, and
  requests; customer users view their own data and submit requests
- Hours-used / hours-remaining tracking on time-based contracts
- Useful summary dashboards plus filterable tabular reports
- Auditable, archive-aware, and safe by default (RLS at the data layer)

## 3. Out of scope

The portal is deliberately not trying to be:
- a Single Sign-On / IdP integration target
- a workflow engine or BPM tool
- a BI / analytics platform
- an invoicing or payments system
- a chat or messaging product
- a customer self-service contract editor
- a public API surface
- a native mobile app

Those concerns are handled by other tools or deferred to the future-enhancements
list at the end of this document.

## 4. Email

Transactional email is sent through **Resend**. Magic-link / invitation /
password-reset emails are delivered via Supabase Auth using the configured
Resend SMTP credentials. Direct application emails (e.g. notifications to
internal users) use the Resend API via `lib/email/`.

Email use cases:
- invite a customer user (Supabase Auth → Resend)
- magic-link sign-in (Supabase Auth → Resend)
- password reset (Supabase Auth → Resend)
- optional: notify internal users when a new request is submitted
- optional: notify customers when a request status changes

See `docs/RESEND_SETUP.md` for the operational setup checklist.

## 5. Roles

### NextMove AI Staff

Can:
- create and manage customers and customer contacts
- create and manage customer portal users
- create and manage contracts
- create and manage time entries
- create and manage priorities and customer requests
- view dashboards and reports across all customers

### NextMove AI Admin

Everything Staff can do, plus:
- manage internal users and assign internal roles
- manage system reference data (statuses, levels, categories)
- manage portal settings (branding, etc.)
- manage future feature flags / global configuration

### Customer Staff (`customer_user`)

Scoped to exactly one customer. Can:
- log in to the portal
- view their customer profile and assigned NextMove AI contacts
- view active and past contracts
- view hours used and remaining where applicable
- view time logs
- view priorities
- submit requests and view their status
- view their own team's contacts (read-only)

## 6. Core User Stories

### Internal
- As internal staff, I can create a customer account and customer contacts.
- As internal staff, I can enable portal access for selected customer contacts.
- As internal staff, I can create one or more contracts for a customer.
- As internal staff, I can log time against a customer and a contract.
- As internal staff, I can track priorities for each customer.
- As internal staff, I can review customer-submitted requests.
- As internal staff, I can see a portfolio dashboard across all customers.

### Customer
- As a customer user, I can securely log in.
- As a customer user, I can view my customer profile and assigned NextMove AI
  contacts.
- As a customer user, I can view my contracts and remaining hours.
- As a customer user, I can view detailed time logs.
- As a customer user, I can submit requests to NextMove AI.
- As a customer user, I can see the status of priorities and requests.

## 7. Core Modules

### 7.1 Authentication and Access Control
- Supabase Auth with Magic Link (primary) and email/password (fallback)
- Roles: `admin`, `staff`, `customer_user`
- Customer users scoped to one customer via `customer_contacts`
- Middleware enforces role-aware route protection, archive checks, and
  `portal_access_enabled` checks
- RLS policies enforce customer scoping at the database level

### 7.2 Customer Profiles
Customer fields:
- name, status, primary contact role assignments (POC, billing primary /
  secondary), assigned NextMove AI primary / secondary contacts
- description / notes (internal-only)
- demo flag (`is_demo`)
- archive timestamp (`archived_at`)
- branding fields (logo, etc.)

### 7.3 Customer Contacts
- full name, title, email, phone
- active flag
- portal access enabled flag (gates login)
- linked customer
- internal notes (internal-only)

### 7.4 Contract Management
Contracts are typed and behavior-flagged (see `contract_types`):
- name, customer, status, type, start/end date, description
- billing config: `hours_per_period`, `billing_day`, `total_hours`,
  `rollover_enabled`, `rollover_expiration_days`, `max_rollover_hours`,
  `fixed_cost`
- archive timestamp

Contract behavior flags (driven by `contract_types`):
- `tracks_hours`, `has_hour_limit`, `is_recurring`, `supports_rollover`

Contract types shipped:
- Hours Subscription (recurring monthly hours, optional rollover)
- Hours Bucket (fixed pool of hours)
- Fixed Cost
- Service Subscription
- On-Demand / No Contract (auto-created default)

Contract statuses (manual):
- Active, Expired, Archived

### 7.5 Time Logging
Time entries:
- date, internal staff user, customer, contract, category, description
- hours (always rounded **up** to the nearest 15-minute increment on save)
- billable / non-billable flag
- timestamps

Categories shipped: Administrative, Research, Technical, Meetings /
Presentations.

Rules:
- time entries roll up into contract hours used where the contract type
  tracks hours
- customer users can view, never edit, time entries

### 7.6 Priorities
A priority represents planned or active customer work.

Fields: customer, title, description, status, priority level, due date,
created/updated by, timestamps, optional icon.

Status reference values: Backlog, Next Up, Active, Complete.
Level reference values: High, Medium, Low.

Permissions:
- internal users create / edit / delete
- customer users view (read-only)

The priorities list groups by status (Active → Next Up → Backlog → Complete)
when no status filter is applied; otherwise it renders flat.

### 7.7 Requests
A request represents a customer-submitted item needing review or action.

Fields: customer, submitter, title, description, status, internal notes
(internal-only), timestamps.

Status reference values: New, In Review, In Progress, Closed.

Permissions:
- customer users create and view their own customer's requests
- internal users manage all requests

### 7.8 Internal Notes (polymorphic)
A single `internal_notes` table stores threaded internal-only notes attached
to customers, priorities, and requests. Customer users never see these notes.

### 7.9 Audit Logging
All CRUD on audited tables writes to `audit_logs` via Postgres triggers,
capturing the changing user, action, and JSON before/after values. Admins
view changes at `/reports/changes`.

### 7.10 Dashboards

**Internal dashboard:** customer count, active contracts, total hours
used / remaining, open requests, active priorities, recent activity, and a
trailing-90-day hours-by-staff chart.

**Customer dashboard:** welcome bar, hours-over-time chart with bucket /
billable / contract filters, hourly contracts snapshot (per-contract
burndown), summary tiles (hours this month, open requests, active priorities,
active contracts), Your Team (customer's own contacts), Your NextMove AI
Team (assigned staff), active contracts list, active priorities table,
quick actions.

### 7.11 Reporting
Filterable tabular reports rather than a BI surface. Internal filters
include customer, contract, date range, internal staff user, time category,
billable. Customer filters are scoped to their own customer. CSV export is
available on every report.

### 7.12 Admin Settings
Admin-only screens manage:
- contract types
- reference values (statuses, levels, categories)
- internal users and roles
- portal branding (org name, logo, theme tokens)
- feature flags / future global configuration

### 7.13 Impersonation ("View as Customer")
Admins can enter a read-only view of a customer's portal from the customer
detail page. While impersonating, all mutating server actions short-circuit
with a friendly error and a sticky banner is shown across the portal.

## 8. Functional Requirements

### 8.1 General
- Responsive web app
- Clean modern UI built on shadcn/ui + Tailwind
- Audit-friendly timestamps on key records
- Soft-delete / archive for customers, contracts, contacts; cascade archive
  from customer
- Confirmation before destructive actions

### 8.2 Security
- Role-based route protection in middleware
- Row-level security in Supabase, validated by `pnpm test:rls`
- Customer scoping enforced at both the database and application layers
- Files stored with explicit storage policies (see Storage section)
- Internal notes are only readable by internal users
- Impersonation is read-only and audit-logged on entry/exit

### 8.3 File Storage
Two Supabase Storage buckets, both provisioned by migration:
- `portal-assets` (public): organization logo, customer logos, priority
  images, future public images
- `portal-documents` (private): contract PDFs, request attachments, future
  private uploads

Customer-scoped read isolation for contract files is enforced at the app
layer via the RLS-scoped `contract_documents` table; the bucket policy is
intentionally broader so signed-URL access keeps working.

## 9. Data Model

### Core tables
- `profiles` — application user profile and role
- `customers`
- `customer_contacts`
- `contracts`
- `contract_types`
- `time_entries`
- `priorities`
- `requests`
- `internal_notes` (polymorphic)
- `contract_documents`
- `audit_logs`
- `portal_settings`
- `reference_values`

### Important relationships
- one customer has many contacts, contracts, priorities, requests, time entries
- one contract has many time entries
- one internal user can be assigned to many customers
- one customer can have many customer portal users (via `customer_contacts`
  with `portal_access_enabled = true`)

## 10. Technical Architecture

### Frontend
- Next.js App Router, Server Components by default; Client Components only
  when needed
- TypeScript everywhere
- Tailwind CSS + shadcn/ui
- React Hook Form + Zod for forms
- Server actions in `app/actions/*.ts` for mutations
- Validation schemas in `lib/validations/`
- Error code system in `lib/errors/` using `DOMAIN-OPERATION-NUMBER`
  (e.g. `CUS-CRE-001`)

### Backend
- Supabase Postgres with RLS
- Supabase Auth (Magic Link + email/password)
- Supabase Storage (`portal-assets`, `portal-documents`)
- Postgres triggers for audit logging

### Hosting and email
- Vercel for frontend hosting and preview deployments
- Resend for transactional email via Supabase Auth SMTP and the API client in
  `lib/email/`

### File structure
```
app/
  (auth)/           # login, password reset
  (portal)/         # main app (dashboard, customers, contracts, …)
  actions/          # server actions
components/
  ui/               # shadcn/ui components
  customers/, contracts/, audit/, dashboard/, …
lib/
  supabase/         # supabase clients (server / browser / route)
  errors/           # error code system
  validations/      # zod schemas
  utils/            # date helpers, csv export, etc.
types/
  database.ts       # database row interfaces
supabase/
  migrations/       # ordered schema migrations
scripts/            # one-off dev / seed / maintenance scripts
tests/e2e/          # Playwright E2E tests
```

## 11. UX and Visual Design

The portal uses an Apple-style soft-light theme with four admin-configurable
brand tokens at `/settings/portal-branding`. Token resolution and
WCAG-aware fallbacks live in `lib/theme/css-vars.ts`.

Default tokens:
| Token | Role | Default |
| --- | --- | --- |
| `primary_color` | Headings, structural chrome, primary buttons | `#2C3E50` |
| `accent_color` | Ring / focus / secondary highlights | `#6FCF97` |
| `background_base` | Page background | `#F5F5F7` |
| `foreground_base` | Page text | `#1D1D1F` |

Typography:
- Font: Montserrat (UI), Fraunces (display)
- H1 bold, H2/H3 semibold, body regular

Design principles:
- Clean, modern, professional
- Data-first layouts
- Minimal clutter, strong contrast
- Green for actions, navy for structure and hierarchy

A color-token lint catches Tailwind color literals that bypass the token
layer:

```bash
pnpm lint:colors
```

## 12. Navigation Structure

### Internal
- Submit Time (Quick Entry, Detailed Entry)
- Dashboard
- Requests
- Customers
- Customer Info → Contracts, Contacts, Priorities
- Reports → Time Reports, My Time Entries, Change Log
- Settings (admin)

### Customer
- Dashboard
- Customer Info → Contracts, Contacts, Priorities, Requests
- Reports → Time Report
- Submit Request (footer CTA)

## 13. Future Enhancements

Not on the immediate roadmap. Listed roughly in order of expected value.

- complete a fresh end-to-end security and RLS review prior to onboarding new
  customers
- approval workflow for customer-submitted priorities, including a SOW field
  on priorities
- richer request conversations / threaded comments — scoped & deferred, see
  [`openspec/backlog/requests-module-overhaul.md`](./backlog/requests-module-overhaul.md)
- customer-specific branding (per-customer accent / logo overrides)
- email notifications and digests (status-change emails, weekly digests)
- meeting tracking and management with email digests — track meetings and
  recaps in the system instead of via email
- documentation improvements: user-facing in-app help, inline tooltips,
  document upload UX polish
- external integrations (Mercury for billing, meeting scheduling, etc.)
- CSV / Excel export polish and saved report views
- support a single user belonging to multiple customer organizations
- industry / website / renewal-date fields on customers
- billing-model filter on reports
- period-history display on contract detail
- migration consolidation pass before any future schema-heavy effort
