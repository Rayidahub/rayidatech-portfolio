'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { recordVisitorEventAction } from '@/app/actions/visitor-logs';

function getOrSetVisitorId(): string {
  if (typeof window === 'undefined') return '';
  const key = 'rayida_visitor_id';
  try {
    let id = localStorage.getItem(key);
    if (!id) {
      id = `vis_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem(key, id);
    }
    return id;
  } catch {
    return `vis_${Date.now()}`;
  }
}

function getOrSetSessionId(): string {
  if (typeof window === 'undefined') return '';
  const key = 'rayida_session_id';
  try {
    let id = sessionStorage.getItem(key);
    if (!id) {
      id = `ses_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem(key, id);
    }
    return id;
  } catch {
    return `ses_${Date.now()}`;
  }
}

function sendTrack(payload: Record<string, any>) {
  if (typeof window === 'undefined') return;

  // Never track admin workspace navigation
  if (payload.path && (payload.path.startsWith('/admin') || payload.path.startsWith('/api'))) {
    return;
  }

  // 1. Primary: Next.js Server Action (immune to browser ad blockers and content filters)
  try {
    recordVisitorEventAction({
      event_type: payload.event_type || 'page_view',
      path: payload.path,
      page_title: payload.page_title,
      referrer: payload.referrer,
      action_label: payload.action_label,
      visitor_id: payload.visitor_id,
      session_id: payload.session_id,
      metadata: payload.metadata,
    }).catch(() => {});
  } catch {}

  // 2. Secondary fallback via beacon or fetch
  try {
    const jsonString = JSON.stringify(payload);
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([jsonString], { type: 'application/json' });
      navigator.sendBeacon('/api/track', blob);
    } else {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonString,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {}
}

export default function ActivityTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageStartTimeRef = useRef<number>(Date.now());
  const currentPathRef = useRef<string>(pathname);

  // 1. Page view tracking
  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return;

    currentPathRef.current = pathname;
    pageStartTimeRef.current = Date.now();

    const fullUrl = searchParams?.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    const visitor_id = getOrSetVisitorId();
    const session_id = getOrSetSessionId();

    sendTrack({
      event_type: 'page_view',
      path: fullUrl,
      page_title: typeof document !== 'undefined' ? document.title : '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      action_label: `Viewed ${pathname === '/' ? 'Home page' : pathname}`,
      visitor_id,
      session_id,
      metadata: {
        screen_width: typeof window !== 'undefined' ? window.innerWidth : 0,
        screen_height: typeof window !== 'undefined' ? window.innerHeight : 0,
      },
    });

    // When leaving page, send dwell time beacon
    return () => {
      const durationSeconds = Math.round((Date.now() - pageStartTimeRef.current) / 1000);
      if (durationSeconds >= 3) {
        sendTrack({
          event_type: 'dwell_time',
          path: fullUrl,
          visitor_id,
          session_id,
          action_label: `Spent ${durationSeconds}s on ${pathname}`,
          metadata: {
            duration_seconds: durationSeconds,
          },
        });
      }
    };
  }, [pathname, searchParams]);

  // 2. Global click tracking for CTA buttons and interactions
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleClick = (e: MouseEvent) => {
      if (!currentPathRef.current || currentPathRef.current.startsWith('/admin')) return;

      const target = (e.target as HTMLElement)?.closest('a, button, [data-track-action]');
      if (!target) return;

      const trackAction = target.getAttribute('data-track-action');
      const href = target.getAttribute('href') || '';
      const text = target.textContent?.trim().slice(0, 50) || '';

      const visitor_id = getOrSetVisitorId();
      const session_id = getOrSetSessionId();

      if (trackAction) {
        sendTrack({
          event_type: 'click_cta',
          path: currentPathRef.current,
          action_label: trackAction,
          visitor_id,
          session_id,
          metadata: { text, href },
        });
        return;
      }

      // Track WhatsApp link clicks
      if (href.includes('wa.link') || href.includes('whatsapp.com')) {
        sendTrack({
          event_type: 'click_cta',
          path: currentPathRef.current,
          action_label: 'Clicked WhatsApp Chat button',
          visitor_id,
          session_id,
          metadata: { href },
        });
        return;
      }

      // Track Contact CTA clicks
      if (href === '/contact' || text.toLowerCase().includes('start a project') || text.toLowerCase().includes('start your project')) {
        sendTrack({
          event_type: 'click_cta',
          path: currentPathRef.current,
          action_label: `Clicked CTA: "${text || 'Start a Project'}"`,
          visitor_id,
          session_id,
          metadata: { href },
        });
        return;
      }

      // Track project case study clicks
      if (href.startsWith('/projects/')) {
        sendTrack({
          event_type: 'project_view',
          path: currentPathRef.current,
          action_label: `Clicked Project Link: ${href}`,
          visitor_id,
          session_id,
          metadata: { href, title: text },
        });
        return;
      }

      // Track external links (GitHub, LinkedIn, Twitter)
      if (href.startsWith('http') && !href.includes(window.location.host)) {
        sendTrack({
          event_type: 'external_link',
          path: currentPathRef.current,
          action_label: `External Link: ${href}`,
          visitor_id,
          session_id,
          metadata: { href },
        });
      }
    };

    // 3. Track theme toggling
    const handleThemeChange = () => {
      if (!currentPathRef.current || currentPathRef.current.startsWith('/admin')) return;
      const theme = document.documentElement.getAttribute('data-theme') || 'unknown';
      const visitor_id = getOrSetVisitorId();
      const session_id = getOrSetSessionId();

      sendTrack({
        event_type: 'theme_change',
        path: currentPathRef.current,
        action_label: `Switched Theme to ${theme.toUpperCase()}`,
        visitor_id,
        session_id,
        metadata: { theme },
      });
    };

    document.addEventListener('click', handleClick, { capture: true });
    window.addEventListener('themechange', handleThemeChange);

    // Global helper attached to window
    (window as any).rayidaTrack = (eventType: string, actionLabel: string, metadata?: any) => {
      sendTrack({
        event_type: eventType,
        path: currentPathRef.current,
        action_label: actionLabel,
        visitor_id: getOrSetVisitorId(),
        session_id: getOrSetSessionId(),
        metadata,
      });
    };

    return () => {
      document.removeEventListener('click', handleClick, { capture: true });
      window.removeEventListener('themechange', handleThemeChange);
    };
  }, []);

  return null;
}

