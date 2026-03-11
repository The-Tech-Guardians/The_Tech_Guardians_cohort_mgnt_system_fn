'use client';

import { useState, useEffect, useCallback } from "react";
import Modal from "@/components/admin/Modal";
import Toast from "@/components/admin/Toast";
import { Plus, Search, Trash2, Loader2, Edit, User as UserIcon } from "lucide-react";
import { 
  cohortService, 
  type Cohort,
} from "@/services/cohortService";
import { userService, type User } from "@/services/userService";

// Initial form state
const initialFormData = {
  name: "",
  startDate: "",
  endDate: "",
  enrollmentOpenDate: "",
  enrollmentCloseDate: "",
  extensionDate: "",
  courseType: "COMPUTER_PROGRAMMING",
  coordinatorId: "",
};

const courseTypeOptions = [
  { value: "COMPUTER_PROGRAMMING", label: "Computer Programming" },
  { value: "SOCIAL_MEDIA_BRANDING", label: "Social Media Branding" },
  { value: "ENTREPRENEURSHIP", label: "Entrepreneurship" },
  { value: "TEAM_MANAGEMENT", label: "Team Management" },
  { value: "SRHR", label: "SRHR" },
];

export default function CohortsPage() {
  // State management
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [admins, setAdmins] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminLoading, setAdminLoading] = useState(false);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Selected items
  const [selectedCohort, setSelectedCohort] = useState<Cohort | null>(null);
  const [cohortToDelete, setCohortToDelete] = useState<Cohort | null>(null);

  // Search and UI
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" });
  const [formData, setFormData] = useState(initialFormData);

  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  // Fetch cohorts
  const fetchCohorts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cohortService.getAllCohorts(pagination.page, pagination.limit);
      
      setCohorts(response.cohorts);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch cohorts');
      showToast(err.message || 'Failed to fetch cohorts', 'error');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    fetchCohorts();
  }, [fetchCohorts]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  // Fetch admins for coordinator selection
  const fetchAdmins = useCallback(async () => {
    try {
      setAdminLoading(true);
      const adminList = await userService.getAdmins();
      setAdmins(adminList);
    } catch (err) {
      console.error('Failed to fetch admins:', err);
    } finally {
      setAdminLoading(false);
    }
  }, []);

  // Open create modal and fetch admins
  const openCreateModal = () => {
    if (admins.length === 0) {
      fetchAdmins();
    }
    setFormData(initialFormData);
    setShowCreateModal(true);
  };

  // Open edit modal and fetch admins
  const openEditModalForCohort = (cohort: Cohort) => {
    if (admins.length === 0) {
      fetchAdmins();
    }
    setSelectedCohort(cohort);
    setFormData({
      name: cohort.name,
      startDate: cohort.startDate.split('T')[0],
      endDate: cohort.endDate.split('T')[0],
      enrollmentOpenDate: cohort.enrollmentOpenDate?.split('T')[0] || "",
      enrollmentCloseDate: cohort.enrollmentCloseDate?.split('T')[0] || "",
      extensionDate: cohort.extensionDate?.split('T')[0] || "",
      courseType: cohort.courseType,
      coordinatorId: cohort.coordinatorId || "",
    });
    setShowEditModal(true);
  };

  // Create cohort
  const handleCreateCohort = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const response = await cohortService.createCohort({
        name: formData.name,
        startDate: formData.startDate,
        endDate: formData.endDate,
        enrollmentOpenDate: formData.enrollmentOpenDate,
        enrollmentCloseDate: formData.enrollmentCloseDate,
        extensionDate: formData.extensionDate,
        courseType: formData.courseType,
        coordinatorId: formData.coordinatorId || undefined,
      });

      if (response.cohort) {
        showToast("Cohort created successfully!");
        setFormData(initialFormData);
        setShowCreateModal(false);
        fetchCohorts();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to create cohort', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Update cohort
  const handleUpdateCohort = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCohort) return;

    try {
      setLoading(true);
      const response = await cohortService.updateCohort(selectedCohort.id, {
        name: formData.name,
        startDate: formData.startDate,
        endDate: formData.endDate,
        enrollmentOpenDate: formData.enrollmentOpenDate,
        enrollmentCloseDate: formData.enrollmentCloseDate,
        extensionDate: formData.extensionDate,
        courseType: formData.courseType,
        coordinatorId: formData.coordinatorId || undefined,
      });

      if (response.cohort) {
        showToast("Cohort updated successfully!");
        setFormData(initialFormData);
        setShowEditModal(false);
        setSelectedCohort(null);
        fetchCohorts();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update cohort', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Delete cohort
  const handleDeleteCohort = async () => {
    if (!cohortToDelete) return;

    try {
      setLoading(true);
      await cohortService.deleteCohort(cohortToDelete.id);
      
      showToast("Cohort deleted successfully!");
      setShowDeleteModal(false);
      setCohortToDelete(null);
      fetchCohorts();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete cohort', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (cohort: Cohort) => {
    if (admins.length === 0) {
      fetchAdmins();
    }
    setSelectedCohort(cohort);
    setFormData({
      name: cohort.name,
      startDate: cohort.startDate.split('T')[0],
      endDate: cohort.endDate.split('T')[0],
      enrollmentOpenDate: cohort.enrollmentOpenDate?.split('T')[0] || "",
      enrollmentCloseDate: cohort.enrollmentCloseDate?.split('T')[0] || "",
      extensionDate: cohort.extensionDate?.split('T')[0] || "",
      courseType: cohort.courseType,
      coordinatorId: cohort.coordinatorId || "",
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (cohort: Cohort) => {
    setCohortToDelete(cohort);
    setShowDeleteModal(true);
  };

  const filteredCohorts = cohorts.filter(cohort =>
    cohort.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cohort.courseType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? 'bg-green-50 text-green-600 border-green-200'
      : 'bg-gray-50 text-gray-600 border-gray-200';
  };

  const formatCourseType = (type: string) => {
    const formatted: { [key: string]: string } = {
      COMPUTER_PROGRAMMING: 'Computer Programming',
      SOCIAL_MEDIA_BRANDING: 'Social Media Branding',
      ENTREPRENEURSHIP: 'Entrepreneurship',
      TEAM_MANAGEMENT: 'Team Management',
      SRHR: 'SRHR',
    };
    return formatted[type] || type;
  };

  if (loading && cohorts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error && cohorts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={fetchCohorts}
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
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" />
          Create Cohort
        </button>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search cohorts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
          />
        </div>
      </div>

      {/* Cohorts Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 w-16">#</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Cohort Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Course Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Coordinator</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">End Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Extension Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Enrollment</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Created</th>
                <th className="px-6 py-3 center text-xs font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCohorts.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-6 py-8 text-center">
                    <p className="text-gray-500">No cohorts found</p>
                  </td>
                </tr>
              ) : (
                filteredCohorts.map((cohort, index) => (
                  <tr key={cohort.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 text-sm font-medium text-gray-500">
                      {(pagination.page - 1) * pagination.limit + index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{cohort.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{formatCourseType(cohort.courseType)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">
                        {cohort.coordinatorName ? (
                          <span className="flex items-center gap-1">
                            <UserIcon className="w-3 h-3" />
                            {cohort.coordinatorName}
                          </span>
                        ) : "Not assigned"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">
                        {new Date(cohort.startDate).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">
                        {new Date(cohort.endDate).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">
                        {cohort.extensionDate ? new Date(cohort.extensionDate).toLocaleDateString() : "N/A"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-gray-900 font-medium">
                          {cohort.enrollmentOpenDate ? new Date(cohort.enrollmentOpenDate).toLocaleDateString() : "N/A"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {cohort.enrollmentCloseDate ? `- ${new Date(cohort.enrollmentCloseDate).toLocaleDateString()}` : ""}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full border inline-block ${getStatusColor(cohort.isActive)}`}>
                        {cohort.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">
                        {cohort.createdAt ? new Date(cohort.createdAt).toLocaleDateString() : "N/A"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(cohort)}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          title="Edit"
                          disabled={loading}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(cohort)}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="Delete"
                          disabled={loading}
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

      {/* Create Cohort Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Cohort"
        size="lg"
      >
        <form onSubmit={handleCreateCohort} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cohort Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Cohort 2026 Summer"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Type</label>
            <select
              required
              value={formData.courseType}
              onChange={(e) => setFormData({ ...formData, courseType: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {courseTypeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Coordinator (Optional)</label>
            <select
              value={formData.coordinatorId}
              onChange={(e) => setFormData({ ...formData, coordinatorId: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={adminLoading}
            >
              <option value="">Select a coordinator</option>
              {admins.map(admin => (
                <option key={admin.uuid} value={admin.uuid}>
                  {admin.firstName} {admin.lastName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Enrollment Opens</label>
              <input
                type="date"
                value={formData.enrollmentOpenDate}
                onChange={(e) => setFormData({ ...formData, enrollmentOpenDate: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Enrollment Closes</label>
              <input
                type="date"
                value={formData.enrollmentCloseDate}
                onChange={(e) => setFormData({ ...formData, enrollmentCloseDate: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Extension Date</label>
            <input
              type="date"
              value={formData.extensionDate}
              onChange={(e) => setFormData({ ...formData, extensionDate: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all"
            >
              Create Cohort
            </button>
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Cohort Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Cohort"
        size="lg"
      >
        <form onSubmit={handleUpdateCohort} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cohort Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Cohort 2026 Summer"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Type</label>
            <select
              required
              value={formData.courseType}
              onChange={(e) => setFormData({ ...formData, courseType: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {courseTypeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Coordinator (Optional)</label>
            <select
              value={formData.coordinatorId}
              onChange={(e) => setFormData({ ...formData, coordinatorId: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={adminLoading}
            >
              <option value="">Select a coordinator</option>
              {admins.map(admin => (
                <option key={admin.uuid} value={admin.uuid}>
                  {admin.firstName} {admin.lastName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Enrollment Opens</label>
              <input
                type="date"
                value={formData.enrollmentOpenDate}
                onChange={(e) => setFormData({ ...formData, enrollmentOpenDate: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Enrollment Closes</label>
              <input
                type="date"
                value={formData.enrollmentCloseDate}
                onChange={(e) => setFormData({ ...formData, enrollmentCloseDate: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Extension Date</label>
            <input
              type="date"
              value={formData.extensionDate}
              onChange={(e) => setFormData({ ...formData, extensionDate: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all"
            >
              Update Cohort
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

      {/* Delete Cohort Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Cohort"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{cohortToDelete?.name}</strong>? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDeleteCohort}
              className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all"
            >
              Delete
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

      <Toast message={toast.message} type={toast.type} isVisible={toast.show} onClose={() => setToast({ ...toast, show: false })} />
      
      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: Math.max(prev.page - 1, 1) }))}
            disabled={pagination.page === 1 || loading}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          <span className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.page + 1, prev.pages) }))}
            disabled={pagination.page === pagination.pages || loading}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

