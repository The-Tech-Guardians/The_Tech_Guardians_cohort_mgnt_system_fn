import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { FiMenu, FiBell, FiChevronDown, FiLogOut } from "react-icons/fi";
import Sidebar from "../../../shares/ui/Sidebar";
import { adminSidebarItems } from "./config/sidebarConfig";
import { useAuth } from "../../../context/AuthContext";

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar
        items={adminSidebarItems}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        title="AdminPanel"
        subtitle="Control Center"
        onLogout={() => setShowLogoutModal(true)}
      />

      <div className="flex-1 flex flex-col min-w-0 w-full md:ml-64 lg:ml-72">
        <header className="h-16 md:h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiMenu size={22} />
            </button>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <button className="relative p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
              <FiBell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="h-8 w-[1px] bg-gray-100 hidden sm:block" />

            <div className="flex items-center gap-3 pl-2 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-800 leading-none">
                  {user?.name || "Admin"}
                </p>
                <p className="text-[10px] text-gray-400 font-semibold uppercase mt-1">
                  {user?.role || "Manager"}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2C7A7B] to-[#37507E] flex items-center justify-center text-white font-bold shadow-md group-hover:shadow-lg transition-all overflow-hidden">
                {user?.profilePicture ? (
                  <img src={`https://community-support-flatform-backend-1-0ghf.onrender.com/${user.profilePicture}`} alt={user.name} className="w-full h-full object-cover " />
                ) : (
                  user?.name?.charAt(0).toUpperCase() || "A"
                )}
              </div>
              <FiChevronDown className="text-gray-400 group-hover:text-gray-600 transition-colors" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <FiLogOut className="text-red-600" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Confirm Logout</h3>
                <p className="text-sm text-gray-500">Are you sure you want to logout?</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
