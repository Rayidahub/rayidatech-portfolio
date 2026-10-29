'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { recordVisitorEventAction } from '@/app/actions/visitor-logs';
import { hasConsentedTo, subscribeToConsentChanges } from '@/lib/privacy/cookie-consent';

function getOrSetVisitorId(): string {
  if (typeof window === 'undefined') return '';
  // Privacy by design: only persist visitor ID if analytics consent was granted
  if (!hasConsentedTo('analytics')) {
    return 'anonymous_visitor';
  }
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
  // Privacy by design: only persist session ID if analytics consent was granted
  if (!hasConsentedTo('analytics')) {
    return 'anonymous_session';
  }
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

let cachedClientGeo: any = null;
async function getCachedClientGeo(): Promise<any> {
  if (typeof window === 'undefined') return null;
  // Privacy by design: do not resolve client IP geo if analytics consent is not granted
  if (!hasConsentedTo('analytics')) return null;
  if (cachedClientGeo) return cachedClientGeo;

  try {
    const raw = sessionStorage.getItem('rayida_client_geo');
    if (raw) {
      cachedClientGeo = JSON.parse(raw);
      return cachedClientGeo;
    }
  } catch {}

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch('https://freeipapi.com/api/json', {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data && data.ipAddress) {
        cachedClientGeo = {
          ip: data.ipAddress,
          city: data.cityName,
          region: data.regionName,
          region_code: data.regionCode,
          country: data.countryName,
          country_code: data.countryCode,
          postal_code: data.zipCode,
          latitude: data.latitude,
          longitude: data.longitude,
          isp: data.asnOrganization,
          timezone: Array.isArray(data.timeZones) ? data.timeZones[0] : undefined,
          currency: Array.isArray(data.currencies) ? data.currencies[0] : undefined,
        };
        try {
          sessionStorage.setItem('rayida_client_geo', JSON.stringify(cachedClientGeo));
        } catch {}
        return cachedClientGeo;
      }
    }
  } catch {}

  return null;
}

function getClientEnvironment(): Record<string, any> {
  if (typeof window === 'undefined') return {};
  const nav = navigator as any;
  const screen = window.screen;

  const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
  const network = conn
    ? {
        effective_type: conn.effectiveType,
        downlink_mbps: conn.downlink,
        rtt_ms: conn.rtt,
        save_data: conn.saveData,
      }
    : undefined;

  const display = {
    screen_resolution: `${screen?.width || 0} × ${screen?.height || 0}`,
    viewport: `${window.innerWidth} × ${window.innerHeight}`,
    pixel_ratio: window.devicePixelRatio || 1,
    color_depth: `${screen?.colorDepth || 24}-bit`,
    orientation:
      screen?.orientation?.type ||
      (window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'),
    touch_points: nav.maxTouchPoints || 0,
    has_touch: (nav.maxTouchPoints || 0) > 0 || 'ontouchstart' in window,
  };

  const hardware = {
    cpu_cores: nav.hardwareConcurrency,
    device_memory_gb: nav.deviceMemory,
  };

  const locale = {
    language: nav.language || 'en',
    languages: Array.isArray(nav.languages) ? nav.languages.slice(0, 3).join(', ') : nav.language,
    client_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
    timezone_offset_minutes: new Date().getTimezoneOffset(),
  };

  return {
    network,
    display,
    hardware,
    locale,
  };
}

function getAttribution(): Record<string, any> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const utm_source = params.get('utm_source');
  const utm_medium = params.get('utm_medium');
  const utm_campaign = params.get('utm_campaign');
  const utm_term = params.get('utm_term');
  const utm_content = params.get('utm_content');

  let referrer_domain = '';
  if (document.referrer) {
    try {
      referrer_domain = new URL(document.referrer).hostname;
    } catch {
      referrer_domain = document.referrer;
    }
  }

  return {
    referrer_domain: referrer_domain || 'Direct Visit',
    utm_source: utm_source || undefined,
    utm_medium: utm_medium || undefined,
    utm_campaign: utm_campaign || undefined,
    utm_term: utm_term || undefined,
    utm_content: utm_content || undefined,
  };
}

interface TrackPayload {
  event_type?: any;
  path: string;
  page_title?: string;
  referrer?: string;
  action_label?: string;
  visitor_id?: string;
  session_id?: string;
  metadata?: Record<string, any>;
}

let sessionActionCount = 0;

async function sendTrack(payload: TrackPayload) {
  if (typeof window === 'undefined') return;

  // Enforce Cookie Consent under NDPA 2023: do not dispatch telemetry without explicit analytics consent
  if (!hasConsentedTo('analytics')) {
    return;
  }

  // Never track admin workspace navigation
  if (payload.path && (payload.path.startsWith('/admin') || payload.path.startsWith('/api'))) {
    return;
  }

  sessionActionCount++;
  const clientGeo = await getCachedClientGeo();
  const environment = getClientEnvironment();
  const attribution = getAttribution();

  const visitor_id = payload.visitor_id || getOrSetVisitorId();
  const session_id = payload.session_id || getOrSetSessionId();
  const event_type = payload.event_type || 'page_view';
  const path = payload.path;

  const mergedMetadata = {
    ...(payload.metadata || {}),
    client_geo: clientGeo,
    environment,
    attribution,
    session_action_index: sessionActionCount,
    timestamp_local: new Date().toISOString(),
  };

  const fullPayload = {
    ...payload,
    event_type,
    path,
    visitor_id,
    session_id,
    metadata: mergedMetadata,
  };

  // 1. Primary: Next.js Server Action
  try {
    recordVisitorEventAction({
      event_type,
      path,
      page_title: payload.page_title,
      referrer: payload.referrer,
      action_label: payload.action_label,
      visitor_id,
      session_id,
      metadata: mergedMetadata,
    }).catch(() => {});
  } catch {}

  // 2. Secondary fallback via beacon or fetch
  try {
    const jsonString = JSON.stringify(fullPayload);
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
  const [analyticsConsent, setAnalyticsConsent] = useState(false);

  useEffect(() => {
    setAnalyticsConsent(hasConsentedTo('analytics'));
    const unsubscribe = subscribeToConsentChanges((consent) => {
      setAnalyticsConsent(consent.categories.analytics);
    });
    return unsubscribe;
  }, []);

  // Pre-fetch client geolocation in background on start only if consent was granted
  useEffect(() => {
    if (analyticsConsent) {
      getCachedClientGeo().catch(() => {});
    }
  }, [analyticsConsent]);

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
    });

    // When leaving page, send dwell time beacon if stayed for at least 3 seconds
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
      if (
        href === '/contact' ||
        text.toLowerCase().includes('start a project') ||
        text.toLowerCase().includes('start your project')
      ) {
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
