# Invitation Management System

This document describes the comprehensive invitation management system with email notifications for The Tech Guardians cohort management platform.

## Overview

The invitation management system allows administrators to:
- Send invitations to new users (Admins, Instructors, Learners)
- Track invitation status (Pending, Accepted, Expired)
- Resend and cancel invitations
- Receive email notifications when invitations are sent or accepted
- Monitor invitation statistics and analytics
- Upload bulk invitations via CSV
- View complete audit trails of all activities

## Features

### 1. Core Invitation Management
- Send invitations with specific roles (ADMIN, INSTRUCTOR, LEARNER)
- Optional cohort assignment
- Custom expiration time (default: 72 hours)
- Personalized messages
- Automatic email notifications to invitees

### 2. Bulk Invitation System
- CSV upload for multiple invitations
- Template download for proper formatting
- Batch processing with progress tracking
- Error handling and validation
- Success/failure reporting

### 3. Email Notifications
- **Invitation Email**: Sent to invitees with acceptance link
- **Admin Notifications**: Sent to all admins when:
  - New invitation is sent
  - Invitation is accepted
  - Invitation expires
- **Reminder System**: Automatic reminders for expiring invitations
- Professional HTML email templates
- Text-only fallback emails

### 4. Invitation Management
- View all invitations with pagination
- Filter by status (Pending, Accepted, Expired)
- Resend expired invitations
- Cancel pending invitations
- View detailed invitation information

### 5. Analytics Dashboard
- Real-time invitation statistics
- Timeline charts showing invitation trends
- Role distribution analysis
- Cohort performance metrics
- Time-to-acceptance analysis
- Reminder system statistics

### 6. Audit Trail System
- Complete audit log of all invitation activities
- Filterable and searchable logs
- Export functionality for compliance
- User activity tracking
- Error logging and troubleshooting

### 7. Reminder System
- Automatic reminders for expiring invitations
- Configurable reminder schedules (24h, 6h before expiry)
- Retry mechanism for failed reminders
- Admin notifications for reminder events

### 8. Acceptance Flow
- Secure token-based invitation links
- User registration with password creation
- Auto-login after acceptance
- Role-based redirect to appropriate dashboard

## Architecture

### Frontend Components

#### 1. InvitationService (`src/services/invitationService.ts`)
- Core service for invitation management
- Handles API calls and business logic
- Integrates with email service for notifications

#### 2. EmailService (`src/services/emailService.ts`)
- Email template management
- HTML and text email generation
- Admin notification system
- Bulk email sending to admins

#### 3. InvitationManagement (`src/components/admin/InvitationManagement.tsx`)
- React component for admin dashboard
- Statistics display
- Invitation list with actions
- Modal forms for creating invitations

#### 4. BulkInvitationModal (`src/components/admin/BulkInvitationModal.tsx`)
- CSV upload interface
- File validation and parsing
- Batch processing with progress tracking
- Error reporting and results display

#### 5. InvitationAnalytics (`src/components/admin/InvitationAnalytics.tsx`)
- Comprehensive analytics dashboard
- Interactive charts and visualizations
- Time-based filtering options
- Performance metrics

#### 6. InvitationAuditLog (`src/components/admin/InvitationAuditLog.tsx`)
- Audit trail viewer with filtering
- Search and export capabilities
- Real-time log updates
- Detailed event tracking

#### 7. InvitationNavigation (`src/components/admin/InvitationNavigation.tsx`)
- Sidebar navigation for invitation features
- Quick action links
- Settings access

#### 8. Invitation Acceptance Page (`src/app/(auth)/invite/[token]/page.tsx`)
- Public page for invitation acceptance
- Token verification
- User registration form
- Auto-login and redirect

#### 9. Admin Dashboard Integration
- `/admin/invitations` - Main invitation management
- `/admin/invitations/analytics` - Analytics dashboard
- `/admin/invitations/audit` - Audit log viewer

### Backend Services

#### 1. InvitationReminderService (`src/services/invitationReminderService.ts`)
- Automated reminder scheduling
- Configurable reminder intervals
- Retry logic for failed reminders
- Admin notification integration

#### 2. InvitationAuditService (`src/services/invitationAuditService.ts`)
- Comprehensive audit logging
- Event tracking and filtering
- Export functionality
- Performance monitoring

### Backend API Endpoints

#### Invitation Management
- `POST /users/Invite` - Create new invitation
- `GET /admin/invitations` - List invitations with pagination
- `GET /admin/invitations/stats` - Get invitation statistics
- `POST /admin/invitations/{id}/resend` - Resend invitation
- `DELETE /admin/invitations/{id}` - Cancel invitation

#### Email Services
- `POST /email/send` - Send single email
- `POST /email/send-bulk` - Send bulk emails
- `GET /users/admins/emails` - Get admin email addresses

#### Public Endpoints
- `GET /invitations/{token}/verify` - Verify invitation token
- `POST /invitations/{token}/accept` - Accept invitation and create user

## Data Models

### Invitation
```typescript
interface Invitation {
  id: string;
  token: string;
  email: string;
  role: 'ADMIN' | 'INSTRUCTOR' | 'LEARNER';
  cohort_id?: string;
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED';
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
  acceptedAt?: string;
}
```

### Invitation Stats
```typescript
interface InvitationStats {
  totalInvitations: number;
  pendingInvitations: number;
  acceptedInvitations: number;
  expiredInvitations: number;
}
```

### Create Invitation Data
```typescript
interface CreateInvitationData {
  email: string;
  role: 'ADMIN' | 'INSTRUCTOR' | 'LEARNER';
  cohort_id?: string;
  message?: string;
  expiresIn?: number; // hours
}
```

### Audit Log Entry
```typescript
interface AuditLogEntry {
  id: string;
  invitationId: string;
  action: AuditAction;
  timestamp: string;
  userId: string;
  userName: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  errorMessage?: string;
}
```

## Email Templates

### 1. Invitation Email
- Professional HTML template with company branding
- Includes role, cohort information, and custom message
- Clear call-to-action button for acceptance
- Expiration date prominently displayed
- Mobile-responsive design

### 2. Admin Notification Emails
- Sent to all administrators
- Different templates for:
  - Invitation sent
  - Invitation accepted
  - Invitation expired
  - Reminder sent
- Includes relevant details and timestamps

### 3. Reminder Emails
- Automated reminder notifications
- Time-sensitive messaging
- Countdown to expiration
- Clear action items

## Security Features

### 1. Token-Based Invitations
- Secure, unique tokens for each invitation
- Token expiration prevents abuse
- One-time use tokens

### 2. Email Verification
- Email address validation before sending
- Bounce handling and error reporting

### 3. Role-Based Access
- Only admins can send invitations
- Role assignment is verified
- Proper authorization checks

### 4. Audit Trail
- Complete logging of all activities
- User action tracking
- Compliance-ready reporting

## Configuration

### Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Reminder Configuration
```typescript
const reminderConfig = {
  enabled: true,
  reminders: [
    { hoursBefore: 24, template: 'reminder', sendToAdmins: true },
    { hoursBefore: 6, template: 'final_reminder', sendToAdmins: true }
  ]
};
```

### Email Configuration
The system expects the backend to have email service configured with:
- SMTP settings
- Email templates
- Admin notification list

## Usage Guide

### For Administrators

#### 1. Access Invitation Management
- Navigate to Admin Dashboard → Invitations
- View current invitation statistics
- Use sidebar navigation for different features

#### 2. Send Single Invitation
- Click "Send New Invitation"
- Fill in recipient email and role
- Optionally assign to a cohort
- Add custom message (optional)
- Set expiration time (default 72 hours)
- Click "Send Invitation"

#### 3. Bulk Upload Invitations
- Click "Bulk Upload" button
- Download CSV template
- Fill with invitation data
- Upload CSV file
- Review parsed data
- Process invitations
- View results and errors

#### 4. Manage Existing Invitations
- View all invitations in the table
- Use "Resend" for expired invitations
- Use "Cancel" for pending invitations
- Click "View" for detailed information

#### 5. View Analytics
- Navigate to Analytics tab
- Select time range (7d, 30d, 90d, all)
- Review charts and metrics
- Export reports if needed

#### 6. Audit Trail
- Navigate to Audit Log tab
- Use filters to find specific events
- Search by user, invitation ID, or details
- Export logs for compliance

#### 7. Monitor Statistics
- Total invitations sent
- Pending invitations
- Accepted invitations
- Expired invitations
- Reminder system status

### For Invitees

#### 1. Receive Invitation Email
- Check email for invitation
- Click "Accept Invitation" button

#### 2. Create Account
- Verify invitation token
- Enter first and last name
- Create password (min 8 characters)
- Click "Accept Invitation & Create Account"

#### 3. Access Platform
- Auto-login after acceptance
- Redirect to role-appropriate dashboard
- Start using platform features

## CSV Bulk Upload Format

### Required Columns
- `email`: Valid email address
- `role`: ADMIN, INSTRUCTOR, or LEARNER

### Optional Columns
- `cohort_id`: Cohort identifier
- `message`: Custom message for the invitation

### Example CSV
```csv
email,role,cohort_id,message
john.doe@example.com,LEARNER,cohort-123,Welcome to our cohort!
jane.smith@example.com,INSTRUCTOR,,We invite you to be an instructor
admin@example.com,ADMIN,,Join our admin team
```

## Error Handling

### Frontend Errors
- Network failures with retry options
- Form validation with helpful messages
- Toast notifications for user feedback
- Graceful degradation for missing features

### Backend Errors
- Email delivery failure logging
- Invitation token validation
- Duplicate email detection
- Rate limiting for abuse prevention

### Bulk Upload Errors
- CSV format validation
- Data type checking
- Row-by-row error reporting
- Partial success handling

## Monitoring and Analytics

### Invitation Metrics
- Conversion rate (accepted/sent)
- Average time to acceptance
- Expiration rate
- Role-specific acceptance rates
- Cohort performance comparison

### Email Metrics
- Delivery rates
- Open rates
- Click-through rates
- Bounce handling
- Reminder effectiveness

### System Performance
- API response times
- Database query performance
- Email service latency
- Error rates and patterns

## Future Enhancements

### Planned Features
1. **Real-time Updates** - WebSocket integration for live status updates
2. **Advanced Analytics** - Machine learning insights and predictions
3. **Integration Calendar** - Google Calendar/Outlook integration
4. **Social Login** - Option to use social accounts for registration
5. **Multi-language Support** - Internationalization
6. **Custom Templates** - User-configurable email templates

### Technical Improvements
1. **Performance Optimization** - Caching and database optimization
2. **API Rate Limiting** - Enhanced abuse prevention
3. **Mobile App** - Native mobile invitation management
4. **Email A/B Testing** - Optimize email templates
5. **Advanced Search** - Full-text search capabilities

## Troubleshooting

### Common Issues

1. **Invitation Not Received**
   - Check spam folder
   - Verify email address
   - Check email server logs
   - Review email service configuration

2. **Invitation Link Expired**
   - Contact administrator
   - Request new invitation
   - Check expiration time

3. **Registration Fails**
   - Verify token is valid
   - Check password requirements
   - Ensure email isn't already registered

4. **Bulk Upload Fails**
   - Verify CSV format
   - Check required columns
   - Review error messages
   - Validate data types

5. **Admin Notifications Not Working**
   - Verify admin email list
   - Check email server configuration
   - Review notification settings
   - Check spam filters

### Debug Information
- Check browser console for JavaScript errors
- Review network tab for API failures
- Check server logs for backend errors
- Verify email service configuration
- Review audit logs for system events

## Compliance and Security

### Data Protection
- GDPR compliance considerations
- Data retention policies
- User consent management
- Privacy controls

### Security Measures
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection
- Secure token generation

### Audit Requirements
- Complete audit trail
- Immutable log records
- Export capabilities
- Compliance reporting

---

**Last Updated**: March 22, 2026
**Version**: 2.0.0
**Maintainers**: The Tech Guardians Development Team

## New Features in v2.0.0

### ✅ Added Since v1.0.0
- **Bulk Invitation System** with CSV upload
- **Advanced Analytics Dashboard** with interactive charts
- **Comprehensive Audit Trail** with filtering and export
- **Automated Reminder System** for expiring invitations
- **Enhanced Navigation** with sidebar menu
- **Real-time Statistics** and performance metrics
- **Improved Error Handling** with detailed reporting
- **Export Functionality** for compliance and reporting

### 🔧 Technical Improvements
- Enhanced TypeScript support
- Better error handling and validation
- Improved performance optimization
- Enhanced security measures
- Better mobile responsiveness
- Improved accessibility features
