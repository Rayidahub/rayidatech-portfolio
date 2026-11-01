'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Users,
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
  { href: '/admin/outreach/import', label: 'Import (.xlsx / .csv)', icon: UploadCloud },
  { href: '/admin/outreach/campaigns', label: 'Campaigns', icon: SendHorizontal },
  { href: '/admin/outreach/templates', label: 'Templates', icon: FileText },
  { href: '/admin/outreach/suppressions', label: 'Suppressions', icon: ShieldBan },
  { href: '/admin/outreach/settings', label: 'Provider Settings', icon: Sliders },
];

export default function OutreachNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-(--line) pb-4">
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
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-primary text-paper shadow-md shadow-primary/20'
                  : 'text-mist-1 hover:text-paper hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Link
          href="/admin/outreach/campaigns/new"
          className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg px-3.5 py-2 text-xs font-semibold shadow-md shadow-primary/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Campaign</span>
        </Link>
      </div>
    </div>
  );
}

