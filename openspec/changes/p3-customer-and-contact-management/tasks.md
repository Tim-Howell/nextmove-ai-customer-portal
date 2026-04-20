## 1. Database Setup

- [x] 1.1 Create `customers` table migration with id, name, status, primary_contact_id, secondary_contact_id, notes, timestamps
- [x] 1.2 Create `customer_contacts` table migration with id, customer_id, full_name, title, email, phone, is_active, portal_access_enabled, notes, timestamps
- [x] 1.3 Add foreign key from `profiles.customer_id` to `customers.id`
- [x] 1.4 Create RLS policies for customers table (internal read/write all, customer_user read own)
- [x] 1.5 Create RLS policies for customer_contacts table (internal read/write all, customer_user read own customer's contacts)
- [x] 1.6 Create indexes for customer_id lookups
- [x] 1.7 Run migrations and verify tables exist

## 2. Customer List Page

- [x] 2.1 Create `/customers` route with server component
- [x] 2.2 Build customer list table with name, status, primary contact columns
- [x] 2.3 Add search input for filtering by customer name
- [x] 2.4 Add status filter dropdown (all, active, inactive)
- [x] 2.5 Implement pagination for customer list
- [x] 2.6 Add "New Customer" button linking to create form

## 3. Customer Create/Edit Forms

- [x] 3.1 Create Zod schema for customer validation
- [x] 3.2 Build customer form component with name, status, primary/secondary contact selects, notes
- [x] 3.3 Create `/customers/new` page with create form
- [x] 3.4 Implement create customer server action
- [x] 3.5 Create `/customers/[id]/edit` page with edit form
- [x] 3.6 Implement update customer server action
- [x] 3.7 Add form validation and error handling

## 4. Customer Detail Page

- [x] 4.1 Create `/customers/[id]` route with server component
- [x] 4.2 Build customer detail header with name, status, edit button
- [x] 4.3 Display assigned NextMove AI contacts (primary/secondary)
- [x] 4.4 Display customer notes section
- [x] 4.5 Build customer contacts table within detail page
- [x] 4.6 Add "Add Contact" button linking to contact create form
- [x] 4.7 Handle 404 for invalid customer id

## 5. Customer Contact Forms

- [x] 5.1 Create Zod schema for contact validation
- [x] 5.2 Build contact form component with full_name, title, email, phone, is_active, portal_access_enabled, notes
- [x] 5.3 Create `/customers/[id]/contacts/new` page with create form
- [x] 5.4 Implement create contact server action
- [x] 5.5 Create `/customers/[id]/contacts/[contactId]/edit` page with edit form
- [x] 5.6 Implement update contact server action
- [x] 5.7 Implement delete contact server action with confirmation

## 6. Customer Deletion

- [x] 6.1 Add delete button to customer detail page (admin only)
- [x] 6.2 Build delete confirmation dialog
- [x] 6.3 Implement delete customer server action
- [x] 6.4 Verify cascade deletion of contacts

## 7. Access Control

- [x] 7.1 Add role check to customer routes (redirect customer_user to dashboard)
- [x] 7.2 Verify RLS policies block customer_user from other customers' data
- [x] 7.3 Hide delete button for non-admin users

## 8. Final Verification

- [x] 8.1 Test customer CRUD operations
- [x] 8.2 Test contact CRUD operations
- [ ] 8.3 Test search and filtering (deferred to Phase 13 with demo data)
- [ ] 8.4 Test pagination (deferred to Phase 13 with demo data)
- [x] 8.5 Test access control for different roles
- [x] 8.6 Update project.md Phase 3 tasks as complete
- [x] 8.7 Commit all changes with message "feat: complete Phase 3 customer and contact management"
