## Why

Phase 11 (Files) and Phase 12 (Notifications) are mostly complete but need final integration and documentation. The storage bucket and RLS policies exist, contract attachments work, and Resend email infrastructure is configured with templates. This change completes the integration by wiring up email notifications and updating project documentation.

## What Changes

- Remove request attachment upload from project scope (not needed)
- Wire up `sendCustomerInvite` in the customer invitation flow
- Wire up `sendRequestNotification` when customers submit requests
- Wire up `sendRequestStatusUpdate` when internal users change request status
- Mark Phase 11 and 12 tasks as complete in project.md

## Capabilities

### New Capabilities
<!-- None - this is integration of existing infrastructure -->

### Modified Capabilities
- `customer-invitation`: Add email notification when invitation is sent
- `requests`: Add email notifications for new requests and status changes

## Impact

- **Actions**: Modify `app/actions/customers.ts` (invitation), `app/actions/requests.ts` (create/update)
- **Environment**: Requires `RESEND_API_KEY` in production
- **Documentation**: Update project.md to reflect completed phases and removed scope
