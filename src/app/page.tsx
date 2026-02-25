"use client";

import Image from "next/image";
import { Search, Menu, X, ChevronLeft, ChevronRight, Star, Users, BookOpen, Award, Clock, TrendingUp, Play, CheckCircle, ArrowRight } from "lucide-react";
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
      level: "Intermediate",
      image: "/course-ai.jpg"
    },
    {
      title: "Full Stack Engineering",
      instructor: "Michael Okonkwo",
      students: "2,567",
      rating: 4.9,
      duration: "12 weeks",
      level: "Advanced",
      image: "/course-engineering.jpg"
    },
    {
      title: "UX Design Fundamentals",
      instructor: "Amina Diallo",
      students: "1,892",
      rating: 4.7,
      duration: "6 weeks",
      level: "Beginner",
      image: "/course-design.jpg"
    },
    {
      title: "Product Leadership",
      instructor: "David Kimani",
      students: "987",
      rating: 4.9,
      duration: "10 weeks",
      level: "Advanced",
      image: "/course-leadership.jpg"
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "James Mwangi",
      role: "Product Manager",
      company: "Safaricom",
      content: "The cohort structure kept me accountable. I completed the course with a real project I'm proud of.",
      image: "/testimonial-1.jpg",
      rating: 5
    },
    {
      name: "Grace Akinyi",
      role: "Software Engineer",
      company: "Andela",
      content: "Learning with peers made all the difference. The instructors provided invaluable feedback throughout.",
      image: "/testimonial-2.jpg",
      rating: 5
    },
    {
      name: "Oluwaseun Adebayo",
      role: "UX Designer",
      company: "Flutterwave",
      content: "The curriculum is practical and industry-relevant. I started applying concepts from week one.",
      image: "/testimonial-3.jpg",
      rating: 5
    }
  ];

  // YOUR BACKGROUND IMAGES
  const backgroundImages = [
    "/bg-image-1.jpg",
    "/bg-image-2.jpg", 
    "/bg-image-3.jpg"
  ];

  // Auto-slide for content (right side)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Auto-change background images (left side)
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
      {/* SPLIT SCREEN LAYOUT - Only for hero section */}
      
      {/* LEFT SIDE - Background Images (50% width) - Only visible in hero */}
      <div className="fixed left-0 top-0 w-1/2 h-screen">
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
        {/* Subtle overlay on left side only */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40"></div>
      </div>

      {/* RIGHT SIDE - Content Area (50% width) - Only visible in hero */}
      <div className="fixed right-0 top-0 w-1/2 h-screen bg-gradient-to-l from-black/80 via-black/60 to-transparent">
        {/* Content will go here */}
      </div>

      {/* CUTTING EDGE - Now spans across both sides but more visible on right */}
      <div className="absolute top-0 right-0 w-3/4 h-96 bg-gradient-to-r from-blue-900/30 to-blue-700/40 clip-path-edge z-10"></div>

      {/* header/navigation bar - Full width but transparent */}
      <header className="relative z-20 bg-transparent w-full">
        <div className="container mx-auto flex items-center justify-between py-3 px-6 max-w-7xl">
          {/* Left section - Logo */}
          <div className="flex items-center">
            <Image
              src="/cohort-logo.jpeg"
              alt="CohortLMS logo"
              width={220}
              height={80}
              priority
              className="h-20 w-auto object-contain brightness-0 invert"
              quality={100}
            />
          </div>

          {/* Center section - Search */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="What do you want to learn?"
                className="w-full border border-white/30 bg-white/10 backdrop-blur-md text-white rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-white/70"
              />
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
            </div>
          </div>

          {/* Right section - Links */}
          <div className="hidden md:flex items-center space-x-6">
            <a
              href="/lightning-lessons"
              className="text-sm text-white/90 hover:text-white transition-colors"
            >
              Lightning Lessons
            </a>
            <a
              href="/apply-to-teach"
              className="text-sm text-white/90 hover:text-white transition-colors"
            >
              Apply to teach
            </a>
            <a 
              href="/login" 
              className="text-sm bg-white text-blue-900 px-4 py-2 rounded-full hover:bg-blue-50 transition-colors font-medium"
            >
              Log In
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setMobileNavOpen((open) => !open)}
            aria-label="Toggle navigation"
          >
            {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Second row - Category navigation */}
        <div className="border-t border-white/20">
          <div className="container mx-auto px-6 max-w-7xl">
            <nav className="hidden md:flex items-center space-x-8 py-3 text-sm relative">
              <a href="#" className="text-white/90 hover:text-white transition-colors font-medium relative z-30">
                AI
              </a>
              <a href="#" className="text-white/90 hover:text-white transition-colors font-medium relative z-30">
                Product
              </a>
              <a href="#" className="text-white/90 hover:text-white transition-colors font-medium relative z-30">
                Engineering
              </a>
              <a href="#" className="text-white/90 hover:text-white transition-colors font-medium relative z-30">
                Design
              </a>
              <a href="#" className="text-white/90 hover:text-white transition-colors font-medium relative z-30">
                Marketing
              </a>
              <a href="#" className="text-white/90 hover:text-white transition-colors font-medium relative z-30">
                Leadership
              </a>
              <a href="#" className="text-white/90 hover:text-white transition-colors font-medium relative z-30">
                Founders
              </a>
              <a href="#" className="text-white/90 hover:text-white transition-colors font-medium relative z-30">
                More
              </a>
            </nav>

            {/* Mobile navigation menu */}
            {mobileNavOpen && (
              <div className="md:hidden py-4 space-y-4 bg-black/60 backdrop-blur-md rounded-lg mt-2 p-4">
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="What do you want to learn?"
                    className="w-full border border-white/30 bg-white/10 text-white rounded-md py-2 pl-10 pr-4 text-sm placeholder-white/70"
                  />
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
                </div>
                <div className="flex flex-col space-y-3">
                  <a href="/lightning-lessons" className="text-white hover:text-blue-200">Lightning Lessons</a>
                  <a href="/apply-to-teach" className="text-white hover:text-blue-200">Apply to teach</a>
                  <a href="/login" className="text-white hover:text-blue-200">Log In</a>
                </div>
                <div className="border-t border-white/20 pt-3 flex flex-wrap gap-3">
                  <a href="#" className="text-white hover:text-blue-200">AI</a>
                  <a href="#" className="text-white hover:text-blue-200">Product</a>
                  <a href="#" className="text-white hover:text-blue-200">Engineering</a>
                  <a href="#" className="text-white hover:text-blue-200">Design</a>
                  <a href="#" className="text-white hover:text-blue-200">Marketing</a>
                  <a href="#" className="text-white hover:text-blue-200">Leadership</a>
                  <a href="#" className="text-white hover:text-blue-200">Founders</a>
                  <a href="#" className="text-white hover:text-blue-200">More</a>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT - Hero Section with split screen */}
      <main className="relative z-20 flex-1">
        {/* Hero Section - Split screen */}
        <section className="min-h-screen flex items-center">
          <div className="w-1/2"></div> {/* Spacer for left side */}
          <div className="w-1/2 container mx-auto px-6 py-12 relative">
            {/* Slider container - On right side */}
            <div className="relative overflow-hidden rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 shadow-xl">
              {/* Slides */}
              <div 
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {slides.map((slide, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <div className="py-12 md:py-20 px-6 md:px-12">
                      <div className="max-w-3xl">
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                          {slide.title}{" "}
                          <span className="bg-gradient-to-r from-blue-300 to-sky-200 bg-clip-text text-transparent">
                            {slide.highlight}
                          </span>
                        </h1>
                        <p className="text-xl text-white/90 mb-8 leading-relaxed drop-shadow">
                          {slide.description}
                        </p>
                        <a
                          href="/courses"
                          className="inline-block bg-gradient-to-r from-blue-600 to-sky-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-sky-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          {slide.cta} →
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-2 shadow-lg transition-all border border-white/30"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-2 shadow-lg transition-all border border-white/30"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Slide indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentSlide === index 
                        ? "w-8 bg-white" 
                        : "bg-white/50 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Trusted By / Stats Section */}
        <section className="relative z-30 bg-white py-20">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by learners across Africa</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">Join thousands of professionals who have transformed their careers with CohortLMS</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-2">15k+</div>
                <div className="text-gray-600">Active Learners</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-2">120+</div>
                <div className="text-gray-600">Expert Instructors</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-2">48</div>
                <div className="text-gray-600">Industry Courses</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-2">94%</div>
                <div className="text-gray-600">Completion Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: Featured Courses */}
        <section className="relative z-30 bg-gray-50 py-20">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Courses</h2>
                <p className="text-xl text-gray-600">Hand-picked courses to accelerate your career</p>
              </div>
              <a href="/courses" className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                View all courses <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCourses.map((course, index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 relative">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-blue-600">
                      {course.level}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">with {course.instructor}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="w-4 h-4 mr-1" />
                        {course.students}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {course.duration}
                      </div>
                      <div className="flex items-center text-sm text-yellow-500">
                        <Star className="w-4 h-4 mr-1 fill-current" />
                        {course.rating}
                      </div>
                    </div>
                    
                    <a href="#" className="block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Enroll Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4: How It Works */}
        <section className="relative z-30 bg-white py-20">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">How Cohort Learning Works</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">Learn better together with our structured approach</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Join a Cohort</h3>
                <p className="text-gray-600">Start with a group of motivated peers at the same level. Learn together, grow together.</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Structured Learning</h3>
                <p className="text-gray-600">Follow a proven curriculum with weekly goals, projects, and peer reviews.</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Earn Certification</h3>
                <p className="text-gray-600">Complete real-world projects and earn credentials recognized by employers.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: Testimonials */}
        <section className="relative z-30 bg-gray-50 py-20">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">Hear from graduates who transformed their careers</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mr-4"></div>
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                  <div className="flex text-yellow-500">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6: CTA Section */}
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

      {/* Footer */}
      <footer className="relative z-20 bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Image
                src="/cohort-logo.jpeg"
                alt="CohortLMS"
                width={160}
                height={50}
                className="h-12 w-auto object-contain brightness-0 invert mb-4"
              />
              <p className="text-gray-400 text-sm">Learn together, grow together.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Courses</a></li>
                <li><a href="#" className="hover:text-white">For Instructors</a></li>
                <li><a href="#" className="hover:text-white">For Teams</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
            <p>© 2026 CohortLMS. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Custom CSS for the cutting edge */}
      <style jsx>{`
        .clip-path-edge {
          clip-path: polygon(0 0, 100% 0, 100% 60%, 70% 100%, 0 100%);
        }
      `}</style>
    </div>
  );
}