'use client';

import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable from "@/components/admin/DataTable";
import RoleBadge from "@/components/admin/RoleBadge";
import Modal from "@/components/admin/Modal";
import { UserPlus, Mail, Shield, Ban } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "instructor" | "learner";
  has2FA: boolean;
  status: "active" | "banned";
  joinedAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "John Doe", email: "john@example.com", role: "admin", has2FA: true, status: "active", joinedAt: "2024-01-15" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "instructor", has2FA: true, status: "active", joinedAt: "2024-02-20" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "learner", has2FA: false, status: "active", joinedAt: "2024-03-10" },
    { id: 4, name: "Sarah Williams", email: "sarah@example.com", role: "instructor", has2FA: false, status: "active", joinedAt: "2024-03-15" },
  ]);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handlePromoteToAdmin = (user: User) => {
    setSelectedUser(user);
    setShowPromoteModal(true);
  };

  const confirmPromotion = () => {
    if (selectedUser) {
      setUsers(users.map(u => 
        u.id === selectedUser.id ? { ...u, role: "admin" as const } : u
      ));
      setShowPromoteModal(false);
      setSelectedUser(null);
    }
  };

  const columns = [
    {
      key: "name",
      label: "User",
      render: (user: User) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="font-medium text-white">{user.name}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (user: User) => <RoleBadge role={user.role} has2FA={user.has2FA} />,
    },
    {
      key: "status",
      label: "Status",
      render: (user: User) => (
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
          user.status === "active" 
            ? "bg-green-600/20 text-green-400 border border-green-500/30" 
            : "bg-red-600/20 text-red-400 border border-red-500/30"
        }`}>
          {user.status}
        </span>
      ),
    },
    {
      key: "joinedAt",
      label: "Joined",
      render: (user: User) => new Date(user.joinedAt).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (user: User) => (
        <div className="flex items-center gap-2">
          {user.role === "instructor" && (
            <button
              onClick={() => handlePromoteToAdmin(user)}
              className="px-3 py-1 text-xs font-medium rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 transition-all"
            >
              Promote to Admin
            </button>
          )}
          {user.role !== "admin" && user.status === "active" && (
            <button className="px-3 py-1 text-xs font-medium rounded-lg bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30 transition-all">
              Ban
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="User Management" 
        subtitle="Manage users, roles, and permissions"
      />

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-600/50"
        >
          <UserPlus className="w-4 h-4" />
          Invite Instructor
        </button>
      </div>

      {/* Role Constraints Info */}
      <div className="bg-amber-600/10 border border-amber-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-amber-400 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-amber-400 mb-1">Role Constraints</h3>
            <ul className="text-xs text-amber-300/80 space-y-1">
              <li>• Learners cannot hold any other role</li>
              <li>• Admins automatically have Instructor-level access</li>
              <li>• Only Admins can promote Instructors to Admin</li>
              <li>• Instructors cannot promote or demote Admins</li>
              <li>• 2FA is mandatory for all Admins and Instructors</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <DataTable 
        columns={columns} 
        data={users}
        searchPlaceholder="Search users by name or email..."
      />

      {/* Invite Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Invite Instructor"
        size="md"
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              placeholder="instructor@example.com"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-3">
            <p className="text-xs text-blue-300">
              <Mail className="w-4 h-4 inline mr-1" />
              An invitation email will be sent with setup instructions and 2FA requirements.
            </p>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
            >
              Send Invitation
            </button>
            <button
              type="button"
              onClick={() => setShowInviteModal(false)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg font-medium transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Promote Modal */}
      <Modal
        isOpen={showPromoteModal}
        onClose={() => setShowPromoteModal(false)}
        title="Promote to Admin"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to promote <span className="font-bold text-white">{selectedUser?.name}</span> to Admin?
          </p>
          <div className="bg-amber-600/10 border border-amber-500/30 rounded-lg p-3">
            <p className="text-xs text-amber-300">
              This user will gain full administrative privileges and automatic instructor access.
            </p>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={confirmPromotion}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
            >
              Confirm Promotion
            </button>
            <button
              onClick={() => setShowPromoteModal(false)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg font-medium transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
