"use client";

import { Search, Menu, X, ChevronLeft, ChevronRight, ArrowRight, Users, BookOpen, Award, Shield, Target, Briefcase, Heart, Code } from "lucide-react";
import { useState, useEffect, useRef } from "react";

// Custom hook for intersection observer
const useIntersectionObserver = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.3, ...options });

    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [options]);

  return [ref, isVisible];
};

// Counter component
const Counter = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useIntersectionObserver();

  useEffect(() => {
    if (!isVisible) return;
    
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

export default function Home() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bgIndex, setBgIndex] = useState(0);

  // Hero slides
  const slides = [
    { 
      title: "Learn", 
      highlight: "Practical Skills", 
      cta: "Explore courses",
      desc: "Social Media Branding, Computer Programming, Entrepreneurship, and SRHR — designed for real-world impact." 
    },
    { 
      title: "Grow with", 
      highlight: "Cohort Learning", 
      cta: "Join a cohort",
      desc: "Learn alongside motivated peers with structured weekly releases and hands-on projects." 
    },
    { 
      title: "Lead with", 
      highlight: "Team Management", 
      cta: "View team programs",
      desc: "Advanced team-level training in leadership and team management for organizations." 
    }
  ];

  // Your actual courses - INDIVIDUAL LEVEL
  const individualCourses = [
    { name: "Social Media Branding", icon: Target, color: "from-pink-500 to-rose-500", students: 345, description: "Build your personal brand across platforms" },
    { name: "Beginner Programming", icon: Code, color: "from-blue-500 to-cyan-500", students: 567, description: "Start your coding journey from scratch" },
    { name: "Entrepreneurship", icon: Briefcase, color: "from-green-500 to-emerald-500", students: 234, description: "Turn ideas into successful ventures" },
    { name: "SRHR", icon: Heart, color: "from-purple-500 to-violet-500", students: 189, description: "Sexual & Reproductive Health and Rights" }
  ];

  // Team level courses
  const teamCourses = [
    { name: "Team Management", icon: Users, color: "from-amber-500 to-orange-500", description: "Advanced leadership and team coordination" }
  ];

  // Stats
  const stats = [
    { value: 15, suffix: "k+", label: "Active Learners", icon: Users },
    { value: 120, suffix: "+", label: "Expert Instructors", icon: Award },
    { value: 5, suffix: "", label: "Core Courses", icon: BookOpen },
    { value: 100, suffix: "%", label: "Secure Platform", icon: Shield }
  ];

  const bgImages = ["/bg-image-1.jpg", "/bg-image-2.jpg", "/bg-image-3.jpg"];
  const navItems = ['Courses', 'Cohorts', 'For Teams', 'Pricing'];

  // Timers
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide(s => (s + 1) % slides.length);
    }, 5000);
    
    const bgTimer = setInterval(() => {
      setBgIndex(i => (i + 1) % bgImages.length);
    }, 7000);
    
    return () => { 
      clearInterval(slideTimer); 
      clearInterval(bgTimer); 
    };
  }, [slides.length, bgImages.length]);

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
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
              backgroundRepeat: 'no-repeat'
            }} 
          />
        ))}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Header */}
      <header className="relative z-30 bg-transparent w-full">
        <div className="container mx-auto flex items-center justify-between py-4 px-4 sm:px-6 max-w-7xl">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
                <circle cx="14" cy="10" r="5" fill="#4F46E5" />
                <circle cx="26" cy="10" r="5" fill="#2563EB" />
                <circle cx="20" cy="6" r="5" fill="#06B6D4" />
                <path d="M4 28 Q20 18 36 28" stroke="#4F46E5" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M6 33 Q20 23 34 33" stroke="#2563EB" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M9 38 Q20 30 31 38" stroke="#06B6D4" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </svg>
            </div>
            <span className="ml-2 text-white font-bold text-lg">CohortLMS</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(item => (
              <a key={item} href="#" className="text-sm text-white/90 hover:text-white transition-colors">
                {item}
              </a>
            ))}
            <a href="#" className="text-sm bg-white text-blue-900 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors">
              Sign In
            </a>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-white p-2" onClick={() => setMobileNavOpen(!mobileNavOpen)}>
            {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileNavOpen && (
          <div className="md:hidden bg-gray-900/95 backdrop-blur-md border-t border-white/10">
            <div className="container mx-auto px-4 py-4">
              {navItems.map(item => (
                <a key={item} href="#" className="block text-white/90 py-3 hover:text-white border-b border-white/10">
                  {item}
                </a>
              ))}
              <a href="#" className="block bg-white text-blue-900 px-4 py-3 rounded-full text-center mt-4 hover:bg-gray-100">
                Sign In
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="relative z-20 flex-1">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center pt-20 pb-10">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="max-w-3xl">
              <div className="relative overflow-hidden rounded-2xl bg-black/30 backdrop-blur-md border border-white/20">
                <div 
                  className="flex transition-transform duration-700 ease-in-out" 
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {slides.map((slide, i) => (
                    <div key={i} className="w-full flex-shrink-0 p-8 lg:p-12">
                      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
                        {slide.title} <span className="text-blue-300 block sm:inline">{slide.highlight}</span>
                      </h1>
                      <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed max-w-2xl">{slide.desc}</p>
                      <div className="flex flex-wrap gap-4">
                        <a href="/courses" className="inline-block bg-blue-600 text-white px-8 py-4 rounded-full hover:bg-blue-700 transition-colors shadow-lg font-medium">
                          {slide.cta} →
                        </a>
                        <a href="/how-it-works" className="inline-block bg-white/10 backdrop-blur text-white px-8 py-4 rounded-full hover:bg-white/20 transition-colors font-medium">
                          Learn more
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Slide indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {slides.map((_, i) => (
                    <button 
                      key={i} 
                      onClick={() => setCurrentSlide(i)} 
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <stat.icon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
                    <Counter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Individual Level Courses */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Individual Level Courses</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Build foundational skills with our core curriculum</p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {individualCourses.map((course, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
                  <div className={`h-2 bg-gradient-to-r ${course.color}`}></div>
                  <div className="p-6">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <course.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{course.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{course.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{course.students} learners</span>
                      <a href="#" className="text-blue-600 text-sm font-medium hover:text-blue-700">Learn more →</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Group & Team Levels */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Group Level */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Group Level</h3>
                <p className="text-gray-600 mb-6">Same core curriculum, now with team collaboration</p>
                <div className="space-y-3">
                  {individualCourses.map((course, i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-600 mr-3"></div>
                      <span className="text-gray-700">{course.name}</span>
                    </div>
                  ))}
                </div>
                <a href="/group" className="inline-block mt-6 text-blue-600 font-medium hover:text-blue-700">
                  Learn about group programs →
                </a>
              </div>

              {/* Team Level */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Team Level</h3>
                <p className="text-gray-600 mb-6">Advanced leadership for organizational success</p>
                <div className="space-y-3">
                  {teamCourses.map((course, i) => (
                    <div key={i} className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                        <course.icon className="w-3 h-3 text-amber-600" />
                      </div>
                      <div>
                        <span className="text-gray-900 font-medium block">{course.name}</span>
                        <span className="text-sm text-gray-600">{course.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <a href="/team" className="inline-block mt-6 text-amber-600 font-medium hover:text-amber-700">
                  Explore team management →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Learning Path Summary */}
        <section className="bg-gray-50 py-12">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Your Learning Journey</h3>
                <p className="text-sm text-gray-600">Individual → Group → Team Leadership</p>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Social Media</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">Programming</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">Entrepreneurship</span>
                <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs">SRHR</span>
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">Team Mgmt</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
          <div className="container mx-auto px-4 max-w-7xl text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Start your learning journey today</h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">Choose your path: Individual, Group, or Team level.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="/courses" className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg">
                Browse All Courses
              </a>
              <a href="/cohorts" className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-colors">
                View Open Cohorts
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center mr-2">
                  <svg viewBox="0 0 40 40" className="w-6 h-6" fill="none">
                    <circle cx="14" cy="10" r="5" fill="#4F46E5" />
                    <circle cx="26" cy="10" r="5" fill="#2563EB" />
                    <circle cx="20" cy="6" r="5" fill="#06B6D4" />
                    <path d="M4 28 Q20 18 36 28" stroke="#4F46E5" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <path d="M6 33 Q20 23 34 33" stroke="#2563EB" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <path d="M9 38 Q20 30 31 38" stroke="#06B6D4" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="font-bold text-white">CohortLMS</span>
              </div>
              <p className="text-sm">© 2026 All rights reserved.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Courses</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Social Media Branding</a></li>
                <li><a href="#" className="hover:text-white">Beginner Programming</a></li>
                <li><a href="#" className="hover:text-white">Entrepreneurship</a></li>
                <li><a href="#" className="hover:text-white">SRHR</a></li>
                <li><a href="#" className="hover:text-white">Team Management</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Levels</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Individual</a></li>
                <li><a href="#" className="hover:text-white">Group</a></li>
                <li><a href="#" className="hover:text-white">Team</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          {/* Developer Credits */}
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs text-gray-500">
            <p>Developed by Freddy Bijanja, IRADUKUNDA Boris & Olivier Nduwayesu</p>
          </div>
        </div>
      </footer>
    </div>
  );
}