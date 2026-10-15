'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';
import {
  Mail,
  Search,
  Download,
  Copy,
  Check,
  Trash2,
  Users,
  Calendar,
  ExternalLink,
  Loader2,
} from 'lucide-react';

export interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

interface SubscribersClientProps {
  initialSubscribers: Subscriber[];
}

export default function SubscribersClient({
  initialSubscribers,
}: SubscribersClientProps) {
  const router = useRouter();
  const [subscribers, setSubscribers] = useState<Subscriber[]>(initialSubscribers);
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return subscribers;
    return subscribers.filter((sub) => sub.email.toLowerCase().includes(q));
  }, [subscribers, query]);

  const handleCopyAll = async () => {
    if (subscribers.length === 0) return;
    const emailList = subscribers.map((s) => s.email).join(', ');
    try {
      await navigator.clipboard.writeText(emailList);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleExportCsv = () => {
    if (subscribers.length === 0) return;
    const header = 'Email,Date Subscribed\n';
    const rows = subscribers
      .map(
        (s) =>
          `"${s.email.replace(/"/g, '""')}","${new Date(s.created_at).toISOString()}"`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Remove "${email}" from the newsletter subscribers list?`)) return;
    setDeletingId(id);

    try {
      const supabase = createClient();
      const { error } = await supabase.from('subscribers').delete().eq('id', id);

      if (error) {
        alert('Failed to delete subscriber: ' + error.message);
        setDeletingId(null);
        return;
      }

      setSubscribers((prev) => prev.filter((s) => s.id !== id));
      router.refresh();
    } catch (err: any) {
      alert('Error deleting subscriber: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-paper">
            Newsletter Subscribers
          </h1>
          <p className="text-xs text-mist-2 mt-0.5">
            {subscribers.length} total active subscriber
            {subscribers.length === 1 ? '' : 's'} registered through your public newsletter forms.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleCopyAll}
            disabled={subscribers.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass border border-(--line) hover:border-secondary/40 text-paper text-xs font-medium transition-colors disabled:opacity-40 cursor-pointer"
            title="Copy all email addresses separated by commas"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-secondary" />
                <span>Copied All!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-mist-1" />
                <span>Copy All Emails</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            disabled={subscribers.length === 0}
            className="btn-glow inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold transition-all shadow-md shadow-primary/20 disabled:opacity-40 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-5 border border-(--line) flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-inner">
            <Users className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <p className="text-xs font-mono-tight uppercase tracking-wider text-mist-2">
              Total Subscribers
            </p>
            <p className="font-display text-2xl font-bold text-paper mt-0.5">
              {subscribers.length}
            </p>
          </div>
        </div>

        <div className="glass rounded-2xl p-5 border border-(--line) flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary shrink-0 shadow-inner">
            <Calendar className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <p className="text-xs font-mono-tight uppercase tracking-wider text-mist-2">
              Latest Signup
            </p>
            <p className="font-display text-sm font-semibold text-paper mt-1 truncate">
              {subscribers[0]
                ? new Date(subscribers[0].created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : '—'}
            </p>
          </div>
        </div>

        <div className="glass rounded-2xl p-5 border border-(--line) flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-secondary shrink-0 shadow-inner">
            <Mail className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <p className="text-xs font-mono-tight uppercase tracking-wider text-mist-2">
              Form Placement
            </p>
            <p className="text-xs text-mist-1 mt-1">Homepage & Blog Footers</p>
          </div>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-mist-2 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter subscribers by email address..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--glass-bg)] border border-(--line) text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>

      {/* Subscribers Table */}
      <div className="glass rounded-2xl overflow-hidden border border-(--line) shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-(--line) bg-white/[0.02]">
                <th className="text-left text-mist-2 font-medium px-5 py-3.5">
                  #
                </th>
                <th className="text-left text-mist-2 font-medium px-5 py-3.5">
                  Email Address
                </th>
                <th className="text-left text-mist-2 font-medium px-5 py-3.5 hidden sm:table-cell">
                  Subscribed Date
                </th>
                <th className="text-right text-mist-2 font-medium px-5 py-3.5">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-mist-2 px-4 py-14">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Mail className="w-8 h-8 text-mist-2/60 mx-auto mb-2" />
                      <p className="font-display text-base font-semibold text-paper">
                        {query ? 'No matching subscribers' : 'No subscribers yet'}
                      </p>
                      <p className="text-xs text-mist-1">
                        {query
                          ? 'Try clearing your search query.'
                          : 'Signups from your public newsletter form will automatically populate here.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((subscriber, index) => (
                  <tr
                    key={subscriber.id}
                    className="border-b border-(--line) last:border-0 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-3.5 text-mist-2 font-mono-tight text-xs">
                      {String(index + 1).padStart(2, '0')}
                    </td>
                    <td className="px-5 py-3.5 text-paper font-medium">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-secondary shrink-0" />
                        <span className="select-all">{subscriber.email}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-mist-1 text-xs hidden sm:table-cell font-mono-tight">
                      {new Date(subscriber.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(subscriber.id, subscriber.email)}
                        disabled={deletingId === subscriber.id}
                        className="p-1.5 rounded-lg text-mist-2 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50 cursor-pointer"
                        title="Remove subscriber"
                      >
                        {deletingId === subscriber.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

