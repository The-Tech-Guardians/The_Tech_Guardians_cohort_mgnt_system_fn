import { Shield } from "lucide-react";

interface RoleBadgeProps {
  role: "admin" | "instructor" | "learner";
  has2FA?: boolean;
}

const colors = {
  admin: "bg-red-50 text-red-600 border-red-200",
  instructor: "bg-blue-50 text-blue-600 border-blue-200",
  learner: "bg-green-50 text-green-600 border-green-200",
};

export default function RoleBadge({ role, has2FA }: RoleBadgeProps) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${colors[role]}`}
      >
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
      {has2FA && (role === "admin" || role === "instructor") && (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-50 text-green-600 border border-green-200">
          <Shield className="w-3 h-3" />
          2FA
        </span>
      )}
    </div>
  );
}
