'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BrandLogo from '@/components/ui/BrandLogo';
import { ShieldCheck, X } from 'lucide-react';
import type { AdminRole, AdminPermission } from '@/types/admin-user';
import {
  getVisibleAdminNavCategories,
  isAdminRouteActive,
  getAdminCategoryHeaderClasses,
  getAdminNavLinkClasses,
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
    super_admin: { label: 'Super Admin', style: 'text-secondary border-secondary/30 bg-secondary/10' },
    admin: { label: 'Admin', style: 'text-secondary/90 border-secondary/20 bg-secondary/5' },
    editor: { label: 'Editor', style: 'text-mist-1 border-white/10 bg-white/5' },
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
          ? 'w-full h-full flex flex-col bg-[var(--ink-deep)]'
          : 'w-64 min-h-screen bg-white border-r border-slate-200/80 flex flex-col shrink-0'
      }`}
    >
      <div className="p-6 border-b border-(--line) flex items-center justify-between">
        <div>
          <Link href="/" onClick={handleLinkClick} className="inline-flex items-center">
            <BrandLogo className="h-7 w-auto" />
            <span className="font-display font-bold text-lg text-slate-900 tracking-tight">
              Rayida Tech
            </span>
          </Link>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-mist-2 text-xs">Admin Workspace</p>
            <span
              className={`text-[10px] uppercase font-mono-tight font-medium px-2 py-0.5 rounded-full border ${roleInfo.style}`}
            >
              {roleInfo.label}
            </span>
          </div>
        </div>

        {isMobile && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-mist-2 hover:text-paper hover:bg-white/5 transition-colors -mr-2 cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
        {visibleCategories.map((category) => (
          <div key={category.id} className="space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3.5 pt-1 pb-1 flex items-center justify-between select-none">
              <span>{category.title}</span>
              {category.shortLabel && (
                <span className="text-[9px] opacity-60 font-mono-tight tracking-normal">
                  {category.shortLabel}
                </span>
              )}
            </div>

            <div className="space-y-0.5">
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
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-secondary' : 'text-mist-2 group-hover:text-paper'
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

      <div className="p-4 border-t border-(--line) space-y-2">
        {role === 'super_admin' && (
          <Link
            href="/admin/users"
            onClick={handleLinkClick}
            className="flex items-center gap-2 text-xs text-secondary/80 hover:text-secondary transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Manage Access &amp; Roles</span>
          </Link>
        )}
        <Link
          href="/"
          onClick={handleLinkClick}
          className="flex items-center gap-2 text-xs text-mist-2 hover:text-paper transition-colors block"
        >
          ← Back to public site
        </Link>
      </div>
    </aside>
  );
}
