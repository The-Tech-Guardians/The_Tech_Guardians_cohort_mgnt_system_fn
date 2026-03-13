import { Computer, GraduationCap, Target, Zap } from "lucide-react";
import type { BackendCourse } from "@/services/courseService";

export const COURSE = {
  id: "crs-0001-uuid",
  title: "Full-Stack Web Development Bootcamp",
  description: "The most complete full-stack program on the platform. Go from writing your first line of HTML to deploying production-grade web applications — with real projects, live sessions, and an expert instructor guiding you every step of the way.",
  instructor_id: "ins-001",
  cohort_id: "coh-001",
  course_type: "development",
  is_published: true,
  created_at: "2026-01-10",
};

export const INSTRUCTOR = {
  id: "ins-001",
  name: "Freddy Bijanja",
  title: "Lead Instructor",
  bio: "Full-stack engineer & educator. Former engineer at Andela, Google Developer Expert, and founder of two EdTech startups across East Africa.",
  credentials: "Google Dev Expert · ex-Andela · 10k+ students taught",
  avatar_gradient: "from-blue-500 to-cyan-400",
  rating: 4.9,
  reviews: 148,
  students: 2400,
  courses: 6,
};

export const COHORTS = [
  { id: "coh-001", name: "Apr 14 — Jul 7, 2026",  start: "2026-04-14", end: "2026-07-07", enrollment_close: "2026-04-10", seats_left: 6,  urgent: true  },
  { id: "coh-002", name: "May 12 — Aug 4, 2026",  start: "2026-05-12", end: "2026-08-04", enrollment_close: "2026-05-08", seats_left: 18, urgent: false },
  { id: "coh-003", name: "Jun 9 — Sep 2, 2026",   start: "2026-06-09", end: "2026-09-02", enrollment_close: "2026-06-05", seats_left: 24, urgent: false },
  { id: "coh-004", name: "Sep 7 — Nov 28, 2026",  start: "2026-09-07", end: "2026-11-28", enrollment_close: "2026-09-03", seats_left: 30, urgent: false },
];

export const HIGHLIGHTS = [
  { emoji: <Computer className="w-5 h-5"/>, title: "Become a full-stack developer", body: "Build, deploy, and maintain complete web applications — front-end and back-end — using industry-standard tools and workflows." },
  { emoji: <Zap className="w-5 h-5"/>, title: "Work with modern tech stacks", body: "Real tools real teams use: React, Node.js, PostgreSQL, REST APIs, Git, Docker, and deployment on Vercel & Railway." },
  { emoji: <Target className="w-5 h-5"/>, title: "Project-driven learning", body: "Ship 4 complete projects from scratch — a portfolio site, a SaaS dashboard, a REST API, and a full-stack capstone app." },
  { emoji: <GraduationCap className="w-5 h-5"/>, title: "Learn from a practitioner", body: "Your instructor has built products used by thousands. Every lesson is grounded in real-world engineering, not just theory." },
];

export const CURRICULUM = [
  { week: "Week 1–2",  title: "Web Foundations",        lessons: 14, topics: "HTML5, CSS3, Flexbox, Grid, Responsive Design" },
  { week: "Week 3–5",  title: "JavaScript & ES6+",      lessons: 22, topics: "Functions, DOM, Fetch, Async/Await, Modules" },
  { week: "Week 6–8",  title: "React & State Management",lessons: 20, topics: "Components, Hooks, Context, React Router, Redux" },
  { week: "Week 9–10", title: "Backend with Node.js",   lessons: 16, topics: "Express, REST APIs, Authentication, JWT" },
  { week: "Week 11",   title: "Databases",              lessons: 10, topics: "PostgreSQL, Prisma ORM, Migrations, Queries" },
  { week: "Week 12",   title: "Capstone & Deployment",  lessons:  8, topics: "Docker, CI/CD, Vercel, Railway, Portfolio Polish" },
];

export const OUTCOMES = [
  "Build and deploy full-stack web applications independently",
  "Write clean, maintainable JavaScript and React code",
  "Design and consume REST APIs with Node.js & Express",
  "Model and query relational databases with PostgreSQL",
  "Use Git, GitHub, and professional development workflows",
  "Deploy projects to the cloud and manage environments",
  "Present and explain your work in a technical interview",
];

export const FAQS = [
  { q: "Do I need any prior experience?", a: "No prior coding experience required. We start from absolute zero and move at a structured pace through every concept." },
  { q: "How much time per week does this require?", a: "Expect 10–15 hours per week — 3 live sessions plus independent project work. It is intensive by design." },
  { q: "What happens if I miss a live session?", a: "All sessions are recorded and available within 24 hours. You also get access to the session notes and exercises." },
  { q: "Is there a certificate upon completion?", a: "Yes. Learners who complete all modules and submit the capstone project receive a verified CohortLMS certificate." },
  { q: "Can I switch to a different cohort date?", a: "Yes, up to 7 days before your cohort's start date you can transfer to any future cohort at no extra cost." },
];

export const FALLBACK_BACKEND_COHORTS = [
  { id: "coh-001", name: "Full-Stack Web Dev · Apr 2026", startDate: "2026-04-14", endDate: "2026-07-07", enrollmentCloseDate: "2026-04-10", courseType: "COMPUTER_PROGRAMMING", isActive: true, createdAt: new Date().toISOString() },
  { id: "coh-002", name: "UI/UX Design Mastery · May 2026", startDate: "2026-05-12", endDate: "2026-08-04", enrollmentCloseDate: "2026-05-08", courseType: "SOCIAL_MEDIA_BRANDING", isActive: true, createdAt: new Date().toISOString() },
  { id: "coh-003", name: "Data Science Bootcamp · Jun 2026", startDate: "2026-06-09", endDate: "2026-09-02", enrollmentCloseDate: "2026-06-05", courseType: "DATA_SCIENCE", isActive: true, createdAt: new Date().toISOString() },
  { id: "coh-004", name: "Entrepreneurship Academy · Sep 2026", startDate: "2026-09-07", endDate: "2026-11-28", enrollmentCloseDate: "2026-09-03", courseType: "ENTREPRENEURSHIP", isActive: false, createdAt: new Date().toISOString() },
];

export const FALLBACK_BACKEND_COURSES: BackendCourse[] = [
  {
    id: "crs-001",
    title: "Full-Stack Web Development Bootcamp",
    description: "Build production-ready full-stack apps. React, Node.js, MongoDB, deployment.",
    instructorId: "ins-001",
    cohortId: "coh-001",
    courseType: "COMPUTER_PROGRAMMING",
    isPublished: true,
    createdAt: "2026-01-10T00:00:00Z",
    updatedAt: "2026-01-15T00:00:00Z"
  },
  {
    id: "crs-002",
    title: "Python for Data Analysis & ML",
    description: "Master Python, Pandas, Scikit-learn, and deploy ML models.",
    instructorId: "ins-002",
    cohortId: "coh-003",
    courseType: "DATA_SCIENCE",
    isPublished: true,
    createdAt: "2026-01-12T00:00:00Z",
    updatedAt: "2026-01-18T00:00:00Z"
  },
  {
    id: "crs-003",
    title: "UI/UX Design with Figma Pro",
    description: "Auto-layout, components, prototypes, handoff to devs.",
    instructorId: "ins-003",
    cohortId: "coh-002",
    courseType: "SOCIAL_MEDIA_BRANDING",
    isPublished: true,
    createdAt: "2026-01-20T00:00:00Z",
    updatedAt: "2026-01-25T00:00:00Z"
  },
  {
    id: "crs-004",
    title: "Digital Marketing & SEO Mastery",
    description: "Google Ads, SEO, content strategy, analytics.",
    instructorId: "ins-004",
    cohortId: "coh-004",
    courseType: "ENTREPRENEURSHIP",
    isPublished: false,
    createdAt: "2026-02-01T00:00:00Z",
    updatedAt: "2026-02-05T00:00:00Z"
  },
  {
    id: "crs-005",
    title: "Launch Your Tech Startup",
    description: "Idea validation, MVP, funding, growth hacking.",
    instructorId: "ins-001",
    cohortId: "coh-001",
    courseType: "ENTREPRENEURSHIP",
    isPublished: true,
    createdAt: "2026-01-15T00:00:00Z",
    updatedAt: "2026-01-20T00:00:00Z"
  }
];

