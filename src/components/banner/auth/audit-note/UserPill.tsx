// components/auth/two-fa/UserPill.tsx
// Displays the authenticated user's avatar, name, email and role badge
// at the top of the 2FA method-selection card.

interface UserPillProps {
  initials: string;
  name: string;
  email: string;
  role: "Admin" | "Instructor" | "Learner";
}

export default function UserPill({ initials, name, email, role }: UserPillProps) {
  return (
    <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl p-3 mb-6">
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#06B6D4] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
        {initials}
      </div>

      {/* Name / email */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-[#111827] truncate">{name}</p>
        <p className="text-xs text-gray-400 truncate">{email}</p>
      </div>

      {/* Role badge */}
      <span className="text-xs font-bold bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-full px-2.5 py-1 flex-shrink-0">
        {role}
      </span>
    </div>
  );
}