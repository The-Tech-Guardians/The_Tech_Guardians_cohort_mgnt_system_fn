import { invitationService } from './invitationService';
import { emailService } from './emailService';

export interface ReminderConfig {
  enabled: boolean;
  reminders: {
    hoursBefore: number;
    template: 'reminder' | 'final_reminder';
    sendToAdmins: boolean;
  }[];
}

export interface ReminderJob {
  id: string;
  invitationId: string;
  scheduledFor: Date;
  reminderType: 'reminder' | 'final_reminder';
  status: 'scheduled' | 'sent' | 'failed';
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  lastAttempt?: Date;
  error?: string;
}

class InvitationReminderService {
  private static instance: InvitationReminderService;
  private reminderJobs: Map<string, ReminderJob> = new Map();
  private reminderInterval: NodeJS.Timeout | null = null;
  private isRunning = false;

  private readonly DEFAULT_CONFIG: ReminderConfig = {
    enabled: true,
    reminders: [
      {
        hoursBefore: 24,
        template: 'reminder',
        sendToAdmins: true,
      },
      {
        hoursBefore: 6,
        template: 'final_reminder',
        sendToAdmins: true,
      },
    ],
  };

  private constructor() {}

  static getInstance(): InvitationReminderService {
    if (!InvitationReminderService.instance) {
      InvitationReminderService.instance = new InvitationReminderService();
    }
    return InvitationReminderService.instance;
  }

  // Start the reminder service
  start(config?: Partial<ReminderConfig>): void {
    if (this.isRunning) {
      console.warn('Reminder service is already running');
      return;
    }

    const finalConfig = { ...this.DEFAULT_CONFIG, ...config };
    
    if (!finalConfig.enabled) {
      console.log('Reminder service is disabled');
      return;
    }

    this.isRunning = true;
    console.log('Starting invitation reminder service');

    // Schedule reminders for existing pending invitations
    this.scheduleRemindersForPendingInvitations(finalConfig);

    // Start the reminder check interval (every hour)
    this.reminderInterval = setInterval(() => {
      this.processScheduledReminders();
    }, 60 * 60 * 1000); // 1 hour

    // Also check every 5 minutes for more precise timing
    setInterval(() => {
      this.checkImmediateReminders();
    }, 5 * 60 * 1000); // 5 minutes
  }

  // Stop the reminder service
  stop(): void {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    
    if (this.reminderInterval) {
      clearInterval(this.reminderInterval);
      this.reminderInterval = null;
    }

    console.log('Invitation reminder service stopped');
  }

  // Schedule reminders for a new invitation
  async scheduleRemindersForInvitation(invitationId: string, expiresAt: string, config?: Partial<ReminderConfig>): Promise<void> {
    const finalConfig = { ...this.DEFAULT_CONFIG, ...config };
    
    if (!finalConfig.enabled) {
      return;
    }

    const expiryDate = new Date(expiresAt);
    const now = new Date();

    for (const reminder of finalConfig.reminders) {
      const reminderTime = new Date(expiryDate.getTime() - reminder.hoursBefore * 60 * 60 * 1000);
      
      // Only schedule if reminder time is in the future
      if (reminderTime > now) {
        const job: ReminderJob = {
          id: `${invitationId}-${reminder.hoursBefore}h`,
          invitationId,
          scheduledFor: reminderTime,
          reminderType: reminder.template as 'reminder' | 'final_reminder',
          status: 'scheduled',
          attempts: 0,
          maxAttempts: 3,
          createdAt: now,
        };

        this.reminderJobs.set(job.id, job);
        console.log(`Scheduled ${reminder.template} for invitation ${invitationId} at ${reminderTime.toISOString()}`);
      }
    }
  }

  // Schedule reminders for all pending invitations
  private async scheduleRemindersForPendingInvitations(config?: Partial<ReminderConfig>): Promise<void> {
    try {
      const finalConfig = { ...this.DEFAULT_CONFIG, ...config };
      
      // Get all pending invitations
      const response = await invitationService.getInvitations(1, 100); // Get first 100, could paginate
      const pendingInvitations = response.invitations.filter(inv => inv.status === 'PENDING');

      for (const invitation of pendingInvitations) {
        await this.scheduleRemindersForInvitation(invitation.id, invitation.expiresAt, finalConfig);
      }

      console.log(`Scheduled reminders for ${pendingInvitations.length} pending invitations`);
    } catch (error) {
      console.error('Failed to schedule reminders for pending invitations:', error);
    }
  }

  // Process scheduled reminders
  private async processScheduledReminders(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    const now = new Date();
    const jobsToProcess: ReminderJob[] = [];

    // Find jobs that are ready to be processed
    for (const job of this.reminderJobs.values()) {
      if (job.status === 'scheduled' && job.scheduledFor <= now) {
        jobsToProcess.push(job);
      }
    }

    console.log(`Processing ${jobsToProcess.length} reminder jobs`);

    for (const job of jobsToProcess) {
      await this.processReminderJob(job);
    }
  }

  // Check for immediate reminders (for more precise timing)
  private async checkImmediateReminders(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    const now = new Date();
    const jobsToProcess: ReminderJob[] = [];

    // Find jobs that should be processed in the next 5 minutes
    for (const job of this.reminderJobs.values()) {
      if (job.status === 'scheduled' && 
          job.scheduledFor > now && 
          job.scheduledFor <= new Date(now.getTime() + 5 * 60 * 1000)) {
        jobsToProcess.push(job);
      }
    }

    if (jobsToProcess.length > 0) {
      console.log(`Found ${jobsToProcess.length} immediate reminders to process`);
      for (const job of jobsToProcess) {
        await this.processReminderJob(job);
      }
    }
  }

  // Process a single reminder job
  private async processReminderJob(job: ReminderJob): Promise<void> {
    try {
      job.attempts++;
      job.lastAttempt = new Date();

      // Get the invitation details
      const invitation = await this.getInvitationDetails(job.invitationId);
      
      if (!invitation || invitation.status !== 'PENDING') {
        // Invitation no longer exists or is not pending, cancel the job
        job.status = 'sent'; // Mark as sent to avoid retrying
        console.log(`Cancelled reminder job ${job.id} - invitation no longer pending`);
        return;
      }

      // Send reminder email
      await this.sendReminderEmail(invitation, job.reminderType);

      // Send notification to admins
      await this.notifyAdminsOfReminder(invitation, job.reminderType);

      job.status = 'sent';
      console.log(`Successfully sent ${job.reminderType} for invitation ${job.invitationId}`);

    } catch (error) {
      job.error = error instanceof Error ? error.message : 'Unknown error';
      
      if (job.attempts >= job.maxAttempts) {
        job.status = 'failed';
        console.error(`Failed to send reminder ${job.id} after ${job.maxAttempts} attempts:`, error);
      } else {
        // Schedule retry (exponential backoff)
        const retryDelay = Math.pow(2, job.attempts) * 60 * 1000; // 2, 4, 8 minutes
        const retryTime = new Date(Date.now() + retryDelay);
        job.scheduledFor = retryTime;
        job.status = 'scheduled';
        console.log(`Scheduled retry for reminder ${job.id} at ${retryTime.toISOString()}`);
      }
    }
  }

  // Send reminder email
  private async sendReminderEmail(invitation: any, reminderType: 'reminder' | 'final_reminder'): Promise<void> {
    const hoursRemaining = this.calculateHoursRemaining(invitation.expiresAt);
    
    const emailData = {
      to: invitation.email,
      subject: reminderType === 'final_reminder' 
        ? 'Final Reminder: Your Invitation Expires Soon!'
        : 'Reminder: Your Invitation is Expiring Soon',
      template: reminderType === 'final_reminder' ? 'invitation_expired' : 'invitation',
      data: {
        invitedBy: invitation.invitedBy,
        role: invitation.role,
        cohortName: invitation.cohort_id ? await this.getCohortName(invitation.cohort_id) : undefined,
        invitationLink: this.generateInvitationLink(invitation.id),
        expiryDate: new Date(invitation.expiresAt).toLocaleString(),
        hoursRemaining,
        isReminder: true,
        reminderType,
      },
    };

    await emailService.sendEmail(emailService.templates.invitation(emailData.data));
  }

  // Notify admins about reminder
  private async notifyAdminsOfReminder(invitation: any, reminderType: 'reminder' | 'final_reminder'): Promise<void> {
    await emailService.notifyAdmins('invitation_expired', {
      type: 'reminder_sent',
      invitation,
      reminderType,
      hoursRemaining: this.calculateHoursRemaining(invitation.expiresAt),
      timestamp: new Date().toISOString(),
    });
  }

  // Helper methods
  private async getInvitationDetails(invitationId: string): Promise<any> {
    try {
      const response = await invitationService.getInvitations(1, 100);
      return response.invitations.find(inv => inv.id === invitationId);
    } catch (error) {
      console.error('Failed to get invitation details:', error);
      return null;
    }
  }

  private calculateHoursRemaining(expiresAt: string): number {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffMs = expiry.getTime() - now.getTime();
    return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));
  }

  private async getCohortName(cohortId: string): Promise<string> {
    try {
      // This would need to be implemented based on your cohort service
      return `Cohort ${cohortId}`;
    } catch (error) {
      return 'Unknown Cohort';
    }
  }

  private generateInvitationLink(invitationId: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return `${baseUrl}/invite/${invitationId}`;
  }

  // Get reminder statistics
  getReminderStats(): {
    total: number;
    scheduled: number;
    sent: number;
    failed: number;
  } {
    const jobs = Array.from(this.reminderJobs.values());
    
    return {
      total: jobs.length,
      scheduled: jobs.filter(job => job.status === 'scheduled').length,
      sent: jobs.filter(job => job.status === 'sent').length,
      failed: jobs.filter(job => job.status === 'failed').length,
    };
  }

  // Get all reminder jobs
  getAllReminderJobs(): ReminderJob[] {
    return Array.from(this.reminderJobs.values());
  }

  // Cancel reminder jobs for an invitation
  cancelReminderJobs(invitationId: string): void {
    const jobsToCancel = Array.from(this.reminderJobs.values())
      .filter(job => job.invitationId === invitationId);

    for (const job of jobsToCancel) {
      this.reminderJobs.delete(job.id);
    }

    console.log(`Cancelled ${jobsToCancel.length} reminder jobs for invitation ${invitationId}`);
  }
}

export const invitationReminderService = InvitationReminderService.getInstance();
