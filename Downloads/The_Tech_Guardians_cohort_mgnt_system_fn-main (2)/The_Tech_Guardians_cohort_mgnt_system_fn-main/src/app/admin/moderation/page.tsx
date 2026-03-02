'use client';

import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import DataTable from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import RoleBadge from "@/components/admin/RoleBadge";
import { Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface BanRequest {
  id: number;
  targetUser: {
    name: string;
    email: string;
    role: "instructor" | "learner";
  };
  requestedBy: string;
  reason: string;
  approvals: number;
  requiredApprovals: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

interface BannedUser {
  id: number;
  name: string;
  email: string;
  role: "instructor" | "learner";
  bannedBy: string;
  reason: string;
  bannedAt: string;
}

export default function ModerationPage() {
  const [banRequests, setBanRequests] = useState<BanRequest[]>([
    {
      id: 1,
      targetUser: {
        name: "John Problem",
        email: "john.problem@example.com",
        role: "learner",
      },
      requestedBy: "Instructor Smith",
      reason: "Repeated plagiarism in assignments",
      approvals: 1,
      requiredApprovals: 2,
      status: "pending",
      createdAt: "2024-03-20",
    },
  ]);

  const [bannedUsers, setBannedUsers] = useState<BannedUser[]>([
    {
      id: 1,
      name: "Bad Actor",
      email: "bad@example.com",
      role: "instructor",
      bannedBy: "Admin User",
      reason: "Inappropriate conduct",
      bannedAt: "2024-03-15",
    },
  ]);

  const [showBanModal, setShowBanModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BanRequest | null>(null);

  const handleApprove = (requestId: number) => {
    setBanRequests(banRequests.map(req => 
      req.id === requestId 
        ? { ...req, approvals: req.approvals + 1, status: req.approvals + 1 >= req.requiredApprovals ? "approved" as const : req.status }
        : req
    ));
  };

  const handleReject = (requestId: number) => {
    setBanRequests(banRequests.map(req => 
      req.id === requestId ? { ...req, status: "rejected" as const } : req
    ));
  };

  const requestColumns = [
    {
      key: "targetUser",
      label: "User",
      render: (req: BanRequest) => (
        <div>
          <p className="font-medium text-white">{req.targetUser.name}</p>
          <p className="text-xs text-gray-400">{req.targetUser.email}</p>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (req: BanRequest) => <RoleBadge role={req.targetUser.role} />,
    },
    {
      key: "requestedBy",
      label: "Requested By",
      render: (req: BanRequest) => <span className="text-sm text-gray-300">{req.requestedBy}</span>,
    },
    {
      key: "approvals",
      label: "Approvals",
      render: (req: BanRequest) => (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(req.requiredApprovals)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < req.approvals ? "bg-green-500" : "bg-gray-600"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-400">
            {req.approvals}/{req.requiredApprovals}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (req: BanRequest) => {
        const colors = {
          pending: "bg-amber-600/20 text-amber-400 border-amber-500/30",
          approved: "bg-green-600/20 text-green-400 border-green-500/30",
          rejected: "bg-red-600/20 text-red-400 border-red-500/30",
        };
        return (
          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${colors[req.status]}`}>
            {req.status}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (req: BanRequest) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedRequest(req);
              setShowDetailsModal(true);
            }}
            className="px-3 py-1 text-xs font-medium rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 transition-all"
          >
            Details
          </button>
          {req.status === "pending" && (
            <>
              <button
                onClick={() => handleApprove(req.id)}
                className="p-1 rounded-lg bg-green-600/20 text-green-400 hover:bg-green-600/30 transition-all"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleReject(req.id)}
                className="p-1 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-all"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  const bannedColumns = [
    {
      key: "name",
      label: "User",
      render: (user: BannedUser) => (
        <div>
          <p className="font-medium text-white">{user.name}</p>
          <p className="text-xs text-gray-400">{user.email}</p>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (user: BannedUser) => <RoleBadge role={user.role} />,
    },
    {
      key: "bannedBy",
      label: "Banned By",
      render: (user: BannedUser) => <span className="text-sm text-gray-300">{user.bannedBy}</span>,
    },
    {
      key: "reason",
      label: "Reason",
      render: (user: BannedUser) => (
        <span className="text-sm text-gray-300 line-clamp-1">{user.reason}</span>
      ),
    },
    {
      key: "bannedAt",
      label: "Banned Date",
      render: (user: BannedUser) => new Date(user.bannedAt).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (user: BannedUser) => (
        <button className="px-3 py-1 text-xs font-medium rounded-lg bg-green-600/20 text-green-400 border border-green-500/30 hover:bg-green-600/30 transition-all">
          Unban
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminHeader 
        title="Moderation & Discipline" 
        subtitle="Manage ban requests and user discipline"
      />

      {/* Moderation Rules */}
      <div className="bg-amber-600/10 border border-amber-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-amber-400 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-amber-400 mb-1">Moderation Rules</h3>
            <ul className="text-xs text-amber-300/80 space-y-1">
              <li>• Admins can ban instructors directly (immediate effect)</li>
              <li>• Learner bans require 2 instructor approvals</li>
              <li>• All ban actions are logged in audit trail</li>
              <li>• Banned users lose all platform access</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Ban Requests Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Pending Ban Requests</h2>
          <button
            onClick={() => setShowBanModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-red-600/50"
          >
            <AlertTriangle className="w-4 h-4" />
            Create Ban Request
          </button>
        </div>
        <DataTable 
          columns={requestColumns} 
          data={banRequests}
          searchPlaceholder="Search ban requests..."
        />
      </div>

      {/* Banned Users Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Banned Users</h2>
        <DataTable 
          columns={bannedColumns} 
          data={bannedUsers}
          searchPlaceholder="Search banned users..."
        />
      </div>

      {/* Create Ban Request Modal */}
      <Modal
        isOpen={showBanModal}
        onClose={() => setShowBanModal(false)}
        title="Create Ban Request"
        size="md"
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">User Email</label>
            <input
              type="email"
              placeholder="user@example.com"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Reason for Ban</label>
            <textarea
              rows={4}
              placeholder="Provide detailed reason for ban request..."
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-3">
            <p className="text-xs text-red-300">
              <AlertTriangle className="w-4 h-4 inline mr-1" />
              Learner bans require 2 instructor approvals. Instructor bans are immediate.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all"
            >
              Submit Ban Request
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

      {/* Request Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Ban Request Details"
        size="md"
      >
        {selectedRequest && (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400">Target User</label>
              <p className="text-white font-medium">{selectedRequest.targetUser.name}</p>
              <p className="text-sm text-gray-400">{selectedRequest.targetUser.email}</p>
            </div>
            <div>
              <label className="text-xs text-gray-400">Requested By</label>
              <p className="text-white">{selectedRequest.requestedBy}</p>
            </div>
            <div>
              <label className="text-xs text-gray-400">Reason</label>
              <p className="text-white">{selectedRequest.reason}</p>
            </div>
            <div>
              <label className="text-xs text-gray-400">Status</label>
              <p className="text-white">
                {selectedRequest.approvals}/{selectedRequest.requiredApprovals} approvals ({selectedRequest.status})
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
