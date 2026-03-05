'use client';

import { useState, useEffect } from "react";
import RoleBadge from "@/components/admin/RoleBadge";
import Modal from "@/components/admin/Modal";
import { UserPlus, Mail, Shield, Search, Ban, Loader2 } from "lucide-react";
import { adminApi, type User } from "@/lib/adminApi";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [inviteForm, setInviteForm] = useState({ email: "", role: "INSTRUCTOR" });
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.listUsers(1, 100);
      setUsers(response.data || []);
      setFilteredUsers(response.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users when search term changes
  useEffect(() => {
    const filtered = users.filter(user =>
      (user.firstName + ' ' + user.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleBanUser = async (user: User) => {
    try {
      setLoading(true);
      await adminApi.updateUser(user.uuid, { 
        status: user.status === 'active' ? 'banned' : 'active'
      });
      fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to update user status');
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteToAdmin = (user: User) => {
    setSelectedUser(user);
    setShowPromoteModal(true);
  };

  const confirmPromotion = async () => {
    if (!selectedUser) return;
    try {
      setLoading(true);
      await adminApi.updateUser(selectedUser.uuid, { 
        role: 'ADMIN'
      });
      setShowPromoteModal(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to promote user');
    } finally {
      setLoading(false);
    }
  };

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setInviteLoading(true);
      setInviteError(null);
      await adminApi.inviteUser(inviteForm.email, inviteForm.role);
      setInviteForm({ email: "", role: "INSTRUCTOR" });
      setShowInviteModal(false);
      fetchUsers();
    } catch (err: any) {
      setInviteError(err.message || 'Failed to invite user');
    } finally {
      setInviteLoading(false);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-sm text-sm disabled:opacity-50"
          disabled={loading}
        >
          <UserPlus className="w-4 h-4" />
          Invite User
        </button>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
            disabled={loading}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

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
            </ul>
          </div>
        </div>
      </div>

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-200">
          <p className="text-gray-500 mb-4">No users found</p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredUsers.map((user) => (
            <div key={user.uuid} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                    {(user.firstName?.[0] || '') + (user.lastName?.[0] || '')}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <RoleBadge role={user.role.toLowerCase() as 'admin' | 'instructor' | 'learner'} />
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    user.status === "active" 
                      ? "bg-green-50 text-green-600 border border-green-200" 
                      : "bg-red-50 text-red-600 border border-red-200"
                  }`}>
                    {user.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-2">
                    {user.role === "INSTRUCTOR" && (
                      <button
                        onClick={() => handlePromoteToAdmin(user)}
                        className="px-3 py-1.5 text-xs font-medium rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all disabled:opacity-50"
                        disabled={loading}
                      >
                        Promote
                      </button>
                    )}
                    <button 
                      onClick={() => handleBanUser(user)}
                      className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all disabled:opacity-50"
                      title={user.status === 'active' ? 'Ban user' : 'Unban user'}
                      disabled={loading}
                    >
                      <Ban className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invite Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => {
          setShowInviteModal(false);
          setInviteError(null);
          setInviteForm({ email: "", role: "INSTRUCTOR" });
        }}
        title="Invite User"
        size="md"
      >
        <form onSubmit={handleInviteUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              required
              value={inviteForm.email}
              onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
              placeholder="user@example.com"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={inviteLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              value={inviteForm.role}
              onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={inviteLoading}
            >
              <option value="INSTRUCTOR">Instructor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          {inviteError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-xs text-red-600">{inviteError}</p>
            </div>
          )}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs text-blue-700 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              An invitation email will be sent with setup instructions.
            </p>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all disabled:opacity-50"
              disabled={inviteLoading}
            >
              {inviteLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Send Invitation'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowInviteModal(false);
                setInviteError(null);
                setInviteForm({ email: "", role: "INSTRUCTOR" });
              }}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all disabled:opacity-50"
              disabled={inviteLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Promote Modal */}
      <Modal
        isOpen={showPromoteModal}
        onClose={() => {
          setShowPromoteModal(false);
          setSelectedUser(null);
        }}
        title="Promote to Admin"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to promote <span className="font-semibold">{selectedUser?.firstName} {selectedUser?.lastName}</span> to Admin?
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs text-blue-700">
              Admins have full access to the system. This action cannot be easily undone.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={confirmPromotion}
              className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all disabled:opacity-50"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Confirm'}
            </button>
            <button
              onClick={() => {
                setShowPromoteModal(false);
                setSelectedUser(null);
              }}
              className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
