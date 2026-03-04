'use client';

import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatCard from "@/components/admin/StatCard";
import RoleBadge from "@/components/admin/RoleBadge";
import Modal from "@/components/admin/Modal";
import Toast from "@/components/admin/Toast";
import LoadingSpinner from "@/components/admin/LoadingSpinner";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import EmptyState from "@/components/admin/EmptyState";
import { Users, BookOpen, Award, Package } from "lucide-react";

export default function ComponentShowcase() {
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="space-y-8">
      <AdminHeader 
        title="Component Showcase" 
        subtitle="Visual demonstration of all admin components"
      />

      <section>
        <h2 className="text-xl font-bold text-white mb-4">Stat Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Users" value="1,234" icon={Users} color="blue" trend={{ value: "12%", positive: true }} />
          <StatCard title="Courses" value="56" icon={BookOpen} color="green" />
          <StatCard title="Cohorts" value="23" icon={Award} color="amber" />
          <StatCard title="Resources" value="890" icon={Package} color="red" />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-4">Role Badges</h2>
        <div className="flex gap-4 flex-wrap">
          <RoleBadge role="admin" has2FA={true} />
          <RoleBadge role="instructor" has2FA={true} />
          <RoleBadge role="learner" />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-4">Interactive</h2>
        <div className="flex gap-3">
          <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all">
            Show Modal
          </button>
          <button onClick={() => setShowToast(true)} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all">
            Show Toast
          </button>
          <button onClick={() => setShowConfirm(true)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all">
            Confirm Dialog
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-4">Loading</h2>
        <div className="flex gap-8">
          <LoadingSpinner size="sm" />
          <LoadingSpinner size="md" />
          <LoadingSpinner size="lg" />
        </div>
      </section>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Example Modal" size="md">
        <p className="text-gray-300">Modal content here</p>
      </Modal>

      <Toast message="Success!" type="success" isVisible={showToast} onClose={() => setShowToast(false)} />

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => alert("Confirmed")}
        title="Confirm"
        message="Are you sure?"
      />
    </div>
  );
}
