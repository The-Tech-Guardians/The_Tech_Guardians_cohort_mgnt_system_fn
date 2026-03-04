import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { FiMenu, FiBell, FiChevronDown } from "react-icons/fi";
import Sidebar from "../../../shares/ui/Sidebar";
import { userSidebarItems } from "./config/sidebarConfig";
import { useAuth } from "../../../context/AuthContext";

export default function UserDashboardLayout() {
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
        items={userSidebarItems}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        title="SupportHub"
        subtitle="User Portal"
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
                  {user?.name || "Member"}
                </p>
                <p className="text-[10px] text-gray-400 font-semibold uppercase mt-1">
                  {user?.role || "User"}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2C7A7B] to-[#37507E] flex items-center justify-center text-white font-bold shadow-md overflow-hidden">
                {user?.profilePicture ? (
                  <img src={`https://community-support-flatform-backend-1-0ghf.onrender.com/${user.profilePicture}`} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0).toUpperCase() || "U"
                )}
              </div>
              <FiChevronDown className="text-gray-400" />
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
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              !
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Confirm Logout</h2>
            <p className="text-gray-500 mb-8">Are you sure you want to exit your dashboard?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-3 bg-gray-50 text-gray-600 font-bold rounded-2xl hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-3 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 shadow-lg shadow-red-200 transition active:scale-95"
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
