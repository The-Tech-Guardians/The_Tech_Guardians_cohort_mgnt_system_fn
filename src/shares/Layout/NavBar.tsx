
import { useState, useEffect } from "react";
import Logo from "../ui/logo";
import Search from "../ui/search";
import { Link } from "react-router";
import { HiMenuAlt3, HiX } from "react-icons/hi";

interface User {
  role: string;
  name: string;
}

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    return (storedUser && token) ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      setUser((storedUser && token) ? JSON.parse(storedUser) : null);
    };
    window.addEventListener("storage", handleStorageChange);
    
    // Check auth status on mount and periodically
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      setUser((storedUser && token) ? JSON.parse(storedUser) : null);
    };
    
    const interval = setInterval(checkAuth, 1000);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg"
            : "bg-white shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
          
            <div className="shrink-0">
              <Logo />
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Search />
              {user ? (
                <Link to={user.role === 'admin' ? "/admin" : "/dashboard"}>
                  <button className="relative overflow-hidden group bg-[#2C7A7B] hover:bg-[#245f60] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5">
                    <span className="relative z-10">{user.role === 'admin' ? 'Admin Dashboard' : 'User Dashboard'}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#3a9a9c] to-[#2C7A7B] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </Link>
              ) : (
                <Link to="/auth">
                  <button className="relative overflow-hidden group bg-[#2C7A7B] hover:bg-[#245f60] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5">
                    <span className="relative z-10">Login</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#3a9a9c] to-[#2C7A7B] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </Link>
              )}
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <HiX className="w-6 h-6 text-[#2C7A7B]" />
              ) : (
                <HiMenuAlt3 className="w-6 h-6 text-[#2C7A7B]" />
              )}
            </button>
          </div>
        </div>
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 pb-6 pt-2 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              <Search />
              {user ? (
                <Link
                  to={user.role === 'admin' ? "/admin" : "/dashboard"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full"
                >
                  <button className="w-full bg-[#2C7A7B] hover:bg-[#245f60] text-white px-5 py-3 rounded-lg text-sm font-semibold transition-colors duration-300 shadow-md">
                    {user.role === 'admin' ? 'Admin Dashboard' : 'User Dashboard'}
                  </button>
                </Link>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full"
                >
                  <button className="w-full bg-[#2C7A7B] hover:bg-[#245f60] text-white px-5 py-3 rounded-lg text-sm font-semibold transition-colors duration-300 shadow-md">
                    Login
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="h-20"></div>
    </>
  );
};

export default NavBar;