"use client";

import { Search, Menu, X, ArrowRight, Users, BookOpen, Award, Target, Code, Briefcase, Heart, Calendar, ChevronRight, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrollments, setEnrollments] = useState({});

  const bgImages = ["/bg-image-1.jpg", "/bg-image-2.jpg", "/bg-image-3.jpg"];

  useEffect(() => {
    const bgTimer = setInterval(() => setBgIndex(i => (i + 1) % bgImages.length), 7000);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    
    // Fetch enrollment data
    const fetchEnrollments = async () => {
      // In production: const response = await fetch('/api/enrollments');
      setEnrollments({});
    };
    fetchEnrollments();
    
    return () => {
      clearInterval(bgTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [bgImages.length]);

  const courses = [
    { id: 1, name: "Social Media Branding", icon: Target, color: "bg-pink-100 text-pink-600", slug: "social-media" },
    { id: 2, name: "Computer Programming", icon: Code, color: "bg-blue-100 text-blue-600", slug: "programming" },
    { id: 3, name: "Entrepreneurship", icon: Briefcase, color: "bg-green-100 text-green-600", slug: "entrepreneurship" },
    { id: 4, name: "SRHR", icon: Heart, color: "bg-purple-100 text-purple-600", slug: "srhr" },
    { id: 5, name: "Team Management", icon: Award, color: "bg-amber-100 text-amber-600", slug: "team-management" }
  ];

  const categoryItems = ['Social Media', 'Programming', 'Entrepreneurship', 'SRHR', 'Team Management'];

  const lightningLessons = [
    {
      id: 1,
      title: "Social Media Branding Masterclass",
      date: "LIVE TUE, MAR 10, 7:00PM",
      instructor: "Sarah Chen",
      badge: "FREE WORKSHOP"
    },
    {
      id: 2,
      title: "Python Programming for Beginners",
      date: "LIVE THU, MAR 19, 8:30PM",
      instructor: "Michael Okonkwo",
      badge: "FREE WORKSHOP"
    },
    {
      id: 3,
      title: "Startup Fundamentals",
      date: "LIVE THU, MAR 19, 3:30PM",
      instructor: "David Kimani",
      badge: "FREE WORKSHOP"
    },
    {
      id: 4,
      title: "SRHR: Comprehensive Health Education",
      date: "LIVE MON, MAR 24, 6:00PM",
      instructor: "Dr. Amina Diallo",
      badge: "FREE WORKSHOP"
    },
    {
      id: 5,
      title: "Leading High-Performance Teams",
      date: "LIVE WED, MAR 26, 5:30PM",
      instructor: "Oluwaseun Adebayo",
      badge: "FREE WORKSHOP"
    }
  ];

  const Modals = {
    lightning: {
      title: "Lightning Lessons",
      content: (
        <div className="space-y-4">
          {lightningLessons.map((lesson) => (
            <div key={lesson.id} className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-white/20 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">{lesson.badge}</span>
              </div>
              <h4 className="text-gray-900 font-semibold mb-1">{lesson.title}</h4>
              <p className="text-gray-600 text-sm mb-2">{lesson.instructor}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{lesson.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{enrollments[lesson.id] || 0} enrolled</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    },
    apply: {
      title: "Apply to Teach",
      content: (
        <form className="space-y-4">
          <input placeholder="Full Name" className="w-full bg-white/90 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-3 text-gray-900" />
          <input placeholder="Email" className="w-full bg-white/90 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-3 text-gray-900" />
          <input placeholder="Expertise" className="w-full bg-white/90 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-3 text-gray-900" />
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">Submit</button>
        </form>
      )
    },
    login: {
      title: "Welcome Back",
      content: (
        <form className="space-y-4">
          <input placeholder="Email" className="w-full bg-white/90 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-3 text-gray-900" />
          <input type="password" placeholder="Password" className="w-full bg-white/90 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-3 text-gray-900" />
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">Sign In</button>
        </form>
      )
    },
    admin: {
      title: "Admin Access",
      content: (
        <form className="space-y-4">
          <input placeholder="Email" className="w-full bg-white/90 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-3 text-gray-900" />
          <input type="password" placeholder="Password" className="w-full bg-white/90 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-3 text-gray-900" />
          <input placeholder="2FA Code" className="w-full bg-white/90 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-3 text-gray-900" />
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">Authenticate</button>
        </form>
      )
    },
    cohorts: {
      title: "Open Cohorts",
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-white/90 backdrop-blur-sm border border-white/30 rounded-lg">
            <p className="text-gray-900 font-bold">Spring 2026 Cohort</p>
            <p className="text-sm text-gray-600">Starts April 1, 2026 • 245 enrolled</p>
            <button className="mt-2 text-blue-600 text-sm font-medium hover:text-blue-700">View details →</button>
          </div>
          <div className="p-4 bg-white/90 backdrop-blur-sm border border-white/30 rounded-lg">
            <p className="text-gray-900 font-bold">Summer 2026 Cohort</p>
            <p className="text-sm text-gray-600">Starts July 1, 2026 • 0 enrolled</p>
            <button className="mt-2 text-blue-600 text-sm font-medium hover:text-blue-700">Notify me →</button>
          </div>
        </div>
      )
    },
    about: {
      title: "About CohortLMS",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">CohortLMS is a structured cohort-based learning platform designed for real-world impact.</p>
          <p className="text-gray-700">We offer courses in Social Media Branding, Computer Programming, Entrepreneurship, SRHR, and Team Management.</p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-gray-800 font-medium">Our Mission</p>
            <p className="text-sm text-gray-600">To make quality education accessible through collaborative cohort-based learning.</p>
          </div>
        </div>
      )
    },
    contact: {
      title: "Contact Us",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">Have questions? Reach out to our team.</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-800 font-medium">Email</p>
            <p className="text-sm text-gray-600">support@cohortlms.com</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-800 font-medium">Phone</p>
            <p className="text-sm text-gray-600">+250 788 123 456</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-800 font-medium">Address</p>
            <p className="text-sm text-gray-600">Kigali, Rwanda</p>
          </div>
        </div>
      )
    },
    privacy: {
      title: "Privacy Policy",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">Your privacy is important to us.</p>
          <p className="text-sm text-gray-600">We collect and process your data in accordance with applicable laws and regulations.</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-800 font-medium">Data Protection</p>
            <p className="text-sm text-gray-600">All personal information is encrypted and securely stored.</p>
          </div>
          <p className="text-xs text-gray-500">Last updated: March 2026</p>
        </div>
      )
    },
    course: selectedCourse && {
      title: selectedCourse.name,
      content: (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-12 h-12 rounded-full ${selectedCourse.color} flex items-center justify-center`}>
              <selectedCourse.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{selectedCourse.name}</p>
              <p className="text-gray-600">{enrollments[selectedCourse.id] || 0} active learners</p>
            </div>
          </div>
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">Enroll Now</button>
        </div>
      )
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Images */}
      <div className="fixed inset-0 -z-10">
        {bgImages.map((img, i) => (
          <div 
            key={i} 
            className={`absolute inset-0 transition-opacity duration-1000 ${i === bgIndex ? 'opacity-100' : 'opacity-0'}`}
            style={{ 
              backgroundImage: `url(${img})`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center',
            }} 
          />
        ))}
        <div className="absolute inset-0 bg-white/10" />
      </div>

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/70 backdrop-blur-xl shadow-lg border-b border-white/30' 
          : 'bg-white/40 backdrop-blur-md border-b border-white/20'
      }`}>
        {/* Header content remains the same */}
        <div className="container mx-auto flex items-center justify-between py-3 px-6 max-w-7xl">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-center group-hover:bg-white/90 transition">
              <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
                <circle cx="14" cy="10" r="5" fill="#4F46E5" />
                <circle cx="26" cy="10" r="5" fill="#2563EB" />
                <circle cx="20" cy="6" r="5" fill="#06B6D4" />
              </svg>
            </div>
            <div>
              <span className="text-gray-800 font-bold text-xl drop-shadow-sm">CohortLMS</span>
              <span className="text-gray-600 text-xs block">Platform</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-6">
            <button onClick={() => setActiveModal('lightning')} 
                    className="text-gray-700 hover:text-gray-900 font-medium px-3 py-1 rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/50 transition">
              Lightning Lessons
            </button>
            <button onClick={() => setActiveModal('apply')} 
                    className="text-gray-700 hover:text-gray-900 font-medium px-3 py-1 rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/50 transition">
              Apply to teach
            </button>
            <button onClick={() => setActiveModal('admin')} 
                    className="text-gray-700 hover:text-gray-900 font-medium px-3 py-1 rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/50 transition">
              Admin
            </button>
            <button onClick={() => setActiveModal('login')} 
                    className="bg-blue-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-md border border-white/30">
              Log In
            </button>
          </div>

          <button className="lg:hidden text-gray-700 bg-white/30 backdrop-blur-sm p-2 rounded-lg" onClick={() => setMobileNavOpen(!mobileNavOpen)}>
            {mobileNavOpen ? <X /> : <Menu />}
          </button>
        </div>

        <div className="hidden lg:block border-t border-white/20">
          <div className="container mx-auto px-6 max-w-7xl">
            <nav className="flex space-x-8 py-2">
              {categoryItems.map((item, i) => (
                <button key={item} onClick={() => { setSelectedCourse(courses[i]); setActiveModal('course'); }}
                        className="text-gray-700 hover:text-gray-900 py-2 font-medium px-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition">
                  {item}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <div className="h-[140px]" />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="max-w-3xl ml-0 lg:ml-16">
              <div className="bg-white/20 backdrop-blur-xl p-8 rounded-2xl border border-white/30 shadow-2xl">
                <p className="text-blue-700 font-semibold text-sm mb-4 drop-shadow">UNLOCK YOUR POTENTIAL</p>
                <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 drop-shadow">Learn with purpose</h1>
                <p className="text-xl text-gray-800 mb-8 max-w-xl font-medium drop-shadow">Social Media, Programming, Entrepreneurship, SRHR, and Team Management.</p>
                
                <div className="flex gap-4 mb-8">
                  <button onClick={() => { setSelectedCourse(courses[0]); setActiveModal('course'); }}
                          className="bg-blue-600/90 backdrop-blur-sm text-white px-8 py-4 rounded-lg hover:bg-blue-700 shadow-lg font-medium border border-white/30">
                    Browse courses
                  </button>
                  <button onClick={() => setActiveModal('cohorts')}
                          className="bg-white/30 backdrop-blur-sm text-gray-800 px-8 py-4 rounded-lg hover:bg-white/50 font-medium border border-white/30">
                    View cohorts
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {courses.map(course => (
                    <button key={course.id} onClick={() => { setSelectedCourse(course); setActiveModal('course'); }}
                            className="px-4 py-2 bg-white/30 backdrop-blur-sm text-gray-700 rounded-full text-sm hover:bg-white/50 border border-white/30">
                      {course.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Individual Courses Section */}
        <section className="py-20">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="ml-0 lg:ml-16 mb-12">
              <div className="bg-white/20 backdrop-blur-xl p-6 rounded-2xl border border-white/30 inline-block">
                <p className="text-blue-700 font-semibold text-sm mb-2">COURSES</p>
                <h2 className="text-3xl font-bold text-gray-900">Individual Courses</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ml-0 lg:ml-16">
              {courses.slice(0,4).map(course => (
                <button key={course.id} onClick={() => { setSelectedCourse(course); setActiveModal('course'); }}
                        className="bg-white/20 backdrop-blur-xl p-6 rounded-lg text-left hover:bg-white/30 transition border border-white/30 shadow-xl">
                  <div className={`w-12 h-12 rounded-full ${course.color} flex items-center justify-center mb-4 shadow-md`}>
                    <course.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-gray-900 font-bold mb-1 drop-shadow">{course.name}</h3>
                  <p className="text-gray-700 text-sm font-medium drop-shadow">{enrollments[course.id] || 0} learners</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Group & Team Section */}
        <section className="py-20">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="ml-0 lg:ml-16 mb-12">
              <div className="bg-white/20 backdrop-blur-xl p-6 rounded-2xl border border-white/30 inline-block">
                <p className="text-blue-700 font-semibold text-sm mb-2">PROGRAMS</p>
                <h2 className="text-3xl font-bold text-gray-900">Group & Team Programs</h2>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6 ml-0 lg:ml-16">
              <div className="bg-white/20 backdrop-blur-xl p-8 rounded-lg border border-white/30 shadow-xl">
                <Users className="w-12 h-12 text-blue-600 mb-4 drop-shadow" />
                <h3 className="text-xl font-bold text-gray-900 mb-2 drop-shadow">Group Level</h3>
                <p className="text-gray-700 mb-4 font-medium drop-shadow">Same core curriculum with team collaboration</p>
                <div className="space-y-2">
                  {courses.slice(0,4).map(c => (
                    <div key={c.id} className="flex items-center text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2" />
                      <span className="text-gray-800 font-medium drop-shadow">{c.name}</span>
                      <span className="text-gray-600 text-xs ml-2 font-medium">({enrollments[c.id] || 0})</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-xl p-8 rounded-lg border border-white/30 shadow-xl">
                <Award className="w-12 h-12 text-amber-600 mb-4 drop-shadow" />
                <h3 className="text-xl font-bold text-gray-900 mb-2 drop-shadow">Team Level</h3>
                <p className="text-gray-700 mb-4 font-medium drop-shadow">Advanced leadership for organizations</p>
                <div className="bg-white/30 backdrop-blur-sm p-4 rounded-lg border border-white/30">
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-8 h-8 text-amber-600" />
                    <div>
                      <p className="text-gray-900 font-bold drop-shadow">Team Management</p>
                      <p className="text-sm text-gray-700 font-medium">{enrollments[5] || 0} enrolled</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-32">
          <div className="absolute inset-0">
            {bgImages.map((img, i) => (
              <div 
                key={i} 
                className={`absolute inset-0 transition-opacity duration-1000 ${i === bgIndex ? 'opacity-100' : 'opacity-0'}`}
                style={{ 
                  backgroundImage: `url(${img})`, 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center',
                }} 
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/70 to-blue-800/70 backdrop-blur-sm" />
          </div>
          <div className="container mx-auto px-6 max-w-7xl relative z-10">
            <div className="ml-0 lg:ml-16 max-w-2xl">
              <div className="bg-white/20 backdrop-blur-xl p-8 rounded-2xl border border-white/30">
                <p className="text-blue-200 font-semibold text-sm mb-2 drop-shadow">GET STARTED</p>
                <h2 className="text-3xl font-bold text-white mb-3 drop-shadow">Ready to start your journey?</h2>
                <p className="text-lg text-white mb-6 font-medium drop-shadow">Join a cohort and learn alongside motivated peers</p>
                <button onClick={() => setActiveModal('cohorts')}
                        className="bg-white/90 backdrop-blur-sm text-blue-600 px-8 py-4 rounded-lg hover:bg-white shadow-lg font-medium border border-white/30">
                  Browse Open Cohorts
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Now with functional Company buttons */}
      <footer className="bg-gray-900/90 backdrop-blur-sm text-gray-400 py-12 border-t border-white/10">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 ml-0 lg:ml-16">
            {/* Brand Column */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gray-800/80 backdrop-blur-sm flex items-center justify-center">
                  <svg viewBox="0 0 40 40" className="w-5 h-5" fill="none">
                    <circle cx="14" cy="10" r="5" fill="#4F46E5" />
                    <circle cx="26" cy="10" r="5" fill="#2563EB" />
                    <circle cx="20" cy="6" r="5" fill="#06B6D4" />
                  </svg>
                </div>
                <span className="font-bold text-white">CohortLMS</span>
              </div>
              <p className="text-xs text-gray-500">© 2026 All rights reserved.</p>
            </div>

            {/* Courses Column */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Courses</h4>
              <ul className="space-y-2 text-xs text-gray-500">
                {courses.map(c => (
                  <li key={c.id}>
                    <button 
                      onClick={() => { setSelectedCourse(c); setActiveModal('course'); }}
                      className="hover:text-white transition text-left"
                    >
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Levels Column */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Levels</h4>
              <ul className="space-y-2 text-xs text-gray-500">
                <li><span className="text-gray-500">Individual</span></li>
                <li><span className="text-gray-500">Group</span></li>
                <li><span className="text-gray-500">Team</span></li>
              </ul>
            </div>

            {/* Company Column - Now with functional buttons */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Company</h4>
              <ul className="space-y-2 text-xs text-gray-500">
                <li>
                  <button 
                    onClick={() => setActiveModal('about')}
                    className="hover:text-white transition text-left"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveModal('contact')}
                    className="hover:text-white transition text-left"
                  >
                    Contact
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveModal('privacy')}
                    className="hover:text-white transition text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveModal('cohorts')}
                    className="hover:text-white transition text-left"
                  >
                    Careers
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Developer Credits */}
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs text-gray-600">
            <p>Developed by Freddy Bijanja, IRADUKUNDA Boris & Olivier Nduwayesu</p>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {activeModal && Modals[activeModal] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-white/90 backdrop-blur-xl rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto border border-white/30 shadow-2xl">
            <div className="p-6 border-b border-white/30 flex justify-between sticky top-0 bg-white/90 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-gray-900">{Modals[activeModal].title}</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600">
                <X />
              </button>
            </div>
            <div className="p-6">{Modals[activeModal].content}</div>
          </div>
        </div>
      )}
    </div>
  );
}