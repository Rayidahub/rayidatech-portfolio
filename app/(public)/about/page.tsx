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
    <>
      {/* Hero — full-screen portrait-blend layout */}
      <AboutHero />

      {/* Journey Timeline */}
      <Section>
        <Container size="narrow">
          <Reveal>
            <h2>
              My <span>Journey</span>
            </h2>
          </Reveal>

          <div>
            {experiences.map((exp, index) => (
              <Reveal key={exp.role} index={index}>
                <div>
                  <GlassCard>
                    <div>
                      <h3>
                        {exp.role}
                      </h3>
                      <span>
                        {exp.period}
                      </span>
                    </div>
                    <p>{exp.company}</p>
                    <p>{exp.description}</p>
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
            <h2>
              How I <span>Work</span>
            </h2>
            <p>
              A structured approach that keeps every project focused and effective.
            </p>
          </Reveal>

          <div>
            {approach.map((step, index) => (
              <Reveal key={step.title} index={index}>
                <GlassCard>
                  <span>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3>
                    {step.title}
                  </h3>
                  <p>{step.description}</p>
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
            <h2>
              Skills &amp; <span>Expertise</span>
            </h2>
          </Reveal>

          <div>
            {skills.map((group, index) => {
              const Icon = group.icon
              return (
                <Reveal key={group.group} index={index}>
                  <GlassCard>
                    <div>
                      <Icon />
                    </div>
                    <h3>
                      {group.group}
                    </h3>
                    <ul>
                      {group.items.map((item) => (
                        <li key={item}>
                          <CheckCircle />
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
            <GlassCard>
              <p>
                My Philosophy
              </p>
              <blockquote>
                &ldquo;Building digital experiences people can trust.&rdquo;
              </blockquote>
              <div>
                {beliefs.map((belief) => (
                  <div key={belief}>
                    <span />
                    {belief}
                  </div>
                ))}
              </div>
            </GlassCard>
          </Reveal>
        </Container>
      </Section>

      {/* Team */}
      <Team />

      {/* Featured Projects */}
      <Section>
        <Container size="wide">
          <Reveal>
            <h2>
              Featured <span>Projects</span>
            </h2>
            <p>
              A selection of work I&apos;m proud of.
            </p>
          </Reveal>

          <div>
            {featuredProjects.map((project, index) => (
              <Reveal key={project.title} index={index}>
                <Link href="/projects">
                  <GlassCard>
                    <p>
                      {project.category}
                    </p>
                    <h3>
                      {project.title}
                    </h3>
                    <span>
                      View project <ArrowRight />
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
            <h2>
              <span>Certifications</span>
            </h2>
          </Reveal>

          <div>
            {certifications.map((cert, index) => (
              <Reveal key={cert.title} index={index}>
                <GlassCard>
                  <div>
                    <Award />
                  </div>
                  <div>
                    <p>
                      {cert.title}
                    </p>
                    <p>{cert.issuer}</p>
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
            <GlassCard>
              <h2>
                Let&apos;s Build Something
              </h2>
              <p>
                Have a project in mind? I&apos;d love to hear about it.
              </p>
              <Link href="/contact">
                Get In Touch <ArrowRight />
              </Link>
            </GlassCard>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
