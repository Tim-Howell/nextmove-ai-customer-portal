## 1. Database Setup

- [x] 1.1 Create `profiles` table migration with id, email, full_name, role, customer_id, avatar_url, timestamps
- [x] 1.2 Create trigger function to auto-create profile on auth.users insert
- [x] 1.3 Create RLS policies for profiles table (read own, admin read all, update own limited fields)
- [x] 1.4 Create seed script for initial admin user
- [x] 1.5 Run migrations and verify profiles table exists (requires Supabase project connection)

## 2. Authentication Pages

- [x] 2.1 Create `(auth)` route group with minimal layout
- [x] 2.2 Build login page with email/password form using shadcn/ui components
- [x] 2.3 Implement login form submission with Supabase Auth
- [x] 2.4 Build forgot password page with email input
- [x] 2.5 Implement forgot password submission with Supabase Auth
- [x] 2.6 Build reset password page with new password form
- [x] 2.7 Implement reset password submission with Supabase Auth
- [x] 2.8 Add NextMove AI branding (logo, colors) to auth pages
- [x] 2.9 Add form validation and error handling to all auth forms

## 3. Route Protection

- [x] 3.1 Create middleware.ts for auth state checking
- [x] 3.2 Implement redirect to /login for unauthenticated users on protected routes
- [x] 3.3 Implement redirect to /dashboard for authenticated users on auth pages
- [x] 3.4 Configure middleware matcher for protected routes
- [x] 3.5 Test middleware redirects work correctly

## 4. App Shell and Layouts

- [x] 4.1 Create `(portal)` route group with authenticated layout
- [x] 4.2 Create profile fetching utility for server components
- [x] 4.3 Build internal layout component with full navigation sidebar
- [x] 4.4 Build customer layout component with limited navigation sidebar
- [x] 4.5 Build header component with user info and sign out
- [x] 4.6 Implement role-based layout selection in portal layout
- [x] 4.7 Add active state highlighting to navigation items
- [x] 4.8 Implement responsive navigation (mobile hamburger menu)
- [x] 4.9 Apply NextMove AI brand styling to navigation

## 5. Dashboard Placeholder

- [x] 5.1 Create dashboard page at `(portal)/dashboard/page.tsx`
- [x] 5.2 Add placeholder content showing user role and name
- [x] 5.3 Verify dashboard loads after login

## 6. Sign Out Flow

- [x] 6.1 Create sign out server action or API route
- [x] 6.2 Wire sign out button in header to sign out action
- [x] 6.3 Verify sign out clears session and redirects to login

## 7. Final Verification

- [x] 7.1 Test complete login flow (email/password → dashboard)
- [x] 7.2 Test forgot password flow (request → email → reset)
- [x] 7.3 Test route protection (unauthenticated redirect)
- [x] 7.4 Test sign out flow
- [x] 7.5 Verify RLS policies work (user can only read own profile)
- [x] 7.6 Update project.md Phase 0 tasks as complete
- [x] 7.7 Commit all changes with message "feat: complete Phase 1 auth and app foundations"
