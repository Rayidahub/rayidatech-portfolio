import { createClient } from '@/lib/supabase/server';
import { Mail } from 'lucide-react';

export default async function AdminContacts() {
  const supabase = await createClient();
  const { data: contacts } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold text-paper">Contact Entries</h1>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-(--line)">
              <th className="text-left text-mist-2 font-medium px-4 py-3">Name</th>
              <th className="text-left text-mist-2 font-medium px-4 py-3 hidden sm:table-cell">Email</th>
              <th className="text-left text-mist-2 font-medium px-4 py-3 hidden md:table-cell">Company</th>
              <th className="text-right text-mist-2 font-medium px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {(!contacts || contacts.length === 0) && (
              <tr>
                <td colSpan={4} className="text-center text-mist-2 px-4 py-12">
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {contacts && contacts.length > 0 && (
        <div className="mt-6">
          <h2 className="font-display text-lg font-semibold text-paper mb-4">Messages</h2>
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div key={contact.id} className="glass rounded-xl p-5">
                <div className="flex items-center gap-2 text-sm text-mist-1 mb-2">
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
                <p className="text-sm text-mist-1 leading-relaxed">{contact.message}</p>
                {contact.phone && (
                  <p className="text-xs text-mist-2 mt-2">Phone: {contact.phone}</p>
                )}
                {contact.project_type && (
                  <p className="text-xs text-mist-2">Project Type: {contact.project_type}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
