'use client';

import { useState, useEffect, useCallback } from "react";
import { Search, Filter, User as UserIcon, Mail, Calendar, CheckCircle, XCircle, Clock, ChevronDown, Eye, Download, RefreshCw } from "lucide-react";
import { applicationService, type Application } from "@/services/applicationService";
import { cohortService, type Cohort } from "@/services/cohortService";

interface ApplicationWithCohort extends Application {
  cohortName?: string;
  cohortType?: string;
  cohortDates?: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationWithCohort[]>([]);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [cohortFilter, setCohortFilter] = useState<string>("all");
  const [selectedApplication, setSelectedApplication] = useState<ApplicationWithCohort | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" as "success" | "error" | "info" });

  // Fetch applications and cohorts
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch all applications (admin endpoint)
      const applicationsData = await applicationService.getAllApplications();
      
      // Fetch cohorts for cohort information
      const cohortsData = await cohortService.getAllCohorts(1, 100);
      const cohortMap = new Map(cohortsData.cohorts.map(cohort => [cohort.id, cohort]));
      
      // Combine application data with cohort information
      const applicationsWithCohort = applicationsData.map(app => {
        const cohort = cohortMap.get(app.cohortId);
        return {
          ...app,
          cohortName: cohort?.name || 'Unknown Cohort',
          cohortType: cohort?.courseType || 'Unknown',
          cohortDates: cohort ? `${new Date(cohort.startDate).toLocaleDateString()} - ${new Date(cohort.endDate).toLocaleDateString()}` : 'Unknown'
        };
      });
      
      setApplications(applicationsWithCohort);
      setCohorts(cohortsData.cohorts);
    } catch (error) {
      console.error('Error fetching data:', error);
      setToast({ show: true, message: 'Failed to load applications', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Update application status
  const updateApplicationStatus = async (applicationId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      setUpdatingId(applicationId);
      
      const result = await applicationService.updateApplicationStatus(applicationId, status);
      
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: status as Application['status'] }
            : app
        )
      );

      setToast({ 
        show: true, 
        message: result.message, 
        type: 'success' 
      });

      // If approved and redirect URL is provided, show additional info
      if (status === 'APPROVED' && result.redirectUrl) {
        setTimeout(() => {
          setToast({ 
            show: true, 
            message: 'Learner can now access their dashboard at: ' + result.redirectUrl, 
            type: 'info' 
          });
        }, 2000);
      }
      
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update status';
      setToast({ show: true, message, type: 'error' });
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter applications
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.cohortName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesCohort = cohortFilter === "all" || app.cohortId === cohortFilter;
    
    return matchesSearch && matchesStatus && matchesCohort;
  });

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      APPROVED: "bg-green-100 text-green-800 border-green-200",
      REJECTED: "bg-red-100 text-red-800 border-red-200"
    };
    
    const icons = {
      PENDING: <Clock className="w-3 h-3" />,
      APPROVED: <CheckCircle className="w-3 h-3" />,
      REJECTED: <XCircle className="w-3 h-3" />
    };
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {status}
      </span>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Application Management</h1>
          <p className="text-gray-600">Review and manage cohort applications</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option key="all" value="all">All Status</option>
              <option key="pending" value="PENDING">Pending</option>
              <option key="approved" value="APPROVED">Approved</option>
              <option key="rejected" value="REJECTED">Rejected</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
          
          {/* Cohort Filter */}
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={cohortFilter}
              onChange={(e) => setCohortFilter(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option key="all" value="all">All Cohorts</option>
              {cohorts.map(cohort => (
                <option key={cohort.id} value={cohort.id}>{cohort.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
          
          {/* Results count */}
          <div className="flex items-center justify-center text-sm text-gray-600">
            {filteredApplications.length} results
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cohort</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{application.name}</div>
                        <div className="text-sm text-gray-500">{application.email}</div>
                        <div className="text-xs text-gray-400">Age: {application.age}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{application.cohortName}</div>
                        <div className="text-sm text-gray-500">{application.cohortType}</div>
                        <div className="text-xs text-gray-400">{application.cohortDates}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {new Date(application.appliedAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(application.appliedAt).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={application.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedApplication(application);
                            setShowDetailsModal(true);
                          }}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {application.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => updateApplicationStatus(application.id, 'APPROVED')}
                              disabled={updatingId === application.id}
                              className="p-1 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Approve"
                            >
                              {updatingId === application.id ? (
                                <div className="w-4 h-4 animate-spin rounded-full border border-green-600 border-t-transparent"></div>
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => updateApplicationStatus(application.id, 'REJECTED')}
                              disabled={updatingId === application.id}
                              className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredApplications.length === 0 && (
              <div className="text-center py-12">
                <UserIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Application Details Modal */}
      {showDetailsModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Application Details</h2>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Applicant Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Applicant Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Name:</span>
                    <div className="font-medium">{selectedApplication.name}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <div className="font-medium">{selectedApplication.email}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Age:</span>
                    <div className="font-medium">{selectedApplication.age}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Education:</span>
                    <div className="font-medium">{selectedApplication.educationLevel}</div>
                  </div>
                </div>
              </div>

              {/* Cohort Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Cohort Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Cohort:</span>
                    <div className="font-medium">{selectedApplication.cohortName}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Type:</span>
                    <div className="font-medium">{selectedApplication.cohortType}</div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Dates:</span>
                    <div className="font-medium">{selectedApplication.cohortDates}</div>
                  </div>
                </div>
              </div>

              {/* Application Answers */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Application Answers</h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-gray-500 text-sm">Time Commitment:</span>
                    <div className="text-sm mt-1">{selectedApplication.timeCommitment}</div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Teamwork Feelings:</span>
                    <div className="text-sm mt-1">{selectedApplication.teamworkFeelings}</div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Skills & Teamwork Thoughts:</span>
                    <div className="text-sm mt-1">{selectedApplication.skillsTeamworkThoughts}</div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Community Problem:</span>
                    <div className="text-sm mt-1">{selectedApplication.communityProblem}</div>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Application Status</h3>
                <div className="flex items-center gap-4">
                  <StatusBadge status={selectedApplication.status} />
                  <div className="text-sm text-gray-500">
                    Applied on {new Date(selectedApplication.appliedAt).toLocaleDateString()} at {new Date(selectedApplication.appliedAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              {selectedApplication.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => {
                      updateApplicationStatus(selectedApplication.id, 'REJECTED');
                      setShowDetailsModal(false);
                    }}
                    disabled={updatingId === selectedApplication.id}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    Reject Application
                  </button>
                  <button
                    onClick={() => {
                      updateApplicationStatus(selectedApplication.id, 'APPROVED');
                      setShowDetailsModal(false);
                    }}
                    disabled={updatingId === selectedApplication.id}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    Approve Application
                  </button>
                </>
              )}
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 
          toast.type === 'error' ? 'bg-red-600 text-white' : 
          'bg-blue-600 text-white'
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
