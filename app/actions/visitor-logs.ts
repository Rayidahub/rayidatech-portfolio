'use server';

import { revalidatePath } from 'next/cache';
import {
  getVisitorLogs,
  getVisitorStats,
  clearVisitorLogs,
} from '@/lib/data/visitor-logs';
import type { VisitorLog, VisitorStats, VisitorLogFilter } from '@/types/visitor-log';

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

