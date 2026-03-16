# Tech Guardians Cohort Management System - Setup Guide

## Issues Fixed

### 1. ✅ API Service Layer Created
- Created comprehensive API client (`src/lib/api.ts`) with proper request handling
- Created course service (`src/services/courseService.ts`) with methods for:
  - Fetching courses, modules, lessons, and assessments
  - Creating, updating, and deleting courses
  - Publishing courses
  - Proper error handling with JSON parsing

### 2. ✅ Frontend Integration Updated
- Updated course details page (`src/app/course-details/page.tsx`) to:
  - Fetch real data from backend API
  - Display modules, lessons, and assessments count
  - Show loading states while fetching
  - Fall back to mock data if API is unavailable
  - Display error messages if fetch fails

### 3. ✅ Environment Configuration
- Created `.env.local` with API URL configuration
- Backend configured to accept requests from `http://localhost:3001`

## Error Solutions

### "Network Error" & "404 Not Found" Issue
**Root Cause**: Frontend was using mock data. API endpoints may not have been called, or backend wasn't running.

**Solution**: 
1. Create proper API service layer ✅
2. Add request error handling ✅
3. Make sure backend returns JSON (not HTML) ✅

### "SyntaxError: Unexpected token '<'" Issue
**Root Cause**: Server returned HTML error page instead of JSON response.

**Solution**: The backend auth route returns JSON. Check that:
- Backend is running on `http://localhost:3000`
- No proxy/firewall blocking requests
- Routes are correctly configured

## Running the System

### Start Backend
```bash
cd The_Tech_Guardians_cohort_mgnt_system_bn
npm install  # If not done
npm run dev  # or npm start
```

Backend will run on `http://localhost:3000`

### Start Frontend
```bash
cd The_Tech_Guardians_cohort_mgnt_system_fn
npm install  # If not done
npm run dev
```

Frontend will run on `http://localhost:3001`

## API Endpoints Used

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course
- `PUT /api/courses/:id/publish` - Publish course

### Modules
- `GET /api/modules?courseId=:courseId` - Get modules for course
- `GET /api/modules/:id/lessons` - Get lessons in module

### Lessons
- `GET /api/lessons?moduleId=:moduleId` - Get lessons for module

### Assessments
- `GET /api/assessments?courseId=:courseId` - Get assessments for course
- `GET /api/assessments?moduleId=:moduleId` - Get assessments for module
- `GET /api/questions?assessmentId=:assessmentId` - Get questions for assessment

## Testing the Integration

1. Start both backend and frontend (see above)
2. Go to `http://localhost:3001`
3. Navigate to course details page
4. Verify that modules, lessons, and assessments load
5. Check browser console for any API errors
6. Network tab shows requests to `http://localhost:3000/api/*`

## Authorization

- All API requests include auth token from localStorage
- Token key: `token` or `auth_token`
- Sent as: `Authorization: Bearer <token>`
- If token missing, requests continue without auth (for public endpoints)

## Troubleshooting

### Still Getting 404 Errors
1. Check that backend is running: `curl http://localhost:3000/api/auth/test`
2. Verify database connection (check MongoDB URI in backend .env)
3. Check CORS configuration in backend (should allow localhost:3001)

### Missing Data
- API returns empty arrays if data not found (graceful fallback)
- Page falls back to mock data only if API unavailable
- Check MongoDB has data for courses, modules, lessons

### Token Errors
- Make sure you're logged in first (token saved in localStorage)
- Token expires after 24 hours (set in backend)
- Login page will redirect if token invalid

## Next Steps

1. ✅ Verify both services start without errors
2. ✅ Test API endpoints using Postman/Thunder Client
3. ✅ Create sample data in MongoDB:
   - Create a course
   - Add modules to course
   - Add lessons to each module
   - Create assessments with questions
4. ✅ Integration tests on frontend

