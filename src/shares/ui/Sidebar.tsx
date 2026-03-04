import { FiX } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../images/logo.png";
import type { SidebarItem, SidebarProps } from "../../Types/types";


const Sidebar = ({ items, isOpen, onClose, title, subtitle, onLogout }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (item: SidebarItem) => {
    if (item.section === "logout") {
      onLogout();
    } else {
      navigate(item.path);
      if (window.innerWidth < 768) onClose();
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-[100] w-64 lg:w-72 bg-[#2C7A7B] shadow-2xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
      `}</style>

      <div className="flex items-center justify-between bg-black/10 px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="bg-white p-1.5 rounded-xl shadow-sm">
            <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
          </div>
          <div className="text-white">
            <h1 className="font-bold text-base tracking-tight">{title}</h1>
            <p className="text-[10px] opacity-60 uppercase font-semibold">{subtitle}</p>
          </div>
        </div>
        <button onClick={onClose} className="md:hidden text-white p-1 hover:bg-white/10 rounded-lg">
          <FiX size={24} />
        </button>
      </div>

      <nav className="mt-6 px-4 overflow-y-auto h-[calc(100vh-120px)] custom-scrollbar">
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.section}>
              <button
                onClick={() => handleNavigation(item)}
                className={`w-full flex items-center justify-between px-4 py-3.5 text-sm rounded-xl transition-all duration-200 group ${
                  isActive(item.path)
                    ? "bg-white text-[#2C7A7B] font-bold shadow-lg shadow-black/5"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={`h-5 w-5 ${
                      isActive(item.path) ? "" : "group-hover:scale-110 transition-transform"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {isActive(item.path) && <div className="w-1.5 h-1.5 rounded-full bg-[#2C7A7B]" />}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
