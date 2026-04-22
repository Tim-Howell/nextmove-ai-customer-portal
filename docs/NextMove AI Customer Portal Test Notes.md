# NextMove AI Customer Portal Test Notes

## Initial login observations

- Reached `https://portal.nextmoveaiservices.com/login` successfully.
- Default login page presents a magic-link email input and a secondary action to switch to password sign-in.
- Password sign-in form includes fields for email and password, a **Forgot password?** link, a **Sign in** button, and an option to return to magic-link mode.
- Branding on login screen shows **NextMove AI**.

## Planned authentication checks

- Valid password sign-in with demo customer account.
- Invalid password error handling.
- Password reset flow UI review.
- Post-login redirect and protected route behavior.

## Test accounts available

- `demo-acme1@example.com` / `DemoPass123!`
- `demo-techstart@example.com` / `DemoPass123!`

## Authentication progress

I switched from magic-link mode to password sign-in mode and confirmed that the login form exposes email and password fields, a password-reset link, and a return path back to magic-link login.

I entered valid credentials for the Acme demo account and submitted the sign-in form. The button changed to a loading state reading **Signing in...**, which indicates that the authentication request was accepted and is processing. I have not yet confirmed the final redirect outcome.

## Post-login observations

The Acme demo account authenticated successfully and redirected to the customer dashboard at `/dashboard`. The left navigation exposes **Dashboard**, **Contracts**, **Priorities**, **Requests**, and **Time Reports**, which aligns well with the expected customer scope.

The dashboard shows Acme-specific summary information, including **Hours This Month = 17.5**, **Open Requests = 19**, **Active Priorities = 20**, and **Active Contracts = 3**. The page also displays three active contracts and a short priorities table. The user menu identifies the logged-in account as **Demo User (Acme)** with the expected demo email address, and the menu contains a **Sign out** action.

A notable usability observation is that the dashboard section labeled **Your NextMove AI Team** currently displays **No contacts assigned yet**, which may be acceptable for demo data but reduces confidence in the customer experience because the product specification expects assigned NextMove AI contacts to be visible.

## Logout and route protection

The **Sign out** action returned the session cleanly to the login page. After signing out, I manually navigated to `/dashboard` and the application redirected back to `/login`, confirming that the dashboard route is protected for unauthenticated users.

## Additional authentication setup

I returned to the password sign-in form after logout and prepared an invalid-credential test using the Acme demo email with an intentionally incorrect password. The next step is to submit the form and inspect the resulting error behavior.

## Invalid credential handling

Submitting the Acme demo email with an incorrect password produced a visible inline error message: **Invalid email or password.** This is a clear and appropriate response, although I still need to assess whether the messaging and recovery path are optimal from a usability standpoint.

## Password reset flow

The **Forgot password?** link opens a dedicated `/forgot-password` page with a single email field, a **Send reset link** button, and a **Back to sign in** link. The flow is straightforward and visually consistent with the login page. I have confirmed the reset UI, but I have not completed the full email-based reset loop because inbox access for the demo accounts was not provided in the current test setup.

## Authentication phase status

At this point I have verified the main login screen, password login success, invalid-password handling, logout, route protection after logout, and the password reset page UI. Magic-link delivery and end-to-end password reset completion remain unverified because external inbox access was not part of the supplied test environment.

I returned to the sign-in flow and reopened the password login form so I can re-enter the demo account and continue feature testing as a customer user.

## Re-authentication for workflow testing

I signed back into the Acme demo account successfully and returned to the dashboard. Authentication testing is sufficiently complete for this session: successful password login works, invalid-password feedback appears correctly, logout succeeds, protected routes redirect unauthenticated users, and the password reset page is available.

## Contracts testing

The Contracts page for the Acme customer displays three contracts only, all tied to Acme Corporation: **Monthly Retainer**, **Special Project**, and **Ad-hoc Support**. This supports the expected customer-specific scoping.

The **Monthly Retainer** contract detail confirms the Hours Subscription experience is generally working. The page exposes contract metadata, current subscription period, monthly allocation, used hours, remaining hours, rollover hours, billing day, and a time-entry table. However, one notable data-quality issue is that the **Staff** column in the time-entry table is blank (`—`) for every visible entry, which weakens transparency for customer users and conflicts with the specification that staff names should be visible in customer reporting.

## Additional contract observations

The **Special Project** contract detail confirms the Hours Bucket presentation is functioning. It shows total allocated hours, used hours, remaining hours, a progress bar, and a customer-visible time-entry table. As with the subscription contract, the time-entry table again shows blank values in the **Staff** column for all visible rows, suggesting a systematic issue rather than a single bad record.

## On-Demand contract observations

The **Ad-hoc Support** contract detail presents the On-Demand / Ad-Hoc model clearly enough for a customer user. It shows contract metadata, total hours logged, explanatory billing text, and a time-entry table. This appears to satisfy the intended view for a non-bucket contract. The recurring weakness remains that the **Staff** field is blank across visible time entries, reducing accountability and making it harder for customers to understand who performed the work.

## Customer perspective on contract display usefulness

From a customer-review standpoint, the Contracts list is only partially successful. It tells me **which contracts exist**, their **type**, and whether they are **active**, but it does not consistently answer the more important customer questions: **How much service do I have left? What period does this apply to? Which contracts need my attention?**

The clearest evidence is the **Hours** column. For the Hours Bucket contract, the list shows a concise `used / total` style value, which is helpful. For the Hours Subscription contract, however, the list shows only a dash, even though the detail page clearly has meaningful usage information for the current period and rollover balance. For the On-Demand contract, the list also shows a dash, even though the detail page tracks total logged hours. This makes the list view feel inconsistent and forces customers to click into every contract detail page to answer basic questions.

A stronger customer-facing contract summary would likely present a contract-specific summary card or richer table row for each contract. For example, subscription contracts should show the **current period**, **hours used this period**, **hours remaining this period**, and **rollover balance**. Bucket contracts should show **total**, **used**, and **remaining**. On-Demand contracts should show **hours logged this month** or **lifetime hours logged**, depending on the intended reporting model. Without that summary layer, the customer must interpret contract types mentally instead of the product doing that work for them.

## Time reporting usefulness

The customer reporting area is routed under `/reports`, even though the navigation label reads **Time Reports**. Once opened, the page is substantially more useful than the contract list because it provides the kind of cross-contract visibility a customer is likely to want: date filters, category filter, contract filter, billable filter, totals, billable totals, entry counts, a tabular list of time entries, and CSV export.

From a customer perspective, this is the first view that starts to answer practical review questions such as **Where did our time go? Which contract consumed the work? How much was billable?** The report is therefore directionally strong. However, it also exposes an important information-design gap in the rest of the product: this report is more informative than the contract list, which means customers may need to rely on reporting to understand contract usage instead of getting an immediate understanding from the contracts area itself.

I also confirmed that the contract filter opens with only Acme contracts listed, which is a positive sign for customer scoping and report relevance.

## Contract-level reporting behavior

Filtering the report to **Acme Corporation - Special Project** worked correctly. The URL updated with a contract identifier, the totals changed from the cross-contract view to contract-specific values, and the table narrowed to 13 entries with **23.8 total hours** and **20.3 billable hours**. This is strong evidence that the reporting layer can support contract review in a way that makes sense to a customer.

From a usability standpoint, the report is currently more aligned with the customer mental model than the Contracts page itself. A customer reviewing a contract usually wants a single place to understand **usage, billing relevance, time history, and filtering by period**. The reporting page gets close to that need, but it is separated from the contract details instead of being integrated tightly into them. In other words, the report works, but the product architecture still makes customers switch contexts between **contract understanding** and **contract reporting**.

## Requests visibility and detail quality

The Requests list is easy to scan and includes titles, statuses, and created dates, but the **Submitted By** column is blank (`—`) across visible entries. That reduces context for customers, especially in organizations where multiple customer users may submit requests and need to distinguish who opened what.

The request detail page for **Need help with login issues** is readable and simple. It shows status, submitted-by field, created date, last updated date, and description. However, the same data-completeness issue persists: the submitter is blank even on the detail page. For a customer-facing portal, this weakens collaboration and auditability because users cannot easily confirm ownership or authorship of requests.

I have deliberately not submitted a new live request during this session because posting new data into the environment would require explicit approval before taking that action.

## Customer data isolation and restricted navigation

I attempted to open `/customers` and `/settings` directly while authenticated as a customer user. In both cases, the application redirected me back to the customer dashboard instead of exposing internal pages. This is a positive access-control outcome because the customer account could not reach internal management screens through simple URL manipulation.

From a usability perspective, however, the redirect behavior is somewhat opaque. It protects the system, but it does not explain why access was denied. A more explicit **permission denied** or **not available for customer users** message could improve clarity and reduce confusion if customers bookmark or manually type an internal URL.

## Report export behavior

The **Export CSV** action successfully downloaded a file to the browser download directory, which confirms that customer users can take their time data offline for additional analysis. That is a meaningful capability and strengthens the usefulness of the reporting feature.

However, the exported CSV appears to begin directly with data rows and does not include a visible header row in the downloaded file. If confirmed, that is a usability problem because customers exporting data to Excel or another analysis tool would expect column names such as **Date**, **Contract**, **Category**, **Hours**, **Billable**, and **Description**. A headerless export is functional but unnecessarily inconvenient.
