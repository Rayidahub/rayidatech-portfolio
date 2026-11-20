'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Users,
  Compass,
  UploadCloud,
  SendHorizontal,
  FileText,
  Sliders,
  ShieldBan,
  Plus,
} from 'lucide-react';

const tabs = [
  { href: '/admin/outreach', label: 'Overview', icon: BarChart3, exact: true },
  { href: '/admin/outreach/contacts', label: 'Prospects', icon: Users },
  { href: '/admin/outreach/research', label: 'Lead Research & Finder', icon: Compass, badge: 'New' },
  { href: '/admin/outreach/import', label: 'Import (.xlsx / .csv)', icon: UploadCloud },
  { href: '/admin/outreach/campaigns', label: 'Campaigns', icon: SendHorizontal },
  { href: '/admin/outreach/templates', label: 'Templates', icon: FileText },
  { href: '/admin/outreach/suppressions', label: 'Suppressions', icon: ShieldBan },
  { href: '/admin/outreach/settings', label: 'Provider Settings', icon: Sliders },
];

export default function OutreachNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-200/80 pb-4">
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = tab.exact
            ? pathname === tab.href
            : pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#3b5bfa] text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200/80'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {'badge' in tab && tab.badge && (
                <span
                  className={`text-[9px] font-mono-tight px-1.5 py-0.5 rounded-full uppercase tracking-wider font-semibold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-blue-50 text-blue-600 border border-blue-100'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Link
          href="/admin/outreach/campaigns/new"
          className="inline-flex items-center gap-1.5 bg-[#3b5bfa] hover:bg-blue-600 text-white rounded-xl px-3.5 py-2 text-xs font-semibold shadow-xs transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Campaign</span>
        </Link>
      </div>
    </div>
  );
}

