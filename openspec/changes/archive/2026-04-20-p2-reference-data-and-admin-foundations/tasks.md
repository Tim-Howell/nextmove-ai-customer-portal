## 1. Database Setup

- [x] 1.1 Create `reference_values` table migration with id, type, value, label, sort_order, is_active, is_default, is_demo, timestamps
- [x] 1.2 Create `system_settings` table migration with key, value (jsonb), updated_at
- [x] 1.3 Add `is_demo` column to `customers` table
- [x] 1.4 Add `is_demo` column to `customer_contacts` table
- [x] 1.5 Add `is_active` column to `profiles` table for user deactivation
- [x] 1.6 Create RLS policies for reference_values (authenticated read, admin write)
- [x] 1.7 Create RLS policies for system_settings (admin only)
- [x] 1.8 Create seed migration for default reference values
- [x] 1.9 Run migrations and verify tables exist

## 2. Reference Data Management

- [x] 2.1 Create TypeScript types for reference values
- [x] 2.2 Create Zod schema for reference value validation
- [x] 2.3 Create `/settings` layout with admin-only access
- [x] 2.4 Create `/settings/reference-data` page with reference value list
- [x] 2.5 Build reference value table grouped by type
- [x] 2.6 Build create reference value form/modal
- [x] 2.7 Build edit reference value form/modal
- [x] 2.8 Implement create/update/deactivate server actions
- [x] 2.9 Add sort order drag-and-drop or manual input

## 3. User Management

- [x] 3.1 Create `/settings/users` page with internal user list
- [x] 3.2 Build user table with name, email, role, status columns
- [ ] 3.3 Build role filter dropdown (deferred - minor enhancement)
- [x] 3.4 Create `/settings/users/invite` page with invite form
- [x] 3.5 Implement invite user server action (sends Magic Link)
- [x] 3.6 Build edit user role modal
- [x] 3.7 Implement update role server action with self-edit prevention
- [x] 3.8 Build deactivate/reactivate user toggle
- [x] 3.9 Implement deactivate user server action with self-deactivate prevention

## 4. Admin Settings

- [x] 4.1 Create `/settings` dashboard page
- [x] 4.2 Build settings card layout with links to sub-pages
- [x] 4.3 Add demo data visibility toggle to settings page
- [x] 4.4 Implement get/set system setting server actions
- [x] 4.5 Create helper function to check demo data visibility setting

## 5. Demo Data Infrastructure

- [x] 5.1 Update customer queries to filter by is_demo based on setting
- [ ] 5.2 Update customer_contacts queries to filter by is_demo (deferred - contacts inherit from customer)
- [x] 5.3 Add is_demo checkbox to customer create/edit forms (admin only)
- [x] 5.4 Add visual indicator for demo data records in lists

## 6. Magic Link Authentication

- [x] 6.1 Update login page to show Magic Link form by default
- [x] 6.2 Add "Sign in with password" toggle link
- [x] 6.3 Implement send Magic Link server action using Supabase signInWithOtp
- [x] 6.4 Create Magic Link sent confirmation UI
- [x] 6.5 Handle Magic Link callback in auth flow
- [x] 6.6 Add "Use Magic Link instead" link to password form
- [x] 6.7 Update user invite to use Magic Link

## 7. Navigation Updates

- [x] 7.1 Add "Settings" link to sidebar for admin users
- [x] 7.2 Create settings sub-navigation (General, Reference Data, Users)
- [x] 7.3 Hide settings link for non-admin users

## 8. Final Verification

- [x] 8.1 Test reference data CRUD operations
- [x] 8.2 Test user invite flow with Magic Link
- [x] 8.3 Test role change and deactivation
- [x] 8.4 Test demo data toggle visibility
- [x] 8.5 Test Magic Link login flow
- [x] 8.6 Test password fallback login
- [x] 8.7 Update project.md Phase 2 tasks as complete
- [x] 8.8 Commit all changes with message "feat: complete Phase 2 reference data and admin foundations"
