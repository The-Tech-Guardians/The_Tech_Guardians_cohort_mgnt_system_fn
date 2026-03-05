interface RoleBadgeProps {
  role: 'admin' | 'instructor' | 'learner';
  has2FA?: boolean;
}

export default function RoleBadge({ role, has2FA }: RoleBadgeProps) {
  const colors = {
    admin: 'bg-red-100 text-red-800',
    instructor: 'bg-blue-100 text-blue-800', 
    learner: 'bg-green-100 text-green-800'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[role]}`}>
      {role} {has2FA && '🔒'}
    </span>
  );
}