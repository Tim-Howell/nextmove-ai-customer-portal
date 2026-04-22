# Deferred Items Triage - Phase 20

Review of all deferred items with categorization for go-live.

## Categories
- **Must Fix**: Required for go-live
- **Nice to Have**: Can ship without, add to backlog
- **Won't Fix**: Explicitly deprioritize

---

## Must Fix (Required for Go-Live)

### RLS Policy Validation (Deferred from Phase 13)
| Item | Status | Notes |
|------|--------|-------|
| Create RLS test scripts for customer_user role | Pending | Task 2.1 |
| Validate customer_user cannot modify contracts, time entries, contacts | Pending | Tasks 2.2-2.4 |
| Validate customer_user can only view own profile and customer data | Pending | Tasks 2.5-2.6 |
| Fix any RLS policy gaps found | Pending | Task 2.7 |
| RLS for priorities scoped by customer_id | Pending | Verify in RLS testing |
| RLS for requests scoped by customer_id | Pending | Verify in RLS testing |

### Final Validation (Deferred from Phase 13)
| Item | Status | Notes |
|------|--------|-------|
| Test customer search, filtering, pagination | Pending | Task 1.3 |
| Verify loading, error, empty states | Pending | Tasks 6.1-6.3 |
| Verify toast notifications work | Pending | Task 6.4 |
| Test demo user login with show_demo_data toggle | Pending | Task 1.4 |
| Portal access disable → user deactivation | Pending | Task 1.5 |

---

## Nice to Have (Post Go-Live Backlog)

### From Phase 2
| Item | Reason |
|------|--------|
| Role filter dropdown on user management page | Minor enhancement, users can scroll |
| Demo data filtering for customer_contacts | Contacts inherit from parent customer - works correctly |

### From Phase 3
| Item | Reason |
|------|--------|
| Industry, website, renewal date fields on customers | Nice-to-have fields, not blocking |

### Accessibility (Deferred from Phase 13)
| Item | Reason |
|------|--------|
| Review color contrast on all pages | Important but not blocking MVP |
| Add focus management to modals and dialogs | Important but not blocking MVP |
| Verify ARIA labels on interactive elements | Important but not blocking MVP |
| Test keyboard navigation on forms | Important but not blocking MVP |

### Responsive Design (Deferred from Phase 13)
| Item | Reason |
|------|--------|
| Test mobile layout (375px) | Primary use case is desktop |
| Test tablet layout (768px) | Primary use case is desktop |
| Test desktop layout (1280px) | Should verify this works |

---

## Won't Fix (Explicitly Deprioritized)

| Item | Reason |
|------|--------|
| Billing model filter on reports | Low priority, can add later |
| Period history display on contract detail | Nice-to-have, not MVP |

---

## Already Completed ✓

| Item | Status |
|------|--------|
| RLS for contracts scoped by customer_id | ✓ Completed in Phase 5 |
| RLS for time_entries scoped by customer_id | ✓ Completed in Phase 6 |
| Customer search and filtering | ✓ Working with demo data |
| Customer pagination | ✓ Working with demo data |

---

## Summary

**Must Fix Before Go-Live:** 12 items (covered in Phase 20 tasks)
**Nice to Have (Backlog):** 9 items
**Won't Fix:** 2 items
**Already Complete:** 4 items

---

*Last Updated: April 22, 2026*
