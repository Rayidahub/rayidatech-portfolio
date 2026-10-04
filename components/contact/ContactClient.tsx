'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  Globe,
  Mail,
  MessageCircle,
  Send,
  CheckCircle,
  Check,
  Copy,
  Loader2,
  Clock,
  MapPin,
  ChevronDown,
  AlertCircle,
  Calendar,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import Container from '@/components/ui/Container';
import GlassCard from '@/components/ui/GlassCard';
import Reveal from '@/components/ui/Reveal';
import StatusPill from '@/components/ui/StatusPill';
import type { ContactSettings } from '@/types/contact-settings';

const projectTypes = [
  'Website Development',
  'UI/UX & Product Design',
  'AI Engineering',
  'Brand Identity',
  'Mobile App Design',
  'Tech Consultation',
  'Other',
];

const budgetRanges = [
  '< $1,000',
  '$1,000 — $3,000',
  '$3,000 — $5,000',
  '$5,000+',
  'Flexible',
];

interface ContactClientProps {
  settings: ContactSettings;
}

export default function ContactClient({ settings }: ContactClientProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    project_type: 'Website Development',
    budget: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectProjectType = (type: string) => {
    setFormData((prev) => ({ ...prev, project_type: type }));
  };

  const handleSelectBudget = (budget: string) => {
    setFormData((prev) => ({
      ...prev,
      budget: prev.budget === budget ? '' : budget,
    }));
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(settings.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const formattedMessage = formData.budget
      ? `[Estimated Budget: ${formData.budget}]\n\n${formData.message}`
      : formData.message;

    try {
      const { error } = await supabase.from('contacts').insert([
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || null,
          company: formData.company.trim() || null,
          project_type: formData.project_type || null,
          message: formattedMessage.trim(),
        },
      ]);

      if (error) {
        console.error('Supabase error:', error);
        setStatus('error');
        setErrorMessage(error.message || 'Failed to send message. Please try again.');
        return;
      }

      setStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        project_type: 'Website Development',
        budget: '',
        message: '',
      });
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again or reach out on WhatsApp.');
    }
  };

  const inputClasses =
    'w-full px-4 py-3 bg-[var(--glass-bg)] border border-(--line) rounded-xl text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm';

  const stepIcons = [Sparkles, Calendar, Zap];

  return (
    <main className="relative min-h-screen pt-28 pb-24 overflow-hidden">
      {/* Background Decorative Ambient Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-30 blur-[100px]"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(var(--primary-rgb), 0.35) 0%, rgba(var(--secondary-rgb), 0.15) 50%, transparent 75%)',
          }}
        />
        <div
          className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]"
          style={{
            background:
              'radial-gradient(circle, rgba(var(--secondary-rgb), 0.3) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-10 -left-40 w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]"
          style={{
            background:
              'radial-gradient(circle, rgba(var(--primary-rgb), 0.25) 0%, transparent 70%)',
          }}
        />
      </div>

      <Container size="default" className="relative z-10">
        {/* Header Hero */}
        <Reveal>
          <div className="max-w-3xl mb-12 md:mb-16">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono-tight uppercase tracking-wider bg-primary/10 border border-primary/20 text-secondary">
                {settings.badge_text || 'Get In Touch'}
              </span>
              <StatusPill />
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-paper mb-5 leading-[1.08]">
              {settings.headline_prefix}{' '}
              <span className="gradient-text">{settings.headline_accent}</span>{' '}
              {settings.headline_suffix}
            </h1>

            <p className="text-mist-1 text-base sm:text-lg leading-relaxed max-w-2xl">
              {settings.subheadline}
            </p>
          </div>
        </Reveal>

        {/* Main Content Grid: Form (7 cols) + Direct Channels (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Inquiry Form */}
          <Reveal className="lg:col-span-7">
            <GlassCard className="p-6 sm:p-8 md:p-10 border border-(--line)" hover={false}>
              {status === 'success' ? (
                <div className="py-10 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-secondary/10 border border-secondary/30 flex items-center justify-center text-secondary mb-5 shadow-lg shadow-secondary/10">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-paper mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-mist-1 text-sm max-w-md mb-8 leading-relaxed">
                    Thank you for reaching out. I have received your project details and will review
                    them promptly. Expect a thoughtful reply within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-(--line) bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-strong)] text-sm font-medium text-paper transition-all cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Step 1: Project Type Pills */}
                  <div>
                    <label className="block text-xs font-mono-tight uppercase tracking-wider text-mist-1 mb-2.5">
                      1. What service do you need? <span className="text-secondary">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {projectTypes.map((type) => {
                        const isSelected = formData.project_type === type;
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => handleSelectProjectType(type)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-primary text-white shadow-md shadow-primary/25 border border-primary'
                                : 'bg-[var(--glass-bg)] border border-(--line) text-mist-1 hover:text-paper hover:border-(--line-strong)'
                            }`}
                          >
                            {type}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 2: Personal & Contact Information */}
                  <div>
                    <label className="block text-xs font-mono-tight uppercase tracking-wider text-mist-1 mb-2.5">
                      2. Your details
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label htmlFor="name" className="block text-xs text-mist-2 mb-1">
                          Full Name <span className="text-secondary">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="e.g. Alex Morgan"
                          className={inputClasses}
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label htmlFor="email" className="block text-xs text-mist-2 mb-1">
                          Email Address <span className="text-secondary">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="alex@company.com"
                          className={inputClasses}
                        />
                      </div>

                      {/* Phone / WhatsApp */}
                      <div>
                        <label htmlFor="phone" className="block text-xs text-mist-2 mb-1">
                          Phone / WhatsApp <span className="text-mist-2">(Optional)</span>
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+1 (555) 000-0000"
                          className={inputClasses}
                        />
                      </div>

                      {/* Company */}
                      <div>
                        <label htmlFor="company" className="block text-xs text-mist-2 mb-1">
                          Company / Organization <span className="text-mist-2">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Studio, Startup, or Brand"
                          className={inputClasses}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Estimated Budget (Optional) */}
                  <div>
                    <label className="block text-xs font-mono-tight uppercase tracking-wider text-mist-1 mb-2.5">
                      3. Estimated budget <span className="text-mist-2">(Optional)</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {budgetRanges.map((budget) => {
                        const isSelected = formData.budget === budget;
                        return (
                          <button
                            key={budget}
                            type="button"
                            onClick={() => handleSelectBudget(budget)}
                            className={`px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-secondary/15 border border-secondary text-secondary font-medium'
                                : 'bg-[var(--glass-bg)] border border-(--line) text-mist-1 hover:text-paper hover:border-(--line-strong)'
                            }`}
                          >
                            {budget}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 4: Message */}
                  <div>
                    <label htmlFor="message" className="block text-xs font-mono-tight uppercase tracking-wider text-mist-1 mb-2">
                      4. Project Overview <span className="text-secondary">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Tell me about what you want to achieve, key features, reference links, and preferred launch timeline..."
                      className={`${inputClasses} resize-none`}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-glow w-full bg-primary hover:bg-primary/90 disabled:opacity-60 text-paper font-medium px-6 py-4 rounded-xl transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-primary/20 text-sm md:text-base cursor-pointer"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Sending Inquiry...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Project Brief</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Error Notification */}
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

                  <p className="text-center text-xs text-mist-2">
                    Strict privacy guaranteed. Your information is never shared or spammed.
                  </p>
                </form>
              )}
            </GlassCard>
          </Reveal>

          {/* Right Column: Direct Channels & Confidence */}
          <Reveal index={1} className="lg:col-span-5 space-y-6">
            {/* Quick Contact Card */}
            <GlassCard className="p-6 sm:p-7 border border-(--line)" hover={false}>
              <h3 className="font-display text-lg font-semibold text-paper mb-1">
                Direct Channels
              </h3>
              <p className="text-xs text-mist-1 mb-5">
                Prefer skipping the form? Reach out directly via your favorite platform:
              </p>

              <div className="space-y-3.5">
                {/* WhatsApp */}
                <div className="group relative flex items-center justify-between p-3.5 rounded-xl border bg-primary/5 border-primary/25 hover:border-primary/50 transition-all">
                  <a
                    href={settings.whatsapp_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3.5 flex-1 min-w-0"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 bg-primary/20 text-secondary">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-paper truncate">
                          {settings.whatsapp_number}
                        </span>
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      </div>
                      <p className="text-xs text-mist-2 truncate">Instant chat — typically replies in minutes</p>
                    </div>
                  </a>
                </div>

                {/* Email */}
                <div className="group relative flex items-center justify-between p-3.5 rounded-xl border bg-[var(--glass-bg)] border-(--line) hover:border-(--line-strong) transition-all">
                  <a
                    href={`mailto:${settings.email}`}
                    className="flex items-center gap-3.5 flex-1 min-w-0"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 bg-primary/10 text-primary">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-paper truncate">
                          {settings.email}
                        </span>
                      </div>
                      <p className="text-xs text-mist-2 truncate">Detailed inquiries & project proposals</p>
                    </div>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    title="Copy email address"
                    className="ml-2 p-2 rounded-lg text-mist-2 hover:text-paper hover:bg-primary/10 transition-colors shrink-0 cursor-pointer"
                    aria-label="Copy email address"
                  >
                    {copiedEmail ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Website */}
                {settings.website_url && (
                  <div className="group relative flex items-center justify-between p-3.5 rounded-xl border bg-[var(--glass-bg)] border-(--line) hover:border-(--line-strong) transition-all">
                    <a
                      href={settings.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3.5 flex-1 min-w-0"
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 bg-primary/10 text-primary">
                        <Globe className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-medium text-sm text-paper truncate">
                          {settings.website_url.replace(/^https?:\/\//, '')}
                        </span>
                        <p className="text-xs text-mist-2 truncate">Ecosystem & creative agency portal</p>
                      </div>
                    </a>
                  </div>
                )}
              </div>

              {/* Working Hours & Location */}
              <div className="mt-6 pt-5 border-t border-(--line) space-y-2.5">
                <div className="flex items-center gap-2.5 text-xs text-mist-1">
                  <Clock className="w-4 h-4 text-secondary shrink-0" />
                  <span>{settings.working_hours}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-mist-1">
                  <MapPin className="w-4 h-4 text-secondary shrink-0" />
                  <span>{settings.location}</span>
                </div>
              </div>
            </GlassCard>

            {/* Why Work With Me / Principles */}
            {settings.principles && settings.principles.length > 0 && (
              <GlassCard className="p-6 sm:p-7 border border-(--line)" hover={false}>
                <h3 className="font-display text-lg font-semibold text-paper mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-secondary" />
                  <span>Working Principles</span>
                </h3>

                <ul className="space-y-3 text-xs sm:text-sm text-mist-1">
                  {settings.principles.map((principle) => (
                    <li key={principle.title} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>
                        <strong className="text-paper font-medium">{principle.title}:</strong>{' '}
                        {principle.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            )}

            {/* Social Grid */}
            {settings.social_links && settings.social_links.length > 0 && (
              <GlassCard className="p-6 sm:p-7 border border-(--line)" hover={false}>
                <h3 className="font-display text-lg font-semibold text-paper mb-3">
                  Social Profiles
                </h3>
                <p className="text-xs text-mist-1 mb-4">
                  Explore design work, articles, and code across public channels:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {settings.social_links.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl border border-(--line) bg-[var(--glass-bg)] hover:border-primary/40 hover:bg-primary/5 transition-all group flex flex-col justify-between"
                    >
                      <span className="text-xs font-medium text-paper group-hover:text-secondary transition-colors">
                        {social.name}
                      </span>
                      <span className="text-[10px] text-mist-2 truncate">{social.handle}</span>
                    </a>
                  ))}
                </div>
              </GlassCard>
            )}
          </Reveal>
        </div>

        {/* Section: Process / What happens next */}
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

        {/* Section: Frequently Asked Questions */}
        {settings.faqs && settings.faqs.length > 0 && (
          <div className="mt-20 md:mt-28 max-w-3xl mx-auto">
            <Reveal>
              <div className="text-center mb-10">
                <span className="text-xs font-mono-tight uppercase tracking-wider text-secondary">
                  Got Questions?
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-paper mt-2">
                  Frequently Asked Inquiries
                </h2>
              </div>
            </Reveal>

            <Reveal index={1}>
              <div className="space-y-3">
                {settings.faqs.map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <GlassCard
                      key={faq.question}
                      hover={false}
                      className="border border-(--line) overflow-hidden transition-all duration-200"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                        aria-expanded={isOpen}
                      >
                        <span className="font-medium text-sm sm:text-base text-paper">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-mist-2 shrink-0 transition-transform duration-300 ${
                            isOpen ? 'rotate-180 text-secondary' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-mist-1 leading-relaxed border-t border-(--line)/50">
                          {faq.answer}
                        </div>
                      )}
                    </GlassCard>
                  );
                })}
              </div>
            </Reveal>
          </div>
        )}
      </Container>
    </main>
  );
}
