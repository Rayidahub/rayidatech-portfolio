// components/sections/Team.tsx
import { createClient } from '@/lib/supabase/server';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
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

function resolveMemberPhoto(member: TeamMember): string | null {
  if (member.photo_url) return member.photo_url;
  const lowerName = member.name.toLowerCase();
  if (lowerName.includes('raymond') || lowerName.includes('gaius')) {
    return '/img/about-portrait.png';
  }
  return null;
}

function SocialLink({
  href,
  icon: Icon,
  label,
  compact = false,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  compact?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={
        compact
          ? 'w-7 h-7 rounded-full bg-white/5 border border-white/10 hover:border-secondary/50 hover:bg-secondary/20 text-mist-1 hover:text-secondary flex items-center justify-center transition-all duration-300'
          : 'w-8 h-8 rounded-full bg-black/40 border border-white/15 hover:border-secondary hover:bg-secondary/25 text-paper hover:text-secondary flex items-center justify-center transition-all duration-300'
      }
    >
      <Icon className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
    </a>
  );
}

export default async function Team() {
  const members = await getTeamMembers();

  if (members.length === 0) {
    return null;
  }

  return (
    <Section id="team" className="relative overflow-hidden bg-ink-deep py-[var(--section-py)]">
      {/* Subtle technical dot pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'radial-gradient(circle, var(--paper) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />

      {/* Decorative ambient radial glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full opacity-20 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(var(--primary-rgb), 0.35) 0%, rgba(var(--secondary-rgb), 0.15) 40%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Signature 3-stripe decorative accent in bottom-right corner (matches reference composition) */}
      <div
        className="pointer-events-none absolute bottom-8 right-6 lg:right-10 hidden sm:flex items-end gap-2.5 opacity-30"
        aria-hidden="true"
      >
        <div
          className="w-2.5 h-10 bg-gradient-to-t from-secondary via-secondary/60 to-transparent"
          style={{ transform: 'skewX(-18deg)' }}
        />
        <div
          className="w-3 h-16 bg-gradient-to-t from-primary via-primary/60 to-transparent"
          style={{ transform: 'skewX(-18deg)' }}
        />
        <div
          className="w-3.5 h-24 bg-gradient-to-t from-secondary via-primary/50 to-transparent"
          style={{ transform: 'skewX(-18deg)' }}
        />
      </div>

      <Container size="wide" className="relative z-10">
        {/* ── Section Heading (Preserved copy, typography, and links) ── */}
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 md:mb-16">
            <div className="text-center sm:text-left">
              <p className="font-mono-tight text-xs uppercase tracking-[0.25em] text-secondary mb-3">
                The People Behind Rayida Tech
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight text-paper">
                Meet the <span className="gradient-text">Team</span>
              </h2>
            </div>
            <Link
              href="/team"
              className="inline-flex items-center justify-center gap-2 text-secondary hover:text-secondary/80 transition-colors mt-4 sm:mt-0 text-sm font-medium group"
            >
              <span>View All Team</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        {/* ── Slanted Card Grid (4-column horizontal composition) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 sm:gap-8 lg:gap-6 xl:gap-8 items-start">
          {members.map((member, index) => {
            const socials = member.social_links || {};
            const photoUrl = resolveMemberPhoto(member);

            return (
              <Reveal key={member.id} index={index}>
                <div className="group relative flex flex-col w-full">
                  {/* ── A. UPPER-LEFT GEOMETRIC ACCENT BRACKET ── */}
                  {/* Slanted angled accent framing the upper-left of the portrait */}
                  <div
                    className="pointer-events-none absolute -top-3 -left-2 z-20 h-32 w-32 transition-transform duration-500 ease-out group-hover:scale-105 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  >
                    <svg
                      className="w-full h-full overflow-visible drop-shadow-[0_0_10px_rgba(0,209,255,0.5)]"
                      viewBox="0 0 120 120"
                      fill="none"
                    >
                      <defs>
                        <linearGradient
                          id={`accent-grad-${member.id}`}
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="var(--secondary)" />
                          <stop offset="60%" stopColor="var(--primary)" />
                          <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                      </defs>
                      {/* Top horizontal accent line */}
                      <line
                        x1="44"
                        y1="6"
                        x2="105"
                        y2="6"
                        stroke={`url(#accent-grad-${member.id})`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                      {/* Slanted left diagonal accent bar */}
                      <line
                        x1="44"
                        y1="6"
                        x2="18"
                        y2="108"
                        stroke={`url(#accent-grad-${member.id})`}
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      {/* Geometric corner accent wedge */}
                      <polygon
                        points="44,6 56,6 34,82 22,82"
                        fill={`url(#accent-grad-${member.id})`}
                        opacity="0.85"
                      />
                    </svg>
                  </div>

                  {/* ── B. SLANTED RECTANGULAR PORTRAIT CARD ── */}
                  {/* Fixed uniform height across all cards for rigorous horizontal rhythm */}
                  <div className="relative w-full h-[360px] sm:h-[400px] lg:h-[420px] transition-transform duration-500 ease-out group-hover:-translate-y-1">
                    <div
                      className="relative h-full w-full overflow-hidden bg-gradient-to-b from-[#22243d] via-[#141528] to-[#0a0b16] border border-white/5 shadow-2xl"
                      style={{
                        clipPath:
                          'polygon(44px 0%, 100% 0%, calc(100% - 44px) 100%, 0% 100%)',
                      }}
                    >
                      {/* Studio spotlight gradient behind subject */}
                      <div
                        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(var(--secondary-rgb),0.2),transparent_65%)]"
                        aria-hidden="true"
                      />

                      {photoUrl ? (
                        /* Studio portrait photo */
                        <div className="relative h-full w-full">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photoUrl}
                            alt={member.name}
                            className="h-full w-full object-cover object-top filter contrast-[1.05] brightness-[0.98] transition-transform duration-700 ease-out group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        /* Stylized tech studio monogram for members without uploaded photo */
                        <div className="relative h-full w-full flex flex-col items-center justify-center p-6 text-center select-none bg-gradient-to-b from-[#1e2038] via-[#121324] to-[#090a14]">
                          <div
                            className="pointer-events-none absolute inset-0 opacity-20 bg-dot-pattern"
                            aria-hidden="true"
                          />
                          <div
                            className="pointer-events-none absolute inset-0 bg-radial-glow from-primary/25 via-secondary/15 to-transparent blur-2xl"
                            aria-hidden="true"
                          />

                          {/* Glowing geometric monogram badge */}
                          <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white/[0.04] border border-secondary/40 backdrop-blur-md flex items-center justify-center shadow-[0_0_20px_rgba(0,209,255,0.2)] transition-transform duration-500 group-hover:scale-110">
                            <span className="font-display text-4xl sm:text-5xl font-bold text-white drop-shadow-[0_0_12px_rgba(0,209,255,0.7)] tracking-wider">
                              {getInitials(member.name)}
                            </span>
                          </div>

                          <span className="relative z-10 mt-5 font-mono-tight text-[10px] uppercase tracking-[0.25em] text-secondary">
                            Rayida Tech Core
                          </span>
                        </div>
                      )}

                      {/* Ambient edge vignette / bottom grounding wash */}
                      <div
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/25 opacity-90 transition-opacity duration-300 group-hover:opacity-60"
                        aria-hidden="true"
                      />

                      {/* Subtle diagonal border highlight */}
                      <div
                        className="pointer-events-none absolute inset-0 border border-white/10 opacity-70 group-hover:border-secondary/40 transition-colors duration-500"
                        aria-hidden="true"
                      />

                      {/* ── Hover bio & interactive reveal overlay ── */}
                      <div className="pointer-events-none group-hover:pointer-events-auto absolute inset-0 bg-gradient-to-t from-[#0e0f1e]/95 via-[#0e0f1e]/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5 pb-6">
                        <p className="text-xs text-mist-1 line-clamp-3 mb-4 leading-relaxed font-sans drop-shadow-sm">
                          {member.bio}
                        </p>

                        {/* Interactive social icons inside hover overlay */}
                        <div className="flex items-center gap-2">
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
                      </div>
                    </div>
                  </div>

                  {/* ── C. ANGLED NAME & ROLE INFORMATION BAR ── */}
                  <div className="relative mt-3.5 w-full transition-transform duration-300 group-hover:-translate-y-0.5">
                    <div
                      className="relative overflow-hidden bg-[#0e0f1e]/95 backdrop-blur-md border border-white/10 py-3.5 px-6 shadow-xl transition-colors duration-300 group-hover:border-secondary/40"
                      style={{
                        clipPath:
                          'polygon(18px 0%, 100% 0%, calc(100% - 18px) 100%, 0% 100%)',
                      }}
                    >
                      {/* Bottom glowing brand accent line */}
                      <div
                        className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-secondary via-primary to-transparent"
                        aria-hidden="true"
                      />

                      {/* Left edge subtle glow wash */}
                      <div
                        className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-secondary/25 to-transparent"
                        aria-hidden="true"
                      />

                      {/* Member Name (bold uppercase display font, always crisp white) */}
                      <h3 className="font-display text-sm sm:text-base font-bold uppercase tracking-wider text-white group-hover:text-secondary transition-colors duration-300 truncate pl-2">
                        {member.name}
                      </h3>

                      {/* Member Professional Role (smaller, secondary italic font) */}
                      <p className="font-mono-tight text-[11px] sm:text-xs text-secondary italic tracking-wide truncate mt-0.5 pl-2">
                        {member.role}
                      </p>
                    </div>

                    {/* Accessible always-visible social links row below the name bar */}
                    <div className="flex items-center justify-start gap-1.5 mt-2.5 pl-2">
                      {socials.linkedin && (
                        <SocialLink
                          href={socials.linkedin}
                          icon={Network}
                          label={`${member.name} on LinkedIn`}
                          compact
                        />
                      )}
                      {socials.twitter && (
                        <SocialLink
                          href={socials.twitter}
                          icon={AtSign}
                          label={`${member.name} on X`}
                          compact
                        />
                      )}
                      {socials.github && (
                        <SocialLink
                          href={socials.github}
                          icon={Code}
                          label={`${member.name} on GitHub`}
                          compact
                        />
                      )}
                      {socials.website && (
                        <SocialLink
                          href={socials.website}
                          icon={Globe}
                          label={`${member.name}'s website`}
                          compact
                        />
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
