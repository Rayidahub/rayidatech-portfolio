import Link from 'next/link';
import {
  Users,
  SendHorizontal,
  MailCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  Settings,
} from 'lucide-react';
import OutreachNav from '@/components/admin/outreach/OutreachNav';
import { getOutreachStats } from '@/app/actions/outreach-contacts';
import { getEmailCampaigns } from '@/app/actions/outreach-campaigns';
import GlassCard from '@/components/ui/GlassCard';

export const revalidate = 0;

export default async function OutreachOverviewPage() {
  const [stats, campaigns] = await Promise.all([
    getOutreachStats(),
    getEmailCampaigns(),
  ]);

  const totalCampaigns = campaigns.length;
  const totalSent = campaigns.reduce((acc, c) => acc + (c.sent_count || 0), 0);
  const totalDelivered = campaigns.reduce((acc, c) => acc + (c.delivered_count || 0), 0);
  const totalBounced = campaigns.reduce((acc, c) => acc + (c.bounced_count || 0), 0);
  const totalOpened = campaigns.reduce((acc, c) => acc + (c.opened_count || 0), 0);
  const totalReplied = stats.replied;

  const deliveryRate = totalSent > 0 ? Math.round((totalDelivered / totalSent) * 100) : 0;
  const openRate = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0;

  return (
    <div>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-paper">
            Email Outreach &amp; Campaign Hub
          </h1>
          <p className="text-xs text-mist-2 mt-0.5">
            Manage your Abuja &amp; Nigerian business prospects, bulk cold outreach, personalized templates, and deliverability.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/outreach/import"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-(--line) bg-white/[0.03] hover:bg-white/[0.06] text-xs font-medium text-paper transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-secondary" />
            <span>Import Excel / CSV</span>
          </Link>
          <Link
            href="/admin/outreach/campaigns/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-md shadow-primary/20 transition-all"
          >
            <SendHorizontal className="w-4 h-4" />
            <span>Launch Campaign</span>
          </Link>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <OutreachNav />

      {/* Telemetry Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <GlassCard className="p-5 border border-(--line)">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-mist-2 uppercase tracking-wider">Total Prospects</span>
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-display text-3xl font-bold text-paper">{stats.total}</span>
            <span className="text-xs text-mist-2 ml-2">businesses</span>
          </div>
          <div className="mt-2 text-xs text-mist-1 flex items-center gap-1">
            <span className="text-emerald-400 font-medium">{stats.readyToContact}</span>
            <span>ready for outreach</span>
          </div>
        </GlassCard>

        <GlassCard className="p-5 border border-(--line)">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-mist-2 uppercase tracking-wider">Total Campaigns</span>
            <div className="w-8 h-8 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary">
              <SendHorizontal className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-display text-3xl font-bold text-paper">{totalCampaigns}</span>
            <span className="text-xs text-mist-2 ml-2">created</span>
          </div>
          <div className="mt-2 text-xs text-mist-1">
            <span className="text-secondary font-medium">{totalSent}</span> emails dispatched
          </div>
        </GlassCard>

        <GlassCard className="p-5 border border-(--line)">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-mist-2 uppercase tracking-wider">Delivery Rate</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-display text-3xl font-bold text-emerald-400">
              {totalSent > 0 ? `${deliveryRate}%` : '—'}
            </span>
            <span className="text-xs text-mist-2 ml-2">via Resend/Zoho</span>
          </div>
          <div className="mt-2 text-xs text-mist-1">
            <span>{totalDelivered} confirmed delivered</span>
          </div>
        </GlassCard>

        <GlassCard className="p-5 border border-(--line)">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-mist-2 uppercase tracking-wider">Interested &amp; Replies</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-300">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-display text-3xl font-bold text-purple-300">{stats.interested + stats.replied}</span>
            <span className="text-xs text-mist-2 ml-2">leads engaged</span>
          </div>
          <div className="mt-2 text-xs text-mist-1">
            <span>{stats.unsubscribed} unsubscribed / {stats.bounced} bounced</span>
          </div>
        </GlassCard>
      </div>

      {/* Quick Launch & Workflow Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/15 via-ink-deep to-secondary/15 border border-(--line) mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[11px] font-mono-tight">
            <span>Abuja &amp; Nigeria Cold Outreach Workflow</span>
          </div>
          <h3 className="font-display text-lg font-semibold text-paper">
            Import an Excel sheet &bull; Personalize &bull; Send in controlled batches
          </h3>
          <p className="text-xs text-mist-1 max-w-2xl leading-relaxed">
            Upload your prospect spreadsheet, auto-map columns, preview every recipient&apos;s email with zero unresolved variables, and send through Resend or your Zoho business mailbox with 1-click unsubscribe compliance.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/admin/outreach/import"
            className="px-4 py-2.5 rounded-xl border border-(--line) bg-white/5 hover:bg-white/10 text-xs font-medium text-paper transition-all"
          >
            Import Spreadsheet
          </Link>
          <Link
            href="/admin/outreach/campaigns/new"
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-lg shadow-primary/25 transition-all"
          >
            Create Campaign
          </Link>
        </div>
      </div>

      {/* Recent Campaigns Table */}
      <div className="glass rounded-xl overflow-hidden border border-(--line)">
        <div className="p-4 sm:p-5 border-b border-(--line) flex items-center justify-between">
          <div>
            <h2 className="font-display text-base font-semibold text-paper">Recent Campaigns</h2>
            <p className="text-xs text-mist-2">Live progress, deliverability, and recipient breakdown.</p>
          </div>
          <Link
            href="/admin/outreach/campaigns"
            className="text-xs text-secondary hover:underline inline-flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-(--line) bg-white/[0.02]">
                <th className="text-left text-mist-2 font-medium px-4 py-3">Campaign</th>
                <th className="text-left text-mist-2 font-medium px-4 py-3">Provider</th>
                <th className="text-center text-mist-2 font-medium px-4 py-3">Status</th>
                <th className="text-center text-mist-2 font-medium px-4 py-3">Progress</th>
                <th className="text-center text-mist-2 font-medium px-4 py-3">Delivered</th>
                <th className="text-right text-mist-2 font-medium px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-mist-2 px-4 py-12">
                    <p className="mb-2">No campaigns created yet.</p>
                    <Link
                      href="/admin/outreach/campaigns/new"
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      Create your first email campaign &rarr;
                    </Link>
                  </td>
                </tr>
              ) : (
                campaigns.slice(0, 5).map((camp) => {
                  const percent = camp.total_recipients > 0
                    ? Math.round((camp.sent_count / camp.total_recipients) * 100)
                    : 0;

                  return (
                    <tr
                      key={camp.id}
                      className="border-b border-(--line) last:border-0 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/outreach/campaigns/${camp.id}`}
                          className="font-medium text-paper hover:text-secondary transition-colors"
                        >
                          {camp.name}
                        </Link>
                        <p className="text-xs text-mist-2 line-clamp-1">{camp.subject}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono-tight uppercase border border-white/10 bg-white/5 text-mist-1">
                          {camp.provider}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
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
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-20 bg-white/10 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-primary h-full rounded-full transition-all duration-300"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono-tight text-mist-1">
                            {camp.sent_count}/{camp.total_recipients}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-xs text-mist-1 font-mono-tight">
                        {camp.delivered_count}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/outreach/campaigns/${camp.id}`}
                          className="text-xs font-medium text-secondary hover:text-secondary/80 transition-colors"
                        >
                          Manage &rarr;
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

