import * as React from 'react';

interface RequestStatusUpdateEmailProps {
  customerName: string;
  requestTitle: string;
  oldStatus: string;
  newStatus: string;
  portalLink: string;
}

export const RequestStatusUpdateEmail: React.FC<RequestStatusUpdateEmailProps> = ({
  customerName,
  requestTitle,
  oldStatus,
  newStatus,
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
        .status-box {
          background-color: #F8F9FA;
          border-left: 4px solid #6FCF97;
          padding: 16px;
          margin: 24px 0;
          border-radius: 4px;
        }
        .status-box h3 {
          margin: 0 0 12px 0;
          color: #2C3E50;
          font-size: 16px;
        }
        .status-change {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
        }
        .status-badge {
          padding: 4px 12px;
          border-radius: 4px;
          font-weight: 600;
        }
        .status-old {
          background-color: #E9ECEF;
          color: #6C757D;
        }
        .status-new {
          background-color: #6FCF97;
          color: #FFFFFF;
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
          <h2>Request Status Updated</h2>
          <p>The status of your request has been updated.</p>
          
          <div className="status-box">
            <h3>{requestTitle}</h3>
            <div className="status-change">
              <span className="status-badge status-old">{oldStatus}</span>
              <span>→</span>
              <span className="status-badge status-new">{newStatus}</span>
            </div>
          </div>

          <p>Click the button below to view the full details in your customer portal.</p>
          
          <div style={{ textAlign: 'center' }}>
            <a href={portalLink} className="button">
              View Request Details
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
