# NextMove AI Admin Portal Test Notes

## Authentication

- Successfully signed out of the prior customer session.
- Successfully logged in with the provided admin credentials using password authentication.
- Admin login redirected to the admin dashboard rather than the customer dashboard.
- The authenticated header shows **Tim Howell**, which confirms the account identity rendered correctly after login.

## Initial dashboard observations

- The admin navigation includes Dashboard, Customers, Contracts, Time Logs, Priorities, Requests, Time Reports, and Settings.
- The dashboard loaded without errors.
- Stats cards are present for Customers, Contracts, Hours This Month, Open Priorities, and Open Requests.
- Quick actions are present for Log Time, New Request, New Priority, and View Reports.
- Recent Requests and Recent Time Entries widgets both displayed data.

## Additional authentication findings

After signing out, a direct attempt to open the protected dashboard route redirected back to the login page, which confirms route protection for logged-out sessions. I also tested an invalid password against the admin account. The login form remained on the password screen and displayed the message **Invalid email or password.** This is the expected behavior and provides clear feedback without exposing extra account information.

The forgot-password page is reachable from the admin sign-in screen and presents a simple email form with a reset-link action and a clear path back to sign-in. I have verified the entry point and page availability, but I have not completed the end-to-end email reset flow because that would require inbox access or an explicit decision to trigger a live reset email to the provided admin account.

Authentication testing is now sufficiently complete for the current session. Valid password login worked, invalid password handling worked, logout worked, and protected-route enforcement after logout worked. The password-reset entry page exists and is reachable, while the end-to-end reset and magic-link inbox flows remain only partially verified because they depend on email access or triggering live email delivery.

## Dashboard and customer management findings

The dashboard Customers card successfully navigated to the Customers page, which confirms that dashboard-to-module navigation is wired correctly. However, the resulting Customers page showed **No customers found** and displayed an empty-state call to add a first customer, even though the dashboard had just reported **8 active customers**. That is a significant functional inconsistency between the dashboard summary layer and the customer management list view.

The Contracts page loaded successfully and displayed a substantive multi-customer list, which confirms that contract management data is available even though the Customers list appeared empty. This contrast increases confidence that the Customers page issue is isolated rather than a system-wide data outage. I also opened the **Acme Corporation - Monthly Retainer** contract detail page. The detail view is strong in several respects: it clearly shows contract type, status, start date, subscription period, monthly allocation, used hours, remaining hours, rollover information, period usage, billing day, documents, and time-entry history.

However, the same people-attribution problem seen in the customer experience is also present here: the **Staff** column for time entries is blank. In the admin experience, that is an even more serious issue because administrators need complete operational attribution for auditing, staffing review, and reporting.

Despite the empty Customers list page, the direct customer detail route for **Acme Corporation** loaded correctly from a linked contract record. This reveals a likely list-query or list-rendering defect rather than missing customer records. The customer detail page itself is functional and informative: it shows account status, NextMove AI contact placeholders, notes, and a customer contacts table with portal-access state for each contact. The page therefore contains real underlying customer data even though the top-level Customers page incorrectly presents an empty state.

The customer detail page appears to terminate near the contacts table and change-history section; an attempt to scroll further indicated the bottom of the page had already been reached. Based on the tested view, I did not observe visible dedicated sections for the customer's contracts, priorities, or requests on this detail page, even though the admin testing checklist expects those areas to be present.

The contract status filter is functioning. I switched the list from **All Statuses** to **Draft**, and the page narrowed correctly to the three draft special-project contracts for TechStart Solutions, Global Dynamics, and Innovate Labs. This confirms that at least part of the contract-management filtering behavior is operational.

At this point, the dashboard, customer detail, contacts display, and contract list/detail/filtering workflows have been exercised enough to establish a clear pattern: several admin surfaces are strong and data-rich, but the Customers list appears materially broken or disconnected from the underlying records.

## Time logs

The Time Logs page is data-rich and loads a large cross-customer table with customer, contract, category, description, date, and hours information. It also exposes a strong admin filter set with customer, contract, staff, category, and date-range controls. However, the **Staff** column is blank throughout the visible dataset, which materially weakens the value of the page for administrative oversight and auditing. The blank staff attribution therefore appears to be a systemic issue rather than an isolated contract-detail defect.

## Priorities

The Priorities page loaded successfully and appears to provide a large multi-customer backlog with filters for customer, status, and level. The visible list is dense but operational and includes status badges, priority levels, due dates, and edit actions. From an admin perspective, this page appears functionally stronger than the Customers list and closer to production-ready behavior, although I have not yet executed live create or edit actions on the records.

## Requests

The Requests page loads successfully and provides customer and status filters along with edit actions, so the basic admin workflow is present. However, the **Submitted By** column is blank throughout the visible dataset, mirroring the customer-side problem. For an admin user, missing submitter attribution is a major operational gap because it reduces traceability, ownership clarity, and support accountability.

## Time reports

The admin Time Reports page is one of the strongest surfaces in the application. It includes customer, contract, category, billable, staff, and date filters; aggregate totals; entry counts; export capability; and an additional **Contracts Over Limit** panel that surfaces exception conditions. That said, two issues stand out. First, staff attribution still does not appear in the visible report table despite the presence of a staff filter. Second, the over-limit cards display values such as **6.0 / 0.0 hrs this period**, which strongly suggests a calculation or configuration problem for period-allocation reporting on at least some contracts.

## Settings and user management

The Settings area is accessible and presents the expected navigation for General, Reference Data, Staff Users, Customer Users, Portal Branding, and Audit Log. The General settings screen includes a **Show Demo Data** toggle, which aligns well with the admin testing script. I also opened **Staff Users**, where the application displayed an internal user-management table with role controls, active toggles, and an **Invite User** action. This indicates that key administrative configuration surfaces exist and are wired into the application.

One noteworthy data-quality issue is present in the visible Staff Users table: the first listed internal user appears without a rendered name while still showing an email address and role/status controls. That suggests at least one staff-user record is incomplete or not being rendered cleanly in the name field.

The **Customer Users** settings page reports **No customer users found**, which does not align with other observed application states. During customer-side testing, I authenticated successfully as a customer portal user, and in the admin customer detail view I also observed a contact labeled **Demo User (Acme)** with active portal access. This creates another meaningful cross-surface inconsistency: customer-user records or portal-access state appear to exist in some parts of the application but are not surfacing in the dedicated Customer Users settings view.

## Controlled live write-path testing update

I attempted a controlled admin create workflow on **Priorities** using a temporary QA record for **Acme Corporation**. The form accepted visible field values for title, status, level, due date, description, and internal notes, but submission did not complete via either the visible **Create Priority** button or scripted form submission. Browser-side inspection showed a likely binding defect: the generated `FormData` included `title`, `due_date`, `description`, and `internal_notes`, but did **not** include the selected customer, status, or priority-level identifiers. This strongly suggests the create form is not wiring the select controls into the actual submitted payload, which would explain the apparent no-op behavior from an admin user perspective.

I then performed a lower-risk live write-path test in **Settings > General** by toggling **Show Demo Data** on and then restoring it to its original state. The switch state changed successfully from unchecked to checked and then back to unchecked, confirming that this admin-side write path persists correctly and can be restored cleanly.
