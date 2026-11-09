import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Sparkles, Layers, Cpu, ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import GlassCard from '@/components/ui/GlassCard';
import ProductsCatalogClient from '@/components/products/ProductsCatalogClient';
import { normalizeProduct } from '@/lib/products';
import { defaultEcosystemProducts } from '@/lib/data/products';
import type { EcosystemProduct } from '@/types/ecosystem-product';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Products & Ecosystem | Rayida Tech',
  description:
    'Explore Rayida Tech proprietary digital products, software tools, and AI-native applications designed to empower creators, developers, and global businesses.',
  openGraph: {
    title: 'Products & Ecosystem | Rayida Tech',
    description:
      'Proprietary software products and AI tools built by Rayida Tech for modern creators and enterprises.',
  },
};

async function getProducts(): Promise<EcosystemProduct[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('ecosystem_products')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return defaultEcosystemProducts.map(normalizeProduct);
    }

    return data.map(normalizeProduct);
  } catch (err) {
    console.error('Error fetching products:', err);
    return defaultEcosystemProducts.map(normalizeProduct);
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="relative overflow-hidden pt-24 pb-20">
      {/* Background Ambient Glows */}
      <div
        className="pointer-events-none absolute top-1/4 -left-48 w-96 h-96 rounded-full bg-primary/15 blur-3xl opacity-50"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/3 -right-48 w-96 h-96 rounded-full bg-secondary/15 blur-3xl opacity-40"
        aria-hidden="true"
      />

      <Section className="relative z-10 pt-4 pb-12">
        <Container size="wide">
          {/* Hero Header */}
          <Reveal>
            <div className="text-center max-w-3xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/25 text-secondary text-xs font-mono-tight uppercase tracking-wider mb-5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Rayida Tech Product Suite</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-paper tracking-tight mb-6">
                Proprietary Software &amp; <span className="gradient-text">Ecosystem</span> Products
              </h1>

              <p className="text-base sm:text-lg text-mist-1 leading-relaxed">
                Beyond bespoke client engineering, Rayida Tech incubates, designs, and builds proprietary software solutions spanning artificial intelligence, high-income digital education, cross-border payments, and voice productivity.
              </p>
            </div>
          </Reveal>

          {/* Value Highlights Pill Row */}
          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14 max-w-4xl mx-auto">
              {[
                {
                  icon: Cpu,
                  title: 'AI-Native Core',
                  desc: 'Engineered for seamless intelligence',
                },
                {
                  icon: Layers,
                  title: 'Interconnected',
                  desc: 'Single unified ecosystem layer',
                },
                {
                  icon: Sparkles,
                  title: 'Premium UX',
                  desc: 'Built with rigorous craftsmanship',
                },
                {
                  icon: ShieldCheck,
                  title: 'Trust & Privacy',
                  desc: 'NDPA & GDPR enterprise compliant',
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="glass rounded-xl p-3.5 border border-(--line) text-center space-y-1"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-secondary mb-1.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="font-display text-xs font-semibold text-paper">{item.title}</p>
                    <p className="text-[11px] text-mist-2">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </Reveal>

          {/* Interactive Products Catalog */}
          <ProductsCatalogClient products={products} />

          {/* Bottom Banner: Custom Product Engineering CTA */}
          <Reveal>
            <div className="mt-20 glass rounded-3xl p-8 sm:p-12 border border-(--line) text-center max-w-4xl mx-auto relative overflow-hidden shadow-2xl">
              <div
                className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-secondary/10 blur-3xl opacity-50"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/10 blur-3xl opacity-50"
                aria-hidden="true"
              />

              <div className="relative z-10 space-y-5">
                <span className="text-xs font-mono-tight text-accent-soft uppercase tracking-widest">
                  Have an App or Product in Mind?
                </span>

                <h2 className="font-display text-2xl sm:text-4xl font-bold text-paper">
                  Want Rayida Tech to Design &amp; Engineer Your Digital Product?
                </h2>

                <p className="text-sm sm:text-base text-mist-1 max-w-xl mx-auto leading-relaxed">
                  We bring the same precision, design systems, and full-stack AI engineering to custom client builds. From zero-to-one MVP launch to enterprise design system architecture.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
                  <Link
                    href="/contact"
                    className="btn-glow inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary/80 transition-colors shadow-lg shadow-primary/25"
                  >
                    <span>Start a Project</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-paper hover:text-white bg-white/5 hover:bg-white/10 border border-(--line) transition-colors"
                  >
                    <span>Explore Our Services</span>
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </div>
  );
}
