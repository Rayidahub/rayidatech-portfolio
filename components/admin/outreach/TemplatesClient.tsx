'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  SendHorizontal,
  X,
  Loader2,
  Copy,
  Check,
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { saveEmailTemplate, deleteEmailTemplate } from '@/app/actions/outreach-templates';
import type { EmailTemplate } from '@/types/outreach';

interface TemplatesClientProps {
  initialTemplates: EmailTemplate[];
}

export default function TemplatesClient({ initialTemplates }: TemplatesClientProps) {
  const router = useRouter();
  const [templates, setTemplates] = useState<EmailTemplate[]>(initialTemplates);
  const [editingTemplate, setEditingTemplate] = useState<Partial<EmailTemplate> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState('');

  const handleOpenNew = () => {
    setEditingTemplate({
      name: '',
      subject: '',
      body: '',
      description: '',
      category: 'outreach',
      variables: [
        'business_name',
        'contact_name',
        'business_type',
        'location',
        'website',
        'sender_name',
        'company_name',
      ],
    });
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: EmailTemplate) => {
    setEditingTemplate({ ...t });
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!editingTemplate?.name?.trim() || !editingTemplate?.subject?.trim() || !editingTemplate?.body?.trim()) {
      setErrorMessage('Name, subject, and body are required.');
      return;
    }

    startTransition(async () => {
      const res = await saveEmailTemplate(editingTemplate);
      if (res.success && res.template) {
        setIsModalOpen(false);
        setTemplates((prev) => {
          const idx = prev.findIndex((item) => item.id === res.template!.id);
          if (idx !== -1) {
            const copy = [...prev];
            copy[idx] = res.template!;
            return copy;
          }
          return [res.template!, ...prev];
        });
        router.refresh();
      } else {
        setErrorMessage(res.error || 'Failed to save template.');
      }
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete template "${name}"?`)) return;
    startTransition(async () => {
      const res = await deleteEmailTemplate(id);
      if (res.success) {
        setTemplates((prev) => prev.filter((t) => t.id !== id));
        router.refresh();
      }
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-lg font-semibold text-paper">
            Reusable Email Templates ({templates.length})
          </h2>
          <p className="text-xs text-mist-2">
            Craft high-converting cold proposals, follow-ups, and audit pitches.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNew}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-md shadow-primary/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Template</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {templates.map((tmpl) => (
          <GlassCard key={tmpl.id} className="p-6 border border-(--line) flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h3 className="font-display text-sm font-semibold text-paper">
                    {tmpl.name}
                  </h3>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(tmpl)}
                    className="p-1.5 text-mist-2 hover:text-secondary hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                    title="Edit template"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(tmpl.id, tmpl.name)}
                    className="p-1.5 text-mist-2 hover:text-rose-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                    title="Delete template"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {tmpl.description && (
                <p className="text-xs text-mist-2 mb-3 line-clamp-2">
                  {tmpl.description}
                </p>
              )}

              <div className="p-2.5 rounded-lg bg-white/[0.02] border border-(--line) text-xs mb-3">
                <span className="text-mist-2">Subject: </span>
                <span className="text-paper font-mono-tight">{tmpl.subject}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-ink-deep border border-(--line) font-sans text-xs text-mist-1 leading-relaxed line-clamp-5 whitespace-pre-line mb-4">
                {tmpl.body}
              </div>
            </div>

            <div className="pt-4 border-t border-(--line) flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {(tmpl.variables || []).slice(0, 3).map((v) => (
                  <span
                    key={v}
                    className="text-[10px] font-mono-tight px-2 py-0.5 rounded bg-white/5 text-mist-2"
                  >
                    {`{{${v}}}`}
                  </span>
                ))}
              </div>

              <Link
                href="/admin/outreach/campaigns/new"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary hover:underline"
              >
                <span>Use in Campaign</span>
                <SendHorizontal className="w-3.5 h-3.5" />
              </Link>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Template Edit / Add Modal */}
      {isModalOpen && editingTemplate && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[var(--ink-deep)] border border-(--line) rounded-2xl p-6 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-(--line) mb-4">
              <h3 className="font-display text-base font-semibold text-paper">
                {editingTemplate.id ? 'Edit Email Template' : 'Create Outreach Template'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-mist-2 hover:text-paper cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                {errorMessage}
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-mist-1 font-medium mb-1">
                  Template Name *
                </label>
                <input
                  type="text"
                  value={editingTemplate.name || ''}
                  onChange={(e) =>
                    setEditingTemplate((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="e.g. Abuja Luxury Decor Cold Pitch"
                  className="w-full bg-white/5 border border-(--line) rounded-xl px-3.5 py-2.5 text-xs text-paper focus:outline-none focus:border-primary/50"
                />
              </div>

              <div>
                <label className="block text-mist-1 font-medium mb-1">
                  Description / Use Case
                </label>
                <input
                  type="text"
                  value={editingTemplate.description || ''}
                  onChange={(e) =>
                    setEditingTemplate((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="Brief note on when this template performs best..."
                  className="w-full bg-white/5 border border-(--line) rounded-xl px-3.5 py-2.5 text-xs text-paper focus:outline-none focus:border-primary/50"
                />
              </div>

              <div>
                <label className="block text-mist-1 font-medium mb-1">
                  Subject Line * (Supports dynamic variables)
                </label>
                <input
                  type="text"
                  value={editingTemplate.subject || ''}
                  onChange={(e) =>
                    setEditingTemplate((p) => ({ ...p, subject: e.target.value }))
                  }
                  placeholder="A website idea for {{business_name}}"
                  className="w-full bg-white/5 border border-(--line) rounded-xl px-3.5 py-2.5 text-xs text-paper focus:outline-none focus:border-primary/50"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-mist-1 font-medium">
                    Email Body * (Personalized per recipient)
                  </label>
                  <span className="text-[10px] font-mono-tight text-mist-2">
                    Click a pill to insert variable:
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                  {[
                    { token: '{{business_name}}', label: 'Business' },
                    { token: '{{clean_business_name}}', label: 'Clean Name' },
                    { token: '{{business_type}}', label: 'Type' },
                    { token: '{{area}}', label: 'Area' },
                    { token: '{{location}}', label: 'Location' },
                    { token: '{{public_email}}', label: 'Email' },
                    { token: '{{phone}}', label: 'Phone' },
                    { token: '{{contact_name}}', label: 'Contact' },
                    { token: '{{sender_name}}', label: 'Sender' },
                    { token: '{{company_name}}', label: 'Company' },
                  ].map((item) => (
                    <button
                      key={item.token}
                      type="button"
                      onClick={() =>
                        setEditingTemplate((p) =>
                          p
                            ? {
                                ...p,
                                body: `${p.body ? p.body + ' ' : ''}${item.token}`,
                              }
                            : null
                        )
                      }
                      className="px-2 py-0.5 rounded-md bg-primary/10 hover:bg-primary/20 border border-primary/25 text-primary text-[10px] font-mono-tight transition-colors cursor-pointer"
                    >
                      {item.token}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={10}
                  value={editingTemplate.body || ''}
                  onChange={(e) =>
                    setEditingTemplate((p) => ({ ...p, body: e.target.value }))
                  }
                  className="w-full bg-white/5 border border-(--line) rounded-xl p-3.5 text-xs text-paper focus:outline-none focus:border-primary/50 font-sans leading-relaxed"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-(--line) mt-6">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-mist-2 hover:text-paper cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-md transition-all disabled:opacity-50 cursor-pointer"
              >
                {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Save Template</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

