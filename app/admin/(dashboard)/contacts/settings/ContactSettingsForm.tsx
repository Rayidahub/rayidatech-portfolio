'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  Save,
  Plus,
  Trash2,
  ExternalLink,
  Check,
  Loader2,
  ArrowLeft,
  HelpCircle,
  MessageCircle,
  Mail,
  Globe,
  Sparkles,
  Clock,
  MapPin,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import { updateContactSettingsAction } from '@/app/actions/contact-settings';
import type {
  ContactSettings,
  ContactFaq,
  ProcessStep,
  WorkingPrinciple,
  SocialLink,
} from '@/types/contact-settings';

interface ContactSettingsFormProps {
  initialSettings: ContactSettings;
}

export default function ContactSettingsForm({ initialSettings }: ContactSettingsFormProps) {
  const [settings, setSettings] = useState<ContactSettings>(initialSettings);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleInputChange = (field: keyof ContactSettings, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // --- Working Principles Handlers ---
  const handlePrincipleChange = (index: number, key: keyof WorkingPrinciple, val: string) => {
    setSettings((prev) => {
      const next = [...prev.principles];
      next[index] = { ...next[index], [key]: val };
      return { ...prev, principles: next };
    });
  };

  const handleAddPrinciple = () => {
    setSettings((prev) => ({
      ...prev,
      principles: [
        ...prev.principles,
        { title: 'New Principle', description: 'Brief description of your commitment.' },
      ],
    }));
  };

  const handleRemovePrinciple = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      principles: prev.principles.filter((_, i) => i !== index),
    }));
  };

  // --- Process Steps Handlers ---
  const handleStepChange = (index: number, key: keyof ProcessStep, val: string) => {
    setSettings((prev) => {
      const next = [...prev.process_steps];
      next[index] = { ...next[index], [key]: val };
      return { ...prev, process_steps: next };
    });
  };

  const handleAddStep = () => {
    setSettings((prev) => {
      const nextNum = (prev.process_steps.length + 1).toString().padStart(2, '0');
      return {
        ...prev,
        process_steps: [
          ...prev.process_steps,
          { step: nextNum, title: 'New Milestone', description: 'What occurs during this phase.' },
        ],
      };
    });
  };

  const handleRemoveStep = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      process_steps: prev.process_steps.filter((_, i) => i !== index),
    }));
  };

  // --- FAQ Handlers ---
  const handleFaqChange = (index: number, key: keyof ContactFaq, val: string) => {
    setSettings((prev) => {
      const next = [...prev.faqs];
      next[index] = { ...next[index], [key]: val };
      return { ...prev, faqs: next };
    });
  };

  const handleAddFaq = () => {
    setSettings((prev) => ({
      ...prev,
      faqs: [
        ...prev.faqs,
        {
          question: 'Frequently Asked Question Title?',
          answer: 'Provide a helpful, clear, and reassuring answer here.',
        },
      ],
    }));
  };

  const handleRemoveFaq = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  // --- Social Links Handlers ---
  const handleSocialChange = (index: number, key: keyof SocialLink, val: string) => {
    setSettings((prev) => {
      const next = [...prev.social_links];
      next[index] = { ...next[index], [key]: val };
      return { ...prev, social_links: next };
    });
  };

  const handleAddSocial = () => {
    setSettings((prev) => ({
      ...prev,
      social_links: [
        ...prev.social_links,
        { name: 'Platform', url: 'https://', handle: '@handle' },
      ],
    }));
  };

  const handleRemoveSocial = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      social_links: prev.social_links.filter((_, i) => i !== index),
    }));
  };

  // --- Form Submission ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('idle');

    startTransition(async () => {
      const result = await updateContactSettingsAction(settings);
      if (result.success) {
        setStatus('success');
        setStatusMessage('Contact page settings updated successfully!');
        setTimeout(() => setStatus('idle'), 4000);
      } else {
        setStatus('error');
        setStatusMessage(result.error || 'Failed to update contact settings.');
      }
    });
  };

  const inputClass =
    'w-full px-3.5 py-2.5 bg-[var(--ink)] border border-(--line) rounded-lg text-paper text-sm placeholder:text-mist-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all';

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-16">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-(--line)">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/contacts"
            className="p-2 rounded-lg border border-(--line) text-mist-2 hover:text-paper hover:bg-white/[0.04] transition-colors"
            title="Back to Contact Inquiries"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-semibold text-paper">Contact Page Content</h1>
            <p className="text-xs text-mist-2 mt-0.5">
              Customize text, channels, hours, FAQs, and roadmap shown on /contact.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-(--line) text-mist-1 hover:text-paper text-xs font-medium transition-colors"
          >
            <span>Live Preview</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary hover:bg-primary/90 text-paper text-sm font-medium transition-all shadow-md shadow-primary/20 disabled:opacity-60 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status Alert Banner */}
      {status === 'success' && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
          <Check className="w-4 h-4 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <HelpCircle className="w-4 h-4 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Section 1: Hero & Heading */}
      <div className="glass rounded-xl p-6 border border-(--line) space-y-5">
        <div className="flex items-center gap-2 text-paper font-semibold border-b border-(--line) pb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <h2 className="text-base font-display">Hero Header & Tagline</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-mist-1 mb-1">
              Top Badge Text
            </label>
            <input
              type="text"
              value={settings.badge_text}
              onChange={(e) => handleInputChange('badge_text', e.target.value)}
              className={inputClass}
              placeholder="Get In Touch"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-mist-1 mb-1">
              Headline Prefix
            </label>
            <input
              type="text"
              value={settings.headline_prefix}
              onChange={(e) => handleInputChange('headline_prefix', e.target.value)}
              className={inputClass}
              placeholder="Let's build something"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-mist-1 mb-1">
              Accent Highlight Word <span className="text-secondary">(Violet gradient)</span>
            </label>
            <input
              type="text"
              value={settings.headline_accent}
              onChange={(e) => handleInputChange('headline_accent', e.target.value)}
              className={inputClass}
              placeholder="exceptional"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-mist-1 mb-1">
              Headline Suffix
            </label>
            <input
              type="text"
              value={settings.headline_suffix}
              onChange={(e) => handleInputChange('headline_suffix', e.target.value)}
              className={inputClass}
              placeholder="together"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-mist-1 mb-1">
              Subheadline Description
            </label>
            <textarea
              rows={2}
              value={settings.subheadline}
              onChange={(e) => handleInputChange('subheadline', e.target.value)}
              className={`${inputClass} resize-none`}
              placeholder="Short intro paragraph describing what you offer..."
            />
          </div>
        </div>
      </div>

      {/* Section 2: Direct Channels & Instant Contact */}
      <div className="glass rounded-xl p-6 border border-(--line) space-y-5">
        <div className="flex items-center gap-2 text-paper font-semibold border-b border-(--line) pb-3">
          <MessageCircle className="w-4 h-4 text-secondary" />
          <h2 className="text-base font-display">Direct Channels (WhatsApp, Email & Web)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-mist-1 mb-1 flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp Number (Display)</span>
            </label>
            <input
              type="text"
              value={settings.whatsapp_number}
              onChange={(e) => handleInputChange('whatsapp_number', e.target.value)}
              className={inputClass}
              placeholder="+234 701 447 8376"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-mist-1 mb-1 flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp Direct Chat Link</span>
            </label>
            <input
              type="url"
              value={settings.whatsapp_url}
              onChange={(e) => handleInputChange('whatsapp_url', e.target.value)}
              className={inputClass}
              placeholder="https://wa.link/..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-mist-1 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-primary" />
              <span>Direct Email Address</span>
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={inputClass}
              placeholder="you@domain.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-mist-1 mb-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-primary" />
              <span>Agency Portal Website URL</span>
            </label>
            <input
              type="url"
              value={settings.website_url}
              onChange={(e) => handleInputChange('website_url', e.target.value)}
              className={inputClass}
              placeholder="https://rayidatech.name.ng"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Availability & Working Hours */}
      <div className="glass rounded-xl p-6 border border-(--line) space-y-5">
        <div className="flex items-center gap-2 text-paper font-semibold border-b border-(--line) pb-3">
          <Clock className="w-4 h-4 text-secondary" />
          <h2 className="text-base font-display">Operating Hours & Location</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-mist-1 mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-secondary" />
              <span>Working Hours Text</span>
            </label>
            <input
              type="text"
              value={settings.working_hours}
              onChange={(e) => handleInputChange('working_hours', e.target.value)}
              className={inputClass}
              placeholder="Mon — Sat, 9:00 AM — 6:00 PM (WAT / UTC+1)"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-mist-1 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-secondary" />
              <span>Location & Remote Notice</span>
            </label>
            <input
              type="text"
              value={settings.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className={inputClass}
              placeholder="Lagos, Nigeria • Operating Worldwide"
            />
          </div>
        </div>
      </div>

      {/* Section 4: Working Principles */}
      <div className="glass rounded-xl p-6 border border-(--line) space-y-4">
        <div className="flex items-center justify-between border-b border-(--line) pb-3">
          <div className="flex items-center gap-2 text-paper font-semibold">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <h2 className="text-base font-display">Working Principles (Trust Assurances)</h2>
          </div>
          <button
            type="button"
            onClick={handleAddPrinciple}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-secondary text-xs font-medium transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Principle</span>
          </button>
        </div>

        <div className="space-y-3">
          {settings.principles.map((principle, index) => (
            <div
              key={index}
              className="p-3.5 rounded-xl border border-(--line) bg-[var(--ink)]/40 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 w-full">
                <div>
                  <input
                    type="text"
                    value={principle.title}
                    onChange={(e) => handlePrincipleChange(index, 'title', e.target.value)}
                    className={inputClass}
                    placeholder="Principle Title"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={principle.description}
                    onChange={(e) => handlePrincipleChange(index, 'description', e.target.value)}
                    className={inputClass}
                    placeholder="Description text"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemovePrinciple(index)}
                className="p-2 text-mist-2 hover:text-red-400 rounded-lg hover:bg-red-400/10 transition-colors shrink-0"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Section 5: Collaboration Roadmap (Process Steps) */}
      <div className="glass rounded-xl p-6 border border-(--line) space-y-4">
        <div className="flex items-center justify-between border-b border-(--line) pb-3">
          <div className="flex items-center gap-2 text-paper font-semibold">
            <Layers className="w-4 h-4 text-secondary" />
            <h2 className="text-base font-display">Collaboration Roadmap (Process Steps)</h2>
          </div>
          <button
            type="button"
            onClick={handleAddStep}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-secondary text-xs font-medium transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Step</span>
          </button>
        </div>

        <div className="space-y-3">
          {settings.process_steps.map((step, index) => (
            <div
              key={index}
              className="p-4 rounded-xl border border-(--line) bg-[var(--ink)]/40 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between"
            >
              <div className="w-16 shrink-0">
                <input
                  type="text"
                  value={step.step}
                  onChange={(e) => handleStepChange(index, 'step', e.target.value)}
                  className={`${inputClass} text-center font-mono`}
                  placeholder="01"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 w-full">
                <input
                  type="text"
                  value={step.title}
                  onChange={(e) => handleStepChange(index, 'title', e.target.value)}
                  className={inputClass}
                  placeholder="Step Title"
                />
                <input
                  type="text"
                  value={step.description}
                  onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                  className={inputClass}
                  placeholder="Step description"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveStep(index)}
                className="p-2 text-mist-2 hover:text-red-400 rounded-lg hover:bg-red-400/10 transition-colors shrink-0"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Section 6: Frequently Asked Questions (FAQs) */}
      <div className="glass rounded-xl p-6 border border-(--line) space-y-4">
        <div className="flex items-center justify-between border-b border-(--line) pb-3">
          <div className="flex items-center gap-2 text-paper font-semibold">
            <HelpCircle className="w-4 h-4 text-primary" />
            <h2 className="text-base font-display">Frequently Asked Questions (FAQ)</h2>
          </div>
          <button
            type="button"
            onClick={handleAddFaq}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-secondary text-xs font-medium transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add FAQ</span>
          </button>
        </div>

        <div className="space-y-4">
          {settings.faqs.map((faq, index) => (
            <div
              key={index}
              className="p-4 rounded-xl border border-(--line) bg-[var(--ink)]/40 space-y-3 relative group"
            >
              <div className="flex items-center justify-between gap-3">
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                  className={`${inputClass} font-medium`}
                  placeholder="Question title..."
                />
                <button
                  type="button"
                  onClick={() => handleRemoveFaq(index)}
                  className="p-2 text-mist-2 hover:text-red-400 rounded-lg hover:bg-red-400/10 transition-colors shrink-0"
                  title="Remove FAQ"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <textarea
                rows={2}
                value={faq.answer}
                onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                className={`${inputClass} resize-none`}
                placeholder="Detailed answer..."
              />
            </div>
          ))}
        </div>
      </div>

      {/* Section 7: Social Links */}
      <div className="glass rounded-xl p-6 border border-(--line) space-y-4">
        <div className="flex items-center justify-between border-b border-(--line) pb-3">
          <div className="flex items-center gap-2 text-paper font-semibold">
            <Globe className="w-4 h-4 text-secondary" />
            <h2 className="text-base font-display">Social Profiles & Handles</h2>
          </div>
          <button
            type="button"
            onClick={handleAddSocial}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-secondary text-xs font-medium transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Social Link</span>
          </button>
        </div>

        <div className="space-y-3">
          {settings.social_links.map((link, index) => (
            <div
              key={index}
              className="p-3.5 rounded-xl border border-(--line) bg-[var(--ink)]/40 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 w-full">
                <input
                  type="text"
                  value={link.name}
                  onChange={(e) => handleSocialChange(index, 'name', e.target.value)}
                  className={inputClass}
                  placeholder="Platform (e.g. LinkedIn)"
                />
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => handleSocialChange(index, 'url', e.target.value)}
                  className={inputClass}
                  placeholder="https://..."
                />
                <input
                  type="text"
                  value={link.handle}
                  onChange={(e) => handleSocialChange(index, 'handle', e.target.value)}
                  className={inputClass}
                  placeholder="@handle"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveSocial(index)}
                className="p-2 text-mist-2 hover:text-red-400 rounded-lg hover:bg-red-400/10 transition-colors shrink-0"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Save Bar */}
      <div className="sticky bottom-4 z-20 glass-strong p-4 rounded-2xl border border-(--line-strong) flex items-center justify-between shadow-2xl">
        <p className="text-xs text-mist-2 hidden sm:block">
          Changes take effect immediately on your public contact page.
        </p>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-paper text-sm font-medium transition-all shadow-lg shadow-primary/25 disabled:opacity-60 cursor-pointer ml-auto"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
