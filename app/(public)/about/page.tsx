import type { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import GlassCard from '@/components/ui/GlassCard';
import Reveal from '@/components/ui/Reveal';
import AboutHero from '@/components/sections/AboutHero';
import Team from '@/components/sections/Team';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn more about Raymond Gaius — Product Designer & AI Engineer at Rayida Tech. Background, skills, approach, and featured work.',
};
import {
  Palette,
  Code,
  Users,
  Lightbulb,
  Award,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

const skills = [
  {
    group: 'Design',
    items: ['UI/UX Design', 'Product Design', 'Brand Identity', 'Graphic Design'],
    icon: Palette,
  },
  {
    group: 'Frontend',
    items: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    icon: Code,
  },
  {
    group: 'Tools',
    items: ['Figma', 'Adobe Suite', 'CorelDRAW', 'WordPress'],
    icon: Lightbulb,
  },
  {
    group: 'Strategy',
    items: ['Design Thinking', 'User Research', 'Prototyping', 'Design Systems'],
    icon: Users,
  },
];

const experiences = [
  {
    role: 'Graphics Designer',
    company: 'Armstrong Corp',
    period: 'Jan 2025 — Present',
    description:
      'Creative direction and visual storytelling for marketing campaigns and brand assets.',
  },
  {
    role: 'Social Media Manager',
    company: 'The Link PR & Marketing Solution',
    period: 'Nov 2024 — Present',
    description:
      'Developed social media strategies and creative graphics for brand growth.',
  },
  {
    role: 'Product Designer',
    company: 'ProptVerse',
    period: 'Nov 2024',
    description:
      'UI/UX design, wireframing, prototyping, and usability testing for a real estate platform.',
  },
  {
    role: 'UI/UX Designer',
    company: 'NEA Group of Global Giants',
    period: 'Project Base',
    description:
      'Led user-centered design for e-commerce platforms and corporate websites.',
  },
];

const approach = [
  {
    title: 'Research',
    description: 'Understand users, market, and business goals before designing anything.',
  },
  {
    title: 'Design',
    description: 'Create intuitive, beautiful interfaces rooted in user needs.',
  },
  {
    title: 'Build',
    description: 'Develop with modern tools for performance, accessibility, and scalability.',
  },
  {
    title: 'Iterate',
    description: 'Test, learn, and refine until the product delivers real value.',
  },
];

const beliefs = [
  'Design is not just how it looks — it is how it works.',
  'The best products solve real problems for real people.',
  'Technology should amplify human potential, not replace it.',
  'Trust is the foundation of every lasting digital relationship.',
];

const featuredProjects = [
  { title: 'Vaulta', category: 'Fintech App' },
  { title: 'NEA Group', category: 'UI/UX' },
  { title: 'ProptVerse', category: 'Product Design' },
  { title: 'TradeVault', category: 'Web Platform' },
  { title: 'Brand System', category: 'Identity' },
  { title: 'EduLearn', category: 'EdTech' },
];

const certifications = [
  { title: 'Google UX Design', issuer: 'Google' },
  { title: 'Meta Frontend Developer', issuer: 'Meta' },
  { title: 'AI for Everyone', issuer: 'DeepLearning.AI' },
  { title: 'Responsive Web Design', issuer: 'freeCodeCamp' },
  { title: 'Figma Advanced', issuer: 'DesignCourse' },
  { title: 'Digital Marketing', issuer: 'Google Digital Garage' },
];

export default function AboutPage() {
  return (
    <main className="bg-ink min-h-screen">
      {/* Hero — full-screen portrait-blend layout */}
      <AboutHero />

      {/* ── Journey Timeline ── */}
      <Section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 bg-dot-pattern opacity-[0.25]"
          aria-hidden="true"
        />
        <Container size="narrow" className="relative z-10">
          <Reveal>
            <div className="text-center mb-16">
              <p className="font-mono-tight text-xs uppercase tracking-[0.25em] text-secondary mb-3">
                Experience &amp; Career
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-semibold text-paper">
                My <span className="gradient-text">Journey</span>
              </h2>
            </div>
          </Reveal>

          <div className="relative pl-6 sm:pl-8 md:pl-10 border-l border-(--line) space-y-8 max-w-2xl mx-auto">
            {experiences.map((exp, index) => (
              <Reveal key={exp.role} index={index}>
                <div className="relative">
                  {/* Stem node dot */}
                  <div
                    className={`absolute -left-[31px] sm:-left-[39px] md:-left-[47px] top-6 w-3 h-3 rounded-full ${
                      index === 0
                        ? 'bg-secondary ring-4 ring-secondary/20 signal-dot'
                        : 'bg-primary/60 ring-4 ring-ink'
                    }`}
                  />

                  <GlassCard className="p-6 transition-all duration-300 hover:border-primary/40 hover:-translate-y-0.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <h3 className="font-display text-lg font-semibold text-paper">
                        {exp.role}
                      </h3>
                      <span className="font-mono-tight text-xs text-secondary bg-secondary/10 border border-secondary/20 px-2.5 py-1 rounded-full w-fit">
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-primary font-medium text-sm mb-2">{exp.company}</p>
                    <p className="text-mist-1 text-sm leading-relaxed">{exp.description}</p>
                  </GlassCard>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── Approach (How I Work) ── */}
      <Section className="bg-[var(--ink-deep)] relative overflow-hidden border-y border-(--line)">
        <div
          className="pointer-events-none absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
          aria-hidden="true"
        />
        <Container size="default" className="relative z-10">
          <Reveal>
            <div className="text-center mb-14">
              <p className="font-mono-tight text-xs uppercase tracking-[0.25em] text-secondary mb-3">
                Process &amp; Methodology
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-paper mb-3">
                How I <span className="gradient-text">Work</span>
              </h2>
              <p className="text-mist-1 text-base max-w-xl mx-auto leading-relaxed">
                A structured, user-centered approach that keeps every project focused, iterative, and high-impact.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {approach.map((step, index) => (
              <Reveal key={step.title} index={index}>
                <GlassCard className="p-6 h-full flex flex-col justify-between group transition-all duration-300 hover:border-secondary/40 hover:-translate-y-1">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono-tight text-3xl font-bold text-secondary/30 group-hover:text-secondary transition-colors duration-300">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ArrowRight className="w-4 h-4 text-secondary -rotate-45" />
                      </div>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-paper mb-2 group-hover:text-secondary transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-mist-1 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── Skills & Expertise ── */}
      <Section className="relative overflow-hidden">
        <Container size="wide">
          <Reveal>
            <div className="text-center mb-14">
              <p className="font-mono-tight text-xs uppercase tracking-[0.25em] text-secondary mb-3">
                Capabilities &amp; Stack
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-paper">
                Skills &amp; <span className="gradient-text">Expertise</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((group, index) => {
              const Icon = group.icon;
              return (
                <Reveal key={group.group} index={index}>
                  <GlassCard className="p-6 h-full transition-all duration-300 hover:border-primary/40 hover:-translate-y-1">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/15 flex items-center justify-center mb-5 text-secondary border border-secondary/20 shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-paper mb-4">
                      {group.group}
                    </h3>
                    <ul className="space-y-2.5">
                      {group.items.map((item) => (
                        <li key={item} className="flex items-center gap-2.5 text-sm text-mist-1">
                          <CheckCircle className="w-4 h-4 text-secondary/80 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* ── Guiding Philosophy & Beliefs ── */}
      <Section className="bg-[var(--ink-deep)] relative overflow-hidden border-y border-(--line)">
        <Container size="narrow">
          <Reveal>
            <GlassCard className="p-8 md:p-12 text-center relative overflow-hidden">
              <div
                className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-primary/10 blur-3xl"
                aria-hidden="true"
              />
              <p className="font-mono-tight text-xs uppercase tracking-[0.25em] text-secondary mb-4">
                Guiding Philosophy
              </p>
              <blockquote className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold text-paper leading-snug mb-10 max-w-2xl mx-auto">
                &ldquo;Building digital experiences people can <span className="gradient-text">trust</span>.&rdquo;
              </blockquote>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-xl mx-auto">
                {beliefs.map((belief) => (
                  <div
                    key={belief}
                    className="flex items-start gap-3 text-sm text-mist-1 p-3.5 rounded-xl bg-paper/[0.03] border border-(--line)"
                  >
                    <span className="w-2 h-2 rounded-full bg-secondary mt-1.5 shrink-0" />
                    <span>{belief}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </Reveal>
        </Container>
      </Section>

      {/* ── Team Section ── */}
      <Team />

      {/* ── Featured Projects ── */}
      <Section className="relative overflow-hidden">
        <Container size="wide">
          <Reveal>
            <div className="text-center mb-14">
              <p className="font-mono-tight text-xs uppercase tracking-[0.25em] text-secondary mb-3">
                Selected Portfolio
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-paper mb-3">
                Featured <span className="gradient-text">Projects</span>
              </h2>
              <p className="text-mist-1 text-base max-w-xl mx-auto">
                A selection of products and experiences I&apos;m proud to have designed and built.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project, index) => (
              <Reveal key={project.title} index={index}>
                <Link href="/projects" className="block h-full group">
                  <GlassCard className="p-6 h-full flex flex-col justify-between transition-all duration-300 hover:border-primary/40 hover:-translate-y-1">
                    <div>
                      <p className="font-mono-tight text-xs text-secondary uppercase tracking-[0.15em] mb-3">
                        {project.category}
                      </p>
                      <h3 className="font-display text-xl font-semibold text-paper group-hover:text-primary transition-colors duration-300">
                        {project.title}
                      </h3>
                    </div>
                    <div className="inline-flex items-center gap-2 text-sm text-primary font-medium mt-6 group-hover:translate-x-1 transition-transform duration-300">
                      <span>View project</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </GlassCard>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── Certifications ── */}
      <Section className="bg-[var(--ink-deep)] relative overflow-hidden border-y border-(--line)">
        <Container size="default">
          <Reveal>
            <div className="text-center mb-14">
              <p className="font-mono-tight text-xs uppercase tracking-[0.25em] text-secondary mb-3">
                Continuous Learning
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-paper">
                Verified <span className="gradient-text">Certifications</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certifications.map((cert, index) => (
              <Reveal key={cert.title} index={index}>
                <GlassCard className="p-5 flex items-center gap-4 group transition-all duration-300 hover:border-secondary/40 hover:-translate-y-0.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center shrink-0 border border-(--line) group-hover:scale-105 transition-transform duration-300">
                    <Award className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="font-display text-sm font-semibold text-paper group-hover:text-secondary transition-colors duration-300">
                      {cert.title}
                    </p>
                    <p className="text-xs text-mist-2 font-mono-tight mt-0.5">{cert.issuer}</p>
                  </div>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── Final Call To Action ── */}
      <Section className="relative overflow-hidden py-20 md:py-28">
        <Container size="narrow">
          <Reveal>
            <GlassCard className="p-10 md:p-14 text-center relative overflow-hidden">
              <div
                className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/15 blur-3xl"
                aria-hidden="true"
              />
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-paper mb-4 relative z-10">
                Let&apos;s Build Something <span className="gradient-text">Exceptional</span>
              </h2>
              <p className="text-mist-1 mb-8 max-w-md mx-auto text-base relative z-10 leading-relaxed">
                Have a project or partnership in mind? I&apos;m currently available and ready to discuss your vision.
              </p>
              <div className="relative z-10 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="btn-glow inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-3.5 text-sm font-medium transition-all shadow-lg shadow-primary/20"
                >
                  Get In Touch <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/projects"
                  className="glass inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium text-paper hover:text-secondary transition-colors"
                >
                  Explore Portfolio
                </Link>
              </div>
            </GlassCard>
          </Reveal>
        </Container>
      </Section>
    </main>
  );
}
