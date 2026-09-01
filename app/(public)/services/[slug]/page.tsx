import { createClient } from '@/lib/supabase/server';
import { supabase } from '@/lib/supabase/client';
import type { Service } from '@/types/service';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';
import { notFound } from 'next/navigation';
import Container from '@/components/ui/Container';
import GlassCard from '@/components/ui/GlassCard';
import Reveal from '@/components/ui/Reveal';
import { ServiceIcon } from '@/lib/service-icons';

export const revalidate = 3600;

async function getService(slug: string): Promise<Service | null> {
  const supabase = await createClient();
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

  return (
    <main>
      <Container size="narrow">
        <Reveal>
          <Link href="/services">
            <ArrowLeft />
            Back to Services
          </Link>
        </Reveal>

        <Reveal>
          <div>
            <div>
              <ServiceIcon name={service.icon_name} />
            </div>
            <p>
              {service.title}
            </p>
            <h1>
              {service.headline}
            </h1>
            <p>
              {service.content}
            </p>
          </div>
        </Reveal>

        <Reveal>
          <GlassCard>
            <h2>
              What You Get
            </h2>
            <ul>
              {service.features.map((feature, index) => (
                <li key={index}>
                  <span>
                    <Check />
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </Reveal>

        <Reveal>
          <div>
            <Link href="/services">
              <ArrowLeft />
              Back to all services
            </Link>
          </div>
        </Reveal>
      </Container>
    </main>
  );
}
