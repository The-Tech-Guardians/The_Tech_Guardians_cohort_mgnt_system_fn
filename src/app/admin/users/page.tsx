import React from "react";
import DataTable from "../../../components/admin/DataTable";
import RoleBadge from "../../../components/admin/RoleBadge";

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "instructor" | "learner";
  twoFA: boolean;
}

const sampleUsers: User[] = [
  { id: 1, name: "Alice Smith", email: "alice@example.com", role: "learner", twoFA: false },
  { id: 2, name: "Bob Johnson", email: "bob@example.com", role: "instructor", twoFA: true },
  { id: 3, name: "Carol Davis", email: "carol@example.com", role: "admin", twoFA: true },
];

export default function UsersPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <button className="px-4 py-2 bg-green-600 rounded">Invite Instructor</button>
      </div>
      <DataTable
        data={sampleUsers}
        columns={[
          { header: "Name", accessor: "name" },
          { header: "Email", accessor: "email" },
          {
            header: "Role",
            accessor: "role",
            render: (row) => <RoleBadge role={row.role} />,
          },
          {
            header: "2FA",
            accessor: "twoFA",
            render: (row) => (
              <span>{row.twoFA ? "✅" : "⚠️"}</span>
            ),
          },
          {
            header: "Actions",
            accessor: "id",
            render: (row) => (
              <div className="space-x-2">
                {row.role === "instructor" && (
                  <button className="px-2 py-1 bg-blue-600 rounded text-sm">
                    Promote
                  </button>
                )}
                <button className="px-2 py-1 bg-red-600 rounded text-sm">
                  Ban
                </button>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
