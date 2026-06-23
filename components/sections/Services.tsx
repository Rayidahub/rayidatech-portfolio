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
    <Section className="bg-[var(--ink-deep)] relative overflow-hidden">
      {/* Background gradient mesh */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute -top-[20%] -left-[10%] w-[45rem] h-[45rem] rounded-full bg-radial-glow from-primary/[0.05] via-transparent to-transparent blur-3xl" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[45rem] h-[45rem] rounded-full bg-radial-glow from-secondary/[0.05] via-transparent to-transparent blur-3xl" />
      </div>
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
                {/* Left accent gradient strip */}
                <div className={`absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b ${service.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                {/* Number badge */}
                <span className="font-mono-tight text-[10px] uppercase tracking-widest text-mist-2/40 group-hover:text-secondary/40 transition-colors duration-300">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4 icon-hover">
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