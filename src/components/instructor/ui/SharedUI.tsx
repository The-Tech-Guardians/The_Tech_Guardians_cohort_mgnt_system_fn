// Shared UI components
import { ReactNode } from 'react';

export const Badge = ({ variant = 'gray', children }: { variant?: 'gray' | 'green' | 'amber'; children: ReactNode }) => {
  const variants = {
    gray: 'bg-gray-100 text-gray-800',
    green: 'bg-green-100 text-green-800',
    amber: 'bg-amber-100 text-amber-800'
  };
  
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant as keyof typeof variants]}`}>
      {children}
    </span>
  );
};

export const ProgressBar = ({ value = 0 }: { value: number }) => (
  <div className="w-full bg-gray-200 rounded-full h-2">
    <div 
      className="bg-gradient-to-r from-blue-600 to-cyan-500 h-2 rounded-full transition-all" 
      style={{ width: `${Math.min(100, value)}%` }}
    />
  </div>
);

export const Btn = ({ variant = 'indigo', size = 'md', children, type, disabled }: { 
  variant?: 'indigo';
  size?: 'xs' | 'md';
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}) => (
  <button 
    type={type || 'button'}
    disabled={disabled}
    className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
      variant === 'indigo' ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/20' : ''
    } ${size === 'xs' ? 'px-2 py-1 text-xs' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {children}
  </button>
);

export const Card = ({ children }: { children: ReactNode }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
    {children}
  </div>
);

export const SectionTitle = ({ children }: { children: ReactNode }) => (
  <h3 className="text-lg font-bold text-gray-900">{children}</h3>
);

