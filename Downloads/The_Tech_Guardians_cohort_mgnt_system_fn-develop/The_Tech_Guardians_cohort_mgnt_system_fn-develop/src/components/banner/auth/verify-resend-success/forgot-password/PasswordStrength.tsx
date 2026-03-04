// components/auth/forgot-password/PasswordStrength.tsx
// Live strength bar + per-requirement checklist shown while typing.

interface PasswordStrengthProps {
  password: string;
}

interface Requirement {
  key: string;
  label: string;
  test: (p: string) => boolean;
}

const REQUIREMENTS: Requirement[] = [
  { key: "len",     label: "At least 8 characters",  test: (p) => p.length >= 8           },
  { key: "upper",   label: "One uppercase letter",    test: (p) => /[A-Z]/.test(p)         },
  { key: "num",     label: "One number",              test: (p) => /[0-9]/.test(p)         },
  { key: "special", label: "One special character",   test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const STRENGTH_COLORS = ["", "#EF4444", "#F59E0B", "#3B82F6", "#10B981"];
const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null;

  const checks = REQUIREMENTS.map((r) => r.test(password));
  const score  = checks.filter(Boolean).length;
  const color  = STRENGTH_COLORS[score];
  const label  = STRENGTH_LABELS[score];

  return (
    <div className="mt-2 space-y-2" aria-live="polite">
      {/* Bars */}
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{ background: i <= score ? color : "#E5E7EB" }}
          />
        ))}
      </div>

      {/* Label */}
      <p className="text-xs font-medium" style={{ color }}>
        {label} password
      </p>

      {/* Requirement list */}
      <ul className="space-y-1">
        {REQUIREMENTS.map((r, idx) => (
          <li
            key={r.key}
            className="flex items-center gap-1.5 text-xs transition-colors"
            style={{ color: checks[idx] ? "#10B981" : "#9CA3AF" }}
          >
            <span aria-hidden="true">{checks[idx] ? "✓" : "○"}</span>
            <span>{r.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}