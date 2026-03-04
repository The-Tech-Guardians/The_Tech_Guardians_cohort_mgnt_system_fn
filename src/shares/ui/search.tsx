

import { useState, useRef, useEffect } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { IoClose } from "react-icons/io5";

const Search = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleToggle = () => {
    if (isExpanded && searchValue) {
      setSearchValue("");
    }
    setIsExpanded((prev) => !prev);
  };

  const handleClear = () => {
    setSearchValue("");
    inputRef.current?.focus();
  };

  return (
    <div className="flex  items-center gap-3">
      <div className="flex items-center gap-2 relative">
        <button
          onClick={handleToggle}
          className={`relative h-10 w-10 rounded-lg flex items-center justify-center text-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-md ${
            isExpanded
              ? "bg-[#2C7A7B] text-white shadow-lg"
              : "bg-gray-100 text-[#2C7A7B] hover:bg-gray-200"
          }`}
          aria-label={isExpanded ? "Close search" : "Open search"}
        >
          <IoSearchOutline
            className={`transition-transform duration-300 ${
              isExpanded ? "rotate-90" : "rotate-0"
            }`}
          />
        </button>

        <div
          className={`hidden sm:flex items-center gap-2 transition-all duration-300 ease-in-out ${
            isExpanded
              ? "w-64 opacity-100 translate-x-0"
              : "w-0 opacity-0 -translate-x-4 pointer-events-none"
          }`}
        >
          <div className="relative w-full">
            <input
              ref={inputRef}
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search services..."
              className="w-full h-10 pl-4 pr-10 rounded-lg border-2 border-[#2C7A7B] focus:border-[#245f60] focus:ring-2 focus:ring-[#2C7A7B]/20 outline-none transition-all duration-200 bg-white text-gray-800 placeholder-gray-400"
            />
            {searchValue && (
              <button
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear search"
              >
                <IoClose className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="sm:hidden  w-full animate-slideDown">
          <div className="relative">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search services..."
              className="w-full h-12 pl-4 pr-10 rounded-lg border-2 border-[#2C7A7B] focus:border-[#245f60] focus:ring-2 focus:ring-[#2C7A7B]/20 outline-none transition-all duration-200 bg-white text-gray-800 placeholder-gray-400"
              autoFocus
            />
            {searchValue && (
              <button
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear search"
              >
                <IoClose className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;