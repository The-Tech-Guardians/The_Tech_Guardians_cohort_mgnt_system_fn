


import { Link } from "react-router";
import logo from "../../images/image.png";

const Logo = () => {
  return (
    <Link to="/" className="group">
      <div className="flex items-center gap-3 transition-all duration-300">
        <div className="relative">
          <div className="absolute inset-0 bg-[#2C7A7B]/10 rounded-full blur-xl group-hover:bg-[#2C7A7B]/20 transition-all duration-300"></div>
          <img
            src={logo}
            alt="Community Support Logo"
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain relative z-10 transform group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="hidden sm:block">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#2C7A7B] group-hover:text-[#245f60] transition-colors duration-300 leading-tight">
            Community Support
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300 font-medium">
            Services Exchanges Platform
          </p>
        </div>
        <div className="block sm:hidden">
          <h1 className="text-base font-bold text-[#2C7A7B] group-hover:text-[#245f60] transition-colors duration-300 leading-tight">
            Community
          </h1>
          <p className="text-xs text-gray-600 group-hover:text-gray-700 transition-colors duration-300 font-medium">
            Support
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Logo;