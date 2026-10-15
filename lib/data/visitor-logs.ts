import fs from 'fs';
import path from 'path';
import { createClient } from '@/lib/supabase/server';
import type { VisitorLog, VisitorStats, VisitorLogFilter } from '@/types/visitor-log';

const LOCAL_LOGS_FILE = path.join(process.cwd(), 'lib/data/visitor-logs.json');
const MAX_LOCAL_LOGS = 500;

function readLocalLogs(): VisitorLog[] {
  try {
    if (fs.existsSync(LOCAL_LOGS_FILE)) {
      const raw = fs.readFileSync(LOCAL_LOGS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Failed to read local visitor logs:', err);
  }
  return [];
}

function writeLocalLogs(logs: VisitorLog[]): void {
  try {
    const dir = path.dirname(LOCAL_LOGS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    // Retain only latest MAX_LOCAL_LOGS entries
    const trimmed = logs.slice(0, MAX_LOCAL_LOGS);
    fs.writeFileSync(LOCAL_LOGS_FILE, JSON.stringify(trimmed, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write local visitor logs:', err);
  }
}

export async function logVisitorActivity(
  entry: Omit<VisitorLog, 'id' | 'created_at'>
): Promise<{ success: boolean; id?: string; error?: string }> {
  const newLog: VisitorLog = {
    ...entry,
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `log_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    created_at: new Date().toISOString(),
  };

  // 1. Prepend to local JSON
  const currentLogs = readLocalLogs();
  currentLogs.unshift(newLog);
  writeLocalLogs(currentLogs);

  // 2. Insert to Supabase if available
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('visitor_logs')
      .insert({
        session_id: newLog.session_id,
        visitor_id: newLog.visitor_id,
        event_type: newLog.event_type,
        path: newLog.path,
        page_title: newLog.page_title,
        referrer: newLog.referrer,
        action_label: newLog.action_label,
        metadata: newLog.metadata || {},
        device_type: newLog.device_type,
        browser: newLog.browser,
        os: newLog.os,
        ip_address: newLog.ip_address,
        country: newLog.country,
        city: newLog.city,
        created_at: newLog.created_at,
      })
      .select('id')
      .maybeSingle();

    if (!error && data?.id) {
      newLog.id = data.id;
    }
  } catch (err) {
    // If Supabase table isn't migrated yet or connection drops, local log is preserved
  }

  return { success: true, id: newLog.id };
}

export async function getVisitorLogs(
  filter?: VisitorLogFilter
): Promise<VisitorLog[]> {
  const limit = filter?.limit || 200;

  try {
    const supabase = await createClient();
    let query = supabase
      .from('visitor_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (filter?.event_type && filter.event_type !== 'all') {
      query = query.eq('event_type', filter.event_type);
    }

    if (filter?.device_type && filter.device_type !== 'all') {
      query = query.eq('device_type', filter.device_type);
    }

    if (filter?.search) {
      const term = `%${filter.search}%`;
      query = query.or(`path.ilike.${term},action_label.ilike.${term},browser.ilike.${term},os.ilike.${term},visitor_id.ilike.${term}`);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data as VisitorLog[];
    }
  } catch {
    // Fall back to local
  }

  // Local fallback filtering
  let logs = readLocalLogs();

  if (filter?.event_type && filter.event_type !== 'all') {
    logs = logs.filter((l) => l.event_type === filter.event_type);
  }

  if (filter?.device_type && filter.device_type !== 'all') {
    logs = logs.filter((l) => l.device_type === filter.device_type);
  }

  if (filter?.search) {
    const q = filter.search.toLowerCase();
    logs = logs.filter(
      (l) =>
        (l.path && l.path.toLowerCase().includes(q)) ||
        (l.action_label && l.action_label.toLowerCase().includes(q)) ||
        (l.browser && l.browser.toLowerCase().includes(q)) ||
        (l.os && l.os.toLowerCase().includes(q)) ||
        (l.visitor_id && l.visitor_id.toLowerCase().includes(q))
    );
  }

  return logs.slice(0, limit);
}

export async function clearVisitorLogs(): Promise<{ success: boolean; error?: string }> {
  try {
    writeLocalLogs([]);

    const supabase = await createClient();
    await supabase.from('visitor_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to clear logs' };
  }
}

export async function getVisitorStats(): Promise<VisitorStats> {
  const logs = await getVisitorLogs({ limit: 500 });

  const totalEvents = logs.length;
  const pageViews = logs.filter((l) => l.event_type === 'page_view').length;

  const visitorSet = new Set<string>();
  const todaySessionSet = new Set<string>();
  const pageCountMap: Record<string, number> = {};
  const actionCountMap: Record<string, number> = {};
  const deviceCounts = { desktop: 0, mobile: 0, tablet: 0 };

  const todayStr = new Date().toISOString().slice(0, 10);

  for (const log of logs) {
    if (log.visitor_id) visitorSet.add(log.visitor_id);

    if (log.created_at && log.created_at.startsWith(todayStr) && log.session_id) {
      todaySessionSet.add(log.session_id);
    }

    if (log.path) {
      pageCountMap[log.path] = (pageCountMap[log.path] || 0) + 1;
    }

    if (log.action_label) {
      actionCountMap[log.action_label] = (actionCountMap[log.action_label] || 0) + 1;
    }

    const device = (log.device_type || 'desktop').toLowerCase();
    if (device === 'mobile') deviceCounts.mobile++;
    else if (device === 'tablet') deviceCounts.tablet++;
    else deviceCounts.desktop++;
  }

  const topPages = Object.entries(pageCountMap)
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topActions = Object.entries(actionCountMap)
    .map(([action, count]) => ({ action, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    total_events: totalEvents,
    total_page_views: pageViews,
    unique_visitors: visitorSet.size,
    active_sessions_today: todaySessionSet.size,
    top_pages: topPages,
    device_breakdown: deviceCounts,
    top_actions: topActions,
  };
}

