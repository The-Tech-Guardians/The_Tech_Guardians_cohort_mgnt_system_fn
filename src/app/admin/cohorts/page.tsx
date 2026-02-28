'use client';

import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import { Plus, Calendar, Users, BookOpen } from "lucide-react";

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
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    courseType: "",
    startDate: "",
    endDate: "",
    enrollmentStart: "",
    enrollmentEnd: "",
    lateEnrollmentDays: 5,
  });

  const columns = [
    {
      key: "name",
      label: "Cohort",
      render: (cohort: Cohort) => (
        <div>
          <p className="font-medium text-white">{cohort.name}</p>
          <p className="text-xs text-gray-400">{cohort.courseType}</p>
        </div>
      ),
    },
    {
      key: "timeline",
      label: "Timeline",
      render: (cohort: Cohort) => (
        <div className="text-xs">
          <p className="text-gray-300">
            {new Date(cohort.startDate).toLocaleDateString()} - {new Date(cohort.endDate).toLocaleDateString()}
          </p>
          <p className="text-gray-500">
            Enrollment: {new Date(cohort.enrollmentStart).toLocaleDateString()} - {new Date(cohort.enrollmentEnd).toLocaleDateString()}
          </p>
        </div>
      ),
    },
    {
      key: "learnerCount",
      label: "Learners",
      render: (cohort: Cohort) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-white font-medium">{cohort.learnerCount}</span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (cohort: Cohort) => {
        const colors = {
          upcoming: "bg-blue-600/20 text-blue-400 border-blue-500/30",
          active: "bg-green-600/20 text-green-400 border-green-500/30",
          completed: "bg-gray-600/20 text-gray-400 border-gray-500/30",
        };
        return (
          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${colors[cohort.status]}`}>
            {cohort.status}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (cohort: Cohort) => (
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-xs font-medium rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 transition-all">
            Edit
          </button>
          <button className="px-3 py-1 text-xs font-medium rounded-lg bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 transition-all">
            View Learners
          </button>
        </div>
      ),
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCohort: Cohort = {
      id: cohorts.length + 1,
      ...formData,
      learnerCount: 0,
      status: "upcoming",
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
      <AdminHeader 
        title="Cohort Management" 
        subtitle="Create and manage learning cohorts"
      />

      {/* Action Button */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-600/50"
        >
          <Plus className="w-4 h-4" />
          Create Cohort
        </button>
      </div>

      {/* Cohorts Table */}
      <DataTable 
        columns={columns} 
        data={cohorts}
        searchPlaceholder="Search cohorts..."
      />

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
              <label className="block text-sm font-medium text-gray-300 mb-2">Cohort Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Web Dev Cohort Q1 2024"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Course Type</label>
              <select
                required
                value={formData.courseType}
                onChange={(e) => setFormData({ ...formData, courseType: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select course type</option>
                <option value="Web Development">Web Development</option>
                <option value="Python Programming">Python Programming</option>
                <option value="Data Science">Data Science</option>
                <option value="Content Creation">Content Creation</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Enrollment Start</label>
              <input
                type="date"
                required
                value={formData.enrollmentStart}
                onChange={(e) => setFormData({ ...formData, enrollmentStart: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Enrollment End</label>
              <input
                type="date"
                required
                value={formData.enrollmentEnd}
                onChange={(e) => setFormData({ ...formData, enrollmentEnd: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Late Enrollment Extension (days)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={formData.lateEnrollmentDays}
                onChange={(e) => setFormData({ ...formData, lateEnrollmentDays: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-400 mt-1">Allow learners to enroll up to 5 days after cohort starts</p>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-3">
            <p className="text-xs text-blue-300 flex items-start gap-2">
              <Calendar className="w-4 h-4 mt-0.5" />
              <span>Enrollment windows control when learners can join. Late enrollment allows flexibility for the first few days.</span>
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
            >
              Create Cohort
            </button>
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg font-medium transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
