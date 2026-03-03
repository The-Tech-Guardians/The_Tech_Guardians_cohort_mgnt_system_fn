interface CategoryBarProps {
  categories: string[];
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
  isDark,
}: CategoryBarProps) {
  return (
    <div className={`hidden lg:block ${bg} border-b ${border} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-8">
        <div className="no-scrollbar flex items-center gap-0.5 h-10 overflow-x-auto">
          {categories.map((item, i) => (
            <button
              key={item}
              onClick={() => setActiveCategory(i)}
              className={`relative text-[12.5px] font-medium px-3 py-1.5 rounded-md whitespace-nowrap transition-all duration-200 ${
                activeCategory === i
                  ? "text-blue-600"
                  : `${textMuted} ${hoverBg} ${isDark ? "hover:text-slate-200" : "hover:text-slate-800"}`
              }`}
            >
              {item}
              {activeCategory === i && (
                <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-t-full bg-gradient-to-r from-blue-500 to-cyan-400" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
