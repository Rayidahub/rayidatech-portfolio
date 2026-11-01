'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldBan,
  Plus,
  Trash2,
  Search,
  X,
  Loader2,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import {
  addEmailSuppression,
  removeEmailSuppression,
} from '@/app/actions/outreach-suppressions';
import { isValidEmailAddress } from '@/lib/email/outreach-utils';
import type { EmailSuppression } from '@/types/outreach';

interface SuppressionsClientProps {
  initialSuppressions: EmailSuppression[];
}

export default function SuppressionsClient({ initialSuppressions }: SuppressionsClientProps) {
  const router = useRouter();
  const [suppressions, setSuppressions] = useState<EmailSuppression[]>(initialSuppressions);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newReason, setNewReason] = useState<'unsubscribed' | 'bounced' | 'complained' | 'manual'>('manual');
  const [newNotes, setNewNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isPending, startTransition] = useTransition();

  const filtered = suppressions.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return s.email.toLowerCase().includes(q) || s.notes?.toLowerCase().includes(q);
  });

  const handleAdd = () => {
    if (!isValidEmailAddress(newEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    startTransition(async () => {
      const res = await addEmailSuppression(newEmail, newReason, newNotes);
      if (res.success) {
        setIsModalOpen(false);
        setNewEmail('');
        setNewNotes('');
        router.refresh();
      } else {
        setErrorMsg(res.error || 'Failed to add suppression.');
      }
    });
  };

  const handleRemove = (id: string, email: string) => {
    if (!confirm(`Are you sure you want to remove "${email}" from the suppression list?`)) return;
    startTransition(async () => {
      const res = await removeEmailSuppression(id);
      if (res.success) {
        setSuppressions((prev) => prev.filter((s) => s.id !== id));
        router.refresh();
      }
    });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-lg font-semibold text-paper">
            Suppression &amp; Opt-Out List ({suppressions.length})
          </h2>
          <p className="text-xs text-mist-2">
            Addresses that have unsubscribed, bounced, or been manually blocked from future outreach.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsModalOpen(true);
            setErrorMsg('');
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-md shadow-primary/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Suppression</span>
        </button>
      </div>

      {/* Search */}
      <div className="glass rounded-xl p-4 border border-(--line) mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-mist-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search suppressed email address..."
            className="w-full bg-white/5 border border-(--line) rounded-xl pl-10 pr-4 py-2 text-xs text-paper focus:outline-none focus:border-primary/50"
          />
        </div>
      </div>

      {/* Suppressions Table */}
      <div className="glass rounded-xl overflow-hidden border border-(--line)">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-(--line) bg-white/[0.02]">
                <th className="px-4 py-3 text-left text-mist-2 font-medium">Suppressed Email</th>
                <th className="px-4 py-3 text-center text-mist-2 font-medium">Reason</th>
                <th className="px-4 py-3 text-left text-mist-2 font-medium">Notes / Source</th>
                <th className="px-4 py-3 text-left text-mist-2 font-medium">Date Suppressed</th>
                <th className="px-4 py-3 text-right text-mist-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--line)">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-mist-2 px-4 py-12">
                    No suppressed email addresses found.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 font-mono-tight text-paper font-medium">
                      {s.email}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono-tight uppercase ${
                          s.reason === 'unsubscribed'
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                            : s.reason === 'bounced'
                            ? 'bg-rose-500/15 text-rose-300 border border-rose-500/20'
                            : 'bg-white/5 text-mist-2 border border-white/10'
                        }`}
                      >
                        {s.reason}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-mist-1">
                      {s.notes || '—'}
                    </td>
                    <td className="px-4 py-3 text-mist-2 font-mono-tight">
                      {new Date(s.created_at || '').toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemove(s.id, s.email)}
                        className="p-1.5 rounded-lg text-mist-2 hover:text-rose-400 hover:bg-white/5 transition-colors cursor-pointer"
                        title="Remove from suppression list"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[var(--ink-deep)] border border-(--line) rounded-2xl p-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-(--line) mb-4">
              <h3 className="font-display text-base font-semibold text-paper">
                Add Email to Suppression List
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-mist-2 hover:text-paper cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                {errorMsg}
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-mist-1 font-medium mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. competitor@example.com"
                  className="w-full bg-white/5 border border-(--line) rounded-xl px-3.5 py-2.5 text-xs text-paper focus:outline-none focus:border-primary/50 font-mono-tight"
                />
              </div>

              <div>
                <label className="block text-mist-1 font-medium mb-1">
                  Reason
                </label>
                <select
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value as any)}
                  className="w-full bg-white/5 border border-(--line) rounded-xl px-3.5 py-2.5 text-xs text-paper focus:outline-none focus:border-primary/50"
                >
                  <option value="manual" className="bg-ink text-paper">Manual Exclusion</option>
                  <option value="unsubscribed" className="bg-ink text-paper">Customer Unsubscribed</option>
                  <option value="bounced" className="bg-ink text-paper">Email Bounced</option>
                  <option value="complained" className="bg-ink text-paper">Spam Complaint</option>
                </select>
              </div>

              <div>
                <label className="block text-mist-1 font-medium mb-1">
                  Notes
                </label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Reason for manual suppression..."
                  className="w-full bg-white/5 border border-(--line) rounded-xl px-3.5 py-2.5 text-xs text-paper focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-(--line) mt-6">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-mist-2 hover:text-paper cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={handleAdd}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-md transition-all disabled:opacity-50 cursor-pointer"
              >
                {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Add Suppression</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

