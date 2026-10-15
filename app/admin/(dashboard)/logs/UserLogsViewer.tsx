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
} from 'lucide-react';
import {
  getVisitorLogsAction,
  getVisitorStatsAction,
  clearVisitorLogsAction,
} from '@/app/actions/visitor-logs';
import type { VisitorLog, VisitorStats } from '@/types/visitor-log';

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

  const [isPending, startTransition] = useTransition();
  const [isClearing, startClearingTransition] = useTransition();
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Manual or automatic refresh
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
        });
        triggerToast('Activity logs cleared successfully.');
      }
    });
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (logs.length === 0) return;

    const headers = [
      'Timestamp',
      'Event Type',
      'Action Label',
      'Path',
      'Visitor ID',
      'Session ID',
      'Device',
      'Browser',
      'OS',
      'IP Address',
      'Country',
      'Referrer',
    ];

    const rows = logs.map((log) => [
      `"${log.created_at}"`,
      `"${log.event_type || ''}"`,
      `"${(log.action_label || '').replace(/"/g, '""')}"`,
      `"${log.path || ''}"`,
      `"${log.visitor_id || ''}"`,
      `"${log.session_id || ''}"`,
      `"${log.device_type || ''}"`,
      `"${log.browser || ''}"`,
      `"${log.os || ''}"`,
      `"${log.ip_address || ''}"`,
      `"${log.country || ''}"`,
      `"${(log.referrer || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rayida_visitor_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('Visitor logs exported to CSV.');
  };

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Event filter
      if (selectedEventType !== 'all' && log.event_type !== selectedEventType) {
        return false;
      }
      // Device filter
      if (selectedDevice !== 'all' && (log.device_type || 'desktop').toLowerCase() !== selectedDevice.toLowerCase()) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesPath = log.path?.toLowerCase().includes(q);
        const matchesAction = log.action_label?.toLowerCase().includes(q);
        const matchesVisitor = log.visitor_id?.toLowerCase().includes(q);
        const matchesBrowser = log.browser?.toLowerCase().includes(q);
        const matchesOS = log.os?.toLowerCase().includes(q);
        const matchesIp = log.ip_address?.toLowerCase().includes(q);
        if (!matchesPath && !matchesAction && !matchesVisitor && !matchesBrowser && !matchesOS && !matchesIp) {
          return false;
        }
      }
      return true;
    });
  }, [logs, selectedEventType, selectedDevice, searchQuery]);

  const formatRelativeTime = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffSec = Math.floor(diffMs / 1000);
      if (diffSec < 10) return 'Just now';
      if (diffSec < 60) return `${diffSec}s ago`;
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHr = Math.floor(diffMin / 60);
      if (diffHr < 24) return `${diffHr}h ago`;
      return `${Math.floor(diffHr / 24)}d ago`;
    } catch {
      return isoString;
    }
  };

  const getEventBadge = (type: string) => {
    switch (type) {
      case 'page_view':
        return {
          label: 'Page View',
          className: 'bg-primary/15 text-primary border-primary/30',
          icon: Eye,
        };
      case 'click_cta':
        return {
          label: 'CTA Click',
          className: 'bg-secondary/15 text-secondary border-secondary/30',
          icon: MousePointerClick,
        };
      case 'project_view':
        return {
          label: 'Project Case',
          className: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
          icon: Compass,
        };
      case 'theme_change':
        return {
          label: 'Theme Switch',
          className: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          icon: Palette,
        };
      case 'dwell_time':
        return {
          label: 'Dwell Time',
          className: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          icon: Timer,
        };
      case 'external_link':
        return {
          label: 'External Link',
          className: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
          icon: ExternalLink,
        };
      default:
        return {
          label: type,
          className: 'bg-white/10 text-mist-1 border-white/10',
          icon: Activity,
        };
    }
  };

  const getDeviceIcon = (device?: string) => {
    const d = (device || 'desktop').toLowerCase();
    if (d === 'mobile') return <Smartphone className="w-3.5 h-3.5 text-secondary" />;
    if (d === 'tablet') return <Tablet className="w-3.5 h-3.5 text-primary" />;
    return <Monitor className="w-3.5 h-3.5 text-mist-1" />;
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-ink-deep border border-secondary/30 shadow-2xl text-xs text-paper flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-(--line)">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono-tight text-secondary uppercase tracking-widest flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              Real-time Analytics
            </span>
            <span className="flex items-center gap-1.5 text-[11px] font-mono-tight text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Tracking Active
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold text-paper mt-1">
            Visitor &amp; User Activity Logs
          </h1>
          <p className="text-xs text-mist-2 mt-0.5">
            Monitor real-time visitors, page visits, CTA engagements, theme switches, and navigation sessions across Rayida Tech.
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
            title="Download CSV report"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
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

      {/* Analytics KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Events */}
        <div className="glass rounded-xl p-4 border border-(--line)">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-mist-2 font-mono-tight uppercase">Total Events</span>
            <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Activity className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-display font-bold text-paper">
            {stats.total_events.toLocaleString()}
          </p>
          <p className="text-[11px] text-mist-2 mt-0.5">
            {stats.total_page_views} page views recorded
          </p>
        </div>

        {/* Unique Visitors */}
        <div className="glass rounded-xl p-4 border border-(--line)">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-mist-2 font-mono-tight uppercase">Unique Visitors</span>
            <div className="w-7 h-7 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-display font-bold text-paper">
            {stats.unique_visitors.toLocaleString()}
          </p>
          <p className="text-[11px] text-mist-2 mt-0.5">
            Distinct devices identified
          </p>
        </div>

        {/* Today's Sessions */}
        <div className="glass rounded-xl p-4 border border-(--line)">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-mist-2 font-mono-tight uppercase">Active Today</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Compass className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-display font-bold text-paper">
            {stats.active_sessions_today}
          </p>
          <p className="text-[11px] text-mist-2 mt-0.5">
            Unique user sessions today
          </p>
        </div>

        {/* Device Breakdown */}
        <div className="glass rounded-xl p-4 border border-(--line)">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-mist-2 font-mono-tight uppercase">Devices</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-300">
              <Monitor className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <div className="flex items-center gap-1 text-xs">
              <Monitor className="w-3 h-3 text-mist-2" />
              <span className="font-semibold text-paper">{stats.device_breakdown.desktop}</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Smartphone className="w-3 h-3 text-secondary" />
              <span className="font-semibold text-paper">{stats.device_breakdown.mobile}</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Tablet className="w-3 h-3 text-primary" />
              <span className="font-semibold text-paper">{stats.device_breakdown.tablet}</span>
            </div>
          </div>
          <p className="text-[11px] text-mist-2 mt-2">
            Desktop / Mobile / Tablet
          </p>
        </div>
      </div>

      {/* Top Pages & Actions Highlights */}
      {stats.top_pages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Top Visited Pages */}
          <div className="glass rounded-xl p-4 border border-(--line)">
            <h3 className="text-xs font-mono-tight uppercase tracking-wider text-mist-2 mb-3 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-secondary" />
              <span>Most Visited Pages</span>
            </h3>
            <div className="space-y-2">
              {stats.top_pages.map((p) => {
                const percent = Math.round((p.count / (stats.total_page_views || 1)) * 100);
                return (
                  <div key={p.path} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-paper truncate max-w-[240px]">{p.path}</span>
                      <span className="text-mist-2 font-mono-tight">{p.count} views ({percent}%)</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                        style={{ width: `${Math.min(100, Math.max(8, percent))}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top User Actions */}
          <div className="glass rounded-xl p-4 border border-(--line)">
            <h3 className="text-xs font-mono-tight uppercase tracking-wider text-mist-2 mb-3 flex items-center gap-1.5">
              <MousePointerClick className="w-3.5 h-3.5 text-primary" />
              <span>Key User Interactions &amp; CTAs</span>
            </h3>
            {stats.top_actions.length > 0 ? (
              <div className="space-y-2">
                {stats.top_actions.map((act) => (
                  <div key={act.action} className="flex items-center justify-between text-xs py-1 border-b border-white/[0.04]">
                    <span className="text-paper truncate max-w-[260px]">{act.action}</span>
                    <span className="font-mono-tight text-secondary font-medium bg-secondary/10 px-2 py-0.5 rounded-full border border-secondary/20">
                      {act.count} times
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-mist-2 py-4">No custom action clicks recorded yet.</p>
            )}
          </div>
        </div>
      )}

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
              placeholder="Search by path, action, browser, OS, visitor ID, IP..."
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
            { id: 'external_link', label: 'External Links' },
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
                <th className="py-3 px-4">Action &amp; Target</th>
                <th className="py-3 px-4">Visitor / Session</th>
                <th className="py-3 px-4">Environment</th>
                <th className="py-3 px-4">Location &amp; IP</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--line)">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => {
                  const badge = getEventBadge(log.event_type);
                  const BadgeIcon = badge.icon;
                  const isExpanded = expandedLogId === log.id;

                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-white/[0.03] transition-colors group cursor-pointer"
                      onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                    >
                      {/* Event & Time */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
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

                      {/* Action & Target */}
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

                      {/* Visitor / Session */}
                      <td className="py-3 px-4 font-mono-tight text-[11px]">
                        <span className="text-paper bg-white/[0.05] px-1.5 py-0.5 rounded border border-white/10" title={`Visitor: ${log.visitor_id}`}>
                          {log.visitor_id.slice(0, 10)}...
                        </span>
                        <span className="text-mist-2 block text-[10px] mt-0.5 truncate max-w-[110px]" title={`Session: ${log.session_id}`}>
                          {log.session_id}
                        </span>
                      </td>

                      {/* Environment */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          {getDeviceIcon(log.device_type)}
                          <span className="text-paper font-medium">
                            {log.browser || 'Browser'}
                          </span>
                        </div>
                        <span className="text-[10px] text-mist-2 block mt-0.5">
                          {log.os || 'OS'} &bull; {log.device_type || 'desktop'}
                        </span>
                      </td>

                      {/* Location & IP */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-paper">
                          <Globe className="w-3 h-3 text-secondary" />
                          <span>{log.country || 'Local'}</span>
                          {log.city && <span className="text-mist-2">({log.city})</span>}
                        </div>
                        <span className="text-[10px] font-mono-tight text-mist-2 block mt-0.5">
                          {log.ip_address || '127.0.0.1'}
                        </span>
                      </td>

                      {/* Details Expander */}
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          className="p-1 rounded-lg text-mist-2 hover:text-paper hover:bg-white/5 transition-colors"
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
                          ? 'No activity matches your active search or filters. Try resetting filters.'
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

        {/* Expanded Row Drawer Details */}
        {expandedLogId && (
          <div className="p-5 bg-white/[0.02] border-t border-(--line) space-y-4">
            {(() => {
              const log = logs.find((l) => l.id === expandedLogId);
              if (!log) return null;

              return (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-mono-tight uppercase text-secondary flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Full Event Payload Details</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setExpandedLogId(null)}
                      className="text-xs text-mist-2 hover:text-paper"
                    >
                      Close Details &times;
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-mist-2 block text-[11px]">Exact Timestamp:</span>
                      <p className="font-mono text-paper">{new Date(log.created_at).toLocaleString()}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-mist-2 block text-[11px]">Referrer:</span>
                      <p className="text-paper truncate">{log.referrer || 'Direct Visit (No Referrer)'}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-mist-2 block text-[11px]">Visitor UUID:</span>
                      <p className="font-mono text-paper break-all">{log.visitor_id}</p>
                    </div>
                  </div>

                  {log.metadata && Object.keys(log.metadata).length > 0 && (
                    <div className="mt-3">
                      <span className="text-mist-2 block text-[11px] mb-1">Attached Metadata:</span>
                      <pre className="p-3 rounded-lg bg-black/40 border border-white/5 font-mono text-[11px] text-cyan-300 overflow-x-auto">
                        {JSON.stringify(log.metadata, null, 2)}
                      </pre>
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

