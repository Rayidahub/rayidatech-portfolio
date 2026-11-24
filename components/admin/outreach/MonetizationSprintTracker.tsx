'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Circle,
  TrendingUp,
  Target,
  Calendar,
  Sparkles,
  Zap,
  ArrowRight,
  RefreshCw,
  Award,
  DollarSign,
  Layers,
  GraduationCap,
  FileText,
} from 'lucide-react';

interface SprintDayItem {
  id: string;
  day: number;
  title: string;
  actionText: string;
  tip?: string;
  link?: string;
  linkText?: string;
}

interface SprintWeek {
  week: number;
  title: string;
  theme: string;
  targetRevenue: string;
  days: SprintDayItem[];
}

const SPRINT_WEEKS: SprintWeek[] = [
  {
    week: 1,
    title: 'Week 1 — Foundation & Staging',
    theme: 'Asset Setup, Weapon Mastery & Lead Sourcing',
    targetRevenue: '₦0 (Pipeline Prep)',
    days: [
      {
        id: 'w1_d1',
        day: 1,
        title: 'Master the Crestfield Demo Weapon',
        actionText: 'Review mobile & desktop viewpoints on the live demo. Memorize the 3 key conversion features.',
        link: '/projects/crestfield-academy',
        linkText: 'Open Demo',
      },
      {
        id: 'w1_d2',
        day: 2,
        title: 'Configure WhatsApp Quick Replies',
        actionText: 'Save Outreach Pitch Versions A, B, and C as WhatsApp Business quick replies (/pitch1, /pitch2, /proposal).',
      },
      {
        id: 'w1_d3',
        day: 3,
        title: 'Audit 15 Abuja School Leads',
        actionText: 'Filter Schools & Academies in the Lead Discovery engine. Confirm qualification scores (4/5 or 5/5).',
      },
      {
        id: 'w1_d4',
        day: 4,
        title: 'Personal Network Warm-up',
        actionText: 'Reach out to 5 friends, alumni, or colleagues with connections to Abuja private school proprietors.',
      },
      {
        id: 'w1_d5',
        day: 5,
        title: 'Publish LinkedIn Teardown #1',
        actionText: 'Share: "Why 80% of Abuja private school websites fail to convert mobile parents." Include screenshots.',
      },
      {
        id: 'w1_d6',
        day: 6,
        title: 'Test Live Proposal & Onboarding Links',
        actionText: 'Inspect the live proposal template and 24-hr rapid onboarding intake portal.',
        link: '/proposals/prestige-royal-academy',
        linkText: 'View Sample Proposal',
      },
      {
        id: 'w1_d7',
        day: 7,
        title: 'Sprint 1 Review & Lead Staging',
        actionText: 'Verify 25 high-scoring prospects are staged in your research pool ready for Monday morning outreach.',
      },
    ],
  },
  {
    week: 2,
    title: 'Week 2 — Market Entry & Cold Sprints',
    theme: 'High-Volume Outreach & Demo Delivery',
    targetRevenue: '₦0 (2 Active Proposals)',
    days: [
      {
        id: 'w2_d8',
        day: 8,
        title: 'Send 10 WhatsApp Pitches (Version A)',
        actionText: 'Click ⚡ Pitch on the top 10 verified schools in Wuse 2 and Gwarinpa. Send Version A cold hook.',
      },
      {
        id: 'w2_d9',
        day: 9,
        title: 'Follow-ups & 10 New Outreaches',
        actionText: 'Check replies from Day 8. Pitch 10 new catering/event decor businesses in Maitama.',
      },
      {
        id: 'w2_d10',
        day: 10,
        title: 'Dispatch Pitch Version B (Demo Weapon)',
        actionText: 'Send Version B with the Crestfield Academy link to all leads who responded with interest.',
      },
      {
        id: 'w2_d11',
        day: 11,
        title: 'Publish LinkedIn Authority Post #2',
        actionText: 'Post: "The 7-Day Digital Upgrade Framework for Nigerian businesses." Detail the 50/50 milestone model.',
      },
      {
        id: 'w2_d12',
        day: 12,
        title: 'Voice Note Check-ins',
        actionText: 'Send a warm 30-second WhatsApp voice note to 5 prospects who clicked your demo link.',
      },
      {
        id: 'w2_d13',
        day: 13,
        title: 'Send 2 Branded 1-Page Proposals',
        actionText: 'Click 📄 Proposal on your 2 warmest prospects and share their custom /proposals/[slug] link.',
      },
      {
        id: 'w2_d14',
        day: 14,
        title: 'Sprint 2 Review',
        actionText: 'Ensure 50 total outreaches have been dispatched; confirm 2 proposals are actively in client review.',
      },
    ],
  },
  {
    week: 3,
    title: 'Week 3 — Conversion & Rapid 7-Day Delivery',
    theme: 'Closing 2 Deals & Project Execution',
    targetRevenue: '₦300,000 Cash Collected',
    days: [
      {
        id: 'w3_d15',
        day: 15,
        title: 'Close Deal #1 & Collect ₦100,000 Deposit',
        actionText: 'Overcome objections using the playbook script. Confirm receipt of 50% Milestone 1 payment.',
      },
      {
        id: 'w3_d16',
        day: 16,
        title: 'Dispatch 24-Hour Onboarding Link',
        actionText: 'Send /onboarding to Client #1 to collect their logo, programs, photos, and WhatsApp line.',
        link: '/onboarding',
        linkText: 'Onboarding Portal',
      },
      {
        id: 'w3_d17',
        day: 17,
        title: 'Scaffold Client #1 Project',
        actionText: 'Build the core layout, programs list, and WhatsApp inquiry funnel using the Rayida component system.',
      },
      {
        id: 'w3_d18',
        day: 18,
        title: 'Close Deal #2 & Collect ₦100,000 Deposit',
        actionText: 'Follow up with proposal #2. Secure agreement and collect 50% Milestone 1 deposit (Total: ₦200k).',
      },
      {
        id: 'w3_d19',
        day: 19,
        title: 'Deliver Client #1 Staging Review',
        actionText: 'Send private staging URL to Client #1. Request feedback within 24 hours.',
      },
      {
        id: 'w3_d20',
        day: 20,
        title: 'Client #1 Revisions & Domain Setup',
        actionText: 'Apply final text tweaks, configure custom domain, SSL certificate, and test WhatsApp buttons.',
      },
      {
        id: 'w3_d21',
        day: 21,
        title: 'Launch Client #1 & Collect ₦100,000 Balance',
        actionText: 'Push site live! Confirm client delight and collect final 50% balance (Total cash: ₦300k).',
      },
    ],
  },
  {
    week: 4,
    title: 'Week 4 — Optimization & Recurring Retention',
    theme: 'Client Handover, Care Retainers & Scaling',
    targetRevenue: '₦400,000 + ₦70,000/mo MRR',
    days: [
      {
        id: 'w4_d22',
        day: 22,
        title: 'Present ₦35,000/mo Care Retainer to Client #1',
        actionText: 'Explain the value of ongoing uptime, security, monthly content updates, and analytics reporting.',
      },
      {
        id: 'w4_d23',
        day: 23,
        title: 'Launch Client #2 & Collect ₦100,000 Balance',
        actionText: 'Deploy Client #2 site live! Collect final 50% balance payment (Total upfront revenue: ₦400k).',
      },
      {
        id: 'w4_d24',
        day: 24,
        title: 'Collect 30-Second WhatsApp Video Testimonial',
        actionText: 'Ask both school heads/owners for a 30-second WhatsApp video review or written endorsement.',
      },
      {
        id: 'w4_d25',
        day: 25,
        title: 'Ask for 2 Proprietor Referrals',
        actionText: 'Ask: "Who are 2 other school directors you know in Abuja who need their digital portal modernized?"',
      },
      {
        id: 'w4_d26',
        day: 26,
        title: 'Publish LinkedIn Case Study #3',
        actionText: 'Post: "How we launched a complete digital admissions system for an Abuja school in 6 days flat."',
      },
      {
        id: 'w4_d27',
        day: 27,
        title: 'Lock in 2 Care Retainers (₦70,000/mo MRR)',
        actionText: 'Set up automated monthly retainer care agreements for Client #1 and Client #2.',
      },
      {
        id: 'w4_d28',
        day: 28,
        title: 'Batch Research 30 Prospects for Month 2',
        actionText: 'Research 30 new verified leads in `/admin/outreach/research` to fuel Month 2 pipeline.',
      },
      {
        id: 'w4_d29',
        day: 29,
        title: 'Financial & Pipeline Audit',
        actionText: 'Celebrate Milestone 1 achieved: ₦400k upfront cash generated + ₦70k/month recurring baseline.',
      },
      {
        id: 'w4_d30',
        day: 30,
        title: 'Set Month 2 Target (₦1,000,000 Revenue)',
        actionText: 'Scale to 4 upgrades + 6 retainers to hit Milestone 2 of the ₦16M ($10k/mo) Engine!',
      },
    ],
  },
];

export default function MonetizationSprintTracker({
  onClose,
}: {
  onClose?: () => void;
}) {
  const [activeWeek, setActiveWeek] = useState<number>(1);
  const [completedDays, setCompletedDays] = useState<Record<string, boolean>>({});

  // Load from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('rayida_monetization_sprint_v1');
      if (stored) {
        setCompletedDays(JSON.parse(stored));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const toggleDay = (id: string) => {
    setCompletedDays((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('rayida_monetization_sprint_v1', JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const currentWeekData = SPRINT_WEEKS.find((w) => w.week === activeWeek) || SPRINT_WEEKS[0];
  const totalDays = 30;
  const completedCount = Object.values(completedDays).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalDays) * 100);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                30-Day Monetization Sprint &amp; Revenue Engine
              </h3>
              <span className="text-[10px] font-mono-tight bg-blue-50 text-[#3b5bfa] font-bold px-2 py-0.5 rounded-full border border-blue-100">
                Target: ₦16M / $10k mo
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Daily revenue-generating checklist to close ₦200,000 upgrades and ₦35,000/mo retainers.
            </p>
          </div>
        </div>

        {/* Overall Progress Meter */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 px-3.5 py-2 rounded-2xl self-start sm:self-center">
          <div className="text-right">
            <span className="text-[10px] font-mono-tight text-slate-400 block uppercase">Progress</span>
            <span className="text-xs font-bold text-slate-800">
              {completedCount} / {totalDays} Days ({progressPercent}%)
            </span>
          </div>
          <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#3b5bfa] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Week Navigation Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {SPRINT_WEEKS.map((w) => {
          const weekCompleted = w.days.filter((d) => completedDays[d.id]).length;
          const isActive = activeWeek === w.week;

          return (
            <button
              key={w.week}
              type="button"
              onClick={() => setActiveWeek(w.week)}
              className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-50/80 border-[#3b5bfa] shadow-xs'
                  : 'bg-white border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-900 mb-0.5">
                <span>Week {w.week}</span>
                <span className="font-mono-tight text-[10px] text-blue-600">
                  {weekCompleted}/{w.days.length}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 truncate">{w.theme}</p>
              <div className="mt-2 text-[10px] font-mono-tight font-semibold text-emerald-600">
                {w.targetRevenue}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Week Task Checklist */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            {currentWeekData.title}
          </h4>
          <span className="text-[11px] text-slate-500 font-mono-tight">
            Target: <strong className="text-emerald-700">{currentWeekData.targetRevenue}</strong>
          </span>
        </div>

        <div className="space-y-2">
          {currentWeekData.days.map((day) => {
            const isDone = !!completedDays[day.id];

            return (
              <div
                key={day.id}
                onClick={() => toggleDay(day.id)}
                className={`flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                  isDone
                    ? 'bg-emerald-50/40 border-emerald-200/80 text-slate-600'
                    : 'bg-white border-slate-100 hover:border-slate-200 text-slate-800'
                }`}
              >
                <button
                  type="button"
                  className="mt-0.5 shrink-0 text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-300" />
                  )}
                </button>

                <div className="flex-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-tight text-[10px] font-bold text-blue-600 uppercase">
                      Day {day.day}
                    </span>
                    <span
                      className={`font-semibold ${
                        isDone ? 'line-through text-slate-500' : 'text-slate-900'
                      }`}
                    >
                      {day.title}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    {day.actionText}
                  </p>
                </div>

                {day.link && (
                  <Link
                    href={day.link}
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className="shrink-0 text-[10px] font-mono-tight font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-xl inline-flex items-center gap-1"
                  >
                    <span>{day.linkText || 'Open'}</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
