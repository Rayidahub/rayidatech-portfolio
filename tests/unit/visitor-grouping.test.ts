import { describe, it, expect } from 'vitest';
import {
  groupLogsByVisitor,
  formatDwellTime,
  getIpSummaryBadge,
  filterVisitorGroups,
} from '@/lib/data/visitor-grouping';
import type { VisitorLog } from '@/types/visitor-log';

describe('Visitor Grouping & Single-Line Consolidation', () => {
  const mockLogs: VisitorLog[] = [
    {
      id: 'log-1',
      session_id: 'sess-1',
      visitor_id: 'visitor-alpha',
      event_type: 'page_view',
      path: '/projects',
      action_label: 'Viewed /projects',
      ip_address: '135.129.124.224',
      city: 'Lagos',
      region: 'Lagos',
      country: 'Nigeria',
      country_code: 'NG',
      country_flag: '🇳🇬',
      isp: 'Space Exploration Technologies',
      browser: 'Chrome',
      os: 'Windows',
      device_type: 'desktop',
      created_at: '2026-11-21T14:47:00Z',
    },
    {
      id: 'log-2',
      session_id: 'sess-1',
      visitor_id: 'visitor-alpha',
      event_type: 'page_view',
      path: '/projects',
      action_label: 'Viewed /projects',
      ip_address: '135.129.124.224',
      city: 'Lagos',
      region: 'Lagos',
      country: 'Nigeria',
      country_code: 'NG',
      country_flag: '🇳🇬',
      isp: 'Space Exploration Technologies',
      browser: 'Chrome',
      os: 'Windows',
      device_type: 'desktop',
      created_at: '2026-11-21T14:47:05Z',
    },
    {
      id: 'log-3',
      session_id: 'sess-1',
      visitor_id: 'visitor-alpha',
      event_type: 'dwell_time',
      path: '/',
      action_label: 'Spent 305s on /',
      metadata: { dwell_seconds: 305 },
      ip_address: '135.129.124.224',
      city: 'Lagos',
      region: 'Lagos',
      country: 'Nigeria',
      country_code: 'NG',
      country_flag: '🇳🇬',
      isp: 'Space Exploration Technologies',
      browser: 'Chrome',
      os: 'Windows',
      device_type: 'desktop',
      created_at: '2026-11-21T14:47:10Z',
    },
    {
      id: 'log-4',
      session_id: 'sess-1',
      visitor_id: 'visitor-alpha',
      event_type: 'page_view',
      path: '/',
      action_label: 'Viewed Home page',
      ip_address: '135.129.124.224',
      city: 'Lagos',
      region: 'Lagos',
      country: 'Nigeria',
      country_code: 'NG',
      country_flag: '🇳🇬',
      isp: 'Space Exploration Technologies',
      browser: 'Chrome',
      os: 'Windows',
      device_type: 'desktop',
      created_at: '2026-11-21T14:42:00Z',
    },
  ];

  it('consolidates multiple events from the same IP/visitor into exactly ONE line', () => {
    const groups = groupLogsByVisitor(mockLogs);
    expect(groups).toHaveLength(1);

    const group = groups[0];
    expect(group.primary_ip).toBe('135.129.124.224');
    expect(group.city).toBe('Lagos');
    expect(group.country).toBe('Nigeria');
    expect(group.total_events).toBe(4);
    expect(group.total_page_views).toBe(3);
    expect(group.unique_pages).toEqual(expect.arrayContaining(['/projects', '/']));
    expect(group.total_dwell_seconds).toBe(305);
  });

  it('identifies and labels multiple IPs (e.g. WiFi and mobile) under the same visitor', () => {
    const multiIpLogs: VisitorLog[] = [
      ...mockLogs,
      {
        id: 'log-5',
        session_id: 'sess-2',
        visitor_id: 'visitor-alpha', // Same person
        event_type: 'page_view',
        path: '/services',
        action_label: 'Viewed Services on Mobile',
        ip_address: '102.89.44.12', // Mobile IP
        city: 'Lagos',
        region: 'Lagos',
        country: 'Nigeria',
        isp: 'MTN Nigeria',
        browser: 'Safari',
        os: 'iOS',
        device_type: 'mobile',
        created_at: '2026-11-21T14:55:00Z',
      },
    ];

    const groups = groupLogsByVisitor(multiIpLogs);
    expect(groups).toHaveLength(1);

    const group = groups[0];
    expect(group.all_ips).toHaveLength(2);
    expect(group.all_ips.map((i) => i.ip)).toEqual(
      expect.arrayContaining(['102.89.44.12', '135.129.124.224'])
    );

    const badge = getIpSummaryBadge(group.all_ips);
    expect(badge.isMultiIp).toBe(true);
    expect(badge.count).toBe(2);
    expect(badge.label).toContain('+1 other IP');
  });

  it('formats dwell time correctly', () => {
    expect(formatDwellTime(0)).toBe('0s');
    expect(formatDwellTime(45)).toBe('45s');
    expect(formatDwellTime(305)).toBe('5m 05s');
    expect(formatDwellTime(3600)).toBe('1h 00m');
    expect(formatDwellTime(3725)).toBe('1h 02m');
  });

  it('filters visitor groups by search query and device', () => {
    const groups = groupLogsByVisitor(mockLogs);
    const searchMatch = filterVisitorGroups(groups, { search: 'Lagos' });
    expect(searchMatch).toHaveLength(1);

    const searchNoMatch = filterVisitorGroups(groups, { search: 'London' });
    expect(searchNoMatch).toHaveLength(0);

    const desktopMatch = filterVisitorGroups(groups, { device: 'desktop' });
    expect(desktopMatch).toHaveLength(1);

    const mobileNoMatch = filterVisitorGroups(groups, { device: 'mobile' });
    expect(mobileNoMatch).toHaveLength(0);
  });
});
