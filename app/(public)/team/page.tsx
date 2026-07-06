import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import GlassCard from '@/components/ui/GlassCard';
import Reveal from '@/components/ui/Reveal';
import type { TeamMember } from '@/types/team-member';
import { Network, AtSign, Code, Globe, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Team',
  description:
    'Meet the team behind Rayida Tech — designers, engineers, and strategists building digital experiences people can trust.',
};

async function getTeamMembers(): Promise<TeamMember[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
    .returns<TeamMember[]>();

  if (error) {
    console.error('Error fetching team members:', error);
    return [];
  }

  return data || [];
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function SocialLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-9 h-9 rounded-full bg-white/5 border border-(--line) flex items-center justify-center text-mist-2 hover:text-secondary hover:border-secondary/30 hover:bg-secondary/10 transition-all duration-300"
    >
      <Icon className="w-4 h-4" />
    </a>
  );
}

export default async function TeamPage() {
  const members = await getTeamMembers();

  return (
    <main>
      {/* Hero header */}
      <Section className="relative overflow-hidden bg-ink-deep pb-0">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'radial-gradient(circle, var(--paper) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-25 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(var(--primary-rgb), 0.4) 0%, transparent 60%)',
          }}
          aria-hidden="true"
        />

        <Container size="narrow" className="relative z-10 text-center">
          <Reveal>
            <p className="font-mono-tight text-xs uppercase tracking-[0.25em] text-secondary mb-3">
              Rayida Tech
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold mb-4">
              Meet the <span className="gradient-text">Team</span>
            </h1>
            <p className="text-mist-1 max-w-xl mx-auto">
              A small, focused group of designers, engineers, and strategists
              building digital experiences people can trust.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* Team grid */}
      <Section className="bg-ink-deep">
        <Container size="wide" className="relative z-10">
          {members.length === 0 ? (
            <Reveal>
              <p className="text-center text-mist-2">
                No team members to display yet.
              </p>
            </Reveal>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {members.map((member, index) => {
                const socials = member.social_links || {};

                return (
                  <Reveal key={member.id} index={index}>
                    <GlassCard className="p-6 text-center h-full group">
                      {member.photo_url ? (
                        <div className="w-28 h-28 mx-auto mb-5 rounded-full overflow-hidden border-2 border-(--line) group-hover:border-secondary/30 transition-colors duration-300">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={member.photo_url}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-28 h-28 mx-auto mb-5 rounded-full bg-gradient-to-br from-primary/20 to-secondary/10 border-2 border-(--line) group-hover:border-secondary/30 flex items-center justify-center transition-colors duration-300">
                          <span className="font-display text-3xl font-semibold text-secondary">
                            {getInitials(member.name)}
                          </span>
                        </div>
                      )}

                      <h2 className="font-display text-lg font-semibold text-paper group-hover:text-secondary transition-colors duration-300 mb-1">
                        {member.name}
                      </h2>
                      <p className="text-xs text-primary font-medium mb-3">
                        {member.role}
                      </p>
                      <p className="text-sm text-mist-1 leading-relaxed mb-5">
                        {member.bio}
                      </p>

                      <div className="flex items-center justify-center gap-2">
                        {socials.linkedin && (
                          <SocialLink
                            href={socials.linkedin}
                            icon={Network}
                            label={`${member.name} on LinkedIn`}
                          />
                        )}
                        {socials.twitter && (
                          <SocialLink
                            href={socials.twitter}
                            icon={AtSign}
                            label={`${member.name} on X`}
                          />
                        )}
                        {socials.github && (
                          <SocialLink
                            href={socials.github}
                            icon={Code}
                            label={`${member.name} on GitHub`}
                          />
                        )}
                        {socials.website && (
                          <SocialLink
                            href={socials.website}
                            icon={Globe}
                            label={`${member.name}'s website`}
                          />
                        )}
                      </div>
                    </GlassCard>
                  </Reveal>
                );
              })}
            </div>
          )}
        </Container>
      </Section>

      {/* Final CTA */}
      <Section className="bg-ink-deep">
        <Container size="narrow">
          <Reveal>
            <GlassCard className="p-8 md:p-12 text-center">
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-paper mb-3">
                Want to Join the Team?
              </h2>
              <p className="text-mist-1 mb-6 max-w-md mx-auto">
                We are always looking for talented people who care about design,
                technology, and impact.
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
    </main>
  );
}
