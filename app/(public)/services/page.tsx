import { supabase } from '@/lib/supabase/client';
import type { Service } from '@/types/service';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import GlassCard from '@/components/ui/GlassCard';
import Reveal from '@/components/ui/Reveal';
import { getServiceIcon } from '@/lib/service-icons';

export const revalidate = 3600;

async function getServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('order', { ascending: true });

  if (error) {
    console.error('Error fetching services:', error);
    return [];
  }

  return data || [];
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <main className="pt-32 pb-20">
      <Container size="default">
        <Reveal>
          <div className="mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-semibold mb-4">
              Our <span className="gradient-text">Services</span>
            </h1>
            <p className="text-mist-1 text-lg max-w-2xl">
              From design to development to education — we deliver digital
              solutions that help your business grow.
            </p>
          </div>
        </Reveal>

        {services.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-mist-2">No services listed yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const Icon = getServiceIcon(service.icon_name);
              return (
                <Reveal key={service.id} index={index}>
                  <Link href={`/services/${service.slug}`}>
                    <GlassCard className="p-6 h-full group block">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="w-5 h-5 text-secondary" />
                      </div>
                      <p className="font-mono-tight text-xs text-secondary mb-1 uppercase tracking-[0.1em]">
                        Service
                      </p>
                      <h2 className="font-display text-xl font-semibold mb-2 text-paper group-hover:text-secondary transition-colors">
                        {service.title}
                      </h2>
                      <p className="text-sm text-mist-1 mb-4 line-clamp-2">
                        {service.description}
                      </p>
                      <span className="inline-flex items-center gap-1 text-sm text-secondary font-medium">
                        Learn more <ArrowRight className="w-3 h-3" />
                      </span>
                    </GlassCard>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        )}
      </Container>
    </main>
  );
}
