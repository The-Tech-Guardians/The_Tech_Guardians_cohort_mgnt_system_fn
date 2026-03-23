export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailTemplate {
  invitation: (data: InvitationTemplateData) => EmailData;
  invitation_accepted: (data: InvitationAcceptedTemplateData) => EmailData;
  invitation_expired: (data: InvitationExpiredTemplateData) => EmailData;
  admin_notification: (data: AdminNotificationData) => EmailData;
}

export interface InvitationTemplateData {
  invitedBy: string;
  role: string;
  cohortName?: string;
  invitationLink: string;
  expiryDate: string;
  customMessage?: string;
}

export interface InvitationAcceptedTemplateData {
  userName: string;
  userEmail: string;
  role: string;
  acceptedAt: string;
}

export interface InvitationExpiredTemplateData {
  userEmail: string;
  role: string;
  expiredAt: string;
  resendLink?: string;
}

export interface AdminNotificationData {
  type: 'invitation_sent' | 'invitation_accepted' | 'invitation_expired';
  message: string;
  details: any;
  timestamp: string;
}

class EmailService {
  private API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

  // Send email
  async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        console.error('Failed to send email:', response.status);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Send email error:', error);
      return false;
    }
  }

  // Send email to multiple recipients (for admin notifications)
  async sendEmailToMultipleAdmins(emailData: Omit<EmailData, 'to'> & { to: string[] }): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/email/send-bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        console.error('Failed to send bulk email:', response.status);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Send bulk email error:', error);
      return false;
    }
  }

  // Get all admins for notifications
  async getAdminEmails(): Promise<string[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/users/admins/emails`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        console.error('Failed to get admin emails:', response.status);
        return [];
      }

      const data = await response.json();
      return data.emails || [];
    } catch (error) {
      console.error('Get admin emails error:', error);
      return [];
    }
  }

  // Email templates
  templates: EmailTemplate = {
    invitation: (data: InvitationTemplateData): EmailData => ({
      to: data.invitationLink.includes('localhost') ? 'test@example.com' : data.invitationLink, // Parse email from link or use test
      subject: `Invitation to join as ${data.role}`,
      html: this.generateInvitationHTML(data),
      text: this.generateInvitationText(data),
    }),

    invitation_accepted: (data: InvitationAcceptedTemplateData): EmailData => ({
      to: 'admin@example.com', // This will be replaced with actual admin emails
      subject: `Invitation Accepted by ${data.userName}`,
      html: this.generateInvitationAcceptedHTML(data),
      text: this.generateInvitationAcceptedText(data),
    }),

    invitation_expired: (data: InvitationExpiredTemplateData): EmailData => ({
      to: data.userEmail,
      subject: 'Your Invitation Has Expired',
      html: this.generateInvitationExpiredHTML(data),
      text: this.generateInvitationExpiredText(data),
    }),

    admin_notification: (data: AdminNotificationData): EmailData => ({
      to: 'admin@example.com', // This will be replaced with actual admin emails
      subject: `Admin Notification: ${data.type.replace('_', ' ').toUpperCase()}`,
      html: this.generateAdminNotificationHTML(data),
      text: this.generateAdminNotificationText(data),
    }),
  };

  // HTML Template Generators
  private generateInvitationHTML(data: InvitationTemplateData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Invitation to Join</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
          .expiry { color: #e74c3c; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>You're Invited!</h1>
            <p>Join The Tech Guardians Platform</p>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>You have been invited to join The Tech Guardians platform as a <strong>${data.role}</strong> by <strong>${data.invitedBy}</strong>.</p>
            ${data.cohortName ? `<p>You will be added to the <strong>${data.cohortName}</strong> cohort.</p>` : ''}
            ${data.customMessage ? `<p><em>${data.customMessage}</em></p>` : ''}
            <p>To accept this invitation, click the button below:</p>
            <a href="${data.invitationLink}" class="button">Accept Invitation</a>
            <p>This invitation will expire on <span class="expiry">${data.expiryDate}</span>.</p>
            <p>If you didn't expect this invitation, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 The Tech Guardians. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateInvitationText(data: InvitationTemplateData): string {
    return `
      You're Invited to Join The Tech Guardians Platform!

      You have been invited to join as a ${data.role} by ${data.invitedBy}.
      ${data.cohortName ? `You will be added to the ${data.cohortName} cohort.` : ''}
      ${data.customMessage ? `\n\nMessage: ${data.customMessage}` : ''}

      To accept this invitation, visit: ${data.invitationLink}

      This invitation expires on: ${data.expiryDate}

      If you didn't expect this invitation, you can safely ignore this email.

      © 2024 The Tech Guardians. All rights reserved.
    `;
  }

  private generateInvitationAcceptedHTML(data: InvitationAcceptedTemplateData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Invitation Accepted</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #27ae60; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
          .success { color: #27ae60; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Invitation Accepted!</h1>
          </div>
          <div class="content">
            <p>Good news!</p>
            <p><span class="success">${data.userName}</span> (${data.userEmail}) has accepted the invitation to join as a <strong>${data.role}</strong>.</p>
            <p>Accepted at: ${data.acceptedAt}</p>
            <p>The user can now access the platform with their assigned role.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 The Tech Guardians. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateInvitationAcceptedText(data: InvitationAcceptedTemplateData): string {
    return `
      Invitation Accepted!

      ${data.userName} (${data.userEmail}) has accepted the invitation to join as a ${data.role}.
      
      Accepted at: ${data.acceptedAt}

      The user can now access the platform with their assigned role.

      © 2024 The Tech Guardians. All rights reserved.
    `;
  }

  private generateInvitationExpiredHTML(data: InvitationExpiredTemplateData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Invitation Expired</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #e74c3c; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
          .expired { color: #e74c3c; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Invitation Expired</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>Your invitation to join as a <strong>${data.role}</strong> has <span class="expired">expired</span>.</p>
            <p>Expired on: ${data.expiredAt}</p>
            ${data.resendLink ? `<p>If you still wish to join, you can request a new invitation or contact an administrator.</p>` : ''}
            <p>If you need assistance, please contact our support team.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 The Tech Guardians. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateInvitationExpiredText(data: InvitationExpiredTemplateData): string {
    return `
      Your Invitation Has Expired

      Your invitation to join as a ${data.role} has expired.
      Expired on: ${data.expiredAt}

      If you still wish to join, please contact an administrator to request a new invitation.

      © 2024 The Tech Guardians. All rights reserved.
    `;
  }

  private generateAdminNotificationHTML(data: AdminNotificationData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Admin Notification</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #34495e; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
          .notification { background: #e8f4f8; padding: 15px; border-left: 4px solid #3498db; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Admin Notification</h1>
            <p>${data.type.replace('_', ' ').toUpperCase()}</p>
          </div>
          <div class="content">
            <div class="notification">
              <p><strong>${data.message}</strong></p>
              <p>Time: ${data.timestamp}</p>
            </div>
            <pre style="background: #f0f0f0; padding: 10px; border-radius: 5px; overflow-x: auto;">
              ${JSON.stringify(data.details, null, 2)}
            </pre>
          </div>
          <div class="footer">
            <p>&copy; 2024 The Tech Guardians. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateAdminNotificationText(data: AdminNotificationData): string {
    return `
      Admin Notification: ${data.type.replace('_', ' ').toUpperCase()}

      ${data.message}
      Time: ${data.timestamp}

      Details:
      ${JSON.stringify(data.details, null, 2)}

      © 2024 The Tech Guardians. All rights reserved.
    `;
  }

  // Helper methods
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token') || localStorage.getItem('token');
    }
    return null;
  }

  // Notify all admins
  async notifyAdmins(type: 'invitation_sent' | 'invitation_accepted' | 'invitation_expired', details: any): Promise<void> {
    try {
      const adminEmails = await this.getAdminEmails();
      if (adminEmails.length === 0) {
        console.warn('No admin emails found for notification');
        return;
      }

      const notificationData: AdminNotificationData = {
        type,
        message: this.getNotificationMessage(type, details),
        details,
        timestamp: new Date().toISOString(),
      };

      const emailData = this.templates.admin_notification(notificationData);

      await this.sendEmailToMultipleAdmins({
        ...emailData,
        to: adminEmails,
      });
    } catch (error) {
      console.error('Failed to notify admins:', error);
    }
  }

  private getNotificationMessage(type: string, details: any): string {
    switch (type) {
      case 'invitation_sent':
        return `New invitation sent to ${details.email} as ${details.role}`;
      case 'invitation_accepted':
        return `Invitation accepted by ${details.userName || details.email}`;
      case 'invitation_expired':
        return `Invitation for ${details.email} has expired`;
      default:
        return 'System notification';
    }
  }
}

export const emailService = new EmailService();
