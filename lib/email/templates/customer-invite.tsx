import * as React from 'react';

interface CustomerInviteEmailProps {
  customerName: string;
  inviteLink: string;
  invitedBy: string;
}

export const CustomerInviteEmail: React.FC<CustomerInviteEmailProps> = ({
  customerName,
  inviteLink,
  invitedBy,
}) => (
  <html>
    <head>
      <style>{`
        body {
          font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          line-height: 1.6;
          color: #2C3E50;
          background-color: #F8F9FA;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #FFFFFF;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #2C3E50;
          padding: 32px 24px;
          text-align: center;
        }
        .header h1 {
          color: #FFFFFF;
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }
        .content {
          padding: 32px 24px;
        }
        .content h2 {
          color: #2C3E50;
          font-size: 20px;
          font-weight: 600;
          margin-top: 0;
        }
        .content p {
          color: #2C3E50;
          margin: 16px 0;
        }
        .button {
          display: inline-block;
          background-color: #6FCF97;
          color: #FFFFFF;
          text-decoration: none;
          padding: 14px 32px;
          border-radius: 6px;
          font-weight: 600;
          margin: 24px 0;
        }
        .button:hover {
          background-color: #5AB881;
        }
        .footer {
          background-color: #F8F9FA;
          padding: 24px;
          text-align: center;
          color: #6C757D;
          font-size: 14px;
        }
        .footer p {
          margin: 8px 0;
        }
      `}</style>
    </head>
    <body>
      <div className="container">
        <div className="header">
          <h1>NextMove AI Customer Portal</h1>
        </div>
        <div className="content">
          <h2>You've been invited to the Customer Portal</h2>
          <p>Hello,</p>
          <p>
            {invitedBy} has invited you to access the NextMove AI Customer Portal for{' '}
            <strong>{customerName}</strong>.
          </p>
          <p>
            Click the button below to set up your account and access your customer dashboard,
            contracts, time logs, and more.
          </p>
          <div style={{ textAlign: 'center' }}>
            <a href={inviteLink} className="button">
              Accept Invitation
            </a>
          </div>
          <p style={{ fontSize: '14px', color: '#6C757D' }}>
            This invitation link will expire in 7 days. If you have any questions, please contact
            your NextMove AI representative.
          </p>
        </div>
        <div className="footer">
          <p>&copy; {new Date().getFullYear()} NextMove AI. All rights reserved.</p>
          <p>This is an automated message, please do not reply to this email.</p>
        </div>
      </div>
    </body>
  </html>
);
