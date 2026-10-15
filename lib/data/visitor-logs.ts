import fs from 'fs';
import path from 'path';
import { createClient } from '@/lib/supabase/server';
import type { VisitorLog, VisitorStats, VisitorLogFilter, DeviceType } from '@/types/visitor-log';
import { getCountryFlag, buildFormattedAddress } from '@/lib/data/ip-geo';

const MAX_LOCAL_LOGS = 500;

function getStoragePath(): string {
  // If running in serverless (e.g. Vercel), process.cwd() is read-only outside /tmp
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join('/tmp', 'visitor-logs.json');
  }
  return path.join(process.cwd(), 'lib', 'data', 'visitor-logs.json');
}

function readLocalLogs(): VisitorLog[] {
  const primaryPath = getStoragePath();
  const fallbackPath = path.join(process.cwd(), 'lib', 'data', 'visitor-logs.json');

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

function normalizeLog(log: VisitorLog): VisitorLog {
  const metaAddr = log.metadata?.address || {};
  const region = log.region || metaAddr.region || '';
  const postal_code = log.postal_code || metaAddr.postal_code || '';
  const country = log.country || metaAddr.country || 'Global';
  const city = log.city || metaAddr.city || '';
  const country_code = log.country_code || metaAddr.country_code || '';
  const country_flag = log.country_flag || metaAddr.country_flag || getCountryFlag(country_code);
  const formatted_address =
    log.formatted_address ||
    metaAddr.formatted_address ||
    buildFormattedAddress({ city, region, postal_code, country });
  const latitude = log.latitude ?? metaAddr.latitude;
  const longitude = log.longitude ?? metaAddr.longitude;
  const maps_url =
    log.maps_url ||
    metaAddr.maps_url ||
    (latitude !== undefined && longitude !== undefined
      ? `https://www.google.com/maps?q=${latitude},${longitude}`
      : undefined);
  const isp = log.isp || metaAddr.isp || '';
  const organization = log.organization || metaAddr.organization || '';
  const timezone = log.timezone || metaAddr.timezone || '';

  return {
    ...log,
    region,
    postal_code,
    country,
    country_code,
    country_flag,
    city,
    formatted_address,
    latitude,
    longitude,
    maps_url,
    isp,
    organization,
    timezone,
  };
}

export async function logVisitorActivity(
  entry: Omit<VisitorLog, 'id' | 'created_at'>
): Promise<{ success: boolean; id?: string; error?: string }> {
  const metaAddr = entry.metadata?.address || {};
  const country = entry.country || metaAddr.country || 'Global';
  const city = entry.city || metaAddr.city || '';
  const region = entry.region || metaAddr.region || '';
  const postal_code = entry.postal_code || metaAddr.postal_code || '';
  const country_code = entry.country_code || metaAddr.country_code || '';
  const country_flag = entry.country_flag || metaAddr.country_flag || getCountryFlag(country_code);
  const formatted_address =
    entry.formatted_address ||
    metaAddr.formatted_address ||
    buildFormattedAddress({ city, region, postal_code, country });
  const latitude = entry.latitude ?? metaAddr.latitude;
  const longitude = entry.longitude ?? metaAddr.longitude;
  const maps_url =
    entry.maps_url ||
    metaAddr.maps_url ||
    (latitude !== undefined && longitude !== undefined
      ? `https://www.google.com/maps?q=${latitude},${longitude}`
      : undefined);
  const isp = entry.isp || metaAddr.isp || '';
  const organization = entry.organization || metaAddr.organization || '';
  const timezone = entry.timezone || metaAddr.timezone || '';

  const enrichedMetadata = {
    ...(entry.metadata || {}),
    address: {
      ...(entry.metadata?.address || {}),
      formatted_address,
      city,
      region,
      postal_code,
      country,
      country_code,
      country_flag,
      latitude,
      longitude,
      maps_url,
      isp,
      organization,
      timezone,
    },
  };

  const newLog: VisitorLog = {
    ...entry,
    country,
    country_code,
    country_flag,
    city,
    region,
    postal_code,
    formatted_address,
    latitude,
    longitude,
    maps_url,
    isp,
    organization,
    timezone,
    metadata: enrichedMetadata,
    id:
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `log_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    created_at: new Date().toISOString(),
  };

  // 1. Prepend to local JSON storage
  const currentLogs = readLocalLogs();
  currentLogs.unshift(newLog);
  writeLocalLogs(currentLogs);

  // 2. Insert to Supabase if available
  try {
    const supabase = await createClient();

    // Try full insert with address columns
    const fullPayload: Record<string, any> = {
      session_id: newLog.session_id,
      visitor_id: newLog.visitor_id,
      event_type: newLog.event_type,
      path: newLog.path,
      page_title: newLog.page_title,
      referrer: newLog.referrer,
      action_label: newLog.action_label,
      metadata: newLog.metadata,
      device_type: newLog.device_type,
      browser: newLog.browser,
      os: newLog.os,
      ip_address: newLog.ip_address,
      country: newLog.country,
      city: newLog.city,
      region: newLog.region,
      postal_code: newLog.postal_code,
      formatted_address: newLog.formatted_address,
      latitude: newLog.latitude,
      longitude: newLog.longitude,
      isp: newLog.isp,
      organization: newLog.organization,
      timezone: newLog.timezone,
      country_code: newLog.country_code,
      created_at: newLog.created_at,
    };

    const { data, error } = await supabase
      .from('visitor_logs')
      .insert(fullPayload)
      .select('id')
      .maybeSingle();

    if (error) {
      // If error is due to missing new columns in Supabase, fall back to base columns
      if (error.message?.includes('column') || error.code === '42703') {
        const basePayload = {
          session_id: newLog.session_id,
          visitor_id: newLog.visitor_id,
          event_type: newLog.event_type,
          path: newLog.path,
          page_title: newLog.page_title,
          referrer: newLog.referrer,
          action_label: newLog.action_label,
          metadata: newLog.metadata, // Contains complete address object
          device_type: newLog.device_type,
          browser: newLog.browser,
          os: newLog.os,
          ip_address: newLog.ip_address,
          country: newLog.country,
          city: newLog.city,
          created_at: newLog.created_at,
        };

        const fallbackInsert = await supabase
          .from('visitor_logs')
          .insert(basePayload)
          .select('id')
          .maybeSingle();

        if (fallbackInsert.data?.id) {
          newLog.id = fallbackInsert.data.id;
        }
      } else {
        console.warn('Supabase visitor_logs insert notice:', error.code, error.message);
      }
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
      query = query.or(
        `path.ilike.${term},action_label.ilike.${term},browser.ilike.${term},os.ilike.${term},visitor_id.ilike.${term},ip_address.ilike.${term},city.ilike.${term},country.ilike.${term}`
      );
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return (data as VisitorLog[]).map(normalizeLog);
    }
  } catch {
    // Fall back to local
  }

  // Local fallback filtering
  let logs = readLocalLogs().map(normalizeLog);

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
        (l.visitor_id && l.visitor_id.toLowerCase().includes(q)) ||
        (l.ip_address && l.ip_address.toLowerCase().includes(q)) ||
        (l.country && l.country.toLowerCase().includes(q)) ||
        (l.city && l.city.toLowerCase().includes(q)) ||
        (l.region && l.region.toLowerCase().includes(q)) ||
        (l.postal_code && l.postal_code.toLowerCase().includes(q)) ||
        (l.formatted_address && l.formatted_address.toLowerCase().includes(q)) ||
        (l.isp && l.isp.toLowerCase().includes(q))
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
  const locationCountMap: Record<string, { count: number; flag?: string }> = {};
  const ispCountMap: Record<string, number> = {};
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

    // Location aggregation
    const locLabel =
      log.city && log.country
        ? `${log.city}, ${log.country}`
        : log.country || 'Global';
    if (locLabel && locLabel !== 'Local Development Network') {
      if (!locationCountMap[locLabel]) {
        locationCountMap[locLabel] = { count: 0, flag: log.country_flag };
      }
      locationCountMap[locLabel].count++;
    }

    // ISP aggregation
    if (log.isp && !log.isp.toLowerCase().includes('loopback')) {
      ispCountMap[log.isp] = (ispCountMap[log.isp] || 0) + 1;
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

  const topLocations = Object.entries(locationCountMap)
    .map(([location, data]) => ({ location, count: data.count, flag: data.flag }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topIsps = Object.entries(ispCountMap)
    .map(([isp, count]) => ({ isp, count }))
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
    top_locations: topLocations,
    top_isps: topIsps,
    is_table_missing: isTableMissing,
  };
}
