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

</div>
</div>
</div>
  );
}
