'use client';

import { useState, useEffect, useCallback } from 'react';
import Modal from '@/components/admin/Modal';
import Toast from '@/components/admin/Toast';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
} from 'lucide-react';
import {
  newCohortService as cohortService,
  type Cohort,
  type PaginationInfo,
} from '@/services/newCohortService';

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const initialFormData = {
  name: '',
  startDate: '',
  endDate: '',
  enrollmentOpenDate: '',
  enrollmentCloseDate: '',
  extensionDate: '',
  courseType: 'COMPUTER_PROGRAMMING',
  // FIX #5: isActive added so the edit form can toggle status
  isActive: false,
};

const courseTypeOptions = [
  { value: 'COMPUTER_PROGRAMMING', label: 'Computer Programming' },
  { value: 'SOCIAL_MEDIA_BRANDING', label: 'Social Media Branding' },
  { value: 'ENTREPRENEURSHIP', label: 'Entrepreneurship' },
  { value: 'TEAM_MANAGEMENT', label: 'Team Management' },
  { value: 'SRHR', label: 'SRHR' },
];

// ─────────────────────────────────────────────
// Page component
// ─────────────────────────────────────────────

export default function CohortsPage() {
  // ── Data ──────────────────────────────────
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Modal visibility ──────────────────────
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // ── Selected items ────────────────────────
  const [selectedCohort, setSelectedCohort] = useState<Cohort | null>(null);
  const [cohortToDelete, setCohortToDelete] = useState<Cohort | null>(null);

  // ── UI ────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success' as 'success' | 'error',
  });
  const [formData, setFormData] = useState(initialFormData);

  // FIX #4: Use stable primitive state for pagination to avoid infinite loop
  const [currentPage, setCurrentPage] = useState(1);
  const pageLimit = 10;
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: pageLimit,
    total: 0,
    pages: 0,
  });

  // ─────────────────────────────────────────────
  // Data fetching
  // ─────────────────────────────────────────────

  // FIX #4: depend on primitive values, not the pagination object
  const fetchCohorts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cohortService.getAllCohorts(currentPage, pageLimit);
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
  }, [currentPage, pageLimit]);

  useEffect(() => {
    fetchCohorts();
  }, [fetchCohorts]);

  // ─────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const formatCourseType = (type: string) => {
    const map: Record<string, string> = {
      COMPUTER_PROGRAMMING: 'Computer Programming',
      SOCIAL_MEDIA_BRANDING: 'Social Media Branding',
      ENTREPRENEURSHIP: 'Entrepreneurship',
      TEAM_MANAGEMENT: 'Team Management',
      SRHR: 'SRHR',
    };
    return map[type] || type;
  };

  const getStatusColor = (isActive: boolean) =>
    isActive
      ? 'bg-green-50 text-green-600 border-green-200'
      : 'bg-gray-50 text-gray-600 border-gray-200';

  const filteredCohorts = cohorts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.courseType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ─────────────────────────────────────────────
  // CRUD handlers
  // ─────────────────────────────────────────────

  const handleCreateCohort = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await cohortService.createCohort({
        name: formData.name,
        startDate: formData.startDate,
        endDate: formData.endDate,
        enrollmentOpenDate: formData.enrollmentOpenDate || undefined,
        enrollmentCloseDate: formData.enrollmentCloseDate || undefined,
        extensionDate: formData.extensionDate || undefined,
        courseType: formData.courseType,
      });

      if (response.cohort) {
        showToast('Cohort created successfully!');
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

  const handleUpdateCohort = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCohort) return;

    try {
      setLoading(true);
      const response = await cohortService.updateCohort(selectedCohort.id, {
        name: formData.name,
        startDate: formData.startDate,
        endDate: formData.endDate,
        enrollmentOpenDate: formData.enrollmentOpenDate || undefined,
        enrollmentCloseDate: formData.enrollmentCloseDate || undefined,
        extensionDate: formData.extensionDate || undefined,
        courseType: formData.courseType,
        // FIX #5: pass isActive to the service
        isActive: formData.isActive,
      });

      if (response.cohort) {
        showToast('Cohort updated successfully!');
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

  const handleDeleteCohort = async () => {
    if (!cohortToDelete) return;

    try {
      setLoading(true);
      await cohortService.deleteCohort(cohortToDelete.id);
      showToast('Cohort deleted successfully!');
      setShowDeleteModal(false);
      setCohortToDelete(null);
      fetchCohorts();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete cohort', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // Modal openers
  // ─────────────────────────────────────────────

  const openEditModal = (cohort: Cohort) => {
    setSelectedCohort(cohort);
    setFormData({
      name: cohort.name,
      startDate: cohort.startDate.split('T')[0],
      endDate: cohort.endDate.split('T')[0],
      enrollmentOpenDate: cohort.enrollmentOpenDate?.split('T')[0] || '',
      enrollmentCloseDate: cohort.enrollmentCloseDate?.split('T')[0] || '',
      extensionDate: cohort.extensionDate?.split('T')[0] || '',
      courseType: cohort.courseType,
      // FIX #5: pre-fill isActive from the cohort
      isActive: cohort.isActive,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (cohort: Cohort) => {
    setCohortToDelete(cohort);
    setShowDeleteModal(true);
  };

  // ─────────────────────────────────────────────
  // Early returns
  // ─────────────────────────────────────────────

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

  // ─────────────────────────────────────────────
  // Shared form fields (used in both Create & Edit)
  // ─────────────────────────────────────────────

  const renderFormFields = (isEdit = false) => (
    <div className="space-y-4">
      {/* Cohort Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cohort Name
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Cohort 2026 Summer"
          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Course Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Course Type
        </label>
        <select
          required
          value={formData.courseType}
          onChange={(e) => setFormData({ ...formData, courseType: e.target.value })}
          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {courseTypeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Start / End Date */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            type="date"
            required
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <input
            type="date"
            required
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Enrollment Open / Close */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enrollment Opens
          </label>
          <input
            type="date"
            value={formData.enrollmentOpenDate}
            onChange={(e) =>
              setFormData({ ...formData, enrollmentOpenDate: e.target.value })
            }
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enrollment Closes
          </label>
          <input
            type="date"
            value={formData.enrollmentCloseDate}
            onChange={(e) =>
              setFormData({ ...formData, enrollmentCloseDate: e.target.value })
            }
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Extension Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Extension Date
        </label>
        <input
          type="date"
          value={formData.extensionDate}
          onChange={(e) => setFormData({ ...formData, extensionDate: e.target.value })}
          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* FIX #5: Status toggle — only shown in Edit modal */}
      {isEdit && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={formData.isActive ? 'active' : 'upcoming'}
            onChange={(e) =>
              setFormData({ ...formData, isActive: e.target.value === 'active' })
            }
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="upcoming">Upcoming (Inactive)</option>
            <option value="active">Active</option>
          </select>
        </div>
      )}
    </div>
  );

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            setFormData(initialFormData);
            setShowCreateModal(true);
          }}
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

      {/* ── Table ── */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  Cohort Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  Course Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  Instructor
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  End Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  Enrollment
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  Created
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredCohorts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center">
                    <p className="text-gray-500">No cohorts found</p>
                  </td>
                </tr>
              ) : (
                filteredCohorts.map((cohort) => (
                  <tr key={cohort.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{cohort.name}</p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">
                        {formatCourseType(cohort.courseType)}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">
                        {cohort.instructorIds && cohort.instructorIds.length > 0
                          ? `Instructor: ${
                              cohort.instructorIds[0].length > 8
                                ? `${cohort.instructorIds[0].slice(0, 8)}...`
                                : cohort.instructorIds[0]
                            }`
                          : 'Not assigned'}
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
                      <div className="text-sm">
                        <p className="text-gray-900 font-medium">
                          {cohort.enrollmentOpenDate
                            ? new Date(cohort.enrollmentOpenDate).toLocaleDateString()
                            : 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {cohort.enrollmentCloseDate
                            ? `– ${new Date(cohort.enrollmentCloseDate).toLocaleDateString()}`
                            : ''}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full border inline-block ${getStatusColor(
                          cohort.isActive
                        )}`}
                      >
                        {cohort.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">
                        {cohort.createdAt
                          ? new Date(cohort.createdAt).toLocaleDateString()
                          : 'N/A'}
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

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Page {pagination.page} of {pagination.pages} &mdash; {pagination.total} total
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || loading}
                className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={currentPage === pagination.pages || loading}
                className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Create Modal ── */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Cohort"
        size="lg"
      >
        <form onSubmit={handleCreateCohort} className="space-y-4">
          {renderFormFields(false)}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-xl font-medium transition-all"
            >
              {loading ? 'Creating…' : 'Create Cohort'}
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

      {/* ── Edit Modal (FIX #1: only ONE edit modal) ── */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Cohort"
        size="lg"
      >
        <form onSubmit={handleUpdateCohort} className="space-y-4">
          {renderFormFields(true)}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-xl font-medium transition-all"
            >
              {loading ? 'Saving…' : 'Update Cohort'}
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

      {/* ── Delete Modal ── */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Cohort"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete{' '}
            <strong>{cohortToDelete?.name}</strong>? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDeleteCohort}
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-xl font-medium transition-all"
            >
              {loading ? 'Deleting…' : 'Delete'}
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

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}