'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BrandLogo from '@/components/ui/BrandLogo';
import { ShieldCheck, X, Sparkles, ArrowRight } from 'lucide-react';
import type { AdminRole, AdminPermission } from '@/types/admin-user';
import {
  getVisibleAdminNavCategories,
  isAdminRouteActive,
  getAdminCategoryHeaderClasses,
  getAdminBadgeClasses,
} from '@/lib/admin-nav';

interface AdminSidebarProps {
  role?: AdminRole;
  permissions?: AdminPermission[];
  isMobile?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({
  role = 'super_admin',
  permissions = [],
  isMobile = false,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();

  // Filter categories and their items based on role & permissions
  const visibleCategories = getVisibleAdminNavCategories({ role, permissions });

  const roleLabels: Record<AdminRole, { label: string; style: string }> = {
    super_admin: { label: 'Super Admin', style: 'text-indigo-600 border-indigo-200 bg-indigo-50' },
    admin: { label: 'Admin store', style: 'text-blue-600 border-blue-200 bg-blue-50' },
    editor: { label: 'Editor', style: 'text-slate-600 border-slate-200 bg-slate-50' },
  };

  const roleInfo = roleLabels[role] || roleLabels.editor;

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <aside
      className={`${
        isMobile
          ? 'w-full h-full flex flex-col bg-white'
          : 'w-64 min-h-screen bg-white border-r border-slate-200/80 flex flex-col shrink-0'
      }`}
    >
      {/* Top Header: Brand Logo & Title matching DealDeck */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <Link href="/" onClick={handleLinkClick} className="inline-flex items-center gap-2.5">
            <BrandLogo className="h-7 w-auto" />
            <span className="font-display font-bold text-lg text-slate-900 tracking-tight">
              Rayida Tech
            </span>
          </Link>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-slate-400 text-xs font-normal">Admin Workspace</span>
            <span
              className={`text-[10px] uppercase font-mono-tight font-semibold px-2 py-0.5 rounded-full border ${roleInfo.style}`}
            >
              {roleInfo.label}
            </span>
          </div>
        </div>

        {isMobile && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors -mr-2 cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation List matching DealDeck menu structure */}
      <nav className="flex-1 p-3.5 space-y-5 overflow-y-auto">
        {visibleCategories.map((category) => (
          <div key={category.id} className="space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3.5 pt-1 pb-1 flex items-center justify-between select-none">
              <span>{category.title}</span>
              {category.shortLabel && (
                <span className="text-[9px] text-slate-400 font-mono-tight font-medium tracking-normal">
                  {category.shortLabel}
                </span>
              )}
            </div>

            <div className="space-y-1">
              {category.items.map((item) => {
                const isActive = isAdminRouteActive(pathname, item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleLinkClick}
                    className={`group flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-[#3b5bfa] text-white font-medium shadow-md shadow-blue-500/20'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70 font-normal'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && role === 'super_admin' && (
                      <span className={getAdminBadgeClasses(item.badgeVariant)}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* DealDeck Promo/Status Card: "Upgrade Pro" style */}
      <div className="p-4 border-t border-slate-100 space-y-3">
        <div className="bg-slate-950 text-white rounded-3xl p-4 shadow-sm relative overflow-hidden">
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-blue-400 mb-2.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-sm text-white leading-tight">Rayida Engine</h4>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
            v2.4 Active &amp; Synchronized with Supabase
          </p>
          <Link
            href="/"
            onClick={handleLinkClick}
            className="w-full mt-3 py-2 px-3 rounded-xl bg-[#3b5bfa] hover:bg-blue-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
          >
            <span>View Public Site</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {role === 'super_admin' && (
          <Link
            href="/admin/users"
            onClick={handleLinkClick}
            className="flex items-center gap-2 text-xs text-indigo-600 hover:text-indigo-800 transition-colors px-1 font-medium"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Manage Access &amp; Roles</span>
          </Link>
        )}
      </div>
    </aside>
  );
}
