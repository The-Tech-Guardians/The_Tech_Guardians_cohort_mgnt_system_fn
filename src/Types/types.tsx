 export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
}

export interface ConversationProp {
   
    name: string;
    message: string;
    date: string;
    unread: number;
}


export interface SidebarItem {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  label: string;
  path: string;
  section: string;
}

export interface SidebarProps {
  items: SidebarItem[];
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  onLogout: () => void;
}