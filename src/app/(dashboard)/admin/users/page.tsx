"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Search, Plus, Mail, MoreVertical, Edit, Trash2, UserCheck, UserX } from "lucide-react";
import Modal from "@/components/admin/Modal";
import Toast from "@/components/admin/Toast";
import RoleBadge from "@/components/admin/RoleBadge";

type User = {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status?: string;
  createdAt?: string;
};

const API_BASE_URL = "http://localhost:3000/api";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  
  // Modal states
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  
  // Form states
  const [inviteForm, setInviteForm] = useState({ email: "", role: "INSTRUCTOR", cohort_id: "" });
  const [editForm, setEditForm] = useState({ first_name: "", last_name: "", email: "", role: "" });
  const [formLoading, setFormLoading] = useState(false);
  
  // Toast
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });

  const getToken = () => localStorage.getItem("auth_token") || localStorage.getItem("token");

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const fetchUsers = async () => {
    try {
      setRefreshing(true);
      setError(null);

      const token = getToken();
      if (!token) {
        setError("Not authenticated. Please log in again.");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error ${res.status}`);
      }

      const data = await res.json();
      const usersArray = data.users || [];
      setUsers(usersArray);
      setFilteredUsers(usersArray);
    } catch (err: any) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const result = users.filter((u) =>
      `${u.firstName} ${u.lastName} ${u.email} ${u.role}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
    setFilteredUsers(result);
  }, [search, users]);

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const token = getToken();
      if (!token) {
        showToast("Not authenticated", "error");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/users/Invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(inviteForm),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Invitation failed");
      }

      showToast("User invited successfully!");
      setInviteForm({ email: "", role: "INSTRUCTOR", cohort_id: "" });
      setShowInviteModal(false);
      fetchUsers();
    } catch (err: any) {
      showToast(err.message || "Failed to invite user", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userToEdit) return;
    setFormLoading(true);

    try {
      const token = getToken();
      if (!token) {
        showToast("Not authenticated", "error");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/users/${userToEdit.uuid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Update failed");
      }

      showToast("User updated successfully!");
      setShowEditModal(false);
      setUserToEdit(null);
      fetchUsers();
    } catch (err: any) {
      showToast(err.message || "Failed to update user", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setFormLoading(true);

    try {
      const token = getToken();
      if (!token) {
        showToast("Not authenticated", "error");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/users/${userToDelete.uuid}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Delete failed");
      }

      showToast("User deleted successfully!");
      setShowDeleteModal(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (err: any) {
      showToast(err.message || "Failed to delete user", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const openEditModal = (user: User) => {
    setUserToEdit(user);
    setEditForm({
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      role: user.role,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'INSTRUCTOR':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'LEARNER':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={fetchUsers}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your platform users and roles</p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" />
          Invite User
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search users by name, email or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full max-w-md"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 w-16">#</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">User</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Joined</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <p className="text-gray-500">No users found</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr key={user.uuid} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 text-sm font-medium text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-600 font-semibold text-sm">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full border inline-block ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-500">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(user)}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Invite Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Invite New User"
        size="md"
      >
        <form onSubmit={handleInviteUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                value={inviteForm.email}
                onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                placeholder="user@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              required
              value={inviteForm.role}
              onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="INSTRUCTOR">Instructor</option>
              <option value="ADMIN">Admin</option>
              <option value="LEARNER">Learner</option>
            </select>
          </div>
          {inviteForm.role === "LEARNER" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cohort ID (Optional)</label>
              <input
                type="text"
                value={inviteForm.cohort_id}
                onChange={(e) => setInviteForm({ ...inviteForm, cohort_id: e.target.value })}
                placeholder="Enter cohort ID"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={formLoading}
              className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all disabled:opacity-50"
            >
              {formLoading ? <RefreshCw className="w-5 h-5 animate-spin mx-auto" /> : "Send Invitation"}
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

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit User"
        size="md"
      >
        <form onSubmit={handleUpdateUser} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                required
                value={editForm.first_name}
                onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                required
                value={editForm.last_name}
                onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              required
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              required
              value={editForm.role}
              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="LEARNER">Learner</option>
              <option value="INSTRUCTOR">Instructor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={formLoading}
              className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all disabled:opacity-50"
            >
              {formLoading ? <RefreshCw className="w-5 h-5 animate-spin mx-auto" /> : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete User"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <span className="font-semibold">{userToDelete?.firstName} {userToDelete?.lastName}</span>? 
            This action cannot be undone.
          </p>
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleDeleteUser}
              disabled={formLoading}
              className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all disabled:opacity-50"
            >
              {formLoading ? <RefreshCw className="w-5 h-5 animate-spin mx-auto" /> : "Delete"}
            </button>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Toast */}
      <Toast 
        message={toast.message} 
        type={toast.type} 
        isVisible={toast.show} 
        onClose={() => setToast({ ...toast, show: false })} 
      />
    </div>
  );
}

