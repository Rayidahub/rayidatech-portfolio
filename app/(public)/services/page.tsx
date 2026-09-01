import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import type { Service } from '@/types/service';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import GlassCard from '@/components/ui/GlassCard';
import Reveal from '@/components/ui/Reveal';
import { ServiceIcon } from '@/lib/service-icons';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Full-service design and engineering — UI/UX design, AI development, branding, and full-stack web solutions by Raymond Gaius at Rayida Tech.',
};

async function getServices(): Promise<Service[]> {
  const supabase = await createClient();
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
    <main>
      <Container size="default">
        <Reveal>
          <div>
            <h1>
              Our <span>Services</span>
            </h1>
            <p>
              From design to development to education — we deliver digital
              solutions that help your business grow.
            </p>
          </div>
        </Reveal>

        {services.length === 0 ? (
          <div>
            <p>No services listed yet. Check back soon!</p>
          </div>
        ) : (
          <div>
            {services.map((service, index) => (
              <Reveal key={service.id} index={index}>
                <Link href={`/services/${service.slug}`}>
                  <GlassCard>
                    <div>
                      <ServiceIcon name={service.icon_name} />
                    </div>
                    <p>
                      Service
                    </p>
                    <h2>
                      {service.title}
                    </h2>
                    <p>
                      {service.description}
                    </p>
                    <span>
                      Learn more <ArrowRight />
                    </span>
                  </GlassCard>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}
