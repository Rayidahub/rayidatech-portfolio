import fs from 'fs';
import path from 'path';
import { createClient } from '@/lib/supabase/server';
import type { VisitorLog, VisitorStats, VisitorLogFilter, DeviceType } from '@/types/visitor-log';

const MAX_LOCAL_LOGS = 500;

function getStoragePath(): string {
  // If running in serverless (e.g. Vercel), process.cwd() is read-only outside /tmp
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join('/tmp', 'visitor-logs.json');
  }
  return path.join(/*turbopackIgnore: true*/ process.cwd(), 'lib/data/visitor-logs.json');
}

function readLocalLogs(): VisitorLog[] {
  const primaryPath = getStoragePath();
  const fallbackPath = path.join(/*turbopackIgnore: true*/ process.cwd(), 'lib/data/visitor-logs.json');

  for (const filePath of [primaryPath, fallbackPath]) {
    try {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Continue to next path
    }
  }
  return [];
}

function writeLocalLogs(logs: VisitorLog[]): void {
  const filePath = getStoragePath();
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const trimmed = logs.slice(0, MAX_LOCAL_LOGS);
    fs.writeFileSync(filePath, JSON.stringify(trimmed, null, 2), 'utf-8');
  } catch (err) {
    // If writing to default fails, attempt writing to /tmp
    try {
      const tmpPath = path.join('/tmp', 'visitor-logs.json');
      const trimmed = logs.slice(0, MAX_LOCAL_LOGS);
      fs.writeFileSync(tmpPath, JSON.stringify(trimmed, null, 2), 'utf-8');
    } catch {
      // Silently ignore if both filesystems are blocked
    }
  }
}

export function parseUserAgent(uaString: string): {
  device_type: DeviceType;
  browser: string;
  os: string;
} {
  const ua = uaString || '';
  let device_type: DeviceType = 'desktop';
  let browser = 'Unknown Browser';
  let os = 'Unknown OS';

  // Device detection
  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    device_type = 'tablet';
  } else if (/mobile|iphone|ipod|android|blackberry|opera mini|windows phone/i.test(ua)) {
    device_type = 'mobile';
  } else {
    device_type = 'desktop';
  }

  // OS detection
  if (/windows/i.test(ua)) os = 'Windows';
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  else if (/linux/i.test(ua)) os = 'Linux';

  // Browser detection
  if (/edg\//i.test(ua)) browser = 'Edge';
  else if (/opr\/|opera/i.test(ua)) browser = 'Opera';
  else if (/chrome|crios/i.test(ua)) browser = 'Chrome';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/safari/i.test(ua)) browser = 'Safari';

  return { device_type, browser, os };
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

    if (error) {
      console.warn('Supabase visitor_logs insert notice:', error.code, error.message);
    } else if (data?.id) {
      newLog.id = data.id;
    }
  } catch (err: any) {
    console.warn('Supabase visitor_logs exception:', err?.message);
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
  let isTableMissing = false;

  try {
    const supabase = await createClient();
    const { error } = await supabase.from('visitor_logs').select('id').limit(1);
    if (error && error.code === 'PGRST205') {
      isTableMissing = true;
    }
  } catch {
    // ignore
  }

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
    is_table_missing: isTableMissing,
  };
}
