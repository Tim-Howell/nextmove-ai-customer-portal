# Email Integration with Resend

This directory contains the email integration for the NextMove AI Customer Portal using Resend.

## Setup

1. **Get your Resend API key:**
   - Sign up at [resend.com](https://resend.com)
   - Navigate to API Keys in your dashboard
   - Create a new API key

2. **Add to environment variables:**
   ```bash
   # In .env.local
   RESEND_API_KEY=re_your_api_key_here
   ```

3. **Configure sender email:**
   - Update `FROM_EMAIL` in `send.ts` with your verified domain
   - For development, you can use `onboarding@resend.dev`
   - For production, verify your domain in Resend dashboard

## Usage

### Send Customer Invite

```typescript
import { sendCustomerInvite } from '@/lib/email';

await sendCustomerInvite({
  to: 'customer@example.com',
  customerName: 'Acme Corp',
  inviteLink: 'https://portal.nextmove.ai/invite/abc123',
  invitedBy: 'John Smith'
});
```

### Send Request Notification

```typescript
import { sendRequestNotification } from '@/lib/email';

await sendRequestNotification({
  to: ['admin@nextmove.ai', 'staff@nextmove.ai'],
  customerName: 'Acme Corp',
  requestTitle: 'Need help with deployment',
  requestDescription: 'We are experiencing issues...',
  submittedBy: 'Jane Doe',
  portalLink: 'https://portal.nextmove.ai/requests/123'
});
```

### Send Request Status Update

```typescript
import { sendRequestStatusUpdate } from '@/lib/email';

await sendRequestStatusUpdate({
  to: 'customer@example.com',
  customerName: 'Acme Corp',
  requestTitle: 'Need help with deployment',
  oldStatus: 'New',
  newStatus: 'In Progress',
  portalLink: 'https://portal.nextmove.ai/requests/123'
});
```

## Email Templates

All email templates follow the NextMove AI branding:
- **Primary Color:** #2C3E50 (Navy)
- **Accent Color:** #6FCF97 (Green)
- **Font:** Montserrat
- **Clean, professional design**

### Available Templates

1. **customer-invite.tsx** - Invitation to join the customer portal
2. **request-notification.tsx** - Notify internal staff of new requests
3. **request-status-update.tsx** - Notify customers of request status changes

## Testing

For development, Resend provides a test mode:
- Use `onboarding@resend.dev` as the from address
- Emails will be delivered to your verified email
- Check the Resend dashboard for delivery logs

## Production Considerations

1. **Verify your domain** in Resend to send from your own email address
2. **Set up DKIM/SPF** records for better deliverability
3. **Monitor email quotas:**
   - Free tier: 3,000 emails/month, 100 emails/day
   - Upgrade if needed for higher volume
4. **Add error handling** and retry logic for failed sends
5. **Consider rate limiting** to avoid hitting daily limits

## Future Enhancements

- [ ] Add password reset email template
- [ ] Add welcome email for new users
- [ ] Add email preferences/unsubscribe functionality
- [ ] Add email queue for batch sending
- [ ] Add email analytics tracking
