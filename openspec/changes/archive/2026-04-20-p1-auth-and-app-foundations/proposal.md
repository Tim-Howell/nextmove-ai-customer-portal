## Why

The portal needs authentication and role-based access before any features can be built. Users must be able to log in securely, and the system must enforce that customer users only see their own data while internal staff can access everything. This phase establishes the security foundation and app shell that all subsequent phases depend on.

## What Changes

- Implement Supabase Auth with email/password authentication
- Create login, forgot password, and reset password pages
- Build `profiles` table linking Supabase auth users to application roles
- Implement middleware for route protection based on authentication state
- Create role-based layouts (internal vs customer navigation)
- Implement Row Level Security (RLS) policies for the profiles table
- Seed an initial admin user for development/testing
- Build the app shell with navigation sidebar and header

## Capabilities

### New Capabilities
- `auth-flow`: Email/password login, logout, forgot password, and reset password flows using Supabase Auth
- `user-profiles`: Profiles table linking auth users to roles (admin, staff, customer_user) with customer association for customer users
- `route-protection`: Middleware and layout guards enforcing authentication and role-based access
- `app-shell`: Main application layout with role-aware navigation sidebar and header

### Modified Capabilities
(none - this is foundational work)

## Impact

- **Database**: Creates `profiles` table with RLS policies; links to Supabase `auth.users`
- **Code**: Adds `app/(auth)/` routes for login/password flows, `app/(portal)/` routes for authenticated content, middleware for protection
- **Dependencies**: Uses existing `@supabase/ssr` client helpers from Phase 0
- **Systems**: Requires Supabase project to be configured with auth enabled
