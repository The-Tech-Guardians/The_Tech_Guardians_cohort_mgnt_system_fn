export default function SafedLogo({ className = "" }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
   
      <h1 className="text-xl md:text-3xl font-bold tracking-tight mt-2">
        <span className="text-gray-900 dark:text-white">Saf</span>
        <span className="text-teal-700">ED</span>
      </h1>

      <p className="text-xs tracking-[0.3em] text-gray-600 dark:text-gray-400 mt-1">
        SAFE DIGITAL LEARNING
      </p>
    </div>
  );
}