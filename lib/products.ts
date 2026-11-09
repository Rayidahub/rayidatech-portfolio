import type { EcosystemProduct, ProductStatus } from '@/types/ecosystem-product';
import { defaultEcosystemProducts, PRODUCT_CATEGORIES, type ProductCategory } from '@/lib/data/products';

/**
 * Normalizes an ecosystem product record from Supabase or memory,
 * ensuring missing optional fields fall back gracefully to sensible defaults.
 */
export function normalizeProduct(raw: Partial<EcosystemProduct> | Record<string, any> | null | undefined): EcosystemProduct {
  if (!raw || typeof raw !== 'object') {
    return { ...defaultEcosystemProducts[0] };
  }

  const metadata = (raw.metadata && typeof raw.metadata === 'object') ? raw.metadata : {};
  const name = (raw.name || metadata.name || 'Untitled Product').trim();
  const slug = (raw.slug || metadata.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'product').trim();
  const emoji = (raw.emoji || metadata.emoji || '🚀').trim();
  const description = (raw.description || metadata.description || '').trim();
  const tagline = (raw.tagline || metadata.tagline || '').trim() || null;
  const category = (raw.category || metadata.category || inferCategoryFromName(name)).trim();

  // Status normalization
  let status: ProductStatus = 'coming_soon';
  const rawStatus = String(raw.status || metadata.status || '').toLowerCase().trim();
  if (rawStatus === 'live' || rawStatus === 'published') {
    status = 'live';
  } else if (rawStatus === 'beta' || rawStatus === 'alpha') {
    status = 'beta';
  } else {
    status = 'coming_soon';
  }

  // Features normalization
  let features: string[] = [];
  if (Array.isArray(raw.features)) {
    features = raw.features.filter(Boolean).map(String);
  } else if (Array.isArray(metadata.features)) {
    features = metadata.features.filter(Boolean).map(String);
  } else if (typeof raw.features === 'string') {
    features = raw.features.split(',').map((f) => f.trim()).filter(Boolean);
  }

  // Fallback to default catalog features if empty
  if (features.length === 0) {
    const matchedDefault = defaultEcosystemProducts.find((p) => p.name.toLowerCase() === name.toLowerCase());
    if (matchedDefault && matchedDefault.features) {
      features = [...matchedDefault.features];
    }
  }

  // Fallback image
  const image = (raw.image || metadata.image || null)?.trim() || null;
  const website_url = (raw.website_url || metadata.website_url || null)?.trim() || null;
  const waitlist_url = (raw.waitlist_url || metadata.waitlist_url || null)?.trim() || null;
  const badge = (raw.badge || metadata.badge || null)?.trim() || null;

  return {
    id: String(raw.id || `prod-${slug}`),
    name,
    emoji,
    description,
    tagline,
    slug,
    category,
    status,
    launch_date: raw.launch_date ? String(raw.launch_date).slice(0, 10) : null,
    sort_order: Number.isFinite(raw.sort_order) ? Number(raw.sort_order) : 0,
    is_active: raw.is_active !== false,
    image,
    website_url,
    waitlist_url,
    features,
    badge,
    metadata,
    created_at: raw.created_at || new Date().toISOString(),
    updated_at: raw.updated_at || new Date().toISOString(),
  };
}

/**
 * Infers a clean product category based on product name if none is explicitly provided.
 */
function inferCategoryFromName(name: string): string {
  const norm = name.toLowerCase();
  if (norm.includes('texta') || norm.includes('voice') || norm.includes('speech')) return 'Voice & Productivity';
  if (norm.includes('pay') || norm.includes('wallet') || norm.includes('finance')) return 'Fintech & Web3';
  if (norm.includes('demy') || norm.includes('learn') || norm.includes('edu')) return 'EdTech & Learning';
  if (norm.includes('nect') || norm.includes('connect') || norm.includes('social')) return 'Networking & Community';
  if (norm.includes('rayce') || norm.includes('ai') || norm.includes('intel')) return 'AI & Intelligence';
  return 'AI & Intelligence';
}

/**
 * Returns formatted status metadata including brand colors and badges.
 */
export function formatProductStatus(status?: string | null): {
  label: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  const norm = String(status || '').toLowerCase().trim();
  if (norm === 'live') {
    return {
      label: 'Live',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      dot: 'bg-emerald-400',
    };
  }
  if (norm === 'beta' || norm === 'alpha') {
    return {
      label: 'Beta',
      bg: 'bg-secondary/10',
      text: 'text-secondary',
      border: 'border-secondary/30',
      dot: 'bg-secondary',
    };
  }
  return {
    label: 'Coming Soon',
    bg: 'bg-amber-500/10',
    text: 'text-amber-300',
    border: 'border-amber-500/30',
    dot: 'bg-amber-400',
  };
}

/**
 * Formats a clean category label.
 */
export function formatProductCategory(category?: string | null, name?: string): string {
  if (category && category.trim() && category.trim().toLowerCase() !== 'all') {
    return category.trim();
  }
  return inferCategoryFromName(name || '');
}

/**
 * Computes a URL-friendly slug.
 */
export function getProductSlug(product: { slug?: string | null; name: string }): string {
  if (product.slug && product.slug.trim()) {
    return product.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  return product.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/**
 * Computes a display badge for cards.
 */
export function getProductBadge(product: EcosystemProduct): string {
  if (product.badge && product.badge.trim()) {
    return product.badge.trim();
  }
  if (product.status === 'live') {
    return 'Available Now';
  }
  if (product.status === 'beta') {
    return 'Closed Beta';
  }
  return 'Coming Soon';
}

/**
 * Filters a list of products by category, status, and search query.
 */
export function filterProducts(
  products: EcosystemProduct[],
  options: {
    category?: string;
    status?: string;
    query?: string;
    includeInactive?: boolean;
  } = {}
): EcosystemProduct[] {
  const { category = 'All', status = 'all', query = '', includeInactive = false } = options;
  const q = query.toLowerCase().trim();
  const cat = category.toLowerCase().trim();
  const st = status.toLowerCase().trim();

  return products.filter((p) => {
    if (!includeInactive && !p.is_active) {
      return false;
    }

    // Category filter
    if (cat !== 'all' && cat !== '') {
      const productCat = (p.category || inferCategoryFromName(p.name)).toLowerCase();
      if (!productCat.includes(cat) && !cat.includes(productCat)) {
        return false;
      }
    }

    // Status filter
    if (st !== 'all' && st !== '') {
      if (st === 'live' && p.status !== 'live') return false;
      if (st === 'coming_soon' && p.status !== 'coming_soon') return false;
      if (st === 'beta' && p.status !== 'beta') return false;
    }

    // Text query filter
    if (q) {
      const inName = p.name.toLowerCase().includes(q);
      const inDesc = p.description.toLowerCase().includes(q);
      const inTagline = (p.tagline || '').toLowerCase().includes(q);
      const inCat = (p.category || '').toLowerCase().includes(q);
      const inFeatures = (p.features || []).some((f) => f.toLowerCase().includes(q));
      if (!inName && !inDesc && !inTagline && !inCat && !inFeatures) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Calculates high-level product count metrics for dashboards.
 */
export function calculateProductStats(products: EcosystemProduct[]): {
  total: number;
  live: number;
  comingSoon: number;
  active: number;
} {
  let live = 0;
  let comingSoon = 0;
  let active = 0;

  for (const p of products) {
    if (p.is_active) active++;
    if (p.status === 'live') live++;
    else comingSoon++;
  }

  return {
    total: products.length,
    live,
    comingSoon,
    active,
  };
}
