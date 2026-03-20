# React Hooks Fix - LearnerLayout

**Problem**: useEffect calls after early returns violate React Hooks Rules

**Current Structure (Broken)**:
```
useEffect(profileCheck) // 1
if (checkingProfile) return loading
if (!hasProfile) return null
useEffect(userData) // 2 - PROBLEM: different order when early return
useEffect(notifications) // 3
useEffect(unreadCount) // 4
```

**Fix Plan**:
1. Move ALL useState/useEffect to TOP
2. Handle profile logic in useEffect with router.replace()
3. Use loading state during checks
4. Conditional RENDER after all hooks

**Steps**:
- [ ] Create fixed version of layout.tsx
- [ ] Test functionality
- [ ] Update TODO-FIX-BUILD-ERROR.md

**Next**: Ready to implement the refactored component?
