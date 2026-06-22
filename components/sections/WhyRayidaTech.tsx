import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import GlassCard from '@/components/ui/GlassCard';
import Reveal from '@/components/ui/Reveal';
import { Shield, Users, Target, Lightbulb } from 'lucide-react';

const values = [
  {
    icon: Shield,
    title: 'Trust-Driven',
    description: 'We build solutions people can rely on.',
    accent: 'border-l-primary',
  },
  {
    icon: Users,
    title: 'User-Centered',
    description: 'Every design starts with real user needs.',
    accent: 'border-l-secondary',
  },
  {
    icon: Target,
    title: 'Results-Focused',
    description: "We don't just design — we deliver impact.",
    accent: 'border-l-primary',
  },
  {
    icon: Lightbulb,
    title: 'Innovative',
    description: 'Modern tools, fresh thinking, practical solutions.',
    accent: 'border-l-secondary',
  },
];

export default function WhyRayidaTech() {
  return (
    <Section>
      <Container size="default">
        <Reveal>
          <div className="text-center mb-12">
            <p className="font-mono-tight text-xs uppercase tracking-[0.25em] text-secondary mb-3">
              Trust builds technology
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold">
              Why Work With{' '}
              <span className="gradient-text">Us?</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((item, index) => (
            <Reveal key={item.title} index={index}>
              <GlassCard className={`p-6 group border-l-2 ${item.accent}`}>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4 icon-hover">
                  <item.icon className="w-5 h-5 text-secondary transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2 text-paper group-hover:text-secondary transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-sm text-mist-1">{item.description}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}