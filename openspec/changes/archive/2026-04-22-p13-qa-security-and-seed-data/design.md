## Context

Phase 13 focuses on quality assurance before go-live. The application has all core features implemented (Phases 1-12, 14-18), but needs:
1. Security validation - ensuring RLS policies correctly restrict customer_user access
2. UX polish - loading, error, and empty states throughout the app
3. Demo data - realistic seed data to test search/filter/pagination at scale

Current state:
- RLS policies exist for all tables but need validation testing
- No consistent loading/error/empty state patterns
- Minimal seed data in `supabase/seed.sql`
- Customer list lacks search/filter/pagination

## Goals / Non-Goals

**Goals:**
- Validate all RLS policies enforce correct role boundaries
- Establish consistent UX state patterns (loading, error, empty)
- Create comprehensive demo data for testing
- Add search, filtering, and pagination to customer list
- Add success toast notifications for CRUD operations

**Non-Goals:**
- Automated test suite (deferred to Phase 20)
- Performance optimization
- Advanced analytics or reporting enhancements
- New feature development

## Decisions

### 1. Toast Notification System
**Decision**: Use shadcn/ui's `sonner` toast component (already available in shadcn/ui)

**Rationale**: Consistent with existing component library, minimal setup, good UX patterns built-in.

**Alternatives considered**:
- react-hot-toast: Additional dependency
- Custom implementation: More work, less polished

### 2. Loading State Pattern
**Decision**: Use shadcn/ui Skeleton components with consistent loading wrapper

**Rationale**: Already available in the component library, provides good visual feedback.

**Implementation**:
- Create `<TableSkeleton>` for list pages
- Create `<CardSkeleton>` for dashboard widgets
- Use React Suspense boundaries where appropriate

### 3. Error Boundary Pattern
**Decision**: Create a reusable `<ErrorBoundary>` component with fallback UI

**Rationale**: Catches render errors gracefully, provides user-friendly messaging.

**Implementation**:
- Global error boundary in root layout
- Page-level error boundaries for isolated failures
- Use Next.js `error.tsx` convention

### 4. Empty State Pattern
**Decision**: Create reusable `<EmptyState>` component with icon, message, and optional action

**Rationale**: Consistent empty state messaging improves UX.

**Implementation**:
- Props: `icon`, `title`, `description`, `action` (optional button)
- Use in all list views when data is empty

### 5. Customer Search/Filter/Pagination
**Decision**: Server-side pagination with URL-based state

**Rationale**: Scales with data volume, shareable URLs, works with SSR.

**Implementation**:
- Search: debounced text input filtering by name
- Filter: status dropdown (active/archived)
- Pagination: 20 items per page, URL params for page number

### 6. Demo Data Strategy
**Decision**: Create comprehensive seed.sql with realistic data

**Data volume**:
- 10 customers (mix of active/archived)
- 25 customer contacts (2-3 per customer)
- 15 contracts (mix of types and statuses)
- 100 time entries (spread across contracts)
- 20 priorities (various statuses)
- 30 requests (various statuses)

**Rationale**: Enough data to test pagination (>20 items) and realistic filtering scenarios.

## Risks / Trade-offs

**Risk**: RLS policy gaps may require migration changes
→ **Mitigation**: Test thoroughly in development before applying to production

**Risk**: Demo data may conflict with existing data
→ **Mitigation**: Use `is_demo = true` flag on demo records; seed script checks for existing data

**Risk**: Toast notifications may be missed by users
→ **Mitigation**: Use appropriate duration and positioning; critical errors use persistent toasts

**Risk**: Server-side pagination adds complexity
→ **Mitigation**: Use proven patterns; URL state makes debugging easier
