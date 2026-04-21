# Project: NextMove AI Customer Portal

## 1. Project Summary
Build a secure web application for NextMove AI staff and customer staff to manage customer information, contracts, time logs, priorities, requests, and reporting.

This project will be built from scratch using:
- **Windsurf + OpenSpec** for product and implementation workflow
- **Supabase** for database, authentication, and file storage
- **Vercel** for hosting
- **Resend** for transactional email notifications in the initial implementation, unless a different provider is selected later

This system is intended to serve as:
1. A practical MVP for NextMove AI's side business
2. A reusable reference architecture and learning vehicle for future organizational use

## 2. Product Goals
The MVP should:
- Provide a clean internal and customer-facing portal
- Support secure login and role-based access
- Allow internal users to manage customers, contracts, time logs, priorities, and requests
- Allow customer users to view their own data and submit requests
- Calculate hours used and hours remaining for time-based contracts
- Provide useful dashboards and simple filtered reporting
- Be structured for future production hardening and reuse in a work setting

## 3. Non-Goals for MVP
The MVP should **not** include:
- Single Sign-On (SSO)
- complex workflow automation
- advanced analytics or BI
- invoice generation
- payment processing
- chat or messaging
- customer self-service contract editing
- custom API key management UI
- broad third-party integrations
- mobile app
- offline support

## 4. Recommended Email Provider
Use **Resend** for transactional email in the MVP. Its current free tier includes **3,000 emails/month** with a **100 emails/day** limit, which is comfortably above the expected volume for this project. Postmark also offers a long-running free developer plan, but it is limited to **100 emails/month**. For this project's expected volume, Resend is the better default. citeturn328241search0turn328241search15turn328241search1turn328241search7

MVP email use cases:
- invite customer user
- password reset
- optional notification when a new request is submitted
- optional notification when request status changes

## 5. Primary Users and Roles

### 5.1 NextMove AI Staff
Can:
- create and manage customers
- create and manage customer contacts
- create and manage customer portal users
- create and manage contracts
- create and manage time entries
- create and manage priorities
- create and manage customer requests
- view dashboards and reports across all customers

### 5.2 NextMove AI Admin
Can do everything Staff can do, plus:
- manage internal users
- assign internal roles
- manage system reference data
- manage portal settings
- manage feature flags or future global configuration

### 5.3 Customer Staff
Can only access data tied to their own customer account.

Can:
- log in to the portal
- view customer profile information
- view active and past contracts
- view hours used and remaining, where applicable
- view time logs
- view priorities
- submit new priorities if enabled
- submit requests
- view request status
- run simple customer-specific reports

## 6. Core User Stories

### Internal User Stories
- As internal staff, I can create a customer account and customer contacts.
- As internal staff, I can enable portal access for selected customer contacts.
- As internal staff, I can create one or more contracts for a customer.
- As internal staff, I can log time against a customer and optionally a contract.
- As internal staff, I can track priorities for each customer.
- As internal staff, I can review customer-submitted requests.
- As internal staff, I can see a portfolio dashboard across all customers.

### Customer User Stories
- As a customer user, I can securely log in.
- As a customer user, I can view my customer profile and assigned NextMove AI contacts.
- As a customer user, I can view my contracts and whether hours remain.
- As a customer user, I can view detailed time logs.
- As a customer user, I can submit requests to NextMove AI.
- As a customer user, I can see the status of priorities and requests.

## 7. Core Modules

### 7.1 Authentication and Access Control
Requirements:
- Email/password authentication using Supabase Auth
- Role-based access control
- Customer users scoped to exactly one customer account for MVP
- Internal users can access all customer accounts
- Invitation flow for customer users
- Password reset flow

Suggested roles:
- `admin`
- `staff`
- `customer_user`

### 7.2 Customer Profiles
Each customer profile should include:
- customer name
- status
- primary customer contact
- additional customer contacts
- assigned NextMove AI primary contact
- assigned NextMove AI secondary contact
- notes
- timestamps

Nice-to-have but optional in MVP:
- industry
- website
- renewal date
- tags

### 7.3 Customer Contacts
Store customer-specific people records:
- full name
- title
- email
- phone
- active/inactive flag
- portal access enabled flag
- linked customer
- notes

### 7.4 Contract Management
Each contract should include:
- customer
- contract name
- contract type
- status
- start date
- end date
- total hours (nullable)
- hours used (computed)
- hours remaining (computed)
- description / notes

Reference values:
- Contract Types:
  - Hours Subscription
  - Hours Bucket
  - Fixed Cost
  - Service Subscription
- Contract Statuses:
  - Draft
  - Active
  - Expired
  - Closed

Rules:
- hour-based contracts should display used and remaining hours
- fixed cost / service subscription contracts may omit hour accounting logic or display informational values only

### 7.5 Time Logging
Time entries should include:
- date
- internal staff user
- customer
- contract (optional if needed)
- category
- hours
- description
- billable / non-billable flag (optional for MVP but useful)
- created at / updated at

Reference values:
- Administrative
- Research
- Technical
- Meetings / Presentations

Rules:
- time entries roll up into contract hours used where applicable
- customer users can view, but not edit, time entries

### 7.6 Priorities
A priority represents planned or active customer work.

Fields:
- customer
- title
- description
- status
- priority level
- due date (optional)
- created by
- updated by
- timestamps

Reference values:
- Priority Status:
  - Backlog
  - Next Up
  - Active
  - Complete
  - On Hold
- Priority Level:
  - High
  - Medium
  - Low

MVP permissions:
- internal users can create/edit/delete
- customer users can view
- optional: customer users can submit new priorities as suggestions

### 7.7 Requests
A request represents a customer-submitted item needing review or action.

Fields:
- customer
- submitter
- title
- description
- status
- created at
- updated at
- internal notes (internal only)

Reference values:
- New
- In Review
- In Progress
- Closed

Permissions:
- customer users can create and view their own customer's requests
- internal users can manage all requests

### 7.8 Dashboards

#### Internal Dashboard
Display:
- customer count
- active contracts
- total hours used and remaining
- open requests
- active priorities
- recent activity

#### Customer Dashboard
Display:
- active contracts
- remaining hours
- recent time logs
- open priorities
- open requests
- assigned NextMove AI contacts

### 7.9 Reporting
MVP reporting should be filterable tables, not advanced dashboards.

Internal filters:
- customer
- contract
- date range
- internal staff user
- time category

Customer filters:
- contract
- date range
- time category

Exports:
- CSV export is nice-to-have, not required for MVP

### 7.10 Admin Settings
Admins can manage:
- contract types
- contract statuses
- time entry categories
- priority statuses
- priority levels
- request statuses
- internal users and roles

Keep admin settings simple and table-driven.

## 8. Functional Requirements

### 8.1 General
- Responsive web app
- Clean modern UI
- Audit-friendly timestamps on key records
- Soft delete or archive where practical for core records
- Confirmation before destructive actions

### 8.2 Security
- Role-based route protection
- Row-level security in Supabase
- Customer scoping enforced at database and app layers
- Files stored securely with access controls
- Sensitive internal notes hidden from customer users

### 8.3 File Storage
Use Supabase Storage for MVP file handling.

MVP file use cases:
- optionally upload contract PDFs
- optionally upload supporting files for requests

Initial file metadata:
- file name
- description
- related customer
- related contract or request
- uploaded by
- uploaded at

## 9. Suggested Data Model

### Core Tables
- `profiles` - application user profile and role metadata
- `customers`
- `customer_contacts`
- `customer_user_access` (optional if not folded into contacts/profiles)
- `internal_staff_assignments`
- `contracts`
- `time_entries`
- `priorities`
- `requests`
- `request_comments` (optional for MVP)
- `attachments`
- `reference_contract_types`
- `reference_contract_statuses`
- `reference_time_categories`
- `reference_priority_statuses`
- `reference_priority_levels`
- `reference_request_statuses`

### Important Relationships
- one customer has many contacts
- one customer has many contracts
- one customer has many priorities
- one customer has many requests
- one customer has many time entries
- one contract has many time entries
- one internal user can be assigned to many customers
- one customer can have many customer portal users

## 10. Technical Architecture

### Frontend
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui or equivalent component system
- TanStack Query if needed
- React Hook Form + Zod for forms

### Backend
- Supabase Postgres
- Supabase Auth
- Supabase Storage
- Row Level Security policies
- Supabase Edge Functions only if required

### Hosting
- Vercel for frontend hosting and preview deployments

### Email
- Resend transactional email integration for low-volume notifications


## 11. UX and Visual Design (Updated with Branding)

Follow the NextMove AI branding guide strictly:
- Primary Color: #2C3E50 (Primary Navy)
- Accent Color: #6FCF97 (NextMove Green)
- Backgrounds: #FFFFFF and #F8F9FA
- Dark Mode Background: #1A1F2E
- Secondary Text: #6C757D

Typography:
- Font: Montserrat (all UI)
- H1: Bold
- H2/H3: Semibold
- Body: Regular

Design Principles:
- Clean, modern, professional
- Data-first layouts (tables, dashboards)
- Minimal clutter
- Strong contrast and readability
- Use green for actions (buttons, highlights)
- Navy for structure and hierarchy

Brand Voice in UI:
- Strategic
- Clear and action-oriented
- Professional and confident

Use logo appropriately with spacing rules per branding guide.

## 12. Navigation Structure

### Internal Navigation
- Dashboard
- Customers
- Contracts
- Time Logs
- Priorities
- Requests
- Reports
- Admin

### Customer Navigation
- Dashboard
- Profile
- Contracts
- Time Logs
- Priorities
- Requests
- Reports

## 13. Acceptance Criteria for MVP
The MVP is successful when:
- internal users can authenticate and manage all core records
- customer users can authenticate and only see their own customer data
- contracts can track hours where applicable
- time entries roll up correctly into contract usage
- dashboards display useful summaries
- requests can be submitted and tracked
- reporting works with basic filters
- the application is deployable to Vercel and connected to Supabase

## 14. MVP Task List

### Phase 0 - Project Setup
- [x] initialize repository
- [x] configure OpenSpec structure
- [x] create project scaffolding with Next.js and TypeScript
- [x] configure Tailwind CSS
- [x] configure component library
- [x] configure ESLint, Prettier, and TypeScript settings
- [x] create environment variable strategy
- [x] connect Supabase project
- [x] configure Vercel project
- [x] define deployment environments
- [x] load brand tokens from branding kit

### Phase 1 - Auth and App Foundations
- [x] implement Supabase Auth
- [x] create login page
- [x] create forgot password / reset password flow
- [x] build profile and role model
- [x] implement route protection
- [x] implement role-based layouts
- [x] implement row-level security policies
- [x] seed initial admin user
- [x] create app shell and navigation


### Phase 2 - Reference Data and Admin Foundations
- [x] create reference tables
- [x] seed default dropdown values
- [x] build admin screens for managing reference data
- [x] build internal user management screens
- [x] implement role assignment flows
- [x] add demo data flag to records and admin toggle for demo data visibility
- [x] implement Magic Links as default login method with email/password fallback option

### Phase 3 - Customer and Contact Management
- [x] create customers table and migrations
- [x] create customer contacts table and migrations
- [x] build customer list screen
- [x] build customer detail screen
- [x] build create/edit customer forms
- [x] build create/edit customer contact forms
- [x] build customer assignments UI for internal contacts

### Phase 4 - Customer User Access
- [x] model customer portal access
- [x] build invite customer user flow
- [x] build enable/disable portal access controls
- [x] validate customer scoping in UI and database
- [x] test customer role permissions

### Phase 5 - Contract Management
- [x] create contracts schema
- [x] build contract list and detail screens
- [x] build create/edit contract forms
- [x] implement contract status logic
- [x] implement hour-based contract calculations
- [x] expose contracts on customer dashboard
- [x] integrate Supabase storage bucket "portal-documents" for contract documents

### Phase 6 - Time Logging
- [x] create time entries schema
- [x] build internal time entry list and form
- [x] support filtering by customer, contract, date range, category, and staff
- [x] calculate hours used per contract
- [x] calculate hours remaining per contract
- [x] build customer-facing time log view

### Phase 7 - Priorities
- [ ] create priorities schema
- [ ] build internal priorities list and form
- [ ] build customer-facing priorities view
- [ ] optionally allow customer submission of new priorities
- [ ] implement status and priority level filtering

### Phase 8 - Requests
- [ ] create requests schema
- [ ] build customer request submission form
- [ ] build internal request management view
- [ ] build customer request status view
- [ ] add internal notes field with visibility restrictions

### Phase 9 - Dashboards
- [ ] build internal dashboard summary queries
- [ ] build customer dashboard summary queries
- [ ] create summary cards and recent activity views
- [ ] link dashboard widgets to detail pages

### Phase 10 - Reporting
- [ ] build internal reporting screen
- [ ] build customer reporting screen
- [ ] implement table filtering
- [ ] implement date range filters
- [ ] implement export if time allows

### Phase 11 - Files
- [ ] configure Supabase Storage buckets
- [ ] implement contract attachment upload
- [ ] implement request attachment upload
- [ ] secure file access with storage policies

### Phase 12 - Notifications
- [ ] integrate Resend
- [ ] send invite emails
- [ ] send password reset support flow if needed
- [ ] optionally notify internal users of new requests
- [ ] optionally notify customers of request status changes

### Phase 13 - Quality, Security, and Launch Prep
- [ ] validate RLS policies (customers cannot delete/modify contacts, profiles, contracts, hours - only submit requests and view data)
- [ ] test role boundaries
- [ ] add loading and error states
- [ ] add empty states
- [ ] add success notifications
- [ ] review accessibility basics
- [ ] review responsive layouts
- [ ] seed demo data
- [ ] test customer search and filtering with demo data
- [ ] test customer pagination with demo data
- [ ] consolidate all database migrations before go-live (after feature complete, before customer data)
- [ ] prepare staging deployment
- [ ] prepare production deployment checklist
- [ ] validate all past changes are 100% complete including any deferred items
- [ ] configure custom SMTP in Supabase for production email (Magic Link invitations)

### Deferred Items (to address in relevant phases or Phase 13)
**From Phase 2:**
- [ ] Role filter dropdown on user management page (minor enhancement)
- [ ] Demo data filtering for customer_contacts (contacts inherit from parent customer)

**From Phase 3:**
- [ ] Customer search and filtering (Phase 13 with demo data)
- [ ] Customer pagination (Phase 13 with demo data)
- [ ] Industry, website, renewal date fields on customers (nice-to-have)

**From Phase 4:**
- [ ] Portal access disable → user deactivation (Phase 13 validation)
- [x] RLS for contracts scoped by customer_id (Phase 5) ✓ Completed
- [x] RLS for time_entries scoped by customer_id (Phase 6) ✓ Completed
- [ ] RLS for priorities scoped by customer_id (Phase 7)
- [ ] RLS for requests scoped by customer_id (Phase 8) 

## 15. Open Questions / Future Enhancements
- support multiple customer organizations per user
- approval workflow for customer-submitted priorities
- richer request conversations or comments
- CSV exports
- customer-specific branding
- email digests
- external integrations
- invoice visibility
- SLA tracking
