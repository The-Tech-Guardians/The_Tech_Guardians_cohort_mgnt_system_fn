import React from "react";
import DataTable from "../../../components/admin/DataTable";

interface LogEntry {
  id: number;
  action: string;
  user: string;
  timestamp: string;
}

const sampleLogs: LogEntry[] = [
  { id: 1, action: "Role change to admin", user: "carol@example.com", timestamp: "2026-02-25 14:32" },
  { id: 2, action: "Cohort created", user: "alice@example.com", timestamp: "2026-02-24 09:12" },
];

export default function LogsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Audit Logs</h1>
      <DataTable
        data={sampleLogs}
        columns={[
          { header: "Time", accessor: "timestamp" },
          { header: "User", accessor: "user" },
          { header: "Action", accessor: "action" },
        ]}
      />
    </div>
  );
}
