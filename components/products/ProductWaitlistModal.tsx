'use client';

import { useState } from 'react';
import { X, Send, Loader2, CheckCircle2, Sparkles } from 'lucide-react';
import type { EcosystemProduct } from '@/types/ecosystem-product';

interface ProductWaitlistModalProps {
  product: EcosystemProduct | null;
  onClose: () => void;
}

export default function ProductWaitlistModal({ product, onClose }: ProductWaitlistModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!product) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Dispatch early access notification via transactional notify endpoint
      const res = await fetch('/api/email/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact',
          name: name.trim() || 'Waitlist Member',
          email: email.trim(),
          service: `Early Access: ${product?.name}`,
          message: `User requested early access waitlist invitation for ${product?.name} (${product?.category || 'Ecosystem'}).`,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to submit waitlist request');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again or reach out on WhatsApp.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-strong max-w-lg w-full rounded-3xl p-6 sm:p-8 border border-(--line) space-y-6 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-mist-2 hover:text-paper hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-display text-2xl font-semibold text-paper">You&apos;re on the List!</h3>
            <p className="text-sm text-mist-1 max-w-sm mx-auto leading-relaxed">
              We&apos;ve reserved your priority spot for <span className="text-secondary font-semibold">{product.name}</span>. You&apos;ll be the first to receive alpha build invites, private feature demos, and launch updates.
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-glow px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary/80 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-(--line) flex items-center justify-center text-2xl shrink-0">
                {product.emoji || '🚀'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono-tight text-secondary uppercase tracking-wider">
                    {product.category}
                  </span>
                  <span className="text-[10px] font-mono-tight px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25">
                    Early Access
                  </span>
                </div>
                <h3 className="font-display text-xl font-semibold text-paper">
                  Join the {product.name} Waitlist
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-mist-1 leading-relaxed">
              {product.tagline || product.description}
            </p>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-mono-tight text-mist-2 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full bg-white/5 border border-(--line) rounded-xl px-3.5 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-secondary transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-tight text-mist-2 mb-1">Work / Personal Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full bg-white/5 border border-(--line) rounded-xl px-3.5 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-secondary transition-colors font-mono-tight"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-glow w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary/80 transition-colors disabled:opacity-50 cursor-pointer shadow-lg shadow-primary/25"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Reserving Spot...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Request Early Access Invite</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-center text-mist-2 pt-1">
                Zero spam. Only critical product milestones & invite links.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
