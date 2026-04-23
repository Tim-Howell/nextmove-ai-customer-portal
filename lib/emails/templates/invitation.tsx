interface InvitationEmailParams {
  inviteLink: string;
  customerName: string;
  contactName?: string;
}

export function getInvitationEmailHtml({ inviteLink, customerName, contactName }: InvitationEmailParams): string {
  const greeting = contactName ? `Hi ${contactName},` : "Hello,";
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to NextMove AI Portal</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 480px; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #e4e4e7;">
              <div style="font-size: 24px; font-weight: 700; color: #18181b;">
                <span style="color: #2563eb;">NextMove</span> AI
              </div>
              <div style="font-size: 12px; color: #71717a; margin-top: 4px; letter-spacing: 0.5px;">
                CUSTOMER PORTAL
              </div>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <h1 style="margin: 0 0 16px; font-size: 20px; font-weight: 600; color: #18181b;">
                Welcome to the Portal! 🎉
              </h1>
              <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.6; color: #52525b;">
                ${greeting}
              </p>
              <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.6; color: #52525b;">
                You've been invited to access the NextMove AI Customer Portal for <strong>${customerName}</strong>.
              </p>
              <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #52525b;">
                The portal gives you access to:
              </p>
              
              <!-- Features List -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #52525b;">
                    ✓ View your priorities and project status
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #52525b;">
                    ✓ Submit and track requests
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 14px; color: #52525b;">
                    ✓ Access contract and billing information
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center">
                    <a href="${inviteLink}" style="display: inline-block; padding: 14px 32px; background-color: #2563eb; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; border-radius: 8px;">
                      Accept Invitation
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 24px 0 0; font-size: 13px; line-height: 1.6; color: #71717a;">
                This invitation link will expire in 7 days. If you have any questions, please contact your NextMove AI representative.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #fafafa; border-top: 1px solid #e4e4e7; border-radius: 0 0 12px 12px;">
              <p style="margin: 0; font-size: 12px; color: #71717a; text-align: center;">
                © ${new Date().getFullYear()} NextMove AI Services. All rights reserved.
              </p>
              <p style="margin: 8px 0 0; font-size: 11px; color: #a1a1aa; text-align: center;">
                This is an automated message. Please do not reply to this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function getInvitationEmailText({ inviteLink, customerName, contactName }: InvitationEmailParams): string {
  const greeting = contactName ? `Hi ${contactName},` : "Hello,";
  
  return `
Welcome to NextMove AI Portal!

${greeting}

You've been invited to access the NextMove AI Customer Portal for ${customerName}.

The portal gives you access to:
- View your priorities and project status
- Submit and track requests
- Access contract and billing information

Click the link below to accept your invitation:
${inviteLink}

This invitation link will expire in 7 days. If you have any questions, please contact your NextMove AI representative.

© ${new Date().getFullYear()} NextMove AI Services. All rights reserved.
  `.trim();
}
