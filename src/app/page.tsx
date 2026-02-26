"use client";

import { Search, Menu, X, Users, BookOpen, Award, Target, Code, Briefcase, Heart } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);

  // Background images
  const bgImages = ["/bg-image-1.jpg", "/bg-image-2.jpg", "/bg-image-3.jpg"];

  // Auto-change background images
  useEffect(() => {
    const bgTimer = setInterval(() => {
      setBgIndex(i => (i + 1) % bgImages.length);
    }, 7000);
    return () => clearInterval(bgTimer);
  }, [bgImages.length]);

  // Individual courses
  const individualCourses = [
    { name: "Social Media Branding", icon: Target, color: "bg-pink-100 text-pink-600", students: "345" },
    { name: "Computer Programming", icon: Code, color: "bg-blue-100 text-blue-600", students: "567" },
    { name: "Entrepreneurship", icon: Briefcase, color: "bg-green-100 text-green-600", students: "234" },
    { name: "SRHR", icon: Heart, color: "bg-purple-100 text-purple-600", students: "189" }
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
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full bg-transparent">
        {/* Top Row - Logo and Navigation */}
        <div className="container mx-auto flex items-center justify-between py-4 px-4 sm:px-6 max-w-7xl">
          {/* Logo Design */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
              <svg viewBox="0 0 40 40" className="w-8 h-8 sm:w-10 sm:h-10" fill="none">
                <circle cx="14" cy="10" r="5" fill="#4F46E5" />
                <circle cx="26" cy="10" r="5" fill="#2563EB" />
                <circle cx="20" cy="6" r="5" fill="#06B6D4" />
                <path d="M4 28 Q20 18 36 28" stroke="#4F46E5" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M6 33 Q20 23 34 33" stroke="#2563EB" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M9 38 Q20 30 31 38" stroke="#06B6D4" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg sm:text-xl tracking-tight">CohortLMS</span>
              <span className="text-white/70 font-bold text-xs sm:text-sm tracking-tight">Platform</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <a href="#" className="text-sm text-white/80 hover:text-white transition">Courses</a>
            <a href="#" className="text-sm text-white/80 hover:text-white transition">Cohorts</a>
            <a href="#" className="text-sm text-white/80 hover:text-white transition">For Teams</a>
            <a href="#" className="text-sm bg-white/10 backdrop-blur text-white px-4 py-2 rounded-lg hover:bg-white/20 transition">
              Sign In
            </a>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-white p-2" onClick={() => setMobileNavOpen(!mobileNavOpen)}>
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Course Description Banner */}
        <div className="bg-white/10 backdrop-blur-sm border-y border-white/20 py-3">
          <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
            <p className="text-white/90 text-xs sm:text-sm text-center md:text-left">
              <span className="font-semibold text-white">Individual:</span> Social Media, Programming, Entrepreneurship, SRHR •{' '}
              <span className="font-semibold text-white">Group:</span> Same courses •{' '}
              <span className="font-semibold text-white">Team:</span> Team Management
            </p>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileNavOpen && (
          <div className="md:hidden bg-gray-900/95 backdrop-blur-md border-t border-white/10">
            <div className="container mx-auto px-4 py-4">
              <a href="#" className="block text-white/80 py-3 border-b border-white/10">Courses</a>
              <a href="#" className="block text-white/80 py-3 border-b border-white/10">Cohorts</a>
              <a href="#" className="block text-white/80 py-3 border-b border-white/10">For Teams</a>
              <a href="#" className="block bg-white/10 text-white px-4 py-3 rounded-lg text-center mt-4">
                Sign In
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center py-12">
          <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
            <div className="max-w-2xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                Learn with purpose
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 max-w-xl">
                Social Media Branding, Computer Programming, Entrepreneurship, SRHR, and Team Management — designed for real impact.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="/courses" className="bg-blue-600 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg hover:bg-blue-700 transition font-medium text-sm sm:text-base">
                  Browse courses
                </a>
                <a href="/cohorts" className="bg-white/10 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg hover:bg-white/20 transition font-medium text-sm sm:text-base">
                  View cohorts
                </a>
              </div>

              {/* Course tags */}
              <div className="flex flex-wrap gap-2 mt-6">
                <span className="px-2 py-1 sm:px-3 sm:py-1 bg-white/10 text-white rounded-full text-xs sm:text-sm">Social Media</span>
                <span className="px-2 py-1 sm:px-3 sm:py-1 bg-white/10 text-white rounded-full text-xs sm:text-sm">Programming</span>
                <span className="px-2 py-1 sm:px-3 sm:py-1 bg-white/10 text-white rounded-full text-xs sm:text-sm">Entrepreneurship</span>
                <span className="px-2 py-1 sm:px-3 sm:py-1 bg-white/10 text-white rounded-full text-xs sm:text-sm">SRHR</span>
                <span className="px-2 py-1 sm:px-3 sm:py-1 bg-white/10 text-white rounded-full text-xs sm:text-sm">Team Mgmt</span>
              </div>
            </div>
          </div>
        </section>

        {/* Individual Courses Section - REMOVED "Learn more" links */}
        <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">Individual Courses</h2>
              <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">Build foundational skills with our core curriculum</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {individualCourses.map((course, i) => (
                <div key={i} className="bg-white rounded-lg p-5 sm:p-6 shadow-sm">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${course.color} flex items-center justify-center mb-3 sm:mb-4`}>
                    <course.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">{course.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">{course.students} active learners</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Group & Team Levels Section - REMOVED all "Learn more" links */}
        <section className="bg-blue-50 py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">Group & Team Programs</h2>
              <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">Collaborative learning for teams and organizations</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {/* Group Level */}
              <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Group Level</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">Same core curriculum with team collaboration</p>
                <div className="space-y-2">
                  {individualCourses.map((course, i) => (
                    <div key={i} className="flex items-center text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2"></div>
                      <span className="text-gray-700">{course.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Level */}
              <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Team Level</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">Advanced leadership for organizations</p>
                <div className="bg-amber-50 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-200 rounded-lg flex items-center justify-center mr-3">
                      <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm sm:text-base">Team Management</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Leadership & coordination</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Background Image CTA Section - REMOVED extra links, kept only main CTA */}
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
            <div className="absolute inset-0 bg-black/60" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">Ready to start your journey?</h2>
            <p className="text-base sm:text-lg text-gray-200 mb-6 max-w-2xl mx-auto px-4">Join a cohort today and learn alongside motivated peers</p>
            <a href="/cohorts" className="inline-block bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-blue-700 transition font-medium text-sm sm:text-base">
              Browse Open Cohorts
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            
            {/* Brand Column */}
            <div className="text-center xs:text-left">
              <div className="flex items-center justify-center xs:justify-start mb-3">
                <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center mr-2">
                  <svg viewBox="0 0 40 40" className="w-5 h-5" fill="none">
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
              <p className="text-xs sm:text-sm text-gray-500">© 2026 All rights reserved.</p>
            </div>

            {/* Courses Column */}
            <div className="text-center xs:text-left">
              <h4 className="font-semibold text-white text-sm sm:text-base mb-3">Courses</h4>
              <ul className="space-y-1.5 text-xs sm:text-sm">
                <li className="text-gray-500 block">Social Media</li>
                <li className="text-gray-500 block">Programming</li>
                <li className="text-gray-500 block">Entrepreneurship</li>
                <li className="text-gray-500 block">SRHR</li>
                <li className="text-gray-500 block">Team Mgmt</li>
              </ul>
            </div>

            {/* Levels Column */}
            <div className="text-center xs:text-left">
              <h4 className="font-semibold text-white text-sm sm:text-base mb-3">Levels</h4>
              <ul className="space-y-1.5 text-xs sm:text-sm">
                <li className="text-gray-500 block">Individual</li>
                <li className="text-gray-500 block">Group</li>
                <li className="text-gray-500 block">Team</li>
              </ul>
            </div>

            {/* Company Column */}
            <div className="text-center xs:text-left">
              <h4 className="font-semibold text-white text-sm sm:text-base mb-3">Company</h4>
              <ul className="space-y-1.5 text-xs sm:text-sm">
                <li><a href="#" className="text-gray-500 hover:text-white transition block">About</a></li>
                <li><a href="#" className="text-gray-500 hover:text-white transition block">Contact</a></li>
                <li><a href="#" className="text-gray-500 hover:text-white transition block">Privacy</a></li>
              </ul>
            </div>
          </div>

          {/* Developer Credits */}
          <div className="border-t border-gray-800 mt-8 pt-6 text-center">
            <p className="text-xs text-gray-600 px-4">
              Developed by Freddy Bijanja, IRADUKUNDA Boris & Olivier Nduwayesu
            </p>
          </div>
        </div>
      </footer>

      {/* Custom breakpoint */}
      <style jsx>{`
        @media (min-width: 480px) {
          .xs\\:text-left {
            text-align: left;
          }
          .xs\\:justify-start {
            justify-content: flex-start;
          }
          .xs\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>
    </div>
  );
}