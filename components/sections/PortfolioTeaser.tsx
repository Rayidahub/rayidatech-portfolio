import Link from 'next/link';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import GlassCard from '@/components/ui/GlassCard';
import Reveal from '@/components/ui/Reveal';
import { ArrowRight } from 'lucide-react';

const projects = [
  {
    title: 'Vaulta',
    category: 'Fintech App',
    description: 'Modern money management reimagined.',
    gradient: 'from-primary/20 via-secondary/10 to-transparent',
  },
  {
    title: 'NEA Group',
    category: 'UI/UX',
    description: 'E-commerce redesign that increased conversion.',
    gradient: 'from-secondary/20 via-primary/10 to-transparent',
  },
  {
    title: 'ProptVerse',
    category: 'Product Design',
    description: 'Real estate platform with seamless UX.',
    gradient: 'from-primary/20 via-secondary/10 to-transparent',
  },
];

export default function PortfolioTeaser() {
  return (
    <Section className="bg-[var(--ink-deep)]">
      <Container size="wide">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold mb-2">
                Featured <span className="gradient-text">Projects</span>
              </h2>
              <p className="text-mist-1">Real work. Real impact.</p>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 transition-colors mt-4 sm:mt-0 text-sm font-medium group"
            >
              View All Projects
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Reveal key={project.title} index={index}>
              <Link href="/projects">
                <GlassCard className="p-0 h-full group overflow-hidden">
                  {/* Gradient strip at top */}
                  <div className={`h-24 bg-gradient-to-br ${project.gradient} relative`}>
                    <div className="absolute inset-0 flex items-end p-6 pb-0">
                      <span className="font-mono-tight text-xs text-secondary uppercase tracking-[0.1em]">
                        {project.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-semibold mb-2 text-paper group-hover:text-secondary transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-sm text-mist-1">{project.description}</p>
                    <span className="inline-flex items-center gap-1 text-sm text-secondary font-medium mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      View project <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </GlassCard>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}