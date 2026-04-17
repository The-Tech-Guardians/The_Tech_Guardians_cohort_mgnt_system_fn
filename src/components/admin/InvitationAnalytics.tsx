'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { invitationService, Invitation, InvitationStats } from '@/services/invitationService';
import { invitationReminderService } from '@/services/invitationReminderService';
import { Calendar, TrendingUp, Users, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface AnalyticsData {
  overview: InvitationStats;
  timelineData: Array<{
    date: string;
    sent: number;
    accepted: number;
    expired: number;
  }>;
  roleDistribution: Array<{
    role: string;
    count: number;
    percentage: number;
  }>;
  cohortDistribution: Array<{
    cohort: string;
    invitations: number;
    acceptances: number;
    acceptanceRate: number;
  }>;
  timeToAccept: Array<{
    hours: string;
    count: number;
  }>;
  reminderStats: {
    total: number;
    scheduled: number;
    sent: number;
    failed: number;
  };
}

const COLORS = ['#059669', '#0d9488', '#0891b2'];

export default function InvitationAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get basic stats
      const stats = await invitationService.getInvitationStats();
      
      // Get all invitations for detailed analysis
      const allInvitations = await fetchAllInvitations();
      
      // Process analytics data
      const processedData = processAnalyticsData(allInvitations, stats);
      
      // Get reminder stats
      const reminderStats = invitationReminderService.getReminderStats();
      processedData.reminderStats = reminderStats;

      setAnalyticsData(processedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllInvitations = async (): Promise<Invitation[]> => {
    const allInvitations: Invitation[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      try {
        const response = await invitationService.getInvitations(page, 50);
        allInvitations.push(...response.invitations);
        hasMore = page < response.pagination.pages;
        page++;
      } catch (error) {
        console.error('Failed to fetch invitations page:', page, error);
        break;
      }
    }

    return allInvitations;
  };

  const processAnalyticsData = (invitations: Invitation[], stats: InvitationStats): AnalyticsData => {
    // Filter by time range
    const filteredInvitations = filterInvitationsByTimeRange(invitations);
    
    // Timeline data
    const timelineData = generateTimelineData(filteredInvitations);
    
    // Role distribution
    const roleDistribution = generateRoleDistribution(filteredInvitations);
    
    // Cohort distribution
    const cohortDistribution = generateCohortDistribution(filteredInvitations);
    
    // Time to accept analysis
    const timeToAccept = generateTimeToAcceptData(filteredInvitations);

    return {
      overview: stats,
      timelineData,
      roleDistribution,
      cohortDistribution,
      timeToAccept,
      reminderStats: {
        total: 0,
        scheduled: 0,
        sent: 0,
        failed: 0,
      },
    };
  };

  const filterInvitationsByTimeRange = (invitations: Invitation[]): Invitation[] => {
    if (timeRange === 'all') return invitations;
    
    const now = new Date();
    const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    
    return invitations.filter(inv => new Date(inv.invitedAt) >= cutoffDate);
  };

  const generateTimelineData = (invitations: Invitation[]) => {
    const dailyData = new Map<string, { sent: number; accepted: number; expired: number }>();
    
    // Initialize with last 30 days
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      dailyData.set(dateStr, { sent: 0, accepted: 0, expired: 0 });
    }

    // Process invitations
    invitations.forEach(inv => {
      const invitedDate = new Date(inv.invitedAt).toISOString().split('T')[0];
      const data = dailyData.get(invitedDate) || { sent: 0, accepted: 0, expired: 0 };
      data.sent++;
      dailyData.set(invitedDate, data);

      if (inv.acceptedAt) {
        const acceptedDate = new Date(inv.acceptedAt).toISOString().split('T')[0];
        const acceptedData = dailyData.get(acceptedDate) || { sent: 0, accepted: 0, expired: 0 };
        acceptedData.accepted++;
        dailyData.set(acceptedDate, acceptedData);
      }

      if (inv.status === 'EXPIRED') {
        const expiredDate = new Date(inv.expiresAt).toISOString().split('T')[0];
        const expiredData = dailyData.get(expiredDate) || { sent: 0, accepted: 0, expired: 0 };
        expiredData.expired++;
        dailyData.set(expiredDate, expiredData);
      }
    });

    return Array.from(dailyData.entries()).map(([date, data]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      ...data,
    }));
  };

  const generateRoleDistribution = (invitations: Invitation[]) => {
    const roleCounts = new Map<string, number>();
    
    invitations.forEach(inv => {
      roleCounts.set(inv.role, (roleCounts.get(inv.role) || 0) + 1);
    });

    const total = invitations.length;
    return Array.from(roleCounts.entries()).map(([role, count]) => ({
      role,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }));
  };

  const generateCohortDistribution = (invitations: Invitation[]) => {
    const cohortData = new Map<string, { invitations: number; acceptances: number }>();
    
    invitations.forEach(inv => {
      const cohort = inv.cohort_id || 'Unassigned';
      const data = cohortData.get(cohort) || { invitations: 0, acceptances: 0 };
      data.invitations++;
      if (inv.status === 'ACCEPTED') {
        data.acceptances++;
      }
      cohortData.set(cohort, data);
    });

    return Array.from(cohortData.entries()).map(([cohort, data]) => ({
      cohort,
      invitations: data.invitations,
      acceptances: data.acceptances,
      acceptanceRate: data.invitations > 0 ? Math.round((data.acceptances / data.invitations) * 100) : 0,
    }));
  };

  const generateTimeToAcceptData = (invitations: Invitation[]) => {
    const acceptedInvitations = invitations.filter(inv => inv.acceptedAt);
    const timeBuckets = new Map<string, number>();

    acceptedInvitations.forEach(inv => {
      const invitedTime = new Date(inv.invitedAt).getTime();
      const acceptedTime = new Date(inv.acceptedAt!).getTime();
      const hoursDiff = Math.floor((acceptedTime - invitedTime) / (1000 * 60 * 60));
      
      let bucket: string;
      if (hoursDiff < 1) bucket = '< 1 hour';
      else if (hoursDiff < 6) bucket = '1-6 hours';
      else if (hoursDiff < 24) bucket = '6-24 hours';
      else if (hoursDiff < 72) bucket = '1-3 days';
      else bucket = '> 3 days';
      
      timeBuckets.set(bucket, (timeBuckets.get(bucket) || 0) + 1);
    });

    return Array.from(timeBuckets.entries()).map(([hours, count]) => ({
      hours,
      count,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !analyticsData) {
    return (
      <div className="text-center py-12 bg-red-50 rounded-lg">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600">{error || 'No analytics data available'}</p>
      </div>
    );
  }

  const { overview, timelineData, roleDistribution, cohortDistribution, timeToAccept, reminderStats } = analyticsData;
  const acceptanceRate = overview.totalInvitations > 0 
    ? Math.round((overview.acceptedInvitations / overview.totalInvitations) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Invitation Analytics</h2>
        <div className="flex space-x-2">
          {(['7d', '30d', '90d', 'all'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range === 'all' ? 'All Time' : range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Invitations</p>
              <p className="text-2xl font-bold text-gray-900">{overview.totalInvitations}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Acceptance Rate</p>
              <p className="text-2xl font-bold text-green-600">{acceptanceRate}%</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{overview.pendingInvitations}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Expired</p>
              <p className="text-2xl font-bold text-red-600">{overview.expiredInvitations}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Invitation Timeline</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="sent" stackId="1" stroke="#4F46E5" fill="#4F46E5" name="Sent" />
              <Area type="monotone" dataKey="accepted" stackId="1" stroke="#0d9488" fill="#0d9488" name="Accepted" />
              <Area type="monotone" dataKey="expired" stackId="1" stroke="#0891b2" fill="#0891b2" name="Expired" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Role Distribution */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={roleDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ role, percentage }: any) => `${role} ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {roleDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Cohort Performance */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cohort Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cohortDistribution.filter(item => item.cohort !== 'Unassigned').slice(0, 5)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="cohort" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="invitations" fill="#4F46E5" name="Invitations" />
              <Bar dataKey="acceptances" fill="#0d9488" name="Acceptances" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Time to Accept */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Time to Accept</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timeToAccept}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hours" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#06B6D4" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Reminder Stats */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reminder System Status</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{reminderStats.total}</p>
            <p className="text-sm text-gray-500">Total Reminders</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{reminderStats.scheduled}</p>
            <p className="text-sm text-gray-500">Scheduled</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{reminderStats.sent}</p>
            <p className="text-sm text-gray-500">Sent</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{reminderStats.failed}</p>
            <p className="text-sm text-gray-500">Failed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
