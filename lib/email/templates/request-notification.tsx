import * as React from 'react';

interface RequestNotificationEmailProps {
  customerName: string;
  requestTitle: string;
  requestDescription: string;
  submittedBy: string;
  portalLink: string;
}

export const RequestNotificationEmail: React.FC<RequestNotificationEmailProps> = ({
  customerName,
  requestTitle,
  requestDescription,
  submittedBy,
  portalLink,
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
        .request-box {
          background-color: #F8F9FA;
          border-left: 4px solid #6FCF97;
          padding: 16px;
          margin: 24px 0;
          border-radius: 4px;
        }
        .request-box h3 {
          margin: 0 0 8px 0;
          color: #2C3E50;
          font-size: 16px;
        }
        .request-box p {
          margin: 0;
          color: #6C757D;
          font-size: 14px;
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
          <h2>New Request Submitted</h2>
          <p>A new request has been submitted by {submittedBy} from {customerName}.</p>
          
          <div className="request-box">
            <h3>{requestTitle}</h3>
            <p>{requestDescription}</p>
          </div>

          <p>Click the button below to view and manage this request in the portal.</p>
          
          <div style={{ textAlign: 'center' }}>
            <a href={portalLink} className="button">
              View Request
            </a>
          </div>
        </div>
        <div className="footer">
          <p>&copy; {new Date().getFullYear()} NextMove AI. All rights reserved.</p>
          <p>This is an automated message, please do not reply to this email.</p>
        </div>
      </div>
    </body>
  </html>
);
