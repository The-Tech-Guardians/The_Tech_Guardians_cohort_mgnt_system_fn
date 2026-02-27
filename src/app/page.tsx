"use client";

import { Search, Menu, X, ArrowRight, Users, BookOpen, Award, Target, Code, Briefcase, Heart } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const bgImages = ["/bg-image-1.jpg", "/bg-image-2.jpg", "/bg-image-3.jpg"];

  // Auto-change background images
  useEffect(() => {
    const bgTimer = setInterval(() => {
      setBgIndex(i => (i + 1) % bgImages.length);
    }, 7000);
    return () => clearInterval(bgTimer);
  }, [bgImages.length]);

  // Track scroll for header effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // Individual courses
  const individualCourses = [
    { name: "Social Media Branding", icon: Target, color: "bg-pink-500/20 text-pink-300", students: "345", slug: "social-media" },
    { name: "Computer Programming", icon: Code, color: "bg-blue-500/20 text-blue-300", students: "567", slug: "programming" },
    { name: "Entrepreneurship", icon: Briefcase, color: "bg-green-500/20 text-green-300", students: "234", slug: "entrepreneurship" },
    { name: "SRHR", icon: Heart, color: "bg-purple-500/20 text-purple-300", students: "189", slug: "srhr" }
  ];

  // YOUR courses - for the Maven-style navigation
  const categoryItems = [
    'Social Media', 
    'Programming', 
    'Entrepreneurship', 
    'SRHR', 
    'Team Management'
  ];

  return (
    <div className="min-h-screen flex flex-col">
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
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Header - FIXED at top with darker background */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-800' 
          : 'bg-gray-900/80 backdrop-blur-sm border-b border-gray-800'
      }`}>
        {/* Top Row */}
        <div className="container mx-auto flex items-center justify-between py-3 px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Logo - YOUR EXACT LOGO */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-13 md:h-13 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
              <svg viewBox="0 0 40 40" className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10" fill="none">
                <circle cx="14" cy="10" r="5" fill="#4F46E5" />
                <circle cx="26" cy="10" r="5" fill="#2563EB" />
                <circle cx="20" cy="6" r="5" fill="#06B6D4" />
                <path d="M4 28 Q20 18 36 28" stroke="#4F46E5" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M6 33 Q20 23 34 33" stroke="#2563EB" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M9 38 Q20 30 31 38" stroke="#06B6D4" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-base sm:text-lg md:text-xl tracking-tight">CohortLMS</span>
              <span className="text-gray-400 font-bold text-xs sm:text-sm tracking-tight">Platform</span>
            </div>
          </div>

          {/* Search Bar - Hidden on mobile/tablet */}
          <div className="hidden lg:block flex-1 max-w-md mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="What do you want to learn?"
                className="w-full border border-gray-700 bg-gray-800/50 text-white rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              />
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Right Links - Hidden on mobile/tablet */}
          <div className="hidden lg:flex items-center space-x-6">
            <a href="#" className="text-sm text-gray-300 hover:text-white whitespace-nowrap">Lightning Lessons</a>
            <a href="#" className="text-sm text-gray-300 hover:text-white whitespace-nowrap">Apply to teach</a>
            <a href="#" className="text-sm bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 whitespace-nowrap">
              Log In
            </a>
          </div>

          {/* Mobile/Tablet menu button */}
          <button className="lg:hidden text-white p-2" onClick={() => setMobileNavOpen(!mobileNavOpen)}>
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Second Row - Category Navigation - Hidden on mobile */}
        <div className="hidden md:block border-t border-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <nav className="flex items-center space-x-6 lg:space-x-8 py-2 text-sm overflow-x-auto">
              {categoryItems.map(item => (
                <a key={item} href="#" className="text-gray-300 hover:text-white transition py-2 whitespace-nowrap text-xs sm:text-sm">
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileNavOpen && (
          <div className="lg:hidden bg-gray-900 border-t border-gray-800">
            <div className="container mx-auto px-4 py-4">
              {/* Mobile Search */}
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="What do you want to learn?"
                  className="w-full border border-gray-700 bg-gray-800 text-white rounded-lg py-2 pl-10 pr-4 text-sm placeholder-gray-400"
                />
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              {/* Mobile Links */}
              <a href="#" className="block text-gray-300 py-3 border-b border-gray-800">Lightning Lessons</a>
              <a href="#" className="block text-gray-300 py-3 border-b border-gray-800">Apply to teach</a>
              
              {/* Mobile Categories */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                {categoryItems.map(item => (
                  <a key={item} href="#" className="text-gray-300 py-2 text-center bg-gray-800 rounded-lg text-xs">
                    {item}
                  </a>
                ))}
              </div>
              
              <a href="#" className="block bg-white text-gray-900 px-4 py-3 rounded-lg text-center mt-4 font-medium text-sm">
                Log In
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Spacer to prevent content from hiding behind fixed header */}
      <div className="h-[120px] md:h-[140px]"></div>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section - WITH PROPER SPACING LIKE MAVEN */}
        <section className="min-h-screen flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            {/* Left margin space like Maven */}
            <div className="max-w-3xl ml-0 lg:ml-8 xl:ml-16">
              {/* Tagline like Maven's "Unlock your career growth" */}
              <p className="text-blue-400 font-semibold text-sm sm:text-base mb-4 tracking-wide">
                UNLOCK YOUR POTENTIAL
              </p>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Learn with <br />purpose
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 max-w-xl">
                Social Media Branding, Computer Programming, Entrepreneurship, SRHR, and Team Management — designed for real impact.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <a href="/courses" className="bg-blue-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg hover:bg-blue-700 transition font-medium text-sm sm:text-base">
                  Browse courses
                </a>
                <a href="/cohorts" className="bg-white/10 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg hover:bg-white/20 transition font-medium text-sm sm:text-base">
                  View cohorts
                </a>
              </div>

              {/* Course tags */}
              <div className="flex flex-wrap gap-2 mt-8">
                <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 text-white rounded-full text-xs sm:text-sm">Social Media</span>
                <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 text-white rounded-full text-xs sm:text-sm">Programming</span>
                <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 text-white rounded-full text-xs sm:text-sm">Entrepreneurship</span>
                <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 text-white rounded-full text-xs sm:text-sm">SRHR</span>
                <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 text-white rounded-full text-xs sm:text-sm">Team Mgmt</span>
              </div>
            </div>
          </div>
        </section>

        {/* Individual Courses Section */}
        <section className="bg-gray-900/90 backdrop-blur-sm py-16 sm:py-20 lg:py-24 border-y border-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="ml-0 lg:ml-8 xl:ml-16">
              <div className="text-left mb-12">
                <p className="text-blue-400 font-semibold text-sm mb-3">COURSES</p>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">Individual Courses</h2>
                <p className="text-sm sm:text-base text-gray-400 max-w-2xl">Build foundational skills with our core curriculum</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 ml-0 lg:ml-8 xl:ml-16">
              {individualCourses.map((course, i) => (
                <div key={i} className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-5 sm:p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-700">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${course.color} bg-opacity-20 flex items-center justify-center mb-3 sm:mb-4`}>
                    <course.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2">{course.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-400">{course.students} active learners</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Group & Team Programs Section */}
        <section className="bg-gray-800/90 backdrop-blur-sm py-16 sm:py-20 lg:py-24 border-b border-gray-700">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="ml-0 lg:ml-8 xl:ml-16">
              <div className="text-left mb-12">
                <p className="text-blue-400 font-semibold text-sm mb-3">PROGRAMS</p>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">Group & Team Programs</h2>
                <p className="text-sm sm:text-base text-gray-400 max-w-2xl">Collaborative learning for teams and organizations</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 ml-0 lg:ml-8 xl:ml-16">
              {/* Group Level */}
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 sm:p-8 shadow-lg border border-gray-700">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Group Level</h3>
                <p className="text-sm sm:text-base text-gray-400 mb-4">Same core curriculum with team collaboration</p>
                <div className="space-y-2">
                  {individualCourses.map((course, i) => (
                    <div key={i} className="flex items-center text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-gray-300">{course.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Level */}
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 sm:p-8 shadow-lg border border-gray-700">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Team Level</h3>
                <p className="text-sm sm:text-base text-gray-400 mb-4">Advanced leadership for organizations</p>
                <div className="bg-gray-800/80 rounded-lg p-3 sm:p-4 border border-gray-700">
                  <div className="flex items-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-500/20 rounded-lg flex items-center justify-center mr-3">
                      <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm sm:text-base">Team Management</h4>
                      <p className="text-xs sm:text-sm text-gray-400">Leadership & coordination</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Background Image CTA Section */}
        <section className="relative py-20 sm:py-24 lg:py-32">
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
            <div className="absolute inset-0 bg-black/70" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
            <div className="ml-0 lg:ml-8 xl:ml-16 max-w-2xl">
              <p className="text-blue-400 font-semibold text-sm mb-3">GET STARTED</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">Ready to start your journey?</h2>
              <p className="text-base sm:text-lg text-gray-300 mb-6">Join a cohort today and learn alongside motivated peers</p>
              <a href="/cohorts" className="inline-block bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-blue-700 transition font-medium text-sm sm:text-base">
                Browse Open Cohorts
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8 sm:py-12 lg:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12 ml-0 lg:ml-8 xl:ml-16">
            
            {/* Brand Column */}
            <div className="text-left">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gray-800 flex items-center justify-center mr-3">
                  <svg viewBox="0 0 40 40" className="w-5 h-5 sm:w-6 sm:h-6" fill="none">
                    <circle cx="14" cy="10" r="5" fill="#4F46E5" />
                    <circle cx="26" cy="10" r="5" fill="#2563EB" />
                    <circle cx="20" cy="6" r="5" fill="#06B6D4" />
                    <path d="M4 28 Q20 18 36 28" stroke="#4F46E5" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <path d="M6 33 Q20 23 34 33" stroke="#2563EB" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <path d="M9 38 Q20 30 31 38" stroke="#06B6D4" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="font-bold text-white text-sm sm:text-base">CohortLMS</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-xs">
                Structured cohort-based learning platform for real-world impact.
              </p>
              <p className="text-xs text-gray-600 mt-4">© 2026 All rights reserved.</p>
            </div>

            {/* Courses Column */}
            <div className="text-left">
              <h4 className="font-semibold text-white text-sm sm:text-base mb-4">Courses</h4>
              <ul className="space-y-2">
                {individualCourses.map((course, i) => (
                  <li key={i}>
                    <a href="#" className="text-xs sm:text-sm text-gray-500 hover:text-white transition-colors">
                      {course.name}
                    </a>
                  </li>
                ))}
                <li>
                  <a href="#" className="text-xs sm:text-sm text-gray-500 hover:text-white transition-colors">
                    Team Management
                  </a>
                </li>
              </ul>
            </div>

            {/* Levels Column */}
            <div className="text-left">
              <h4 className="font-semibold text-white text-sm sm:text-base mb-4">Levels</h4>
              <ul className="space-y-2">
                <li><span className="text-xs sm:text-sm text-gray-500">Individual</span></li>
                <li><span className="text-xs sm:text-sm text-gray-500">Group</span></li>
                <li><span className="text-xs sm:text-sm text-gray-500">Team</span></li>
              </ul>
            </div>

            {/* Company Column */}
            <div className="text-left">
              <h4 className="font-semibold text-white text-sm sm:text-base mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-xs sm:text-sm text-gray-500 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-xs sm:text-sm text-gray-500 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-xs sm:text-sm text-gray-500 hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="text-xs sm:text-sm text-gray-500 hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-8 sm:mt-12 lg:mt-16 pt-6 sm:pt-8 ml-0 lg:ml-8 xl:ml-16">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-xs text-gray-600 order-2 sm:order-1">
                © 2026 CohortLMS. All rights reserved.
              </p>
              <p className="text-xs text-gray-600 order-1 sm:order-2 text-center sm:text-right">
                Developed by{' '}
                <span className="text-gray-400 hover:text-white transition-colors font-medium">Freddy Bijanja</span>,{' '}
                <span className="text-gray-400 hover:text-white transition-colors font-medium">IRADUKUNDA Boris</span>{' '}
                &{' '}
                <span className="text-gray-400 hover:text-white transition-colors font-medium">Olivier Nduwayesu</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}