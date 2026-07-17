import type { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/url';

const BASE_URL = getBaseUrl();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/admin'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
