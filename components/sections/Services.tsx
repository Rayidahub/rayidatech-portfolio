import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import GlassCard from '@/components/ui/GlassCard';
import Reveal from '@/components/ui/Reveal';
import {
  Palette,
  Package,
  Fingerprint,
  Image,
  Monitor,
  GraduationCap,
} from 'lucide-react';

const services = [
  {
    icon: Palette,
    title: 'UI/UX Design',
    description:
      'User-centered interfaces that convert visitors into loyal customers.',
    accent: 'from-primary/20 to-secondary/10',
  },
  {
    icon: Package,
    title: 'Product Design',
    description:
      'From concept to launch — products designed with purpose and precision.',
    accent: 'from-secondary/20 to-primary/10',
  },
  {
    icon: Fingerprint,
    title: 'Brand Identity',
    description:
      'Logos, visual systems, and brand guidelines that tell your story.',
    accent: 'from-primary/20 to-secondary/10',
  },
  {
    icon: Image,
    title: 'Graphic Design',
    description:
      'Marketing materials, flyers, social media graphics that grab attention.',
    accent: 'from-secondary/20 to-primary/10',
  },
  {
    icon: Monitor,
    title: 'Website Design',
    description:
      'Modern, responsive websites that look great on every screen.',
    accent: 'from-primary/20 to-secondary/10',
  },
  {
    icon: GraduationCap,
    title: 'Tech Education',
    description:
      'Digital skills training that prepares you for the future of work.',
    accent: 'from-secondary/20 to-primary/10',
  },
];

export default function Services() {
  return (
    <Section className="bg-[var(--ink-deep)]">
      <Container size="wide">
        <Reveal>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-12 text-center">
            What <span className="gradient-text">We Do</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Reveal key={service.title} index={index}>
              <GlassCard className="p-6 group relative overflow-hidden">
                {/* Top accent gradient strip */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${service.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 icon-hover">
                  <service.icon className="w-5 h-5 text-secondary transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2 text-paper group-hover:text-secondary transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-sm text-mist-1 leading-relaxed">
                  {service.description}
                </p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}