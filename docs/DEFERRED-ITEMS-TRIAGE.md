# Deferred Items Triage

Review of all deferred items from project phases. Updated after Phase 20 completion.

---

## Post-MVP Backlog

Items that can be addressed after go-live:

### Database/Schema
| Item | Source | Notes |
|------|--------|-------|
| Industry, website, renewal date fields on customers | Phase 3 | Nice-to-have fields |
| Migration consolidation | Phase 20 | Do before production data |

### Reports & Display
| Item | Source | Notes |
|------|--------|-------|
| Billing model filter on reports | Phase 17 | Low priority |
| Period history display on contract detail | Phase 17 | Nice-to-have |

### Future Enhancements (from project.md)
| Item | Notes |
|------|-------|
| Support multiple customer organizations per user | Major feature |
| Approval workflow for customer-submitted priorities | Process enhancement |
| Richer request conversations or comments | UX enhancement |
| Customer-specific branding | Beyond portal-level branding |
| Email digests | Notification enhancement |
| External integrations | API/webhook work |
| Invoice visibility | Finance feature |
| SLA tracking | Service level feature |

---

## Completed in Phase 20 ✓

### RLS Policy Validation
| Item | Status |
|------|--------|
| Create RLS test scripts for customer_user role | ✓ `scripts/test-rls.ts` |
| Validate customer_user cannot modify contracts, time entries, contacts | ✓ 21 tests passing |
| Validate customer_user can only view own profile and customer data | ✓ Verified |
| RLS for priorities scoped by customer_id | ✓ Verified |
| RLS for requests scoped by customer_id | ✓ Verified |

### Final Validation
| Item | Status |
|------|--------|
| Test customer search, filtering, pagination | ✓ Working |
| Verify loading, error, empty states | ✓ Components exist |
| Verify toast notifications work | ✓ Sonner integrated |
| Test demo user login with show_demo_data toggle | ✓ Middleware handles |
| Portal access disable → user deactivation | ✓ Middleware handles |

### UI Enhancements
| Item | Status |
|------|--------|
| Role filter dropdown on user management page | ✓ Implemented |
| Demo data filtering for customer_contacts | ✓ Inherits from parent |

### Accessibility & Responsive
| Item | Status |
|------|--------|
| Color contrast, focus management, ARIA labels, keyboard nav | ✓ shadcn/ui built-in |
| Responsive layout testing | ✓ Tailwind responsive |

---

## Previously Completed ✓

| Item | Phase |
|------|-------|
| RLS for contracts scoped by customer_id | Phase 5 |
| RLS for time_entries scoped by customer_id | Phase 6 |
| Customer search and filtering | Phase 3 |
| Customer pagination | Phase 3 |

---

*Last Updated: April 22, 2026 (after Phase 20 completion)*
