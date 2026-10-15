import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Mail, Settings, Inbox, ExternalLink } from 'lucide-react';
import DeleteContactButton from './DeleteContactButton';

export default async function AdminContacts() {
  const supabase = await createClient();
  const { data: contacts } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });

  const count = contacts?.length || 0;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-paper">Contact Inquiries</h1>
          <p className="text-xs text-mist-2 mt-0.5">
            {count} message{count === 1 ? '' : 's'} submitted through your public contact form.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-(--line) text-mist-1 hover:text-paper text-xs font-medium transition-colors"
          >
            <span>View Public Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/admin/contacts/settings"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-paper text-xs font-medium transition-all shadow-md shadow-primary/20"
          >
            <Settings className="w-4 h-4" />
            <span>Edit Contact Page Content</span>
          </Link>
        </div>
      </div>

      <div className="glass rounded-xl overflow-hidden border border-(--line)">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-(--line) bg-white/[0.02]">
              <th className="text-left text-mist-2 font-medium px-4 py-3">Name</th>
              <th className="text-left text-mist-2 font-medium px-4 py-3 hidden sm:table-cell">Email</th>
              <th className="text-left text-mist-2 font-medium px-4 py-3 hidden md:table-cell">Company</th>
              <th className="text-right text-mist-2 font-medium px-4 py-3">Date</th>
              <th className="text-right text-mist-2 font-medium px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {(!contacts || contacts.length === 0) && (
              <tr>
                <td colSpan={5} className="text-center text-mist-2 px-4 py-12">
                  No contacts yet.
                </td>
              </tr>
            )}
            {contacts?.map((contact) => (
              <tr
                key={contact.id}
                className="border-b border-(--line) last:border-0 hover:bg-white/[0.02] transition-colors group"
              >
                <td className="px-4 py-3 text-paper font-medium">{contact.name}</td>
                <td className="px-4 py-3 text-mist-1 hidden sm:table-cell">{contact.email}</td>
                <td className="px-4 py-3 text-mist-1 hidden md:table-cell">{contact.company || '—'}</td>
                <td className="px-4 py-3 text-right text-mist-2 text-xs">
                  {new Date(contact.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <DeleteContactButton id={contact.id} name={contact.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {contacts && contacts.length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-lg font-semibold text-paper mb-4">Detailed Inquiries</h2>
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div key={contact.id} className="glass rounded-xl p-5 border border-(--line)">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm text-mist-1">
                    <Mail className="w-4 h-4 text-secondary" />
                    <span className="font-medium text-paper">{contact.name}</span>
                    <span className="text-mist-2">({contact.email})</span>
                    {contact.company && (
                      <>
                        <span className="text-mist-2">·</span>
                        <span>{contact.company}</span>
                      </>
                    )}
                  </div>
                  <DeleteContactButton id={contact.id} name={contact.name} />
                </div>
                <p className="text-sm text-mist-1 leading-relaxed whitespace-pre-wrap">{contact.message}</p>
                <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-(--line) text-xs text-mist-2">
                  {contact.phone && (
                    <span>Phone: <strong className="text-paper">{contact.phone}</strong></span>
                  )}
                  {contact.project_type && (
                    <span>Service: <strong className="text-paper">{contact.project_type}</strong></span>
                  )}
                  <span>Received: {new Date(contact.created_at).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
