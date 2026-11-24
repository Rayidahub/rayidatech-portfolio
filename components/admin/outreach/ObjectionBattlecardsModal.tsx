'use client';

import { useState } from 'react';
import {
  ShieldAlert,
  Copy,
  Check,
  X,
  MessageCircle,
  HelpCircle,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

export interface ObjectionBattlecard {
  id: string;
  objection: string;
  category: string;
  psychology: string;
  wordForWordScript: string;
}

export const OBJECTION_BATTLECARDS: ObjectionBattlecard[] = [
  {
    id: 'instagram_enough',
    objection: '"We already have an active Instagram/Facebook page. We don\'t need a website."',
    category: 'Channel Confusion',
    psychology: 'Proprietor conflates social media marketing (entertaining passers-by) with decision-stage conversion (parents verifying legitimacy before paying ₦500k+ fees).',
    wordForWordScript: `That's great, and your Instagram page looks very active! Here is the crucial difference: Instagram is rented land. When a parent or client is ready to pay ₦500,000+ in school fees or services, they don't scroll reels—they search Google for legitimacy.

A parent trying to check your curriculum, fee structure, or book an admission tour at 10 PM cannot do that smoothly through Instagram DMs. A website doesn't replace your Instagram; it catches all the parents who leave Instagram and Google because there was no instant booking system.

Take a look at this 30-second live demo we built for Abuja schools: https://rayidatech.name.ng/projects/crestfield-academy. Notice how parents can book a campus tour in 1 click? That's what turns casual viewers into enrolled students.`,
  },
  {
    id: 'economy_hard',
    objection: '"The economy is tough right now / School fees collection is down. We cannot afford ₦200,000."',
    category: 'Price / Cash Flow',
    psychology: 'They view a website as a luxury cosmetic expense rather than an enrollment revenue generator.',
    wordForWordScript: `I completely understand, and that is exactly why we designed this system. This isn't an expense; it is an admission-generating asset.

How much is your average term tuition per student? [Wait for answer, usually ₦150k–₦400k].

That means if this digital system brings you just ONE single new enrolled student this entire academic session, your ₦200,000 investment pays for itself 100%. Every term and year after that is pure recurring revenue for your school.

To ease cash flow, we structure it in two 50% milestones: ₦100,000 to initiate development, and the final ₦100,000 only after you have tested and approved the live system.`,
  },
  {
    id: 'it_teacher',
    objection: '"We already have an IT teacher / computer staff who handles our technology."',
    category: 'Internal IT Defense',
    psychology: 'They believe IT maintenance (fixing printers, teaching coding) is the same as conversion-rate design and UI engineering.',
    wordForWordScript: `That is excellent that you have an IT team on ground! We actually don't replace your internal IT—they handle your networks, computer labs, and day-to-day operations.

What Rayida Tech specializes in is Customer Acquisition UI & Conversion Architecture—ensuring that when prospective parents open your portal from an iPhone or Android phone, it loads in under 1 second, showcases your accreditation, and funnels them directly into your admissions officer's WhatsApp.

Your IT staff can maintain it with zero stress once we deploy it. Would you be open to a 3-minute preview of how we configure the WhatsApp admissions funnel?`,
  },
  {
    id: 'cheaper_competitor',
    objection: '"Another designer said they can do a WordPress site for ₦40,000."',
    category: 'Price Anchor',
    psychology: 'They have been burned by or pitched low-effort template freelancers who disappear after 2 weeks, leaving broken plugins and slow pages.',
    wordForWordScript: `I understand completely. You can definitely find people who install a cheap template for ₦40,000. 

The problem is that cheap templates take 8 seconds to load on Nigerian mobile networks, have broken contact forms, get hacked within 6 months, and make your premium school or business look amateur.

When high-income parents see a slow, generic template, they assume your educational standards are equally low. Rayida Tech builds custom, sub-second Next.js web systems with 7-day delivery, local SEO, and 30 days of dedicated support. We don't sell templates; we build enrollment machines that protect your brand prestige.`,
  },
  {
    id: 'call_me_next_term',
    objection: '"Call me back next term / after the holidays when we are less busy."',
    category: 'Procrastination',
    psychology: 'They fear the operational burden of a long, stressful web design project.',
    wordForWordScript: `I understand your schedule is packed right now! That's actually why we reach out now: parents research and make admission decisions 6 to 8 weeks BEFORE the new term begins. If we wait until the term starts, those parents have already enrolled their children elsewhere.

Also, our 24-Hour Rapid Onboarding means this requires almost zero work from you. You simply share your logo and tuition details, and we deliver your live staging link in 5 to 7 days.

Would you prefer we secure your staging slot now so your admissions system is capturing parents over the holiday break?`,
  },
  {
    id: 'build_first_pay_later',
    objection: '"Can you build it first, and if we like it, we will pay you?"',
    category: 'Risk Reversal Request',
    psychology: 'Fear of paying upfront and receiving nothing, or being disappointed.',
    wordForWordScript: `I appreciate you asking that! Because we commit dedicated engineering time and server infrastructure to each client, we never build unpaid spec work.

However, we eliminate 100% of your risk in two ways:
1. You can inspect our live interactive simulation right now: https://rayidatech.name.ng/projects/crestfield-academy. That is the exact high caliber of work you will receive.
2. We use a 50/50 milestone agreement. Your final 50% payment is ONLY due after you have reviewed and approved your live system on our staging server.

Shall I send the 1-page agreement for your review?`,
  },
];

export default function ObjectionBattlecardsModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [selectedCard, setSelectedCard] = useState<ObjectionBattlecard>(OBJECTION_BATTLECARDS[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (card: ObjectionBattlecard) => {
    navigator.clipboard.writeText(card.wordForWordScript);
    setCopiedId(card.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in text-slate-800 text-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Objection Battlecards &amp; Sales Call Cheatsheet
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Word-for-word response scripts to overcome price, timing, and skepticism objections.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2-Column Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
          {/* Objections List Column */}
          <div className="md:col-span-5 border-r border-slate-100 p-3 space-y-1.5 overflow-y-auto max-h-[400px] md:max-h-[500px]">
            {OBJECTION_BATTLECARDS.map((card) => {
              const isSelected = selectedCard.id === card.id;

              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => setSelectedCard(card)}
                  className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/80 border-[#3b5bfa] shadow-xs'
                      : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">
                    {card.category}
                  </span>
                  <p className="font-semibold text-xs leading-snug line-clamp-2 text-slate-900">
                    {card.objection}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Response Script Preview Column */}
          <div className="md:col-span-7 p-5 flex flex-col justify-between overflow-y-auto space-y-4 max-h-[400px] md:max-h-[500px]">
            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 font-bold block mb-1">
                  Objection Context &bull; {selectedCard.category}
                </span>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {selectedCard.objection}
                </h4>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-[11px] leading-relaxed">
                <strong className="text-slate-800 block mb-0.5">Underlying Psychology:</strong>
                {selectedCard.psychology}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-mono uppercase text-slate-400 font-bold">
                    Word-For-Word WhatsApp / Call Script:
                  </span>
                  <span className="text-[10px] text-slate-400">Ready to copy</span>
                </div>
                <textarea
                  readOnly
                  rows={9}
                  value={selectedCard.wordForWordScript}
                  className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-800 leading-relaxed focus:outline-none"
                />
              </div>
            </div>

            {/* Bottom Copy Button */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Tailored for Nigerian SMEs &amp; Abuja schools
              </span>

              <button
                type="button"
                onClick={() => handleCopy(selectedCard)}
                className="px-4 py-2 rounded-xl bg-[#3b5bfa] hover:bg-blue-600 text-white font-semibold text-xs inline-flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                {copiedId === selectedCard.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Copied Script!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Script</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
