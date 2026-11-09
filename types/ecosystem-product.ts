export type ProductStatus = 'coming_soon' | 'live' | 'beta';

export interface EcosystemProduct {
  id: string;
  name: string;
  emoji: string;
  description: string;
  tagline?: string | null;
  slug?: string | null;
  category?: string | null;
  status: 'coming_soon' | 'live' | 'beta' | string;
  launch_date: string | null;
  sort_order: number;
  is_active: boolean;
  image?: string | null;
  website_url?: string | null;
  waitlist_url?: string | null;
  features?: string[] | null;
  badge?: string | null;
  metadata?: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface ProductInput {
  name: string;
  emoji: string;
  description: string;
  tagline?: string;
  slug?: string;
  category?: string;
  status: ProductStatus | string;
  launch_date?: string | null;
  sort_order?: number;
  is_active?: boolean;
  image?: string | null;
  website_url?: string | null;
  waitlist_url?: string | null;
  features?: string[];
  badge?: string | null;
  metadata?: Record<string, unknown>;
}
