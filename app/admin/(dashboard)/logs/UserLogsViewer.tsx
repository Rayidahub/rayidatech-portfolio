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
  X,
  ShieldCheck,
  Split,
  Laptop,
} from 'lucide-react';
import {
  getVisitorLogsAction,
  getVisitorStatsAction,
  clearVisitorLogsAction,
} from '@/app/actions/visitor-logs';
import type {
  VisitorLog,
  VisitorStats,
  VisitorSessionGroup,
  DeviceType,
} from '@/types/visitor-log';
import {
  groupLogsByVisitor,
  formatDwellTime,
  getIpSummaryBadge,
  filterVisitorGroups,
} from '@/lib/data/visitor-grouping';

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
`;

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
  const [selectedDevice, setSelectedDevice] = useState<string>('all');
  const [selectedEventType, setSelectedEventType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grouped' | 'raw'>('grouped');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Full-screen / drawer modal selected visitor
  const [selectedVisitorForModal, setSelectedVisitorForModal] = useState<VisitorSessionGroup | null>(null);
  const [expandedRawLogId, setExpandedRawLogId] = useState<string | null>(null);

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

  // Group raw logs into 1 consolidated row per visitor
  const visitorGroups = useMemo(() => {
    return groupLogsByVisitor(logs);
  }, [logs]);

  // Filtered visitor groups for the main 1-line-per-visitor table
  const filteredVisitorGroups = useMemo(() => {
    return filterVisitorGroups(visitorGroups, {
      search: searchQuery,
      device: selectedDevice,
    });
  }, [visitorGroups, searchQuery, selectedDevice]);

  // Raw logs filtered (for raw stream view mode)
  const filteredRawLogs = useMemo(() => {
    return logs.filter((log) => {
      if (selectedEventType !== 'all' && log.event_type !== selectedEventType) {
        return false;
      }
      if (
        selectedDevice !== 'all' &&
        (log.device_type || 'desktop').toLowerCase() !== selectedDevice.toLowerCase()
      ) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          log.path?.toLowerCase().includes(q) ||
          log.action_label?.toLowerCase().includes(q) ||
          log.visitor_id?.toLowerCase().includes(q) ||
          log.ip_address?.toLowerCase().includes(q) ||
          log.country?.toLowerCase().includes(q) ||
          log.city?.toLowerCase().includes(q) ||
          log.region?.toLowerCase().includes(q) ||
          log.formatted_address?.toLowerCase().includes(q) ||
          log.isp?.toLowerCase().includes(q) ||
          log.browser?.toLowerCase().includes(q) ||
          log.os?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [logs, selectedEventType, selectedDevice, searchQuery]);

  // Clear logs action
  const handleClearLogs = () => {
    if (!confirm('Are you sure you want to clear all visitor activity logs? This action cannot be undone.')) {
      return;
    }

    startClearingTransition(async () => {
      const res = await clearVisitorLogsAction();
      if (res.success) {
        setLogs([]);
        setSelectedVisitorForModal(null);
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

    if (viewMode === 'grouped') {
      // Export aggregated visitor directory
      const headers = [
        'Primary IP',
        'All Tracked IPs',
        'Email / User',
        'Visitor ID',
        'Physical Address',
        'City',
        'Region / State',
        'Country',
        'ISP / Organization',
        'Devices Used',
        'Total Events',
        'Total Page Views',
        'Unique Pages Visited',
        'Total Dwell Seconds',
        'Total Dwell Formatted',
        'First Seen',
        'Last Active',
        'Recent Action',
      ];

      const rows = visitorGroups.map((g) => [
        `"${g.primary_ip}"`,
        `"${g.all_ips.map((i) => i.ip).join('; ')}"`,
        `"${g.email || ''}"`,
        `"${g.visitor_id}"`,
        `"${(g.formatted_address || '').replace(/"/g, '""')}"`,
        `"${(g.city || '').replace(/"/g, '""')}"`,
        `"${(g.region || '').replace(/"/g, '""')}"`,
        `"${(g.country || '').replace(/"/g, '""')}"`,
        `"${(g.primary_isp || '').replace(/"/g, '""')}"`,
        `"${g.devices.map((d) => `${d.browser} on ${d.os} (${d.device_type})`).join('; ')}"`,
        `"${g.total_events}"`,
        `"${g.total_page_views}"`,
        `"${g.unique_pages.join(', ')}"`,
        `"${g.total_dwell_seconds}"`,
        `"${formatDwellTime(g.total_dwell_seconds)}"`,
        `"${g.first_seen}"`,
        `"${g.last_active}"`,
        `"${(g.recent_action || '').replace(/"/g, '""')}"`,
      ]);

      const csvContent =
        'data:text/csv;charset=utf-8,\uFEFF' +
        [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `visitor-directory-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      triggerToast('Aggregated visitor directory exported to CSV.');
    } else {
      // Export raw event stream
      const headers = [
        'Timestamp',
        'Event Type',
        'Action Label',
        'Path',
        'Formatted Address',
        'City',
        'Region / State',
        'Country',
        'IP Address',
        'ISP',
        'Device Type',
        'Browser',
        'OS',
        'Visitor ID',
        'Session ID',
      ];

      const rows = logs.map((log) => [
        `"${log.created_at}"`,
        `"${log.event_type || ''}"`,
        `"${(log.action_label || '').replace(/"/g, '""')}"`,
        `"${log.path || ''}"`,
        `"${(log.formatted_address || '').replace(/"/g, '""')}"`,
        `"${(log.city || '').replace(/"/g, '""')}"`,
        `"${(log.region || '').replace(/"/g, '""')}"`,
        `"${(log.country || '').replace(/"/g, '""')}"`,
        `"${log.ip_address || ''}"`,
        `"${(log.isp || '').replace(/"/g, '""')}"`,
        `"${log.device_type || ''}"`,
        `"${log.browser || ''}"`,
        `"${log.os || ''}"`,
        `"${log.visitor_id || ''}"`,
        `"${log.session_id || ''}"`,
      ]);

      const csvContent =
        'data:text/csv;charset=utf-8,\uFEFF' +
        [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `visitor-events-raw-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      triggerToast('Raw visitor events exported to CSV.');
    }
  };

  const getEventBadge = (eventType: string) => {
    switch (eventType) {
      case 'page_view':
        return {
          label: 'Page View',
          className: 'bg-cyan-50 text-cyan-700 border-cyan-200/80',
          icon: Eye,
        };
      case 'click_cta':
        return {
          label: 'CTA Click',
          className: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
          icon: MousePointerClick,
        };
      case 'dwell_time':
        return {
          label: 'Dwell Time',
          className: 'bg-blue-50 text-[#3b5bfa] border-blue-200/80',
          icon: Timer,
        };
      case 'project_view':
        return {
          label: 'Project View',
          className: 'bg-purple-50 text-purple-700 border-purple-200/80',
          icon: Sparkles,
        };
      case 'theme_change':
        return {
          label: 'Theme Toggle',
          className: 'bg-amber-50 text-amber-700 border-amber-200/80',
          icon: Palette,
        };
      case 'external_link':
        return {
          label: 'Outbound',
          className: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: ExternalLink,
        };
      default:
        return {
          label: eventType || 'Action',
          className: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: Activity,
        };
    }
  };

  const getDeviceIcon = (deviceType?: string) => {
    const dt = (deviceType || 'desktop').toLowerCase();
    if (dt === 'mobile') return <Smartphone className="w-3.5 h-3.5 text-slate-500" />;
    if (dt === 'tablet') return <Tablet className="w-3.5 h-3.5 text-slate-500" />;
    return <Monitor className="w-3.5 h-3.5 text-slate-500" />;
  };

  const formatRelativeTime = (isoString: string): string => {
    try {
      const now = Date.now();
      const past = new Date(isoString).getTime();
      const diffSecs = Math.max(0, Math.floor((now - past) / 1000));

      if (diffSecs < 10) return 'Just now';
      if (diffSecs < 60) return `${diffSecs}s ago`;
      const diffMins = Math.floor(diffSecs / 60);
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const days = Math.floor(diffHours / 24);
      return `${days}d ago`;
    } catch {
      return isoString;
    }
  };

  const isRecentlyActive = (isoString: string): boolean => {
    try {
      const now = Date.now();
      const past = new Date(isoString).getTime();
      return now - past < 15 * 60 * 1000; // active in last 15 mins
    } catch {
      return false;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white text-xs shadow-2xl backdrop-blur-md animate-fade-in border border-slate-700">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#3b5bfa] uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              Visitor Telemetry &amp; Geolocation
            </span>
            <span className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Address Tracking
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Visitor Activity Logs
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            One line per unique visitor or IP. Click any visitor to open their complete timeline of pages, dwell times, and network telemetry.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="inline-flex rounded-xl bg-slate-100 p-0.5 border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('grouped')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'grouped'
                  ? 'bg-white text-[#3b5bfa] shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Consolidate activity: One line per visitor/IP"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Grouped by Visitor ({visitorGroups.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('raw')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'raw'
                  ? 'bg-white text-[#3b5bfa] shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Show all individual event hits"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Raw Stream ({logs.length})</span>
            </button>
          </div>

          {/* Auto Refresh Toggle */}
          <button
            type="button"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
              autoRefresh
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title={autoRefresh ? 'Auto-refresh active (every 8s)' : 'Auto-refresh paused'}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${autoRefresh ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`}
            />
            <span>{autoRefresh ? 'Live ON' : 'Paused'}</span>
          </button>

          {/* Manual Refresh Button */}
          <button
            type="button"
            onClick={refreshLogs}
            disabled={isPending}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium transition-all disabled:opacity-50 shadow-sm"
            title="Refresh logs now"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPending ? 'animate-spin text-[#3b5bfa]' : 'text-slate-500'}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={logs.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium transition-all disabled:opacity-50 shadow-sm"
            title="Download CSV export"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          {/* Clear Logs */}
          <button
            type="button"
            onClick={handleClearLogs}
            disabled={isClearing || logs.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs text-rose-700 font-medium transition-all disabled:opacity-50"
            title="Clear all logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Database Table Notice & Upgrade SQL */}
      {stats.is_table_missing && (
        <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                  <span>Supabase Database Setup: &apos;visitor_logs&apos; table</span>
                  <span className="text-[10px] font-mono text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-full border border-amber-300">
                    Action Needed
                  </span>
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-2xl">
                  Run the migration SQL in your Supabase SQL Editor once to store full visitor address history, coordinates, and network telemetry permanently in the cloud.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={copySetupSql}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs shadow-sm transition-all"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Copied SQL!' : 'Copy Supabase SQL'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSqlCode(!showSqlCode)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs border border-slate-200 transition-colors shadow-sm"
              >
                <Terminal className="w-3.5 h-3.5 text-[#3b5bfa]" />
                <span>{showSqlCode ? 'Hide SQL Script' : 'View SQL Script'}</span>
              </button>

              <a
                href="https://supabase.com/dashboard/project/grtvnrqzmbndbjljramm/sql/new"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-600 text-xs border border-slate-200 transition-colors"
              >
                <span>Open Supabase</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {showSqlCode && (
            <div className="mt-4 pt-4 border-t border-amber-200">
              <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-amber-200 overflow-x-auto max-h-60 overflow-y-auto leading-relaxed select-all">
                {SETUP_SQL}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Primary KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Unique Visitors */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
              Unique Visitors
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#3b5bfa]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            {visitorGroups.length || stats.unique_visitors}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block font-mono">
            Unique IPs &amp; individual systems
          </span>
        </div>

        {/* Total Page Views */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
              Total Page Views
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            {stats.total_page_views.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block font-mono">
            Across portfolio &amp; case studies
          </span>
        </div>

        {/* Total Interaction Hits */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
              Total Telemetry Hits
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            {stats.total_events.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block font-mono">
            Dwells, clicks &amp; navigations
          </span>
        </div>

        {/* Sessions Today */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
              Sessions Today
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            {stats.active_sessions_today.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block font-mono">
            Updated {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by IP, city, state, country, ISP, email, or page..."
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:border-[#3b5bfa] focus:bg-white focus:ring-1 focus:ring-[#3b5bfa]/20 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* Device Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Device:
            </span>
            {['all', 'desktop', 'mobile', 'tablet'].map((dev) => (
              <button
                key={dev}
                type="button"
                onClick={() => setSelectedDevice(dev)}
                className={`px-3 py-1 rounded-lg text-xs font-mono capitalize transition-all ${
                  selectedDevice === dev
                    ? 'bg-[#3b5bfa] text-white font-medium shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                {dev}
              </button>
            ))}
          </div>
        </div>

        {/* View mode indicator banner */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">
              {viewMode === 'grouped' ? 'One Row per Visitor:' : 'Raw Stream View:'}
            </span>
            <span>
              {viewMode === 'grouped'
                ? `Showing ${filteredVisitorGroups.length} unique visitor${filteredVisitorGroups.length === 1 ? '' : 's'} (${logs.length} total events aggregated)`
                : `Showing ${filteredRawLogs.length} raw events`}
            </span>
          </div>

          {viewMode === 'grouped' && (
            <span className="text-[11px] text-[#3b5bfa] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100 font-medium">
              💡 Click any visitor row to open their full page-by-page timeline
            </span>
          )}
        </div>
      </div>

      {/* Main Table: Grouped View (1 Line Per Visitor) OR Raw Stream */}
      {viewMode === 'grouped' ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 font-mono uppercase text-[11px] tracking-wider">
                  <th className="py-3 px-4 font-semibold">Visitor &amp; Status</th>
                  <th className="py-3 px-4 font-semibold">Activity &amp; Dwell Time</th>
                  <th className="py-3 px-4 font-semibold">User Physical Address</th>
                  <th className="py-3 px-4 font-semibold">Network &amp; ISP</th>
                  <th className="py-3 px-4 font-semibold">Hardware &amp; OS</th>
                  <th className="py-3 px-4 font-semibold text-right">Journey Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVisitorGroups.length > 0 ? (
                  filteredVisitorGroups.map((group) => {
                    const ipBadge = getIpSummaryBadge(group.all_ips);
                    const isActive = isRecentlyActive(group.last_active);
                    const primaryDevice = group.devices[0] || { browser: 'Browser', os: 'OS', device_type: 'desktop' };
                    const hasMobile = group.devices.some((d) => d.device_type === 'mobile');

                    return (
                      <tr
                        key={group.visitor_key}
                        onClick={() => setSelectedVisitorForModal(group)}
                        className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      >
                        {/* Visitor & Status */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <span
                                className={`w-2.5 h-2.5 rounded-full inline-block ${
                                  isActive ? 'bg-emerald-500 ring-4 ring-emerald-100' : 'bg-slate-300'
                                }`}
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-slate-900 font-bold text-xs">
                                  {group.primary_ip}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(group.primary_ip, 'IP Address');
                                  }}
                                  className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors"
                                  title="Copy IP"
                                >
                                  {copiedIp === group.primary_ip ? (
                                    <Check className="w-3 h-3 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                              <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {formatRelativeTime(group.last_active)}
                                </span>
                                {group.email ? (
                                  <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                                    {group.email}
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]" title={group.visitor_id}>
                                    ID: {group.visitor_id.slice(0, 10)}...
                                  </span>
                                )}
                              </div>
                              {/* Multi-IP badge */}
                              {ipBadge.isMultiIp && (
                                <div className="mt-1">
                                  <span
                                    className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 font-medium"
                                    title={`This visitor used ${ipBadge.count} different IP addresses (e.g. WiFi vs Mobile)`}
                                  >
                                    <Split className="w-2.5 h-2.5" />
                                    <span>{ipBadge.label}</span>
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Activity & Dwell Time */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <p className="font-semibold text-slate-900 truncate" title={group.recent_action}>
                            {group.recent_action}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                            <span className="inline-flex items-center gap-1 text-[#3b5bfa] font-medium bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                              <Eye className="w-3 h-3" />
                              <span>{group.unique_pages.length} pages</span>
                            </span>
                            <span className="font-mono text-slate-500">
                              {group.total_events} events
                            </span>
                            {group.total_dwell_seconds > 0 && (
                              <span className="inline-flex items-center gap-1 text-slate-600 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                                <Timer className="w-3 h-3 text-slate-400" />
                                <span>{formatDwellTime(group.total_dwell_seconds)}</span>
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Physical Address */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 text-slate-900">
                            <span className="text-base shrink-0" role="img" aria-label="country flag">
                              {group.country_flag || '🌐'}
                            </span>
                            <span className="font-semibold truncate max-w-[190px]">
                              {group.city ? `${group.city}, ` : ''}
                              {group.region ? `${group.region}, ` : ''}
                              {group.country}
                            </span>
                            {group.maps_url && (
                              <a
                                href={group.maps_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="p-1 rounded text-slate-400 hover:text-[#3b5bfa] hover:bg-slate-100 transition-colors"
                                title="Open on Google Maps"
                              >
                                <MapPin className="w-3.5 h-3.5 text-[#3b5bfa]" />
                              </a>
                            )}
                          </div>
                          <span
                            className="text-[10px] text-slate-400 block mt-0.5 truncate max-w-[210px]"
                            title={group.formatted_address || group.primary_ip}
                          >
                            {group.postal_code ? `Postal: ${group.postal_code} • ` : ''}
                            {group.formatted_address || group.primary_ip}
                          </span>
                        </td>

                        {/* Network & ISP */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <Radio className="w-3.5 h-3.5 text-[#3b5bfa] shrink-0" />
                            <span className="text-slate-900 font-semibold truncate max-w-[180px]" title={group.primary_isp}>
                              {group.primary_isp || 'Standard Network'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-[10px] font-mono text-slate-400">
                              {group.primary_ip}
                            </span>
                            {group.all_ips.length > 1 && (
                              <span className="text-[9px] font-mono text-blue-700 bg-blue-50 px-1 rounded border border-blue-100">
                                {group.all_ips.length} IPs
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Hardware & OS */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            {getDeviceIcon(primaryDevice.device_type)}
                            <span className="text-slate-900 font-medium">
                              {primaryDevice.browser}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-[10px] text-slate-400 truncate max-w-[140px]">
                              {primaryDevice.os} &bull; {primaryDevice.device_type}
                            </span>
                            {hasMobile && primaryDevice.device_type !== 'mobile' && (
                              <span className="text-[9px] font-mono text-purple-700 bg-purple-50 px-1 rounded border border-purple-100">
                                +Mobile
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Journey Details Action */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedVisitorForModal(group);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#3b5bfa]/10 hover:bg-[#3b5bfa] text-[#3b5bfa] hover:text-white font-medium text-xs transition-all shadow-sm group-hover:bg-[#3b5bfa] group-hover:text-white"
                          >
                            <span>View Journey</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 px-4 text-center">
                      <div className="max-w-sm mx-auto space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
                          <Users className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm">
                          No Visitors Found
                        </h3>
                        <p className="text-xs text-slate-500">
                          {searchQuery || selectedDevice !== 'all'
                            ? 'No visitors match your active search or filter. Try clearing the filter.'
                            : 'Live visitor records will appear here as visitors browse your portfolio.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Raw Stream View (All individual events) */
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 font-mono uppercase text-[11px] tracking-wider">
                  <th className="py-3 px-4 font-semibold">Event &amp; Time</th>
                  <th className="py-3 px-4 font-semibold">Action &amp; Path</th>
                  <th className="py-3 px-4 font-semibold">User Physical Address</th>
                  <th className="py-3 px-4 font-semibold">Network &amp; ISP</th>
                  <th className="py-3 px-4 font-semibold">Hardware &amp; OS</th>
                  <th className="py-3 px-4 font-semibold text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRawLogs.length > 0 ? (
                  filteredRawLogs.map((log) => {
                    const badge = getEventBadge(log.event_type);
                    const BadgeIcon = badge.icon;
                    const isExpanded = expandedRawLogId === log.id;
                    const city = log.city || '';
                    const region = log.region || '';
                    const country = log.country || 'Global';
                    const flag = log.country_flag || '🌐';

                    return (
                      <tr
                        key={log.id}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                        onClick={() => setExpandedRawLogId(isExpanded ? null : log.id)}
                      >
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono border ${badge.className}`}>
                            <BadgeIcon className="w-2.5 h-2.5" />
                            <span>{badge.label}</span>
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono block mt-1">
                            {formatRelativeTime(log.created_at)}
                          </span>
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <p className="font-semibold text-slate-900 truncate" title={log.action_label}>
                            {log.action_label || `Visited ${log.path}`}
                          </p>
                          <Link
                            href={log.path}
                            target="_blank"
                            onClick={(e) => e.stopPropagation()}
                            className="font-mono text-[11px] text-[#3b5bfa] hover:underline truncate block"
                          >
                            {log.path}
                          </Link>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 text-slate-900 font-medium">
                            <span>{flag}</span>
                            <span>{city ? `${city}, ` : ''}{country}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5 truncate max-w-[200px]">
                            {log.formatted_address || log.ip_address}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-slate-900 font-medium block truncate max-w-[170px]">
                            {log.isp || 'Standard Network'}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {log.ip_address || '127.0.0.1'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-slate-900 font-medium block">
                            {log.browser || 'Browser'}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {log.os || 'OS'} &bull; {log.device_type || 'desktop'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <ChevronDown
                            className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180 text-[#3b5bfa]' : ''}`}
                          />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 px-4 text-center text-slate-400">
                      No events found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FULL VISITOR JOURNEY & AUDIT TRAIL MODAL DRAWER */}
      {selectedVisitorForModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedVisitorForModal(null)}
        >
          <div
            className="w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-blue-50/50 via-slate-50 to-white flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white border border-blue-100 shadow-sm flex items-center justify-center text-2xl shrink-0">
                  {selectedVisitorForModal.country_flag || '🌐'}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">
                      Visitor Journey &amp; Activity History
                    </h2>
                    <span className="text-[11px] font-mono text-[#3b5bfa] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 font-semibold">
                      {selectedVisitorForModal.total_events} Total Actions
                    </span>
                    {isRecentlyActive(selectedVisitorForModal.last_active) && (
                      <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Active Session
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                    <span>First seen: {new Date(selectedVisitorForModal.first_seen).toLocaleString()}</span>
                    <span>&bull;</span>
                    <span>Last active: {new Date(selectedVisitorForModal.last_active).toLocaleString()} ({formatRelativeTime(selectedVisitorForModal.last_active)})</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedVisitorForModal(null)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors shrink-0"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Visitor Identity & Telemetry Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Geolocation Card */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 uppercase font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-[#3b5bfa]" />
                    <span>Physical Location</span>
                  </div>
                  <p className="font-bold text-slate-900 text-sm">
                    {selectedVisitorForModal.city ? `${selectedVisitorForModal.city}, ` : ''}
                    {selectedVisitorForModal.region ? `${selectedVisitorForModal.region}, ` : ''}
                    {selectedVisitorForModal.country}
                  </p>
                  <p className="text-[11px] text-slate-500 leading-relaxed truncate" title={selectedVisitorForModal.formatted_address}>
                    {selectedVisitorForModal.formatted_address || 'Address registered on network'}
                  </p>
                  {selectedVisitorForModal.maps_url && (
                    <a
                      href={selectedVisitorForModal.maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[#3b5bfa] hover:underline font-medium pt-1"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>View on Google Maps</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>

                {/* Tracked IP Addresses & Network */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 uppercase font-semibold">
                      <Wifi className="w-3.5 h-3.5 text-[#3b5bfa]" />
                      <span>Tracked IPs ({selectedVisitorForModal.all_ips.length})</span>
                    </div>
                    {selectedVisitorForModal.all_ips.length > 1 && (
                      <span className="text-[9px] font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        Multi-Network
                      </span>
                    )}
                  </div>
                  <div className="space-y-1.5 max-h-24 overflow-y-auto">
                    {selectedVisitorForModal.all_ips.map((ipRecord) => (
                      <div
                        key={ipRecord.ip}
                        className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-white border border-slate-200/70"
                      >
                        <div className="flex items-center gap-1.5">
                          {getDeviceIcon(ipRecord.device_type)}
                          <span className="font-mono font-bold text-slate-800">
                            {ipRecord.ip}
                          </span>
                          {ipRecord.is_primary && (
                            <span className="text-[9px] font-mono text-blue-700 bg-blue-50 px-1 rounded">
                              Primary
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(ipRecord.ip, 'IP')}
                          className="text-slate-400 hover:text-slate-700 p-0.5 rounded"
                          title="Copy IP"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate" title={selectedVisitorForModal.primary_isp}>
                    ISP: {selectedVisitorForModal.primary_isp}
                  </p>
                </div>

                {/* Systems & Engagement Summary */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 uppercase font-semibold">
                    <Timer className="w-3.5 h-3.5 text-[#3b5bfa]" />
                    <span>Engagement &amp; Dwell Time</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Total Dwell Time:</span>
                      <span className="font-mono font-bold text-slate-900">
                        {formatDwellTime(selectedVisitorForModal.total_dwell_seconds)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Pages Explored:</span>
                      <span className="font-mono font-bold text-slate-900">
                        {selectedVisitorForModal.unique_pages.length} unique
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Total Actions:</span>
                      <span className="font-mono font-bold text-slate-900">
                        {selectedVisitorForModal.total_events}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Complete Chronological Journey Timeline */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#3b5bfa]" />
                    <span>Complete Chronological Journey ({selectedVisitorForModal.events.length} Actions)</span>
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    Newest actions first
                  </span>
                </div>

                {/* Vertical Timeline */}
                <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                  {selectedVisitorForModal.events.map((event, idx) => {
                    const badge = getEventBadge(event.event_type);
                    const BadgeIcon = badge.icon;
                    const eventDwell =
                      event.metadata?.dwell_seconds ||
                      (event.action_label?.match(/spent\s+(\d+)s/i)?.[1]);

                    return (
                      <div key={event.id || idx} className="relative group">
                        {/* Timeline node dot */}
                        <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white border-2 border-[#3b5bfa] flex items-center justify-center text-[10px] text-[#3b5bfa] font-mono shadow-sm">
                          {selectedVisitorForModal.events.length - idx}
                        </div>

                        {/* Event Card */}
                        <div className="p-4 rounded-xl bg-slate-50/70 hover:bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono border font-medium ${badge.className}`}>
                                <BadgeIcon className="w-2.5 h-2.5" />
                                <span>{badge.label}</span>
                              </span>
                              <span className="font-semibold text-slate-900">
                                {event.action_label || `Visited ${event.path}`}
                              </span>
                            </div>

                            <span className="text-[11px] font-mono text-slate-400">
                              {new Date(event.created_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                              })} ({formatRelativeTime(event.created_at)})
                            </span>
                          </div>

                          {/* Event Details Row */}
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
                            {/* Path link */}
                            <div className="flex items-center gap-1 font-mono text-[11px]">
                              <span className="text-slate-400">Path:</span>
                              <Link
                                href={event.path}
                                target="_blank"
                                className="text-[#3b5bfa] hover:underline font-semibold flex items-center gap-0.5"
                              >
                                <span>{event.path}</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </Link>
                            </div>

                            {/* Dwell time badge if present */}
                            {eventDwell && (
                              <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-[10px] font-mono font-medium">
                                <Timer className="w-3 h-3" />
                                <span>Dwell: {eventDwell}s</span>
                              </span>
                            )}

                            {/* Device & IP used for this event */}
                            <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500">
                              {getDeviceIcon(event.device_type)}
                              <span>{event.browser} on {event.os}</span>
                              <span>&bull;</span>
                              <span>{event.ip_address}</span>
                            </div>
                          </div>

                          {/* Metadata inspection */}
                          {event.metadata && Object.keys(event.metadata).length > 0 && (
                            <details className="mt-2 text-[11px] font-mono text-slate-500">
                              <summary className="cursor-pointer hover:text-[#3b5bfa] transition-colors select-none">
                                View Technical Payload JSON
                              </summary>
                              <pre className="mt-1.5 p-3 rounded-lg bg-slate-900 text-slate-200 text-[10px] overflow-x-auto leading-relaxed">
                                {JSON.stringify(event.metadata, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span>Visitor ID: {selectedVisitorForModal.visitor_id}</span>
              <button
                type="button"
                onClick={() => setSelectedVisitorForModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium transition-colors shadow-sm"
              >
                Close Journey
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
