'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  Save,
  ArrowLeft,
  ExternalLink,
  Check,
  Loader2,
  Sparkles,
  User,
  Mail,
  HelpCircle,
} from 'lucide-react';
import { updateBlogSettingsAction } from '@/app/actions/blog-settings';
import type { BlogSettings } from '@/types/blog-settings';

interface BlogSettingsFormProps {
  initialSettings: BlogSettings;
}

export default function BlogSettingsForm({ initialSettings }: BlogSettingsFormProps) {
  const [settings, setSettings] = useState<BlogSettings>(initialSettings);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleInputChange = (field: keyof BlogSettings, value: string) => {
    setSettings((prev: BlogSettings) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('idle');

    startTransition(async () => {
      const result = await updateBlogSettingsAction(settings);
      if (result.success) {
        setStatus('success');
        setStatusMessage('Blog page settings updated successfully!');
        setTimeout(() => setStatus('idle'), 4000);
      } else {
        setStatus('error');
        setStatusMessage(result.error || 'Failed to update blog settings.');
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
            href="/admin/blog"
            className="p-2 rounded-lg border border-(--line) text-mist-2 hover:text-paper hover:bg-white/[0.04] transition-colors"
            title="Back to Blog Articles"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-semibold text-paper">Blog Page Content</h1>
            <p className="text-xs text-mist-2 mt-0.5">
              Customize hero typography, author profile, and newsletter call-to-action on /blog.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/blog"
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

      {/* Status Alerts */}
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

      {/* Section 1: Hero Header & Headline */}
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
              placeholder="Insights & Perspectives"
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
              placeholder="Thoughts on Design, Tech &"
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
              placeholder="Growth"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-mist-1 mb-1">
              Headline Suffix (Optional)
            </label>
            <input
              type="text"
              value={settings.headline_suffix}
              onChange={(e) => handleInputChange('headline_suffix', e.target.value)}
              className={inputClass}
              placeholder="(Optional)"
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
              placeholder="Overview description for the blog page..."
            />
          </div>
        </div>
      </div>

      {/* Section 2: Author Bio & Persona */}
      <div className="glass rounded-xl p-6 border border-(--line) space-y-5">
        <div className="flex items-center gap-2 text-paper font-semibold border-b border-(--line) pb-3">
          <User className="w-4 h-4 text-secondary" />
          <h2 className="text-base font-display">Author Profile (Displayed on Articles)</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-mist-1 mb-1">Author Name</label>
            <input
              type="text"
              value={settings.author_name}
              onChange={(e) => handleInputChange('author_name', e.target.value)}
              className={inputClass}
              placeholder="Raymond Gaius"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-mist-1 mb-1">Author Title / Role</label>
            <input
              type="text"
              value={settings.author_role}
              onChange={(e) => handleInputChange('author_role', e.target.value)}
              className={inputClass}
              placeholder="Product Designer & AI Engineer"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-mist-1 mb-1">Author Bio</label>
            <textarea
              rows={2}
              value={settings.author_bio}
              onChange={(e) => handleInputChange('author_bio', e.target.value)}
              className={`${inputClass} resize-none`}
              placeholder="Short bio shown at the footer of each blog post..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-mist-1 mb-1">X (Twitter) Profile URL</label>
            <input
              type="url"
              value={settings.author_twitter}
              onChange={(e) => handleInputChange('author_twitter', e.target.value)}
              className={inputClass}
              placeholder="https://twitter.com/..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-mist-1 mb-1">GitHub Profile URL</label>
            <input
              type="url"
              value={settings.author_github}
              onChange={(e) => handleInputChange('author_github', e.target.value)}
              className={inputClass}
              placeholder="https://github.com/..."
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-mist-1 mb-1">LinkedIn Profile URL</label>
            <input
              type="url"
              value={settings.author_linkedin}
              onChange={(e) => handleInputChange('author_linkedin', e.target.value)}
              className={inputClass}
              placeholder="https://linkedin.com/in/..."
            />
          </div>
        </div>
      </div>

      {/* Section 3: Newsletter Callout */}
      <div className="glass rounded-xl p-6 border border-(--line) space-y-5">
        <div className="flex items-center gap-2 text-paper font-semibold border-b border-(--line) pb-3">
          <Mail className="w-4 h-4 text-primary" />
          <h2 className="text-base font-display">Newsletter Section Copy</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-mist-1 mb-1">Headline</label>
            <input
              type="text"
              value={settings.newsletter_headline}
              onChange={(e) => handleInputChange('newsletter_headline', e.target.value)}
              className={inputClass}
              placeholder="Stay in the loop"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-mist-1 mb-1">Description Subtext</label>
            <textarea
              rows={2}
              value={settings.newsletter_subheadline}
              onChange={(e) => handleInputChange('newsletter_subheadline', e.target.value)}
              className={`${inputClass} resize-none`}
              placeholder="Brief description about the newsletter..."
            />
          </div>
        </div>
      </div>

      {/* Bottom Floating Bar */}
      <div className="sticky bottom-4 z-20 glass-strong p-4 rounded-2xl border border-(--line-strong) flex items-center justify-between shadow-2xl">
        <p className="text-xs text-mist-2 hidden sm:block">
          Updates take effect immediately on your public blog page and article details.
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

