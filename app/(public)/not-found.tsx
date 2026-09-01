import Link from 'next/link';
import { ArrowLeft, FolderSearch } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import GlassCard from '@/components/ui/GlassCard';

export default function NotFound() {
  return (
    <Section>
      <Container size="narrow">
        <GlassCard>
          <div>
            <FolderSearch />
          </div>

          <p>
            404 Error
          </p>
          <h1>
            Page Not Found
          </h1>
          <p>
            Sorry, we couldn&apos;t find the page you were looking for. It might
            have been moved or no longer exists.
          </p>

          <div>
            <Link href="/">
              <ArrowLeft />
              Back Home
            </Link>
            <Link href="/projects">
              View Projects
            </Link>
          </div>
        </GlassCard>
      </Container>
    </Section>
  );
}
