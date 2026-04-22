# NextMove AI Customer Portal Customer-Side Evaluation Report

**Author:** Manus AI  
**Date:** 2026-04-22  
**Test role:** Customer user  
**Primary account tested:** `demo-acme1@example.com` (Acme Corporation)

## Executive Summary

I tested the customer-facing portal as an authenticated customer user with a particular focus on a practical question: **if I were a customer reviewing my contracts and related work, would the portal show me the information I need in the way I would naturally expect to see it?** Based on this session, the answer is **partially yes**.

The portal already has several strong foundations. Authentication by password worked, restricted internal routes did not expose internal functionality, contract detail pages contain substantive operational data, the time-reporting area is genuinely useful, and CSV export works. The overall customer scope is appropriate and the product is directionally aligned with the goals described in the supplied project materials.[1] [2] [3]

The main weakness is not a lack of data, but the **way the data is organized and surfaced**. The portal often stores or can derive information that customers want, but it does not always present that information at the point where customers expect to find it. The clearest example is the Contracts list: a customer can open contract detail pages and find meaningful usage information, yet the top-level Contracts view does not consistently summarize usage in a way that supports quick decision-making. The reporting area compensates for this gap, but customers should not have to leave contract views and switch mental models just to understand basic contract health.[1] [3]

## Scope and Test Coverage

The evaluation was guided by the supplied README, project specification, and customer testing checklist.[1] [2] [3] The testing session emphasized customer-visible behavior rather than internal administration.

| Area | Status | Notes |
| --- | --- | --- |
| Password login | Verified | Valid login succeeded; invalid password produced a clear error. |
| Logout and protected routes | Verified | Direct access to protected pages after logout redirected to login. |
| Password reset UI | Partially verified | Reset page exists and is coherent, but end-to-end email flow was not completed because inbox access was not provided. |
| Dashboard | Verified with concerns | Useful high-level counts, but assigned team information was empty in demo data. |
| Contracts list and detail pages | Verified with important usability concerns | Data exists, but the top-level display is not yet optimized for customer understanding. |
| Time reports | Verified and strong | Filters, totals, contract scoping, and CSV export all worked. |
| Requests list/detail | Verified with data-quality concerns | Request visibility works, but submitter identity was blank. |
| Restricted internal routes | Verified | Attempted internal routes redirected to dashboard rather than exposing internal pages. |
| Live request submission | Not executed | Creating live data would require explicit approval before submission. |
| Magic-link flow | Not verified end-to-end | Requires inbox access not included in the test setup. |

## What Works Well for a Customer

From a customer perspective, the portal already does several important things correctly. The navigation is simple and customer-scoped, showing only **Dashboard**, **Contracts**, **Priorities**, **Requests**, and **Time Reports**. This prevents the interface from feeling cluttered or administrative.[3]

The contract detail pages are meaningful once opened. For example, the tested Hours Subscription contract showed the active period, monthly allocation, used hours, remaining hours, rollover hours, billing day, and time-entry history. The Hours Bucket contract showed total hours, used hours, remaining hours, and relevant entries. The On-Demand contract also displayed logged hours and time history. This means the underlying product model is solid: the system appears able to represent different contract types in ways customers can understand.[1] [2]

The reporting area is especially promising. It gives customers a cross-contract view of time entries with date filters, category filter, contract filter, billable filter, aggregate totals, and CSV export. When filtered to a single contract, the report updated correctly and produced contract-specific totals. This is the most customer-useful part of the portal today because it directly answers practical review questions such as: **What work was done? Against which contract? How much was billable? How much time has accumulated?**[2] [3]

## Where the Customer Experience Breaks Down

The most important usability issue is that the **Contracts list does not function as a useful contract review dashboard**. It identifies each contract and shows its type and status, but it does not consistently summarize the metric that matters most to a customer. For the Hours Bucket contract, the list shows a usable `used / total` value. For the Hours Subscription contract, however, the Hours column shows only a dash, even though the detail page has current-period usage and rollover information. For the On-Demand contract, the list also shows a dash, despite the detail page showing logged hours. This makes the list view inconsistent and weakens customer confidence.[3]

A customer generally approaches the Contracts area with a simple mental model: **show me what I have, how it is being used, and whether anything needs attention**. The current list answers only the first of those questions cleanly. It does not present a contract-health summary layer that helps customers scan across active agreements.

A second issue is that several customer-facing tables show missing people data. On contract detail pages, the **Staff** column was blank for visible time entries. On the Requests list and detail page, the **Submitted By** field was blank. Even if the application technically allows the record to exist, this is a customer-experience problem because the portal becomes less collaborative and less auditable. Customers want to know **who performed work** and **who submitted a request**, especially when multiple people are involved.[2] [3]

A third issue is information architecture. The time-reporting page is more effective at helping customers understand work than the Contracts area itself. This means the product currently separates **contract understanding** from **contract reporting** when most customers would expect those experiences to reinforce each other. A good customer portal should let the Contracts area answer summary questions immediately, while letting the Reports area answer investigative questions in depth.

## Contract Display Evaluation: Does the Display Make Sense?

The answer is **not fully yet**, although the portal is close.

| Customer question | Current experience | Assessment |
| --- | --- | --- |
| What contracts do I have? | Easy to answer from the Contracts list. | Good. |
| Which of my contracts are active? | Clearly visible with status badges. | Good. |
| How much time remains on each contract? | Clear for Hours Bucket detail, partially clear for Hours Subscription detail, not summarized in list view. | Weak at list level. |
| What period does this usage belong to? | Available on subscription detail page, not obvious from list view. | Needs improvement. |
| Which contracts need attention right now? | No attention state or health indicator in list view. | Missing. |
| Who worked on the time entries? | Staff column blank in tested views. | Broken or incomplete. |
| Can I compare usage across contracts quickly? | Best done in Reports, not Contracts. | Indirect and inconvenient. |

In short, the contract display **contains useful data but does not package it in the most customer-friendly way**. The portal should not require customers to infer contract semantics from contract type names. It should translate each contract type into the summary that matters for that type.

> A customer-facing contract screen should answer, at a glance, what the agreement is, what has been consumed, what remains, what period is in scope, and whether action is needed.

## Reporting Evaluation: Can a Customer Report on the Data in a Way That Makes Sense?

The answer here is **mostly yes**.

The reporting experience is one of the strongest parts of the current portal. It supports a realistic customer workflow because it allows filtering by contract and date range, provides totals and entry counts, distinguishes billable from non-billable work, and allows CSV export.[3]

However, the report is still missing a few elements that would make it more complete as a customer review tool. The table does not show the staff member responsible for each time entry, even though the original project intent includes staff visibility in customer reporting.[2] The report also lacks a contract-health summary or grouped view that would connect totals back to contract limits or subscription periods. Finally, the CSV export appears to download without a visible header row, which creates avoidable friction for customers using spreadsheets.

## Priority Findings for the AI Coding Agent

The following table is written to be implementation-ready for an engineering agent.

| Priority | Issue | Why it matters | Recommended implementation |
| --- | --- | --- | --- |
| P1 | Contracts list does not summarize Hours Subscription or On-Demand usage | Customers cannot quickly review contract health without drilling into details | Replace the single generic **Hours** column with a contract-type-aware summary component. For Hours Subscription, show current period, used, remaining, and rollover. For Hours Bucket, show used, total, remaining, and percentage. For On-Demand, show hours this month and total logged. |
| P1 | Staff names missing on customer-visible time-entry tables and reports | Customers cannot tell who performed the work | Ensure time-entry queries join to staff profile/display name and expose a safe customer-facing `staff_display_name` field in contract details and reports. Add a fallback such as `Unknown staff member` rather than `—`. |
| P1 | Request submitter names missing on list/detail pages | Customers cannot identify who opened or owns requests | Join request records to the submitting contact/profile and expose `submitted_by_name` for customer users. Render that value on both list and detail pages. |
| P1 | Contract understanding and reporting are split across separate pages | Customers must switch contexts to answer basic contract questions | Add a **Contract Activity** section to each contract detail page with date-range filter, totals for the selected contract, and direct link into pre-filtered reports. |
| P2 | Contracts list lacks urgency or health indicators | Customers cannot identify contracts needing attention | Add derived statuses such as `At Risk`, `Low Hours Remaining`, `Approaching Renewal`, or `Over Monthly Allocation` based on contract type and thresholds. |
| P2 | Reports export appears to omit CSV headers | Exported data is less usable in Excel and BI tools | Ensure CSV export writes a header row and uses stable column names. |
| P2 | Access-control redirect is safe but opaque | Customers may be confused when internal URLs send them to dashboard | Consider showing a lightweight explanatory toast or dedicated authorization message when a customer attempts to access an internal route. |
| P3 | Dashboard team section is empty in tested demo experience | Customers may perceive the portal as incomplete or impersonal | Ensure assigned primary/secondary NextMove AI contacts populate customer-visible dashboard/team sections when present. If absent, show a more intentional empty state with guidance. |

## Detailed Implementation Recommendations

### 1. Redesign the Contracts list around customer questions

The Contracts page should stop behaving like a generic record list and start behaving like a **customer contract review surface**. The core implementation change should be to introduce a contract-type-aware summary renderer.

| Contract type | Recommended summary block in list/card view |
| --- | --- |
| Hours Subscription | `Current Period: Apr 1–Apr 30`, `Used: 9.0h`, `Remaining: 21.0h`, `Rollover: 20.0h`, progress bar |
| Hours Bucket | `Used: 23.8h of 100h`, `Remaining: 76.2h`, progress bar |
| Fixed Cost / Service Subscription | `Active service`, `Billing period`, `Deliverables or coverage summary`, no hour emphasis unless applicable |
| On-Demand / Ad-Hoc | `Hours this month`, `Total hours logged`, optional recent activity count |

The rendering logic should be derived from contract type rather than leaving unused columns blank. A blank dash is technically honest but poor customer communication.

### 2. Add contract-health states and callouts

Customers do not just want raw numbers; they want interpretation. The UI should compute a concise health label and display it consistently in list and detail views.

| Health rule | Suggested behavior |
| --- | --- |
| Hours Subscription remaining under 20% of total period allocation | Show `Low hours remaining` badge in amber |
| Current period over allocated hours | Show `Over allocation` badge in red |
| Hours Bucket remaining under 15% | Show `Near exhaustion` badge in amber |
| Contract end date within 30 days | Show `Approaching renewal` badge in blue |

This is a relatively small engineering change with high customer value because it turns passive data into actionable information.

### 3. Unify Contracts and Reports

Each contract detail page should include a **mini-reporting module** rather than forcing the customer to navigate separately to the Reports page. The easiest implementation path is likely:

1. Reuse the existing report query logic with a required contract filter.
2. Surface date-range controls inside the contract detail page.
3. Show `Selected period total hours`, `Billable hours`, `Non-billable hours`, and `Entry count` above the table.
4. Provide a **View full report** link that opens `/reports` with query parameters already applied.

This approach preserves the existing reports investment while making contract review feel coherent.

### 4. Fix missing customer-facing people data

The missing **Staff** and **Submitted By** values are not minor cosmetic issues. They diminish trust. The engineering work should prioritize identifying where the join or serialization path breaks.

Suggested implementation tasks:

| Task | Engineering expectation |
| --- | --- |
| Audit time-entry data path | Verify each time entry has a valid internal user/profile reference and that the customer-safe display name is selected in server queries or loaders. |
| Audit request data path | Verify each request stores submitter profile/contact linkage and that this is exposed in customer page queries. |
| Add UI fallback | Replace `—` with explicit fallback text such as `Unavailable` only when data is truly missing. |
| Add automated tests | Add regression tests for customer report rows and request rows to ensure people fields remain populated. |

### 5. Improve report export quality

The report export capability is important and should be preserved. The next step is to make it spreadsheet-friendly by default.

The CSV export should include a header row, consistent decimal formatting, ISO or user-friendly date formatting, and ideally an optional staff column once staff names are fixed. If you want customers to use exported data for contract review, then the export should mirror the on-screen semantics clearly.

A recommended header set is:

`Date,Contract,Category,Hours,Billable,Staff,Description`

### 6. Improve empty and denied states

The dashboard currently showed **No contacts assigned yet** in the customer team area. That may be correct for demo data, but it reads as accidental rather than intentional. Empty states should explain what the customer should expect there.

Similarly, redirecting customers from internal routes back to dashboard is secure, but it should be accompanied by a human-readable explanation such as: *“That page is only available to internal staff. You have been returned to your dashboard.”*

## Recommended Acceptance Criteria

The following acceptance criteria are suitable for an implementation sprint.

| ID | Acceptance criterion |
| --- | --- |
| AC-1 | The Contracts list must display a meaningful summary for every supported contract type and must not render a generic dash when summary data exists. |
| AC-2 | Hours Subscription contracts must show current period usage and remaining hours in both list and detail views. |
| AC-3 | Customer-visible time-entry tables and the reporting table must display staff names for all entries with valid staff associations. |
| AC-4 | Customer-visible requests list and request detail pages must display the submitter name when available. |
| AC-5 | Each contract detail page must provide contract-filtered activity totals and a direct path to a pre-filtered full report. |
| AC-6 | CSV exports must include a header row and match on-screen filters. |
| AC-7 | Attempted access to internal-only routes as a customer user must remain blocked and should produce a clear explanatory message. |

## Overall Assessment

The customer portal is already a credible MVP, but it is currently better at **storing and exposing operational data** than at **explaining that data in a customer-native way**. The strongest opportunity is not to add entirely new modules, but to improve the translation layer between the system’s internal data model and the customer’s mental model.

If you implement only one major improvement, it should be this: **make the Contracts area function as a real customer contract review dashboard, not just a list of contract records**. If you implement two, the second should be: **bring reporting context directly into contract views and fix missing people attribution fields**. Those two changes would materially improve clarity, trust, and perceived professionalism.[1] [2] [3]

## Untested or Partially Tested Items

A few checklist items remain only partially tested in this session.

| Item | Reason |
| --- | --- |
| Magic-link login delivery and redirect | Requires access to the demo email inbox. |
| End-to-end password reset completion | Requires access to the reset email inbox. |
| Live request submission | Creating live records requires explicit approval before posting data. |
| Responsive/mobile layout | Not fully executed in this session. |
| Archived customer and disabled portal access scenarios | Require admin-side setup or account state changes not performed in this session. |

## References

[1]: https://nextmoveaiservices.com "NextMove AI website"
[2]: https://portal.nextmoveaiservices.com "NextMove AI Customer Portal"
[3]: https://portal.nextmoveaiservices.com/login "NextMove AI Customer Portal login and tested customer routes"
