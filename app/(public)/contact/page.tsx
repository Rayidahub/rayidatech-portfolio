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

  return (
    <main>
      <Container size="default">
        {/* Hero */}
        <Reveal>
          <div>
            <p>
              Contact
            </p>
            <h1>
              Let&apos;s build something{' '}
              <span>great</span> together
            </h1>
            <p>
              Have a project in mind? Send the details and I&apos;ll get back to you within 24 hours.
            </p>
          </div>
        </Reveal>

        <div>
          {/* Form */}
          <Reveal>
            <GlassCard hover={false}>
              <form onSubmit={handleSubmit}>
                <div>
                  {/* Full Name */}
                  <div>
                    <label htmlFor="name">
                      Full Name <span>*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label htmlFor="email">
                      Email Address <span>*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label htmlFor="phone">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+234 800 000 0000"
                    />
                  </div>

                  {/* Company */}
                  <div>
                    <label htmlFor="company">
                      Company <span>(Optional)</span>
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Your company"
                    />
                  </div>
                </div>

                {/* Project Type */}
                <div>
                  <label htmlFor="project_type">
                    Project Type <span>*</span>
                  </label>
                  <div>
                    <select
                      id="project_type"
                      name="project_type"
                      value={formData.project_type}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>
                        Select a project type
                      </option>
                      {projectTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <ChevronDown />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message">
                    Message <span>*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell me about your project, goals, and timeline..."
                  />
                </div>

                {/* Submit Button */}
                <button type="submit" disabled={status === 'loading'}>
                  {status === 'loading' ? (
                    <>
                      <Loader2 />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send />
                      Send Message
                    </>
                  )}
                </button>

                {/* Status Messages */}
                <div aria-live="polite">
                  {status === 'success' && (
                    <div>
                      <CheckCircle />
                      <div>
                        <p>Message sent successfully!</p>
                        <p>I&apos;ll get back to you as soon as possible.</p>
                      </div>
                    </div>
                  )}

                  {status === 'error' && (
                    <div>
                      <AlertCircle />
                      <div>
                        <p>Something went wrong</p>
                        <p>{errorMessage || 'Failed to send message. Please try again.'}</p>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </GlassCard>
          </Reveal>

          {/* Contact Info */}
          <Reveal index={1}>
            <div>
              <GlassCard hover={false}>
                <h3>
                  Reach me directly
                </h3>

                <div>
                  {contactMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <a
                        key={method.label}
                        href={method.href}
                        target={method.href.startsWith('http') ? '_blank' : undefined}
                        rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        <div>
                          <Icon />
                        </div>
                        <div>
                          <p>
                            {method.label}
                          </p>
                          <p>{method.value}</p>
                        </div>
                      </a>
                    );
                  })}
                </div>

                {/* Availability */}
                <div>
                  <StatusPill />
                  <div>
                    <div>
                      <Clock />
                      <span>Reply within 24 hours</span>
                    </div>
                    <div>
                      <MapPin />
                      <span>Remote / Worldwide</span>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Social Links */}
              <GlassCard hover={false}>
                <h3>
                  Follow along
                </h3>
                <div>
                  {socialLinks.map((link) => (
                    <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer">
                      <div>
                        <p>
                          {link.name}
                        </p>
                        <p>{link.handle}</p>
                      </div>
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
