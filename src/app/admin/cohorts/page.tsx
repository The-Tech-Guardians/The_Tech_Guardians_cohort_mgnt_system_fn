import React, { useState } from "react";
import DataTable from "../../../components/admin/DataTable";

interface Cohort {
  id: number;
  name: string;
  start: string;
  end: string;
  enrollmentCloses: string;
  courseType: string;
  lateExtension: boolean;
}

const sampleCohorts: Cohort[] = [
  {
    id: 1,
    name: "Web Dev Bootcamp",
    start: "2026-03-01",
    end: "2026-06-01",
    enrollmentCloses: "2026-02-25",
    courseType: "Coding",
    lateExtension: true,
  },
];

export default function CohortsPage() {
  const [cohorts] = useState(sampleCohorts);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Cohort Management</h1>
        <button className="px-4 py-2 bg-green-600 rounded">New Cohort</button>
      </div>
      <DataTable
        data={cohorts}
        columns={[
          { header: "Name", accessor: "name" },
          { header: "Start", accessor: "start" },
          { header: "End", accessor: "end" },
          { header: "Enroll Closes", accessor: "enrollmentCloses" },
          { header: "Course Type", accessor: "courseType" },
          {
            header: "Late Ext?",
            accessor: "lateExtension",
            render: (r) => (r.lateExtension ? "✅" : "—"),
          },
        ]}
      />
    </div>
  );
}
