import Link from 'next/link';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';

export default function NotFound() {
  return (
    <Section>
      <Container size="narrow">
        <div className="text-center py-24">
          <h1 className="font-display text-6xl font-bold text-paper mb-4">404</h1>
          <h2 className="font-display text-2xl font-semibold text-paper mb-2">
            Page Not Found
          </h2>
          <p className="text-mist-1 mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/80 text-white rounded-lg px-6 py-3 text-sm font-medium transition-colors"
          >
            Back Home
          </Link>
        </div>
      </Container>
    </Section>
  );
}
