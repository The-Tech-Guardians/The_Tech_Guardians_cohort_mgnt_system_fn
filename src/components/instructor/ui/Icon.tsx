import { ChevronDown, Edit, Plus, BookOpen, BarChart3, Users, HelpCircle } from 'lucide-react';
import React from 'react';

export const Icon = ({ d, size = 24, className = '', ...props }: {
  d: keyof typeof I;
  size?: number;
  className?: string;
}) => {
  // Map string 'd' to actual Lucide icons based on your I object
  const icons = {
    chevronD: ChevronDown,
    edit: Edit,
    plus: Plus,
    courses: BookOpen,
    analytics: BarChart3,
    learners: Users,
    quiz: HelpCircle
  } as Record<keyof typeof I, React.ComponentType<any>>;
  
  const IconComponent = icons[d];
  
  if (!IconComponent) {
    console.warn(`Icon ${d} not found`);
    return null;
  }
  
  return <IconComponent size={size} className={className} {...props} />;
};

export const I = {
  chevronD: 'chevronD' as const,
  edit: 'edit' as const,
  plus: 'plus' as const,
  courses: 'courses' as const,
  analytics: 'analytics' as const,
  learners: 'learners' as const,
  quiz: 'quiz' as const
} as const;

