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
  Image as ImageIcon,
  Music,
  Play,
  ExternalLink,
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

  return (
    <main className="min-h-screen pt-32 pb-20">
      <Container size="default">
        {/* Section 19: Hero */}
        <Reveal>
          <div className="mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-semibold mb-4">
              Get In <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-mist-1 text-lg max-w-2xl">
              Have a project in mind? Let&apos;s talk.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Section 20: Form */}
          <Reveal>
            <form onSubmit={handleSubmit} className="space-y-5">
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
                  className="w-full px-4 py-3 bg-[var(--glass-bg)] border border-(--line) rounded-lg text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary transition-colors"
                  placeholder="Your full name"
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
                  className="w-full px-4 py-3 bg-[var(--glass-bg)] border border-(--line) rounded-lg text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary transition-colors"
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
                  className="w-full px-4 py-3 bg-[var(--glass-bg)] border border-(--line) rounded-lg text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary transition-colors"
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
                  className="w-full px-4 py-3 bg-[var(--glass-bg)] border border-(--line) rounded-lg text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary transition-colors"
                  placeholder="Your company"
                />
              </div>

              {/* Project Type */}
              <div>
                <label htmlFor="project_type" className="block text-sm font-medium text-mist-1 mb-1.5">
                  Project Type <span className="text-secondary">*</span>
                </label>
                <select
                  id="project_type"
                  name="project_type"
                  value={formData.project_type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[var(--glass-bg)] border border-(--line) rounded-lg text-paper focus:outline-none focus:border-primary transition-colors appearance-none"
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
                  rows={4}
                  className="w-full px-4 py-3 bg-[var(--glass-bg)] border border-(--line) rounded-lg text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-primary hover:bg-primary/80 disabled:opacity-50 text-paper font-medium px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-2"
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

              {/* Success Message */}
              {status === 'success' && (
                <div className="flex items-center gap-2 text-secondary bg-secondary/10 p-4 rounded-lg">
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  <span>Message sent successfully! I&apos;ll get back to you soon.</span>
                </div>
              )}

              {/* Error Message */}
              {status === 'error' && (
                <div className="flex items-center gap-2 text-red-400 bg-red-500/10 p-4 rounded-lg">
                  <span className="shrink-0">&#10060;</span>
                  <span>{errorMessage || 'Failed to send message. Please try again.'}</span>
                </div>
              )}
            </form>
          </Reveal>

          {/* Sections 21-23: Direct Info, Social, Availability */}
          <Reveal index={1}>
            <GlassCard className="p-8">
              <h3 className="text-xl font-semibold mb-6 text-paper">
                Reach Me Directly
              </h3>

              <div className="space-y-6">
                {/* WhatsApp */}
                <a
                  href="https://wa.link/tlezg8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-mist-1 hover:text-secondary transition-colors group"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <MessageCircle className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-mist-2">WhatsApp</p>
                    <p className="font-medium text-paper">07014478376</p>
                  </div>
                </a>

                {/* Email */}
                <a
                  href="mailto:rayidatech@gmail.com"
                  className="flex items-center gap-4 text-mist-1 hover:text-secondary transition-colors group"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Mail className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-mist-2">Email</p>
                    <p className="font-medium text-paper">rayidatech@gmail.com</p>
                  </div>
                </a>

                {/* Website */}
                <a
                  href="https://rayidatech.wordpress.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-mist-1 hover:text-secondary transition-colors group"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Globe className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-mist-2">Website</p>
                    <p className="font-medium text-paper">rayidatech.wordpress.com</p>
                  </div>
                </a>
              </div>

              {/* Section 22: Social */}
              <div className="mt-8 pt-8 border-t border-(--line)">
                <p className="text-sm font-medium text-mist-1 mb-4">Follow Us</p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://www.linkedin.com/in/rayida-tech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Globe className="w-4 h-4 text-secondary" />
                  </a>
                  <a
                    href="https://instagram.com/rayidatech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                    aria-label="Instagram"
                  >
                    <ImageIcon className="w-4 h-4 text-secondary" />
                  </a>
                  <a
                    href="https://x.com/rayidatech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                    aria-label="X (Twitter)"
                  >
                    <MessageCircle className="w-4 h-4 text-secondary" />
                  </a>
                  <a
                    href="https://tiktok.com/@rayidatech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                    aria-label="TikTok"
                  >
                    <Music className="w-4 h-4 text-secondary" />
                  </a>
                  <a
                    href="https://youtube.com/@rayidatech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                    aria-label="YouTube"
                  >
                    <Play className="w-4 h-4 text-secondary" />
                  </a>
                </div>
              </div>

              {/* Section 23: Availability */}
              <div className="mt-8 pt-8 border-t border-(--line)">
                <StatusPill />
                <p className="text-xs text-mist-2 mt-2">
                  Reply within 24 hours.
                </p>
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </Container>
    </main>
  );
}
