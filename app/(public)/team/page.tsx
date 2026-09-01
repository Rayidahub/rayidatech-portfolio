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
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
      <Icon />
    </a>
  );
}

export default async function TeamPage() {
  const members = await getTeamMembers();

  return (
    <main>
      {/* Hero header */}
      <Section>
        <Container size="narrow">
          <Reveal>
            <p>
              Rayida Tech
            </p>
            <h1>
              Meet the <span>Team</span>
            </h1>
            <p>
              A small, focused group of designers, engineers, and strategists
              building digital experiences people can trust.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* Team grid */}
      <Section>
        <Container size="wide">
          {members.length === 0 ? (
            <Reveal>
              <p>
                No team members to display yet.
              </p>
            </Reveal>
          ) : (
            <div>
              {members.map((member, index) => {
                const socials = member.social_links || {};

                return (
                  <Reveal key={member.id} index={index}>
                    <GlassCard>
                      {member.photo_url ? (
                        <div>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={member.photo_url} alt={member.name} />
                        </div>
                      ) : (
                        <div>
                          <span>
                            {getInitials(member.name)}
                          </span>
                        </div>
                      )}

                      <h2>
                        {member.name}
                      </h2>
                      <p>
                        {member.role}
                      </p>
                      <p>
                        {member.bio}
                      </p>

                      <div>
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
      <Section>
        <Container size="narrow">
          <Reveal>
            <GlassCard>
              <h2>
                Want to Join the Team?
              </h2>
              <p>
                We are always looking for talented people who care about design,
                technology, and impact.
              </p>
              <Link href="/contact">
                Get In Touch <ArrowRight />
              </Link>
            </GlassCard>
          </Reveal>
        </Container>
      </Section>
    </main>
  );
}
