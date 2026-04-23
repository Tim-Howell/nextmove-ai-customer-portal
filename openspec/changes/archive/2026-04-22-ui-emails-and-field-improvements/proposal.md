## Why

The portal needs several UX improvements before go-live: better customer/contact management with proper billing and POC designations, automatic base contract creation, improved card-based navigation, icon support for priorities, and professional email templates for authentication flows.

## What Changes

**Add Customers**
- Add website URL field to customer profile (auto-formatted to lowercase)
- Auto-create a "Base Contract" (ad-hoc/on-demand hours) when creating a customer - active, no expiry, no hour limits

**Customer Profile Page**
- Show Active Contracts section with "Add Contract" button (below Contacts)
- Show Active Priorities section with "Add Priority" button (below Contracts)
- Show Active Requests section with "Add Request" button (below Priorities)

**Customer Contacts - Billing & POC Designations**
- Add contact role selections: Billing (Primary/Secondary), Point of Contact (Primary/Secondary)
- Display designated contacts prominently on customer profile page

**Add/Manage Contacts**
- Remove "Invitation will be sent" text from Phase 4
- Do not send invitation automatically - manual send or external communication
- Auto-confirm users so magic link works immediately (no invitation required)
- Format phone numbers as (000)000-0000
- Format emails as lowercase
- "Send Invitation" button always visible for manual triggering

**Card Views**
- Customers page: Card view showing Customer Name and Logo
- Priorities page: Card view showing Icon, Priority Name, Priority Level
- Contacts, Contracts, Time Logs, Requests remain as list views

**Priorities - Icon Framework**
- Implement icon picker component using Lucide icons
- Store selected icon with priority record
- Display icon in priority cards and detail views

**Email Templates & Auth Fixes**
- Magic Link authentication email - professional branded design with NextMove AI logo
- Email invitation email - welcoming branded design
- Password reset email - branded design with clear instructions
- Fix password reset flow (currently redirects to login instead of reset page)
- Configure Resend for custom domain email sending

**Form Spacing Fix**
- Fix demo data checkbox spacing on all create/edit forms (currently cramped at bottom)

## Capabilities

### New Capabilities
- `customer-website-field`: Website URL field on customers with lowercase formatting
- `base-contract-auto-create`: Automatic creation of base contract when adding customers
- `customer-contact-roles`: Billing and POC contact designations on customers
- `contact-auto-confirm`: Auto-confirm contacts without requiring email invitation
- `card-views`: Card-based layouts for Customers and Priorities pages
- `priority-icons`: Icon picker and storage for priorities using Lucide icons
- `email-templates`: Branded email templates for magic link, invitation, and password reset
- `password-reset-fix`: Fix password reset flow to properly redirect to reset page
- `form-spacing`: Fix demo data checkbox spacing on create/edit forms

### Modified Capabilities
- None (all changes are additive)

## Impact

**Database**
- `customers` table: Add `website` column
- `priorities` table: Add `icon` column
- `customers` table: Add `billing_contact_primary_id`, `billing_contact_secondary_id`, `poc_primary_id`, `poc_secondary_id` columns

**Components**
- New: CustomerCard, PriorityCard, IconPicker components
- Modified: CustomerForm, ContactForm, PriorityForm
- Modified: Customer detail page layout

**Email**
- New email templates in Supabase Auth configuration or custom email sending

**Server Actions**
- Modified: createCustomer (add base contract creation)
- Modified: createContact (auto-confirm, format phone/email)
