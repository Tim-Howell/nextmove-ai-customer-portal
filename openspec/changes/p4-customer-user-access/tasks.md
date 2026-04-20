## 1. Database Setup

- [x] 1.1 Add `user_id` column to `customer_contacts` table (references auth.users)
- [x] 1.2 Create `customer_invitations` table for tracking invitations
- [x] 1.3 Create RLS policies for customer_invitations (admin/staff can manage)
- [x] 1.4 Update customer_contacts RLS to allow customer users to read their own contact
- [x] 1.5 Run migrations and verify

## 2. Invitation Flow

- [x] 2.1 Create TypeScript types for customer invitations
- [x] 2.2 Create server action to send customer invitation (Magic Link)
- [x] 2.3 Create server action to check invitation status
- [x] 2.4 Create server action to resend invitation
- [x] 2.5 Update auth callback to handle customer invitation acceptance
- [x] 2.6 Create profile with customer_user role on invitation acceptance
- [x] 2.7 Link contact.user_id on invitation acceptance

## 3. Contact Portal Access UI

- [x] 3.1 Add invitation status display to contact detail page
- [x] 3.2 Add "Send Invitation" button for eligible contacts
- [x] 3.3 Add "Resend Invitation" button for pending/expired invitations
- [x] 3.4 Show portal access status (Not Invited, Pending, Active)
- [ ] 3.5 Handle portal access toggle to deactivate user when disabled

## 4. Customer Dashboard

- [x] 4.1 Create customer dashboard component
- [x] 4.2 Add welcome message with customer name
- [x] 4.3 Add active contracts count widget (placeholder until Phase 5)
- [x] 4.4 Add recent time entries widget (placeholder until Phase 6)
- [x] 4.5 Add open priorities count widget (placeholder until Phase 7)
- [x] 4.6 Add quick action links (Submit Request, View Contracts)
- [x] 4.7 Update dashboard page to render customer vs internal dashboard based on role

## 5. Customer Data Scoping

- [ ] 5.1 Update RLS policies for contracts to scope by customer_id (deferred to Phase 5)
- [ ] 5.2 Update RLS policies for time_entries to scope by customer_id (deferred to Phase 6)
- [ ] 5.3 Update RLS policies for priorities to scope by customer_id (deferred to Phase 7)
- [ ] 5.4 Update RLS policies for requests to scope by customer_id (deferred to Phase 8)
- [x] 5.5 Test customer cannot access other customer's data via direct URL

## 6. Navigation Scoping

- [x] 6.1 Update sidebar to hide "Customers" for customer_user role
- [x] 6.2 Update sidebar to hide "Settings" for customer_user role (already done)
- [x] 6.3 Update sidebar to show customer-appropriate links
- [x] 6.4 Add customer name to header for customer users

## 7. Final Verification

- [x] 7.1 Test invitation flow end-to-end (rate limit issue - manual setup works)
- [x] 7.2 Test customer login and dashboard display
- [x] 7.3 Test customer cannot access /customers route
- [x] 7.4 Test customer cannot access other customer's data
- [ ] 7.5 Test portal access disable deactivates user (deferred)
- [x] 7.6 Update project.md Phase 4 tasks as complete
- [x] 7.7 Commit all changes with message "feat: complete Phase 4 customer user access"
