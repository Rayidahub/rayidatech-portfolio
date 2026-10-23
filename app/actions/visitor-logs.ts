'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import {
  getVisitorLogs,
  getVisitorStats,
  clearVisitorLogs,
  logVisitorActivity,
  parseUserAgent,
} from '@/lib/data/visitor-logs';
import { resolveIpAddress } from '@/lib/data/ip-geo';
import { requireAdminSession } from '@/lib/supabase/auth-guard';
import type { VisitorLog, VisitorStats, VisitorLogFilter, VisitorEventType } from '@/types/visitor-log';

export async function recordVisitorEventAction(entry: {
  event_type: VisitorEventType;
  path: string;
  page_title?: string;
  referrer?: string;
  action_label?: string;
  visitor_id: string;
  session_id: string;
  metadata?: Record<string, any>;
}): Promise<{ success: boolean; error?: string }> {
  try {
    if (entry.path && (entry.path.startsWith('/admin') || entry.path.startsWith('/api'))) {
      return { success: true };
    }

    const headersList = await headers();
    const ua = headersList.get('user-agent') || '';
    const forwardedFor = headersList.get('x-forwarded-for') || '';
    const rawIp = forwardedFor.split(',')[0].trim() || headersList.get('x-real-ip') || '127.0.0.1';
    const headerCountry = headersList.get('cf-ipcountry') || headersList.get('x-vercel-ip-country') || 'Local';
    const headerCity = headersList.get('cf-ipcity') || headersList.get('x-vercel-ip-city') || '';

    const { device_type, browser, os } = parseUserAgent(ua);

    // Resolve comprehensive physical address, ISP, coordinates, and network location
    // If client provided pre-cached geo (e.g. from client IP lookup in localhost), use it as fallback
    const clientGeo = entry.metadata?.client_geo;
    const geo = await resolveIpAddress(rawIp, {
      country: clientGeo?.country || headerCountry,
      city: clientGeo?.city || headerCity,
    });

    const finalIp = clientGeo?.ip && rawIp === '127.0.0.1' ? clientGeo.ip : geo.ip || rawIp;
    const finalCountry = geo.country && geo.country !== 'Unknown Country' && geo.country !== 'Local Development'
      ? geo.country
      : clientGeo?.country || headerCountry;
    const finalCity = geo.city || clientGeo?.city || headerCity;
    const finalRegion = geo.region || clientGeo?.region || '';
    const finalPostalCode = geo.postal_code || clientGeo?.postal_code || '';
    const finalFormattedAddress = geo.formatted_address || clientGeo?.formatted_address;
    const finalLatitude = geo.latitude ?? clientGeo?.latitude;
    const finalLongitude = geo.longitude ?? clientGeo?.longitude;
    const finalMapsUrl = geo.maps_url || clientGeo?.maps_url;
    const finalIsp = geo.isp || clientGeo?.isp || '';
    const finalOrganization = geo.organization || clientGeo?.organization || '';
    const finalTimezone = geo.timezone || clientGeo?.timezone || '';
    const finalCountryCode = geo.country_code || clientGeo?.country_code || '';
    const finalCountryFlag = geo.country_flag || clientGeo?.country_flag;

    return await logVisitorActivity({
      ...entry,
      device_type,
      browser,
      os,
      ip_address: finalIp,
      country: finalCountry,
      country_code: finalCountryCode,
      country_flag: finalCountryFlag,
      city: finalCity,
      region: finalRegion,
      postal_code: finalPostalCode,
      formatted_address: finalFormattedAddress,
      latitude: finalLatitude,
      longitude: finalLongitude,
      maps_url: finalMapsUrl,
      isp: finalIsp,
      organization: finalOrganization,
      timezone: finalTimezone,
    });
  } catch (err: any) {
    console.error('Error in recordVisitorEventAction:', err);
    return { success: false, error: err?.message };
  }
}

export async function getVisitorLogsAction(
  filter?: VisitorLogFilter
): Promise<{ success: boolean; logs: VisitorLog[]; error?: string }> {
  try {
    const auth = await requireAdminSession();
    if (!auth.authenticated) {
      return { success: false, logs: [], error: auth.error || 'Unauthorized' };
    }

    const logs = await getVisitorLogs(filter);
    return { success: true, logs };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch logs';
    return { success: false, logs: [], error: msg };
  }
}

export async function getVisitorStatsAction(): Promise<{
  success: boolean;
  stats?: VisitorStats;
  error?: string;
}> {
  try {
    const auth = await requireAdminSession();
    if (!auth.authenticated) {
      return { success: false, error: auth.error || 'Unauthorized' };
    }

    const stats = await getVisitorStats();
    return { success: true, stats };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch stats';
    return { success: false, error: msg };
  }
}

export async function clearVisitorLogsAction(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const auth = await requireAdminSession();
    if (!auth.authenticated) {
      return { success: false, error: auth.error || 'Unauthorized' };
    }

    const result = await clearVisitorLogs();
    revalidatePath('/admin/logs');
    return result;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to clear logs';
    return { success: false, error: msg };
  }
}
