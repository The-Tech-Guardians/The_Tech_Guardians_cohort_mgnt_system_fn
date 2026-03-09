"use client";

import { useEffect, useState } from "react";
import { RefreshCw, AlertCircle } from "lucide-react";

type User = {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [inviteForm, setInviteForm] = useState({ email: "", role: "INSTRUCTOR" });
  const [refreshing, setRefreshing] = useState(false);

  // Get the JWT token from wherever you store it (localStorage, cookies, etc.)
  const getToken = () => localStorage.getItem("token"); // adjust key as needed

  const fetchUsers = async () => {
    try {
      setRefreshing(true);
      setError(null);

      const token = getToken();
      if (!token) {
        setError("Not authenticated. Please log in again.");
        return;
      }

      const res = await fetch("/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error ${res.status}`);
      }

      const data = await res.json();
      // Backend returns { users: [...] }
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

  // Search filter
  useEffect(() => {
    const result = users.filter((u) =>
      `${u.firstName} ${u.lastName} ${u.email}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
    setFilteredUsers(result);
  }, [search, users]);

  const inviteUser = async () => {
    try {
      const token = getToken();
      if (!token) {
        alert("Not authenticated");
        return;
      }

      const res = await fetch("/api/users/Invite", {  // note capital 'I'
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

      setInviteForm({ email: "", role: "INSTRUCTOR" });
      fetchUsers(); // refresh the list after inviting
    } catch (err: any) {
      alert(err.message || "Failed to invite user");
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <RefreshCw className="animate-spin mx-auto" />
        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500 flex gap-2 items-center">
        <AlertCircle />
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Users</h1>

      <input
        type="text"
        placeholder="Search users..."
        className="border p-2 rounded w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="border p-4 rounded space-y-3">
        <h2 className="font-semibold">Invite User</h2>
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded w-full"
          value={inviteForm.email}
          onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
        />
        <select
          className="border p-2 rounded w-full"
          value={inviteForm.role}
          onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
        >
          <option value="INSTRUCTOR">Instructor</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button
          onClick={inviteUser}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Invite
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.uuid}>
              <td className="border p-2">{user.firstName} {user.lastName}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.role}</td>
              <td className="border p-2">{user.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={fetchUsers}
        className="flex items-center gap-2 text-blue-600"
      >
        <RefreshCw className={refreshing ? "animate-spin" : ""} />
        Refresh
      </button>
    </div>
  );
}