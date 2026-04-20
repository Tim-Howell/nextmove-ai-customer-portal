## Context

This is a greenfield Next.js 14+ application with Supabase already configured (Phase 0). The app needs authentication and authorization before any business features can be built. Supabase Auth provides the authentication layer; we need to build the application-level profile/role system on top of it.

**Current state:**
- Next.js App Router project with TypeScript, Tailwind CSS, shadcn/ui
- Supabase client helpers exist in `lib/supabase/`
- No authentication or protected routes yet
- No database tables yet

**Constraints:**
- Must use Supabase Auth (not custom auth)
- Three roles: `admin`, `staff`, `customer_user`
- Customer users must be scoped to exactly one customer
- Internal users (admin/staff) can access all customers

## Goals / Non-Goals

**Goals:**
- Working email/password authentication flow
- Profile table linking auth users to application roles
- Route protection via Next.js middleware
- Role-based layouts with appropriate navigation
- RLS policies enforcing data access at database level
- Seeded admin user for development

**Non-Goals:**
- SSO or social login (explicitly out of scope per project.md)
- Customer invitation flow (Phase 4)
- Customer table creation (Phase 3)
- Email notifications for auth events (future enhancement)

## Decisions

### 1. Profile Table Design
**Decision**: Create a `profiles` table that mirrors `auth.users` with a trigger to auto-create on signup.

```sql
profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL,
  full_name text,
  role text NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'staff', 'customer_user')),
  customer_id uuid REFERENCES customers(id),  -- NULL for internal users
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)
```

**Rationale**: Separating profiles from auth.users allows us to add application-specific fields without touching Supabase's auth schema. The trigger ensures every auth user has a profile.

**Alternatives considered**: 
- Using auth.users metadata only → Limited, can't query/join efficiently
- Separate profiles without trigger → Risk of orphaned auth users without profiles

### 2. Route Structure
**Decision**: Use route groups to separate auth pages from portal pages.

```
app/
├── (auth)/
│   ├── login/page.tsx
│   ├── forgot-password/page.tsx
│   └── reset-password/page.tsx
├── (portal)/
│   ├── layout.tsx          # Authenticated layout with nav
│   ├── dashboard/page.tsx
│   └── ...
└── middleware.ts
```

**Rationale**: Route groups allow different layouts without affecting URL structure. Auth pages need a minimal layout; portal pages need the full app shell.

**Alternatives considered**:
- Flat structure with conditional layouts → Harder to maintain, layout logic scattered

### 3. Middleware Strategy
**Decision**: Use Next.js middleware to check auth state and redirect unauthenticated users.

**Rationale**: Middleware runs on the edge before the page loads, providing fast redirects. Supabase SSR package handles cookie-based session refresh.

**Implementation**:
- Check session in middleware
- Redirect unauthenticated users to `/login`
- Redirect authenticated users away from auth pages to `/dashboard`
- Role checks happen in layouts/pages, not middleware (simpler, more flexible)

**Alternatives considered**:
- Client-side auth checks only → Flash of unauthenticated content, poor UX
- Server-side checks in every page → Repetitive, easy to miss

### 4. Role-Based Layouts
**Decision**: Create separate layout components for internal users vs customer users, selected in the portal layout based on profile role.

**Rationale**: Navigation differs significantly between roles. Internal users see all modules; customer users see a subset scoped to their customer.

**Implementation**:
- `components/layouts/internal-layout.tsx` - Full navigation for admin/staff
- `components/layouts/customer-layout.tsx` - Limited navigation for customer_user
- Portal layout fetches profile and renders appropriate layout

### 5. RLS Policy Approach
**Decision**: Start with simple policies on profiles table; expand as tables are added.

**Profiles RLS**:
- Users can read their own profile
- Admins can read all profiles
- Users can update their own profile (limited fields)

**Rationale**: RLS is the security foundation. Starting simple and expanding ensures we don't over-engineer while maintaining security.

### 6. Initial Admin Seeding
**Decision**: Use a Supabase migration with a seed script that creates an admin user via the Supabase Admin API.

**Rationale**: Ensures a consistent admin exists in all environments. The seed can be run once per environment.

**Implementation**: Seed script in `supabase/seed.sql` or a separate seed function.

## Risks / Trade-offs

- **Risk**: Middleware session refresh may cause edge function cold starts → Mitigation: Supabase SSR is optimized for this; monitor performance
- **Risk**: Customer users without customer_id could access internal routes → Mitigation: Layout checks profile.customer_id; RLS enforces at DB level
- **Risk**: Profile trigger failure leaves auth user without profile → Mitigation: Trigger uses `SECURITY DEFINER` and logs errors; add monitoring
- **Trade-off**: Role stored as text vs enum → Simpler migrations, slightly less type safety at DB level; TypeScript types provide app-level safety
