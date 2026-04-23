## 1. Database Schema Updates

- [x] 1.1 Add `website` column to `customers` table (TEXT, nullable)
- [x] 1.2 Add `icon` column to `priorities` table (TEXT, nullable)
- [x] 1.3 Add contact role columns to `customers` table: `billing_contact_primary_id`, `billing_contact_secondary_id`, `poc_primary_id`, `poc_secondary_id` (UUID FKs to customer_contacts, nullable)
- [x] 1.4 Create migration file for all schema changes

## 2. Customer Website Field

- [x] 2.1 Add website field to CustomerForm component with lowercase formatting on blur
- [x] 2.2 Update createCustomer server action to save website (lowercase)
- [x] 2.3 Update updateCustomer server action to save website (lowercase)
- [x] 2.4 Display website as clickable link on customer detail page
- [x] 2.5 Update Zod validation schema for customer with website field

## 3. Base Contract Auto-Creation

- [x] 3.1 Create getActiveContractStatus helper to get "active" status ID
- [x] 3.2 Create getHoursBucketContractType helper to get "hours_bucket" type ID
- [x] 3.3 Update createCustomer server action to auto-create base contract after customer insert
- [x] 3.4 Add error handling and rollback if base contract creation fails
- [x] 3.5 Test base contract appears in customer's contracts list

## 4. Customer Contact Role Designations

- [x] 4.1 Add contact role selection dropdowns to CustomerForm (Billing Primary/Secondary, POC Primary/Secondary)
- [x] 4.2 Fetch customer contacts for dropdown options
- [x] 4.3 Update createCustomer and updateCustomer to save contact role IDs
- [x] 4.4 Display designated contacts on customer detail page in Billing and POC sections
- [x] 4.5 Update Zod validation schema for customer with contact role fields

## 5. Contact Auto-Confirm and Formatting

- [x] 5.1 Update createContact server action to auto-confirm email via Supabase Admin API
- [x] 5.2 Remove automatic invitation email sending from createContact
- [x] 5.3 Remove "Invitation will be sent" text from ContactForm
- [x] 5.4 Add phone number input mask component for (000)000-0000 format
- [x] 5.5 Add email lowercase formatting on blur in ContactForm
- [x] 5.6 Store phone as digits only, email as lowercase in server action
- [x] 5.7 Add "Send Invitation" button to contact detail/edit page
- [x] 5.8 Implement sendInvitation server action to manually send invitation email

## 6. Customer Profile Page Enhancements

- [x] 6.1 Add Active Contracts section below Contacts with "Add Contract" button
- [x] 6.2 Add Active Priorities section below Contracts with "Add Priority" button
- [x] 6.3 Add Active Requests section below Priorities with "Add Request" button
- [x] 6.4 Implement getActiveContracts, getActivePriorities, getActiveRequests queries for customer
- [x] 6.5 Add customerId query param support to contract/priority/request new pages for pre-selection

## 7. Card View Components

- [x] 7.1 Create CustomerCard component (logo/placeholder, name, clickable)
- [x] 7.2 Create PriorityCard component (icon, name, priority level badge, clickable)
- [x] 7.3 Create responsive grid layout component for cards
- [x] 7.4 Update Customers page to use CustomerCard grid instead of table
- [x] 7.5 Update Priorities page to use PriorityCard grid instead of table
- [x] 7.6 Ensure card views work for both admin and customer users

## 8. Priority Icon Framework

- [x] 8.1 Create curated list of ~50 Lucide icons relevant to business context
- [x] 8.2 Create IconPicker component with grid display and search
- [x] 8.3 Create DynamicIcon component to render icon by name
- [x] 8.4 Add IconPicker to PriorityForm
- [x] 8.5 Update createPriority and updatePriority to save icon name
- [x] 8.6 Display icon on PriorityCard, priority detail page, and lists
- [x] 8.7 Implement default icon (flag) for priorities without selection

## 9. Email Templates & Auth Fixes

- [x] 9.1 Design magic link email template HTML with NextMove AI branding (logo, professional copy, clear CTA)
- [x] 9.2 Design invitation email template HTML with NextMove AI branding (welcoming message, portal intro)
- [x] 9.3 Design password reset email template HTML with NextMove AI branding (clear instructions, security notice)
- [x] 9.4 Fix password reset flow - ensure redirect goes to reset-password page, not login
- [x] 9.5 Configure Resend for custom domain email sending (from nextmoveaiservices.com)
- [x] 9.6 Configure Supabase Auth to use custom email templates
- [x] 9.7 Test all email templates render correctly and links work

## 10. Form Spacing Fix

- [x] 10.1 Identify all forms with demo data checkbox (CustomerForm, AddReferenceValueButton, EditReferenceValueDialog)
- [x] 10.2 Add proper spacing (margin-top) above demo data checkbox section
- [x] 10.3 Ensure consistent spacing across all forms

## 11. Testing and Cleanup

- [x] 11.1 Test customer creation with website and auto base contract
- [x] 11.2 Test contact creation with auto-confirm and formatting
- [x] 11.3 Test contact role assignments on customer
- [x] 11.4 Test card views on Customers and Priorities pages
- [x] 11.5 Test icon picker and icon display on priorities
- [x] 11.6 Test all email templates (magic link, invitation, password reset)
- [x] 11.7 Test password reset flow end-to-end
- [x] 11.8 Verify form spacing on all create/edit forms
- [x] 11.9 Update any affected E2E tests
