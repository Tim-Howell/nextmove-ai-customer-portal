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

**Storage Buckets:**
- `portal-assets` - **Public bucket** for branding assets (organization logo, customer logos, priority images). These files are publicly accessible and displayed in the UI.
- `portal-documents` - **Private bucket** for secure documents (contract PDFs, request attachments). Access controlled via RLS policies, only accessible to authorized users.

MVP file use cases:
- optionally upload contract PDFs
- optionally upload supporting files for requests
- upload organization logo for portal branding
- upload customer logos
- upload priority images

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
- [x] create priorities schema
- [x] build internal priorities list and form
- [x] build customer-facing priorities view
- [x] optionally allow customer submission of new priorities
- [x] implement status and priority level filtering

### Phase 8 - Requests
- [x] create requests schema
- [x] build customer request submission form
- [x] build internal request management view
- [x] build customer request status view
- [x] add internal notes field with visibility restrictions

### Phase 9 - Dashboards
- [x] build internal dashboard summary queries
- [x] build customer dashboard summary queries
- [x] create summary cards and recent activity views
- [x] link dashboard widgets to detail pages

### Phase 10 - Reporting
- [x] build internal reporting screen
- [x] build customer reporting screen
- [x] implement table filtering
- [x] implement date range filters
- [x] implement export if time allows

### Phase 11 - Files
- [x] configure Supabase Storage buckets
- [x] implement contract attachment upload
- [x] secure file access with storage policies

### Phase 12 - Notifications
- [x] integrate Resend
- [x] send invite emails (handled by Supabase OTP magic link)
- [x] send password reset support flow if needed (handled by Supabase Auth)
- [x] optionally notify internal users of new requests
- [x] optionally notify customers of request status changes

### Phase 13 - Quality, Security, and Seed Data ✓
- [~] validate RLS policies (deferred to Phase 20)
- [~] test role boundaries (deferred to Phase 20)
- [x] add loading and error states
- [x] add empty states
- [x] add success notifications (toast system)
- [~] review accessibility basics (deferred to Phase 20)
- [~] review responsive layouts (deferred to Phase 20)
- [x] seed demo data (scripts created)
- [x] customer search and filtering implemented
- [x] customer pagination implemented


### Phase 14 - Customer UX Refinement
- [x] hide customer dropdown filters from customer_user views (time logs, reports)
- [x] simplify time logs view for customers (remove Staff column, auto-filter to their customer)
- [x] simplify reports view for customers (remove customer filter, cleaner layout)
- [x] review all pages for customer-appropriate content
- [x] ensure customers cannot see internal-only data
- [x] add customer-friendly empty states and messaging

### Phase 15 - Portal Enhancements
- [x] remove Time Logs from customer navigation (redundant with Reports)
- [x] rename Reports to Time Reports
- [x] enhance report filters (multi-select category, contract, billable, staff)
- [x] create default "On-Demand / Off Contract" contract for customers
- [x] make contract required on time entry
- [x] allow staff to enter time for other staff
- [x] add internal notes to customers, priorities, time logs
- [x] make user profiles editable (first name, last name, title)
- [x] show all users in settings for admin/staff
- [x] create portal branding settings (org name, logo, description)
- [x] add images to customers and priorities
- [x] redesign customer dashboard with company info and contacts

### Phase 16 - Archive Capabilities ✓
- [x] add archived_at timestamps to customers, contracts, contacts
- [x] implement customer archive with cascade (contracts, contacts, priorities, requests)
- [x] implement contract archive functionality
- [x] exclude archived items from dropdowns (time entry, priority, request forms)
- [x] include archived items in reports (historical data preserved)
- [x] add "Show Archived" toggle to customer and contract list views
- [x] prevent login for users of archived customers
- [x] prevent login for contacts with portal_access_enabled = false
- [x] mark priorities/requests as read-only when customer archived
- [x] enforce read-only on archived entities (prevent edits)

### Phase 17 - Contract Types Enhancement ✓
- [x] create contract_types table with behavior flags (tracks_hours, has_hour_limit, is_recurring, supports_rollover)
- [x] add billing fields to contracts (billing_day, hours_per_period, rollover_enabled, rollover_expiration_days, max_rollover_hours, fixed_cost)
- [x] migrate existing contracts from reference_values to contract_types table
- [x] implement hours bucket calculation (total - used, overage warning)
- [x] implement subscription period calculation (based on billing_day 1-28)
- [x] implement rollover logic (use rollover first, expiration tracking, max cap)
- [x] update contract form with conditional fields per contract type
- [x] update contract detail page with type-specific stats (ContractHoursStats component)
- [x] show hours context in time entry form (ContractHoursContext component)
- [x] add overage alerts to reports page (ContractOverageAlerts component)
- [x] add billing model filter to reports (deferred to Phase 20)
- [x] period history display on contract detail (deferred to Phase 20)

### Phase 18 - Audit Logging & Error Handling ✓
- [x] create audit_logs table with change tracking fields
- [x] create database triggers for audited tables
- [x] capture user context in audit records
- [x] create audit log viewer page (admin only)
- [x] add record history component to detail pages
- [x] implement error code system (domain-operation-number format)
- [x] create error handling utilities
- [x] update all server actions with standardized error codes
- [x] create consistent error display components
- [x] add error logging for debugging

### Phase 20 - Validation, Cleanup, Test, and Go-Live Prep
- [ ] Review all deferred items and validate completion
- [ ] Do comprehensive testing of all features. Create automated tests for future testing
- [ ] validate all past changes are 100% complete including any deferred items
- [ ] consolidate all database migrations before go-live (after feature complete, before customer data)
- [ ] prepare staging deployment
- [ ] prepare production deployment checklist
- [ ] configure custom SMTP in Supabase for production email (Magic Link invitations)
- [ ] Configure email templates for invitations and magic links.

**Deferred from Phase 13 - RLS Policy Validation:**
- [ ] Create RLS test scripts for customer_user role restrictions
- [ ] Validate customer_user cannot modify contracts, time entries, contacts
- [ ] Validate customer_user can only view own profile and customer data
- [ ] Fix any RLS policy gaps found during testing

**Deferred from Phase 13 - Accessibility and Responsive Review:**
- [ ] Review color contrast on all pages
- [ ] Add focus management to modals and dialogs
- [ ] Verify ARIA labels on interactive elements
- [ ] Test keyboard navigation on forms
- [ ] Test responsive layout on mobile (375px), tablet (768px), desktop (1280px)

**Deferred from Phase 13 - Final Validation:**
- [ ] Test customer search, filtering, pagination with demo data
- [ ] Verify all loading, error, and empty states display correctly
- [ ] Verify all toast notifications work
- [ ] Test demo user login behavior with show_demo_data toggle 

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
