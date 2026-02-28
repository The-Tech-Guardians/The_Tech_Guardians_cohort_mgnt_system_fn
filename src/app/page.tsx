"use client";

import { Search, Menu, X, ArrowRight, Users, BookOpen, Award, Target, Code, Briefcase, Heart, Calendar, ChevronRight, Sparkles, Clock, Star, CreditCard, Lock, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedCohort, setSelectedCohort] = useState(null);
  const [enrollments, setEnrollments] = useState({});
  const [enrollmentStep, setEnrollmentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [notifyEmail, setNotifyEmail] = useState('');

  const bgImages = ["/bg-image-1.jpg", "/bg-image-2.jpg", "/bg-image-3.jpg"];

  useEffect(() => {
    const bgTimer = setInterval(() => setBgIndex(i => (i + 1) % bgImages.length), 7000);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    
    const fetchEnrollments = async () => {
      setEnrollments({
        1: 1245, 2: 2341, 3: 892, 4: 567, 5: 431
      });
    };
    fetchEnrollments();
    
    return () => {
      clearInterval(bgTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const courses = [
    { id: 1, name: "Social Media Branding", icon: Target, color: "bg-pink-100 text-pink-600", slug: "social-media",
      description: "Master the art of building a powerful personal and business brand across all social platforms.",
      longDescription: "This comprehensive course teaches you how to create a cohesive brand identity, develop engaging content strategies, and grow your audience across Instagram, LinkedIn, TikTok, and Twitter.",
      duration: "8 weeks", lessons: 24, level: "Intermediate", rating: 4.8, students: 1245, price: 299,
      instructor: { name: "Sarah Chen", title: "Social Media Strategist", company: "Former Meta",
        bio: "Sarah led social strategy for Fortune 500 brands at Meta before launching her own agency." }},
    { id: 2, name: "Computer Programming", icon: Code, color: "bg-blue-100 text-blue-600", slug: "programming",
      description: "Learn programming from scratch with Python, JavaScript, and real-world projects.",
      longDescription: "Start your coding journey with this beginner-friendly course that takes you from zero to building actual applications.",
      duration: "12 weeks", lessons: 48, level: "Beginner", rating: 4.9, students: 2341, price: 399,
      instructor: { name: "Michael Okonkwo", title: "Senior Software Engineer", company: "Google",
        bio: "Michael has 10+ years of experience at Google working on large-scale systems." }},
    { id: 3, name: "Entrepreneurship", icon: Briefcase, color: "bg-green-100 text-green-600", slug: "entrepreneurship",
      description: "Turn your ideas into a successful business with proven frameworks.",
      longDescription: "Learn how to validate ideas, build MVPs, raise funding, and scale your startup.",
      duration: "10 weeks", lessons: 32, level: "Intermediate", rating: 4.7, students: 892, price: 349,
      instructor: { name: "David Kimani", title: "Serial Entrepreneur", company: "Founder of 3 startups",
        bio: "David has founded and exited two tech startups. He's an angel investor." }},
    { id: 4, name: "SRHR", icon: Heart, color: "bg-purple-100 text-purple-600", slug: "srhr",
      description: "Comprehensive education on Sexual and Reproductive Health and Rights.",
      longDescription: "This course provides evidence-based information on sexual health, reproductive rights, relationships, and well-being.",
      duration: "6 weeks", lessons: 18, level: "All Levels", rating: 4.9, students: 567, price: 199,
      instructor: { name: "Dr. Amina Diallo", title: "Public Health Expert", company: "WHO Consultant",
        bio: "Dr. Diallo has worked with WHO and UNFPA on reproductive health programs across Africa." }},
    { id: 5, name: "Team Management", icon: Award, color: "bg-amber-100 text-amber-600", slug: "team-management",
      description: "Advanced leadership skills to build and lead high-performance teams.",
      longDescription: "Develop the leadership capabilities needed to manage teams effectively.",
      duration: "8 weeks", lessons: 24, level: "Advanced", rating: 4.8, students: 431, price: 379,
      instructor: { name: "Oluwaseun Adebayo", title: "Leadership Coach", company: "Former Amazon",
        bio: "Oluwaseun spent 8 years at Amazon leading global teams." }}
  ];

  const cohorts = [
    { id: 1, name: "Spring 2026", status: "open", startDate: "April 1, 2026", endDate: "June 30, 2026",
      enrollmentOpen: "Mar 1, 2026", enrollmentClose: "Mar 25, 2026", enrolled: 245, capacity: 300,
      courses: ["Social Media Branding", "Computer Programming", "Entrepreneurship", "SRHR"] },
    { id: 2, name: "Summer 2026", status: "coming", startDate: "July 1, 2026", endDate: "September 30, 2026",
      enrollmentOpen: "May 1, 2026", enrollmentClose: "May 25, 2026", enrolled: 0, capacity: 300,
      courses: ["Social Media Branding", "Computer Programming", "Entrepreneurship", "SRHR"] }
  ];

  const categoryItems = ['Social Media Branding', 'Computer Programming', 'Entrepreneurship', 'SRHR', 'Team Management'];

  // ===== FORM COMPONENTS =====
  const ApplyForm = () => (
    <form className="space-y-5">
      {['Full Name', 'Email', 'Expertise', 'LinkedIn Profile'].map((field, i) => (
        <div key={i}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{field}</label>
          <input className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500" />
        </div>
      ))}
      <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">Submit Application</button>
    </form>
  );

  const LoginForm = () => (
    <form className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input type="email" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input type="password" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500" />
      </div>
      <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">Sign In</button>
    </form>
  );

  const AdminForm = () => (
    <form className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
        <input className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input type="password" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">2FA Code</label>
        <input className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500" />
      </div>
      <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">Authenticate</button>
    </form>
  );

  const AboutContent = () => (
    <div className="space-y-5">
      <p className="text-gray-700">CohortLMS is a structured cohort-based learning platform for real-world impact across Africa.</p>
      <div className="bg-gray-50 p-5 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">Our Mission</h4>
        <p className="text-sm text-gray-600">Making quality education accessible through collaborative cohort-based learning.</p>
      </div>
    </div>
  );

  const ContactContent = () => (
    <div className="space-y-5">
      <p className="text-gray-700">Reach out to our team with any questions.</p>
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-gray-500">Email</p>
          <p className="text-gray-900">support@cohortlms.com</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Phone</p>
          <p className="text-gray-900">+250 788 123 456</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Address</p>
          <p className="text-gray-900">KG 7 Ave, Kigali, Rwanda</p>
        </div>
      </div>
    </div>
  );

  const PrivacyContent = () => (
    <div className="space-y-4">
      <p className="text-gray-700">Your privacy is important to us.</p>
      <div>
        <h4 className="font-semibold text-gray-900">Data Collection</h4>
        <p className="text-sm text-gray-600">We collect name, email, course progress, and payment information.</p>
      </div>
      <div>
        <h4 className="font-semibold text-gray-900">Data Usage</h4>
        <p className="text-sm text-gray-600">Your data is used to personalize learning and improve our platform.</p>
      </div>
      <div>
        <h4 className="font-semibold text-gray-900">Security</h4>
        <p className="text-sm text-gray-600">All personal information is encrypted and securely stored.</p>
      </div>
    </div>
  );

  // ===== MODALS OBJECT =====
  const Modals = {
    lightning: {
      title: "Lightning Lessons",
      content: (
        <div className="space-y-4">
          {courses.map(c => (
            <div key={c.id} className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm hover:shadow-md">
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">{c.name}</span>
              <h4 className="text-gray-900 font-semibold text-lg mt-2">{c.instructor.name}</h4>
              <p className="text-gray-600 text-sm">Workshop · {c.duration}</p>
            </div>
          ))}
        </div>
      )
    },
    cohortDetail: selectedCohort && {
      title: `${selectedCohort.name} Cohort`,
      content: (
        <div className="space-y-5">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Status</span>
              <span className={`text-xs px-2 py-1 rounded ${
                selectedCohort.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {selectedCohort.status === 'open' ? 'Open for Enrollment' : 'Coming Soon'}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Start Date</p>
              <p className="font-medium text-gray-900">{selectedCohort.startDate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">End Date</p>
              <p className="font-medium text-gray-900">{selectedCohort.endDate}</p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <p className="text-xs text-gray-500 mb-1">Enrollment Period</p>
            <p className="text-sm text-gray-900">{selectedCohort.enrollmentOpen} - {selectedCohort.enrollmentClose}</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(selectedCohort.enrolled/selectedCohort.capacity)*100}%` }} />
            </div>
            <p className="text-xs text-gray-500 mt-1">{selectedCohort.enrolled}/{selectedCohort.capacity} enrolled</p>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 mb-2">Available Courses</p>
            <div className="flex flex-wrap gap-2">
              {selectedCohort.courses.map((course, i) => (
                <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{course}</span>
              ))}
            </div>
          </div>
          
          {selectedCohort.status === 'open' ? (
            <button 
              onClick={() => {
                const course = courses.find(c => c.name === selectedCohort.courses[0]);
                if (course) {
                  setSelectedCourse(course);
                  setEnrollmentStep(1);
                  setActiveModal('enrollment');
                }
              }}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              Enroll Now
            </button>
          ) : (
            <div className="space-y-3">
              <input 
                type="email" 
                placeholder="Enter email for notification" 
                value={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
              />
              <button 
                onClick={() => { setActiveModal('notifyConfirm'); }}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
              >
                Notify Me When Open
              </button>
            </div>
          )}
        </div>
      )
    },
    notifyConfirm: {
      title: "Notification Set",
      content: (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h4 className="text-xl font-bold text-gray-900">You're on the list!</h4>
          <p className="text-gray-600">We'll email {notifyEmail || 'you'} when enrollment opens.</p>
          <button 
            onClick={() => setActiveModal('cohorts')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Back to Cohorts
          </button>
        </div>
      )
    },
    cohorts: {
      title: "Open Cohorts",
      content: (
        <div className="space-y-4">
          {cohorts.map(cohort => (
            <div key={cohort.id} className="border border-gray-200 rounded-lg p-5 hover:border-blue-300">
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-gray-900 font-semibold">{cohort.name} Cohort</h4>
                <span className={`text-xs px-2 py-1 rounded ${
                  cohort.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {cohort.status === 'open' ? 'Open' : 'Coming Soon'}
                </span>
              </div>
              <p className="text-sm text-gray-600">{cohort.startDate} - {cohort.endDate}</p>
              <p className="text-sm text-gray-600 mt-1">{cohort.enrolled}/{cohort.capacity} enrolled</p>
              <button 
                onClick={() => { setSelectedCohort(cohort); setActiveModal('cohortDetail'); }}
                className="mt-3 text-blue-600 text-sm font-medium hover:text-blue-700"
              >
                {cohort.status === 'open' ? 'View Details →' : 'Notify Me →'}
              </button>
            </div>
          ))}
        </div>
      )
    },
    enrollment: selectedCourse && {
      title: "Enroll in " + selectedCourse.name,
      content: enrollmentStep === 1 ? (
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-900">Course</span>
              <span className="text-blue-600 font-bold">${selectedCourse.price}</span>
            </div>
            <p className="text-sm text-gray-600">{selectedCourse.name}</p>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center font-semibold">
              <span>Total</span>
              <span className="text-blue-600">${selectedCourse.price}</span>
            </div>
          </div>
          <button onClick={() => setEnrollmentStep(2)} className="w-full bg-blue-600 text-white py-3 rounded-lg">Proceed to Payment</button>
          <button onClick={() => setActiveModal('course')} className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg">Back</button>
        </div>
      ) : enrollmentStep === 2 ? (
        <div className="space-y-6">
          <div className="space-y-2">
            {['card', 'mobile'].map(method => (
              <label key={method} className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300">
                <input type="radio" name="payment" value={method} checked={paymentMethod === method} 
                       onChange={() => setPaymentMethod(method)} className="mr-3" />
                {method === 'card' ? <CreditCard className="w-5 h-5 text-blue-600 mr-3" /> : 
                 <span className="w-5 h-5 bg-blue-600 rounded-full mr-3 flex items-center justify-center text-white text-xs">📱</span>}
                <div>
                  <p className="font-medium text-gray-900">{method === 'card' ? 'Credit / Debit Card' : 'Mobile Money'}</p>
                  <p className="text-xs text-gray-500">{method === 'card' ? 'Pay securely with card' : 'MTN, Airtel, M-Pesa'}</p>
                </div>
              </label>
            ))}
          </div>
          
          {paymentMethod === 'card' ? (
            <div className="space-y-3">
              <input placeholder="Card Number" className="w-full border border-gray-300 rounded-lg px-4 py-3" />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="MM/YY" className="border border-gray-300 rounded-lg px-4 py-3" />
                <input placeholder="CVC" className="border border-gray-300 rounded-lg px-4 py-3" />
              </div>
              <input placeholder="Cardholder Name" className="w-full border border-gray-300 rounded-lg px-4 py-3" />
            </div>
          ) : (
            <div className="space-y-3">
              <select className="w-full border border-gray-300 rounded-lg px-4 py-3">
                <option>MTN Mobile Money</option>
                <option>Airtel Money</option>
                <option>M-Pesa</option>
              </select>
              <input placeholder="Phone Number" className="w-full border border-gray-300 rounded-lg px-4 py-3" />
            </div>
          )}
          
          <button onClick={() => setEnrollmentStep(3)} className="w-full bg-blue-600 text-white py-3 rounded-lg">Complete Payment</button>
        </div>
      ) : (
        <div className="space-y-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h4 className="text-xl font-bold text-gray-900">Enrollment Successful!</h4>
          <p className="text-gray-600">You are now enrolled in {selectedCourse.name}.</p>
          <button onClick={() => { setActiveModal(null); setEnrollmentStep(1); }} 
                  className="w-full bg-blue-600 text-white py-3 rounded-lg">Go to Dashboard</button>
        </div>
      )
    },
    course: selectedCourse && {
      title: selectedCourse.name,
      content: (
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${selectedCourse.color} mb-3`}>
              {selectedCourse.level}
            </span>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedCourse.name}</h2>
            <p className="text-gray-600 text-sm">{selectedCourse.description}</p>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg">
            <p className="text-sm font-medium text-gray-500">INSTRUCTOR</p>
            <p className="text-gray-900 font-semibold">{selectedCourse.instructor.name}</p>
            <p className="text-sm text-gray-600">{selectedCourse.instructor.title} · {selectedCourse.instructor.company}</p>
            <p className="text-sm text-gray-700 mt-2 pt-2 border-t border-gray-200">{selectedCourse.instructor.bio}</p>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Clock, label: 'Duration', value: selectedCourse.duration },
              { icon: BookOpen, label: 'Lessons', value: selectedCourse.lessons },
              { icon: Star, label: 'Rating', value: selectedCourse.rating }
            ].map((stat, i) => (
              <div key={i} className="bg-gray-50 p-3 rounded-lg">
                <stat.icon className="w-4 h-4 text-blue-600 mb-1" />
                <p className="text-xs text-gray-500">{stat.label}</p>
                <p className="text-sm font-medium text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">ABOUT THIS COURSE</p>
            <p className="text-sm text-gray-700 leading-relaxed">{selectedCourse.longDescription}</p>
            <p className="text-xs text-gray-500 mt-3">{selectedCourse.students.toLocaleString()} students enrolled</p>
          </div>
          
          <div className="flex gap-3 pt-2">
            <button onClick={() => { setEnrollmentStep(1); setActiveModal('enrollment'); }}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
              Enroll Now · ${selectedCourse.price}
            </button>
            <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200">
              Watch Preview
            </button>
          </div>
        </div>
      )
    },
    apply: { title: "Apply to Teach", content: <ApplyForm /> },
    login: { title: "Welcome Back", content: <LoginForm /> },
    admin: { title: "Admin Access", content: <AdminForm /> },
    about: { title: "About CohortLMS", content: <AboutContent /> },
    contact: { title: "Contact Us", content: <ContactContent /> },
    privacy: { title: "Privacy Policy", content: <PrivacyContent /> }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Images */}
      <div className="fixed inset-0 -z-10">
        {bgImages.map((img, i) => (
          <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === bgIndex ? 'opacity-100' : 'opacity-0'}`}
               style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        ))}
        <div className="absolute inset-0 bg-white/10" />
      </div>

      {/* Header - WITH YOUR ORIGINAL LOGO */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/70 backdrop-blur-xl shadow-lg border-b border-white/30' : 'bg-white/40 backdrop-blur-md border-b border-white/20'
      }`}>
        <div className="container mx-auto flex items-center justify-between py-3 px-6 max-w-7xl">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-center group-hover:bg-white/90 transition">
              <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
                <circle cx="14" cy="10" r="5" fill="#4F46E5" />
                <circle cx="26" cy="10" r="5" fill="#2563EB" />
                <circle cx="20" cy="6" r="5" fill="#06B6D4" />
                <path d="M4 28 Q20 18 36 28" stroke="#4F46E5" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M6 33 Q20 23 34 33" stroke="#2563EB" strokeWidth="2" fill="none" strokeLinecap="round" />
                <path d="M9 38 Q20 30 31 38" stroke="#06B6D4" strokeWidth="1.5" fill="none" strokeLinecap="round" />
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

        {/* Mobile Menu */}
        {mobileNavOpen && (
          <div className="lg:hidden bg-white/80 backdrop-blur-xl border-t border-white/20">
            <div className="container mx-auto px-6 py-4">
              <button onClick={() => { setActiveModal('lightning'); setMobileNavOpen(false); }} 
                      className="block w-full text-left text-gray-700 py-3 border-b border-white/20 hover:text-gray-900">
                Lightning Lessons
              </button>
              <button onClick={() => { setActiveModal('apply'); setMobileNavOpen(false); }} 
                      className="block w-full text-left text-gray-700 py-3 border-b border-white/20 hover:text-gray-900">
                Apply to teach
              </button>
              <button onClick={() => { setActiveModal('admin'); setMobileNavOpen(false); }} 
                      className="block w-full text-left text-gray-700 py-3 border-b border-white/20 hover:text-gray-900">
                Admin
              </button>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {categoryItems.map((item, i) => (
                  <button key={item} onClick={() => { setSelectedCourse(courses[i]); setActiveModal('course'); setMobileNavOpen(false); }}
                          className="text-gray-700 py-2 text-center bg-white/30 backdrop-blur-sm rounded-lg text-sm hover:bg-white/50">
                    {item}
                  </button>
                ))}
              </div>
              <button onClick={() => { setActiveModal('login'); setMobileNavOpen(false); }}
                      className="w-full bg-blue-600/90 backdrop-blur-sm text-white px-4 py-3 rounded-lg text-center mt-4 font-medium border border-white/30">
                Log In
              </button>
            </div>
          </div>
        )}
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

        {/* Courses Section */}
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
                        className="bg-white/20 backdrop-blur-xl p-6 rounded-lg text-left hover:bg-white/30 transition border border-white/30 shadow-xl group">
                  <div className={`w-12 h-12 rounded-full ${course.color} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition`}>
                    <course.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-gray-900 font-bold mb-1 drop-shadow">{course.name}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">{course.duration}</span>
                    <span className="text-xs font-medium text-blue-600 group-hover:underline">Learn more →</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Programs Section - REMOVED "Learn more" buttons */}
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
                <p className="text-gray-700 mb-4 font-medium drop-shadow">Social Media Branding, Computer Programming, Entrepreneurship, and SRHR with team collaboration</p>
              </div>
              <div className="bg-white/20 backdrop-blur-xl p-8 rounded-lg border border-white/30 shadow-xl">
                <Award className="w-12 h-12 text-blue-600 mb-4 drop-shadow" />
                <h3 className="text-xl font-bold text-gray-900 mb-2 drop-shadow">Team Level</h3>
                <p className="text-gray-700 mb-4 font-medium drop-shadow">Advanced Team Management for organizational leadership</p>
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

      {/* Footer */}
      <footer className="bg-gray-900/90 backdrop-blur-sm text-gray-400 py-12 border-t border-white/10">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 ml-0 lg:ml-16">
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

            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Levels</h4>
              <ul className="space-y-2 text-xs text-gray-500">
                <li><span className="text-gray-500">Individual</span></li>
                <li><span className="text-gray-500">Group</span></li>
                <li><span className="text-gray-500">Team</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4 text-sm">Company</h4>
              <ul className="space-y-2 text-xs text-gray-500">
                <li><button onClick={() => setActiveModal('about')} className="hover:text-white">About Us</button></li>
                <li><button onClick={() => setActiveModal('contact')} className="hover:text-white">Contact</button></li>
                <li><button onClick={() => setActiveModal('privacy')} className="hover:text-white">Privacy</button></li>
                <li><button onClick={() => setActiveModal('cohorts')} className="hover:text-white">Careers</button></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs text-gray-600">
            <p>Developed by Freddy Bijanja, IRADUKUNDA Boris & Olivier Nduwayesu</p>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {activeModal && Modals[activeModal] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex justify-between sticky top-0 bg-white">
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