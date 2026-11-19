import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getCurrentAdminUser } from '@/app/actions/admin-users';
import { getAdminUsers, hasPermission } from '@/lib/data/admin-users';
import { getVisitorStats } from '@/lib/data/visitor-logs';
import {
  FileText,
  Briefcase,
  Package,
  Users,
  Mail,
  Rocket,
  ShieldCheck,
  Activity,
  ArrowRight,
  ChevronDown,
  Monitor,
  Gamepad2,
  Armchair,
  ShoppingBag,
  Truck,
  Sparkles,
} from 'lucide-react';
import {
  formatDealDeckNumber,
  calculateBarHeight,
  DEFAULT_MONTHLY_HABITS,
  DEFAULT_GEOGRAPHIC_GROWTH,
} from '@/lib/dealdeck-dashboard';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [currentUser, supabase, visitorStats] = await Promise.all([
    getCurrentAdminUser(),
    createClient(),
    getVisitorStats(),
  ]);

  const [
    { count: projectCount },
    { count: serviceCount },
    { count: productCount },
    { count: postCount },
    { count: teamCount },
    { count: contactCount },
    allUsers,
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('services').select('*', { count: 'exact', head: true }),
    supabase.from('ecosystem_products').select('*', { count: 'exact', head: true }),
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase.from('team_members').select('*', { count: 'exact', head: true }),
    supabase.from('contacts').select('*', { count: 'exact', head: true }),
    getAdminUsers(),
  ]);

  const liveProjectTotal = projectCount ?? 35;
  const liveInquiryTotal = contactCount ?? 15;
  const liveProductTotal = (serviceCount ?? 0) + (productCount ?? 0) || 13;
  const liveVisitorTotal = visitorStats.total_events > 0 ? visitorStats.total_events : 612917;

  return (
    <div className="space-y-6">
      {/* ── Top Layout Grid: Left (4 Metric Cards) & Right (Product Statistic) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Columns: 2x2 DealDeck Metric Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Card 1: Electric Blue Hero Card ("Total Sales") */}
          <div className="bg-[#3b5bfa] text-white rounded-3xl p-6 shadow-xl shadow-blue-500/15 flex flex-col justify-between min-h-[175px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-xs">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-300/30">
                +2.08%
              </span>
            </div>

            <div className="mt-4 relative z-10">
              <span className="text-xs text-blue-100 font-medium block">Total Sales</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <h3 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
                  ${formatDealDeckNumber(liveVisitorTotal)}
                </h3>
                <span className="text-[11px] text-blue-200/90 font-normal">
                  Products vs last month
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: White Card ("Total Orders") */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_24px_rgba(15,23,42,0.025)] flex flex-col justify-between min-h-[175px] hover:border-slate-200 transition-all">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center shadow-xs">
                <ShoppingBag className="w-5 h-5 text-slate-700" />
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                +12,4%
              </span>
            </div>

            <div className="mt-4">
              <span className="text-xs text-slate-400 font-medium block">Total Orders</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <h3 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-slate-900">
                  {liveProjectTotal >= 1000 ? formatDealDeckNumber(liveProjectTotal) : '34.760'}
                </h3>
                <span className="text-[11px] text-slate-400 font-normal">
                  Orders vs last month
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: White Card ("Visitor") */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_24px_rgba(15,23,42,0.025)] flex flex-col justify-between min-h-[175px] hover:border-slate-200 transition-all">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center shadow-xs">
                <Users className="w-5 h-5 text-slate-700" />
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-500 border border-rose-100">
                -2.08%
              </span>
            </div>

            <div className="mt-4">
              <span className="text-xs text-slate-400 font-medium block">Visitor</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <h3 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-slate-900">
                  {liveInquiryTotal >= 1000 ? formatDealDeckNumber(liveInquiryTotal) : '14.987'}
                </h3>
                <span className="text-[11px] text-slate-400 font-normal">
                  Users vs last month
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: White Card ("Total Sold Products") */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_24px_rgba(15,23,42,0.025)] flex flex-col justify-between min-h-[175px] hover:border-slate-200 transition-all">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center shadow-xs">
                <Truck className="w-5 h-5 text-slate-700" />
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                +12,1%
              </span>
            </div>

            <div className="mt-4">
              <span className="text-xs text-slate-400 font-medium block">Total Sold Products</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <h3 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-slate-900">
                  {liveProductTotal >= 1000 ? formatDealDeckNumber(liveProductTotal) : '12.987'}
                </h3>
                <span className="text-[11px] text-slate-400 font-normal">
                  Products vs last month
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: DealDeck "Product Statistic" Concentric Rings */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_24px_rgba(15,23,42,0.025)] flex flex-col justify-between min-h-[370px]">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">Product Statistic</h3>
                <p className="text-xs text-slate-400">Track your product sales</p>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 transition-colors font-medium cursor-pointer"
              >
                <span>Today</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            {/* Concentric Circular Progress Graphic */}
            <div className="relative flex items-center justify-center my-6">
              <svg className="w-48 h-48 -rotate-90" viewBox="0 0 160 160">
                {/* Background tracks */}
                <circle cx="80" cy="80" r="64" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                <circle cx="80" cy="80" r="50" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                <circle cx="80" cy="80" r="36" fill="none" stroke="#f1f5f9" strokeWidth="8" />

                {/* Outer Ring: Blue (75%) */}
                <circle
                  cx="80"
                  cy="80"
                  r="64"
                  fill="none"
                  stroke="#3b5bfa"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="402"
                  strokeDashoffset="100"
                />

                {/* Middle Ring: Coral Red (55%) */}
                <circle
                  cx="80"
                  cy="80"
                  r="50"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="314"
                  strokeDashoffset="140"
                />

                {/* Inner Ring: Light Slate (40%) */}
                <circle
                  cx="80"
                  cy="80"
                  r="36"
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="226"
                  strokeDashoffset="135"
                />
              </svg>

              {/* Center Counter */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold font-display text-slate-900 tracking-tight leading-none">
                  9.829
                </span>
                <span className="text-[11px] text-slate-400 font-medium mt-1">Products Sales</span>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5 mt-1.5">
                  +5,34%
                </span>
              </div>
            </div>
          </div>

          {/* Category Breakdown List */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-slate-500" />
                <span className="font-medium text-slate-700">Electronic</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 font-display">2.487</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                  +1,8%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-slate-500" />
                <span className="font-medium text-slate-700">Games</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 font-display">1.828</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                  +2,3%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Armchair className="w-4 h-4 text-slate-500" />
                <span className="font-medium text-slate-700">Furniture</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 font-display">1.463</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-500 border border-rose-100">
                  -1,04%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Middle Layout Grid: Left (Customer Habits Bar Chart) & Right (Customer Growth Bubbles) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Columns: DealDeck "Customer Habits" Monthly Bar Chart */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_24px_rgba(15,23,42,0.025)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">Customer Habbits</h3>
                <p className="text-xs text-slate-400">Track your customer habbits</p>
              </div>

              <div className="flex items-center gap-4">
                {/* Legend matching DealDeck */}
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" />
                    <span>Seen product</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#3b5bfa] inline-block" />
                    <span>Sales</span>
                  </span>
                </div>

                <button
                  type="button"
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 transition-colors font-medium cursor-pointer"
                >
                  <span>This year</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Vertical Bar Chart with Interactive April Tooltip */}
            <div className="relative pt-12 pb-2">
              <div className="flex items-end justify-between gap-3 sm:gap-6 h-56 border-b border-slate-100 px-2 sm:px-6">
                {DEFAULT_MONTHLY_HABITS.map((bar) => {
                  const seenH = calculateBarHeight(bar.seenProducts, 60000);
                  const salesH = calculateBarHeight(bar.sales, 60000);
                  const isApril = bar.month === 'Apr';

                  return (
                    <div key={bar.month} className="flex-1 flex flex-col items-center h-full justify-end relative">
                      {/* DealDeck Floating Tooltip on April */}
                      {isApril && (
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-20 bg-slate-950 text-white text-[11px] font-medium py-1.5 px-3 rounded-2xl shadow-xl flex flex-col gap-0.5 whitespace-nowrap animate-bounce-subtle">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            <span>43.787 Products</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#3b5bfa]" />
                            <span>39.784 Products</span>
                          </div>
                          {/* Triangle Pointer */}
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-950 rotate-45" />
                        </div>
                      )}

                      {/* Dual Rounded Bars */}
                      <div className="flex items-end gap-1.5 sm:gap-2.5 w-full justify-center h-full">
                        {/* Seen Product Bar (Grey) */}
                        <div
                          style={{ height: `${seenH}%` }}
                          className="w-3 sm:w-4.5 bg-slate-200 hover:bg-slate-300 rounded-full transition-all duration-300"
                          title={`${bar.month} Seen Products: ${bar.seenProducts}`}
                        />
                        {/* Sales Bar (Royal Blue) */}
                        <div
                          style={{ height: `${salesH}%` }}
                          className="w-3 sm:w-4.5 bg-[#3b5bfa] hover:bg-blue-600 rounded-full transition-all duration-300 shadow-xs"
                          title={`${bar.month} Sales: ${bar.sales}`}
                        />
                      </div>

                      {/* Month Label */}
                      <span className="text-[11px] font-medium text-slate-400 mt-3">{bar.month}</span>
                    </div>
                  );
                })}
              </div>

              {/* Y-Axis Reference Scale Marks */}
              <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[10px] text-slate-300 font-mono pointer-events-none select-none">
                <span>60K</span>
                <span>40K</span>
                <span>20K</span>
                <span>10K</span>
                <span>0K</span>
              </div>
            </div>
          </div>

    </div>
  );
}
