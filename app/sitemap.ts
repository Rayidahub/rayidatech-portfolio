import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getBaseUrl } from '@/lib/url';

const BASE_URL = getBaseUrl();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/team`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  const [{ data: projects }, { data: services }, { data: posts }] = await Promise.all([
    supabase.from('projects').select('slug, created_at'),
    supabase.from('services').select('slug, created_at'),
    supabase.from('posts').select('slug, created_at').eq('published', true),
  ]);

  const projectPages: MetadataRoute.Sitemap = (projects || []).map((project) => ({
    url: `${BASE_URL}/projects/${project.slug}`,
    lastModified: new Date(project.created_at),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const servicePages: MetadataRoute.Sitemap = (services || []).map((service) => ({
    url: `${BASE_URL}/services/${service.slug}`,
    lastModified: new Date(service.created_at),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const blogPages: MetadataRoute.Sitemap = (posts || []).map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.created_at),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticPages, ...projectPages, ...servicePages, ...blogPages];
}
