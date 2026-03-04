'use client';

import { useState } from "react";
import RoleBadge from "@/components/admin/RoleBadge";
import Modal from "@/components/admin/Modal";
import { UserPlus, Mail, Shield, Search, Edit, Ban } from "lucide-react";

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
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-sm text-sm"
        >
          <UserPlus className="w-4 h-4" />
          Invite Instructor
        </button>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
          />
        </div>
      </div>

      {/* Role Constraints Info */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-amber-900 mb-2">Role Constraints</h3>
            <ul className="text-xs text-amber-700 space-y-1">
              <li>• Learners cannot hold any other role</li>
              <li>• Admins automatically have Instructor-level access</li>
              <li>• Only Admins can promote Instructors to Admin</li>
              <li>• Instructors cannot promote or demote Admins</li>
              <li>• 2FA is mandatory for all Admins and Instructors</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <RoleBadge role={user.role} has2FA={user.has2FA} />
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  user.status === "active" 
                    ? "bg-green-50 text-green-600 border border-green-200" 
                    : "bg-red-50 text-red-600 border border-red-200"
                }`}>
                  {user.status}
                </span>
                <span className="text-xs text-gray-500">
                  Joined {new Date(user.joinedAt).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-2">
                  {user.role === "instructor" && (
                    <button
                      onClick={() => handlePromoteToAdmin(user)}
                      className="px-3 py-1.5 text-xs font-medium rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all"
                    >
                      Promote to Admin
                    </button>
                  )}
                  {user.role !== "admin" && user.status === "active" && (
                    <button className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all">
                      <Ban className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Invite Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Invite Instructor"
        size="md"
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              placeholder="instructor@example.com"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs text-blue-700 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              An invitation email will be sent with setup instructions and 2FA requirements.
            </p>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all"
            >
              Send Invitation
            </button>
            <button
              type="button"
              onClick={() => setShowInviteModal(false)}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all"
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
          <p className="text-gray-700">
            Are you sure you want to promote <span className="font-bold text-gray-900">{selectedUser?.name}</span> to Admin?
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-xs text-amber-700">
              This user will gain full administrative privileges and automatic instructor access.
            </p>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={confirmPromotion}
              className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all"
            >
              Confirm Promotion
            </button>
            <button
              onClick={() => setShowPromoteModal(false)}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
