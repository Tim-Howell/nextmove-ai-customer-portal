# Backlog: Requests Module Overhaul

> Status: **Deferred** — captured for future reference, not actively scheduled.
> Captured: 2026-04-29.

## Goal

Promote Requests from a per-customer record list into a standalone "support
queue" module with two-way conversation, needs-review tracking, and email
notifications. Move it to a top-level admin nav item under Customers.

## Functional decisions (already approved)

### Conversations
- New table `request_messages` (flat, no nesting): `id`, `request_id`, `author_id`, `body`, `is_internal bool`, `created_at`.
- Existing internal notes for requests get **migrated into `request_messages`** with `is_internal=true`. The polymorphic `internal_notes` mapping is dropped **for requests only** (customers/priorities keep `internal_notes` unchanged).
- If real customer data does not yet exist in production, the data can be reseeded instead of migrated.

### Needs-review flag
- Add `requests.needs_review bool` and `requests.last_activity_at timestamptz`, both maintained by Postgres triggers.
- **Set `needs_review=true`** when:
  - A `request_messages` row is inserted with `is_internal=false` AND author is `customer_user`, OR
  - A `requests` row is inserted by a `customer_user`.
- **Clear `needs_review=false`** when:
  - A `request_messages` row is inserted with `is_internal=false` AND author is `admin`/`staff`, OR
  - `requests.status` transitions to `resolved` or `cancelled`.
- The flag is **only** affected by non-internal messages — internal staff notes never set or clear it.

### Visual indicators
- Sidebar "Requests" item shows a count badge of `needs_review=true AND status NOT IN ('resolved','cancelled')` for admin/staff.
- Default sort on the requests list: `needs_review desc, last_activity_at desc`.
- A "Needs review" filter chip is available on the list page.

### Navigation
- Move `Requests` to a **top-level** admin nav item, positioned directly **below** `Customers`. Today it lives nested under customer detail pages.

### Email notifications (Resend)
- Provider: **Resend**. Templates as React Email components. Sending is triggered from server actions (not DB triggers) so retries and dev no-ops are explicit.
- Events that send email:
  - **New request submitted** → emails the customer's **primary and secondary points-of-contact**.
  - **Customer note added** to existing request → emails the same primary + secondary contacts (i.e., the customer side, since the customer side typically has the staff replying scenario covered too — see below).
  - **Staff non-internal note added** → emails the customer-side primary + secondary contacts.
- Internal notes never trigger any email.
- No attachments at this time. Email body is metadata-only ("You have a new message on request #123 — <subject>") with a portal link.

### Out of scope (this overhaul)
- Attachments on messages
- Read receipts / who-saw-what
- Assignment of staff to requests
- Email digests / batched notifications
- Customer-configurable notification routing

## Implementation notes (sketch)

- New migration adding `request_messages` table + `needs_review` / `last_activity_at` columns + trigger function.
- RLS:
  - `customer_user`: SELECT/INSERT on `request_messages` for their own customer's requests, but only where `is_internal=false`.
  - `admin`/`staff`: full access.
- Server actions:
  - `app/actions/request-messages.ts`: `addMessage(requestId, body, { isInternal })`.
- Email:
  - `lib/email/resend.ts` client wrapper.
  - `emails/request-new.tsx`, `emails/request-message.tsx` React Email components.
  - Resend API key in env: `RESEND_API_KEY`. Document in `.env.example`.
- UI:
  - `app/(portal)/requests/page.tsx` becomes the top-level queue (admin/staff view: cross-customer; customer_user view: scoped).
  - Request detail page gains a flat thread of `request_messages` with an `is_internal` toggle for staff.
  - Sidebar adds badge count (admin/staff only).

## When picking this up

- Confirm production has not accumulated `internal_notes` for requests; if it has, write the migration, otherwise allow reseed.
- Re-check status reference values for `requests` — the trigger logic depends on the exact `value` strings for `resolved` / `cancelled`.
- Decide whether to introduce assignment at the same time, since "who replies" becomes more interesting with a real queue.
