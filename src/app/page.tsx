"use client";

import { Search, Menu, X, ChevronLeft, ChevronRight, Star, Users, BookOpen, Award, Clock, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bgImageIndex, setBgImageIndex] = useState(0);

  // Slides content
  const slides = [
    {
      title: "Welcome to",
      highlight: "CohortLMS",
      description: "A structured cohort‑based learning platform that encourages collaboration, real‑world projects, and measurable progress. Join a community of learners and instructors working together to build skills and ship products.",
      cta: "Browse courses"
    },
    {
      title: "Featured",
      highlight: "Courses",
      description: "Explore our most popular courses taught by industry experts. From AI to Product Management, we have something for every learner.",
      cta: "View courses"
    },
    {
      title: "Success",
      highlight: "Stories",
      description: "Hear from our graduates who transformed their careers through CohortLMS. Join 2,400+ active learners on their journey.",
      cta: "Read stories"
    },
    {
      title: "Next Cohort",
      highlight: "Starts Soon",
      description: "Our upcoming cohort begins in 2 weeks. Secure your spot and start learning with a supportive community of peers.",
      cta: "Join now"
    }
  ];

  // Featured courses data
  const featuredCourses = [
    {
      title: "AI Product Management",
      instructor: "Sarah Chen",
      students: "1,234",
      rating: 4.8,
      duration: "8 weeks",
      level: "Intermediate"
    },
    {
      title: "Full Stack Engineering",
      instructor: "Michael Okonkwo",
      students: "2,567",
      rating: 4.9,
      duration: "12 weeks",
      level: "Advanced"
    },
    {
      title: "UX Design Fundamentals",
      instructor: "Amina Diallo",
      students: "1,892",
      rating: 4.7,
      duration: "6 weeks",
      level: "Beginner"
    },
    {
      title: "Product Leadership",
      instructor: "David Kimani",
      students: "987",
      rating: 4.9,
      duration: "10 weeks",
      level: "Advanced"
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "James Mwangi",
      role: "Product Manager",
      company: "Safaricom",
      content: "The cohort structure kept me accountable. I completed the course with a real project I'm proud of.",
      rating: 5
    },
    {
      name: "Grace Akinyi",
      role: "Software Engineer",
      company: "Andela",
      content: "Learning with peers made all the difference. The instructors provided invaluable feedback throughout.",
      rating: 5
    },
    {
      name: "Oluwaseun Adebayo",
      role: "UX Designer",
      company: "Flutterwave",
      content: "The curriculum is practical and industry-relevant. I started applying concepts from week one.",
      rating: 5
    }
  ];

  // Background images
  const backgroundImages = [
    "/bg-image-1.jpg",
    "/bg-image-2.jpg", 
    "/bg-image-3.jpg"
  ];

  // Auto-slide for content
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Auto-change background images
  useEffect(() => {
    const bgTimer = setInterval(() => {
      setBgImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 7000);
    return () => clearInterval(bgTimer);
  }, [backgroundImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Background Images - Lighter overlay for brightness */}
      <div className="fixed inset-0">
        {backgroundImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === bgImageIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
        ))}
        {/* Light overlay - only 20% */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Header */}
      <header className="relative z-20 bg-transparent w-full">
        <div className="container mx-auto flex items-center justify-between py-3 px-6 max-w-7xl">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-13 h-13 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
                <circle cx="14" cy="10" r="5" fill="#4F46E5" />
                <circle cx="26" cy="10" r="5" fill="#2563EB" />
                <circle cx="20" cy="6" r="5" fill="#06B6D4" />
                <path d="M4 28 Q20 18 36 28" stroke="#4F46E5" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M6 33 Q20 23 34 33" stroke="#2563EB" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M9 38 Q20 30 31 38" stroke="#06B6D4" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </svg>
            </div>
            <span className="ml-3 text-white font-bold text-xl drop-shadow-md">CohortLMS</span>
          </div>

          {/* Search */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="What do you want to learn?"
                className="w-full border border-white/40 bg-white/20 backdrop-blur-md text-white rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-white placeholder-white/80"
              />
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/80" />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-sm text-white/90 hover:text-white transition-colors font-medium drop-shadow">Lightning Lessons</a>
            <a href="#" className="text-sm text-white/90 hover:text-white transition-colors font-medium drop-shadow">Apply to teach</a>
            <a href="#" className="text-sm bg-white text-blue-900 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors font-medium shadow-md">Log In</a>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-white focus:outline-none" onClick={() => setMobileNavOpen(!mobileNavOpen)}>
            {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Category Navigation */}
        <div className="border-t border-white/30">
          <div className="container mx-auto px-6 max-w-7xl">
            <nav className="hidden md:flex items-center space-x-8 py-3 text-sm">
              {['AI', 'Product', 'Engineering', 'Design', 'Marketing', 'Leadership', 'Founders', 'More'].map((item) => (
                <a key={item} href="#" className="text-white/90 hover:text-white transition-colors font-medium drop-shadow">
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-20 flex-1">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center">
          <div className="w-1/2"></div>
          <div className="w-1/2 container mx-auto px-6 py-12 relative">
            <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
              <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {slides.map((slide, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <div className="py-12 md:py-20 px-6 md:px-12">
                      <div className="max-w-3xl">
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                          {slide.title}{" "}
                          <span className="text-blue-300 drop-shadow">{slide.highlight}</span>
                        </h1>
                        <p className="text-xl text-white/95 mb-8 leading-relaxed drop-shadow">
                          {slide.description}
                        </p>
                        <a href="/courses" className="inline-block bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg">
                          {slide.cta} →
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation */}
              <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/40 text-white rounded-full p-2 backdrop-blur">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/40 text-white rounded-full p-2 backdrop-blur">
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {slides.map((_, index) => (
                  <button key={index} onClick={() => setCurrentSlide(index)} className={`h-2 rounded-full transition-all ${
                    currentSlide === index ? "w-8 bg-white" : "w-2 bg-white/60 hover:bg-white/80"
                  }`} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section - Light background */}
        <section className="relative z-30 bg-white/80 backdrop-blur-sm py-20">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by learners across Africa</h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">Join thousands of professionals who have transformed their careers with CohortLMS</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center"><div className="text-5xl font-bold text-blue-600 mb-2">15k+</div><div className="text-gray-600">Active Learners</div></div>
              <div className="text-center"><div className="text-5xl font-bold text-blue-600 mb-2">120+</div><div className="text-gray-600">Expert Instructors</div></div>
              <div className="text-center"><div className="text-5xl font-bold text-blue-600 mb-2">48</div><div className="text-gray-600">Industry Courses</div></div>
              <div className="text-center"><div className="text-5xl font-bold text-blue-600 mb-2">94%</div><div className="text-gray-600">Completion Rate</div></div>
            </div>
          </div>
        </section>

        {/* Featured Courses - Light background */}
        <section className="relative z-30 bg-gray-100/90 backdrop-blur-sm py-20">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Courses</h2>
                <p className="text-xl text-gray-700">Hand-picked courses to accelerate your career</p>
              </div>
              <a href="/courses" className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                View all courses <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCourses.map((course, index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-700 relative">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-xs font-semibold text-blue-600 shadow">
                      {course.level}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">with {course.instructor}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm text-gray-500"><Users className="w-4 h-4 mr-1" />{course.students}</div>
                      <div className="flex items-center text-sm text-gray-500"><Clock className="w-4 h-4 mr-1" />{course.duration}</div>
                      <div className="flex items-center text-sm text-yellow-500"><Star className="w-4 h-4 mr-1 fill-current" />{course.rating}</div>
                    </div>
                    
                    <a href="#" className="block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">Enroll Now</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works - Light background */}
        <section className="relative z-30 bg-white/70 backdrop-blur-sm py-20">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">How Cohort Learning Works</h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">Learn better together with our structured approach</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center bg-white/80 p-8 rounded-xl shadow-lg backdrop-blur-sm">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6"><Users className="w-10 h-10 text-blue-600" /></div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Join a Cohort</h3>
                <p className="text-gray-600">Start with a group of motivated peers at the same level. Learn together, grow together.</p>
              </div>
              <div className="text-center bg-white/80 p-8 rounded-xl shadow-lg backdrop-blur-sm">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6"><BookOpen className="w-10 h-10 text-blue-600" /></div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Structured Learning</h3>
                <p className="text-gray-600">Follow a proven curriculum with weekly goals, projects, and peer reviews.</p>
              </div>
              <div className="text-center bg-white/80 p-8 rounded-xl shadow-lg backdrop-blur-sm">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6"><Award className="w-10 h-10 text-blue-600" /></div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Earn Certification</h3>
                <p className="text-gray-600">Complete real-world projects and earn credentials recognized by employers.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials - Light background */}
        <section className="relative z-30 bg-white/70 backdrop-blur-sm py-20">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">Hear from graduates who transformed their careers</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mr-4 shadow"></div>
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
                  <div className="flex text-yellow-500">{[...Array(testimonial.rating)].map((_, i) => (<Star key={i} className="w-4 h-4 fill-current" />))}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-30 bg-gradient-to-r from-blue-600 to-blue-800 py-20">
          <div className="container mx-auto px-6 max-w-7xl text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to start your learning journey?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">Join our next cohort and learn alongside motivated peers</p>
            <a href="/courses" className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg">
              Browse All Courses
            </a>
          </div>
        </section>
      </main>

      {/* Footer - Dark version (not too dark, not too light) */}
      <footer className="relative z-20 bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                  <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
                    <circle cx="14" cy="10" r="5" fill="#4F46E5" />
                    <circle cx="26" cy="10" r="5" fill="#2563EB" />
                    <circle cx="20" cy="6" r="5" fill="#06B6D4" />
                    <path d="M4 28 Q20 18 36 28" stroke="#4F46E5" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <path d="M6 33 Q20 23 34 33" stroke="#2563EB" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <path d="M9 38 Q20 30 31 38" stroke="#06B6D4" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="ml-2 font-bold text-white">CohortLMS</span>
              </div>
              <p className="text-gray-400 text-sm">Learn together, grow together.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Courses</a></li>
                <li><a href="#" className="hover:text-white transition-colors">For Instructors</a></li>
                <li><a href="#" className="hover:text-white transition-colors">For Teams</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          {/* Developer Credits */}
          <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>© 2026 CohortLMS. All rights reserved.</p>
            <p className="mt-2 md:mt-0">
              Developed by <span className="text-blue-400 font-medium">Freddy Bijanja</span>, <span className="text-blue-400 font-medium">IRADUKUNDA Boris</span> & <span className="text-blue-400 font-medium">Olivier Nduwayesu</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}