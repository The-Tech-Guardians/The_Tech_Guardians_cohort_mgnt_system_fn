import { adminApi } from '@/lib/adminApi';
import { emailService } from '@/services/emailService';
import { User, InvitationRequest } from '@/types/user';

export interface Invitation extends InvitationRequest {
  id: string;
  token: string;
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED';
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
  acceptedAt?: string;
}

export interface InvitationStats {
  totalInvitations: number;
  pendingInvitations: number;
  acceptedInvitations: number;
  expiredInvitations: number;
}

export interface CreateInvitationData {
  email: string;
  role: 'ADMIN' | 'INSTRUCTOR' | 'LEARNER';
  cohort_id?: string;
  message?: string;
  expiresIn?: number; // hours
}

export interface EmailNotificationData {
  to: string;
  subject: string;
  template: 'invitation' | 'invitation_accepted' | 'invitation_expired';
  data: {
    invitedBy: string;
    role: string;
    cohortName?: string;
    invitationLink: string;
    expiryDate: string;
    customMessage?: string;
  };
}

class InvitationService {
  private API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

  // Create and send invitation
  async createInvitation(data: CreateInvitationData): Promise<Invitation> {
    try {
      const expiresIn = data.expiresIn ?? 72;
      // Create invitation
      const invitation = await adminApi.inviteUser(
        data.email,
        data.role,
        data.cohort_id
      );

      // Send email notification
      await this.sendInvitationEmail({
        to: data.email,
        subject: `Invitation to join as ${data.role}`,
        template: 'invitation',
        data: {
          invitedBy: this.getCurrentUser()?.firstName + ' ' + this.getCurrentUser()?.lastName || 'Admin',
          role: data.role,
          cohortName: data.cohort_id ? await this.getCohortName(data.cohort_id) : undefined,
          invitationLink: this.generateInvitationLink(invitation.uuid || 'unknown'),
          expiryDate: this.calculateExpiryDate(expiresIn),
          customMessage: data.message,
        },
      });

      // Notify admins
      await this.notifyAdminsOfInvitation(invitation, data);

      return {
        id: invitation.uuid || 'unknown',
        token: (invitation as any).token || this.generateToken(),
        status: 'PENDING',
        invitedBy: this.getCurrentUserId(),
        invitedAt: new Date().toISOString(),
        expiresAt: this.calculateExpiryDate(expiresIn),
        email: data.email,
        role: data.role,
        cohort_id: data.cohort_id,
      };
    } catch (error) {
      console.error('Create invitation error:', error);
      throw new Error('Failed to create invitation');
    }
  }

  // Get all invitations
  async getInvitations(page: number = 1, limit: number = 10): Promise<{
    invitations: Invitation[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    try {
      const data = await adminApi.getInvitations(page, limit);
      return {
        invitations: data.invitations || [],
        pagination: data.pagination || { page, limit, total: 0, pages: 1 },
      };
    } catch (error) {
      console.error('Get invitations error:', error);
      return {
        invitations: [],
        pagination: { page, limit, total: 0, pages: 1 },
      };
    }
  }

  // Get invitation statistics
  async getInvitationStats(): Promise<InvitationStats> {
    try {
      const stats = await adminApi.getInvitationStats();
      return stats || {
        totalInvitations: 0,
        pendingInvitations: 0,
        acceptedInvitations: 0,
        expiredInvitations: 0,
      };
    } catch (error) {
      console.error('Get invitation stats error:', error);
      return {
        totalInvitations: 0,
        pendingInvitations: 0,
        acceptedInvitations: 0,
        expiredInvitations: 0,
      };
    }
  }

  // Resend invitation
  async resendInvitation(invitationId: string): Promise<void> {
    try {
      await adminApi.resendInvitation(invitationId);
    } catch (error) {
      console.error('Resend invitation error:', error);
      throw new Error('Failed to resend invitation');
    }
  }

  // Cancel invitation
  async cancelInvitation(invitationId: string): Promise<void> {
    try {
      await adminApi.cancelInvitation(invitationId);
    } catch (error) {
      console.error('Cancel invitation error:', error);
      throw new Error('Failed to cancel invitation');
    }
  }

  // Accept invitation
  async acceptInvitation(token: string, userData: {
    firstName: string;
    lastName: string;
    password: string;
  }): Promise<User> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/invitations/${token}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to accept invitation');
      }

      const data = await response.json();

      // Send notification to admins
      await this.notifyAdminsOfAcceptance(data.user);

      return data.user;
    } catch (error) {
      console.error('Accept invitation error:', error);
      throw new Error('Failed to accept invitation');
    }
  }

  // Verify invitation token
  async verifyInvitation(token: string): Promise<{
    valid: boolean;
    invitation?: Invitation;
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/invitations/${token}/verify`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return { valid: false, error: 'Invalid or expired invitation' };
      }

      const data = await response.json();
      return {
        valid: true,
        invitation: data.invitation,
      };
    } catch (error) {
      console.error('Verify invitation error:', error);
      return { valid: false, error: 'Failed to verify invitation' };
    }
  }

  // Private helper methods
  private async sendInvitationEmail(emailData: EmailNotificationData): Promise<void> {
    try {
      await emailService.sendEmail(emailService.templates.invitation(emailData.data));
    } catch (error) {
      console.error('Send invitation email error:', error);
    }
  }

  private async notifyAdminsOfInvitation(invitation: any, data: CreateInvitationData): Promise<void> {
    try {
      await emailService.notifyAdmins('invitation_sent', {
        invitation,
        invitedBy: this.getCurrentUser(),
        invitationData: data,
      });
    } catch (error) {
      console.error('Notify admins error:', error);
    }
  }

  private async notifyAdminsOfAcceptance(user: User): Promise<void> {
    try {
      await emailService.notifyAdmins('invitation_accepted', {
        user,
        acceptedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Notify admins of acceptance error:', error);
    }
  }

  private async getCohortName(cohortId: string): Promise<string> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/cohorts/${cohortId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        return data.cohort?.name || 'Unknown Cohort';
      }
      return 'Unknown Cohort';
    } catch (error) {
      return 'Unknown Cohort';
    }
  }

  private generateInvitationLink(invitationId: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return `${baseUrl}/invite/${invitationId}`;
  }

  private generateToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private calculateExpiryDate(hours: number): string {
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + hours);
    return expiry.toISOString();
  }

  private getHeaders() {
    const token = this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token') || localStorage.getItem('token');
    }
    return null;
  }

  private getCurrentUser(): any {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user_data');
      if (userData) {
        try {
          return JSON.parse(userData);
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  private getCurrentUserId(): string {
    const user = this.getCurrentUser();
    return user?.uuid || user?.id || 'unknown';
  }
}

export const invitationService = new InvitationService();
