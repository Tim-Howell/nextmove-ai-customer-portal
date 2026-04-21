# Resend Email Integration - Quick Setup Guide

## ✅ What's Been Set Up

1. **Resend package installed** (`resend` + `@react-email/render`)
2. **Email client configured** at `lib/email/client.ts`
3. **Three email templates created:**
   - Customer invitation emails
   - Request notification emails (for internal staff)
   - Request status update emails (for customers)
4. **Server actions ready** at `lib/email/send.ts`
5. **Environment variable placeholder** added to `.env.example`

## 🚀 Next Steps to Go Live

### 1. Get Your Resend API Key

1. Sign up at [resend.com](https://resend.com)
2. Go to **API Keys** in your dashboard
3. Click **Create API Key**
4. Copy the key (starts with `re_`)

### 2. Add to Your Environment

Add to your `.env.local` file:

```bash
RESEND_API_KEY=re_your_actual_api_key_here
```

### 3. Configure Sender Email

**For Development/Testing:**
```typescript
// In lib/email/send.ts, line 9
const FROM_EMAIL = 'NextMove AI Portal <onboarding@resend.dev>';
```

**For Production:**
1. Verify your domain in Resend dashboard
2. Add DNS records (DKIM, SPF, DMARC)
3. Update to your domain:
```typescript
const FROM_EMAIL = 'NextMove AI Portal <noreply@nextmove.ai>';
```

### 4. Test the Integration

Create a test file to verify emails work:

```typescript
// test-email.ts
import { sendCustomerInvite } from '@/lib/email';

await sendCustomerInvite({
  to: 'your-email@example.com',
  customerName: 'Test Company',
  inviteLink: 'https://portal.nextmove.ai/invite/test123',
  invitedBy: 'Test Admin'
});
```

## 📧 How to Use in Your App

### Send Customer Invite (Phase 4)

```typescript
import { sendCustomerInvite } from '@/lib/email';

// When enabling portal access for a customer contact
const result = await sendCustomerInvite({
  to: contact.email,
  customerName: customer.name,
  inviteLink: `${process.env.NEXT_PUBLIC_APP_URL}/invite/${inviteToken}`,
  invitedBy: currentUser.name
});

if (result.success) {
  // Show success message
} else {
  // Handle error
  console.error(result.error);
}
```

### Send Request Notification (Phase 8)

```typescript
import { sendRequestNotification } from '@/lib/email';

// When a customer submits a new request
await sendRequestNotification({
  to: ['admin@nextmove.ai', 'staff@nextmove.ai'],
  customerName: customer.name,
  requestTitle: request.title,
  requestDescription: request.description,
  submittedBy: user.name,
  portalLink: `${process.env.NEXT_PUBLIC_APP_URL}/requests/${request.id}`
});
```

### Send Status Update (Phase 8)

```typescript
import { sendRequestStatusUpdate } from '@/lib/email';

// When request status changes
await sendRequestStatusUpdate({
  to: customerContact.email,
  customerName: customer.name,
  requestTitle: request.title,
  oldStatus: 'New',
  newStatus: 'In Progress',
  portalLink: `${process.env.NEXT_PUBLIC_APP_URL}/requests/${request.id}`
});
```

## 📊 Resend Free Tier Limits

- **3,000 emails/month**
- **100 emails/day**
- Perfect for MVP and early production

## 🔍 Monitoring

Check email delivery in your Resend dashboard:
- View sent emails
- Check delivery status
- See bounce/complaint rates
- Monitor API usage

## ⚠️ Important Notes

1. **Never commit your API key** - it's already in `.gitignore` via `.env.local`
2. **Use `onboarding@resend.dev`** for testing (no domain verification needed)
3. **Verify your domain** before production launch
4. **Add error handling** in production code
5. **Consider rate limiting** to stay within daily limits

## 🎨 Email Branding

All templates use NextMove AI branding:
- Primary Navy: `#2C3E50`
- NextMove Green: `#6FCF97`
- Montserrat font
- Clean, professional design

## 📝 Files Created

```
lib/email/
├── client.ts                          # Resend client initialization
├── send.ts                            # Server actions for sending emails
├── index.ts                           # Public exports
├── README.md                          # Detailed documentation
└── templates/
    ├── customer-invite.tsx            # Customer invitation template
    ├── request-notification.tsx       # New request notification
    └── request-status-update.tsx      # Status change notification
```

## ✨ Ready to Use!

The integration is complete and ready to use. Just add your API key and start sending emails!
