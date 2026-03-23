"use client";

interface SubNavigationProps {
  children: React.ReactNode;
}

export default function ReportsLayout({ children }: SubNavigationProps) {
  return (
    <div>
      {/* Page Content */}
      <div>
        {children}
      </div>
    </div>
  );
}
