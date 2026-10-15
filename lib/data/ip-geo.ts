import type { VisitorGeoAddress } from '@/types/visitor-log';

// In-memory cache for IP geolocations (TTL: 2 hours)
const geoCache = new Map<string, { data: VisitorGeoAddress; expiresAt: number }>();
const CACHE_TTL_MS = 2 * 60 * 60 * 1000;

export function getCountryFlag(countryCode?: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌐';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  try {
    return String.fromCodePoint(...codePoints);
  } catch {
    return '🌐';
  }
}

export function isPrivateIp(ip?: string): boolean {
  if (!ip) return true;
  const clean = ip.trim().toLowerCase();
  return (
    clean === '127.0.0.1' ||
    clean === '::1' ||
    clean === 'localhost' ||
    clean.startsWith('10.') ||
    clean.startsWith('192.168.') ||
    clean.startsWith('172.16.') ||
    clean.startsWith('172.17.') ||
    clean.startsWith('172.18.') ||
    clean.startsWith('172.19.') ||
    clean.startsWith('172.2') ||
    clean.startsWith('172.30.') ||
    clean.startsWith('172.31.') ||
    clean.startsWith('fc00:') ||
    clean.startsWith('fe80:')
  );
}

export function buildFormattedAddress(parts: {
  city?: string;
  region?: string;
  postal_code?: string;
  country?: string;
}): string {
  const pieces: string[] = [];
  if (parts.city) pieces.push(parts.city);
  if (parts.region && parts.region !== parts.city) pieces.push(parts.region);
  if (parts.postal_code) pieces.push(parts.postal_code);
  if (parts.country && parts.country !== 'Local') pieces.push(parts.country);

  return pieces.length > 0 ? pieces.join(', ') : 'Local Development Network';
}

export async function resolveIpAddress(
  rawIp?: string,
  fallbackHeaders?: {
    country?: string;
    city?: string;
  }
): Promise<VisitorGeoAddress> {
  const ip = (rawIp || '').split(',')[0].trim();
  const isPrivate = isPrivateIp(ip);

  // Check in-memory cache first
  const cacheKey = isPrivate ? 'local_public_egress' : ip;
  const cached = geoCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  // 1. Try ip-api.com (extremely fast and detailed: country, state/region, city, zip, lat, lon, isp, org)
  try {
    const targetUrl = isPrivate
      ? 'http://ip-api.com/json/?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query'
      : `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1500);

    const res = await fetch(targetUrl, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      if (data && data.status === 'success') {
        const country = data.country || fallbackHeaders?.country || 'Unknown Country';
        const country_code = data.countryCode || '';
        const country_flag = getCountryFlag(country_code);
        const region = data.regionName || '';
        const region_code = data.region || '';
        const city = data.city || fallbackHeaders?.city || '';
        const postal_code = data.zip || '';
        const latitude = typeof data.lat === 'number' ? data.lat : undefined;
        const longitude = typeof data.lon === 'number' ? data.lon : undefined;
        const isp = data.isp || '';
        const organization = data.org || '';
        const asn = data.as || '';
        const timezone = data.timezone || '';
        const resolvedIp = data.query || ip;

        const formatted_address = buildFormattedAddress({
          city,
          region,
          postal_code,
          country,
        });

        const maps_url =
          latitude !== undefined && longitude !== undefined
            ? `https://www.google.com/maps?q=${latitude},${longitude}`
            : undefined;

        const geoResult: VisitorGeoAddress = {
          ip: resolvedIp,
          country,
          country_code,
          country_flag,
          region,
          region_code,
          city,
          postal_code,
          formatted_address,
          latitude,
          longitude,
          maps_url,
          isp,
          organization,
          asn,
          timezone,
        };

        geoCache.set(cacheKey, { data: geoResult, expiresAt: Date.now() + CACHE_TTL_MS });
        return geoResult;
      }
    }
  } catch {
    // Attempt fallback API
  }

  // 2. Fallback: freeipapi.com
  try {
    const targetUrl = isPrivate
      ? 'https://freeipapi.com/api/json'
      : `https://freeipapi.com/api/json/${encodeURIComponent(ip)}`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1500);

    const res = await fetch(targetUrl, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      if (data && data.countryName) {
        const country = data.countryName || fallbackHeaders?.country || 'Unknown Country';
        const country_code = data.countryCode || '';
        const country_flag = getCountryFlag(country_code);
        const region = data.regionName || '';
        const region_code = data.regionCode || '';
        const city = data.cityName || fallbackHeaders?.city || '';
        const postal_code = data.zipCode || '';
        const latitude = typeof data.latitude === 'number' ? data.latitude : undefined;
        const longitude = typeof data.longitude === 'number' ? data.longitude : undefined;
        const isp = data.asnOrganization || '';
        const organization = data.asnOrganization || '';
        const asn = data.asn ? `AS${data.asn}` : '';
        const timezone = Array.isArray(data.timeZones) ? data.timeZones[0] : '';
        const currency = Array.isArray(data.currencies) ? data.currencies[0] : '';
        const resolvedIp = data.ipAddress || ip;

        const formatted_address = buildFormattedAddress({
          city,
          region,
          postal_code,
          country,
        });

        const maps_url =
          latitude !== undefined && longitude !== undefined
            ? `https://www.google.com/maps?q=${latitude},${longitude}`
            : undefined;

        const geoResult: VisitorGeoAddress = {
          ip: resolvedIp,
          country,
          country_code,
          country_flag,
          region,
          region_code,
          city,
          postal_code,
          formatted_address,
          latitude,
          longitude,
          maps_url,
          isp,
          organization,
          asn,
          timezone,
          currency,
        };

        geoCache.set(cacheKey, { data: geoResult, expiresAt: Date.now() + CACHE_TTL_MS });
        return geoResult;
      }
    }
  } catch {
    // Proceed to header fallback
  }

  // 3. Fallback to passed headers or defaults
  const fallbackCountry = fallbackHeaders?.country || (isPrivate ? 'Local Development' : 'Global');
  const fallbackCity = fallbackHeaders?.city || (isPrivate ? 'Localhost' : '');
  const fallbackResult: VisitorGeoAddress = {
    ip,
    country: fallbackCountry,
    country_code: '',
    country_flag: getCountryFlag(''),
    city: fallbackCity,
    region: isPrivate ? 'Local Network' : '',
    formatted_address: buildFormattedAddress({
      city: fallbackCity,
      region: isPrivate ? 'Local Network' : '',
      country: fallbackCountry,
    }),
    isp: isPrivate ? 'Local Host / Loopback' : 'Unknown Provider',
  };

  geoCache.set(cacheKey, { data: fallbackResult, expiresAt: Date.now() + 5 * 60 * 1000 });
  return fallbackResult;
}

