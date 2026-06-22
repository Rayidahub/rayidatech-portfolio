import { createClient } from '@/lib/supabase/server'
import { Briefcase, Package, FileText, Mail } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: projectCount },
    { count: serviceCount },
    { count: postCount },
    { count: contactCount },
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('services').select('*', { count: 'exact', head: true }),
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase.from('contacts').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Projects', value: projectCount ?? 0, icon: Briefcase, href: '/admin/projects' },
    { label: 'Services', value: serviceCount ?? 0, icon: Package, href: '/admin/services' },
    { label: 'Blog Posts', value: postCount ?? 0, icon: FileText, href: '/admin/blog' },
    { label: 'Contact Entries', value: contactCount ?? 0, icon: Mail, href: '/admin/contacts' },
  ]

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-paper mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <a
              key={stat.label}
              href={stat.href}
              className="glass rounded-xl p-5 hover:border-primary/30 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-secondary" />
                </div>
              </div>
              <p className="text-2xl font-display font-semibold text-paper">{stat.value}</p>
              <p className="text-sm text-mist-1 mt-1">{stat.label}</p>
            </a>
          )
        })}
      </div>
    </div>
  )
}
