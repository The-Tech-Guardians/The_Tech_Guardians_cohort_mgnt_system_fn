import { Shield } from "lucide-react";

interface RoleBadgeProps {
  role: "admin" | "instructor" | "learner";
  has2FA?: boolean;
}

const colors = {
  admin: "bg-red-600/20 text-red-400 border-red-500/30",
  instructor: "bg-blue-600/20 text-blue-400 border-blue-500/30",
  learner: "bg-green-600/20 text-green-400 border-green-500/30",
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
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-600/20 text-green-400 border border-green-500/30">
          <Shield className="w-3 h-3" />
          2FA
        </span>
      )}
    </div>
  );
}
