'use client';

import { useState } from "react";
import Modal from "@/components/admin/Modal";
import RoleBadge from "@/components/admin/RoleBadge";
import { Shield, AlertTriangle, CheckCircle, XCircle, Search } from "lucide-react";

interface BanRequest {
  id: number;
  targetUser: { name: string; email: string; role: "instructor" | "learner"; };
  requestedBy: string;
  reason: string;
  approvals: number;
  requiredApprovals: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export default function ModerationPage() {
  const [banRequests, setBanRequests] = useState<BanRequest[]>([
    {
      id: 1,
      targetUser: { name: "John Problem", email: "john.problem@example.com", role: "learner" },
      requestedBy: "Instructor Smith",
      reason: "Repeated plagiarism in assignments",
      approvals: 1,
      requiredApprovals: 2,
      status: "pending",
      createdAt: "2024-03-20",
    },
  ]);

  const [showBanModal, setShowBanModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [banForm, setBanForm] = useState({ email: "", reason: "" });

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

  const filteredRequests = banRequests.filter(req =>
    req.targetUser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.targetUser.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowBanModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all shadow-sm text-sm"
        >
          <AlertTriangle className="w-4 h-4" />
          Create Ban Request
        </button>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
          />
        </div>
      </div>

      {/* Moderation Rules */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-amber-900 mb-2">Moderation Rules</h3>
            <ul className="text-xs text-amber-700 space-y-1">
              <li>• Admins can ban instructors directly (immediate effect)</li>
              <li>• Learner bans require 2 instructor approvals</li>
              <li>• All ban actions are logged in audit trail</li>
              <li>• Banned users lose all platform access</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Ban Requests */}
      <div className="grid grid-cols-1 gap-4">
        {filteredRequests.map((req) => {
          const colors = {
            pending: "bg-amber-50 text-amber-600 border-amber-200",
            approved: "bg-green-50 text-green-600 border-green-200",
            rejected: "bg-red-50 text-red-600 border-red-200",
          };
          
          return (
            <div key={req.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{req.targetUser.name}</h3>
                    <RoleBadge role={req.targetUser.role} />
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${colors[req.status]}`}>
                      {req.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{req.targetUser.email}</p>
                </div>
                {req.status === "pending" && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApprove(req.id)}
                      className="p-2 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-all"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleReject(req.id)}
                      className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Requested By</p>
                  <p className="text-sm font-semibold text-gray-900">{req.requestedBy}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Approvals</p>
                  <p className="text-sm font-semibold text-gray-900">{req.approvals}/{req.requiredApprovals}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Reason</p>
                  <p className="text-sm font-semibold text-gray-900">{req.reason}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Ban Request Modal */}
      <Modal isOpen={showBanModal} onClose={() => setShowBanModal(false)} title="Create Ban Request" size="md">
        <form onSubmit={(e) => {
          e.preventDefault();
          const newRequest: BanRequest = {
            id: banRequests.length + 1,
            targetUser: { name: banForm.email.split('@')[0], email: banForm.email, role: "learner" },
            requestedBy: "Current Admin",
            reason: banForm.reason,
            approvals: 0,
            requiredApprovals: 2,
            status: "pending",
            createdAt: new Date().toISOString().split('T')[0],
          };
          setBanRequests([...banRequests, newRequest]);
          setBanForm({ email: "", reason: "" });
          setShowBanModal(false);
        }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">User Email</label>
            <input
              type="email"
              required
              value={banForm.email}
              onChange={(e) => setBanForm({ ...banForm, email: e.target.value })}
              placeholder="user@example.com"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Ban</label>
            <textarea
              rows={4}
              required
              value={banForm.reason}
              onChange={(e) => setBanForm({ ...banForm, reason: e.target.value })}
              placeholder="Provide detailed reason for ban request..."
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-xs text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Learner bans require 2 instructor approvals. Instructor bans are immediate.
            </p>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all">
              Submit Ban Request
            </button>
            <button type="button" onClick={() => setShowBanModal(false)} className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all">
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
