"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Btn } from "@/components/instructor/ui/SharedUI";
import { useTranslation } from "@/components/i18n/LanguageProvider";
import { tokenManager } from "@/lib/auth";

interface AuthButtonsProps {
  textMuted: string;
  inputBorder: string;
  isDark: boolean;
}

interface UserDisplay {
  name: string;
  initials: string;
  role: string;
}

export default function AuthButtons({
  textMuted: _textMuted,
  inputBorder: _inputBorder,
  isDark,
}: AuthButtonsProps) {
  void _textMuted;
  void _inputBorder;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserDisplay | null>(null);
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const userData = tokenManager.getUser();
    if (!userData) return;

    const role = tokenManager.getRoleFromToken();
    const name =
      `${userData.firstName || ""} ${userData.lastName || ""}`.trim() ||
      userData.email?.split("@")[0] ||
      "User";

    const timer = window.setTimeout(() => {
      setUser({
        name,
        initials: name
          .split(" ")
          .map((part) => part[0])
          .join("")
          .toUpperCase()
          .substring(0, 2),
        role: role || "Learner",
      });
      setIsAuthenticated(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    tokenManager.logout();
    setDropdownOpen(false);
    setIsAuthenticated(false);
    setUser(null);
    router.push("/login");
  };

  const handleProfile = () => {
    setDropdownOpen(false);
    router.push("/profile");
  };

  if (!isAuthenticated) {
    return (
      <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
        <div className={`w-px h-5 ${isDark ? "bg-slate-700" : "bg-slate-200"} mr-1`} />
        <Link href="/register">
          <Btn variant="outline">{t("common.signUp")}</Btn>
        </Link>
        <Link href="/login">
          <Btn className="relative">
            <span className="relative">{t("common.logIn")} -&gt;</span>
          </Btn>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative hidden lg:flex items-center gap-2 flex-shrink-0">
      <div className={`w-px h-5 ${isDark ? "bg-slate-700" : "bg-slate-200"} mr-1`} />

      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg border border-gray-300 transition-all group"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:shadow-lg">
          {user?.initials}
        </div>
        <span className="text-sm font-semibold max-w-[120px] truncate">
          {user?.name}
        </span>
        <ChevronDown
          size={14}
          className={`text-gray-400 group-hover:text-gray-600 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
        />
      </button>

      {dropdownOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-48 dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-500 dark:border-slate-700 z-50 py-1 overflow-hidden">
            <button
              onClick={handleProfile}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all first:rounded-t-xl"
            >
              <User size={16} className="flex-shrink-0 text-gray-400" />
              {t("navbar.auth.editProfile")}
            </button>

            {user?.role.toUpperCase() === "ADMIN" && (
              <button
                onClick={() => router.push("/admin")}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-all"
              >
                <User size={16} className="flex-shrink-0" />
                {t("navbar.auth.adminDashboard")}
              </button>
            )}

            {user?.role.toUpperCase() === "LEARNER" && (
              <button
                onClick={() => router.push("/learner")}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-green-600 hover:bg-green-50 transition-all"
              >
                <User size={16} className="flex-shrink-0" />
                {t("navbar.auth.learnerDashboard")}
              </button>
            )}

            {user?.role.toUpperCase() === "INSTRUCTOR" && (
              <button
                onClick={() => router.push("/instructor")}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-purple-600 hover:bg-purple-50 transition-all"
              >
                <User size={16} className="flex-shrink-0" />
                {t("navbar.auth.instructorDashboard")}
              </button>
            )}

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all rounded-b-xl"
            >
              <LogOut size={16} className="flex-shrink-0" />
              {t("common.logout")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
