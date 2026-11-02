'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Edit,
  Mail,
  Send,
  Users,
  Search,
  ExternalLink,
  Check,
  AlertCircle,
  Loader2,
  Share2,
  Sparkles,
} from 'lucide-react';
import DeleteButton from '@/app/admin/(dashboard)/team/DeleteButton';
import TeamEmailModal from '@/components/admin/team/TeamEmailModal';
import {
  updateTeamMemberEmailAction,
  exportTeamToOutreachContacts,
} from '@/app/actions/team-email';
import type { TeamMember } from '@/types/team-member';

interface TeamManagementClientProps {
  initialMembers: TeamMember[];
}

export default function TeamManagementClient({
  initialMembers,
}: TeamManagementClientProps) {
  const router = useRouter();
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Email modal state
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [modalTargetMembers, setModalTargetMembers] = useState<
    Array<{ id: string; name: string; role?: string; email?: string | null }>
  >([]);

  // Inline email editor state
  const [editingEmailId, setEditingEmailId] = useState<string | null>(null);
  const [tempEmailValue, setTempEmailValue] = useState('');
  const [isUpdatingEmail, startEmailTransition] = useTransition();

  // Campaign export state
  const [isExporting, startExportTransition] = useTransition();
  const [exportError, setExportError] = useState('');

  // Extract email from member.email or member.social_links?.email
  const getMemberEmail = (m: TeamMember): string => {
    return (m.email || m.social_links?.email || '').trim();
  };

  // Filtered members
  const filteredMembers = members.filter((m) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const email = getMemberEmail(m).toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q) ||
      email.includes(q)
    );
  });

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredMembers.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredMembers.map((m) => m.id)));
    }
  };

  const toggleSelectOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  // Open modal for a single team member
  const handleOpenSingleEmail = (member: TeamMember) => {
    setModalTargetMembers([
      {
        id: member.id,
        name: member.name,
        role: member.role,
        email: getMemberEmail(member),
      },
    ]);
    setIsEmailModalOpen(true);
  };

  // Open modal for all selected members
  const handleOpenBulkEmail = () => {
    const targets = members
      .filter((m) => selectedIds.has(m.id))
      .map((m) => ({
        id: m.id,
        name: m.name,
        role: m.role,
        email: getMemberEmail(m),
      }));

    if (targets.length === 0) return;
    setModalTargetMembers(targets);
    setIsEmailModalOpen(true);
  };

  // Save inline email
  const handleSaveInlineEmail = (memberId: string) => {
    if (!tempEmailValue.trim()) {
      setEditingEmailId(null);
      return;
    }

    startEmailTransition(async () => {
      const res = await updateTeamMemberEmailAction(memberId, tempEmailValue.trim());
      if (res.success) {
        setMembers((prev) =>
          prev.map((m) =>
            m.id === memberId
              ? {
                  ...m,
                  email: tempEmailValue.trim(),
                  social_links: { ...m.social_links, email: tempEmailValue.trim() },
                }
              : m
          )
        );
        setEditingEmailId(null);
        router.refresh();
      } else {
        alert(res.error || 'Failed to update email.');
      }
    });
  };

  // Launch full bulk campaign in Outreach module
  const handleLaunchOutreachCampaign = () => {
    setExportError('');
    const targetIds = Array.from(selectedIds);
    if (targetIds.length === 0) return;

    startExportTransition(async () => {
      const res = await exportTeamToOutreachContacts(targetIds);
      if (res.success && res.contactIds.length > 0) {
        router.push(
          `/admin/outreach/campaigns/new?contacts=${res.contactIds.join(',')}`
        );
      } else {
        setExportError(
          res.error ||
            'Could not export team members. Ensure they have valid email addresses.'
        );
      }
    });
  };

  return (
    <div>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-paper">Team Management</h1>
          <p className="text-xs text-mist-2 mt-0.5">
            Manage your team members and send directed or bulk email communications.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/team/new"
            className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg px-4 py-2 text-xs font-semibold shadow-md shadow-primary/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Member</span>
          </Link>
        </div>
      </div>

      {exportError && (
        <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-300 flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{exportError}</span>
        </div>
      )}

      {/* Search and Quick Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-mist-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, role, or email..."
            className="w-full bg-white/5 border border-(--line) rounded-xl pl-10 pr-4 py-2 text-xs text-paper focus:outline-none focus:border-primary/50"
          />
        </div>

        <div className="text-xs text-mist-2 font-mono-tight">
          Total: {members.length} member{members.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Multi-Selection Action Banner */}
      {selectedIds.size > 0 && (
        <div className="mb-4 p-3.5 rounded-xl bg-primary/10 border border-primary/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in shadow-lg">
          <div className="flex items-center gap-2 text-xs text-paper font-medium">
            <Users className="w-4 h-4 text-primary" />
            <span>
              <strong>{selectedIds.size}</strong> team member{selectedIds.size === 1 ? '' : 's'} selected
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleOpenBulkEmail}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Send Message to Selected</span>
            </button>

            <button
              type="button"
              disabled={isExporting}
              onClick={handleLaunchOutreachCampaign}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-secondary/30 bg-secondary/10 hover:bg-secondary/20 text-secondary text-xs font-medium transition-all cursor-pointer disabled:opacity-50"
              title="Bridge selected team members into a full bulk outreach campaign"
            >
              {isExporting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>Launch in Outreach Campaign</span>
            </button>

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

      {/* Team Members Table */}
      <div className="glass rounded-xl overflow-hidden border border-(--line)">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-(--line) bg-white/[0.02]">
                <th className="px-4 py-3 text-left w-10">
                  <input
                    type="checkbox"
                    checked={
                      filteredMembers.length > 0 &&
                      selectedIds.size === filteredMembers.length
                    }
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded accent-primary cursor-pointer"
                  />
                </th>
                <th className="text-left text-mist-2 font-medium px-4 py-3">Member</th>
                <th className="text-left text-mist-2 font-medium px-4 py-3">Role</th>
                <th className="text-left text-mist-2 font-medium px-4 py-3">Email Address</th>
                <th className="text-center text-mist-2 font-medium px-4 py-3 hidden md:table-cell">Order</th>
                <th className="text-center text-mist-2 font-medium px-4 py-3 hidden md:table-cell">Active</th>
                <th className="text-right text-mist-2 font-medium px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-mist-2 px-4 py-12">
                    <p className="mb-2">No team members match your criteria.</p>
                    <Link
                      href="/admin/team/new"
                      className="text-xs text-secondary hover:underline cursor-pointer"
                    >
                      + Add a new team member
                    </Link>
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => {
                  const email = getMemberEmail(member);
                  const isSelected = selectedIds.has(member.id);
                  const isEditingThisEmail = editingEmailId === member.id;

                  return (
                    <tr
                      key={member.id}
                      className={`border-b border-(--line) last:border-0 hover:bg-white/[0.02] transition-colors ${
                        isSelected ? 'bg-primary/5' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(member.id)}
                          className="w-4 h-4 rounded accent-primary cursor-pointer"
                        />
                      </td>

                      {/* Member Info */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {member.photo_url ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={member.photo_url}
                              alt={member.name}
                              className="w-9 h-9 rounded-full object-cover border border-(--line) shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center font-display font-semibold text-xs shrink-0">
                              {member.name
                                .split(' ')
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join('')
                                .toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-paper">{member.name}</div>
                            {member.social_links?.linkedin && (
                              <a
                                href={member.social_links.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11px] text-mist-2 hover:text-secondary inline-flex items-center gap-0.5 mt-0.5"
                              >
                                <span>LinkedIn</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-4 py-3 text-xs text-mist-1">
                        {member.role || '—'}
                      </td>

                      {/* Email with Inline Editor */}
                      <td className="px-4 py-3 text-xs">
                        {isEditingThisEmail ? (
                          <div className="flex items-center gap-1.5 animate-fade-in">
                            <input
                              type="email"
                              value={tempEmailValue}
                              onChange={(e) => setTempEmailValue(e.target.value)}
                              placeholder="name@rayidatech.name.ng"
                              className="bg-white/5 border border-primary/50 rounded px-2 py-1 text-xs text-paper focus:outline-none font-mono-tight"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveInlineEmail(member.id);
                                if (e.key === 'Escape') setEditingEmailId(null);
                              }}
                            />
                            <button
                              type="button"
                              disabled={isUpdatingEmail}
                              onClick={() => handleSaveInlineEmail(member.id)}
                              className="p-1 rounded bg-primary/20 text-primary hover:bg-primary/30 cursor-pointer"
                              title="Save email"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingEmailId(null)}
                              className="p-1 rounded text-mist-2 hover:text-paper cursor-pointer"
                              title="Cancel"
                            >
                              <AlertCircle className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : email ? (
                          <div className="flex items-center gap-2">
                            <span className="font-mono-tight text-paper">{email}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingEmailId(member.id);
                                setTempEmailValue(email);
                              }}
                              className="text-[10px] text-mist-2 hover:text-secondary underline cursor-pointer"
                              title="Edit email"
                            >
                              edit
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingEmailId(member.id);
                              setTempEmailValue('');
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-mono-tight text-secondary hover:underline cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Email</span>
                          </button>
                        )}
                      </td>

                      {/* Sort Order */}
                      <td className="px-4 py-3 text-center text-xs text-mist-2 hidden md:table-cell font-mono-tight">
                        {member.sort_order}
                      </td>

                      {/* Active Status */}
                      <td className="px-4 py-3 text-center hidden md:table-cell">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                            member.is_active
                              ? 'bg-secondary/20 text-secondary'
                              : 'bg-white/5 text-mist-2'
                          }`}
                        >
                          {member.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          {/* Send Email Action Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenSingleEmail(member)}
                            className="p-1.5 rounded-lg text-mist-2 hover:text-secondary hover:bg-white/5 transition-colors cursor-pointer"
                            title={`Send direct message to ${member.name}`}
                          >
                            <Mail className="w-4 h-4" />
                          </button>

                          {/* Edit Member */}
                          <Link
                            href={`/admin/team/${member.id}/edit`}
                            className="p-1.5 rounded-lg text-mist-2 hover:text-paper hover:bg-white/5 transition-colors"
                            title="Edit team member details"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          {/* Delete Member */}
                          <DeleteButton id={member.id} name={member.name} />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Direct Email Modal */}
      {isEmailModalOpen && (
        <TeamEmailModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          members={modalTargetMembers}
        />
      )}
    </div>
  );
}

