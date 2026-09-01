import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import GlassCard from '@/components/ui/GlassCard';
import Reveal from '@/components/ui/Reveal';
import { Shield, Users, Target, Lightbulb, type LucideIcon } from 'lucide-react';

const values: Array<{
  icon: LucideIcon;
  title: string;
  description: string;
}> = [
  {
    icon: Shield,
    title: 'Trust-Driven',
    description: 'We build solutions people can rely on.',
  },
  {
    icon: Users,
    title: 'User-Centered',
    description: 'Every design starts with real user needs.',
  },
  {
    icon: Target,
    title: 'Results-Focused',
    description: "We don't just design — we deliver impact.",
  },
  {
    icon: Lightbulb,
    title: 'Innovative',
    description: 'Modern tools, fresh thinking, practical solutions.',
  },
];

export default function WhyRayidaTech() {
  return (
    <Section className="bg-[var(--ink-deep)] relative overflow-hidden">
      {/* Subtle radial glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full bg-radial-glow from-primary/5 via-secondary/5 to-transparent"
        aria-hidden="true"
      />
      <Container size="default" className="relative z-10">
        <Reveal>
          <div className="text-center mb-14 md:mb-16">
            <p className="font-mono-tight text-xs uppercase tracking-[0.25em] text-secondary mb-3">
              Trust builds technology
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold">
              Why Work With <span className="gradient-text">Us?</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((item, index) => {
            const Icon = item.icon;
            const isLast = index === values.length - 1;
            return (
              <Reveal key={item.title} index={index}>
                <GlassCard className="p-7 text-center h-full group">
                  <div
                    className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 ${
                      isLast
                        ? 'bg-gradient-to-br from-primary to-secondary text-paper shadow-lg shadow-primary/25'
                        : 'glass border border-(--line) text-secondary'
                    }`}
                  >
                    <Icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2 text-paper group-hover:text-secondary transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm text-mist-1 leading-relaxed">
                    {item.description}
                  </p>
                </GlassCard>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
