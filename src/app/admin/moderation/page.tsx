import React from "react";
import DataTable from "../../../components/admin/DataTable";

interface BanRequest {
  id: number;
  user: string;
  reason: string;
  approvals: number;
}

const sampleRequests: BanRequest[] = [
  { id: 1, user: "student1@example.com", reason: "cheating", approvals: 1 },
];

export default function ModerationPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Moderation</h1>
      <section>
        <h2 className="text-2xl font-semibold mb-4">Ban Requests</h2>
        <DataTable
          data={sampleRequests}
          columns={[
            { header: "User", accessor: "user" },
            { header: "Reason", accessor: "reason" },
            { header: "Approvals", accessor: "approvals" },
            {
              header: "Actions",
              accessor: "id",
              render: (row) => (
                <div className="space-x-2">
                  <button className="px-2 py-1 bg-green-600 rounded text-sm">
                    Approve
                  </button>
                  <button className="px-2 py-1 bg-red-600 rounded text-sm">
                    Reject
                  </button>
                </div>
              ),
            },
          ]}
        />
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-4">Banned Users (manual)</h2>
        <p className="text-gray-400">List of currently banned learners/instructors.</p>
      </section>
    </div>
  );
}
