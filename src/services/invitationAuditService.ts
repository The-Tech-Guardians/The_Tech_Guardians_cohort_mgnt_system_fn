import { Invitation } from './invitationService';

export interface AuditLogEntry {
  id: string;
  invitationId: string;
  action: AuditAction;
  timestamp: string;
  userId: string;
  userName: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  errorMessage?: string;
}

export type AuditAction = 
  | 'invitation_created'
  | 'invitation_sent'
  | 'invitation_viewed'
  | 'invitation_accepted'
  | 'invitation_resend'
  | 'invitation_cancelled'
  | 'invitation_expired'
  | 'reminder_sent'
  | 'reminder_failed'
  | 'bulk_upload_started'
  | 'bulk_upload_completed'
  | 'export_downloaded';

export interface AuditFilter {
  action?: AuditAction[];
  userId?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  invitationId?: string;
  success?: boolean;
  search?: string;
}

class InvitationAuditService {
  private static instance: InvitationAuditService;
  private auditLogs: AuditLogEntry[] = [];
  private maxLogs = 10000; // Keep last 10,000 logs in memory

  private constructor() {}

  static getInstance(): InvitationAuditService {
    if (!InvitationAuditService.instance) {
      InvitationAuditService.instance = new InvitationAuditService();
    }
    return InvitationAuditService.instance;
  }

  // Log an audit event
  log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
    const auditEntry: AuditLogEntry = {
      ...entry,
      id: this.generateLogId(),
      timestamp: new Date().toISOString(),
    };

    // Add to logs
    this.auditLogs.unshift(auditEntry);

    // Maintain max log size
    if (this.auditLogs.length > this.maxLogs) {
      this.auditLogs = this.auditLogs.slice(0, this.maxLogs);
    }

    // In a real implementation, this would also be sent to a backend service
    console.log('Audit log:', auditEntry);
  }

  // Get audit logs with filtering and pagination
  getLogs(filter?: AuditFilter, page: number = 1, limit: number = 50): {
    logs: AuditLogEntry[];
    total: number;
    page: number;
    totalPages: number;
  } {
    let filteredLogs = [...this.auditLogs];

    // Apply filters
    if (filter) {
      if (filter.action && filter.action.length > 0) {
        filteredLogs = filteredLogs.filter(log => filter.action!.includes(log.action));
      }

      if (filter.userId && filter.userId.length > 0) {
        filteredLogs = filteredLogs.filter(log => filter.userId!.includes(log.userId));
      }

      if (filter.dateRange) {
        const start = new Date(filter.dateRange.start);
        const end = new Date(filter.dateRange.end);
        filteredLogs = filteredLogs.filter(log => {
          const logDate = new Date(log.timestamp);
          return logDate >= start && logDate <= end;
        });
      }

      if (filter.invitationId) {
        filteredLogs = filteredLogs.filter(log => log.invitationId === filter.invitationId);
      }

      if (filter.success !== undefined) {
        filteredLogs = filteredLogs.filter(log => log.success === filter.success);
      }

      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        filteredLogs = filteredLogs.filter(log => 
          log.userName.toLowerCase().includes(searchLower) ||
          log.invitationId.toLowerCase().includes(searchLower) ||
          JSON.stringify(log.details).toLowerCase().includes(searchLower)
        );
      }
    }

    const total = filteredLogs.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      logs: filteredLogs.slice(startIndex, endIndex),
      total,
      page,
      totalPages,
    };
  }

  // Get audit statistics
  getAuditStats(filter?: AuditFilter): {
    totalEvents: number;
    successfulEvents: number;
    failedEvents: number;
    actionBreakdown: Record<AuditAction, number>;
    dailyActivity: Array<{
      date: string;
      count: number;
    }>;
    topUsers: Array<{
      userId: string;
      userName: string;
      count: number;
    }>;
  } {
    const { logs } = this.getLogs(filter, 1, this.maxLogs);
    
    const successfulEvents = logs.filter(log => log.success).length;
    const failedEvents = logs.filter(log => !log.success).length;

    // Action breakdown
    const actionBreakdown: Record<string, number> = {};
    logs.forEach(log => {
      actionBreakdown[log.action] = (actionBreakdown[log.action] || 0) + 1;
    });

    // Daily activity (last 30 days)
    const dailyActivity = this.generateDailyActivity(logs);

    // Top users
    const topUsers = this.generateTopUsers(logs);

    return {
      totalEvents: logs.length,
      successfulEvents,
      failedEvents,
      actionBreakdown: actionBreakdown as Record<AuditAction, number>,
      dailyActivity,
      topUsers,
    };
  }

  // Get invitation history
  getInvitationHistory(invitationId: string): AuditLogEntry[] {
    return this.auditLogs
      .filter(log => log.invitationId === invitationId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Export audit logs
  exportLogs(filter?: AuditFilter): string {
    const { logs } = this.getLogs(filter, 1, this.maxLogs);
    
    const csvHeaders = [
      'Timestamp',
      'Action',
      'Invitation ID',
      'User ID',
      'User Name',
      'Success',
      'Error Message',
      'IP Address',
      'Details'
    ];

    const csvRows = logs.map(log => [
      log.timestamp,
      log.action,
      log.invitationId,
      log.userId,
      log.userName,
      log.success.toString(),
      log.errorMessage || '',
      log.ipAddress || '',
      JSON.stringify(log.details)
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csvContent;
  }

  // Clear old logs (maintenance)
  clearOldLogs(olderThanDays: number): number {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const originalLength = this.auditLogs.length;
    this.auditLogs = this.auditLogs.filter(log => 
      new Date(log.timestamp) >= cutoffDate
    );

    return originalLength - this.auditLogs.length;
  }

  // Helper methods
  private generateLogId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateDailyActivity(logs: AuditLogEntry[]): Array<{ date: string; count: number }> {
    const dailyMap = new Map<string, number>();
    const today = new Date();

    // Initialize last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dailyMap.set(dateStr, 0);
    }

    // Count logs per day
    logs.forEach(log => {
      const dateStr = log.timestamp.split('T')[0];
      if (dailyMap.has(dateStr)) {
        dailyMap.set(dateStr, (dailyMap.get(dateStr) || 0) + 1);
      }
    });

    return Array.from(dailyMap.entries()).map(([date, count]) => ({
      date,
      count,
    }));
  }

  private generateTopUsers(logs: AuditLogEntry[]): Array<{
    userId: string;
    userName: string;
    count: number;
  }> {
    const userCounts = new Map<string, { userName: string; count: number }>();

    logs.forEach(log => {
      const existing = userCounts.get(log.userId);
      if (existing) {
        existing.count++;
      } else {
        userCounts.set(log.userId, { userName: log.userName, count: 1 });
      }
    });

    return Array.from(userCounts.entries())
      .map(([userId, data]) => ({ userId, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  // Convenience methods for common audit events
  logInvitationCreated(invitationId: string, userId: string, userName: string, details: any): void {
    this.log({
      invitationId,
      action: 'invitation_created',
      userId,
      userName,
      details,
      success: true,
    });
  }

  logInvitationSent(invitationId: string, userId: string, userName: string, details: any): void {
    this.log({
      invitationId,
      action: 'invitation_sent',
      userId,
      userName,
      details,
      success: true,
    });
  }

  logInvitationAccepted(invitationId: string, userId: string, userName: string, details: any): void {
    this.log({
      invitationId,
      action: 'invitation_accepted',
      userId,
      userName,
      details,
      success: true,
    });
  }

  logInvitationResent(invitationId: string, userId: string, userName: string, details: any): void {
    this.log({
      invitationId,
      action: 'invitation_resend',
      userId,
      userName,
      details,
      success: true,
    });
  }

  logInvitationCancelled(invitationId: string, userId: string, userName: string, details: any): void {
    this.log({
      invitationId,
      action: 'invitation_cancelled',
      userId,
      userName,
      details,
      success: true,
    });
  }

  logInvitationExpired(invitationId: string, details: any): void {
    this.log({
      invitationId,
      action: 'invitation_expired',
      userId: 'system',
      userName: 'System',
      details,
      success: true,
    });
  }

  logReminderSent(invitationId: string, details: any): void {
    this.log({
      invitationId,
      action: 'reminder_sent',
      userId: 'system',
      userName: 'System',
      details,
      success: true,
    });
  }

  logBulkUploadStarted(userId: string, userName: string, details: any): void {
    this.log({
      invitationId: 'bulk',
      action: 'bulk_upload_started',
      userId,
      userName,
      details,
      success: true,
    });
  }

  logBulkUploadCompleted(userId: string, userName: string, details: any): void {
    this.log({
      invitationId: 'bulk',
      action: 'bulk_upload_completed',
      userId,
      userName,
      details,
      success: true,
    });
  }

  logExportDownloaded(userId: string, userName: string, details: any): void {
    this.log({
      invitationId: 'export',
      action: 'export_downloaded',
      userId,
      userName,
      details,
      success: true,
    });
  }

  logError(invitationId: string, action: AuditAction, userId: string, userName: string, error: string, details: any): void {
    this.log({
      invitationId,
      action,
      userId,
      userName,
      details,
      success: false,
      errorMessage: error,
    });
  }
}

export const invitationAuditService = InvitationAuditService.getInstance();
