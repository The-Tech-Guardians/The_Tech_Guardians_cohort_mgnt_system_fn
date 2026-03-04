import { useState } from "react"
import { FiUsers, FiGrid, FiHome, FiFileText, FiSettings, FiLogOut, FiMenu, FiX, FiBell, FiChevronDown } from "react-icons/fi"
import logo from "../../../images/logo.png"
import { SiAbusedotch } from "react-icons/si"
import { useNavigate, NavLink, Outlet } from "react-router"

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  
  const currentUser = { name: "Admin", role: "Manager" }
  const navigate = useNavigate()

  const sidebarItems = [
    { icon: FiHome, label: "Dashboard", path: "/admin" },
    { icon: FiUsers, label: "Users", path: "/admin/users" },
    { icon: FiFileText, label: "Requests", path: "/admin/requests" },
    { icon: FiGrid, label: "Categories", path: "/admin/categories" },
    { icon: SiAbusedotch, label: "Abuse Reports", path: "/admin/abuse-reports" },
    { icon: FiSettings, label: "Settings", path: "/admin/settings" },
  ]

  const handleLogout = async () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate("/auth")
  }

  return (
    <div className="fixed inset-0 flex bg-[#F8FAFC] overflow-hidden z-[9999]">
      
      <aside
        className={`fixed inset-y-0 left-0 z-[100] w-64 lg:w-72 bg-[#2C7A7B] shadow-2xl transform transition-transform duration-300 ease-in-out 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0`}
      >
        <div className="flex items-center justify-between bg-black/10 px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-xl shadow-sm">
                <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
            </div>
            <div className="text-white">
              <h1 className="font-bold text-base tracking-tight">AdminPanel</h1>
              <p className="text-[10px] opacity-60 uppercase font-semibold">Control Center</p>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-white p-1 hover:bg-white/10 rounded-lg">
            <FiX size={24} />
          </button>
        </div>
        
        <nav className="mt-6 px-4 overflow-y-auto h-[calc(100vh-100px)] custom-scrollbar">
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === "/admin"}
                  onClick={() => { if (window.innerWidth < 768) setIsSidebarOpen(false) }}
                  className={({ isActive }) => `w-full flex items-center justify-between px-4 py-3.5 text-sm rounded-xl transition-all duration-200 group
                    ${isActive
                      ? "bg-white text-[#2C7A7B] font-bold shadow-lg shadow-black/5"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <item.icon className={`h-5 w-5 ${isActive ? "" : "group-hover:scale-110 transition-transform"}`} />
                        <span>{item.label}</span>
                      </div>
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#2C7A7B]" />}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
            <li>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="w-full flex items-center justify-between px-4 py-3.5 text-sm rounded-xl transition-all duration-200 group text-white/70 hover:bg-white/10 hover:text-white"
              >
                <div className="flex items-center gap-3">
                  <FiLogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  <span>Logout</span>
                </div>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 shrink-0">
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
                    <p className="text-sm font-bold text-gray-800 leading-none">{currentUser?.name || "Admin"}</p>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase mt-1">{currentUser?.role || "Manager"}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2C7A7B] to-[#37507E] flex items-center justify-center text-white font-bold shadow-md group-hover:shadow-lg transition-all">
                    {currentUser?.name?.charAt(0).toUpperCase() || "A"}
                </div>
                <FiChevronDown className="text-gray-400 group-hover:text-gray-600 transition-colors" />
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-row overflow-hidden">
           
           <div className="hidden md:block md:w-64 lg:w-72 shrink-0 h-full" />

           <main className="flex-1 h-full overflow-y-auto p-4 md:p-8 lg:p-10">
              <div className="max-w-7xl mx-auto w-full pb-10">
                <Outlet />
              </div>
           </main>
        </div>
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
  )
}

export default AdminLayout
