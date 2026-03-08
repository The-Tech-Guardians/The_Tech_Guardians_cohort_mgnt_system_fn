"use client";

import Link from "next/link";

interface Category {
  label: string;
  href: string;
}

interface CategoryBarProps {
  categories: Category[];
  activeCategory: number;
  setActiveCategory: (index: number) => void;
  bg: string;
  border: string;
  textMuted: string;
  hoverBg: string;
  isDark: boolean;
}

export default function CategoryBar({
  categories,
  activeCategory,
  setActiveCategory,
  bg,
  border,
  textMuted,
  hoverBg,
}: CategoryBarProps) {
  return (
    <div className={`hidden lg:block ${bg} border-b ${border} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-8">
        <div className="no-scrollbar flex items-center gap-0.5 h-11 overflow-x-auto">
          {categories.map((item, i) => {
            const isActive = activeCategory === i;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setActiveCategory(i)}
                className={`
                  flex items-center gap-1.5 text-[12.5px] font-medium px-3.5 py-1.5 rounded-md
                  transition-all duration-150 whitespace-nowrap
                  ${isActive
                    ? "border border-blue-600 bg-blue-50 text-blue-600"
                    : `${textMuted} ${hoverBg} border border-transparent`
                  }
                `}
              >
                {/* Category dot indicator */}
                <span
                  className={`
                    w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-300
                    ${isActive
                      ? "bg-blue-500 scale-100 opacity-100"
                      : "bg-current scale-75 opacity-0 group-hover:opacity-40 group-hover:scale-100"
                    }
                  `}
                />

                {item.label}

                {/* Active underline bar */}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-t-full bg-gradient-to-r from-blue-500 to-cyan-400 animate-in fade-in slide-in-from-bottom-1 duration-200" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}