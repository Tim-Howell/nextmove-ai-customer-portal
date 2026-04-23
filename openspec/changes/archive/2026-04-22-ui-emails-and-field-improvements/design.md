## Context

The NextMove AI Customer Portal is approaching go-live and needs several UX improvements:
- Customer management lacks website field and automatic base contract creation
- Contact management needs billing/POC role designations and simplified onboarding (no email invitations)
- Navigation uses tables everywhere; card views would improve discoverability for customers and priorities
- Priorities lack visual differentiation (icons)
- Authentication emails use Supabase defaults instead of branded templates

Current stack: Next.js 16, TypeScript, Tailwind CSS, shadcn/ui, Supabase Auth, Vercel.

## Goals / Non-Goals

**Goals:**
- Add website URL field to customers with automatic lowercase formatting
- Auto-create base contract when creating new customers
- Add billing and POC contact role designations to customers
- Simplify contact onboarding: auto-confirm, no automatic invitations, manual send option
- Implement card views for Customers and Priorities pages
- Add icon picker for priorities using Lucide icons
- Create branded email templates for magic link, invitation, and password reset

**Non-Goals:**
- Card views for Contacts, Contracts, Time Logs, Requests (remain as lists)
- Custom email sending infrastructure (use Supabase Auth templates)
- Icon upload or custom icons (Lucide library only)

## Decisions

### 1. Website URL Field
**Decision**: Add `website` TEXT column to `customers` table. Format to lowercase on save via server action.
**Rationale**: Simple text field with client-side and server-side lowercase transformation. No URL validation beyond basic format - users may enter partial URLs.

### 2. Base Contract Auto-Creation
**Decision**: Create base contract in `createCustomer` server action after customer insert.
**Rationale**: Ensures every customer has a catch-all contract for ad-hoc hours. Base contract config:
- Name: "{Customer Name} - Base Contract"
- Type: `hours_bucket` (no hour limit)
- Status: Active
- No start/end dates
- `total_hours`: NULL (unlimited)

### 3. Contact Role Designations
**Decision**: Add 4 nullable FK columns to `customers` table pointing to `customer_contacts`:
- `billing_contact_primary_id`
- `billing_contact_secondary_id`
- `poc_primary_id`
- `poc_secondary_id`

**Alternatives Considered**:
- Junction table with role types → Overkill for 4 fixed roles
- JSON field → Loses referential integrity
- Columns on contacts → Customer can only have one contact per role

**Rationale**: Direct FKs are simple, enforce referential integrity, and allow easy querying.

### 4. Contact Auto-Confirm
**Decision**: Set `email_confirm` to true when creating contacts via Supabase Admin API. Remove automatic invitation sending.
**Rationale**: Users will use magic link for first login. Password can be set via "forgot password" flow. Manual "Send Invitation" button available for explicit invites.

### 5. Phone/Email Formatting
**Decision**: 
- Phone: Format as (000)000-0000 using input mask on client, store digits only in DB
- Email: Transform to lowercase on blur and on server save

**Rationale**: Consistent display format while storing clean data.

### 6. Card Views
**Decision**: Create `CustomerCard` and `PriorityCard` components. Use CSS Grid for responsive layout.
**Components**:
- `CustomerCard`: Logo (or placeholder), Name, clickable to detail page
- `PriorityCard`: Icon, Name, Priority Level badge, clickable to detail page

**Rationale**: Cards provide better visual hierarchy and are more scannable than tables for these entities.

### 7. Priority Icons
**Decision**: Add `icon` TEXT column to `priorities` table storing Lucide icon name (e.g., "briefcase", "code", "users").
**Components**:
- `IconPicker`: Grid of common Lucide icons with search, returns icon name
- Dynamic icon rendering using `lucide-react` dynamic import

**Alternatives Considered**:
- Store SVG → Too large, harder to maintain
- Icon component name → Requires mapping, same as storing name

**Rationale**: Storing icon name is lightweight and Lucide provides consistent, high-quality icons.

### 8. Email Templates
**Decision**: Configure Supabase Auth email templates via Dashboard or `config.toml`:
- Magic Link: Branded template with NextMove AI logo and styling
- Invitation: Welcome message with magic link
- Password Reset: Branded reset instructions

**Rationale**: Supabase handles email delivery; we just customize templates. No custom email infrastructure needed.

## Risks / Trade-offs

**[Risk] Base contract creation fails after customer created** → Wrap in transaction or create contract first, then customer. If contract fails, rollback customer creation.

**[Risk] Icon picker performance with many icons** → Limit to ~50 curated icons relevant to business context (projects, tasks, communication, etc.)

**[Risk] Phone formatting varies by country** → Start with US format only. Document as limitation for international expansion.

**[Trade-off] Auto-confirm bypasses email verification** → Acceptable for B2B portal where contacts are added by staff. Magic link provides implicit verification on first use.

**[Trade-off] Card views use more vertical space** → Acceptable trade-off for improved visual hierarchy. Pagination handles large lists.
