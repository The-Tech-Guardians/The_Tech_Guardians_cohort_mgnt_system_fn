# Admin Dashboard - CohortLMS

## 🎯 Overview

Professional admin dashboard for CohortLMS with comprehensive management features for users, cohorts, courses, and moderation.

## ✨ Features Implemented

### 1. **Analytics Dashboard** (`/admin`)
- Real-time system metrics (enrollments, completion rates, active users)
- Engagement tracking (time spent, submissions)
- Feature flags toggle system
- Recent activity feed
- Visual stat cards with trend indicators

### 2. **User Management** (`/admin/users`)
- View all users with role badges and 2FA status
- Promote instructors to admin
- Invite instructors (invite-only system)
- Ban management
- Role constraints display
- Search and filter functionality

### 3. **Cohort Management** (`/admin/cohorts`)
- Create/edit cohorts with timeline controls
- Set start/end dates and enrollment windows
- 5-day late enrollment extension option
- Assign course types to cohorts
- View learner counts per cohort
- Status tracking (upcoming, active, completed)

### 4. **Course Management** (`/admin/courses`)
- Create course types (coding, content creation, etc.)
- Course structure: Course → Modules → Lessons
- Content types: Video, PDF, Text/Markdown
- Weekly release schedule support
- Assessment management (assignments, quizzes)
- Draft/Published status workflow

### 5. **Moderation & Discipline** (`/admin/moderation`)
- Direct instructor bans (admin privilege)
- Learner ban requests (requires 2 instructor approvals)
- Approval workflow visualization
- Ban request details and history
- Moderation feedback system
- Unban functionality

### 6. **Audit Logs** (`/admin/logs`)
- Comprehensive activity tracking
- Categories: role changes, bans, course publishing, cohort changes
- Filter by category
- Timestamp, user, IP address logging
- Immutable audit trail
- Search functionality

## 🎨 Design System

### Color Palette
- **Background**: `bg-gray-900` (dark theme)
- **Primary Actions**: `#3B82F6` (blue-600)
- **Destructive Actions**: `#EF4444` (red-600)
- **Success**: `#10B981` (green-600)
- **Warning**: `#F59E0B` (amber-600)

### Glass Morphism Effects
- `bg-white/5` with `backdrop-blur-sm`
- `border border-white/10`
- Consistent across all cards and modals

### Components
- **Logo**: Reused from homepage (three circles design)
- **Sidebar**: Fixed navigation with icons
- **Header**: User profile with 2FA badge
- **Modal**: Centered overlay with backdrop blur
- **DataTable**: Searchable tables with filters
- **StatCard**: Metric cards with trend indicators
- **RoleBadge**: Color-coded role indicators with 2FA status
- **Toast**: Notification system for actions

## 📁 File Structure

```
src/
├── app/
│   └── admin/
│       ├── layout.tsx          # Admin layout wrapper
│       ├── page.tsx            # Analytics dashboard
│       ├── users/
│       │   └── page.tsx        # User management
│       ├── cohorts/
│       │   └── page.tsx        # Cohort management
│       ├── courses/
│       │   └── page.tsx        # Course management
│       ├── moderation/
│       │   └── page.tsx        # Moderation & bans
│       └── logs/
│           └── page.tsx        # Audit logs
│
└── components/
    └── admin/
        ├── Sidebar.tsx         # Navigation sidebar
        ├── AdminHeader.tsx     # Page header with user info
        ├── StatCard.tsx        # Metric display card
        ├── DataTable.tsx       # Reusable data table
        ├── Modal.tsx           # Modal dialog
        ├── RoleBadge.tsx       # Role indicator badge
        └── Toast.tsx           # Notification toast
```

## 🔐 Security Features

1. **2FA Enforcement**
   - Visual badges for 2FA status
   - Mandatory for admins and instructors
   - Clear indicators in user lists

2. **Role-Based Access**
   - Admin-only features clearly marked
   - Role constraints enforced
   - Audit trail for all actions

3. **Invite-Only System**
   - No self-signup for admins/instructors
   - Email invitation workflow
   - Controlled access management

## 🚀 Usage

### Accessing the Dashboard
Navigate to `/admin` to access the dashboard. The sidebar provides navigation to all sections.

### Creating a Cohort
1. Go to `/admin/cohorts`
2. Click "Create Cohort"
3. Fill in cohort details (name, dates, course type)
4. Set enrollment windows
5. Configure late enrollment extension (0-10 days)

### Managing Users
1. Go to `/admin/users`
2. View all users with roles and 2FA status
3. Promote instructors to admin
4. Invite new instructors via email
5. Ban users (direct for instructors, approval for learners)

### Course Creation
1. Go to `/admin/courses`
2. Click "Create Course"
3. Add modules and lessons
4. Upload content (video, PDF, text)
5. Create assessments
6. Publish when ready

### Moderation Workflow
1. Go to `/admin/moderation`
2. View pending ban requests
3. Approve/reject learner ban requests (2 approvals needed)
4. Ban instructors directly (admin privilege)
5. View banned users and unban if needed

### Audit Trail
1. Go to `/admin/logs`
2. Filter by category (role changes, bans, courses, cohorts, system)
3. Search by user, action, or details
4. View complete action history with timestamps and IP addresses

## 🎯 Role Constraints

- **Learners**: Cannot hold any other role
- **Instructors**: Can request learner bans, create courses
- **Admins**: Full access, can promote instructors, ban directly
- **2FA**: Mandatory for admins and instructors

## 📊 Analytics Metrics

- **Total Enrollments**: Count of all learner enrollments
- **Completion Rate**: Percentage of completed courses
- **Active Users**: Currently active learners
- **Avg. Time Spent**: Average learning time per user
- **Engagement Rate**: User interaction percentage

## 🔄 Feature Flags

Toggle experimental features:
- New UI components
- Beta courses
- Advanced analytics
- AI assistant

## 🎨 Responsive Design

- Desktop-optimized (1280px+)
- Tablet support (768px+)
- Sidebar collapses on mobile
- Touch-friendly controls

## 🛠️ Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Lucide Icons**
- **React Hooks**

## 📝 Notes

- All modals use glass morphism design
- Tables are searchable and filterable
- Toast notifications for user actions
- Consistent color coding across features
- Logo and branding match homepage design

## 🚧 Future Enhancements

- Real-time notifications
- Export audit logs to CSV
- Advanced analytics charts
- Bulk user operations
- Email template customization
- Role permission customization
