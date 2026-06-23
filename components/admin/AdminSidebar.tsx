'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Briefcase,
  Package,
  FileText,
  Mail,
  Image,
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'Projects', icon: Briefcase },
  { href: '/admin/services', label: 'Services', icon: Package },
  { href: '/admin/blog', label: 'Blog', icon: FileText },
  { href: '/admin/hero', label: 'Hero Slides', icon: Image },
  { href: '/admin/contacts', label: 'Contacts', icon: Mail },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 min-h-screen bg-[var(--ink-deep)] border-r border-(--line) flex flex-col">
      <div className="p-6 border-b border-(--line)">
        <Link href="/admin" className="font-display text-lg font-semibold text-paper">
          Rayida<span className="text-secondary">Tech</span>
        </Link>
        <p className="text-mist-2 text-xs mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-200 ${
                isActive
                  ? 'bg-primary/20 text-secondary font-medium'
                  : 'text-mist-1 hover:text-paper hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-(--line)">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-mist-2 hover:text-paper transition-colors"
        >
          ← Back to site
        </Link>
      </div>
    </aside>
  )
}
