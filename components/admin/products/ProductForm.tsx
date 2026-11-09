'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, Trash2, Globe, Sparkles, Loader2 } from 'lucide-react';
import type { EcosystemProduct, ProductInput } from '@/types/ecosystem-product';
import { createProductAction, updateProductAction } from '@/app/actions/products';
import ImageUploadField from '@/components/admin/ImageUploadField';
import { PRODUCT_CATEGORIES } from '@/lib/data/products';

interface ProductFormProps {
  initialProduct?: EcosystemProduct | null;
  mode: 'create' | 'edit';
}

export default function ProductForm({ initialProduct, mode }: ProductFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(initialProduct?.name || '');
  const [emoji, setEmoji] = useState(initialProduct?.emoji || '⚡');
  const [tagline, setTagline] = useState(initialProduct?.tagline || '');
  const [slug, setSlug] = useState(initialProduct?.slug || '');
  const [category, setCategory] = useState(initialProduct?.category || 'AI & Intelligence');
  const [status, setStatus] = useState<'coming_soon' | 'live' | 'beta'>((initialProduct?.status as any) || 'coming_soon');
  const [badge, setBadge] = useState(initialProduct?.badge || '');
  const [launchDate, setLaunchDate] = useState(
    initialProduct?.launch_date ? initialProduct.launch_date.slice(0, 10) : ''
  );
  const [sortOrder, setSortOrder] = useState<number>(initialProduct?.sort_order ?? 1);
  const [isActive, setIsActive] = useState<boolean>(initialProduct?.is_active ?? true);
  const [image, setImage] = useState(initialProduct?.image || '');
  const [websiteUrl, setWebsiteUrl] = useState(initialProduct?.website_url || '');
  const [waitlistUrl, setWaitlistUrl] = useState(initialProduct?.waitlist_url || '');
  const [description, setDescription] = useState(initialProduct?.description || '');

  // Dynamic feature bullet items
  const [features, setFeatures] = useState<string[]>(
    initialProduct?.features && initialProduct.features.length > 0
      ? initialProduct.features
      : ['']
  );

  function handleNameChange(val: string) {
    setName(val);
    if (mode === 'create' && !slug) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
      );
    }
  }

  function handleAddFeature() {
    setFeatures((prev) => [...prev, '']);
  }

  function handleFeatureChange(index: number, val: string) {
    setFeatures((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  }

  function handleRemoveFeature(index: number) {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const cleanedFeatures = features.map((f) => f.trim()).filter(Boolean);

    const payload: ProductInput = {
      name: name.trim(),
      emoji: emoji.trim() || '🚀',
      tagline: tagline.trim() || undefined,
      slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      category: category.trim(),
      status,
      badge: badge.trim() || null,
      launch_date: launchDate || null,
      sort_order: sortOrder,
      is_active: isActive,
      image: image.trim() || null,
      website_url: websiteUrl.trim() || null,
      waitlist_url: waitlistUrl.trim() || null,
      description: description.trim(),
      features: cleanedFeatures,
    };

    try {
      if (mode === 'create') {
        const res = await createProductAction(payload);
        if (!res.success) {
          setError(res.error || 'Failed to create product');
          setSaving(false);
          return;
        }
      } else if (initialProduct?.id) {
        const res = await updateProductAction(initialProduct.id, payload);
        if (!res.success) {
          setError(res.error || 'Failed to update product');
          setSaving(false);
          return;
        }
      }

      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Header & Sticky Action Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 text-mist-2 hover:text-paper hover:bg-white/5 rounded-xl transition-colors"
            title="Back to products list"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-semibold text-paper">
              {mode === 'create' ? 'New Ecosystem Product' : `Edit ${initialProduct?.name || 'Product'}`}
            </h1>
            <p className="text-xs text-mist-1">
              Configure product details, category, launch roadmap, and live endpoints.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2 text-sm text-mist-1 hover:text-paper hover:bg-white/5 rounded-xl transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            form="product-editor-form"
            disabled={saving}
            className="btn-glow inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary/80 transition-colors shadow-lg shadow-primary/25 disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{mode === 'create' ? 'Create Product' : 'Save Changes'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form id="product-editor-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Core Identity */}
        <div className="glass rounded-2xl p-6 border border-(--line) space-y-5">
          <div className="flex items-center gap-2 border-b border-(--line) pb-3">
            <Sparkles className="w-4 h-4 text-secondary" />
            <h2 className="font-display text-base font-semibold text-paper">Core Product Identity</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-mono-tight text-mist-1 mb-1.5">Emoji / Icon *</label>
              <input
                type="text"
                required
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                maxLength={8}
                className="w-full text-center bg-white/5 border border-(--line) rounded-xl px-3 py-2.5 text-2xl text-paper focus:outline-none focus:border-secondary transition-colors"
                placeholder="⚡"
              />
            </div>

            <div className="md:col-span-6">
              <label className="block text-xs font-mono-tight text-mist-1 mb-1.5">Product Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full bg-white/5 border border-(--line) rounded-xl px-3.5 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary transition-colors"
                placeholder="Rayce"
              />
            </div>

            <div className="md:col-span-4">
              <label className="block text-xs font-mono-tight text-mist-1 mb-1.5">URL Slug *</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-white/5 border border-(--line) rounded-xl px-3.5 py-2.5 text-sm text-paper font-mono-tight placeholder:text-mist-2 focus:outline-none focus:border-secondary transition-colors"
                placeholder="rayce"
              />
            </div>

            <div className="md:col-span-12">
              <label className="block text-xs font-mono-tight text-mist-1 mb-1.5">Tagline / Subtitle</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-white/5 border border-(--line) rounded-xl px-3.5 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-secondary transition-colors"
                placeholder="The intelligence hub connecting every Rayida product."
              />
            </div>

            <div className="md:col-span-5">
              <label className="block text-xs font-mono-tight text-mist-1 mb-1.5">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[var(--ink-deep)] border border-(--line) rounded-xl px-3.5 py-2.5 text-sm text-paper focus:outline-none focus:border-secondary transition-colors"
              >
                {PRODUCT_CATEGORIES.filter((c) => c !== 'All').map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-4">
              <label className="block text-xs font-mono-tight text-mist-1 mb-1.5">Custom Badge</label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full bg-white/5 border border-(--line) rounded-xl px-3.5 py-2.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-secondary transition-colors"
                placeholder="e.g. Core Engine, Cohort Beta"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-mono-tight text-mist-1 mb-1.5">Sort Order</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="w-full bg-white/5 border border-(--line) rounded-xl px-3.5 py-2.5 text-sm text-paper font-mono-tight focus:outline-none focus:border-secondary transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Status & Launch Details */}
        <div className="glass rounded-2xl p-6 border border-(--line) space-y-5">
          <div className="flex items-center gap-2 border-b border-(--line) pb-3">
            <Globe className="w-4 h-4 text-primary" />
            <h2 className="font-display text-base font-semibold text-paper">Status & External Endpoints</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono-tight text-mist-1 mb-1.5">Lifecycle Status *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-[var(--ink-deep)] border border-(--line) rounded-xl px-3.5 py-2.5 text-sm text-paper focus:outline-none focus:border-primary transition-colors"
              >
                <option value="coming_soon">Coming Soon</option>
                <option value="beta">Beta / Early Access</option>
                <option value="live">Live in Production</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono-tight text-mist-1 mb-1.5">Launch Date</label>
              <input
                type="date"
                value={launchDate}
                onChange={(e) => setLaunchDate(e.target.value)}
                className="w-full bg-white/5 border border-(--line) rounded-xl px-3.5 py-2.5 text-sm text-paper font-mono-tight focus:outline-none focus:border-secondary transition-colors"
              />
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded border-(--line) bg-white/5 text-primary focus:ring-primary cursor-pointer"
                />
                <span className="text-sm font-medium text-paper">Active in Public Showcase</span>
              </label>
            </div>

            <div className="sm:col-span-2 md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-mono-tight text-mist-1 mb-1.5">Live Website URL</label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-white/5 border border-(--line) rounded-xl px-3.5 py-2.5 text-xs text-paper font-mono-tight placeholder:text-mist-2 focus:outline-none focus:border-secondary transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-tight text-mist-1 mb-1.5">Waitlist / Contact URL</label>
                <input
                  type="text"
                  value={waitlistUrl}
                  onChange={(e) => setWaitlistUrl(e.target.value)}
                  placeholder="/contact?topic=..."
                  className="w-full bg-white/5 border border-(--line) rounded-xl px-3.5 py-2.5 text-xs text-paper font-mono-tight placeholder:text-mist-2 focus:outline-none focus:border-secondary transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Media & Graphic */}
        <div className="glass rounded-2xl p-6 border border-(--line) space-y-4">
          <ImageUploadField
            label="Product Showcase Graphic / Mockup"
            value={image}
            onChange={setImage}
            folder="products"
            description="Upload a high-resolution preview graphic (16:9 or 16:10 mockup recommended)"
            aspectRatio="aspect-[16/9]"
          />
        </div>

        {/* Section 4: Narrative & Description */}
        <div className="glass rounded-2xl p-6 border border-(--line) space-y-4">
          <label className="block text-xs font-mono-tight text-mist-1">Full Description *</label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white/5 border border-(--line) rounded-xl p-3.5 text-sm text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary transition-colors leading-relaxed"
            placeholder="Detailed overview explaining what the product does, who it is for, and how it solves real problems."
          />
        </div>

        {/* Section 5: Feature Bullets */}
        <div className="glass rounded-2xl p-6 border border-(--line) space-y-4">
          <div className="flex items-center justify-between border-b border-(--line) pb-3">
            <div>
              <h3 className="font-display text-sm font-semibold text-paper">Key Features & Capabilities</h3>
              <p className="text-xs text-mist-2">Bullet points displayed on product cards</p>
            </div>
            <button
              type="button"
              onClick={handleAddFeature}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-secondary hover:text-paper bg-secondary/10 hover:bg-secondary/20 border border-secondary/25 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Bullet</span>
            </button>
          </div>

          <div className="space-y-3">
            {features.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-6 text-center text-xs font-mono-tight text-mist-2">{idx + 1}.</span>
                <input
                  type="text"
                  value={feat}
                  onChange={(e) => handleFeatureChange(idx, e.target.value)}
                  placeholder="e.g. Multi-agent workflow orchestration"
                  className="flex-1 bg-white/5 border border-(--line) rounded-xl px-3.5 py-2 text-xs text-paper placeholder:text-mist-2 focus:outline-none focus:border-secondary transition-colors"
                />
                {features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="p-2 text-mist-2 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                    title="Remove feature"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
