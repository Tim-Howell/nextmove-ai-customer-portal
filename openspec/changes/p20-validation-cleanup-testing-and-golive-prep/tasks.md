## 1. Deferred Items Review

- [x] 1.1 Review all deferred items from project.md and categorize as Must Fix / Nice to Have / Won't Fix
- [x] 1.2 Address role filter dropdown on user management page (deferred from Phase 2)
- [x] 1.3 Validate customer search, filtering, pagination works correctly
- [x] 1.4 Validate demo user login behavior with show_demo_data toggle
- [x] 1.5 Test portal access disable → user deactivation flow

## 2. RLS Validation

- [x] 2.1 Create RLS test script (`scripts/test-rls.ts`)
- [x] 2.2 Test customer_user cannot modify contracts
- [x] 2.3 Test customer_user cannot modify time entries
- [x] 2.4 Test customer_user cannot modify customer contacts
- [x] 2.5 Test customer_user can only view own customer data
- [x] 2.6 Test cross-customer data access is blocked
- [x] 2.7 Fix any RLS policy gaps found during testing

## 3. Playwright E2E Testing Setup

- [x] 3.1 Install Playwright and configure for Next.js
- [x] 3.2 Create test fixtures for admin, staff, and customer_user authentication
- [x] 3.3 Create base test utilities and helpers

## 4. Admin E2E Tests

- [x] 4.1 Create admin authentication tests (login, logout, password reset)
- [x] 4.2 Create customer management tests (create, edit, archive)
- [x] 4.3 Create contract management tests (all contract types)
- [x] 4.4 Create time entry tests
- [x] 4.5 Create settings page tests

## 5. Customer Portal E2E Tests

- [x] 5.1 Create customer authentication tests
- [x] 5.2 Create customer dashboard tests
- [x] 5.3 Create customer request submission tests
- [x] 5.4 Create data isolation tests (cannot access other customer data)
- [x] 5.5 Create restricted access tests (cannot access admin pages)

## 6. UX States Validation

- [x] 6.1 Validate all loading states display correctly
- [x] 6.2 Validate all error boundaries work with retry
- [x] 6.3 Validate all empty states display with create actions
- [x] 6.4 Validate all toast notifications work

## 7. Accessibility Review

- [x] 7.1 Review color contrast on all pages
- [x] 7.2 Add focus management to modals and dialogs
- [x] 7.3 Verify ARIA labels on interactive elements
- [x] 7.4 Test keyboard navigation on forms

## 8. Responsive Design Review

- [x] 8.1 Test mobile layout (375px)
- [x] 8.2 Test tablet layout (768px)
- [x] 8.3 Test desktop layout (1280px)
- [x] 8.4 Fix any responsive issues found

## 9. Migration Consolidation

- [ ] 9.1 Export current schema from Supabase
- [ ] 9.2 Create consolidated baseline migration file
- [ ] 9.3 Archive original migration files
- [ ] 9.4 Test consolidated migration on fresh Supabase project
- [ ] 9.5 Verify application works with fresh database

## 10. Production Configuration

- [ ] 10.1 Configure custom SMTP in Supabase
- [ ] 10.2 Create branded email templates (magic link, invitation, password reset)
- [ ] 10.3 Update .env.example with all required variables
- [ ] 10.4 Verify all Vercel environment variables are set
- [ ] 10.5 Create production deployment checklist document

## 11. Final Cleanup

- [ ] 11.1 Remove any unused code or files
- [ ] 11.2 Update README with final documentation
- [ ] 11.3 Update AGENTS.md to reflect Phase 20 completion
- [ ] 11.4 Final commit and deployment verification
