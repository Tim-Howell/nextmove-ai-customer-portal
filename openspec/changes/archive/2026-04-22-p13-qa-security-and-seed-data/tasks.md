## 1. RLS Policy Validation (Deferred to Phase 20)

- [~] 1.1 Create RLS test script to validate customer_user cannot modify contracts (deferred)
- [~] 1.2 Create RLS test script to validate customer_user cannot modify time entries (deferred)
- [~] 1.3 Create RLS test script to validate customer_user cannot modify customer contacts (deferred)
- [~] 1.4 Create RLS test script to validate customer_user can only view own profile (deferred)
- [~] 1.5 Validate customer_user can create but not update/delete priorities (deferred)
- [~] 1.6 Validate customer_user can create but not update/delete requests (deferred)
- [~] 1.7 Validate customer_user cannot access other customers' data (deferred)
- [~] 1.8 Fix any RLS policy gaps found during testing (deferred)

## 2. Toast Notification System

- [x] 2.1 Install and configure sonner toast component
- [x] 2.2 Add Toaster component to root layout
- [x] 2.3 Create toast utility functions (success, error, info)
- [x] 2.4 Add success toasts to customer CRUD operations
- [x] 2.5 Add success toasts to contract CRUD operations
- [x] 2.6 Add success toasts to time entry CRUD operations
- [x] 2.7 Add success toasts to priority CRUD operations
- [x] 2.8 Add success toasts to request CRUD operations
- [x] 2.9 Add success toasts to archive operations

## 3. Loading State Components

- [x] 3.1 Create TableSkeleton component for list pages
- [x] 3.2 Create CardSkeleton component for dashboard widgets
- [x] 3.3 Add loading.tsx to customers route
- [x] 3.4 Add loading.tsx to contracts route
- [x] 3.5 Add loading.tsx to time-reports route
- [x] 3.6 Add loading.tsx to priorities route
- [x] 3.7 Add loading.tsx to requests route
- [x] 3.8 Add loading.tsx to dashboard route
- [x] 3.9 Add aria-busy attributes for accessibility

## 4. Error State Components

- [x] 4.1 Create ErrorBoundary component with retry functionality
- [x] 4.2 Add error.tsx to customers route
- [x] 4.3 Add error.tsx to contracts route
- [x] 4.4 Add error.tsx to time-reports route
- [x] 4.5 Add error.tsx to priorities route
- [x] 4.6 Add error.tsx to requests route
- [x] 4.7 Add error.tsx to dashboard route
- [x] 4.8 Add global error.tsx to app root

## 5. Empty State Components

- [x] 5.1 Create reusable EmptyState component with icon, title, description, action props
- [x] 5.2 Add empty state to customers list
- [x] 5.3 Add empty state to contracts list
- [x] 5.4 Add empty state to time reports
- [x] 5.5 Add empty state to priorities list
- [x] 5.6 Add empty state to requests list
- [x] 5.7 Add empty state to customer detail (no contracts, no contacts)
- [x] 5.8 Add empty state to dashboard widgets

## 6. Customer Search and Pagination

- [x] 6.1 Add search input component to customers page
- [x] 6.2 Implement debounced search with URL state
- [x] 6.3 Add status filter dropdown to customers page
- [x] 6.4 Create Pagination component
- [x] 6.5 Update customers query to support search, filter, pagination
- [x] 6.6 Add page size of 20 items
- [x] 6.7 Reset to page 1 when search/filter changes
- [x] 6.8 Test URL-based navigation (direct links work)

## 7. Demo Data Seeding

- [x] 7.1 Create demo customers (10 total, 2 archived)
- [x] 7.2 Create demo customer contacts (25 total, 13 with portal access, 2 with login accounts)
- [x] 7.3 Create demo contracts (15 total, all types and statuses)
- [x] 7.4 Create demo time entries (Acme: 40, TechStart: 30, others: 30 - pagination testable)
- [x] 7.5 Create demo priorities (Acme: 25, TechStart: 22, others: spread)
- [x] 7.6 Create demo requests (Acme: 25, TechStart: 22, others: spread)
- [x] 7.7 Ensure all demo records have is_demo = true
- [x] 7.8 Make seed script idempotent (no duplicates on re-run)
- [x] 7.9 Create 2 demo auth accounts in Supabase (demo-acme1@example.com, demo-techstart@example.com)
- [x] 7.10 Document demo credentials in README.md
- [x] 7.11 Add middleware check to block demo user login when show_demo_data is false

## 8. Accessibility and Responsive Review (Deferred to Phase 20)

- [~] 8.1 Review color contrast on all pages (deferred)
- [~] 8.2 Add focus management to modals and dialogs (deferred)
- [~] 8.3 Verify ARIA labels on interactive elements (deferred)
- [~] 8.4 Test keyboard navigation on forms (deferred)
- [~] 8.5 Test responsive layout on mobile (375px) (deferred)
- [~] 8.6 Test responsive layout on tablet (768px) (deferred)
- [~] 8.7 Test responsive layout on desktop (1280px) (deferred)
- [~] 8.8 Fix any responsive issues found (deferred)

## 9. Final Validation (Deferred to Phase 20)

- [~] 9.1 Test customer search with demo data (deferred)
- [~] 9.2 Test customer filtering with demo data (deferred)
- [~] 9.3 Test customer pagination with demo data (deferred)
- [~] 9.4 Verify all loading states display correctly (deferred)
- [~] 9.5 Verify all error states display correctly (deferred)
- [~] 9.6 Verify all empty states display correctly (deferred)
- [~] 9.7 Verify all toast notifications work (deferred)
- [~] 9.8 Test demo user login works when show_demo_data is ON (deferred)
- [~] 9.9 Test demo user login is BLOCKED when show_demo_data is OFF (deferred)
- [~] 9.10 Test real user login is unaffected by show_demo_data toggle (deferred)
- [x] 9.11 Update project.md Phase 13 tasks as complete
