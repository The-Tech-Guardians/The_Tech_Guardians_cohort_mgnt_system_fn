# Admin Dashboard Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Project dependencies installed (`npm install`)

### Running the Dashboard

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Access the admin dashboard:**
   ```
   http://localhost:3000/admin
   ```

## 📋 Component Usage Examples

### Using DataTable

```tsx
import DataTable from "@/components/admin/DataTable";

const columns = [
  {
    key: "name",
    label: "Name",
    render: (item) => <span className="font-bold">{item.name}</span>
  },
  { key: "email", label: "Email" },
];

<DataTable 
  columns={columns} 
  data={users}
  searchPlaceholder="Search users..."
/>
```

### Using Modal

```tsx
import Modal from "@/components/admin/Modal";

const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Create User"
  size="md"
>
  <form>
    {/* Your form content */}
  </form>
</Modal>
```

### Using StatCard

```tsx
import StatCard from "@/components/admin/StatCard";
import { Users } from "lucide-react";

<StatCard 
  title="Total Users" 
  value="1,243" 
  icon={Users}
  trend={{ value: "12% from last month", positive: true }}
  color="blue"
/>
```

### Using RoleBadge

```tsx
import RoleBadge from "@/components/admin/RoleBadge";

<RoleBadge role="admin" has2FA={true} />
```

### Using Toast

```tsx
import Toast from "@/components/admin/Toast";

const [showToast, setShowToast] = useState(false);

<Toast
  message="User created successfully!"
  type="success"
  isVisible={showToast}
  onClose={() => setShowToast(false)}
  duration={3000}
/>
```

## 🎨 Styling Guidelines

### Color Classes
```tsx
// Primary actions
className="bg-blue-600 hover:bg-blue-700"

// Destructive actions
className="bg-red-600 hover:bg-red-700"

// Success states
className="bg-green-600/20 text-green-400 border-green-500/30"

// Glass morphism
className="bg-white/5 backdrop-blur-sm border border-white/10"
```

### Button Styles
```tsx
// Primary button
<button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-600/50">
  Primary Action
</button>

// Secondary button
<button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg font-medium transition-all">
  Secondary Action
</button>

// Destructive button
<button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all">
  Delete
</button>
```

### Card Styles
```tsx
<div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
  {/* Card content */}
</div>
```

## 🔧 Adding a New Admin Page

1. **Create the page file:**
   ```
   src/app/admin/your-feature/page.tsx
   ```

2. **Add to sidebar navigation:**
   ```tsx
   // src/components/admin/Sidebar.tsx
   const navItems = [
     // ... existing items
     { label: "Your Feature", href: "/admin/your-feature", icon: YourIcon },
   ];
   ```

3. **Use the standard layout:**
   ```tsx
   'use client';
   
   import AdminHeader from "@/components/admin/AdminHeader";
   
   export default function YourFeaturePage() {
     return (
       <div className="space-y-6">
         <AdminHeader 
           title="Your Feature" 
           subtitle="Description of your feature"
         />
         {/* Your content */}
       </div>
     );
   }
   ```

## 📊 Data Management

### State Management Pattern
```tsx
const [items, setItems] = useState<Item[]>([]);
const [showModal, setShowModal] = useState(false);
const [selectedItem, setSelectedItem] = useState<Item | null>(null);

// CRUD operations
const handleCreate = (newItem: Item) => {
  setItems([...items, newItem]);
};

const handleUpdate = (id: number, updates: Partial<Item>) => {
  setItems(items.map(item => 
    item.id === id ? { ...item, ...updates } : item
  ));
};

const handleDelete = (id: number) => {
  setItems(items.filter(item => item.id !== id));
};
```

## 🎯 Best Practices

1. **Always use TypeScript interfaces** for data structures
2. **Keep components small and focused** - one responsibility per component
3. **Use the existing design system** - don't create new color schemes
4. **Add loading states** for async operations
5. **Include error handling** with user-friendly messages
6. **Make tables searchable** using the DataTable component
7. **Add confirmation modals** for destructive actions
8. **Use toast notifications** for user feedback
9. **Follow the glass morphism design** for consistency
10. **Test responsive behavior** on different screen sizes

## 🐛 Common Issues

### Issue: Modal not closing
**Solution:** Ensure you're calling `onClose()` in the modal's close button

### Issue: Table not updating
**Solution:** Make sure you're updating state immutably (use spread operator)

### Issue: Icons not showing
**Solution:** Import from `lucide-react`: `import { IconName } from "lucide-react"`

### Issue: Styles not applying
**Solution:** Check Tailwind class names and ensure no typos

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

When adding new features:
1. Follow the existing code structure
2. Use the established design patterns
3. Add TypeScript types for all data
4. Test on multiple screen sizes
5. Update this documentation

## 📞 Support

For questions or issues:
- Check the main README.md
- Review existing component implementations
- Contact the development team

---

**Happy coding! 🚀**
