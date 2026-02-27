import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../ui/Logo";

const navItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Users", href: "/admin/users" },
  { label: "Cohorts", href: "/admin/cohorts" },
  { label: "Courses", href: "/admin/courses" },
  { label: "Moderation", href: "/admin/moderation" },
  { label: "Logs", href: "/admin/logs" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-800 min-h-screen flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <Link href="/admin">
          <a>
            <Logo showText />
          </a>
        </Link>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link href={item.href}>
                  <a
                    className={`block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors ${
                      active ? "bg-gray-700 text-white" : "text-gray-300"
                    }`}
                  >
                    {item.label}
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700 text-xs text-gray-400">
        CohortLMS Admin
      </div>
    </aside>
  );
}
