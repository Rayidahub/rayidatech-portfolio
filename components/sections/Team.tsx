// components/sections/Team.tsx
import { createClient } from '@/lib/supabase/server';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import GlassCard from '@/components/ui/GlassCard';
import Reveal from '@/components/ui/Reveal';
import type { TeamMember } from '@/types/team-member';
import { Network, AtSign, Code, Globe, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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
      className="w-8 h-8 rounded-full glass flex items-center justify-center text-mist-2 hover:text-secondary hover:border-secondary/30 hover:bg-secondary/10 transition-all duration-300"
    >
      <Icon className="w-3.5 h-3.5" />
    </a>
  );
}

export default async function Team() {
  const members = await getTeamMembers();

  if (members.length === 0) {
    return null;
  }

  return (
    <Section className="relative overflow-hidden bg-ink-deep">
      {/* Subtle dot pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'radial-gradient(circle, var(--paper) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />

      {/* Decorative radial glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-20 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(var(--primary-rgb), 0.35) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      <Container size="wide" className="relative z-10">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div className="text-center sm:text-left">
              <p className="font-mono-tight text-xs uppercase tracking-[0.25em] text-secondary mb-3">
                The People Behind Rayida Tech
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold">
                Meet the <span className="gradient-text">Team</span>
              </h2>
            </div>
            <Link
              href="/team"
              className="inline-flex items-center justify-center gap-2 text-secondary hover:text-secondary/80 transition-colors mt-4 sm:mt-0 text-sm font-medium"
            >
              View All Team
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((member, index) => {
            const socials = member.social_links || {};

            return (
              <Reveal key={member.id} index={index}>
                <GlassCard className="p-7 md:p-8 text-center h-full group">
                  {/* Avatar */}
                  <div className="relative mx-auto mb-5">
                    {member.photo_url ? (
                      <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-(--line) group-hover:border-secondary/30 transition-colors duration-300">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={member.photo_url}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-secondary/10 border-2 border-(--line) group-hover:border-secondary/30 flex items-center justify-center transition-colors duration-300">
                        <span className="font-display text-2xl font-semibold text-secondary">
                          {getInitials(member.name)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <h3 className="font-display text-lg font-semibold text-paper group-hover:text-secondary transition-colors duration-300 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-xs text-primary font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-sm text-mist-1 leading-relaxed mb-5 line-clamp-4">
                    {member.bio}
                  </p>

                  {/* Social links */}
                  <div className="flex items-center justify-center gap-2 mt-auto">
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
      </Container>
    </Section>
  );
}
