'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, BarChart3, FileText, History, Settings, ChevronDown, ChevronRight, Shield, Users, TrendingUp, BookOpen, Target, Award } from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Invitations',
    href: '/admin/invitations',
    icon: Mail,
    description: 'Manage and track all invitations',
  },
  {
    name: 'Analytics',
    href: '/admin/invitations/analytics',
    icon: BarChart3,
    description: 'View invitation metrics and trends',
  },
  {
    name: 'Audit Log',
    href: '/admin/invitations/audit',
    icon: FileText,
    description: 'Complete audit trail of activities',
  },
];

interface ReportSubItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const reportSubItems: ReportSubItem[] = [
  {
    name: 'Moderation Reports',
    href: '/admin/moderation',
    icon: Shield,
    description: 'User ban requests and moderation',
  },
  {
    name: 'Assessment Reports',
    href: '/admin/reports/assessment',
    icon: Award,
    description: 'Assessment performance and analytics',
  },
  {
    name: 'Course Reports',
    href: '/admin/reports/course',
    icon: BookOpen,
    description: 'Course completion and progress',
  },
  {
    name: 'Engagement Reports',
    href: '/admin/reports/engagement',
    icon: TrendingUp,
    description: 'User engagement metrics',
  },
  {
    name: 'Learner Reports',
    href: '/admin/reports/learner',
    icon: Users,
    description: 'Individual learner performance',
  },
  {
    name: 'Performance Reports',
    href: '/admin/reports/performance',
    icon: BarChart3,
    description: 'Overall system performance',
  },
  {
    name: 'Quiz Reports',
    href: '/admin/reports/quiz',
    icon: Target,
    description: 'Quiz results and analytics',
  },
];

export default function InvitationNavigation() {
  const pathname = usePathname();
  const [isReportsDropdownOpen, setIsReportsDropdownOpen] = useState(false);

  const isReportsActive = reportSubItems.some(item => pathname === item.href);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <nav className="space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
              </div>
            </Link>
          );
        })}

        {/* Reports Dropdown */}
        <div className="space-y-1">
          <button
            onClick={() => setIsReportsDropdownOpen(!isReportsDropdownOpen)}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              isReportsActive
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <FileText className="w-5 h-5 mr-3" />
            <div className="flex-1 text-left">
              <div className="font-medium">Reports</div>
              <div className="text-xs text-gray-500 mt-0.5">View all system reports</div>
            </div>
            {isReportsDropdownOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {isReportsDropdownOpen && (
            <div className="ml-4 space-y-1">
              {reportSubItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <Link
            href="/admin/invitations/analytics"
            className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            View Analytics
          </Link>
          <Link
            href="/admin/invitations/audit"
            className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
          >
            <History className="w-4 h-4 mr-2" />
            Recent Activity
          </Link>
          <Link
            href="/admin/moderation"
            className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
          >
            <Shield className="w-4 h-4 mr-2" />
            Moderation Reports
          </Link>
        </div>
      </div>

      {/* Settings */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <Link
          href="/admin/invitations/settings"
          className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
        >
          <Settings className="w-4 h-4 mr-2" />
          Invitation Settings
        </Link>
      </div>
    </div>
  );
}
