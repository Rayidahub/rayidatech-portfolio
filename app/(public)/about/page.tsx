import Link from 'next/link';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import GlassCard from '@/components/ui/GlassCard';
import Reveal from '@/components/ui/Reveal';
import AboutHero from '@/components/sections/AboutHero';
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
    <>
      {/* Hero — full-screen portrait-blend layout */}
      <AboutHero />

      {/* Journey Timeline */}
      <Section>
        <Container size="narrow">
          <Reveal>
            <h2 className="font-display text-2xl md:text-3xl font-semibold mb-10 text-center">
              My <span className="text-primary">Journey</span>
            </h2>
          </Reveal>

          <div className="relative border-l-2 border-(--line) ml-4 space-y-8">
            {experiences.map((exp, index) => (
              <Reveal key={exp.role} index={index}>
                <div className="relative pl-8">
                  <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full border-2 border-primary bg-ink" />
                  <GlassCard className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                      <h3 className="font-display text-lg font-semibold text-paper">
                        {exp.role}
                      </h3>
                      <span className="text-xs text-mist-2 font-mono-tight mt-1 sm:mt-0">
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-primary text-sm mb-2">{exp.company}</p>
                    <p className="text-mist-1 text-sm">{exp.description}</p>
                  </GlassCard>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Approach */}
      <Section>
        <Container size="default">
          <Reveal>
            <h2 className="font-display text-2xl md:text-3xl font-semibold mb-2 text-center">
              How I <span className="text-primary">Work</span>
            </h2>
            <p className="text-mist-1 text-center mb-10 max-w-xl mx-auto">
              A structured approach that keeps every project focused and effective.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {approach.map((step, index) => (
              <Reveal key={step.title} index={index}>
                <GlassCard className="p-6 text-center">
                  <span className="font-mono-tight text-2xl font-bold text-primary/50">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-display text-lg font-semibold text-paper mt-3 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-mist-1 text-sm">{step.description}</p>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Skills */}
      <Section>
        <Container size="wide">
          <Reveal>
            <h2 className="font-display text-2xl md:text-3xl font-semibold mb-10 text-center">
              Skills &amp; <span className="text-primary">Expertise</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((group, index) => {
              const Icon = group.icon
              return (
                <Reveal key={group.group} index={index}>
                  <GlassCard className="p-6">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-paper mb-3">
                      {group.group}
                    </h3>
                    <ul className="space-y-2">
                      {group.items.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-mist-1">
                          <CheckCircle className="w-3.5 h-3.5 text-primary/60 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                </Reveal>
              )}
            )}
          </div>
        </Container>
      </Section>

      {/* Beliefs */}
      <Section>
        <Container size="narrow">
          <Reveal>
            <GlassCard className="p-8 text-center">
              <p className="font-mono-tight text-xs uppercase tracking-[0.25em] text-primary mb-4">
                My Philosophy
              </p>
              <blockquote className="font-display text-xl md:text-2xl font-semibold text-paper leading-snug mb-8">
                &ldquo;Building digital experiences people can trust.&rdquo;
              </blockquote>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                {beliefs.map((belief) => (
                  <div key={belief} className="flex items-start gap-3 text-sm text-mist-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    {belief}
                  </div>
                ))}
              </div>
            </GlassCard>
          </Reveal>
        </Container>
      </Section>

      {/* Featured Projects */}
      <Section>
        <Container size="wide">
          <Reveal>
            <h2 className="font-display text-2xl md:text-3xl font-semibold mb-2 text-center">
              Featured <span className="text-primary">Projects</span>
            </h2>
            <p className="text-mist-1 text-center mb-10 max-w-xl mx-auto">
              A selection of work I&apos;m proud of.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project, index) => (
              <Reveal key={project.title} index={index}>
                <Link href="/projects">
                  <GlassCard className="p-6 group">
                    <p className="font-mono-tight text-xs text-primary uppercase tracking-[0.1em] mb-2">
                      {project.category}
                    </p>
                    <h3 className="font-display text-xl font-semibold text-paper group-hover:text-primary transition-colors duration-300">
                      {project.title}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-sm text-primary font-medium mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      View project <ArrowRight className="w-3 h-3" />
                    </span>
                  </GlassCard>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Certifications */}
      <Section>
        <Container size="default">
          <Reveal>
            <h2 className="font-display text-2xl md:text-3xl font-semibold mb-10 text-center">
              <span className="text-primary">Certifications</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certifications.map((cert, index) => (
              <Reveal key={cert.title} index={index}>
                <GlassCard className="p-5 flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-display text-sm font-semibold text-paper group-hover:text-primary transition-colors duration-300">
                      {cert.title}
                    </p>
                    <p className="text-xs text-mist-2">{cert.issuer}</p>
                  </div>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Final CTA */}
      <Section>
        <Container size="narrow">
          <Reveal>
            <GlassCard className="p-8 md:p-12 text-center">
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-paper mb-3">
                Let&apos;s Build Something
              </h2>
              <p className="text-mist-1 mb-6 max-w-md mx-auto">
                Have a project in mind? I&apos;d love to hear about it.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/80 text-white rounded-lg px-6 py-3 text-sm font-medium transition-colors"
              >
                Get In Touch <ArrowRight className="w-4 h-4" />
              </Link>
            </GlassCard>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
