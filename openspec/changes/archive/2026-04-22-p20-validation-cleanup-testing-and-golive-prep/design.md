## Context

The NextMove AI Customer Portal has completed all feature development (Phases 1-18). The application is deployed on Vercel with Supabase backend. Several items were deferred during development for Phase 20 validation:

- RLS policy validation for customer_user role
- Accessibility and responsive design review
- Final UI/UX state validation
- Migration consolidation for production

Current state:
- 20+ migration files in `supabase/migrations/`
- Manual testing scripts in `docs/TESTING-*.md`
- No automated E2E tests
- Production SMTP not configured

## Goals / Non-Goals

**Goals:**
- Validate all deferred items are complete or explicitly deprioritized
- Create automated Playwright tests for critical flows
- Consolidate migrations into clean baseline
- Configure production email (SMTP + templates)
- Create production deployment checklist
- Ensure application is ready for real customer onboarding

**Non-Goals:**
- New feature development
- Major refactoring
- Performance optimization (unless critical issues found)
- Mobile app development

## Decisions

### 1. Testing Framework: Playwright
**Decision**: Use Playwright for E2E testing
**Rationale**: 
- Built-in support for multiple browsers
- Excellent TypeScript support
- Works well with Next.js
- Can test both admin and customer flows with different auth contexts
**Alternatives Considered**:
- Cypress: More popular but heavier, Playwright is faster
- Jest + Testing Library: Good for unit tests but not E2E

### 2. Migration Consolidation Approach
**Decision**: Create a single consolidated migration file from current schema
**Rationale**:
- Cleaner production deployment
- Easier to understand schema at a glance
- Reduces migration execution time
**Process**:
1. Export current schema from Supabase
2. Create single `00000000000000_baseline.sql`
3. Archive old migrations (don't delete for reference)
4. Test on fresh Supabase project

### 3. Test Organization
**Decision**: Organize tests by user role (admin vs customer)
**Rationale**:
- Matches manual testing scripts structure
- Clear separation of concerns
- Can run role-specific tests independently
**Structure**:
```
tests/
  e2e/
    admin/
      auth.spec.ts
      customers.spec.ts
      contracts.spec.ts
      ...
    customer/
      auth.spec.ts
      dashboard.spec.ts
      requests.spec.ts
      ...
  fixtures/
    auth.ts
```

### 4. Deferred Items Triage
**Decision**: Review each deferred item and categorize as:
- **Must Fix**: Critical for go-live
- **Nice to Have**: Can ship without, add to backlog
- **Won't Fix**: Explicitly deprioritize with reason

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Migration consolidation breaks something | Test on fresh Supabase project first; keep original migrations archived |
| E2E tests are flaky | Use Playwright's built-in retry and wait mechanisms; avoid time-based waits |
| SMTP configuration issues | Test with Supabase's email preview first; have fallback to magic link |
| Missed deferred items | Systematic review of project.md and all phase documentation |

## Open Questions

1. **SMTP Provider**: Use Supabase's built-in SMTP or external provider (Resend, SendGrid)?
   - Recommendation: Start with Supabase built-in, migrate later if needed

2. **Test Data Strategy**: Use seeded demo data or create test-specific fixtures?
   - Recommendation: Use existing demo data seeding scripts for consistency

3. **CI/CD Integration**: Run Playwright tests on every PR or just main?
   - Recommendation: Run on main initially, expand to PRs once stable
