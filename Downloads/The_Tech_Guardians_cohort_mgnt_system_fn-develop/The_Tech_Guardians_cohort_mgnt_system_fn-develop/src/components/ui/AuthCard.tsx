interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function AuthCard({ children, className = "" }: AuthCardProps) {
  return (
    <div
      className={`bg-white rounded-3xl shadow-xl shadow-black/5 border border-gray-100 p-8 w-full max-w-[420px] ${className}`}
    >
      {children}
    </div>
  );
}