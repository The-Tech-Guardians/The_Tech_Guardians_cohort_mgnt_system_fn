import { Lock, Shield, Smartphone } from "lucide-react";

const TRUST_ITEMS = [
  { icon: <Lock />, title: "End-to-End Encrypted",   sub: "Your data is always protected"       },
  { icon: <Shield />, title: "Every Login Secured",     sub: "2FA enforced on every session"       },
  { icon: <Smartphone />, title: "App or SMS Supported",    sub: "Use your preferred 2FA method"       },
];

export default function TwoFAPanel() {
  return (
    <div className="space-y-6">
      <div>
        <div className="w-12 h-1 bg-[#4F46E5] rounded-full mb-4" />
        <h2 className="text-[34px] font-extrabold text-white leading-tight">
          Two-Factor<br />
          <span className="text-indigo-400">Authentication</span>
        </h2>
        <p className="text-white/45 text-sm mt-3 max-w-[270px] leading-relaxed">
          Required for all Admins and Instructors on every login. Your account
          security is our priority.
        </p>
      </div>
      <ul className=" text-blue-600 space-y-3" role="list">
        {TRUST_ITEMS.map((item) => (
          <li
            key={item.title}
            className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3"
          >
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-base flex-shrink-0">
              {item.icon}
            </div>
            <div>
              <p className="text-white text-sm font-semibold">{item.title}</p>
              <p className="text-white/35 text-xs">{item.sub}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <p className="text-white/40 text-xs leading-relaxed">
          All authentication events are logged in the platform&apos;s audit trail per
          your security policy.
        </p>
      </div>
    </div>
  );
}