import Link from 'next/link';
import {
  SendHorizontal,
  Plus,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  BarChart3,
  ExternalLink,
} from 'lucide-react';
import OutreachNav from '@/components/admin/outreach/OutreachNav';
import { getEmailCampaigns } from '@/app/actions/outreach-campaigns';
import GlassCard from '@/components/ui/GlassCard';

export const revalidate = 0;

export default async function CampaignsListPage() {
  const campaigns = await getEmailCampaigns();

  return (
    <div>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-paper">
            Email Campaigns ({campaigns.length})
          </h1>
          <p className="text-xs text-mist-2 mt-0.5">
            Monitor outreach batches, deliverability metrics, and individual recipient statuses.
          </p>
        </div>

        <Link
          href="/admin/outreach/campaigns/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-md shadow-primary/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Campaign</span>
        </Link>
      </div>

      <OutreachNav />

      {/* Campaigns Table */}
      <div className="glass rounded-xl overflow-hidden border border-(--line)">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-(--line) bg-white/[0.02]">
                <th className="text-left text-mist-2 font-medium px-4 py-3">Campaign</th>
                <th className="text-left text-mist-2 font-medium px-4 py-3">Provider</th>
                <th className="text-center text-mist-2 font-medium px-4 py-3">Status</th>
                <th className="text-center text-mist-2 font-medium px-4 py-3">Progress</th>
                <th className="text-center text-mist-2 font-medium px-4 py-3">Delivered</th>
                <th className="text-center text-mist-2 font-medium px-4 py-3">Opened</th>
                <th className="text-center text-mist-2 font-medium px-4 py-3">Unsub</th>
                <th className="text-right text-mist-2 font-medium px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-mist-2 px-4 py-14">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-mist-2">
                      <SendHorizontal className="w-6 h-6" />
                    </div>
                    <p className="font-medium text-paper mb-1">No campaigns created yet</p>
                    <p className="text-xs text-mist-2 mb-4">
                      Create your first outreach campaign to connect with Abuja businesses.
                    </p>
                    <Link
                      href="/admin/outreach/campaigns/new"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create First Campaign</span>
                    </Link>
                  </td>
                </tr>
              ) : (
                campaigns.map((camp) => {
                  const percent =
                    camp.total_recipients > 0
                      ? Math.round((camp.sent_count / camp.total_recipients) * 100)
                      : 0;

                  return (
                    <tr
                      key={camp.id}
                      className="border-b border-(--line) last:border-0 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-3.5">
                        <Link
                          href={`/admin/outreach/campaigns/${camp.id}`}
                          className="font-semibold text-paper hover:text-secondary transition-colors"
                        >
                          {camp.name}
                        </Link>
                        <p className="text-xs text-mist-2 line-clamp-1 mt-0.5">
                          {camp.subject}
                        </p>
                        <div className="text-[10px] font-mono-tight text-mist-2 mt-1">
                          Created {new Date(camp.created_at || '').toLocaleDateString()}
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono-tight uppercase border border-white/10 bg-white/5 text-secondary">
                          {camp.provider}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            camp.status === 'completed'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                              : camp.status === 'sending'
                              ? 'bg-secondary/15 text-secondary border border-secondary/20 animate-pulse'
                              : camp.status === 'paused'
                              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                              : 'bg-white/5 text-mist-2 border border-white/10'
                          }`}
                        >
                          {camp.status.toUpperCase()}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-24 bg-white/10 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-primary h-full rounded-full transition-all duration-300"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-mono-tight text-mist-1">
                            {camp.sent_count} / {camp.total_recipients} ({percent}%)
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-center font-mono-tight text-xs text-mist-1">
                        {camp.delivered_count}
                      </td>

                      <td className="px-4 py-3.5 text-center font-mono-tight text-xs text-mist-1">
                        {camp.opened_count}
                      </td>

                      <td className="px-4 py-3.5 text-center font-mono-tight text-xs text-mist-1">
                        {camp.unsubscribed_count}
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <Link
                          href={`/admin/outreach/campaigns/${camp.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:underline"
                        >
                          <span>Manage</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

