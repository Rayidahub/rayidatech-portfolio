import Link from 'next/link';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import { ArrowRight } from 'lucide-react';

export default function FinalCTA() {
  return (
    <Section>
      <Container size="default">
        <Reveal>
          <div className="glass-strong rounded-2xl p-12 md:p-16 text-center max-w-3xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4 text-paper">
              Ready to Build{' '}
              <span className="gradient-text">Something Great?</span>
            </h2>
            <p className="text-mist-1 text-lg mb-8 max-w-lg mx-auto">
              Let&apos;s turn your idea into a digital solution that works.
            </p>
            <Link
              href="/contact"
              className="btn-glow inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 text-sm font-medium text-paper transition-all hover:bg-primary/80"
            >
              Start Your Project
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}