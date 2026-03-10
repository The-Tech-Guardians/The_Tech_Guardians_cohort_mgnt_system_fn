'use client';

import { useEffect, useState } from "react";
import { Bell, Shield, LogOut } from "lucide-react";
import { tokenManager } from "@/lib/auth";
import ConfirmDialog from "./ConfirmDialog";
import { useRouter } from "next/navigation";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export default function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const [user, setUser] = useState({ name: 'Admin User', initials: 'AB' });
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userData = tokenManager.getUser();
    const userEmail = userData?.email;
    
    if (userEmail === 'oriviernduwayesu@gmail.com') {
      setUser({ name: 'Nduwayesu Olivier', initials: 'NO' });
    } else {
      setUser({ name: 'Admin User', initials: 'AB' });
    }
  }, []);

  const handleLogout = () => {
    tokenManager.logout();
    router.push('/auth/login');
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border-b border-white/10 px-6 py-4 mb-6 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
              {user.initials}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user.name}</p>
              <div className="flex items-center gap-1 text-xs text-green-400">
                <Shield className="w-3 h-3" />
                2FA Enabled
              </div>
            </div>
          </div>
          <button 
            onClick={() => setShowLogoutDialog(true)}
            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all group"
            title="Logout"
          >
            <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-300" />
          </button>
        </div>
      </div>
      <ConfirmDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={handleLogout}
        title="Logout Confirmation"
        message="Are you sure you want to logout? You will need to login again to access the admin dashboard."
        confirmText="Logout"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
