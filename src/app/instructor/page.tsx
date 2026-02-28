'use client';

import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatCard from "@/components/admin/StatCard";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import { BookOpen, Users, FileText, AlertTriangle, Plus } from "lucide-react";

interface Learner {
  id: number;
  name: string;
  email: string;
  progress: number;
  lastActive: string;
  submissions: number;
}

export default function InstructorDashboard() {
  const [showBanModal, setShowBanModal] = useState(false);
  const [selectedLearner, setSelectedLearner] = useState<Learner | null>(null);

  const learners: Learner[] = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", progress: 85, lastActive: "2024-03-20", submissions: 12 },
    { id: 2, name: "Bob Smith", email: "bob@example.com", progress: 62, lastActive: "2024-03-19", submissions: 8 },
    { id: 3, name: "Carol White", email: "carol@example.com", progress: 94, lastActive: "2024-03-20", submissions: 15 },
  ];

  const columns = [
    {
      key: "name",
      label: "Learner",
      render: (learner: Learner) => (
        <div>
          <p className="font-medium text-white">{learner.name}</p>
          <p className="text-xs text-gray-400">{learner.email}</p>
        </div>
      ),
    },
    {
      key: "progress",
      label: "Progress",
      render: (learner: Learner) => (
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500" style={{ width: `${learner.progress}%` }} />
          </div>
          <span className="text-sm text-gray-300">{learner.progress}%</span>
        </div>
      ),
    },
    {
      key: "submissions",
      label: "Submissions",
      render: (learner: Learner) => <span className="text-sm text-gray-300">{learner.submissions}</span>,
    },
    {
      key: "lastActive",
      label: "Last Active",
      render: (learner: Learner) => <span className="text-sm text-gray-400">{new Date(learner.lastActive).toLocaleDateString()}</span>,
    },
    {
      key: "actions",
      label: "Actions",
      render: (learner: Learner) => (
        <button
          onClick={() => {
            setSelectedLearner(learner);
            setShowBanModal(true);
          }}
          className="px-3 py-1 text-xs font-medium rounded-lg bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30 transition-all"
        >
          Request Ban
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Instructor Dashboard" 
        subtitle="Manage your courses and learners"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="My Courses" value="3" icon={BookOpen} color="blue" />
        <StatCard title="Total Learners" value="45" icon={Users} color="green" />
        <StatCard title="Pending Reviews" value="8" icon={FileText} color="amber" />
        <StatCard title="Ban Requests" value="1" icon={AlertTriangle} color="red" />
      </div>

      {/* Course Management */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">My Courses</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all">
            <Plus className="w-4 h-4" />
            Create Course
          </button>
        </div>
        <div className="grid gap-4">
          {["Web Development", "JavaScript Advanced", "React Fundamentals"].map((course, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-white">{course}</p>
                  <p className="text-xs text-gray-400">15 learners enrolled</p>
                </div>
              </div>
              <button className="px-3 py-1 text-xs font-medium rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 transition-all">
                Manage
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Learner Management */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Learner Management</h2>
        <DataTable columns={columns} data={learners} searchPlaceholder="Search learners..." />
      </div>

      {/* Ban Request Modal */}
      <Modal
        isOpen={showBanModal}
        onClose={() => setShowBanModal(false)}
        title="Request Learner Ban"
        size="md"
      >
        <form className="space-y-4">
          <div className="bg-amber-600/10 border border-amber-500/30 rounded-lg p-3">
            <p className="text-xs text-amber-300">
              Learner ban requests require approval from 2 instructors before taking effect.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Learner</label>
            <input
              type="text"
              value={selectedLearner?.name || ""}
              disabled
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Reason for Ban</label>
            <textarea
              rows={4}
              placeholder="Provide detailed reason..."
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all"
            >
              Submit Request
            </button>
            <button
              type="button"
              onClick={() => setShowBanModal(false)}
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
