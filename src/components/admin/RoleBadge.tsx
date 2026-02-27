interface RoleBadgeProps {
  role: "admin" | "instructor" | "learner";
}

const colors = {
  admin: "bg-red-600 text-white",
  instructor: "bg-blue-600 text-white",
  learner: "bg-green-600 text-white",
};

export default function RoleBadge({ role }: RoleBadgeProps) {
  return (
    <span
      className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
        colors[role]
      }`}
    >
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
}
