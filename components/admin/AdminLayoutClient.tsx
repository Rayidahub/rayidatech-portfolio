'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import type { AdminRole, AdminPermission } from '@/types/admin-user';

interface AdminLayoutClientProps {
  children: React.ReactNode;
  role: AdminRole;
  permissions: AdminPermission[];
  email: string;
  name?: string;
}

export default function AdminLayoutClient({
  children,
  role,
  permissions,
  email,
  name,
}: AdminLayoutClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div
      data-theme="light"
      className="admin-light-theme flex min-h-screen bg-[#f4f5f9] text-slate-800 font-sans antialiased selection:bg-blue-100 selection:text-blue-900"
    >
      {/* Desktop Sidebar (hidden on mobile) */}
      <div className="hidden md:flex shrink-0">
        <AdminSidebar role={role} permissions={permissions} />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm md:hidden animate-fade-in flex"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-72 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col border-r border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <AdminSidebar
              role={role}
              permissions={permissions}
              isMobile
              onClose={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#f4f5f9]">
        <AdminHeader
          email={email}
          name={name}
          role={role}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
