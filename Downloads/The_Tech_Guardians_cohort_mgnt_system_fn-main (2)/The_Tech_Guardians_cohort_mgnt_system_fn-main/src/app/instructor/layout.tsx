import React from "react";
import Sidebar from "../../components/admin/Sidebar";

export const metadata = {
  title: "Instructor Dashboard - CohortLMS",
};

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-gray-900 text-gray-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
