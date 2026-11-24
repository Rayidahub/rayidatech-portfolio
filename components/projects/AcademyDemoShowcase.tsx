'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Users,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MapPin,
  Phone,
  MessageSquare,
  ArrowRight,
  ExternalLink,
  Smartphone,
  Monitor,
  Building,
  Award,
  ChevronRight,
  Clock,
  Send,
  X,
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import Reveal from '@/components/ui/Reveal';
import Container from '@/components/ui/Container';

const CRESTFIELD_WHATSAPP = '2348123456789';

function getCrestfieldWhatsAppUrl(text: string) {
  return `https://wa.me/${CRESTFIELD_WHATSAPP}?text=${encodeURIComponent(text)}`;
}

export default function AcademyDemoShowcase() {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [selectedProgram, setSelectedProgram] = useState<'early' | 'primary' | 'secondary'>('primary');
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    parentName: '',
    phone: '',
    childAge: '7',
    program: 'Primary School (Grades 1-6)',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      const msg = `Hello Crestfield Academy, I am ${inquiryForm.parentName}. I would like to inquire about enrolling in ${inquiryForm.program}. My phone is ${inquiryForm.phone}.`;
      window.open(getCrestfieldWhatsAppUrl(msg), '_blank');
      setInquiryModalOpen(false);
      setSubmitted(false);
    }, 1200);
  };

  return (
    <div className="space-y-12">
      {/* ── Demo Header & Device Preview Switcher Bar ── */}
      <div className="p-4 sm:p-5 rounded-2xl glass border border-(--line) flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-secondary/30 flex items-center justify-center text-secondary">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-semibold text-paper text-sm sm:text-base">
                Crestfield Academy Interactive Demo
              </span>
              <span className="text-[10px] font-mono-tight text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-medium">
                Live Interactive System
              </span>
            </div>
            <p className="text-xs text-mist-2">
              Demonstration prototype: Engineered for high-converting parent inquiries and admissions
            </p>
          </div>
        </div>

        {/* Viewport Form Factor Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-mist-2 font-mono-tight mr-1 hidden md:inline">
            Simulate Viewport:
          </span>
          <div className="inline-flex rounded-xl bg-paper/[0.04] p-1 border border-(--line)">
            <button
              type="button"
              onClick={() => setDeviceMode('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                deviceMode === 'desktop'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-mist-2 hover:text-paper'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setDeviceMode('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                deviceMode === 'mobile'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-mist-2 hover:text-paper'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Phone</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Simulated Interactive Website Stage ── */}
      <div className="flex justify-center">
        <div
          className={`transition-all duration-500 w-full ${
            deviceMode === 'mobile'
              ? 'max-w-sm rounded-[36px] border-4 border-slate-700 bg-slate-950 p-2 shadow-2xl'
              : 'max-w-5xl rounded-3xl border border-(--line) bg-slate-950/80 shadow-2xl overflow-hidden'
          }`}
        >
          {/* Inner Canvas */}
          <div className="rounded-2xl overflow-hidden bg-[#0c101d] text-slate-100 flex flex-col font-sans border border-slate-800">
            {/* 1. School Top Navbar */}
            <header className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20">
                  CA
                </div>
                <div>
                  <span className="font-bold text-xs sm:text-sm tracking-tight text-white block">
                    Crestfield Academy
                  </span>
                  <span className="text-[9px] text-blue-400 font-mono tracking-wider uppercase block">
                    Abuja &bull; Cambridge Accredited
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInquiryModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold transition-all shadow-sm flex items-center gap-1"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>Start Inquiry</span>
                </button>
              </div>
            </header>

            {/* 2. School Hero Section */}
            <div className="relative p-6 sm:p-10 bg-gradient-to-b from-blue-950/40 via-slate-900/30 to-transparent border-b border-slate-800 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-medium mb-4">
                <Sparkles className="w-3 h-3 text-blue-400" />
                <span>Admissions Now Open &bull; 2026/2027 Academic Session</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight max-w-2xl mb-3">
                A Better Foundation for a <span className="text-blue-400">Brighter Future</span>
              </h1>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl mb-6">
                Discover a nurturing learning environment designed to develop confident, curious, and capable leaders. Blending British Cambridge standards with modern STEM and leadership excellence.
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <button
                  type="button"
                  onClick={() => setInquiryModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-lg shadow-blue-600/30 flex items-center gap-1.5"
                >
                  <span>Book Campus Tour</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <a
                  href={getCrestfieldWhatsAppUrl("Hello Crestfield Academy, I saw your website and would like to ask about the 2026/2027 admission fees and requirements.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

              {/* Trust Metrics Bar */}
              <div className="grid grid-cols-3 gap-3 pt-8 mt-8 border-t border-slate-800/80 text-center">
                <div>
                  <p className="text-base sm:text-2xl font-bold text-white">99.4%</p>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">IGCSE Pass Rate</span>
                </div>
                <div>
                  <p className="text-base sm:text-2xl font-bold text-white">1:12</p>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Teacher Ratio</span>
                </div>
                <div>
                  <p className="text-base sm:text-2xl font-bold text-white">100%</p>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">STEM Integration</span>
                </div>
              </div>
            </div>

            {/* 3. Academic Programs Selector */}
            <div className="p-6 sm:p-8 border-b border-slate-800 bg-slate-900/20">
              <div className="text-center mb-6">
                <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400">
                  Comprehensive Pathways
                </span>
                <h2 className="text-lg sm:text-2xl font-bold text-white mt-1">
                  Our Learning Programs
                </h2>
              </div>

              {/* Program Selector Tabs */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex rounded-xl bg-slate-900 p-1 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSelectedProgram('early')}
                    className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedProgram === 'early'
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Early Years (Ages 2-5)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedProgram('primary')}
                    className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedProgram === 'primary'
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Primary (Grades 1-6)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedProgram('secondary')}
                    className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedProgram === 'secondary'
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Secondary (JSS-SSS)
                  </button>
                </div>
              </div>

              {/* Active Program Card */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="font-bold text-white text-base">
                    {selectedProgram === 'early' && 'Montessori & Early Foundations'}
                    {selectedProgram === 'primary' && 'Cambridge Primary Curriculum'}
                    {selectedProgram === 'secondary' && 'Senior Secondary & College Preparation'}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                    {selectedProgram === 'early' &&
                      'Nurturing confidence, communication skills, phonics, and emotional discovery through purposeful hands-on play.'}
                    {selectedProgram === 'primary' &&
                      'Structured mastery in Mathematics, English, Sciences, French, and early robotics coding with dedicated mentorship.'}
                    {selectedProgram === 'secondary' &&
                      'Intensive IGCSE & WAEC academic tracks combined with debate, sports excellence, leadership development, and career incubation.'}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="text-[10px] text-blue-300 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-900">
                      ✓ Dedicated Mentorship
                    </span>
                    <span className="text-[10px] text-blue-300 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-900">
                      ✓ Small Class Sizes
                    </span>
                    <span className="text-[10px] text-blue-300 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-900">
                      ✓ Modern Laboratories
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setInquiryModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shrink-0 transition-all shadow-sm"
                >
                  Inquire For This Level
                </button>
              </div>
            </div>

            {/* 4. The 3-Step Admission Funnel */}
            <div className="p-6 sm:p-8 border-b border-slate-800 bg-gradient-to-b from-transparent to-blue-950/20">
              <div className="text-center mb-6">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">
                  Zero Hassle Process
                </span>
                <h2 className="text-lg sm:text-2xl font-bold text-white mt-1">
                  Simple 3-Step Admission Process
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {/* Step 1 */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center font-mono">
                    01
                  </div>
                  <h4 className="font-bold text-white text-sm">Submit Quick Inquiry</h4>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Fill out our 2-minute online inquiry or connect directly via WhatsApp with your child’s current grade.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600/20 text-emerald-400 font-bold flex items-center justify-center font-mono">
                    02
                  </div>
                  <h4 className="font-bold text-white text-sm">Campus Tour &amp; Meet</h4>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Tour our purpose-built smart classrooms, meet our teaching faculty, and let your child take an informal assessment.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-600/20 text-purple-400 font-bold flex items-center justify-center font-mono">
                    03
                  </div>
                  <h4 className="font-bold text-white text-sm">Offer &amp; Welcome Kit</h4>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Receive official admission confirmation and parent onboarding packet with uniform and transport scheduling.
                  </p>
                </div>
              </div>
            </div>

            {/* 5. Contact & WhatsApp Footer Bar */}
            <div className="p-6 bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-400">
              <div>
                <p className="font-semibold text-white">Crestfield Academy Campus</p>
                <p className="text-[11px]">Plot 14, Ahmadu Bello Way, Wuse 2, Abuja, Nigeria</p>
                <p className="text-[11px] font-mono mt-0.5 text-blue-400">admissions@crestfield.name.ng &bull; +234 812 345 6789</p>
              </div>

              <a
                href={getCrestfieldWhatsAppUrl("Hello Crestfield Academy Admissions, I would like to book a physical school tour this week.")}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5 self-start sm:self-auto"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat With Admissions Officer</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Commercial Blueprint Breakdown ("Why This Converts") ── */}
      <GlassCard className="p-6 sm:p-8 border border-secondary/30 relative overflow-hidden bg-secondary/[0.02]">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-secondary/15 border border-secondary/30 flex items-center justify-center text-secondary shrink-0">
            <Award className="w-6 h-6" />
          </div>

          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-xl font-semibold text-paper">
                The Anatomy of a High-Converting Digital Upgrade
              </h3>
              <span className="text-[10px] font-mono-tight text-secondary bg-secondary/10 px-2 py-0.5 rounded-full border border-secondary/20 font-semibold">
                Engineered by Rayida Tech
              </span>
            </div>

            <p className="text-xs sm:text-sm text-mist-1 leading-relaxed">
              Most schools and service businesses rely solely on an Instagram page or a broken, outdated website where fees, curriculum, and admissions are impossible to find.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-(--line) space-y-1">
                <span className="text-[11px] font-mono-tight text-secondary font-bold uppercase">
                  1. Zero-Friction Inquiries
                </span>
                <p className="text-xs text-mist-2">
                  Parents tap one button to open a pre-filled WhatsApp conversation or 2-minute digital form.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-(--line) space-y-1">
                <span className="text-[11px] font-mono-tight text-secondary font-bold uppercase">
                  2. Clear Decision Funnel
                </span>
                <p className="text-xs text-mist-2">
                  The 3-step process eliminates intimidation and guides parents directly to booking a tour.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-(--line) space-y-1">
                <span className="text-[11px] font-mono-tight text-secondary font-bold uppercase">
                  3. Production Ready in 7–10 Days
                </span>
                <p className="text-xs text-mist-2">
                  Delivered under our <strong>Business Growth System (₦200,000)</strong> with 30 days of support.
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <a
                href={getCrestfieldWhatsAppUrl("Hello Raymond, I saw the Crestfield Academy demonstration. Can we build a similar system for my school / business?")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glow inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-primary/20"
              >
                <span>Deploy This System For Your Business (₦200,000)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <Link
                href="/services"
                className="px-5 py-2.5 rounded-full glass border border-(--line) text-paper text-xs sm:text-sm hover:text-secondary transition-colors"
              >
                View All Pricing Packages
              </Link>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* ── Interactive Inquiry Modal ── */}
      {inquiryModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
          onClick={() => setInquiryModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 text-white shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setInquiryModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xs">
                CA
              </div>
              <h3 className="font-bold text-base">Crestfield Academy Admissions</h3>
            </div>

            <p className="text-xs text-slate-400 mb-5">
              Submit your inquiry to receive our 2026/2027 fee schedule and book a private campus tour.
            </p>

            <form onSubmit={handleInquirySubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Parent / Guardian Name</label>
                <input
                  type="text"
                  required
                  value={inquiryForm.parentName}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, parentName: e.target.value })}
                  placeholder="e.g. Dr. Victoria Adebayo"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Phone Number (WhatsApp)</label>
                <input
                  type="tel"
                  required
                  value={inquiryForm.phone}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                  placeholder="e.g. 0812 345 6789"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Program of Interest</label>
                <select
                  value={inquiryForm.program}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, program: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
                >
                  <option>Early Years / Nursery (Ages 2-5)</option>
                  <option>Primary School (Grades 1-6)</option>
                  <option>Junior Secondary (JSS1 - JSS3)</option>
                  <option>Senior Secondary (SSS1 - SSS3)</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitted}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/30"
                >
                  {submitted ? (
                    <span>Opening WhatsApp Connection...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Inquiry &amp; Open WhatsApp</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
