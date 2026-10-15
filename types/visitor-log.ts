export type VisitorEventType =
  | 'page_view'
  | 'click_cta'
  | 'form_submit'
  | 'theme_change'
  | 'external_link'
  | 'project_view'
  | 'dwell_time'
  | 'custom';

export type DeviceType = 'desktop' | 'mobile' | 'tablet' | 'unknown';

export interface VisitorLog {
  id: string;
  session_id: string;
  visitor_id: string;
  event_type: VisitorEventType;
  path: string;
  page_title?: string;
  referrer?: string;
  action_label?: string;
  metadata?: Record<string, any>;
  device_type?: DeviceType;
  browser?: string;
  os?: string;
  ip_address?: string;
  country?: string;
  city?: string;
  created_at: string;
}

export interface VisitorStats {
  total_events: number;
  total_page_views: number;
  unique_visitors: number;
  active_sessions_today: number;
  top_pages: { path: string; count: number }[];
  device_breakdown: { desktop: number; mobile: number; tablet: number };
  top_actions: { action: string; count: number }[];
}

export interface VisitorLogFilter {
  search?: string;
  event_type?: string;
  device_type?: string;
  limit?: number;
}

