'use client';

import { createClient } from '@/lib/supabase/browser';
import { useRouter } from 'next/navigation';
import { LogOut, Search, Bell, Menu } from 'lucide-react';
import type { AdminRole } from '@/types/admin-user';

interface AdminHeaderProps {
  email: string;
  name?: string;
  role?: AdminRole;
  onOpenMobileMenu?: () => void;
}

export default function AdminHeader({
  email,
  name,
  role = 'super_admin',
  onOpenMobileMenu,
}: AdminHeaderProps) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  // Format date in DealDeck style: "Friday, December 15th 2023"
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const displayName = name || email.split('@')[0];

  return (
    <header className="h-20 bg-[#f4f5f9] border-b border-slate-200/60 flex items-center justify-between px-4 sm:px-8 gap-4 sticky top-0 z-30 select-none">
      {/* Left: DealDeck Page Title & Live Calendar Date */}
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-xl bg-white border border-slate-200/80 text-slate-600 hover:text-slate-900 shadow-xs transition-colors"
            aria-label="Open navigation drawer"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900 tracking-tight leading-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-slate-400 font-normal mt-1 flex items-center gap-1.5">
            <span>{todayFormatted}</span>
          </p>
        </div>
      </div>

      {/* Right: DealDeck Action Controls (Search, Bell, User Profile) */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Search Circular Button */}
        <button
          type="button"
          className="w-10 h-10 rounded-full bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all cursor-pointer active:scale-95"
          title="Search in workspace"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Notifications Circular Button with Active Dot */}
        <button
          type="button"
          className="w-10 h-10 rounded-full bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 relative transition-all cursor-pointer active:scale-95"
          title="Notifications & System Alerts"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        {/* User Profile Pill */}
        <div className="flex items-center gap-3 pl-2 sm:border-l sm:border-slate-200/80">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#3b5bfa] to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-xs uppercase ring-2 ring-white select-none">
            {displayName.slice(0, 2)}
          </div>
          <div className="hidden sm:block text-left">
            <span className="text-xs font-bold text-slate-900 block leading-tight truncate max-w-[140px]">
              {displayName}
            </span>
            <span className="text-[11px] font-medium text-slate-400 block leading-tight">
              {role === 'super_admin' ? 'Super Admin' : role === 'admin' ? 'Admin store' : 'Editor'}
            </span>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleLogout}
          className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white hover:bg-rose-50 border border-slate-200/80 hover:border-rose-200 text-slate-500 hover:text-rose-600 transition-all text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-xs"
          title="Sign out of admin session"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
