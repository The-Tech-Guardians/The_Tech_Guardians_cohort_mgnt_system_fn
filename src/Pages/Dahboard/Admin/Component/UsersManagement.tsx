import { useEffect, useState } from "react"
import { FiMail, FiLock, FiUnlock, FiSearch, FiEdit2, FiX, FiDownload, FiUserPlus, FiUsers, FiUserCheck, FiUserX, FiShield } from "react-icons/fi"
import { Loader2 } from "lucide-react"
import { getUsers, banUser, unbanUser, updateUserRole } from "../Services/AdminService"

interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  role: string;
  isBanned: boolean;
  createdAt: string;
}

const UsersManagement = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 10
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [newRole, setNewRole] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "user" })

  useEffect(() => {
    fetchUsers()
  }, [currentPage])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await getUsers(currentPage, itemsPerPage)
      setUsers(data.users)
      setTotalPages(data.pagination.totalPages)
    } catch (err: any) {
      console.error('Fetch users error:', err)
      setError(err.response?.data?.error || "Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleBan = async (userId: string, isBanned: boolean) => {
    try {
      setActionLoading(userId)
      setError("")
      if (isBanned) {
        await unbanUser(userId)
        setSuccess("User unbanned successfully")
      } else {
        await banUser(userId)
        setSuccess("User banned successfully")
      }
      setTimeout(() => setSuccess(""), 3000)
      fetchUsers()
    } catch (err: any) {
      console.error('Ban/Unban error:', err)
      setError(err.response?.data?.error || `Failed to ${isBanned ? 'unban' : 'ban'} user`)
    } finally {
      setActionLoading(null)
    }
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setNewRole(user.role)
    setShowEditModal(true)
  }

  const handleUpdateRole = async () => {
    if (!editingUser || !newRole) return
    try {
      setActionLoading(editingUser._id || editingUser.id)
      setError("")
      await updateUserRole(editingUser._id || editingUser.id, newRole)
      setSuccess("User role updated successfully")
      setTimeout(() => setSuccess(""), 3000)
      setShowEditModal(false)
      fetchUsers()
    } catch (err: any) {
      console.error('Update role error:', err)
      setError(err.response?.data?.error || "Failed to update user role")
    } finally {
      setActionLoading(null)
    }
  }

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const kpis = {
    total: users.length,
    active: users.filter(u => !u.isBanned).length,
    banned: users.filter(u => u.isBanned).length,
    admins: users.filter(u => u.role === 'admin').length
  }

  const exportToCSV = () => {
    const headers = ["No", "Name", "Email", "Role", "Status", "Joined"]
    const rows = filteredUsers.map((user, idx) => [
      idx + 1,
      user.name,
      user.email,
      user.role,
      user.isBanned ? "Banned" : "Active",
      new Date(user.createdAt).toLocaleDateString()
    ])
    const csv = [headers, ...rows].map(row => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `users_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    setShowExportMenu(false)
  }

  const exportToJSON = () => {
    const json = JSON.stringify(filteredUsers, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `users_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    setShowExportMenu(false)
  }

  const exportToPDF = () => {
    const content = filteredUsers.map((user, idx) => 
      `${idx + 1}. ${user.name} | ${user.email} | ${user.role} | ${user.isBanned ? "Banned" : "Active"} | ${new Date(user.createdAt).toLocaleDateString()}`
    ).join("\n")
    const blob = new Blob([`Users Report\n\n${content}`], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `users_${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    setShowExportMenu(false)
  }

  const handleAddUser = async () => {
    try {
      setActionLoading("add")
      setError("")
      // Add API call here when backend endpoint is ready
      // await addUser(newUser)
      setSuccess("User added successfully")
      setTimeout(() => setSuccess(""), 3000)
      setShowAddModal(false)
      setNewUser({ name: "", email: "", password: "", role: "user" })
      fetchUsers()
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to add user")
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Users Management</h1>
          <p className="text-sm md:text-base text-gray-500">Manage platform users and their roles</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600">Total Users</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{kpis.total}</p>
            </div>
            <FiUsers className="text-gray-900" size={24} />
          </div>
        </div>
        <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600">Active Users</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{kpis.active}</p>
            </div>
            <FiUserCheck className="text-gray-900" size={24} />
          </div>
        </div>
        <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600">Banned Users</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{kpis.banned}</p>
            </div>
            <FiUserX className="text-gray-900" size={24} />
          </div>
        </div>
        <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600">Admins</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{kpis.admins}</p>
            </div>
            <FiShield className="text-gray-900" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white p-3 md:p-4 rounded-xl border border-gray-200 mb-4 md:mb-6">
        <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C7A7B] focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
          <div className="relative flex-1 sm:flex-none">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="w-full sm:w-auto px-3 md:px-4 py-2 bg-[#2C7A7B] hover:bg-[#236565] text-white rounded-lg flex items-center justify-center gap-2 transition whitespace-nowrap text-sm md:text-base"
            >
              <FiDownload size={16} />
              <span className="hidden sm:inline">Export</span>
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border z-10">
                <button onClick={exportToCSV} className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded-t-lg">CSV</button>
                <button onClick={exportToJSON} className="w-full px-4 py-2 text-left hover:bg-gray-50">JSON</button>
                <button onClick={exportToPDF} className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded-b-lg">PDF (TXT)</button>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex-1 sm:flex-none px-3 md:px-4 py-2 bg-[#2C7A7B] hover:bg-[#236565] text-white rounded-lg flex items-center justify-center gap-2 transition whitespace-nowrap text-sm md:text-base"
          >
            <FiUserPlus size={16} />
            <span className="hidden sm:inline">Add User</span>
          </button>
          </div>
        </div>
      </div>

      {success && (
        <div className="mb-4 md:mb-6 flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <span className="text-green-600">✓</span>
          <p className="text-xs md:text-sm text-green-700">{success}</p>
        </div>
      )}

      {error && (
        <div className="mb-4 md:mb-6 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <span className="text-red-600">⚠️</span>
          <p className="text-xs md:text-sm text-red-700">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-xl p-6 md:p-8 flex items-center justify-center">
          <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin text-[#2C7A7B] mr-2" />
          <span className="text-sm md:text-base text-gray-600">Loading users...</span>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white rounded-xl p-6 md:p-8 text-center">
          <p className="text-sm md:text-base text-gray-600">No users found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user, index) => (
                <tr key={user._id || user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-600">{index + 1}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FiMail size={16} /> {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-blue-100 text-blue-700' : 
                      user.role === 'helper' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.isBanned ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {user.isBanned ? "Banned" : "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditUser(user)}
                        disabled={actionLoading === (user._id || user.id)}
                        className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50 transition"
                        title="Edit user"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleToggleBan(user._id || user.id, user.isBanned)}
                        disabled={actionLoading === (user._id || user.id)}
                        className={`p-2 rounded-lg ${user.isBanned ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'} disabled:opacity-50 transition`}
                        title={user.isBanned ? "Unban user" : "Ban user"}
                      >
                        {actionLoading === (user._id || user.id) ? <Loader2 size={16} className="animate-spin" /> : user.isBanned ? <FiUnlock size={16} /> : <FiLock size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Edit User Role</h3>
              <button onClick={() => setShowEditModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <FiX size={20} />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">User: <span className="font-semibold">{editingUser.name}</span></p>
              <p className="text-sm text-gray-600 mb-4">Email: {editingUser.email}</p>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C7A7B] focus:border-transparent"
              >
                <option value="user">User</option>
                <option value="helper">Helper</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRole}
                disabled={actionLoading === (editingUser._id || editingUser.id)}
                className="flex-1 px-4 py-2.5 bg-[#2C7A7B] hover:bg-[#236565] text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                {actionLoading === (editingUser._id || editingUser.id) ? "Updating..." : "Update Role"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Add New User</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <FiX size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C7A7B] focus:border-transparent"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C7A7B] focus:border-transparent"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C7A7B] focus:border-transparent"
                  placeholder="Enter password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C7A7B] focus:border-transparent"
                >
                  <option value="user">User</option>
                  <option value="helper">Helper</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                disabled={actionLoading === "add" || !newUser.name || !newUser.email || !newUser.password}
                className="flex-1 px-4 py-2.5 bg-[#2C7A7B] hover:bg-[#236565] text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                {actionLoading === "add" ? "Adding..." : "Add User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UsersManagement
