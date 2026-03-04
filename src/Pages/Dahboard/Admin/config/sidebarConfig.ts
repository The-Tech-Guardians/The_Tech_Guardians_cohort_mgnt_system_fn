import { FiHome, FiFileText, FiGrid, FiUsers, FiSettings, FiLogOut, FiMessageSquare } from "react-icons/fi";
import { SiAbusedotch } from "react-icons/si";

export const adminSidebarItems = [
  { icon: FiHome, label: "Dashboard", section: "home", path: "/admin" },
  { icon: FiFileText, label: "Requests", section: "requests", path: "/admin/requests" },
  { icon: FiGrid, label: "Categories", section: "categories", path: "/admin/categories" },
  { icon: SiAbusedotch, label: "Abuse Reports", section: "abuse-reports", path: "/admin/abuse-reports" },
  { icon: FiUsers, label: "Users", section: "users", path: "/admin/users" },
  { icon: FiMessageSquare, label: "Messages", section: "messages", path: "/admin/messages" },
  { icon: FiSettings, label: "Settings", section: "settings", path: "/admin/settings" },
  { icon: FiLogOut, label: "Logout", section: "logout", path: "#" },
];
