# Fix Admin Dashboard Fetch Issues (Lessons/Courses/Modules/Users/Stats)

## Step 1: Environment Setup ✅
- [x] Created .env.local: `NEXT_PUBLIC_API_URL=http://localhost:3001/api`

## Step 2: Fix Service API Base URLs ✅\n- [x] courseService.ts → use process.env.NEXT_PUBLIC_API_URL\n- [x] moduleService.ts → fix 5000 → NEXT_PUBLIC_API_URL  \n- [x] userService.ts → fix 3000 → NEXT_PUBLIC_API_URL\n- [x] lessonService.ts → fix URL

## Step 3: Standardize to adminApi 🔄
- [ ] Services delegate to adminApi functions
- [ ] Pages use adminApi.listCourses/etc

## Step 4: Restart & Test 🔧
- [ ] Frontend: `cd The_Tech_Guardians_cohort_mgnt_system_fn && npm run dev`
- [ ] Backend: `cd The_Tech_Guardians_cohort_mgnt_system_bn && npm run dev`
- [ ] Test admin pages load data
- [ ] Network tab shows localhost:3001/api

## Step 5: Complete ✅
- [ ] All fetches working: courses ✓ modules ✓ lessons ✓ users ✓ stats ✓

