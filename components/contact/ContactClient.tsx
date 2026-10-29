'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  Mail,
  MapPin,
  Phone,
  MessageCircle,
  CheckCircle,
  Loader2,
  AlertCircle,
  Sparkles,
  Calendar,
  Zap,
  ChevronDown,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import Container from '@/components/ui/Container';
import GlassCard from '@/components/ui/GlassCard';
import Reveal from '@/components/ui/Reveal';
import type { ContactSettings } from '@/types/contact-settings';

// Lightweight brand SVGs for social media icons
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function TwitterXIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.532 1.03 1.532 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.934.359.309.678.919.678 1.852 0 1.338-.012 2.419-.012 2.747 0 .268.18.579.688.481C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10Z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

const subjectOptions = [
  'Website Development',
  'UI/UX & Product Design',
  'AI Engineering & Intelligent Systems',
  'Mobile App Development',
  'Brand Identity & Design System',
  'Technical Architecture & Consultation',
  'General Inquiry',
];

interface ContactClientProps {
  settings: ContactSettings;
}

export default function ContactClient({ settings }: ContactClientProps) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    project_type: 'Website Development',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const { error } = await supabase.from('contacts').insert([
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || null,
          company: formData.company.trim() || null,
          project_type: formData.project_type || null,
          message: formData.message.trim(),
        },
      ]);

      if (error) {
        console.error('Supabase error:', error);
        setStatus('error');
        setErrorMessage(error.message || 'Failed to send message. Please try again.');
        return;
      }

      setStatus('success');

      // Asynchronously trigger transactional email (admin alert to Zoho + client auto-reply)
      fetch('/api/email/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact',
          data: {
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim() || null,
            company: formData.company.trim() || null,
            project_type: formData.project_type || null,
            message: formData.message.trim(),
          },
        }),
      }).catch((err) => console.warn('[ContactClient] Email notify non-fatal error:', err));

      setFormData({
        name: '',
        company: '',
        phone: '',
        email: '',
        project_type: 'Website Development',
        message: '',
      });
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again or reach out on WhatsApp.');
    }
  };

  const inputClasses =
    'w-full px-4 py-3.5 bg-[#121226]/80 border border-(--line) rounded-xl text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm';

  const stepIcons = [Sparkles, Calendar, Zap];

  return (
    <main className="relative min-h-screen pb-24 overflow-hidden">
      {/* =========================================================================
          HERO BANNER (Matches Home Hero with edge-to-edge image & electric blue glow)
          ========================================================================= */}
      <section className="relative pt-32 pb-40 md:pt-40 md:pb-52 overflow-hidden bg-[#0a0e23]">
        {/* 1. Full-bleed background image with cinematic depth */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/hero.jpg"
            alt="Office & Technology background"
            className="w-full h-full object-cover object-center md:object-[center_35%] filter brightness-[0.42] contrast-[1.12] scale-105"
          />
        </div>

        {/* 2. Deep Blue & Sapphire Atmospheric Gradient Wash (Matches Hero Section) */}
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          aria-hidden="true"
          style={{
            background:
              'linear-gradient(135deg, rgba(10, 14, 35, 0.90) 0%, rgba(13, 27, 62, 0.82) 45%, rgba(0, 102, 255, 0.42) 80%, rgba(0, 209, 255, 0.35) 100%)',
          }}
        />

        {/* 2b. Electric Blue / Cyan Radial Ambient Glow (Hero Bloom Effect) */}
        <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden" aria-hidden="true">
          <div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[950px] h-[550px] rounded-full opacity-65 blur-[130px]"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(0, 209, 255, 0.45) 0%, rgba(0, 102, 255, 0.35) 40%, rgba(128, 0, 255, 0.25) 70%, transparent 85%)',
            }}
          />
          <div
            className="absolute -top-24 right-1/4 w-[480px] h-[480px] rounded-full opacity-45 blur-[100px]"
            style={{
              background: 'radial-gradient(circle, rgba(0, 209, 255, 0.5) 0%, transparent 65%)',
            }}
          />
        </div>

        {/* 2c. Seamless Bottom Fade into Page Ink (#1a1a2e) */}
        <div
          className="pointer-events-none absolute inset-0 z-[3]"
          aria-hidden="true"
          style={{
            background:
              'linear-gradient(to bottom, transparent 35%, rgba(26, 26, 46, 0.75) 75%, #1a1a2e 100%)',
          }}
        />

        {/* 2d. Subtle Technical Grid Pattern (Brand Texture from globals.css) */}
        <div
          className="bg-grid-pattern pointer-events-none absolute inset-0 z-[4] opacity-20"
          style={{
            maskImage: 'linear-gradient(to bottom, black 0%, transparent 90%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 90%)',
          }}
          aria-hidden="true"
        />

        <Container size="default" className="relative z-10 text-center">
          <Reveal>
            {/* Category / Topic Kicker (Hero Style) */}
            <p className="mb-3 inline-flex items-center gap-3 font-mono-tight text-xs uppercase tracking-[0.25em] text-secondary justify-center">
              <span className="h-px w-8 bg-secondary/50" aria-hidden="true" />
              Get In Touch
              <span className="h-px w-8 bg-secondary/50" aria-hidden="true" />
            </p>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-paper mb-3 drop-shadow-lg">
              Contact us
            </h1>

            {/* Signature Brand Accent Horizontal Bar */}
            <div
              className="mx-auto mb-5 h-1.5 w-20 rounded-full bg-gradient-to-r from-primary to-secondary"
              aria-hidden="true"
            />

            <p className="text-mist-1 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              Rayida Tech is ready to provide the right solution according to your needs
            </p>
          </Reveal>
        </Container>
      </section>

      {/* =========================================================================
          FLOATING UNIFIED CARD (Reference: White/Elevated Card overlapping the hero)
          ========================================================================= */}
      <Container size="default" className="relative z-20 -mt-24 md:-mt-32">
        <Reveal>
          <div className="bg-[#18182f]/95 backdrop-blur-2xl border border-(--line) rounded-3xl shadow-[0_24px_70px_-15px_rgba(0,0,0,0.7)] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* -----------------------------------------------------------------
                  LEFT COLUMN: Get In Touch (Details & Social Channels)
                  ----------------------------------------------------------------- */}
              <div className="lg:col-span-5 p-7 sm:p-9 md:p-12 lg:border-r border-(--line) flex flex-col justify-between space-y-8 bg-[#141428]/60">
                {/* Header & Bio */}
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-paper mb-3">
                    Get in touch
                  </h2>
                  <p className="text-mist-1 text-sm leading-relaxed">
                    Have an upcoming product, redesign, or engineering challenge? Tell us about your
                    goals and timeline below, or connect directly with our team.
                  </p>

                  {/* 3 Main Contact Info Rows with Circular Badges */}
                  <div className="mt-8 space-y-6">
                    {/* 1. Location / Head Office */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/25">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-paper text-sm sm:text-base">Head Office</h4>
                        <p className="text-xs sm:text-sm text-mist-1 mt-0.5 leading-relaxed">
                          {settings.location || 'Lagos, Nigeria • Operating Worldwide'}
                        </p>
                      </div>
                    </div>

                    {/* 2. Email Us */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/25">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-paper text-sm sm:text-base">Email Us</h4>
                        <a
                          href={`mailto:${settings.email || 'info@rayidatech.name.ng'}`}
                          className="text-xs sm:text-sm text-mist-1 hover:text-secondary transition-colors mt-0.5 block truncate"
                        >
                          {settings.email || 'info@rayidatech.name.ng'}
                        </a>
                        <a
                          href="mailto:contact@rayidatech.name.ng"
                          className="text-xs text-mist-2 hover:text-secondary transition-colors block truncate"
                        >
                          contact@rayidatech.name.ng
                        </a>
                      </div>
                    </div>

                    {/* 3. Call / WhatsApp Us */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/25">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-paper text-sm sm:text-base">Call Us</h4>
                        <p className="text-xs sm:text-sm text-mist-1 mt-0.5">
                          Phone : {settings.whatsapp_number || '+234 701 447 8376'}
                        </p>
                        <a
                          href={settings.whatsapp_url || 'https://wa.link/tlezg8'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-secondary hover:underline mt-1 font-medium"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Direct WhatsApp Chat</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Follow Our Social Media (Row of circular buttons) */}
                <div className="pt-6 border-t border-(--line)">
                  <h4 className="text-xs font-mono-tight uppercase tracking-wider text-mist-1 mb-3.5 font-semibold">
                    Follow our social media
                  </h4>
                  <div className="flex items-center gap-3">
                    {/* LinkedIn */}
                    <a
                      href="https://linkedin.com/in/rayida-tech"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary text-secondary hover:text-white transition-all duration-200 flex items-center justify-center border border-primary/25 shadow-sm"
                      title="LinkedIn"
                      aria-label="LinkedIn"
                    >
                      <LinkedInIcon className="w-4 h-4" />
                    </a>

                    {/* Instagram */}
                    <a
                      href="https://instagram.com/rayidatech"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary text-secondary hover:text-white transition-all duration-200 flex items-center justify-center border border-primary/25 shadow-sm"
                      title="Instagram"
                      aria-label="Instagram"
                    >
                      <InstagramIcon className="w-4 h-4" />
                    </a>

                    {/* Twitter / X */}
                    <a
                      href="https://x.com/rayidatech"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary text-secondary hover:text-white transition-all duration-200 flex items-center justify-center border border-primary/25 shadow-sm"
                      title="X (Twitter)"
                      aria-label="X (Twitter)"
                    >
                      <TwitterXIcon className="w-4 h-4" />
                    </a>

                    {/* GitHub */}
                    <a
                      href="https://github.com/Rayidahub"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary text-secondary hover:text-white transition-all duration-200 flex items-center justify-center border border-primary/25 shadow-sm"
                      title="GitHub"
                      aria-label="GitHub"
                    >
                      <GitHubIcon className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* -----------------------------------------------------------------
                  RIGHT COLUMN: Send Us a Message (Interactive Inquiry Form)
                  ----------------------------------------------------------------- */}
              <div className="lg:col-span-7 p-7 sm:p-9 md:p-12">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-paper mb-6">
                  Send us a message
                </h2>

                {status === 'success' ? (
                  <div className="py-12 text-center flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-secondary/10 border border-secondary/30 flex items-center justify-center text-secondary mb-5 shadow-lg shadow-secondary/15">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-paper mb-2">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-mist-1 text-sm max-w-md mb-8 leading-relaxed">
                      Thank you for reaching out. We have received your project details and will review
                      them promptly. Expect a thoughtful reply within 24 hours.
                    </p>
                    <button
                      type="button"
                      onClick={() => setStatus('idle')}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-(--line) bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-strong)] text-sm font-medium text-paper transition-all cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    {/* Row 1: Name & Company (2 columns) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-xs font-medium text-mist-1 mb-1.5">
                          Name <span className="text-secondary">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Name"
                          className={inputClasses}
                        />
                      </div>

                      <div>
                        <label htmlFor="company" className="block text-xs font-medium text-mist-1 mb-1.5">
                          Company
                        </label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Company"
                          className={inputClasses}
                        />
                      </div>
                    </div>

                    {/* Row 2: Phone & Email (2 columns) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="phone" className="block text-xs font-medium text-mist-1 mb-1.5">
                          Phone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Phone"
                          className={inputClasses}
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-xs font-medium text-mist-1 mb-1.5">
                          Email <span className="text-secondary">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="Email"
                          className={inputClasses}
                        />
                      </div>
                    </div>

                    {/* Row 3: Subject / Service Required */}
                    <div>
                      <label htmlFor="project_type" className="block text-xs font-medium text-mist-1 mb-1.5">
                        Subject <span className="text-secondary">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="project_type"
                          name="project_type"
                          value={formData.project_type}
                          onChange={handleChange}
                          className={`${inputClasses} appearance-none pr-10 cursor-pointer`}
                        >
                          {subjectOptions.map((opt) => (
                            <option key={opt} value={opt} className="bg-[#18182f] text-paper">
                              {opt}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-mist-2 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Row 4: Message */}
                    <div>
                      <label htmlFor="message" className="block text-xs font-medium text-mist-1 mb-1.5">
                        Message <span className="text-secondary">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={4}
                        placeholder="Message"
                        className={`${inputClasses} resize-none`}
                      />
                    </div>

                    {/* Error Banner */}
                    {status === 'error' && (
                      <div className="flex items-start gap-3 text-red-400 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-sm">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
                        <div>
                          <p className="font-medium text-paper">Submission failed</p>
                          <p className="text-xs text-mist-1 mt-0.5">
                            {errorMessage || 'Failed to submit. Please try again or reach out on WhatsApp.'}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Row 5: Full-width Solid Pill Button */}
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full py-4 rounded-full bg-primary hover:bg-primary/90 active:scale-[0.99] disabled:opacity-60 text-white font-medium text-sm sm:text-base transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25 cursor-pointer"
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <span>Send</span>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Reveal>

        {/* =========================================================================
            PROCESS ROADMAP (What happens after you reach out)
            ========================================================================= */}
        {settings.process_steps && settings.process_steps.length > 0 && (
          <div className="mt-20 md:mt-28">
            <Reveal>
              <div className="text-center max-w-xl mx-auto mb-12">
                <span className="text-xs font-mono-tight uppercase tracking-wider text-secondary">
                  The Collaboration Roadmap
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-paper mt-2">
                  What happens after you reach out?
                </h2>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {settings.process_steps.map((step, idx) => {
                const Icon = stepIcons[idx % stepIcons.length];
                return (
                  <Reveal key={step.step} index={idx}>
                    <GlassCard className="p-6 md:p-8 h-full border border-(--line) flex flex-col justify-between relative overflow-hidden" hover={true}>
                      <div>
                        <div className="flex items-center justify-between mb-6">
                          <span className="font-mono-tight text-xs font-semibold px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
                            STEP {step.step}
                          </span>
                          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                            <Icon className="w-5 h-5" />
                          </div>
                        </div>
                        <h3 className="font-display text-lg font-semibold text-paper mb-2">
                          {step.title}
                        </h3>
                        <p className="text-mist-1 text-sm leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </GlassCard>
                  </Reveal>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            FREQUENTLY ASKED QUESTIONS (Reference UI: 2-Column Accordion Layout)
            ========================================================================= */}
        {settings.faqs && settings.faqs.length > 0 && (
          <div className="mt-24 md:mt-32 pt-12 border-t border-(--line)/50">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
              {/* Left Column: Heading, Badge & Descriptive Text (Matches Reference Left Side) */}
              <div className="lg:col-span-5 lg:sticky lg:top-28">
                <Reveal>
                  {/* Reference Pill Badge */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-mono-tight uppercase tracking-wider mb-5">
                    <HelpCircle className="w-3.5 h-3.5 text-secondary" />
                    <span>Frequently asked questions</span>
                  </div>

                  {/* Reference Main Heading with Gradient Accent on 'questions' */}
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-paper leading-[1.15]">
                    Frequently asked{' '}
                    <span className="gradient-text block sm:inline">questions</span>
                  </h2>

                  {/* Reference Subtitle */}
                  <p className="text-mist-1 text-sm sm:text-base leading-relaxed mt-4 max-w-md">
                    Everything you need to know about working with Rayida Tech, project timelines,
                    deliverables, and payment terms. Can&apos;t find what you&apos;re looking for?
                  </p>

                  {/* Direct Contact Action */}
                  <div className="mt-8 pt-6 border-t border-(--line) flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 text-xs text-mist-2">
                    <span>Have an unlisted question?</span>
                    <a
                      href={settings.whatsapp_url || 'https://wa.link/tlezg8'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-secondary hover:text-white font-medium transition-colors cursor-pointer group"
                    >
                      <span>Ask directly on WhatsApp</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </a>
                  </div>
                </Reveal>
              </div>

              {/* Right Column: Accordion Cards with Circular Toggle Button (Matches Reference Right Side) */}
              <div className="lg:col-span-7">
                <Reveal index={1}>
                  <div className="space-y-3.5 sm:space-y-4">
                    {settings.faqs.map((faq, index) => {
                      const isOpen = openFaq === index;
                      return (
                        <div
                          key={faq.question}
                          onClick={() => setOpenFaq(isOpen ? null : index)}
                          className={`rounded-2xl transition-all duration-300 overflow-hidden cursor-pointer ${
                            isOpen
                              ? 'bg-[#181832]/95 border border-primary/45 shadow-[0_12px_36px_-12px_rgba(128,0,255,0.25)] p-5 sm:p-6'
                              : 'bg-[#141428]/70 hover:bg-[#181830]/80 border border-(--line) hover:border-(--line-strong) p-5 sm:p-6 group'
                          }`}
                        >
                          <div
                            className="w-full text-left flex items-center justify-between gap-4 select-none"
                            aria-expanded={isOpen}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setOpenFaq(isOpen ? null : index);
                              }
                            }}
                          >
                            <span
                              className={`font-display text-base sm:text-lg transition-colors leading-snug pr-2 ${
                                isOpen
                                  ? 'font-semibold text-paper'
                                  : 'font-medium text-paper group-hover:text-white'
                              }`}
                            >
                              {faq.question}
                            </span>

                            {/* Reference Circular Icon Toggle Button */}
                            <div
                              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                                isOpen
                                  ? 'bg-primary text-white shadow-md shadow-primary/35'
                                  : 'bg-primary/15 text-primary border border-primary/25 group-hover:bg-primary/25'
                              }`}
                              aria-hidden="true"
                            >
                              <ChevronDown
                                className={`w-4 h-4 transition-transform duration-300 ${
                                  isOpen ? 'rotate-180 text-white' : 'text-primary'
                                }`}
                              />
                            </div>
                          </div>

                          {/* Expandable answer */}
                          {isOpen && (
                            <div className="pt-3.5 sm:pt-4 text-xs sm:text-sm text-mist-1 leading-relaxed border-t border-(--line)/40 mt-3.5 sm:mt-4">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        )}
      </Container>
    </main>
  );
}
