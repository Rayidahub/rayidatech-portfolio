// components/sections/Testimonials.tsx
import { Quote } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import GlassCard from '@/components/ui/GlassCard';
import Reveal from '@/components/ui/Reveal';
import type { Testimonial } from '@/types/testimonial';

async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }

  return (data as Testimonial[]) || [];
}

export default async function Testimonials() {
  const testimonials = await getTestimonials();

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <Section className="relative overflow-hidden bg-ink-deep">
      {/* Subtle dot pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'radial-gradient(circle, var(--paper) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />

      {/* Decorative radial glow behind heading */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(var(--primary-rgb), 0.35) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      <Container size="default" className="relative z-10">
        <Reveal>
          <div className="text-center mb-12">
            <Quote className="w-10 h-10 text-secondary/30 mx-auto mb-4" />
            <h2 className="font-display text-3xl md:text-4xl font-semibold">
              What Our Clients{' '}
              <span className="gradient-text">Say</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, index) => (
            <Reveal key={item.id} index={index}>
              <GlassCard className="p-6 group relative h-full">
                <p className="text-sm text-mist-1 leading-relaxed mb-6 italic border-l-2 border-(--line-strong) pl-4">
                  &ldquo;{item.testimonial}&rdquo;
                </p>
                <div className="border-t border-(--line) pt-4">
                  <p className="font-display text-sm font-semibold text-paper group-hover:text-secondary transition-colors duration-300">
                    {item.name}
                  </p>
                  <p className="text-xs text-mist-2">
                    {item.role}
                    {item.role && item.company && ', '}
                    {item.company}
                  </p>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
