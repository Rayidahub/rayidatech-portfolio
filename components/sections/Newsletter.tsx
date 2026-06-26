'use client';

import { useState, FormEvent } from 'react';
import { ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import { supabase } from '@/lib/supabase/client';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setMessage('');

    const { error } = await supabase
      .from('subscribers')
      .insert([{ email: trimmed }]);

    if (error) {
      if (error.code === '23505') {
        setStatus('success');
        setMessage("You're already on the list.");
      } else {
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      }
      return;
    }

    setStatus('success');
    setMessage('Thanks for subscribing!');
    setEmail('');
  }

  return (
    <Section className="bg-ink relative overflow-hidden">
      {/* Top gradient line */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full h-px opacity-40"
        style={{
          background:
            'linear-gradient(90deg, transparent, var(--primary), var(--secondary), transparent)',
        }}
        aria-hidden="true"
      />

      <Container size="default">
        <Reveal>
          <div className="glass rounded-2xl p-8 md:p-12 relative overflow-hidden">
            {/* Soft glow */}
            <div
              className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-30 blur-3xl"
              style={{
                background:
                  'radial-gradient(circle, rgba(var(--primary-rgb), 0.35) 0%, transparent 60%)',
              }}
              aria-hidden="true"
            />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <p className="font-mono-tight text-xs uppercase tracking-[0.25em] text-secondary mb-3">
                  Newsletter
                </p>
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-paper mb-3">
                  Stay in the <span className="gradient-text">loop</span>
                </h2>
                <p className="text-mist-1 text-sm md:text-base leading-relaxed max-w-md">
                  Get insights on design, AI engineering, product thinking, and
                  behind-the-scenes updates — no spam, just value.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === 'error') setStatus('idle');
                    }}
                    placeholder="ray@example.com"
                    disabled={status === 'loading' || status === 'success'}
                    className="flex-1 min-w-0 rounded-xl bg-paper/5 border border-(--line) px-4 py-3 text-sm text-paper placeholder:text-mist-2/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading' || status === 'success'}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 text-white px-6 py-3 text-sm font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : status === 'success' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                    {status === 'loading'
                      ? 'Subscribing...'
                      : status === 'success'
                      ? 'Subscribed'
                      : 'Subscribe'}
                  </button>
                </div>

                {message && (
                  <p
                    className={`text-sm ${
                      status === 'error' ? 'text-red-400' : 'text-secondary'
                    }`}
                  >
                    {message}
                  </p>
                )}

                <p className="text-xs text-mist-2">
                  Unsubscribe anytime. Your email stays private.
                </p>
              </form>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
