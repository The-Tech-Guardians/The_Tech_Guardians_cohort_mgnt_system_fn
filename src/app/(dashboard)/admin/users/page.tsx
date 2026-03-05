'use client';

import { useState, useEffect, useCallback } from "react";
import RoleBadge from "@/components/admin/RoleBadge";
import Modal from "@/components/admin/Modal";
import { UserPlus, Mail, Shield, Search, Ban, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { User } from "@/types/user";
import {
  getAllUsers,
  searchUsers,
  promoteToAdmin,
  deleteUser,
  createInvitation,
  type InviteRole,
} from "@/app/(dashboard)/admin/services/userAdminService";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteForm, setInviteForm] = useState({ email: "", role: "INSTRUCTOR" as InviteRole });

  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [promoteLoading, setPromoteLoading] = useState(false);
  const [promoteError, setPromoteError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [deletingUuid, setDeletingUuid] = useState<string | null>(null);

  // ── Fetch all users ──────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
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
          Invite Instructor
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

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
          <button onClick={fetchUsers} className="ml-auto text-xs underline">Retry</button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && !error && (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Users Grid */}
      {!loading && (
        <div className="grid grid-cols-1 gap-4">
          {users.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">No users found.</div>
          ) : (
            users.map((user) => (
              <div key={user.uuid} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                      {user.firstName[0]}{user.lastName[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <RoleBadge role={user.role.toLowerCase() as "admin" | "instructor" | "learner"} has2FA={user.twoFaEnabled} />
                    <span className="text-xs text-gray-500">
                      Joined {new Date(user.createdAt!).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2">
                      {user.role === "INSTRUCTOR" && (
                        <button
                          onClick={() => handlePromoteToAdmin(user)}
                          className="px-3 py-1.5 text-xs font-medium rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all"
                        >
                          Promote to Admin
                        </button>
                      )}
                      {user.role !== "ADMIN" && (
                        <button
                          onClick={() => handleDeleteUser(user.uuid)}
                          disabled={deletingUuid === user.uuid}
                          className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all disabled:opacity-50"
                        >
                          {deletingUuid === user.uuid
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : <Ban className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

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
              placeholder="instructor@example.com"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs text-blue-700 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              An invitation email will be sent with setup instructions and 2FA requirements.
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
    </div>
  );
}