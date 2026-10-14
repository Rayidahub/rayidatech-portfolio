import Link from 'next/link'
import { ShieldAlert, ArrowLeft } from 'lucide-react'

export default function SectionAccessDenied({
  sectionTitle,
  role = 'Editor',
}: {
  sectionTitle: string
  role?: string
}) {
  return (
    <div className="max-w-xl mx-auto py-16 text-center space-y-4">
      <div className="glass rounded-2xl p-8 border border-red-500/20 space-y-4">
        <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h1 className="font-display font-bold text-2xl text-paper">
          Access Restricted
        </h1>
        <p className="text-sm text-mist-1 leading-relaxed">
          Your account role (<span className="text-paper font-semibold capitalize">{role}</span>) does not have permission to access the <span className="text-paper font-semibold">{sectionTitle}</span> module.
        </p>
        <p className="text-xs text-mist-2">
          Contact a Super Admin if you need access to this section.
        </p>
        <div className="pt-2">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-primary hover:bg-primary/90 text-white transition-colors shadow-md shadow-primary/20"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
