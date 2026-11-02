'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  Plus,
  Trash2,
  Edit2,
  Mail,
  ExternalLink,
  Phone,
  Check,
  X,
  Loader2,
  FileSpreadsheet,
  AlertCircle,
  Building,
} from 'lucide-react';
import type { OutreachContact, OutreachStatus } from '@/types/outreach';
import {
  saveOutreachContact,
  deleteOutreachContact,
} from '@/app/actions/outreach-contacts';

interface ContactsTableClientProps {
  initialContacts: OutreachContact[];
  total: number;
  locations: string[];
  businessTypes: string[];
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

const ALL_STATUSES: OutreachStatus[] = [
  'New',
  'Ready to Contact',
  'Campaign Queued',
  'Email Sent',
  'Replied',
  'Interested',
  'Follow-Up Required',
  'Not Interested',
  'Unsubscribed',
  'Bounced',
  'Invalid Email',
  'Missing Email',
];

export default function ContactsTableClient({
  initialContacts,
  total,
  locations,
  businessTypes,
}: ContactsTableClientProps) {
  const router = useRouter();
  const [contacts, setContacts] = useState<OutreachContact[]>(initialContacts);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingContact, setEditingContact] = useState<Partial<OutreachContact> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState('');

  // Filter contacts locally for fast response
  const filteredContacts = contacts.filter((c) => {
    if (statusFilter !== 'All' && c.outreach_status !== statusFilter) return false;
    if (typeFilter !== 'All' && c.business_type !== typeFilter) return false;
    if (locationFilter !== 'All' && c.location !== locationFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        c.business_name?.toLowerCase().includes(q) ||
        c.contact_name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.location?.toLowerCase().includes(q) ||
        c.notes?.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredContacts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredContacts.map((c) => c.id)));
    }
  };

  const toggleSelectOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleOpenAddModal = () => {
    setEditingContact({
      business_name: '',
      contact_name: '',
      email: '',
      business_type: '',
      location: 'Abuja',
      website: '',
      instagram: '',
      phone: '',
      notes: '',
      outreach_status: 'Ready to Contact',
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (contact: OutreachContact) => {
    setEditingContact({ ...contact });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleSaveContact = () => {
    if (!editingContact?.business_name?.trim()) {
      setErrorMsg('Business name is required.');
      return;
    }

    startTransition(async () => {
      const res = await saveOutreachContact(editingContact);
      if (res.success && res.contact) {
        setIsModalOpen(false);
        setContacts((prev) => {
          const idx = prev.findIndex((c) => c.id === res.contact!.id);
          if (idx !== -1) {
            const copy = [...prev];
            copy[idx] = res.contact!;
            return copy;
          }
          return [res.contact!, ...prev];
        });
        router.refresh();
      } else {
        setErrorMsg(res.error || 'Failed to save prospect.');
      }
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    startTransition(async () => {
      const res = await deleteOutreachContact(id);
      if (res.success) {
        setContacts((prev) => prev.filter((c) => c.id !== id));
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        router.refresh();
      }
    });
  };

  const getStatusBadge = (status: OutreachStatus) => {
    switch (status) {
      case 'Ready to Contact':
      case 'New':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20';
      case 'Email Sent':
        return 'bg-secondary/15 text-secondary border-secondary/20';
      case 'Campaign Queued':
        return 'bg-primary/15 text-primary border-primary/20';
      case 'Replied':
      case 'Interested':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/20 font-semibold';
      case 'Follow-Up Required':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/20';
      case 'Missing Email':
      case 'Invalid Email':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/20';
      case 'Unsubscribed':
      case 'Bounced':
      case 'Not Interested':
        return 'bg-white/5 text-mist-2 border-white/10';
      default:
        return 'bg-white/5 text-mist-1 border-white/10';
    }
  };

  return (
    <div>
      {/* Controls & Search Bar */}
      <div className="glass rounded-xl p-4 sm:p-5 border border-(--line) mb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-mist-2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search business name, contact, email, notes..."
              className="w-full bg-white/5 border border-(--line) rounded-xl pl-10 pr-4 py-2.5 text-xs text-paper placeholder:text-mist-2 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-md shadow-primary/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Prospect</span>
            </button>

            <Link
              href="/admin/outreach/import"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-(--line) bg-white/5 hover:bg-white/10 text-xs font-medium text-paper transition-all"
            >
              <FileSpreadsheet className="w-4 h-4 text-secondary" />
              <span>Import (.xlsx)</span>
            </Link>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-(--line)">
          <div>
            <label className="block text-[11px] font-mono-tight text-mist-2 uppercase mb-1">
              Outreach Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-1.5 text-xs text-paper focus:outline-none focus:border-primary/50"
            >
              <option value="All" className="bg-ink text-paper">All Statuses</option>
              {ALL_STATUSES.map((st) => (
                <option key={st} value={st} className="bg-ink text-paper">
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono-tight text-mist-2 uppercase mb-1">
              Business Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-1.5 text-xs text-paper focus:outline-none focus:border-primary/50"
            >
              <option value="All" className="bg-ink text-paper">All Business Types</option>
              {businessTypes.map((t) => (
                <option key={t} value={t} className="bg-ink text-paper">
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono-tight text-mist-2 uppercase mb-1">
              Area / Location
            </label>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-1.5 text-xs text-paper focus:outline-none focus:border-primary/50"
            >
              <option value="All" className="bg-ink text-paper">All Areas</option>
              {locations.map((loc) => (
                <option key={loc} value={loc} className="bg-ink text-paper">
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Selected Action Bar */}
      {selectedIds.size > 0 && (
        <div className="mb-4 p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between animate-fade-in">
          <div className="text-xs text-paper font-medium">
            <span>{selectedIds.size} prospect{selectedIds.size === 1 ? '' : 's'} selected</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/outreach/campaigns/new?contacts=${Array.from(selectedIds).join(',')}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Launch Campaign for Selected</span>
            </Link>
            <button
              type="button"
              onClick={() => setSelectedIds(new Set())}
              className="px-2.5 py-1.5 rounded-lg text-xs text-mist-2 hover:text-paper hover:bg-white/5 transition-colors cursor-pointer"
            >
              Deselect
            </button>
          </div>
        </div>
      )}

      {/* Contacts Table */}
      <div className="glass rounded-xl overflow-hidden border border-(--line)">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-(--line) bg-white/[0.02]">
                <th className="px-4 py-3 text-left w-10">
                  <input
                    type="checkbox"
                    checked={
                      filteredContacts.length > 0 &&
                      selectedIds.size === filteredContacts.length
                    }
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded accent-primary cursor-pointer"
                  />
                </th>
                <th className="text-left text-mist-2 font-medium px-4 py-3">Business Name</th>
                <th className="text-left text-mist-2 font-medium px-4 py-3">Business Type</th>
                <th className="text-left text-mist-2 font-medium px-4 py-3">Area / Location</th>
                <th className="text-left text-mist-2 font-medium px-4 py-3">Public Email Address</th>
                <th className="text-left text-mist-2 font-medium px-4 py-3">Phone</th>
                <th className="text-center text-mist-2 font-medium px-4 py-3">Status</th>
                <th className="text-right text-mist-2 font-medium px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-mist-2 px-4 py-12">
                    <p className="mb-2">No prospects matching your filters.</p>
                    <button
                      type="button"
                      onClick={handleOpenAddModal}
                      className="text-xs text-secondary hover:underline cursor-pointer"
                    >
                      + Add a prospect manually
                    </button>
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className="border-b border-(--line) last:border-0 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(contact.id)}
                        onChange={() => toggleSelectOne(contact.id)}
                        className="w-4 h-4 rounded accent-primary cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-paper">{contact.business_name}</div>
                      {contact.contact_name && (
                        <div className="text-[11px] text-mist-2">Contact: {contact.contact_name}</div>
                      )}
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-mist-2">
                        {contact.website && (
                          <a
                            href={contact.website.startsWith('http') ? contact.website : `https://${contact.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-secondary inline-flex items-center gap-0.5"
                          >
                            <span>web</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                        {contact.instagram && (
                          <span className="inline-flex items-center gap-0.5 text-mist-2">
                            <InstagramIcon className="w-2.5 h-2.5 text-pink-400" />
                            <span>{contact.instagram}</span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-mist-1">
                      {contact.business_type || '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-mist-1">
                      {contact.location || '—'}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {contact.email ? (
                        <span className="font-mono-tight text-paper">{contact.email}</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-400 text-[11px] font-mono-tight">
                          <AlertCircle className="w-3 h-3" />
                          <span>Missing Email</span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs font-mono-tight text-mist-1">
                      {contact.phone || '—'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-mono-tight border ${getStatusBadge(
                          contact.outreach_status
                        )}`}
                      >
                        {contact.outreach_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(contact)}
                          className="p-1.5 rounded-lg text-mist-2 hover:text-secondary hover:bg-white/5 transition-colors cursor-pointer"
                          title="Edit prospect"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(contact.id, contact.business_name)}
                          className="p-1.5 rounded-lg text-mist-2 hover:text-rose-400 hover:bg-white/5 transition-colors cursor-pointer"
                          title="Delete prospect"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Prospect Add/Edit Modal */}
      {isModalOpen && editingContact && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[var(--ink-deep)] border border-(--line) rounded-2xl p-6 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-(--line) mb-4">
              <h3 className="font-display text-lg font-semibold text-paper">
                {editingContact.id ? 'Edit Prospect' : 'Add New Business Prospect'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-mist-2 hover:text-paper hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-paper mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={editingContact.business_name || ''}
                  onChange={(e) =>
                    setEditingContact((p) => ({ ...p, business_name: e.target.value }))
                  }
                  placeholder="e.g. Pebbles Rentals & Events"
                  className="w-full bg-white/5 border border-(--line) rounded-xl px-3.5 py-2.5 text-xs text-paper focus:outline-none focus:border-primary/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-paper mb-1">
                  Contact Person (Optional)
                </label>
                <input
                  type="text"
                  value={editingContact.contact_name || ''}
                  onChange={(e) =>
                    setEditingContact((p) => ({ ...p, contact_name: e.target.value }))
                  }
                  placeholder="e.g. Amina Bello"
                  className="w-full bg-white/5 border border-(--line) rounded-xl px-3.5 py-2.5 text-xs text-paper focus:outline-none focus:border-primary/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-paper mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editingContact.email || ''}
                  onChange={(e) =>
                    setEditingContact((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="e.g. hello@pebblesevents.com"
                  className="w-full bg-white/5 border border-(--line) rounded-xl px-3.5 py-2.5 text-xs text-paper focus:outline-none focus:border-primary/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-paper mb-1">
                  Business Type / Industry
                </label>
                <input
                  type="text"
                  value={editingContact.business_type || ''}
                  onChange={(e) =>
                    setEditingContact((p) => ({ ...p, business_type: e.target.value }))
                  }
                  placeholder="e.g. Event Rentals & Decor"
                  className="w-full bg-white/5 border border-(--line) rounded-xl px-3.5 py-2.5 text-xs text-paper focus:outline-none focus:border-primary/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-paper mb-1">
                  Location (City / Area)
                </label>
                <input
                  type="text"
                  value={editingContact.location || ''}
                  onChange={(e) =>
                    setEditingContact((p) => ({ ...p, location: e.target.value }))
                  }
                  placeholder="e.g. Wuse 2, Abuja"
                  className="w-full bg-white/5 border border-(--line) rounded-xl px-3.5 py-2.5 text-xs text-paper focus:outline-none focus:border-primary/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-paper mb-1">
                  Website URL
                </label>
                <input
                  type="text"
                  value={editingContact.website || ''}
                  onChange={(e) =>
                    setEditingContact((p) => ({ ...p, website: e.target.value }))
                  }
                  placeholder="e.g. https://pebbles.ng"
                  className="w-full bg-white/5 border border-(--line) rounded-xl px-3.5 py-2.5 text-xs text-paper focus:outline-none focus:border-primary/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-paper mb-1">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  value={editingContact.instagram || ''}
                  onChange={(e) =>
                    setEditingContact((p) => ({ ...p, instagram: e.target.value }))
                  }
                  placeholder="e.g. @pebblesevents"
                  className="w-full bg-white/5 border border-(--line) rounded-xl px-3.5 py-2.5 text-xs text-paper focus:outline-none focus:border-primary/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-paper mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={editingContact.phone || ''}
                  onChange={(e) =>
                    setEditingContact((p) => ({ ...p, phone: e.target.value }))
                  }
                  placeholder="e.g. +234 801 234 5678"
                  className="w-full bg-white/5 border border-(--line) rounded-xl px-3.5 py-2.5 text-xs text-paper focus:outline-none focus:border-primary/50"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-paper mb-1">
                  Outreach Status
                </label>
                <select
                  value={editingContact.outreach_status || 'Ready to Contact'}
                  onChange={(e) =>
                    setEditingContact((p) => ({
                      ...p,
                      outreach_status: e.target.value as OutreachStatus,
                    }))
                  }
                  className="w-full bg-white/5 border border-(--line) rounded-xl px-3.5 py-2.5 text-xs text-paper focus:outline-none focus:border-primary/50"
                >
                  {ALL_STATUSES.map((st) => (
                    <option key={st} value={st} className="bg-ink text-paper">
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-paper mb-1">
                  Notes &amp; Research
                </label>
                <textarea
                  rows={2}
                  value={editingContact.notes || ''}
                  onChange={(e) =>
                    setEditingContact((p) => ({ ...p, notes: e.target.value }))
                  }
                  placeholder="Key observations, company background, referral notes..."
                  className="w-full bg-white/5 border border-(--line) rounded-xl px-3.5 py-2.5 text-xs text-paper focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-(--line) mt-6">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-mist-2 hover:text-paper hover:bg-white/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={handleSaveContact}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-md shadow-primary/25 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Save Prospect</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

