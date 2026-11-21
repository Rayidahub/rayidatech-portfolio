import type {
  VisitorLog,
  VisitorSessionGroup,
  VisitorDevice,
  VisitorIpRecord,
  DeviceType,
} from '@/types/visitor-log';

/**
 * Format total dwell seconds into human-readable duration
 * e.g. 45 -> "45s", 305 -> "5m 05s", 3720 -> "1h 02m"
 */
export function formatDwellTime(seconds: number): string {
  if (!seconds || seconds <= 0) return '0s';
  const total = Math.round(seconds);
  if (total < 60) return `${total}s`;
  const mins = Math.floor(total / 60);
  const remSecs = total % 60;
  if (mins < 60) {
    return `${mins}m ${remSecs.toString().padStart(2, '0')}s`;
  }
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  return `${hours}h ${remMins.toString().padStart(2, '0')}m`;
}

/**
 * Generate a concise badge label for multi-IP visitors
 * e.g. "+1 other IP (Mobile)" or "2 IPs tracked"
 */
export function getIpSummaryBadge(allIps: VisitorIpRecord[]): {
  count: number;
  label: string;
  isMultiIp: boolean;
} {
  const count = allIps.length;
  if (count <= 1) {
    return { count: 1, label: '', isMultiIp: false };
  }

  const secondaryIps = allIps.filter((i) => !i.is_primary);
  const hasMobile = secondaryIps.some((i) => i.device_type === 'mobile');
  const hasTablet = secondaryIps.some((i) => i.device_type === 'tablet');

  let suffix = '';
  if (hasMobile) suffix = ' (Mobile)';
  else if (hasTablet) suffix = ' (Tablet)';

  const otherCount = count - 1;
  const label = `+${otherCount} other IP${otherCount > 1 ? 's' : ''}${suffix}`;

  return { count, label, isMultiIp: true };
}

/**
 * Extract dwell seconds from a log entry
 */
function extractDwellSeconds(log: VisitorLog): number {
  if (log.metadata && typeof log.metadata.dwell_seconds === 'number') {
    return log.metadata.dwell_seconds;
  }
  if (log.event_type === 'dwell_time' && log.action_label) {
    const match = log.action_label.match(/spent\s+(\d+)s/i);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
  }
  return 0;
}

/**
 * Aggregates individual raw activity logs into one row per unique visitor.
 * If a user used multiple IP addresses (e.g. WiFi vs Mobile data), they remain
 * consolidated under one visitor with all IPs recorded and labeled.
 */
export function groupLogsByVisitor(logs: VisitorLog[]): VisitorSessionGroup[] {
  if (!logs || logs.length === 0) return [];

  // Map from groupKey -> VisitorSessionGroup builder
  const groupMap = new Map<string, {
    visitor_key: string;
    visitor_id: string;
    events: VisitorLog[];
    ipMap: Map<string, { isp?: string; device_type?: DeviceType; last_seen: string }>;
    deviceMap: Map<string, { device_type: DeviceType; browser: string; os: string; count: number }>;
    pageSet: Set<string>;
    totalDwellSeconds: number;
    email: string | null;
  }>();

  // Index mapping IP addresses to existing group keys (to connect same visitor across sessions)
  const ipToGroupKey = new Map<string, string>();
  const visitorIdToGroupKey = new Map<string, string>();

  // Iterate chronologically through logs (assuming logs are either newest-first or mixed)
  // Sort logs by created_at descending first
  const sortedLogs = [...logs].sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  for (const log of sortedLogs) {
    const vId = (log.visitor_id || '').trim();
    const ip = (log.ip_address || '').trim() || '127.0.0.1';
    const email = log.metadata?.email || log.metadata?.contact_email || log.metadata?.subscriber_email || null;

    // Determine target group key
    let targetKey: string | undefined;

    if (vId && visitorIdToGroupKey.has(vId)) {
      targetKey = visitorIdToGroupKey.get(vId);
    } else if (!vId && ip && ipToGroupKey.has(ip)) {
      targetKey = ipToGroupKey.get(ip);
    }

    if (!targetKey) {
      // Primary key definition: visitor_id takes precedence, fallback to ip
      targetKey = vId ? `v_${vId}` : `ip_${ip}`;
      if (vId) visitorIdToGroupKey.set(vId, targetKey);
      if (ip) ipToGroupKey.set(ip, targetKey);

      groupMap.set(targetKey, {
        visitor_key: targetKey,
        visitor_id: vId || `v_${ip}`,
        events: [],
        ipMap: new Map(),
        deviceMap: new Map(),
        pageSet: new Set(),
        totalDwellSeconds: 0,
        email: email ? String(email) : null,
      });
    }

    const group = groupMap.get(targetKey)!;

    // Track email if found in any event
    if (!group.email && email) {
      group.email = String(email);
    }

    // Associate visitor_id and ip
    if (vId) visitorIdToGroupKey.set(vId, targetKey);
    if (ip) ipToGroupKey.set(ip, targetKey);

    // Add event
    group.events.push(log);

    // Track IP
    if (ip) {
      const existingIp = group.ipMap.get(ip);
      const isNewer = !existingIp || new Date(log.created_at).getTime() > new Date(existingIp.last_seen).getTime();
      if (!existingIp || isNewer) {
        group.ipMap.set(ip, {
          isp: log.isp || existingIp?.isp || '',
          device_type: log.device_type || existingIp?.device_type || 'desktop',
          last_seen: isNewer ? log.created_at : (existingIp?.last_seen || log.created_at),
        });
      }
    }

    // Track Device
    const devType: DeviceType = log.device_type || 'desktop';
    const browser = log.browser || 'Unknown';
    const os = log.os || 'Unknown';
    const deviceKey = `${devType}|${browser}|${os}`;

    const existingDevice = group.deviceMap.get(deviceKey);
    if (existingDevice) {
      existingDevice.count++;
    } else {
      group.deviceMap.set(deviceKey, {
        device_type: devType,
        browser,
        os,
        count: 1,
      });
    }

    // Track unique pages
    if (log.path) {
      group.pageSet.add(log.path);
    }

    // Track dwell time
    group.totalDwellSeconds += extractDwellSeconds(log);
  }

  // Build finalized VisitorSessionGroup objects
  const result: VisitorSessionGroup[] = [];

  for (const group of groupMap.values()) {
    // Events are already newest-first
    const latestEvent = group.events[0];
    const earliestEvent = group.events[group.events.length - 1];

    // Primary IP is the latest event's IP or first in ipMap
    const primaryIp = latestEvent?.ip_address || Array.from(group.ipMap.keys())[0] || '127.0.0.1';

    // Format all IPs
    const allIps: VisitorIpRecord[] = Array.from(group.ipMap.entries()).map(([ip, data]) => ({
      ip,
      isp: data.isp,
      device_type: data.device_type,
      last_seen: data.last_seen,
      is_primary: ip === primaryIp,
    }));

    // Ensure primary IP is first in the list
    allIps.sort((a, b) => {
      if (a.is_primary) return -1;
      if (b.is_primary) return 1;
      return new Date(b.last_seen).getTime() - new Date(a.last_seen).getTime();
    });

    // Devices sorted by count descending
    const devices: VisitorDevice[] = Array.from(group.deviceMap.values()).sort(
      (a, b) => b.count - a.count
    );

    // Geolocation from latest event with valid location
    const eventWithLocation = group.events.find(
      (e) => (e.city && e.country) || e.formatted_address || (e.country && e.country !== 'Global')
    ) || latestEvent;

    const country = eventWithLocation?.country || 'Global';
    const country_code = eventWithLocation?.country_code || '';
    const country_flag = eventWithLocation?.country_flag || '🌐';
    const city = eventWithLocation?.city || '';
    const region = eventWithLocation?.region || '';
    const postal_code = eventWithLocation?.postal_code || '';
    const formatted_address =
      eventWithLocation?.formatted_address ||
      `${city ? city + ', ' : ''}${region ? region + ', ' : ''}${country}`;

    const latitude = eventWithLocation?.latitude;
    const longitude = eventWithLocation?.longitude;
    const maps_url = eventWithLocation?.maps_url;
    const primary_isp = eventWithLocation?.isp || latestEvent?.isp || 'Standard Network';
    const organization = eventWithLocation?.organization || latestEvent?.organization;
    const timezone = eventWithLocation?.timezone || latestEvent?.timezone;

    const total_page_views = group.events.filter((e) => e.event_type === 'page_view').length;

    result.push({
      visitor_key: group.visitor_key,
      visitor_id: group.visitor_id,
      primary_ip: primaryIp,
      all_ips: allIps,
      email: group.email,
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
      primary_isp,
      organization,
      timezone,
      devices,
      total_events: group.events.length,
      total_page_views,
      unique_pages: Array.from(group.pageSet),
      total_dwell_seconds: group.totalDwellSeconds,
      first_seen: earliestEvent.created_at,
      last_active: latestEvent.created_at,
      recent_action: latestEvent.action_label || `Visited ${latestEvent.path}`,
      events: group.events,
    });
  }

  // Sort groups by last_active descending (most recent first)
  result.sort((a, b) => {
    return new Date(b.last_active).getTime() - new Date(a.last_active).getTime();
  });

  return result;
}

/**
 * Filter visitor groups by search query or device type
 */
export function filterVisitorGroups(
  groups: VisitorSessionGroup[],
  options: { search?: string; device?: string }
): VisitorSessionGroup[] {
  const { search, device } = options;
  let filtered = [...groups];

  if (device && device !== 'all') {
    filtered = filtered.filter((g) =>
      g.devices.some((d) => d.device_type === device)
    );
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter((g) => {
      return (
        g.primary_ip.toLowerCase().includes(q) ||
        g.all_ips.some((i) => i.ip.toLowerCase().includes(q) || (i.isp && i.isp.toLowerCase().includes(q))) ||
        (g.email && g.email.toLowerCase().includes(q)) ||
        g.visitor_id.toLowerCase().includes(q) ||
        g.city.toLowerCase().includes(q) ||
        g.region.toLowerCase().includes(q) ||
        g.country.toLowerCase().includes(q) ||
        g.formatted_address.toLowerCase().includes(q) ||
        g.primary_isp.toLowerCase().includes(q) ||
        g.unique_pages.some((p) => p.toLowerCase().includes(q)) ||
        g.recent_action.toLowerCase().includes(q) ||
        g.devices.some((d) => d.browser.toLowerCase().includes(q) || d.os.toLowerCase().includes(q))
      );
    });
  }

  return filtered;
}
