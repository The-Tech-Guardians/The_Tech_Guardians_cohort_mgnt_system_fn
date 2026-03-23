'use client';

import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Trash2, Loader2, Edit, User as UserIcon, LayoutGrid, List } from "lucide-react";
import { newCohortService as cohortService, type Cohort } from "@/services/newCohortService";
import { userService, type User } from "@/services/userService";

// Form data interface
interface FormData {
  name: string;
  startDate: string;
  endDate: string;
  enrollmentOpenDate: string;
  enrollmentCloseDate: string;
  extensionDate: string;
  courseType: string;
  coordinatorId: string;
  status: string;
}

// Inline Modal and Toast components (since file paths missing)
function SimpleModal({ isOpen, onClose, title, children }: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode 
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function SimpleToast({ message, type, isVisible, onClose }: { message: string; type: 'success' | 'error'; isVisible: boolean; onClose: () => void }) {
  if (!isVisible) return null;
  const bgColor = type === 'success' ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800';
  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-2 fade-in duration-300">
      <div className={`bg-white shadow-xl rounded-2xl p-4 border ${bgColor}`}>
        <div className={`text-sm font-medium ${bgColor}`}>
          {message}
        </div>
      </div>
    </div>
  );
}

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
  status: "upcoming",
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
  const [viewMode, setViewMode] = useState<"card" | "list">("list");

  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  // Status helpers
  const getStatusColor = (cohort: Cohort) => {
    const isExpired = new Date(cohort.endDate) < new Date();
    const status = isExpired ? 'Expired' : cohort.isActive ? 'Active' : 'Inactive';
    const colors = {
      'Active': 'bg-green-50 text-green-600 border-green-200',
      'Inactive': 'bg-gray-50 text-gray-600 border-gray-200',
      'Expired': 'bg-red-50 text-red-600 border-red-200'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-50 text-gray-600 border-gray-200';
  };

  const getStatusBadge = (cohort: Cohort) => {
    const isExpired = new Date(cohort.endDate) < new Date();
    return isExpired ? 'Expired' : cohort.isActive ? 'Active' : 'Inactive';
  };

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
      status: cohort.status || "upcoming",
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
      });

      if (response.cohort) {
        showToast("Cohort created successfully!");
        setFormData(initialFormData);
        setShowCreateModal(false);
        fetchCohorts();
      }
    } catch (err: any) {
      console.error('Cohort create error:', err);
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
      
      const updateData = {
        name: formData.name,
        startDate: formData.startDate,
        endDate: formData.endDate,
        enrollmentOpenDate: formData.enrollmentOpenDate,
        enrollmentCloseDate: formData.enrollmentCloseDate,
        extensionDate: formData.extensionDate,
        courseType: formData.courseType,
        coordinatorId: formData.coordinatorId || undefined,
        status: formData.status,
      };

      console.log('🔥 Updating cohort with data:', updateData);
      
      const response = await cohortService.updateCohort(selectedCohort.id, updateData);

      if (response.cohort) {
        showToast("Cohort updated successfully!");
        setFormData(initialFormData);
        setShowEditModal(false);
        setSelectedCohort(null);
        fetchCohorts();
      }
    } catch (err: any) {
      console.error('Cohort update error:', err);
      showToast(err.message || 'Failed to update cohort', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Delete cohort (stubbed)
  const handleDeleteCohort = async () => {
    if (!cohortToDelete) return;

    try {
      setLoading(true);
      console.log('Delete cohort:', cohortToDelete.id);
      showToast("Delete functionality stubbed - use backend API");
      setShowDeleteModal(false);
      setCohortToDelete(null);
      fetchCohorts();
    } catch (err: any) {
      console.error('Cohort delete error:', err);
      showToast('Failed to delete cohort', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (cohort: Cohort) => {
    setCohortToDelete(cohort);
    setShowDeleteModal(true);
  };

  const filteredCohorts = cohorts.filter(cohort =>
    cohort.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cohort.courseType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition ${
                viewMode === "list" ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-50"
              }`}
              title="List view"
            >
              <List className="w-4 h-4" />
              List
            </button>
            <button
              type="button"
              onClick={() => setViewMode("card")}
              className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition ${
                viewMode === "card" ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-50"
              }`}
              title="Card view"
            >
              <LayoutGrid className="w-4 h-4" />
              Cards
            </button>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all shadow-sm text-sm"
          >
            <Plus className="w-4 h-4" />
            Create Cohort
          </button>
        </div>
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

      {viewMode === "list" ? (
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
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Enrollment</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Created</th>
                  <th className="px-6 py-3 center text-xs font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCohorts.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-8 text-center">
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
                          {cohort.coordinatorName || "Not assigned"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">{new Date(cohort.startDate).toLocaleDateString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">{new Date(cohort.endDate).toLocaleDateString()}</p>
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
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border inline-block ${getStatusColor(cohort)}`}>
                          {getStatusBadge(cohort)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">{cohort.createdAt ? new Date(cohort.createdAt).toLocaleDateString() : "N/A"}</p>
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredCohorts.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center md:col-span-2 xl:col-span-3">
              <p className="text-gray-500">No cohorts found</p>
            </div>
          ) : (
            filteredCohorts.map((cohort) => (
              <div key={cohort.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 truncate">{cohort.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{formatCourseType(cohort.courseType)}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border inline-block ${getStatusColor(cohort)}`}>
                    {getStatusBadge(cohort)}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-gray-600">
                  <div>
                    <div className="text-gray-400">Coordinator</div>
                    <div className="font-semibold text-gray-800 truncate">{cohort.coordinatorName || "Not assigned"}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Enrollment</div>
                    <div className="font-semibold text-gray-800">
                      {cohort.enrollmentOpenDate ? new Date(cohort.enrollmentOpenDate).toLocaleDateString() : "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Start</div>
                    <div className="font-semibold text-gray-800">{new Date(cohort.startDate).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">End</div>
                    <div className="font-semibold text-gray-800">{new Date(cohort.endDate).toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
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
              </div>
            ))
          )}
        </div>
      )}

      {/* Create Cohort Modal */}
      <SimpleModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Cohort"
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
              value={formData.coordinatorId || ''}
              onChange={(e) => setFormData({ ...formData, coordinatorId: e.target.value || undefined })}
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
      </SimpleModal>

      {/* Edit Cohort Modal */}
      <SimpleModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Cohort"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={formData.status || 'upcoming'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Coordinator (Optional)</label>
            <select
              value={formData.coordinatorId || ''}
              onChange={(e) => setFormData({ ...formData, coordinatorId: e.target.value || undefined })}
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
      </SimpleModal>

      {/* Delete Cohort Modal */}
      <SimpleModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Cohort"
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
      </SimpleModal>

      <SimpleToast message={toast.message} type={toast.type} isVisible={toast.show} onClose={() => setToast({ ...toast, show: false })} />
    </div>
  );
}
