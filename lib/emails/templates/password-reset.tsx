export function getPasswordResetEmailHtml(resetLink: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - NextMove AI Portal</title>
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
                Reset your password
              </h1>
              <p style="margin: 0 0 16px; font-size: 15px; line-height: 1.6; color: #52525b;">
                We received a request to reset the password for your NextMove AI Portal account.
              </p>
              <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #52525b;">
                Click the button below to create a new password. This link will expire in 1 hour.
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center">
                    <a href="${resetLink}" style="display: inline-block; padding: 14px 32px; background-color: #2563eb; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; border-radius: 8px;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Security Notice -->
              <div style="margin-top: 24px; padding: 16px; background-color: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #92400e;">
                  <strong>Security Notice:</strong> If you didn't request a password reset, please ignore this email or contact support if you're concerned about your account security.
                </p>
              </div>
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

export function getPasswordResetEmailText(resetLink: string): string {
  return `
Reset Your Password - NextMove AI Portal

We received a request to reset the password for your NextMove AI Portal account.

Click the link below to create a new password. This link will expire in 1 hour.

${resetLink}

SECURITY NOTICE: If you didn't request a password reset, please ignore this email or contact support if you're concerned about your account security.

© ${new Date().getFullYear()} NextMove AI Services. All rights reserved.
  `.trim();
}
