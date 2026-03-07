'use client';

import { useState, useEffect, useCallback } from "react";
import RoleBadge from "@/components/admin/RoleBadge";
import Modal from "@/components/admin/Modal";
import { UserPlus, Mail, Shield, Search, Ban, Loader2 } from "lucide-react";
import { adminApi, type User } from "@/lib/adminApi";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);

  const [showInviteModal, setShowInviteModal] = useState(false);
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
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ── Search ───────────────────────────────────────────────────────────────────
  const handleSearch = async () => {
    if (!searchTerm.trim()) { fetchUsers(); return; }
    setSearching(true);
    setError(null);
    try {
      const results = await searchUsers(searchTerm);
      setUsers(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    fetchUsers();
  };

  // ── Delete ───────────────────────────────────────────────────────────────────
  const handleDeleteUser = async (uuid: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setDeletingUuid(uuid);
    try {
      await deleteUser(uuid);
      setUsers((prev) => prev.filter((u) => u.uuid !== uuid));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete user");
    } finally {
      setDeletingUuid(null);
    }
  };

  const openEditUser = (user: User) => {
    setUserToEdit(user);
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setShowEditModal(true);
  };

  const submitEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userToEdit) return;

    try {
      setLoading(true);
      await adminApi.updateUser(userToEdit.uuid, {
        first_name: editForm.firstName,
        last_name: editForm.lastName,
        email: editForm.email,
        role: editForm.role,
        status: editForm.status,
      });
      setShowEditModal(false);
      setUserToEdit(null);
      fetchUsers();
    } catch (err: any) {
      setError(err.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteUser = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      setLoading(true);
      await adminApi.deleteUser(userToDelete.uuid);
      setShowDeleteModal(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (err: any) {
      setError(err.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  // ── Promote ──────────────────────────────────────────────────────────────────
  const handlePromoteToAdmin = (user: User) => {
    setSelectedUser(user);
    setPromoteError(null);
    setShowPromoteModal(true);
  };

  const confirmPromotion = async () => {
    if (!selectedUser) return;
    const adminId = localStorage.getItem("userUuid") ?? "";
    setPromoteLoading(true);
    setPromoteError(null);
    try {
      await promoteToAdmin({ uuid: selectedUser.uuid, admin_id: adminId });
      setUsers((prev) =>
        prev.map((u) => (u.uuid === selectedUser.uuid ? { ...u, role: "ADMIN" as const } : u))
      );
      setShowPromoteModal(false);
      setSelectedUser(null);
    } catch (err) {
      setPromoteError(err instanceof Error ? err.message : "Promotion failed");
    } finally {
      setPromoteLoading(false);
    }
  };

  // ── Invite ───────────────────────────────────────────────────────────────────
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteLoading(true);
    setInviteError(null);
    try {
      await createInvitation({ email: inviteForm.email, role: inviteForm.role });
      setInviteForm({ email: "", role: "INSTRUCTOR" });
      setShowInviteModal(false);
      alert("Invitation sent successfully");
    } catch (err) {
      setInviteError(err instanceof Error ? err.message : "Failed to send invitation");
    } finally {
      setInviteLoading(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => { setInviteError(null); setShowInviteModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-sm text-sm"
        >
          <UserPlus className="w-4 h-4" />
          Invite User
        </button>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={searching}
            className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
          </button>
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm hover:bg-gray-50 text-gray-500 transition-all"
            >
              Clear
            </button>
          )}
          <button
            onClick={fetchUsers}
            disabled={loading}
            title="Refresh"
            className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-gray-500 ${loading ? "animate-spin" : ""}`} />
          </button>
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
      </div>

      {/* Invite Modal */}
      <Modal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} title="Invite Instructor" size="md">
        <form onSubmit={handleInvite} className="space-y-4">
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
              onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value as InviteRole })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="INSTRUCTOR">Instructor</option>
              <option value="ADMIN">Admin</option>
              <option value="LEARNER">Learner</option>
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
          {inviteError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {inviteError}
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={inviteLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all disabled:opacity-60"
            >
              {inviteLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Send Invitation
            </button>
            <button
              type="button"
              onClick={() => setShowInviteModal(false)}
              className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Promote Modal */}
      <Modal isOpen={showPromoteModal} onClose={() => setShowPromoteModal(false)} title="Promote to Admin" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to promote{" "}
            <strong>{selectedUser?.firstName} {selectedUser?.lastName}</strong> to Admin?
          </p>
          {promoteError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {promoteError}
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={confirmPromotion}
              disabled={promoteLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all disabled:opacity-60"
            >
              {promoteLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Confirm
            </button>
            <button
              onClick={() => setShowPromoteModal(false)}
              className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setUserToEdit(null);
        }}
        title="Edit User"
        size="md"
      >
        <form onSubmit={submitEditUser} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                value={editForm.firstName}
                onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                value={editForm.lastName}
                onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                value={editForm.role}
                onChange={(e) =>
                  setEditForm({ ...editForm, role: e.target.value as User["role"] })
                }
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="LEARNER">Learner</option>
                <option value="INSTRUCTOR">Instructor</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={editForm.status}
                onChange={(e) =>
                  setEditForm({ ...editForm, status: e.target.value as User["status"] })
                }
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="active">Active</option>
                <option value="banned">Banned</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all disabled:opacity-50"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Save changes"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowEditModal(false);
                setUserToEdit(null);
              }}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete User Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setUserToDelete(null);
        }}
        title="Delete User"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold">
              {userToDelete?.firstName} {userToDelete?.lastName}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-3 pt-2">
            <button
              onClick={confirmDeleteUser}
              className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all disabled:opacity-50"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Delete"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowDeleteModal(false);
                setUserToDelete(null);
              }}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all disabled:opacity-50"
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