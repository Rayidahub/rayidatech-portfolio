import { supabase } from '@/lib/supabase/client';
import type { Service } from '@/types/service';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';
import { notFound } from 'next/navigation';
import Container from '@/components/ui/Container';
import GlassCard from '@/components/ui/GlassCard';
import Reveal from '@/components/ui/Reveal';
import { getServiceIcon } from '@/lib/service-icons';

export const revalidate = 3600;

async function getService(slug: string): Promise<Service | null> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching service:', error);
    return null;
  }

  return data;
}

export async function generateStaticParams() {
  const { data } = await supabase.from('services').select('slug');

  if (!data) return [];

  return data.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) return { title: 'Service Not Found' };

  return {
    title: `${service.title} | Raymond Gaius`,
    description: service.description,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    notFound();
  }

  const Icon = getServiceIcon(service.icon_name);

  return (
    <main className="pt-32 pb-20">
      <Container size="narrow">
        <Reveal>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-mist-1 hover:text-secondary transition-colors mb-8 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>
        </Reveal>

        <Reveal>
          <div className="mb-10">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Icon className="w-6 h-6 text-secondary" />
            </div>
            <p className="font-mono-tight text-xs text-secondary mb-2 uppercase tracking-[0.15em]">
              {service.title}
            </p>
            <h1 className="font-display text-3xl md:text-4xl font-semibold mb-4 text-paper">
              {service.headline}
            </h1>
            <p className="text-mist-1 text-lg leading-relaxed">
              {service.content}
            </p>
          </div>
        </Reveal>

        <Reveal>
          <GlassCard className="p-8">
            <h2 className="font-display text-xl font-semibold mb-6 text-paper">
              What You Get
            </h2>
            <ul className="space-y-4">
              {service.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-secondary" />
                  </span>
                  <span className="text-mist-1">{feature}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </Reveal>

        <Reveal>
          <div className="mt-12 pt-8 border-t border-(--line)">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-mist-1 hover:text-secondary transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all services
            </Link>
          </div>
        </Reveal>
      </Container>
    </main>
  );
}
