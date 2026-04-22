# NextMove AI Admin Portal Test Report

## Executive summary

I tested the NextMove AI portal from the perspective of an authenticated **admin user** using the provided account. The review covered authentication, route protection, dashboard navigation, customers, contracts, customer detail access, time logs, priorities, requests, reports, settings, staff users, customer users, and a limited set of **controlled live write-path tests**.

Overall, the admin portal shows a strong structural foundation. Several areas are already useful and close to production-ready, especially **contracts**, **time reporting**, **settings navigation**, and broad module-to-module routing. However, the system still contains several high-impact defects that would materially affect day-to-day administration. The most serious issues are **cross-surface data inconsistencies**, **missing attribution fields**, a likely **broken Customers list query/render path**, and at least one confirmed **admin create-form submission defect** in Priorities.

| Area | Overall assessment | Notes |
| --- | --- | --- |
| Authentication and access control | Strong | Valid login, invalid password handling, logout, and protected-route redirects worked correctly. |
| Dashboard and navigation | Strong | Admin dashboard loaded and routed correctly into modules. |
| Customers | Weak | Customer list appears broken or disconnected from actual records. |
| Contracts | Strong with data-quality gaps | Contract list/filter/detail views work, but staff attribution is blank in places where it matters. |
| Time Logs | Moderate | Rich filtering and data volume, but blank staff attribution undermines admin usefulness. |
| Priorities | Moderate to weak | Read views are promising, but create flow appears functionally broken. |
| Requests | Moderate | Core workflow is present, but submitter attribution is missing. |
| Reports | Strong with logic/data issues | Good filtering and summary design, but staff data is missing and over-limit metrics may be wrong. |
| Settings and user management | Moderate | Navigation works, but some data surfaces are inconsistent or incomplete. |

## Scope and method

The test included both **non-destructive review** and **controlled live admin write testing** after explicit permission was provided. I intentionally avoided risky or irreversible actions such as broad data deletion, uncontrolled invitations, or destructive account changes. Write-path testing focused on a temporary create attempt in Priorities and a reversible configuration toggle in General Settings.

| Test type | Coverage |
| --- | --- |
| Authentication | Valid login, invalid password, logout, protected route redirect, reset entry point |
| Read-only admin workflows | Dashboard, customers, contracts, customer detail, time logs, priorities, requests, reports, settings |
| Controlled write actions | Priority create attempt, settings toggle and restore |

## Confirmed findings

### 1. Authentication and route protection are functioning correctly

The admin sign-in experience worked as expected with the provided credentials. Invalid-password handling returned a clear **Invalid email or password** message without leaking account details. Logging out returned the session to the sign-in page, and a direct attempt to revisit the protected dashboard route after logout redirected back to login.

This area is one of the stronger parts of the system and appears production-ready from a core access-control standpoint.

### 2. The dashboard is structurally sound and routes correctly into admin workflows

The admin dashboard loaded successfully and displayed the expected summary cards and quick-action areas. Navigation from the dashboard into downstream modules worked, which indicates the dashboard is correctly wired into the broader admin experience.

The issue is not overall navigation; rather, the issue is that some destination modules contain inconsistent or incomplete data.

### 3. The Customers list appears materially broken, even though customer records clearly exist

This is one of the most important defects found during testing.

The **Customers** page displayed **No customers found**, despite the dashboard indicating **8 active customers**. In contrast, contracts loaded correctly, and a linked customer detail page for **Acme Corporation** opened successfully from a contract detail page. That customer detail page contained real customer data and active contact/portal-access information.

This strongly indicates a defect in the **customer list query, filter state, tenant scoping, or render logic**, not an absence of underlying records.

| Symptom | Evidence | Likely interpretation |
| --- | --- | --- |
| Dashboard shows active customers | Dashboard summary card rendered customer count | Underlying customer records exist |
| Customers page shows empty state | Customers list said no customers found | List query/render path is broken |
| Customer detail route works | Linked direct route opened real customer record | Records are present but not surfacing in list view |

### 4. Contract views are strong, but operational attribution is incomplete

The **Contracts** area is one of the better parts of the admin portal. The list loads, filters work, and contract detail pages are data-rich. The detail page tested contained useful information such as contract type, status, allocation, usage, rollover, billing details, documents, and time-entry history.

However, a serious data-quality issue appears in the associated operational data: the **Staff** field is blank where attribution should exist. For an admin user, staff attribution is essential for auditing, staffing review, billing review, and operational accountability.

This same problem reappears elsewhere, which suggests the defect is systemic rather than isolated.

### 5. Time Logs are useful in structure but weakened by blank staff attribution

The **Time Logs** page loads a large cross-customer dataset and includes meaningful admin filters such as customer, contract, staff, category, and date range. Structurally, this is a strong page.

Functionally, however, the value of the page is reduced by the fact that the visible **Staff** column is blank. A time-log surface without reliable worker attribution is only partially useful for admins.

### 6. Requests are missing submitter attribution

The **Requests** page is operational in the sense that records load and filter controls are present. However, the **Submitted By** column is blank in the visible dataset.

For an admin team, this is a major gap. Requests need clear provenance so staff can understand who originated the request, who to follow up with, and how to interpret priority and urgency in context.

### 7. Reports are well designed overall, but still contain data and logic concerns

The **Time Reports** module is one of the strongest areas in the application. It includes broad filtering, totals, counts, export capability, and a **Contracts Over Limit** panel. From a product-design standpoint, this is the closest thing to an admin command center in the current build.

That said, two issues reduce trust in the page:

1. **Staff attribution is still missing**, despite the presence of a staff filter.
2. The **Contracts Over Limit** cards display questionable values such as **6.0 / 0.0 hrs this period**, which suggests a calculation problem, a missing period-allocation configuration, or incorrect contract-type handling in the reporting logic.

### 8. Settings navigation is present, but some downstream data views are inconsistent

The **Settings** area includes the expected sections for General, Reference Data, Staff Users, Customer Users, Portal Branding, and Audit Log. This is a good structural foundation.

However, the underlying data shown in some settings views is not consistently trustworthy:

| Settings area | Observation | Risk |
| --- | --- | --- |
| Staff Users | At least one visible internal user row lacked a rendered name | Data integrity or UI rendering issue |
| Customer Users | Page showed no customer users found | Inconsistent with customer-side login success and customer detail portal-access visibility |
| General | Show Demo Data toggle worked and could be restored | Positive confirmation of at least one successful admin write path |

### 9. Admin priority creation appears broken due to missing submitted select values

This is the most important confirmed write-path defect.

I attempted a controlled create workflow in **Priorities** using a temporary QA record. The form visually accepted values for **customer**, **title**, **status**, **priority level**, **due date**, **description**, and **internal notes**. However, pressing **Create Priority** did not complete the action, and even scripted form submission did not create the record.

Browser-side inspection showed that the generated form payload included the text fields but **did not include the selected customer, status, or priority-level IDs**. That means the form is likely not binding the select controls into the actual submission payload.

This explains the admin-visible symptom: the create form looks complete but behaves like a no-op.

## Controlled write-path results

| Write-path test | Result | Interpretation |
| --- | --- | --- |
| Create temporary priority | Failed | Likely form-binding defect for select controls; key IDs missing from submitted payload |
| Toggle Show Demo Data on | Succeeded | Setting persisted successfully |
| Restore Show Demo Data off | Succeeded | Setting could be cleanly reverted |

## Highest-priority issues for the coding agent

Below are the most important fixes, ordered by business impact and implementation urgency.

### Priority 1: Fix the Customers list page so it surfaces real customer records

**Problem:** The customer list shows an empty state even though customer records clearly exist and linked customer detail routes work.

**Implementation guidance:**

```md
Goal: Make /customers return and render the same customer dataset implied by the dashboard counts and customer-linked modules.

Tasks:
1. Trace the data source used by the dashboard customer-count card and compare it to the query used by the Customers list page.
2. Verify whether the Customers page is applying an unintended filter, tenant constraint, soft-delete condition, or portal-role scope.
3. Confirm that the list query includes active demo records when demo mode is enabled.
4. Add integration coverage that asserts:
   - the dashboard customer count is greater than zero in seeded demo data,
   - the Customers page returns non-empty results for the same dataset,
   - a customer visible in Contracts can also be found in Customers.
5. Add an automated regression test for the empty-state condition so the page cannot silently regress again.
```

### Priority 2: Fix missing attribution fields across time logs, contract history, reports, and requests

**Problem:** Staff attribution and request submitter attribution are blank across multiple admin surfaces.

**Implementation guidance:**

```md
Goal: Ensure all operational records display human-readable attribution consistently.

Tasks:
1. Audit the joins or denormalized fields used for:
   - time entry staff display,
   - contract-detail time history staff display,
   - report-table staff display,
   - request submitter display.
2. Verify whether foreign keys exist but names are not being selected, or whether null user references are being introduced during seeding/import.
3. Standardize display resolution logic so each record surface maps IDs to display names and falls back safely to email when full name is unavailable.
4. Add unit/integration tests that assert attribution fields are non-empty for seeded demo records.
5. Add a visible fallback such as `Unknown user` or the email address instead of rendering blanks.
```

### Priority 3: Fix the Priorities create form submission path

**Problem:** The visible create form does not produce a working create action because selected IDs are not present in the submitted payload.

**Implementation guidance:**

```md
Goal: Make admin priority creation submit a complete payload including relational select values.

Tasks:
1. Inspect the form implementation for customer, status, and priority-level controls.
2. Ensure each control binds to a submitted field name, not just a visual combobox state.
3. Verify that the form payload contains at minimum:
   - customer_id
   - title
   - status_id
   - priority_level_id
   - due_date (optional)
   - description (optional)
   - internal_notes (optional)
4. Add a submit-handler test that inspects the outbound payload before mutation.
5. Add an end-to-end test that creates a priority, confirms redirect or success feedback, then verifies the record appears in the list.
6. Add visible error feedback if submission fails server-side.
```

### Priority 4: Reconcile Customer Users settings with actual customer portal access state

**Problem:** Customer-side users can log in, and customer detail pages show portal access, but the **Customer Users** settings page reports no records.

**Implementation guidance:**

```md
Goal: Make /settings/customer-users accurately reflect real customer-portal users and associations.

Tasks:
1. Compare the data source for customer detail contact portal-access indicators with the query used by Customer Users settings.
2. Verify whether the settings page is reading from a different table or expecting a relationship that is not populated.
3. Confirm that seeded demo customer users are represented in the admin-facing query model.
4. Add a regression test asserting that a valid customer login corresponds to a visible row in Customer Users settings.
5. Include customer-company association, access status, and identity details in the list output.
```

### Priority 5: Correct over-limit and period-allocation reporting logic

**Problem:** Contracts Over Limit displays suspicious values such as `6.0 / 0.0 hrs this period`, which reduces trust in reporting.

**Implementation guidance:**

```md
Goal: Ensure contract-usage calculations and over-limit indicators reflect valid period allocation logic.

Tasks:
1. Trace how report-period allocation is computed for each contract type.
2. Verify handling for monthly retainers, buckets, on-demand work, and contracts with no active period cap.
3. Prevent impossible or misleading denominator states unless explicitly intended and labeled.
4. Add tests covering:
   - monthly allocation contracts,
   - bucket contracts,
   - on-demand contracts,
   - contracts with zero configured allocation.
5. If a zero denominator is valid for some contract classes, label that state explicitly instead of presenting it as normal utilization.
```

## Secondary improvements

These are not necessarily the first fixes to ship, but they would materially improve admin usability.

| Improvement | Why it matters | Suggested implementation |
| --- | --- | --- |
| Add success and failure toast feedback to admin mutations | Silent failures are confusing | Standardize mutation result feedback across create/edit/toggle actions |
| Add cross-links on customer detail to contracts, priorities, and requests | Admins think in customer context | Include related-record tabs or sections on customer detail pages |
| Render fallback names in Staff Users | Blank names reduce trust | Fall back to email or `Unnamed user` while fixing source data |
| Add module-level empty-state diagnostics | Helps distinguish no data from broken queries | Show active filter summary and record count source metadata in dev mode |
| Strengthen demo data consistency | Demo reliability affects all testing | Add seeded-data validation checks in CI |

## Suggested implementation order

| Order | Recommendation | Reason |
| --- | --- | --- |
| 1 | Fix Customers list | Core admin workflow currently misleading/broken |
| 2 | Fix attribution fields | Impacts multiple modules and trust in operational data |
| 3 | Fix Priorities create form | Confirmed broken write path |
| 4 | Fix Customer Users inconsistency | Important for portal administration |
| 5 | Fix reporting calculation edge cases | Important for trust and contract governance |
| 6 | Improve customer detail related-record visibility | Usability improvement after correctness fixes |

## Final assessment

The admin portal is **promising but not yet fully reliable for operational administration**. The strongest parts are its navigation model, authentication behavior, contract display depth, and reporting ambition. The weakest parts are not visual polish but **data integrity across surfaces** and **write-path reliability**.

The main takeaway for the coding agent is this:

> The highest-value work is to make admin data surfaces agree with one another and ensure that visible form controls are actually connected to persisted mutations.

Once the customer-list inconsistency, attribution gaps, and priority-create defect are fixed, the admin portal should become significantly more trustworthy and much closer to production readiness.
