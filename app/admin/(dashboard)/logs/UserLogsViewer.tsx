'use client';

import { useState, useEffect, useTransition, useMemo } from 'react';
import Link from 'next/link';
import {
  Activity,
  RefreshCw,
  Search,
  Filter,
  Download,
  Trash2,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Clock,
  Eye,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Layers,
  Users,
  Compass,
  Sparkles,
  CheckCircle,
  FileText,
  MousePointerClick,
  Palette,
  Timer,
  AlertTriangle,
  Copy,
  Terminal,
  Check,
  MapPin,
  Wifi,
  Cpu,
  Navigation,
  Server,
  Radio,
} from 'lucide-react';
import {
  getVisitorLogsAction,
  getVisitorStatsAction,
  clearVisitorLogsAction,
} from '@/app/actions/visitor-logs';
import type { VisitorLog, VisitorStats } from '@/types/visitor-log';

const SETUP_SQL = `-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/grtvnrqzmbndbjljramm/sql/new

CREATE TABLE IF NOT EXISTS public.visitor_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'page_view',
  path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  action_label TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  device_type TEXT DEFAULT 'desktop',
  browser TEXT,
  os TEXT,
  ip_address TEXT,
  country TEXT,
  country_code TEXT,
  city TEXT,
  region TEXT,
  postal_code TEXT,
  formatted_address TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  isp TEXT,
  organization TEXT,
  timezone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Upgrade existing table if already created without address columns
ALTER TABLE public.visitor_logs ADD COLUMN IF NOT EXISTS region TEXT;
ALTER TABLE public.visitor_logs ADD COLUMN IF NOT EXISTS postal_code TEXT;
ALTER TABLE public.visitor_logs ADD COLUMN IF NOT EXISTS formatted_address TEXT;
ALTER TABLE public.visitor_logs ADD COLUMN IF NOT EXISTS latitude NUMERIC;
ALTER TABLE public.visitor_logs ADD COLUMN IF NOT EXISTS longitude NUMERIC;
ALTER TABLE public.visitor_logs ADD COLUMN IF NOT EXISTS isp TEXT;
ALTER TABLE public.visitor_logs ADD COLUMN IF NOT EXISTS organization TEXT;
ALTER TABLE public.visitor_logs ADD COLUMN IF NOT EXISTS timezone TEXT;
ALTER TABLE public.visitor_logs ADD COLUMN IF NOT EXISTS country_code TEXT;

CREATE INDEX IF NOT EXISTS idx_visitor_logs_created_at ON public.visitor_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_visitor_id ON public.visitor_logs (visitor_id);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_session_id ON public.visitor_logs (session_id);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_event_type ON public.visitor_logs (event_type);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_path ON public.visitor_logs (path);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_country ON public.visitor_logs (country);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_city ON public.visitor_logs (city);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_region ON public.visitor_logs (region);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_isp ON public.visitor_logs (isp);

ALTER TABLE public.visitor_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert to visitor_logs" ON public.visitor_logs;
DROP POLICY IF EXISTS "Allow read to visitor_logs" ON public.visitor_logs;
DROP POLICY IF EXISTS "Allow authenticated delete to visitor_logs" ON public.visitor_logs;

CREATE POLICY "Allow public insert to visitor_logs"
  ON public.visitor_logs FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read to visitor_logs"
  ON public.visitor_logs FOR SELECT USING (true);

CREATE POLICY "Allow authenticated delete to visitor_logs"
  ON public.visitor_logs FOR DELETE USING (auth.role() = 'authenticated');

CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  default_theme TEXT DEFAULT 'dark',
  allow_user_toggle BOOLEAN DEFAULT true,
  theme_version INTEGER DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read to site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Allow authenticated full to site_settings" ON public.site_settings;

CREATE POLICY "Allow public read to site_settings"
  ON public.site_settings FOR SELECT USING (true);

CREATE POLICY "Allow authenticated full to site_settings"
  ON public.site_settings FOR ALL USING (auth.role() = 'authenticated');

INSERT INTO public.site_settings (id, default_theme, allow_user_toggle, theme_version)
VALUES ('default', 'dark', true, 1)
ON CONFLICT (id) DO NOTHING;`;

interface UserLogsViewerProps {
  initialLogs: VisitorLog[];
  initialStats: VisitorStats;
}

export default function UserLogsViewer({
  initialLogs,
  initialStats,
}: UserLogsViewerProps) {
  const [logs, setLogs] = useState<VisitorLog[]>(initialLogs);
  const [stats, setStats] = useState<VisitorStats>(initialStats);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventType, setSelectedEventType] = useState<string>('all');
  const [selectedDevice, setSelectedDevice] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedIp, setCopiedIp] = useState<string | null>(null);
  const [showSqlCode, setShowSqlCode] = useState(false);

  const [isPending, startTransition] = useTransition();
  const [isClearing, startClearingTransition] = useTransition();
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const copySetupSql = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(SETUP_SQL);
      setCopiedSql(true);
      triggerToast('Supabase setup SQL copied to clipboard.');
      setTimeout(() => setCopiedSql(false), 3000);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedIp(text);
      triggerToast(`${label} copied to clipboard.`);
      setTimeout(() => setCopiedIp(null), 2500);
    }
  };

  // Manual refresh handler
  const refreshLogs = () => {
    startTransition(async () => {
      const [logsRes, statsRes] = await Promise.all([
        getVisitorLogsAction(),
        getVisitorStatsAction(),
      ]);

      if (logsRes.success) {
        setLogs(logsRes.logs);
      }
      if (statsRes.success && statsRes.stats) {
        setStats(statsRes.stats);
      }
      setLastRefreshed(new Date());
    });
  };

  // Auto-refresh interval (every 8 seconds when active)
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      refreshLogs();
    }, 8000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Clear logs action
  const handleClearLogs = () => {
    if (!confirm('Are you sure you want to clear all visitor activity logs? This action cannot be undone.')) {
      return;
    }

    startClearingTransition(async () => {
      const res = await clearVisitorLogsAction();
      if (res.success) {
        setLogs([]);
        setStats({
          total_events: 0,
          total_page_views: 0,
          unique_visitors: 0,
          active_sessions_today: 0,
          top_pages: [],
          device_breakdown: { desktop: 0, mobile: 0, tablet: 0 },
          top_actions: [],
          top_locations: [],
          top_isps: [],
        });
        triggerToast('Activity logs cleared successfully.');
      }
    });
  };

  // Comprehensive Export to CSV
  const handleExportCSV = () => {
    if (logs.length === 0) return;

    const headers = [
      'Timestamp',
      'Event Type',
      'Action Label',
      'Path',
      'Formatted Address',
      'City',
      'Region / State',
      'Postal Code',
      'Country',
      'Country Code',
      'Latitude',
      'Longitude',
      'Google Maps URL',
      'IP Address',
      'ISP',
      'Organization',
      'Timezone',
      'Device Type',
      'Browser',
      'OS',
      'Screen Resolution',
      'Connection Type',
      'Language',
      'Referrer',
      'Visitor ID',
      'Session ID',
    ];

    const rows = logs.map((log) => {
      const meta = log.metadata || {};
      const addr = meta.address || {};
      const env = meta.environment || {};

      return [
        `"${log.created_at}"`,
        `"${log.event_type || ''}"`,
        `"${(log.action_label || '').replace(/"/g, '""')}"`,
        `"${log.path || ''}"`,
        `"${(log.formatted_address || addr.formatted_address || '').replace(/"/g, '""')}"`,
        `"${(log.city || addr.city || '').replace(/"/g, '""')}"`,
        `"${(log.region || addr.region || '').replace(/"/g, '""')}"`,
        `"${log.postal_code || addr.postal_code || ''}"`,
        `"${(log.country || addr.country || '').replace(/"/g, '""')}"`,
        `"${log.country_code || addr.country_code || ''}"`,
        `"${log.latitude ?? addr.latitude ?? ''}"`,
        `"${log.longitude ?? addr.longitude ?? ''}"`,
        `"${log.maps_url || addr.maps_url || ''}"`,
        `"${log.ip_address || ''}"`,
        `"${(log.isp || addr.isp || '').replace(/"/g, '""')}"`,
        `"${(log.organization || addr.organization || '').replace(/"/g, '""')}"`,
        `"${log.timezone || addr.timezone || ''}"`,
        `"${log.device_type || ''}"`,
        `"${log.browser || ''}"`,
        `"${log.os || ''}"`,
        `"${env.display?.screen_resolution || ''}"`,
        `"${env.network?.effective_type || ''}"`,
        `"${env.locale?.language || ''}"`,
        `"${(log.referrer || '').replace(/"/g, '""')}"`,
        `"${log.visitor_id || ''}"`,
        `"${log.session_id || ''}"`,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rayida_visitor_audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('Detailed visitor audit exported to CSV.');
  };

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Event filter
      if (selectedEventType !== 'all' && log.event_type !== selectedEventType) {
        return false;
      }
      // Device filter
      if (
        selectedDevice !== 'all' &&
        (log.device_type || 'desktop').toLowerCase() !== selectedDevice.toLowerCase()
      ) {
        return false;
      }
      // Search term filter across all rich parameters
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchPath = log.path?.toLowerCase().includes(q);
        const matchAction = log.action_label?.toLowerCase().includes(q);
        const matchVisitor = log.visitor_id?.toLowerCase().includes(q);
        const matchIp = log.ip_address?.toLowerCase().includes(q);
        const matchCountry = log.country?.toLowerCase().includes(q);
        const matchCity = log.city?.toLowerCase().includes(q);
        const matchRegion = log.region?.toLowerCase().includes(q);
        const matchPostal = log.postal_code?.toLowerCase().includes(q);
        const matchAddress = log.formatted_address?.toLowerCase().includes(q);
        const matchIsp = log.isp?.toLowerCase().includes(q);
        const matchBrowser = log.browser?.toLowerCase().includes(q);
        const matchOs = log.os?.toLowerCase().includes(q);

        return (
          matchPath ||
          matchAction ||
          matchVisitor ||
          matchIp ||
          matchCountry ||
          matchCity ||
          matchRegion ||
          matchPostal ||
          matchAddress ||
          matchIsp ||
          matchBrowser ||
          matchOs
        );
      }
      return true;
    });
  }, [logs, selectedEventType, selectedDevice, searchQuery]);

  const getEventBadge = (eventType: string) => {
    switch (eventType) {
      case 'page_view':
        return {
          label: 'Page View',
          className: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
          icon: Eye,
        };
      case 'click_cta':
        return {
          label: 'CTA Click',
          className: 'bg-primary/20 text-accent-soft border-primary/30',
          icon: MousePointerClick,
        };
      case 'form_submit':
        return {
          label: 'Form Submitted',
          className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          icon: CheckCircle,
        };
      case 'theme_change':
        return {
          label: 'Theme Toggle',
          className: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
          icon: Palette,
        };
      case 'project_view':
        return {
          label: 'Project Case',
          className: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
          icon: Sparkles,
        };
      case 'dwell_time':
        return {
          label: 'Dwell Time',
          className: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
          icon: Timer,
        };
      case 'external_link':
        return {
          label: 'Outbound',
          className: 'bg-mist-2/20 text-mist-1 border-white/10',
          icon: ExternalLink,
        };
      default:
        return {
          label: eventType,
          className: 'bg-white/5 text-mist-1 border-white/10',
          icon: Activity,
        };
    }
  };

  const getDeviceIcon = (deviceType?: string) => {
    const d = (deviceType || 'desktop').toLowerCase();
    if (d === 'mobile') return <Smartphone className="w-3.5 h-3.5 text-secondary" />;
    if (d === 'tablet') return <Tablet className="w-3.5 h-3.5 text-secondary" />;
    return <Monitor className="w-3.5 h-3.5 text-secondary" />;
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const sec = Math.floor(diffMs / 1000);
      if (sec < 5) return 'just now';
      if (sec < 60) return `${sec}s ago`;
      const min = Math.floor(sec / 60);
      if (min < 60) return `${min}m ago`;
      const hrs = Math.floor(min / 60);
      if (hrs < 24) return `${hrs}h ago`;
      const days = Math.floor(hrs / 24);
      return `${days}d ago`;
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-ink-deep/95 border border-primary/40 text-paper text-xs shadow-2xl backdrop-blur-md animate-fade-in">
          <CheckCircle className="w-4 h-4 text-secondary shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-(--line)">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono-tight text-secondary uppercase tracking-widest flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              Real-time Analytics &amp; Geolocation
            </span>
            <span className="flex items-center gap-1.5 text-[11px] font-mono-tight text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Address Tracking Active
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold text-paper mt-1">
            Visitor &amp; User Activity Logs
          </h1>
          <p className="text-xs text-mist-2 mt-0.5">
            Capture real-time user physical addresses, coordinates, network providers (ISP), device hardware profiles, and interaction telemetry.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Auto Refresh Toggle */}
          <button
            type="button"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono-tight transition-colors ${
              autoRefresh
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-white/[0.04] text-mist-2 border-(--line) hover:text-paper'
            }`}
            title={autoRefresh ? 'Auto-refresh active (every 8s)' : 'Auto-refresh paused'}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${autoRefresh ? 'bg-emerald-400 animate-ping' : 'bg-mist-2'}`}
            />
            <span>{autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh PAUSED'}</span>
          </button>

          {/* Manual Refresh Button */}
          <button
            type="button"
            onClick={refreshLogs}
            disabled={isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-(--line) text-xs text-mist-1 hover:text-paper transition-all disabled:opacity-50"
            title="Refresh logs now"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPending ? 'animate-spin text-secondary' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={logs.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-(--line) text-xs text-mist-1 hover:text-paper transition-all disabled:opacity-50"
            title="Download detailed CSV report"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Audit CSV</span>
          </button>

          {/* Clear Logs */}
          <button
            type="button"
            onClick={handleClearLogs}
            disabled={isClearing || logs.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs text-rose-300 transition-all disabled:opacity-50"
            title="Clear all logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Database Table Notice & Upgrade SQL */}
      {stats.is_table_missing && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-paper text-sm flex items-center gap-2">
                  <span>Supabase Database Setup Required: &apos;visitor_logs&apos; table</span>
                  <span className="text-[10px] font-mono-tight text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                    Action Needed
                  </span>
                </h3>
                <p className="text-xs text-mist-1 mt-1 leading-relaxed max-w-2xl">
                  Run the migration SQL in your Supabase SQL Editor once to store full visitor address history, coordinates, and network telemetry permanently in the cloud.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={copySetupSql}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-ink font-semibold text-xs shadow-md transition-all"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Copied SQL!' : 'Copy Supabase SQL'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSqlCode(!showSqlCode)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-paper text-xs border border-white/10 transition-colors"
              >
                <Terminal className="w-3.5 h-3.5 text-secondary" />
                <span>{showSqlCode ? 'Hide SQL Script' : 'View SQL Script'}</span>
              </button>

              <a
                href="https://supabase.com/dashboard/project/grtvnrqzmbndbjljramm/sql/new"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] text-mist-1 hover:text-paper text-xs transition-colors"
              >
                <span>Open Supabase</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {showSqlCode && (
            <div className="mt-4 pt-4 border-t border-amber-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-amber-300">
                  SQL to create visitor_logs with full physical address and network columns:
                </span>
                <button
                  type="button"
                  onClick={copySetupSql}
                  className="text-xs text-secondary hover:underline flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-black/60 border border-white/10 text-[11px] font-mono text-mist-1 overflow-x-auto max-h-60 overflow-y-auto leading-relaxed select-all">
                {SETUP_SQL}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Primary KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Events */}
        <div className="glass rounded-2xl p-4 sm:p-5 border border-(--line) relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-tight text-mist-2 uppercase tracking-wider">
              Total Logged Events
            </span>
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-secondary">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <p className="font-display text-2xl sm:text-3xl font-bold text-paper mt-3">
            {stats.total_events.toLocaleString()}
          </p>
          <span className="text-[11px] text-mist-2 mt-1 block font-mono-tight">
            Telemetry &amp; interaction hits
          </span>
        </div>

        {/* Page Views */}
        <div className="glass rounded-2xl p-4 sm:p-5 border border-(--line) relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-tight text-mist-2 uppercase tracking-wider">
              Page Views
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <p className="font-display text-2xl sm:text-3xl font-bold text-paper mt-3">
            {stats.total_page_views.toLocaleString()}
          </p>
          <span className="text-[11px] text-mist-2 mt-1 block font-mono-tight">
            Navigation hits across site
          </span>
        </div>

        {/* Unique Visitors */}
        <div className="glass rounded-2xl p-4 sm:p-5 border border-(--line) relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-tight text-mist-2 uppercase tracking-wider">
              Unique Visitors
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="font-display text-2xl sm:text-3xl font-bold text-paper mt-3">
            {stats.unique_visitors.toLocaleString()}
          </p>
          <span className="text-[11px] text-mist-2 mt-1 block font-mono-tight">
            Distinct devices &amp; browsers
          </span>
        </div>

        {/* Active Sessions Today */}
        <div className="glass rounded-2xl p-4 sm:p-5 border border-(--line) relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-tight text-mist-2 uppercase tracking-wider">
              Sessions Today
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="font-display text-2xl sm:text-3xl font-bold text-paper mt-3">
            {stats.active_sessions_today.toLocaleString()}
          </p>
          <span className="text-[11px] text-mist-2 mt-1 block font-mono-tight">
            Last updated: {lastRefreshed.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Geolocation & Telemetry Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Top Visitor Locations / Addresses */}
        <div className="glass rounded-xl p-4 border border-(--line)">
          <h3 className="text-xs font-mono-tight uppercase tracking-wider text-mist-2 mb-3 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-secondary" />
            <span>Top Visitor Geographic Locations</span>
          </h3>
          {stats.top_locations && stats.top_locations.length > 0 ? (
            <div className="space-y-2">
              {stats.top_locations.map((loc) => {
                const percent = Math.round((loc.count / Math.max(1, stats.total_events)) * 100);
                return (
                  <div key={loc.location} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-paper truncate max-w-[220px] flex items-center gap-1.5">
                        <span>{loc.flag || '📍'}</span>
                        <span>{loc.location}</span>
                      </span>
                      <span className="font-mono-tight text-secondary font-medium">
                        {loc.count} <span className="text-mist-2">({percent}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-1 bg-white/[0.04] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-secondary to-primary rounded-full transition-all"
                        style={{ width: `${Math.min(100, Math.max(8, percent))}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-mist-2 py-4">Locations will appear as visitors arrive.</p>
          )}
        </div>

        {/* Top Internet Service Providers (ISPs) */}
        <div className="glass rounded-xl p-4 border border-(--line)">
          <h3 className="text-xs font-mono-tight uppercase tracking-wider text-mist-2 mb-3 flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-primary" />
            <span>Top Internet Providers &amp; Networks</span>
          </h3>
          {stats.top_isps && stats.top_isps.length > 0 ? (
            <div className="space-y-2">
              {stats.top_isps.map((item) => {
                const percent = Math.round((item.count / Math.max(1, stats.total_events)) * 100);
                return (
                  <div key={item.isp} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-paper truncate max-w-[220px] flex items-center gap-1.5">
                        <Radio className="w-3 h-3 text-secondary" />
                        <span>{item.isp}</span>
                      </span>
                      <span className="font-mono-tight text-accent-soft font-medium">
                        {item.count} <span className="text-mist-2">({percent}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-1 bg-white/[0.04] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all"
                        style={{ width: `${Math.min(100, Math.max(8, percent))}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-mist-2 py-4">Network providers recorded automatically.</p>
          )}
        </div>

        {/* Key User Interactions / CTAs */}
        <div className="glass rounded-xl p-4 border border-(--line)">
          <h3 className="text-xs font-mono-tight uppercase tracking-wider text-mist-2 mb-3 flex items-center gap-1.5">
            <MousePointerClick className="w-3.5 h-3.5 text-secondary" />
            <span>High-Value Engagements &amp; CTAs</span>
          </h3>
          {stats.top_actions.length > 0 ? (
            <div className="space-y-2">
              {stats.top_actions.slice(0, 4).map((act) => (
                <div
                  key={act.action}
                  className="flex items-center justify-between text-xs py-1 border-b border-white/[0.04] last:border-0"
                >
                  <span className="text-paper truncate max-w-[210px]">{act.action}</span>
                  <span className="font-mono-tight text-secondary font-medium bg-secondary/10 px-2 py-0.5 rounded-full border border-secondary/20">
                    {act.count}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-mist-2 py-4">No custom action clicks recorded yet.</p>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass rounded-2xl p-4 border border-(--line) space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-mist-2 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by address, city, state, country, ISP, IP, path, browser..."
              className="w-full pl-9 pr-3.5 py-2 bg-[var(--ink)] border border-(--line) rounded-xl text-paper text-xs placeholder:text-mist-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-mist-2 hover:text-paper"
              >
                Clear
              </button>
            )}
          </div>

          {/* Device Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs text-mist-2 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Device:
            </span>
            {['all', 'desktop', 'mobile', 'tablet'].map((dev) => (
              <button
                key={dev}
                type="button"
                onClick={() => setSelectedDevice(dev)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono-tight capitalize transition-colors ${
                  selectedDevice === dev
                    ? 'bg-primary text-white font-medium shadow-sm'
                    : 'bg-white/[0.04] text-mist-2 hover:text-paper hover:bg-white/[0.08]'
                }`}
              >
                {dev}
              </button>
            ))}
          </div>
        </div>

        {/* Event Type Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-(--line)">
          <span className="text-xs text-mist-2 mr-1">Events:</span>
          {[
            { id: 'all', label: 'All Events' },
            { id: 'page_view', label: 'Page Views' },
            { id: 'click_cta', label: 'CTA Clicks' },
            { id: 'project_view', label: 'Projects' },
            { id: 'theme_change', label: 'Theme Toggles' },
            { id: 'dwell_time', label: 'Dwell Time' },
            { id: 'external_link', label: 'Outbound' },
          ].map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setSelectedEventType(type.id)}
              className={`px-3 py-1 rounded-full text-xs transition-colors whitespace-nowrap ${
                selectedEventType === type.id
                  ? 'bg-secondary/20 text-secondary border border-secondary/40 font-medium'
                  : 'bg-white/[0.02] text-mist-1 border border-transparent hover:border-(--line) hover:text-paper'
              }`}
            >
              {type.label}
            </button>
          ))}
          <span className="ml-auto text-xs text-mist-2 font-mono-tight">
            Showing {filteredLogs.length} of {logs.length} logs
          </span>
        </div>
      </div>

      {/* Activity Logs Table */}
      <div className="glass rounded-2xl border border-(--line) overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-(--line) bg-white/[0.02] text-mist-2 font-mono-tight uppercase text-[11px]">
                <th className="py-3 px-4">Event &amp; Time</th>
                <th className="py-3 px-4">Action &amp; Path</th>
                <th className="py-3 px-4">User Physical Address</th>
                <th className="py-3 px-4">Network &amp; ISP</th>
                <th className="py-3 px-4">Hardware &amp; OS</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--line)">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => {
                  const badge = getEventBadge(log.event_type);
                  const BadgeIcon = badge.icon;
                  const isExpanded = expandedLogId === log.id;
                  const meta = log.metadata || {};
                  const addr = meta.address || {};
                  const env = meta.environment || {};

                  const city = log.city || addr.city || '';
                  const region = log.region || addr.region || '';
                  const country = log.country || addr.country || 'Global';
                  const flag = log.country_flag || addr.country_flag || '🌐';
                  const postal = log.postal_code || addr.postal_code || '';
                  const isp = log.isp || addr.isp || '';
                  const formattedAddress = log.formatted_address || addr.formatted_address || '';
                  const mapsUrl = log.maps_url || addr.maps_url;

                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-white/[0.03] transition-colors group cursor-pointer"
                      onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                    >
                      {/* Event & Time */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono-tight border ${badge.className}`}
                          >
                            <BadgeIcon className="w-2.5 h-2.5" />
                            <span>{badge.label}</span>
                          </span>
                        </div>
                        <span
                          className="text-[11px] text-mist-2 font-mono-tight block mt-1"
                          title={new Date(log.created_at).toLocaleString()}
                        >
                          {formatRelativeTime(log.created_at)}
                        </span>
                      </td>

                      {/* Action & Path */}
                      <td className="py-3 px-4 max-w-xs">
                        <p className="font-medium text-paper truncate" title={log.action_label}>
                          {log.action_label || `Visited ${log.path}`}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Link
                            href={log.path}
                            target="_blank"
                            onClick={(e) => e.stopPropagation()}
                            className="font-mono text-[11px] text-secondary/80 hover:text-secondary hover:underline truncate"
                            title={log.path}
                          >
                            {log.path}
                          </Link>
                          {log.page_title && (
                            <span className="text-[10px] text-mist-2 truncate max-w-[120px]">
                              &bull; {log.page_title}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* User Physical Address & Location */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-paper">
                          <span className="text-sm shrink-0" role="img" aria-label="country flag">
                            {flag}
                          </span>
                          <span className="font-medium truncate max-w-[180px]">
                            {city ? `${city}, ` : ''}
                            {region ? `${region}, ` : ''}
                            {country}
                          </span>
                          {mapsUrl && (
                            <a
                              href={mapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-1 rounded text-mist-2 hover:text-secondary hover:bg-white/5 transition-colors"
                              title="Open location on Google Maps"
                            >
                              <MapPin className="w-3.5 h-3.5 text-secondary" />
                            </a>
                          )}
                        </div>
                        <span
                          className="text-[10px] text-mist-2 block mt-0.5 truncate max-w-[200px]"
                          title={formattedAddress || log.ip_address}
                        >
                          {postal ? `Postal: ${postal} • ` : ''}
                          {formattedAddress || log.ip_address || '127.0.0.1'}
                        </span>
                      </td>

                      {/* Network & ISP */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <Radio className="w-3 h-3 text-secondary shrink-0" />
                          <span className="text-paper font-medium truncate max-w-[170px]" title={isp || 'Network'}>
                            {isp || 'Standard Network'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-[10px] font-mono-tight text-mist-2">
                            {log.ip_address || '127.0.0.1'}
                          </span>
                          {env.network?.effective_type && (
                            <span className="text-[9px] font-mono-tight text-cyan-300 bg-cyan-500/10 px-1 rounded border border-cyan-500/20 uppercase">
                              {env.network.effective_type}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Hardware & OS */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          {getDeviceIcon(log.device_type)}
                          <span className="text-paper font-medium">
                            {log.browser || 'Browser'}
                          </span>
                        </div>
                        <span className="text-[10px] text-mist-2 block mt-0.5 truncate max-w-[140px]">
                          {log.os || 'OS'} &bull; {env.display?.screen_resolution || log.device_type || 'desktop'}
                        </span>
                      </td>

                      {/* Details Expander */}
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          className="p-1.5 rounded-lg text-mist-2 hover:text-paper hover:bg-white/5 transition-colors"
                          aria-label="Toggle details"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-secondary" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 px-4 text-center">
                    <div className="max-w-sm mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto text-mist-2">
                        <Activity className="w-6 h-6" />
                      </div>
                      <h3 className="font-display font-semibold text-paper text-sm">
                        No Visitor Activity Found
                      </h3>
                      <p className="text-xs text-mist-2">
                        {searchQuery || selectedEventType !== 'all' || selectedDevice !== 'all'
                          ? 'No activity matches your active filters. Try resetting search or filter pills.'
                          : 'Live activity will appear here as visitors browse and interact with your portfolio.'}
                      </p>
                      <Link
                        href="/"
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-medium transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Visit Website to Generate Logs</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Deep Telemetry & Physical Address Drawer */}
        {expandedLogId && (
          <div className="p-6 bg-white/[0.02] border-t border-(--line) space-y-5 animate-fade-in">
            {(() => {
              const log = logs.find((l) => l.id === expandedLogId);
              if (!log) return null;

              const meta = log.metadata || {};
              const addr = meta.address || {};
              const env = meta.environment || {};
              const attr = meta.attribution || {};

              const city = log.city || addr.city;
              const region = log.region || addr.region;
              const country = log.country || addr.country || 'Global';
              const flag = log.country_flag || addr.country_flag || '🌐';
              const postal = log.postal_code || addr.postal_code;
              const formattedAddress =
                log.formatted_address ||
                addr.formatted_address ||
                `${city ? city + ', ' : ''}${region ? region + ', ' : ''}${country}`;
              const latitude = log.latitude ?? addr.latitude;
              const longitude = log.longitude ?? addr.longitude;
              const mapsUrl =
                log.maps_url ||
                addr.maps_url ||
                (latitude !== undefined && longitude !== undefined
                  ? `https://www.google.com/maps?q=${latitude},${longitude}`
                  : undefined);
              const isp = log.isp || addr.isp || 'Standard Provider';
              const org = log.organization || addr.organization || '';
              const timezone = log.timezone || addr.timezone || env.locale?.client_timezone || '';

              return (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-paper text-sm flex items-center gap-2">
                          <span>User Geolocation, Address &amp; Digital Fingerprint</span>
                          <span className="text-[10px] font-mono-tight text-secondary bg-secondary/10 px-2 py-0.5 rounded-full border border-secondary/20">
                            Session ID: {log.session_id.slice(0, 14)}...
                          </span>
                        </h4>
                        <span className="text-xs text-mist-2">
                          Logged {new Date(log.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {mapsUrl && (
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/15 hover:bg-secondary/25 border border-secondary/30 text-secondary text-xs font-medium transition-all"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>View on Google Maps</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => setExpandedLogId(null)}
                        className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs text-mist-1 hover:text-paper border border-(--line) transition-colors"
                      >
                        Close Details &times;
                      </button>
                    </div>
                  </div>

                  {/* 4 Multi-Dimension Telemetry Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                    {/* Card 1: Physical Address & Geolocation */}
                    <div className="glass rounded-xl p-4 border border-secondary/20 space-y-3 bg-secondary/[0.02]">
                      <div className="flex items-center gap-1.5 text-secondary font-mono-tight uppercase text-[11px] font-semibold">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Physical Address</span>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <span className="text-[10px] text-mist-2 uppercase font-mono-tight block">
                            Full Formatted Address
                          </span>
                          <p className="font-medium text-paper text-xs leading-relaxed mt-0.5 flex items-start gap-1.5">
                            <span className="text-base leading-none">{flag}</span>
                            <span>{formattedAddress || 'Local Network (Development)'}</span>
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/[0.06]">
                          <div>
                            <span className="text-[10px] text-mist-2 uppercase font-mono-tight block">
                              City &bull; State
                            </span>
                            <p className="text-paper truncate">
                              {city || '—'}, {region || '—'}
                            </p>
                          </div>
                          <div>
                            <span className="text-[10px] text-mist-2 uppercase font-mono-tight block">
                              Postal / Zip
                            </span>
                            <p className="text-paper">{postal || '—'}</p>
                          </div>
                        </div>

                        <div className="pt-1 border-t border-white/[0.06]">
                          <span className="text-[10px] text-mist-2 uppercase font-mono-tight block">
                            GPS Coordinates
                          </span>
                          <p className="font-mono text-paper text-[11px]">
                            {latitude !== undefined && longitude !== undefined
                              ? `${latitude}, ${longitude}`
                              : 'Not available'}
                          </p>
                        </div>

                        {timezone && (
                          <div className="pt-1 border-t border-white/[0.06]">
                            <span className="text-[10px] text-mist-2 uppercase font-mono-tight block">
                              Timezone
                            </span>
                            <p className="text-paper">{timezone}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card 2: Network & ISP Information */}
                    <div className="glass rounded-xl p-4 border border-primary/20 space-y-3 bg-primary/[0.02]">
                      <div className="flex items-center gap-1.5 text-accent-soft font-mono-tight uppercase text-[11px] font-semibold">
                        <Server className="w-3.5 h-3.5 text-primary" />
                        <span>Network &amp; Connectivity</span>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <span className="text-[10px] text-mist-2 uppercase font-mono-tight block">
                            IP Address
                          </span>
                          <div className="flex items-center justify-between mt-0.5">
                            <span className="font-mono text-paper text-xs font-semibold">
                              {log.ip_address || '127.0.0.1'}
                            </span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(log.ip_address || '127.0.0.1', 'IP Address')}
                              className="text-[10px] text-secondary hover:underline flex items-center gap-1"
                            >
                              {copiedIp === (log.ip_address || '127.0.0.1') ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                              <span>Copy</span>
                            </button>
                          </div>
                        </div>

                        <div className="pt-1 border-t border-white/[0.06]">
                          <span className="text-[10px] text-mist-2 uppercase font-mono-tight block">
                            ISP / Organization
                          </span>
                          <p className="text-paper font-medium truncate" title={isp}>
                            {isp}
                          </p>
                          {org && org !== isp && (
                            <p className="text-[10px] text-mist-2 truncate">{org}</p>
                          )}
                        </div>

                        {env.network && (
                          <div className="pt-1 border-t border-white/[0.06] space-y-1">
                            <span className="text-[10px] text-mist-2 uppercase font-mono-tight block">
                              Connection Telemetry
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {env.network.effective_type && (
                                <span className="px-1.5 py-0.5 rounded bg-white/[0.04] text-[10px] font-mono uppercase text-paper">
                                  Type: {env.network.effective_type}
                                </span>
                              )}
                              {env.network.downlink_mbps && (
                                <span className="px-1.5 py-0.5 rounded bg-white/[0.04] text-[10px] font-mono text-paper">
                                  Speed: {env.network.downlink_mbps} Mbps
                                </span>
                              )}
                              {env.network.rtt_ms && (
                                <span className="px-1.5 py-0.5 rounded bg-white/[0.04] text-[10px] font-mono text-paper">
                                  RTT: {env.network.rtt_ms}ms
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card 3: Device Hardware & Display Profile */}
                    <div className="glass rounded-xl p-4 border border-(--line) space-y-3">
                      <div className="flex items-center gap-1.5 text-secondary font-mono-tight uppercase text-[11px] font-semibold">
                        <Cpu className="w-3.5 h-3.5" />
                        <span>Device &amp; Hardware</span>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <span className="text-[10px] text-mist-2 uppercase font-mono-tight block">
                            OS &amp; Browser Engine
                          </span>
                          <p className="text-paper font-medium">
                            {log.os || 'Unknown OS'} &bull; {log.browser || 'Browser'}
                          </p>
                          <span className="text-[10px] text-mist-2 capitalize">
                            Form Factor: {log.device_type || 'Desktop'}
                          </span>
                        </div>

                        {env.display && (
                          <div className="pt-1 border-t border-white/[0.06] space-y-1">
                            <span className="text-[10px] text-mist-2 uppercase font-mono-tight block">
                              Display &amp; Viewport
                            </span>
                            <p className="text-paper font-mono text-[11px]">
                              Screen: {env.display.screen_resolution}
                            </p>
                            <p className="text-mist-2 font-mono text-[10px]">
                              Viewport: {env.display.viewport} &bull; DPR: {env.display.pixel_ratio}x
                            </p>
                          </div>
                        )}

                        {env.hardware && (
                          <div className="pt-1 border-t border-white/[0.06]">
                            <span className="text-[10px] text-mist-2 uppercase font-mono-tight block">
                              CPU &amp; Memory
                            </span>
                            <p className="text-paper text-[11px]">
                              {env.hardware.cpu_cores ? `${env.hardware.cpu_cores} Cores` : 'Cores: —'}{' '}
                              {env.hardware.device_memory_gb ? `&bull; ~${env.hardware.device_memory_gb} GB RAM` : ''}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card 4: Navigation, Attribution & Identity */}
                    <div className="glass rounded-xl p-4 border border-(--line) space-y-3">
                      <div className="flex items-center gap-1.5 text-mist-1 font-mono-tight uppercase text-[11px] font-semibold">
                        <Compass className="w-3.5 h-3.5 text-secondary" />
                        <span>Attribution &amp; Identity</span>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <span className="text-[10px] text-mist-2 uppercase font-mono-tight block">
                            Visitor Unique UUID
                          </span>
                          <p className="font-mono text-paper text-[11px] break-all select-all">
                            {log.visitor_id}
                          </p>
                        </div>

                        <div className="pt-1 border-t border-white/[0.06]">
                          <span className="text-[10px] text-mist-2 uppercase font-mono-tight block">
                            Referrer / Acquisition
                          </span>
                          <p className="text-paper truncate" title={log.referrer || 'Direct'}>
                            {attr.referrer_domain || log.referrer || 'Direct Visit (No Referrer)'}
                          </p>
                        </div>

                        {attr.utm_source && (
                          <div className="pt-1 border-t border-white/[0.06] space-y-0.5">
                            <span className="text-[10px] text-secondary uppercase font-mono-tight block">
                              UTM Campaign
                            </span>
                            <p className="text-paper text-[11px]">
                              Source: <strong>{attr.utm_source}</strong>
                              {attr.utm_medium ? ` &bull; Medium: ${attr.utm_medium}` : ''}
                            </p>
                          </div>
                        )}

                        {env.locale && (
                          <div className="pt-1 border-t border-white/[0.06]">
                            <span className="text-[10px] text-mist-2 uppercase font-mono-tight block">
                              Language Preference
                            </span>
                            <p className="text-paper font-mono text-[11px]">
                              {env.locale.languages || env.locale.language || 'en'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Raw Metadata JSON Inspector */}
                  {log.metadata && Object.keys(log.metadata).length > 0 && (
                    <div className="pt-2">
                      <details className="group">
                        <summary className="cursor-pointer text-xs font-mono-tight text-mist-2 hover:text-secondary flex items-center gap-1.5 transition-colors">
                          <Terminal className="w-3.5 h-3.5" />
                          <span>Inspect Full Raw Event Payload &amp; Telemetry JSON</span>
                        </summary>
                        <pre className="mt-3 p-4 rounded-xl bg-black/60 border border-white/5 font-mono text-[11px] text-cyan-300 overflow-x-auto max-h-72 leading-relaxed">
                          {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
