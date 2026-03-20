// app/contact/page.jsx  (or pages/contact.jsx)
// Requires: Tailwind CSS + lucide-react

"use client";
import { useState } from "react";
import {
  Mail,
  MapPin,
  Send,
  MessageCircle,
  Users,
  Handshake,
  ChevronRight,
  CheckCircle,
  Clock,
  Instagram,
  Twitter,
  Linkedin,
  Phone,
} from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────────

const contactReasons = [
  {
    icon: <Users className="w-5 h-5 text-blue-500" />,
    title: "Apply to a Cohort",
    description: "Interested in joining the next cohort? Start your application.",
    cta: "Go to Application",
    href: "/apply",
    bg: "bg-blue-50",
  },
  {
    icon: <Handshake className="w-5 h-5 text-emerald-500" />,
    title: "Partner With Us",
    description: "Organizations that share our mission are welcome to reach out.",
    cta: "Discuss Partnership",
    href: "#form",
    bg: "bg-emerald-50",
  },
  {
    icon: <MessageCircle className="w-5 h-5 text-violet-500" />,
    title: "General Enquiry",
    description: "Questions about the program, curriculum, or anything else.",
    cta: "Send a Message",
    href: "#form",
    bg: "bg-violet-50",
  },
];

const contactInfo = [
  {
    icon: <Mail className="w-4 h-4 text-blue-500" />,
    label: "Email",
    value: "hello@safed.africa",
    sub: "We respond within 48 hours",
  },
  {
    icon: <Phone className="w-4 h-4 text-blue-500" />,
    label: "Phone / WhatsApp",
    value: "+250 700 000 000",
    sub: "Mon – Fri, 9am – 5pm EAT",
  },
  {
    icon: <MapPin className="w-4 h-4 text-blue-500" />,
    label: "Location",
    value: "Kigali, Rwanda",
    sub: "East Africa",
  },
  {
    icon: <Clock className="w-4 h-4 text-blue-500" />,
    label: "Response Time",
    value: "Within 48 hours",
    sub: "Business days only",
  },
];

const socials = [
  { icon: <Instagram className="w-4 h-4" />, label: "Instagram", href: "#" },
  { icon: <Twitter className="w-4 h-4" />, label: "Twitter / X", href: "#" },
  { icon: <Linkedin className="w-4 h-4" />, label: "LinkedIn", href: "#" },
];

const subjectOptions = [
  "Application Enquiry",
  "Partnership Proposal",
  "Program Information",
  "Press & Media",
  "Technical Support",
  "Other",
];

// ── Reusable form primitives ──────────────────────────────────────────────────

function Label({ children, required }) {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {children}
      {required && <span className="text-blue-500 ml-0.5">*</span>}
    </label>
  );
}

function Input({ id, type = "text", placeholder, value, onChange, required }) {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
    />
  );
}

function Textarea({ id, placeholder, value, onChange, required, rows = 5 }) {
  return (
    <textarea
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      rows={rows}
      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
    />
  );
}

// ── Contact Form ──────────────────────────────────────────────────────────────

function ContactForm() {
  const [form, setForm] = useState({
    name: "", email: "", subject: "", message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 px-6 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-blue-500" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Message sent!</h3>
          <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
            Thanks, <span className="font-medium text-gray-700">{form.name}</span>. We&apos;ll
            get back to you at <span className="text-blue-600">{form.email}</span> within 48 hours.
          </p>
        </div>
        <button
          onClick={() => { setForm({ name: "", email: "", subject: "", message: "" }); setSubmitted(false); }}
          className="text-xs text-blue-500 hover:underline mt-2"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-6 sm:p-8">
      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label required>Full Name</Label>
          <Input
            id="name" placeholder="Your name"
            value={form.name} onChange={set("name")} required
          />
        </div>
        <div>
          <Label required>Email Address</Label>
          <Input
            id="email" type="email" placeholder="you@example.com"
            value={form.email} onChange={set("email")} required
          />
        </div>
      </div>

      {/* Subject */}
      <div>
        <Label required>Subject</Label>
        <select
          value={form.subject}
          onChange={set("subject")}
          required
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          <option value="" disabled>What is this about?</option>
          {subjectOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <Label required>Message</Label>
        <Textarea
          id="message"
          placeholder="Tell us what's on your mind. The more context you give, the better we can help."
          value={form.message} onChange={set("message")} required rows={5}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white text-sm font-semibold px-6 py-3.5 rounded-xl transition-all shadow-sm hover:shadow-md"
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Sending…
          </>
        ) : (
          <>
            Send Message
            <Send className="w-4 h-4" />
          </>
        )}
      </button>

      <p className="text-xs text-gray-400 text-center">
        We read every message personally and respond within 48 hours.
      </p>
    </form>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 sm:py-14 px-4">
      <div className="max-w-7xl pt-32 mx-auto space-y-8">

        {/* ── Page Header ── */}
        <div className="text-center space-y-2">
          <p className="text-xs font-bold tracking-widest text-blue-500 uppercase">
            Safe Education Platform
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Get in touch
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto">
            Whether you want to apply, partner, or just ask a question —
            we&apos;d love to hear from you.
          </p>
        </div>

        {/* ── Reason Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {contactReasons.map((r) => (
            <a
              key={r.title}
              href={r.href}
              className="group border border-gray-200 rounded-xl bg-white p-4 hover:border-blue-300 hover:shadow-md transition-all flex flex-col gap-3"
            >
              <div className={`w-9 h-9 rounded-lg ${r.bg} flex items-center justify-center shrink-0`}>
                {r.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800 mb-0.5">{r.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{r.description}</p>
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-blue-500 group-hover:gap-2 transition-all">
                {r.cta}
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </a>
          ))}
        </div>

        {/* ── Contact Info + Form ── */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.6fr] gap-4" id="form">

          {/* Left: info panel */}
          <div className="flex flex-col gap-4">

            {/* Info card */}
            <div className="border border-gray-200 rounded-xl bg-white p-5 space-y-5 flex-1">
              <div>
                <p className="text-xs font-bold tracking-widest text-blue-500 uppercase mb-1">
                  Contact Info
                </p>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Reach us through any of these channels.
                </p>
              </div>
              <div className="space-y-4">
                {contactInfo.map((c) => (
                  <div key={c.label} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                      {c.icon}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-700">{c.value}</p>
                      <p className="text-xs text-gray-400">{c.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social card */}
            <div className="border border-gray-200 rounded-xl bg-white p-5">
              <p className="text-xs font-bold tracking-widest text-blue-500 uppercase mb-3">
                Follow Us
              </p>
              <div className="flex flex-col gap-2">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className="flex items-center gap-2.5 text-xs text-gray-600 hover:text-blue-500 transition-colors group"
                  >
                    <div className="w-7 h-7 rounded-lg border border-gray-200 group-hover:border-blue-300 flex items-center justify-center transition-colors">
                      {s.icon}
                    </div>
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
            <div className="px-6 sm:px-8 pt-6 pb-4 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-900">Send us a message</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                We read every message and reply personally.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>

        {/* ── Bottom note ── */}
        <p className="text-xs text-gray-400 text-center leading-relaxed">
          Safe Education Platform is based in Kigali, Rwanda.
          Building for East Africa, open to the world.
        </p>

      </div>
    </div>
  );
}