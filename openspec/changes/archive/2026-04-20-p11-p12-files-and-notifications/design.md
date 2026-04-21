## Context

Phase 11 (Files) infrastructure is complete:
- `portal-documents` Supabase Storage bucket configured
- RLS policies secure file access
- `ContractDocuments` component handles contract attachments

Phase 12 (Notifications) infrastructure is complete:
- Resend client configured in `lib/email/client.ts`
- Email templates created: `CustomerInviteEmail`, `RequestNotificationEmail`, `RequestStatusUpdateEmail`
- Send functions ready in `lib/email/send.ts`

What remains is wiring up the email functions to the appropriate actions.

## Goals / Non-Goals

**Goals:**
- Integrate email notifications into existing flows
- Send invite emails when customer contacts are invited
- Notify internal users when customers submit requests
- Notify customers when request status changes
- Clean up project scope (remove request attachments)

**Non-Goals:**
- Request attachment upload (removed from scope)
- Email preference settings
- Batch email sending
- Email delivery tracking UI

## Decisions

### 1. Customer Invitation Email Integration

Location: `app/actions/customers.ts` - `sendInvitation` function

After successfully creating the invitation record, call `sendCustomerInvite` with:
- `to`: contact email
- `customerName`: customer name
- `inviteLink`: magic link URL
- `invitedBy`: current user's name

### 2. Request Notification Email Integration

Location: `app/actions/requests.ts` - `createRequest` function

After successfully creating a request, call `sendRequestNotification` with:
- `to`: internal staff emails (query profiles where role in admin/staff)
- `customerName`: customer name
- `requestTitle`: request title
- `requestDescription`: request description (truncated)
- `submittedBy`: submitter name
- `portalLink`: link to request detail page

### 3. Request Status Update Email Integration

Location: `app/actions/requests.ts` - `updateRequest` function

When status changes, call `sendRequestStatusUpdate` with:
- `to`: customer contacts with portal access for that customer
- `customerName`: customer name
- `requestTitle`: request title
- `oldStatus`: previous status label
- `newStatus`: new status label
- `portalLink`: link to request detail page

### 4. Error Handling

Email failures should be logged but not block the main action. The primary operation (invitation, request creation, status update) should succeed even if email fails.

## Risks / Trade-offs

**Risk**: Email sending slows down request creation
→ **Mitigation**: Fire-and-forget pattern - don't await email result for user-facing response

**Risk**: No internal staff emails configured
→ **Mitigation**: Skip notification if no recipients found, log warning

**Risk**: Missing RESEND_API_KEY in production
→ **Mitigation**: Graceful degradation - log error, don't crash
