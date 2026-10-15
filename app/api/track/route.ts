import { NextRequest, NextResponse } from 'next/server';
import { logVisitorActivity } from '@/lib/data/visitor-logs';
import { resolveIpAddress } from '@/lib/data/ip-geo';
import type { DeviceType, VisitorEventType } from '@/types/visitor-log';

function parseUserAgent(uaString: string): {
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

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      body = await req.json();
    } else {
      const rawText = await req.text();
      try {
        body = JSON.parse(rawText);
      } catch {
        body = {};
      }
    }

    if (!body || !body.path) {
      return NextResponse.json({ ok: false, error: 'Path is required' }, { status: 400 });
    }

    // Never track admin panel internal activity
    const path = String(body.path);
    if (path.startsWith('/admin') || path.startsWith('/api')) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const ua = req.headers.get('user-agent') || '';
    const { device_type, browser, os } = parseUserAgent(ua);

    // IP Extraction
    const forwardedFor = req.headers.get('x-forwarded-for') || '';
    const rawIp = forwardedFor.split(',')[0].trim() || req.headers.get('x-real-ip') || '127.0.0.1';

    // Geo Extraction from headers
    const headerCountry =
      req.headers.get('cf-ipcountry') ||
      req.headers.get('x-vercel-ip-country') ||
      req.headers.get('geoip-country-code') ||
      body.country ||
      'Local';

    const headerCity =
      req.headers.get('cf-ipcity') ||
      req.headers.get('x-vercel-ip-city') ||
      body.city ||
      '';

    const clientGeo = body.metadata?.client_geo;
    const geo = await resolveIpAddress(rawIp, {
      country: clientGeo?.country || headerCountry,
      city: clientGeo?.city || headerCity,
    });

    const finalIp = clientGeo?.ip && rawIp === '127.0.0.1' ? clientGeo.ip : geo.ip || rawIp;
    const finalCountry =
      geo.country && geo.country !== 'Unknown Country' && geo.country !== 'Local Development'
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

    const session_id = String(body.session_id || `s_${Date.now()}`);
    const visitor_id = String(body.visitor_id || `v_${Date.now()}`);
    const event_type = (body.event_type || 'page_view') as VisitorEventType;
    const page_title = body.page_title ? String(body.page_title) : '';
    const referrer = body.referrer ? String(body.referrer) : '';
    const action_label = body.action_label ? String(body.action_label) : `Viewed ${path}`;
    const metadata = body.metadata && typeof body.metadata === 'object' ? body.metadata : {};

    await logVisitorActivity({
      session_id,
      visitor_id,
      event_type,
      path,
      page_title,
      referrer,
      action_label,
      metadata,
      device_type: body.device_type || device_type,
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

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Error in /api/track:', err);
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 });
  }
}
