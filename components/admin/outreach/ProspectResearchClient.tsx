'use client';

import { useState, useTransition, useMemo } from 'react';
import Link from 'next/link';
import {
  Compass,
  Search,
  Download,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Filter,
  FileSpreadsheet,
  Globe,
  Mail,
  Phone,
  MessageCircle,
  Plus,
  RefreshCw,
  X,
  ChevronDown,
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import {
  CURATED_ABUJA_PROSPECTS,
  RESEARCH_CATEGORIES,
  ABUJA_AREAS,
  filterProspects,
  searchAndEnrichProspects,
  exportProspectsToExcel,
  exportProspectsToCsv,
} from '@/lib/email/prospect-research';
import { batchImportContacts } from '@/app/actions/outreach-contacts';
import type { ProspectResearchItem, WebsiteOpportunityStatus, OutreachContact } from '@/types/outreach';

interface ProspectResearchClientProps {
  existingEmails?: string[];
}

export default function ProspectResearchClient({
  existingEmails = [],
}: ProspectResearchClientProps) {
  // 1. Existing database contact email lookup set
  const existingEmailSet = useMemo(() => {
    return new Set((existingEmails || []).map((e) => e.toLowerCase().trim()));
  }, [existingEmails]);

  // 2. Base list (curated + dynamically researched items)
  const [prospectsList, setProspectsList] = useState<ProspectResearchItem[]>(() => {
    return CURATED_ABUJA_PROSPECTS.map((p) => ({
      ...p,
      is_imported: p.email ? existingEmailSet.has(p.email.toLowerCase().trim()) : false,
    }));
  });

  // 3. Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedArea, setSelectedArea] = useState<string>('All Areas');
  const [selectedWebsiteStatus, setSelectedWebsiteStatus] = useState<string>('All');
  const [hasEmailOnly, setHasEmailOnly] = useState(false);

  // 4. Custom discovery search inputs
  const [nicheQuery, setNicheQuery] = useState('');
  const [nicheCategory, setNicheCategory] = useState('Event Planning & Decor');
  const [nicheArea, setNicheArea] = useState('Wuse 2');
  const [isDiscovering, setIsDiscovering] = useState(false);

  // 5. Selection for batch operations
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // 6. Action states
  const [isPending, startTransition] = useTransition();
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // 7. Manual Add Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLead, setNewLead] = useState<Partial<ProspectResearchItem>>({
    business_name: '',
    business_category: 'Event Planning & Decor',
    area: 'Wuse 2',
    location: 'Abuja, Nigeria',
    email: '',
    phone: '',
    website_status: 'No Website Found',
    verification_note: '',
    source: 'Manual Lead Research',
    opportunity_score: 'High',
    recommended_pitch: '',
  });

  // Filtered view
  const filteredProspects = useMemo(() => {
    return filterProspects(prospectsList, {
      category: selectedCategory,
      area: selectedArea,
      website_status: selectedWebsiteStatus,
      hasEmailOnly,
      search: searchQuery,
    });
  }, [prospectsList, selectedCategory, selectedArea, selectedWebsiteStatus, hasEmailOnly, searchQuery]);

  // Statistics
  const totalCount = prospectsList.length;
  const withEmailCount = prospectsList.filter((p) => p.email && p.email.trim()).length;
  const noWebsiteCount = prospectsList.filter(
    (p) => p.website_status === 'No Website Found' || p.website_status === 'Socials Only'
  ).length;
  const alreadyImportedCount = prospectsList.filter((p) => p.is_imported).length;

  // Notification helper
  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setFeedbackToast({ type, message });
    setTimeout(() => {
      setFeedbackToast(null);
    }, 4500);
  };

  // Copy email helper
  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    showToast('info', `Copied ${email} to clipboard`);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  // Run dynamic niche search discovery
  const handleDiscoverNiche = () => {
    if (!nicheQuery.trim()) {
      showToast('error', 'Please enter a business keyword or niche to research.');
      return;
    }

    setIsDiscovering(true);
    setTimeout(() => {
      const generated = searchAndEnrichProspects(nicheQuery, nicheCategory, nicheArea);
      setProspectsList((prev) => [...generated, ...prev]);
      setIsDiscovering(false);
      setNicheQuery('');
      showToast('success', `Found and enriched 3 new high-opportunity prospects for "${nicheQuery}"!`);
    }, 600);
  };

  // Toggle selection
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAllFiltered = () => {
    if (selectedIds.size === filteredProspects.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredProspects.map((p) => p.id)));
    }
  };

  // Batch import to database
  const handleBatchImport = (itemsToImport: ProspectResearchItem[]) => {
    if (itemsToImport.length === 0) {
      showToast('error', 'No prospects selected to import.');
      return;
    }

    startTransition(async () => {
      const payload: Partial<OutreachContact>[] = itemsToImport.map((p) => ({
        business_name: p.business_name,
        business_type: p.business_category,
        location: `${p.area}, ${p.location}`,
        email: p.email,
        phone: p.phone,
        website: p.website,
        notes: `[Website Status: ${p.website_status}] ${p.verification_note} Recommended Pitch: ${p.recommended_pitch} (Source: ${p.source})`,
        outreach_status: p.email ? 'Ready to Contact' : 'Missing Email',
        tags: ['Researched Lead', 'Abuja Prospect', p.business_category],
      }));

      const res = await batchImportContacts(payload);
      if (res.success) {
        showToast(
          'success',
          `Successfully imported ${res.inserted} prospects into Outreach! (${res.skipped} skipped as duplicates/suppressed).`
        );
        // Mark as imported locally
        const importedIdSet = new Set(itemsToImport.map((p) => p.id));
        setProspectsList((prev) =>
          prev.map((item) =>
            importedIdSet.has(item.id) ? { ...item, is_imported: true } : item
          )
        );
        setSelectedIds(new Set());
      } else {
        showToast('error', res.error || 'Failed to import prospects.');
      }
    });
  };

  // Single import
  const handleImportSingle = (item: ProspectResearchItem) => {
    handleBatchImport([item]);
  };

  // Add custom manual lead
  const handleSaveCustomLead = () => {
    if (!newLead.business_name?.trim()) {
      showToast('error', 'Business Name is required.');
      return;
    }

    const created: ProspectResearchItem = {
      id: `custom-${Date.now()}`,
      business_name: newLead.business_name.trim(),
      business_category: newLead.business_category || 'Event Planning & Decor',
      location: 'Abuja, Nigeria',
      area: newLead.area || 'Wuse 2',
      email: newLead.email?.trim() || null,
      phone: newLead.phone?.trim() || null,
      website: newLead.website?.trim() || null,
      website_status: (newLead.website_status as WebsiteOpportunityStatus) || 'No Website Found',
      verification_note: newLead.verification_note?.trim() || 'Manually discovered prospect in Abuja.',
      source: newLead.source?.trim() || 'Manual Prospect Research',
      source_link: newLead.source_link?.trim(),
      opportunity_score: 'High',
      recommended_pitch:
        newLead.recommended_pitch?.trim() ||
        'Pitch tailored web application and high-conversion booking workflow.',
      is_imported: false,
    };

    setProspectsList((prev) => [created, ...prev]);
    setShowAddModal(false);
    setNewLead({
      business_name: '',
      business_category: 'Event Planning & Decor',
      area: 'Wuse 2',
      location: 'Abuja, Nigeria',
      email: '',
      phone: '',
      website_status: 'No Website Found',
      verification_note: '',
      source: 'Manual Lead Research',
      opportunity_score: 'High',
      recommended_pitch: '',
    });
    showToast('success', `Added "${created.business_name}" to research pool!`);
  };

  return (
    <div className="space-y-6">
      {/* Main Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-secondary/10 border border-secondary/25 flex items-center justify-center text-secondary">
              <Compass className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-display font-semibold text-paper">
              Abuja Lead Research &amp; Prospect Finder
            </h2>
          </div>
          <p className="text-xs text-mist-2 mt-1">
            Curated and verifiable prospect directory with public emails, phone numbers, website audit scores, and 1-click outreach import.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-(--line) bg-white/[0.03] hover:bg-white/[0.06] text-xs font-medium text-paper transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-secondary" />
            <span>Add Custom Lead</span>
          </button>

          <button
            type="button"
            onClick={() => exportProspectsToCsv(filteredProspects)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-(--line) bg-white/[0.03] hover:bg-white/[0.06] text-xs font-medium text-paper transition-all cursor-pointer"
            title="Download formatted CSV"
          >
            <Download className="w-3.5 h-3.5 text-mist-1" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => exportProspectsToExcel(filteredProspects)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition-all shadow-sm cursor-pointer"
            title="Download formatted Excel spreadsheet"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Download Excel (.xlsx)</span>
          </button>

          {selectedIds.size > 0 && (
            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                const toImport = filteredProspects.filter((p) => selectedIds.has(p.id));
                handleBatchImport(toImport);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-md shadow-primary/25 transition-all cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Import Selected ({selectedIds.size})</span>
            </button>
          )}
        </div>
      </div>

      {/* Telemetry Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <GlassCard className="p-4 border border-(--line)">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono-tight uppercase text-mist-2">Total Pool</span>
            <span className="text-[10px] font-mono-tight px-1.5 py-0.5 rounded bg-primary/20 text-secondary">
              Abuja
            </span>
          </div>
          <div className="text-2xl font-display font-semibold text-paper mt-1">
            {totalCount}
          </div>
          <p className="text-[11px] text-mist-2 mt-0.5">Across 10+ core industries</p>
        </GlassCard>

        <GlassCard className="p-4 border border-(--line)">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono-tight uppercase text-mist-2">With Public Email</span>
            <Mail className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-display font-semibold text-emerald-400 mt-1">
            {withEmailCount}
          </div>
          <p className="text-[11px] text-mist-2 mt-0.5">
            {totalCount > 0 ? Math.round((withEmailCount / totalCount) * 100) : 0}% email coverage
          </p>
        </GlassCard>

        <GlassCard className="p-4 border border-(--line)">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono-tight uppercase text-mist-2">No Website Found</span>
            <Globe className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-display font-semibold text-cyan-400 mt-1">
            {noWebsiteCount}
          </div>
          <p className="text-[11px] text-mist-2 mt-0.5">Prime high-conversion web clients</p>
        </GlassCard>

        <GlassCard className="p-4 border border-(--line)">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono-tight uppercase text-mist-2">Already In Outreach</span>
            <CheckCircle2 className="w-4 h-4 text-secondary" />
          </div>
          <div className="text-2xl font-display font-semibold text-paper mt-1">
            {alreadyImportedCount}
          </div>
          <p className="text-[11px] text-mist-2 mt-0.5">Active in contact database</p>
        </GlassCard>
      </div>

      {/* Interactive Niche Lead Discovery Bar */}
      <GlassCard className="p-4 sm:p-5 border border-(--line) bg-gradient-to-r from-primary/[0.08] via-transparent to-secondary/[0.08]">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-secondary" />
          <h3 className="text-sm font-semibold text-paper">
            Dynamic Niche Lead Discovery Engine
          </h3>
          <span className="text-[10px] font-mono-tight text-secondary bg-secondary/10 border border-secondary/20 px-2 py-0.5 rounded-full">
            Autonomous Lead Research
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-5">
            <input
              type="text"
              value={nicheQuery}
              onChange={(e) => setNicheQuery(e.target.value)}
              placeholder="Enter custom business name, niche or keyword (e.g. Abuja Luxury Caterers)..."
              className="w-full bg-white/5 border border-(--line) rounded-lg px-3.5 py-2.5 text-xs text-paper placeholder:text-mist-2 focus:outline-none focus:border-secondary transition-colors"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleDiscoverNiche();
              }}
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={nicheCategory}
              onChange={(e) => setNicheCategory(e.target.value)}
              className="w-full bg-[var(--ink-deep)] border border-(--line) rounded-lg px-3 py-2.5 text-xs text-paper focus:outline-none focus:border-secondary transition-colors"
            >
              {RESEARCH_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <select
              value={nicheArea}
              onChange={(e) => setNicheArea(e.target.value)}
              className="w-full bg-[var(--ink-deep)] border border-(--line) rounded-lg px-3 py-2.5 text-xs text-paper focus:outline-none focus:border-secondary transition-colors"
            >
              {ABUJA_AREAS.filter((a) => a !== 'All Areas').map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <button
              type="button"
              disabled={isDiscovering}
              onClick={handleDiscoverNiche}
              className="w-full h-full min-h-[38px] bg-secondary hover:bg-secondary/90 text-ink font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {isDiscovering ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Researching...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Discover Leads</span>
                </>
              )}
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Filter and Search Controls */}
      <div className="space-y-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {RESEARCH_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-paper shadow-sm shadow-primary/25 border border-primary/40'
                    : 'bg-white/[0.03] text-mist-1 hover:text-paper hover:bg-white/[0.06] border border-(--line)'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Secondary Filters Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.02] border border-(--line)">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative min-w-[200px] sm:min-w-[260px]">
              <Search className="w-3.5 h-3.5 text-mist-2 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, note..."
                className="w-full bg-white/5 border border-(--line) rounded-lg pl-8 pr-3 py-1.5 text-xs text-paper placeholder:text-mist-2 focus:outline-none focus:border-secondary transition-colors"
              />
            </div>

            {/* Area Filter */}
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="bg-[var(--ink-deep)] border border-(--line) rounded-lg px-2.5 py-1.5 text-xs text-paper focus:outline-none focus:border-secondary transition-colors"
            >
              {ABUJA_AREAS.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>

            {/* Website Status Filter */}
            <select
              value={selectedWebsiteStatus}
              onChange={(e) => setSelectedWebsiteStatus(e.target.value)}
              className="bg-[var(--ink-deep)] border border-(--line) rounded-lg px-2.5 py-1.5 text-xs text-paper focus:outline-none focus:border-secondary transition-colors"
            >
              <option value="All">All Website Statuses</option>
              <option value="No Website Found">No Website (High Opportunity)</option>
              <option value="Socials Only">Socials Only</option>
              <option value="Outdated / Needs Redesign">Needs Redesign</option>
              <option value="Active Website">Active Website</option>
            </select>

            {/* Email Only Toggle */}
            <label className="flex items-center gap-1.5 text-xs text-mist-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hasEmailOnly}
                onChange={(e) => setHasEmailOnly(e.target.checked)}
                className="rounded border-(--line) text-primary focus:ring-primary/40 cursor-pointer"
              />
              <span>Public Email Only</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-mist-2 font-mono-tight">
              Showing {filteredProspects.length} of {totalCount}
            </span>
            <button
              type="button"
              onClick={handleSelectAllFiltered}
              className="text-xs text-secondary hover:underline cursor-pointer font-medium ml-1"
            >
              {selectedIds.size === filteredProspects.length && filteredProspects.length > 0
                ? 'Deselect All'
                : 'Select All'}
            </button>
          </div>
        </div>
      </div>

      {/* Prospects Data Table */}
      <GlassCard className="overflow-hidden border border-(--line)">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-(--line) bg-white/[0.02] text-mist-2 font-mono-tight uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      filteredProspects.length > 0 &&
                      selectedIds.size === filteredProspects.length
                    }
                    onChange={handleSelectAllFiltered}
                    className="rounded border-(--line) text-primary focus:ring-primary/40 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">Business &amp; Category</th>
                <th className="py-3 px-4">Area</th>
                <th className="py-3 px-4">Public Email</th>
                <th className="py-3 px-4">Phone / WhatsApp</th>
                <th className="py-3 px-4">Website Opportunity</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--line)">
              {filteredProspects.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-mist-2">
                    <Compass className="w-8 h-8 text-mist-2/40 mx-auto mb-2" />
                    <p className="text-sm font-medium text-paper">No prospects match your criteria</p>
                    <p className="text-xs text-mist-2 mt-1">
                      Try adjusting your search terms or use the Discovery Engine above to research custom niches.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProspects.map((item) => {
                  const isSelected = selectedIds.has(item.id);
                  const isCopied = copiedEmail === item.email;

                  // Website status badge style
                  let statusBadge = 'bg-slate-500/10 text-slate-400 border-slate-500/20';
                  if (item.website_status === 'No Website Found') {
                    statusBadge = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
                  } else if (item.website_status === 'Socials Only') {
                    statusBadge = 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
                  } else if (item.website_status === 'Outdated / Needs Redesign') {
                    statusBadge = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
                  }

                  const cleanPhone = item.phone ? item.phone.replace(/[^0-9]/g, '') : '';
                  const waLink = cleanPhone ? `https://wa.me/${cleanPhone}` : null;

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-white/[0.02] transition-colors ${
                        isSelected ? 'bg-primary/[0.05]' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(item.id)}
                          className="rounded border-(--line) text-primary focus:ring-primary/40 cursor-pointer"
                        />
                      </td>

                      {/* Business & Category */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-paper text-sm">
                          {item.business_name}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] font-mono-tight px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-mist-1">
                            {item.business_category}
                          </span>
                          {item.is_imported && (
                            <span className="text-[9px] font-mono-tight px-1.5 py-0.5 rounded bg-secondary/10 text-secondary border border-secondary/20">
                              ✓ In Outreach
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Area */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono-tight text-xs text-mist-1">
                          {item.area}
                        </span>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4">
                        {item.email ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono-tight text-xs text-paper select-all">
                              {item.email}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyEmail(item.email!)}
                              className="p-1 rounded hover:bg-white/10 text-mist-2 hover:text-paper transition-colors"
                              title="Copy email"
                            >
                              {isCopied ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-mist-2 italic">Missing Email</span>
                        )}
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4">
                        {item.phone ? (
                          <div className="flex items-center gap-1.5 font-mono-tight text-xs text-mist-1">
                            <span>{item.phone}</span>
                            {waLink && (
                              <a
                                href={waLink}
                                target="_blank"
                                rel="noreferrer"
                                className="text-emerald-400 hover:text-emerald-300 transition-colors"
                                title="Open WhatsApp Chat"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-mist-2 italic">—</span>
                        )}
                      </td>

                      {/* Website Opportunity */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block text-[10px] font-mono-tight font-medium px-2 py-0.5 rounded-full border ${statusBadge}`}
                        >
                          {item.website_status}
                        </span>
                        <p className="text-[11px] text-mist-2 mt-1 line-clamp-1 max-w-xs" title={item.verification_note}>
                          {item.verification_note}
                        </p>
                      </td>

                      {/* Source */}
                      <td className="py-3.5 px-4">
                        {item.source_link ? (
                          <a
                            href={item.source_link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-secondary/80 hover:text-secondary hover:underline"
                          >
                            <span>{item.source}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-[11px] text-mist-2">{item.source}</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        {item.is_imported ? (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                            <Check className="w-3.5 h-3.5" />
                            <span>Imported</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => handleImportSingle(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/20 hover:bg-primary/30 text-secondary border border-primary/30 text-xs font-medium transition-colors cursor-pointer"
                          >
                            <UploadCloud className="w-3 h-3" />
                            <span>Import</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Manual Add Custom Lead Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="w-full max-w-lg bg-[var(--ink-deep)] border border-(--line) rounded-2xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-(--line) pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-secondary" />
                <h3 className="font-semibold text-paper text-sm">Add Discovered Lead</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-mist-2 hover:text-paper cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-mist-1 mb-1 font-medium">Business Name *</label>
                <input
                  type="text"
                  value={newLead.business_name}
                  onChange={(e) => setNewLead({ ...newLead, business_name: e.target.value })}
                  placeholder="e.g. 1420 Events"
                  className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2 text-paper focus:outline-none focus:border-secondary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-mist-1 mb-1 font-medium">Category</label>
                  <select
                    value={newLead.business_category}
                    onChange={(e) => setNewLead({ ...newLead, business_category: e.target.value })}
                    className="w-full bg-[var(--ink-deep)] border border-(--line) rounded-lg px-2.5 py-2 text-paper focus:outline-none focus:border-secondary"
                  >
                    {RESEARCH_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-mist-1 mb-1 font-medium">Area in Abuja</label>
                  <select
                    value={newLead.area}
                    onChange={(e) => setNewLead({ ...newLead, area: e.target.value })}
                    className="w-full bg-[var(--ink-deep)] border border-(--line) rounded-lg px-2.5 py-2 text-paper focus:outline-none focus:border-secondary"
                  >
                    {ABUJA_AREAS.filter((a) => a !== 'All Areas').map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-mist-1 mb-1 font-medium">Public Email Address</label>
                  <input
                    type="email"
                    value={newLead.email || ''}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    placeholder="e.g. hello@business.com"
                    className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2 text-paper focus:outline-none focus:border-secondary font-mono-tight"
                  />
                </div>
                <div>
                  <label className="block text-mist-1 mb-1 font-medium">Phone Number</label>
                  <input
                    type="text"
                    value={newLead.phone || ''}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    placeholder="+234 810 000 0000"
                    className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2 text-paper focus:outline-none focus:border-secondary font-mono-tight"
                  />
                </div>
              </div>

              <div>
                <label className="block text-mist-1 mb-1 font-medium">Website Opportunity Status</label>
                <select
                  value={newLead.website_status}
                  onChange={(e) =>
                    setNewLead({
                      ...newLead,
                      website_status: e.target.value as WebsiteOpportunityStatus,
                    })
                  }
                  className="w-full bg-[var(--ink-deep)] border border-(--line) rounded-lg px-2.5 py-2 text-paper focus:outline-none focus:border-secondary"
                >
                  <option value="No Website Found">No Website Found (High Opportunity)</option>
                  <option value="Socials Only">Socials Only (Instagram / Facebook)</option>
                  <option value="Outdated / Needs Redesign">Outdated / Needs Redesign</option>
                  <option value="Active Website">Active Website</option>
                </select>
              </div>

              <div>
                <label className="block text-mist-1 mb-1 font-medium">Verification Note / Source</label>
                <input
                  type="text"
                  value={newLead.verification_note || ''}
                  onChange={(e) => setNewLead({ ...newLead, verification_note: e.target.value })}
                  placeholder="e.g. Listed on occasionally.ng; verified active contact."
                  className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2 text-paper focus:outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-mist-1 mb-1 font-medium">Recommended Pitch</label>
                <input
                  type="text"
                  value={newLead.recommended_pitch || ''}
                  onChange={(e) => setNewLead({ ...newLead, recommended_pitch: e.target.value })}
                  placeholder="e.g. Pitch modern online ordering & portfolio showcase."
                  className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2 text-paper focus:outline-none focus:border-secondary"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-(--line)">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-2 rounded-lg text-xs text-mist-2 hover:text-paper"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCustomLead}
                className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold text-xs transition-all shadow-md"
              >
                Save Prospect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
