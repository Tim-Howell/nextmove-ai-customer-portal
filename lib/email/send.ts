'use server';

import { resend } from './client';
import { CustomerInviteEmail } from './templates/customer-invite';
import { RequestNotificationEmail } from './templates/request-notification';
import { RequestStatusUpdateEmail } from './templates/request-status-update';
import { render } from '@react-email/render';

const FROM_EMAIL = 'NextMove AI Portal <noreply@yourdomain.com>';

interface SendCustomerInviteParams {
  to: string;
  customerName: string;
  inviteLink: string;
  invitedBy: string;
}

export async function sendCustomerInvite({
  to,
  customerName,
  inviteLink,
  invitedBy,
}: SendCustomerInviteParams) {
  try {
    const emailHtml = await render(
      CustomerInviteEmail({ customerName, inviteLink, invitedBy }) as React.ReactElement
    );

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `You've been invited to the NextMove AI Customer Portal`,
      html: emailHtml,
    });

    if (error) {
      console.error('Failed to send customer invite email:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending customer invite email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

interface SendRequestNotificationParams {
  to: string | string[];
  customerName: string;
  requestTitle: string;
  requestDescription: string;
  submittedBy: string;
  portalLink: string;
}

export async function sendRequestNotification({
  to,
  customerName,
  requestTitle,
  requestDescription,
  submittedBy,
  portalLink,
}: SendRequestNotificationParams) {
  try {
    const emailHtml = await render(
      RequestNotificationEmail({
        customerName,
        requestTitle,
        requestDescription,
        submittedBy,
        portalLink,
      }) as React.ReactElement
    );

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: Array.isArray(to) ? to : [to],
      subject: `New Request from ${customerName}: ${requestTitle}`,
      html: emailHtml,
    });

    if (error) {
      console.error('Failed to send request notification email:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending request notification email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

interface SendRequestStatusUpdateParams {
  to: string | string[];
  customerName: string;
  requestTitle: string;
  oldStatus: string;
  newStatus: string;
  portalLink: string;
}

export async function sendRequestStatusUpdate({
  to,
  customerName,
  requestTitle,
  oldStatus,
  newStatus,
  portalLink,
}: SendRequestStatusUpdateParams) {
  try {
    const emailHtml = await render(
      RequestStatusUpdateEmail({
        customerName,
        requestTitle,
        oldStatus,
        newStatus,
        portalLink,
      }) as React.ReactElement
    );

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: Array.isArray(to) ? to : [to],
      subject: `Request Status Update: ${requestTitle}`,
      html: emailHtml,
    });

    if (error) {
      console.error('Failed to send request status update email:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending request status update email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
