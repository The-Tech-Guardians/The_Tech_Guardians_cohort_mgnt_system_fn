'use client';

import { useState } from "react";
import Modal from "@/components/admin/Modal";
import { Plus, Calendar, Users, BookOpen, Eye, Edit, Search } from "lucide-react";

interface Learner {
  id: number;
  name: string;
  email: string;
  progress: number;
  status: "active" | "inactive";
}

interface Cohort {
  id: number;
  name: string;
  courseType: string;
  startDate: string;
  endDate: string;
  enrollmentStart: string;
  enrollmentEnd: string;
  lateEnrollmentDays: number;
  learnerCount: number;
  status: "upcoming" | "active" | "completed";
  learners: Learner[];
}

export default function CohortsPage() {
  const [cohorts, setCohorts] = useState<Cohort[]>([
    {
      id: 1,
      name: "Web Dev Cohort Q1 2024",
      courseType: "Web Development",
      startDate: "2024-04-01",
      endDate: "2024-06-30",
      enrollmentStart: "2024-03-01",
      enrollmentEnd: "2024-03-25",
      lateEnrollmentDays: 5,
      learnerCount: 45,
      status: "active",
      learners: [
        { id: 1, name: "John Doe", email: "john@example.com", progress: 75, status: "active" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", progress: 60, status: "active" },
        { id: 3, name: "Mike Johnson", email: "mike@example.com", progress: 90, status: "active" },
      ],
    },
    {
      id: 2,
      name: "Python Bootcamp Spring",
      courseType: "Python Programming",
      startDate: "2024-05-01",
      endDate: "2024-07-31",
      enrollmentStart: "2024-04-01",
      enrollmentEnd: "2024-04-25",
      lateEnrollmentDays: 5,
      learnerCount: 32,
      status: "upcoming",
      learners: [
        { id: 4, name: "Sarah Williams", email: "sarah@example.com", progress: 45, status: "active" },
        { id: 5, name: "Tom Brown", email: "tom@example.com", progress: 30, status: "inactive" },
      ],
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLearnersModal, setShowLearnersModal] = useState(false);
  const [selectedCohort, setSelectedCohort] = useState<Cohort | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    courseType: "",
    startDate: "",
    endDate: "",
    enrollmentStart: "",
    enrollmentEnd: "",
    lateEnrollmentDays: 5,
  });

  const filteredCohorts = cohorts.filter(cohort =>
    cohort.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cohort.courseType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewLearners = (cohort: Cohort) => {
    setSelectedCohort(cohort);
    setShowLearnersModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCohort: Cohort = {
      id: cohorts.length + 1,
      ...formData,
      learnerCount: 0,
      status: "upcoming",
      learners: [],
    };
    setCohorts([...cohorts, newCohort]);
    setShowCreateModal(false);
    setFormData({
      name: "",
      courseType: "",
      startDate: "",
      endDate: "",
      enrollmentStart: "",
      enrollmentEnd: "",
      lateEnrollmentDays: 5,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
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

      {/* Cohorts Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredCohorts.map((cohort) => {
          const colors = {
            upcoming: "bg-blue-50 text-blue-600 border-blue-200",
            active: "bg-green-50 text-green-600 border-green-200",
            completed: "bg-gray-50 text-gray-600 border-gray-200",
          };
          
          return (
            <div key={cohort.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{cohort.name}</h3>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${colors[cohort.status]}`}>
                      {cohort.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    {cohort.courseType}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 transition-all">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleViewLearners(cohort)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-medium text-sm transition-all"
                  >
                    <Eye className="w-4 h-4" />
                    View Learners
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Start Date</p>
                  <p className="text-sm font-semibold text-gray-900">{new Date(cohort.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">End Date</p>
                  <p className="text-sm font-semibold text-gray-900">{new Date(cohort.endDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Learners</p>
                  <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                    <Users className="w-4 h-4 text-indigo-600" />
                    {cohort.learnerCount}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View Learners Modal */}
      <Modal
        isOpen={showLearnersModal}
        onClose={() => setShowLearnersModal(false)}
        title={`Learners - ${selectedCohort?.name || ''}`}
        size="lg"
      >
        <div className="space-y-4">
          {selectedCohort?.learners.map((learner) => (
            <div key={learner.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                  {learner.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{learner.name}</p>
                  <p className="text-xs text-gray-500">{learner.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-gray-500">Progress</p>
                  <p className="text-sm font-bold text-gray-900">{learner.progress}%</p>
                </div>
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all"
                    style={{ width: `${learner.progress}%` }}
                  />
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  learner.status === 'active' 
                    ? 'bg-green-50 text-green-600 border border-green-200' 
                    : 'bg-gray-50 text-gray-600 border border-gray-200'
                }`}>
                  {learner.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* Create Cohort Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Cohort"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cohort Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Web Dev Cohort Q1 2024"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Type</label>
              <select
                required
                value={formData.courseType}
                onChange={(e) => setFormData({ ...formData, courseType: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select course type</option>
                <option value="Web Development">Web Development</option>
                <option value="Python Programming">Python Programming</option>
                <option value="Data Science">Data Science</option>
                <option value="Content Creation">Content Creation</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Enrollment Start</label>
              <input
                type="date"
                required
                value={formData.enrollmentStart}
                onChange={(e) => setFormData({ ...formData, enrollmentStart: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Enrollment End</label>
              <input
                type="date"
                required
                value={formData.enrollmentEnd}
                onChange={(e) => setFormData({ ...formData, enrollmentEnd: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Late Enrollment Extension (days)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={formData.lateEnrollmentDays}
                onChange={(e) => setFormData({ ...formData, lateEnrollmentDays: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Allow learners to enroll up to 5 days after cohort starts</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs text-blue-700 flex items-start gap-2">
              <Calendar className="w-4 h-4 mt-0.5" />
              <span>Enrollment windows control when learners can join. Late enrollment allows flexibility for the first few days.</span>
            </p>
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
    </div>
  );
}
