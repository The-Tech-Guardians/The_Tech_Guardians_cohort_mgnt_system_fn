'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, BarChart3, FileText, History, Settings } from 'lucide-react';

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

export default function InvitationNavigation() {
  const pathname = usePathname();

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
