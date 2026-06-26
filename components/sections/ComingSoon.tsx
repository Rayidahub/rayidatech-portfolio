// components/sections/ComingSoon.tsx
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import GlassCard from '@/components/ui/GlassCard';
import type { EcosystemProduct } from '@/types/ecosystem-product';

async function getEcosystemProducts(): Promise<EcosystemProduct[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('ecosystem_products')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching ecosystem products:', error);
    return [];
  }

  return (data as EcosystemProduct[]) || [];
}

function formatLaunchDate(dateString: string | null) {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default async function ComingSoon() {
  const products = await getEcosystemProducts();

  if (products.length === 0) {
    return null;
  }

  const topRow = products.slice(0, 3);
  const bottomRow = products.slice(3, 5);

  return (
    <Section id="coming-soon" className="relative overflow-hidden">
      <Container size="wide">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-14 md:mb-18">
            <p className="font-mono-tight text-xs uppercase tracking-[0.25em] text-secondary mb-4">
              Ecosystem Preview
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-semibold text-paper mb-6">
              Building the Future —{' '}
              <span className="text-secondary">One Product</span> at a Time
            </h2>
            <p className="text-lg leading-relaxed text-mist-1">
              We&apos;re building a connected ecosystem of products designed to
              empower, connect, and transform. Each product is crafted with
              purpose — and coming soon.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-14 md:mb-18">
          {topRow.map((product, index) => (
            <Reveal key={product.id} index={index} className="md:col-span-2">
              <ProductCard product={product} />
            </Reveal>
          ))}
          {bottomRow.map((product, index) => (
            <Reveal
              key={product.id}
              index={index + 3}
              className={`md:col-span-2 ${index === 0 ? 'md:col-start-2' : ''}`}
            >
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <p className="font-display text-xl md:text-2xl font-medium text-paper mb-8">
              Stay tuned. Something big is coming. 🚀
            </p>
            <Link
              href="/contact"
              className="btn-glow inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-sm font-semibold text-paper transition-all hover:bg-primary/80"
            >
              Subscribe for Updates
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

function ProductCard({ product }: { product: EcosystemProduct }) {
  const isLive = product.status === 'live';
  const formattedDate = formatLaunchDate(product.launch_date);

  return (
    <GlassCard className="h-full p-7 md:p-8">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 bg-primary/10">
        {product.emoji}
      </div>
      <div className="flex flex-wrap items-center gap-2.5 mb-3">
        <h3 className="font-display text-xl font-semibold text-paper">
          {product.name}
        </h3>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            isLive
              ? 'bg-secondary/15 text-secondary'
              : 'bg-primary/15 text-primary'
          }`}
        >
          {isLive ? 'Live' : 'Coming Soon'}
        </span>
      </div>
      {formattedDate && (
        <p className="text-xs font-medium text-mist-2 mb-3">
          {isLive ? 'Launched' : 'Expected'}: {formattedDate}
        </p>
      )}
      <p className="text-sm leading-relaxed text-mist-1">
        {product.description}
      </p>
    </GlassCard>
  );
}
