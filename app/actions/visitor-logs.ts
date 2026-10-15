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
    const ip = forwardedFor.split(',')[0].trim() || headersList.get('x-real-ip') || '127.0.0.1';
    const country = headersList.get('cf-ipcountry') || headersList.get('x-vercel-ip-country') || 'Local';
    const city = headersList.get('cf-ipcity') || headersList.get('x-vercel-ip-city') || '';

    const { device_type, browser, os } = parseUserAgent(ua);

    return await logVisitorActivity({
      ...entry,
      device_type,
      browser,
      os,
      ip_address: ip,
      country,
      city,
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
    const logs = await getVisitorLogs(filter);
    return { success: true, logs };
  } catch (err: any) {
    return { success: false, logs: [], error: err?.message || 'Failed to fetch logs' };
  }
}

export async function getVisitorStatsAction(): Promise<{
  success: boolean;
  stats?: VisitorStats;
  error?: string;
}> {
  try {
    const stats = await getVisitorStats();
    return { success: true, stats };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to fetch stats' };
  }
}

export async function clearVisitorLogsAction(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const result = await clearVisitorLogs();
    revalidatePath('/admin/logs');
    return result;
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to clear logs' };
  }
}
