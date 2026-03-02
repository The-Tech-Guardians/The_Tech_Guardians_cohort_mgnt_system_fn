'use client';

import { Bell, Shield } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export default function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 mb-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-50 border border-gray-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
              AB
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <div className="flex items-center gap-1 text-xs text-green-400">
                <Shield className="w-3 h-3" />
                2FA Enabled
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
