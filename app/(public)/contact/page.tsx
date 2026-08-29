'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  Globe,
  Mail,
  MessageCircle,
  Send,
  CheckCircle,
  Loader2,
  Clock,
  MapPin,
  ChevronDown,
  AlertCircle,
} from 'lucide-react';
import Container from '@/components/ui/Container';
import GlassCard from '@/components/ui/GlassCard';
import Reveal from '@/components/ui/Reveal';
import StatusPill from '@/components/ui/StatusPill';

const projectTypes = [
  'Website Design',
  'UI/UX Design',
  'Product Design',
  'Brand Identity',
  'Graphic Design',
  'Tech Education',
  'Other',
];

const socialLinks = [
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/rayida-tech', handle: '@rayida-tech' },
  { name: 'Instagram', url: 'https://instagram.com/rayidatech', handle: '@rayidatech' },
  { name: 'X / Twitter', url: 'https://x.com/rayidatech', handle: '@rayidatech' },
  { name: 'TikTok', url: 'https://tiktok.com/@rayidatech', handle: '@rayidatech' },
  { name: 'YouTube', url: 'https://youtube.com/@rayidatech', handle: '@rayidatech' },
];

const contactMethods = [
  {
    label: 'WhatsApp',
    value: 'Chat on WhatsApp',
    href: 'https://wa.link/tlezg8',
    icon: MessageCircle,
  },
  {
    label: 'Email',
    value: 'rayidagaius@gmail.com',
    href: 'mailto:rayidagaius@gmail.com',
    icon: Mail,
  },
  {
    label: 'Website',
    value: 'rayidatech.name.ng',
    href: 'https://rayidatech.name.ng',
    icon: Globe,
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    project_type: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const { error } = await supabase.from('contacts').insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          company: formData.company || null,
          project_type: formData.project_type || null,
          message: formData.message,
        },
      ]);

      if (error) {
        console.error('Supabase error:', error);
        setStatus('error');
        setErrorMessage(error.message || 'Failed to send message. Please try again.');
        return;
      }

      setStatus('success');
      setFormData({ name: '', email: '', phone: '', company: '', project_type: '', message: '' });
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  const inputClassName =
    'w-full px-4 py-3 bg-[var(--glass-bg)] border border-(--line) rounded-xl text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all';

  return (
    <main className="relative min-h-screen pt-28 pb-24 overflow-hidden">
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] opacity-40"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(var(--primary-rgb), 0.18) 0%, rgba(var(--secondary-rgb), 0.08) 40%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-[40rem] h-[40rem] rounded-full opacity-20 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(var(--secondary-rgb), 0.22) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* Top gradient line */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full h-px opacity-30"
        style={{
          background:
            'linear-gradient(90deg, transparent, var(--primary), var(--secondary), transparent)',
        }}
        aria-hidden="true"
      />

      <Container size="default" className="relative z-10">
        {/* Hero */}
        <Reveal>
          <div className="max-w-2xl mb-14">
            <p className="font-mono-tight text-xs uppercase tracking-[0.25em] text-secondary mb-4">
              Contact
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.05] mb-5">
              Let&apos;s build something{' '}
              <span className="gradient-text">great</span> together
            </h1>
            <p className="text-mist-1 text-lg">
              Have a project in mind? Send the details and I&apos;ll get back to you within 24 hours.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Form */}
          <Reveal className="lg:col-span-3">
            <GlassCard className="p-6 md:p-8" hover={false}>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-mist-1 mb-1.5">
                      Full Name <span className="text-secondary">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={inputClassName}
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-mist-1 mb-1.5">
                      Email Address <span className="text-secondary">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={inputClassName}
                      placeholder="you@example.com"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-mist-1 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={inputClassName}
                      placeholder="+234 800 000 0000"
                    />
                  </div>

                  {/* Company */}
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-mist-1 mb-1.5">
                      Company <span className="text-mist-2">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className={inputClassName}
                      placeholder="Your company"
                    />
                  </div>
                </div>

                {/* Project Type */}
                <div>
                  <label htmlFor="project_type" className="block text-sm font-medium text-mist-1 mb-1.5">
                    Project Type <span className="text-secondary">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="project_type"
                      name="project_type"
                      value={formData.project_type}
                      onChange={handleChange}
                      required
                      className={`${inputClassName} appearance-none pr-10`}
                    >
                      <option value="" disabled className="bg-[var(--ink)]">
                        Select a project type
                      </option>
                      {projectTypes.map((type) => (
                        <option key={type} value={type} className="bg-[var(--ink)]">
                          {type}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-mist-2 pointer-events-none" />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-mist-1 mb-1.5">
                    Message <span className="text-secondary">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className={`${inputClassName} resize-none`}
                    placeholder="Tell me about your project, goals, and timeline..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-glow w-full bg-primary hover:bg-primary/90 disabled:opacity-60 text-paper font-medium px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>

                {/* Status Messages */}
                <div aria-live="polite">
                  {status === 'success' && (
                    <div className="flex items-start gap-3 text-secondary bg-secondary/10 border border-secondary/20 p-4 rounded-xl">
                      <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Message sent successfully!</p>
                        <p className="text-sm text-mist-1">I&apos;ll get back to you as soon as possible.</p>
                      </div>
                    </div>
                  )}

                  {status === 'error' && (
                    <div className="flex items-start gap-3 text-red-400 bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Something went wrong</p>
                        <p className="text-sm">{errorMessage || 'Failed to send message. Please try again.'}</p>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </GlassCard>
          </Reveal>

          {/* Contact Info */}
          <Reveal index={1} className="lg:col-span-2">
            <div className="space-y-6">
              <GlassCard className="p-6 md:p-8" hover={false}>
                <h3 className="font-display text-xl font-semibold mb-6 text-paper">
                  Reach me directly
                </h3>

                <div className="space-y-5">
                  {contactMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <a
                        key={method.label}
                        href={method.href}
                        target={method.href.startsWith('http') ? '_blank' : undefined}
                        rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="flex items-center gap-4 text-mist-1 hover:text-paper transition-colors group"
                      >
                        <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-105 transition-all">
                          <Icon className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                          <p className="text-xs text-mist-2 font-mono-tight uppercase tracking-wider">
                            {method.label}
                          </p>
                          <p className="font-medium text-paper">{method.value}</p>
                        </div>
                      </a>
                    );
                  })}
                </div>

                {/* Availability */}
                <div className="mt-8 pt-6 border-t border-(--line)">
                  <StatusPill />
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-mist-1">
                      <Clock className="w-4 h-4 text-secondary" />
                      <span>Reply within 24 hours</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-mist-1">
                      <MapPin className="w-4 h-4 text-secondary" />
                      <span>Remote / Worldwide</span>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Social Links */}
              <GlassCard className="p-6 md:p-8" hover={false}>
                <h3 className="font-display text-lg font-semibold mb-4 text-paper">
                  Follow along
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {socialLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between px-4 py-3 rounded-xl border border-(--line) bg-[var(--glass-bg)] hover:border-(--line-strong) hover:bg-[var(--glass-bg-strong)] transition-all"
                    >
                      <div>
                        <p className="text-sm font-medium text-paper group-hover:text-secondary transition-colors">
                          {link.name}
                        </p>
                        <p className="text-xs text-mist-2">{link.handle}</p>
                      </div>
                      <svg
                        className="w-4 h-4 text-mist-2 group-hover:text-secondary transition-colors"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 17L17 7M17 7H7M17 7v10"
                        />
                      </svg>
                    </a>
                  ))}
                </div>
              </GlassCard>
            </div>
          </Reveal>
        </div>
      </Container>
    </main>
  );
}
