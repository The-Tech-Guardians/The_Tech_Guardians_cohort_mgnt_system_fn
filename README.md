
# Cohort-Based Learning Management Platform (Frontend)

## 📌 Project Overview

This project is the frontend implementation of the **Cohort-Based Learning Management Platform (LMS)**.

The platform is designed to support structured academic learning through time-bound cohorts. It enables:

- Admin management of cohorts and instructors
- Instructor-led course creation and structured content delivery
- Learner enrollment and progress tracking
- Strict role-based access control
- Secure authentication with mandatory 2FA for Admins and Instructors

This repository contains the frontend application built with **Next.js (App Router) + TypeScript + Tailwind CSS**.

---

## 🎯 Purpose of This Frontend

The frontend is responsible for:

- Authentication flows (Login, Register, 2FA verification)
- Role-based dashboards (Admin / Instructor / Learner)
- Cohort browsing and enrollment
- Course structure visualization (Course > Module > Lesson)
- Assignment and quiz interfaces
- Profile management
- Announcements and notifications


---

##  Project Structure

src/
├── app/
│ ├── (auth)/ # Authentication routes
│ │ ├── login/
│ │ ├── register/
│ │ └── verify-2fa/
│ ├── (dashboard)/ # Role-based dashboards
│ │ ├── admin/
│ │ ├── instructor/
│ │ └── learner/
│ ├── cohorts/ # Cohort-related pages
│ ├── courses/ # Course browsing and details
│ ├── profile/ # Public profile management
│ └── layout.tsx
│
├── components/
│ ├── ui/ # Reusable UI components
│ ├── forms/ # Form components
│ ├── layout/ # Layout wrappers
│ └── dashboards/ # Dashboard-specific components
│
├── lib/
│ ├── api.ts # API configuration
│ ├── auth.ts # Authentication helpers
│ └── utils.ts # Utility functions
│
├── types/
│ ├── user.ts
│ ├── cohort.ts
│ └── course.ts
│
└── hooks/
---

##  Roles & Access Model

The system supports three fixed roles:

- **Admin**
- **Instructor**
- **Learner**

Constraints:

- Learners cannot hold any other role.
- Admins automatically have Instructor-level access.
- Only Admins can promote Instructors to Admin.
- Instructors cannot promote or demote Admins.

Role-based routing will be enforced using Next.js middleware.

---

##  Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Axios
- React Hook Form
- Zod
- JWT-based authentication (backend)

---

##  Branch Strategy

We follow this workflow:

- `main` → Production-ready code
- `dev` → Integration branch
- `feature/*` → Feature development branches

No direct pushes to `main`.

---

##  Getting Started

Install dependencies:

Run development server: npm run dev 
http://localhost:3000


---

##  Future Implementation Phases

1. Authentication & 2FA enforcement
2. Role-based dashboards
3. Cohort creation & enrollment system
4. Course management (Course > Module > Lesson)
5. Assignments & quizzes
6. Moderation & audit logging
7. Notifications & announcements

---

##  Team

- Freddy Bijanja
- Ndiwayesu Olivier
- Iradukunda Boris

---

##  License

This project is developed for academic and professional training purposes.


