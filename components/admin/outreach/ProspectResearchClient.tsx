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
  FileSpreadsheet,
  Globe,
  Mail,
  Phone,
  MessageCircle,
  Plus,
  RefreshCw,
  X,
  ChevronDown,
  UserPlus,
  ArrowRight,
  ShieldCheck,
  CheckCheck,
  GraduationCap,
  FileText,
  Target,
  ClipboardList,
  ShieldAlert,
  Receipt,
  CreditCard,
} from 'lucide-react';
import {
  CURATED_ABUJA_PROSPECTS,
  RESEARCH_CATEGORIES,
  ABUJA_AREAS,
  filterProspects,
  searchAndEnrichProspects,
  verifyProspectLead,
  verifyProspectList,
  exportProspectsToExcel,
  exportProspectsToCsv,
  OUTREACH_PITCH_TEMPLATES,
  calculateProspectScore,
} from '@/lib/email/prospect-research';
import { generateProposalData } from '@/lib/data/proposals';
import { generateMilestoneInvoice, type InvoiceMilestoneType } from '@/lib/data/invoices';
import MonetizationSprintTracker from './MonetizationSprintTracker';
import ObjectionBattlecardsModal from './ObjectionBattlecardsModal';
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

  // 2. Base list (curated + dynamically researched items, with verified status)
  const [prospectsList, setProspectsList] = useState<ProspectResearchItem[]>(() => {
    const verifiedBase = verifyProspectList(CURATED_ABUJA_PROSPECTS);
    return verifiedBase.map((p) => ({
      ...p,
      is_imported: p.email ? existingEmailSet.has(p.email.toLowerCase().trim()) : false,
    }));
  });

  // 3. Staged newly discovered leads tray (for immediate verification and adding to existing list)
  const [stagedDiscoveredLeads, setStagedDiscoveredLeads] = useState<ProspectResearchItem[]>([]);

  // 4. Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedArea, setSelectedArea] = useState<string>('All Areas');
  const [selectedWebsiteStatus, setSelectedWebsiteStatus] = useState<string>('All');
  const [hasEmailOnly, setHasEmailOnly] = useState(false);
  const [statusTab, setStatusTab] = useState<'all' | 'ready_to_add' | 'in_list'>('all');

  // 5. Custom discovery search inputs (Niche Lead Discovery Engine)
  const [nicheQuery, setNicheQuery] = useState('');
  const [nicheCategory, setNicheCategory] = useState('Event Planning & Decor');
  const [nicheArea, setNicheArea] = useState('Wuse 2');
  const [isDiscovering, setIsDiscovering] = useState(false);

  // 6. Selection for batch operations
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // 7. Action states
  const [isPending, startTransition] = useTransition();
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [copiedPitchText, setCopiedPitchText] = useState(false);
  const [activePitchProspect, setActivePitchProspect] = useState<ProspectResearchItem | null>(null);
  const [activePitchVersion, setActivePitchVersion] = useState<'version_a' | 'version_b' | 'version_c'>('version_a');
  
  // Proposal & Sprint states
  const [showSprintTracker, setShowSprintTracker] = useState(false);
  const [activeProposalProspect, setActiveProposalProspect] = useState<ProspectResearchItem | null>(null);
  const [selectedProposalPackage, setSelectedProposalPackage] = useState<'growth' | 'starter' | 'transformation'>('growth');
  const [copiedProposalLink, setCopiedProposalLink] = useState(false);
  const [copiedProposalText, setCopiedProposalText] = useState(false);

  // Invoice & Battlecards states
  const [showBattlecardsModal, setShowBattlecardsModal] = useState(false);
  const [activeInvoiceProspect, setActiveInvoiceProspect] = useState<ProspectResearchItem | null>(null);
  const [selectedInvoiceMilestone, setSelectedInvoiceMilestone] = useState<InvoiceMilestoneType>('kickoff_50');
  const [copiedInvoiceLink, setCopiedInvoiceLink] = useState(false);
  const [copiedInvoiceSummary, setCopiedInvoiceSummary] = useState(false);

  const [feedbackToast, setFeedbackToast] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // 8. Manual Add Modal state
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
  const [autoAddCustomToExisting, setAutoAddCustomToExisting] = useState(true);

  // Filtered view
  const filteredProspects = useMemo(() => {
    let list = filterProspects(prospectsList, {
      category: selectedCategory,
      area: selectedArea,
      website_status: selectedWebsiteStatus,
      hasEmailOnly,
      search: searchQuery,
    });

    if (statusTab === 'ready_to_add') {
      list = list.filter((p) => !p.is_imported);
    } else if (statusTab === 'in_list') {
      list = list.filter((p) => p.is_imported);
    }

    return list;
  }, [
    prospectsList,
    selectedCategory,
    selectedArea,
    selectedWebsiteStatus,
    hasEmailOnly,
    searchQuery,
    statusTab,
  ]);

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
      showToast('error', 'Please enter a business keyword or niche to research (e.g. Fashion Designer, Luxury Bakery).');
      return;
    }

    setIsDiscovering(true);
    setTimeout(() => {
      const generated = searchAndEnrichProspects(nicheQuery, nicheCategory, nicheArea);
      
      // Update staged newly discovered list so user can review and add with 1 click
      setStagedDiscoveredLeads(generated);

      // Prepend to main pool with imported status checked
      setProspectsList((prev) => {
        const withImportedState = generated.map((g) => ({
          ...g,
          is_imported: g.email ? existingEmailSet.has(g.email.toLowerCase().trim()) : false,
        }));
        return [...withImportedState, ...prev];
      });

      setIsDiscovering(false);
      showToast(
        'success',
        `Discovered & verified ${generated.length} new high-opportunity leads for "${nicheQuery}"! Review and add them to your existing list below.`
      );
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

  // Batch import to existing database list (outreach_contacts)
  const handleBatchImport = (itemsToImport: ProspectResearchItem[]) => {
    if (itemsToImport.length === 0) {
      showToast('error', 'No prospects selected to add.');
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
          `Successfully added ${res.inserted} leads to your Existing Outreach List! (${res.skipped} skipped as duplicates/suppressed).`
        );
        // Mark as imported locally across all lists
        const importedIdSet = new Set(itemsToImport.map((p) => p.id));
        setProspectsList((prev) =>
          prev.map((item) =>
            importedIdSet.has(item.id) ? { ...item, is_imported: true } : item
          )
        );
        setStagedDiscoveredLeads((prev) =>
          prev.map((item) =>
            importedIdSet.has(item.id) ? { ...item, is_imported: true } : item
          )
        );
        setSelectedIds(new Set());
      } else {
        showToast('error', res.error || 'Failed to add leads to existing list.');
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

    created.verification = verifyProspectLead(created);

    setProspectsList((prev) => [created, ...prev]);
    setShowAddModal(false);

    if (autoAddCustomToExisting) {
      handleBatchImport([created]);
    } else {
      showToast('success', `Added "${created.business_name}" to research pool!`);
    }

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
  };

  return (
    <div className="space-y-6">
      {/* Toast alert banner */}
      {feedbackToast && (
        <div
          className={`p-4 rounded-2xl border text-xs font-medium flex items-center justify-between shadow-md animate-fade-in ${
            feedbackToast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : feedbackToast.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedbackToast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : feedbackToast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : (
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            )}
            <span>{feedbackToast.message}</span>
          </div>
          <button
            onClick={() => setFeedbackToast(null)}
            className="text-slate-400 hover:text-slate-700 ml-3 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Header & Actions matching DealDeck Modern White */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#3b5bfa]">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-slate-900 tracking-tight">
                Abuja Lead Research &amp; Prospect Finder
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Curated and verifiable prospect directory with public emails, phone numbers, website audit scores, and 1-click addition to existing lists.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#3b5bfa]" />
            <span>+ Add Custom Lead</span>
          </button>

          <button
            type="button"
            onClick={() => exportProspectsToCsv(filteredProspects)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-xs transition-all cursor-pointer"
            title="Download formatted CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => exportProspectsToExcel(filteredProspects)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold transition-all shadow-xs cursor-pointer"
            title="Download formatted Excel spreadsheet"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Download Excel (.xlsx)</span>
          </button>

          <button
            type="button"
            onClick={() => setShowBattlecardsModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold transition-all shadow-xs cursor-pointer"
            title="Open Objection Battlecards & Sales Call Cheatsheet"
          >
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>🛡️ Objection Battlecards</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSprintTracker((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer ${
              showSprintTracker
                ? 'bg-[#3b5bfa] text-white shadow-sm'
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
            }`}
            title="Toggle 30-Day Monetization Sprint & Revenue Engine Tracker"
          >
            <Target className="w-4 h-4" />
            <span>{showSprintTracker ? 'Hide Sprint Tracker' : '🎯 30-Day Sprint'}</span>
          </button>

          <Link
            href="/projects/crestfield-academy"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#3b5bfa] border border-blue-200 text-xs font-semibold transition-all shadow-xs cursor-pointer"
            title="Inspect live Crestfield Academy demo showcase weapon"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Live Academy Demo</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          <Link
            href="/onboarding"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold transition-all shadow-xs cursor-pointer"
            title="Open 24-Hour Client Rapid Onboarding Portal"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Onboarding Portal</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          {selectedIds.size > 0 && (
            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                const toImport = filteredProspects.filter((p) => selectedIds.has(p.id));
                handleBatchImport(toImport);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3b5bfa] hover:bg-blue-600 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Selected to Existing List ({selectedIds.size})</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Sprint Tracker Drawer ── */}
      {showSprintTracker && (
        <div className="animate-fade-in">
          <MonetizationSprintTracker onClose={() => setShowSprintTracker(false)} />
        </div>
      )}

      {/* Telemetry Stats Bar matching DealDeck 4-card metric row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Total Pool */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono-tight">
              Total Pool
            </span>
            <span className="text-[10px] font-mono-tight px-2 py-0.5 rounded-full bg-blue-50 text-[#3b5bfa] border border-blue-100 font-semibold">
              Abuja
            </span>
          </div>
          <div className="text-3xl font-display font-bold text-slate-900 mt-2">
            {totalCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across 10+ core industries</p>
        </div>

        {/* Stat 2: With Public Email */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono-tight">
              With Public Email
            </span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Mail className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-3xl font-display font-bold text-emerald-600 mt-2">
            {withEmailCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {totalCount > 0 ? Math.round((withEmailCount / totalCount) * 100) : 0}% email coverage
          </p>
        </div>

        {/* Stat 3: No Website Found */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono-tight">
              No Website Found
            </span>
            <div className="w-7 h-7 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Globe className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-3xl font-display font-bold text-cyan-600 mt-2">
            {noWebsiteCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Prime high-conversion web clients</p>
        </div>

        {/* Stat 4: In Existing List */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono-tight">
              In Existing List
            </span>
            <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-3xl font-display font-bold text-slate-900 mt-2">
            {alreadyImportedCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Active in contact database</p>
        </div>
      </div>

      {/* ── Dynamic Niche Lead Discovery Engine ── */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#3b5bfa]" />
            <h3 className="text-sm font-bold font-display text-slate-900">
              Dynamic Niche Lead Discovery Engine
            </h3>
            <span className="text-[10px] font-mono-tight font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full">
              Autonomous Lead Research
            </span>
          </div>

          <span className="text-xs text-slate-400 hidden sm:inline">
            Searches Abuja business registries, maps &amp; public portals
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-5">
            <input
              type="text"
              value={nicheQuery}
              onChange={(e) => setNicheQuery(e.target.value)}
              placeholder="Enter custom business name, niche or keyword (e.g. Fashion Designer, Luxury Bakery)..."
              className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#3b5bfa] focus:bg-white transition-colors"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleDiscoverNiche();
              }}
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={nicheCategory}
              onChange={(e) => setNicheCategory(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#3b5bfa] transition-colors cursor-pointer"
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
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#3b5bfa] transition-colors cursor-pointer"
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
              className="w-full h-full min-h-[40px] bg-[#3b5bfa] hover:bg-blue-600 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
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

        {/* ── Newly Discovered & Verified Leads Staging Tray ── */}
        {stagedDiscoveredLeads.length > 0 && (
          <div className="mt-5 pt-5 border-t border-slate-100 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-blue-50/70 border border-blue-100 rounded-2xl p-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <CheckCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">
                    Newly Discovered &amp; Verified Leads ({stagedDiscoveredLeads.length})
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Contact data verified. Click below to add them to your existing list.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => {
                    const toAdd = stagedDiscoveredLeads.filter((p) => !p.is_imported);
                    if (toAdd.length === 0) {
                      showToast('info', 'All discovered leads are already in your existing list.');
                      return;
                    }
                    handleBatchImport(toAdd);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3b5bfa] hover:bg-blue-600 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Add All to Existing List</span>
                </button>

                <Link
                  href="/admin/outreach/contacts"
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold px-2 py-1.5 rounded-lg hover:bg-white transition-all inline-flex items-center gap-1"
                >
                  <span>View Existing List</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>

                <button
                  type="button"
                  onClick={() => setStagedDiscoveredLeads([])}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white transition-colors"
                  title="Dismiss staging tray"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Cards for each discovered lead */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {stagedDiscoveredLeads.map((lead) => {
                const isImported = lead.is_imported;
                return (
                  <div
                    key={lead.id}
                    className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-xs flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h5 className="font-bold text-xs text-slate-900 leading-tight">
                            {lead.business_name}
                          </h5>
                          <span className="text-[11px] text-slate-500 block mt-0.5">
                            {lead.business_category} • {lead.area}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono-tight font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
                          Verified
                        </span>
                      </div>

                      {/* Contact items */}
                      <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                        {lead.email && (
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{lead.email}</span>
                          </div>
                        )}
                        {lead.phone && (
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{lead.phone}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                        <span className="font-medium text-slate-700">Pitch:</span>{' '}
                        {lead.recommended_pitch}
                      </div>
                    </div>

                    {/* Dedicated Add to Existing List Button requested by user */}
                    <div className="pt-2">
                      {isImported ? (
                        <div className="w-full py-1.5 px-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center justify-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Added to Existing List</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleImportSingle(lead)}
                          disabled={isPending}
                          className="w-full py-2 px-3 rounded-xl bg-[#3b5bfa] hover:bg-blue-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>+ Add to Existing List</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Main Directory Table ("Existing Researched Prospects Directory") ── */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-5">
        {/* Status Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setStatusTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                statusTab === 'all'
                  ? 'bg-[#3b5bfa] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              All Prospects ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusTab('ready_to_add')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                statusTab === 'ready_to_add'
                  ? 'bg-[#3b5bfa] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Ready to Add ({totalCount - alreadyImportedCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusTab('in_list')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                statusTab === 'in_list'
                  ? 'bg-[#3b5bfa] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Already in Existing List ({alreadyImportedCount})
            </button>
          </div>

          <div className="text-xs text-slate-400">
            Showing <strong className="text-slate-700">{filteredProspects.length}</strong> of {totalCount} prospects
          </div>
        </div>

        {/* Category Filter Pills matching DealDeck */}
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
                    ? 'bg-[#3b5bfa] text-white shadow-xs font-semibold'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/80'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Secondary Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/70">
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            {/* Search Input */}
            <div className="relative min-w-[200px] sm:min-w-[240px] flex-1 sm:flex-initial">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, note..."
                className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#3b5bfa] transition-colors"
              />
            </div>

            {/* Area Filter */}
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3b5bfa] transition-colors cursor-pointer"
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
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#3b5bfa] transition-colors cursor-pointer"
            >
              <option value="All">All Website Statuses</option>
              <option value="No Website Found">No Website Found</option>
              <option value="Socials Only">Socials Only</option>
              <option value="Outdated / Needs Redesign">Needs Redesign</option>
              <option value="Active Website">Active Website</option>
            </select>

            {/* Email Only Toggle */}
            <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hasEmailOnly}
                onChange={(e) => setHasEmailOnly(e.target.checked)}
                className="rounded border-slate-300 text-[#3b5bfa] focus:ring-0 cursor-pointer"
              />
              <span>Public Email Only</span>
            </label>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            <button
              type="button"
              onClick={handleSelectAllFiltered}
              className="text-xs text-[#3b5bfa] hover:underline font-semibold cursor-pointer"
            >
              {selectedIds.size === filteredProspects.length && filteredProspects.length > 0
                ? 'Deselect All'
                : 'Select All'}
            </button>
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto border border-slate-200/80 rounded-2xl">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/90 text-slate-500 font-semibold uppercase font-mono-tight text-[11px] border-b border-slate-200/80">
              <tr>
                <th className="py-3 px-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.size > 0 && selectedIds.size === filteredProspects.length
                    }
                    onChange={handleSelectAllFiltered}
                    className="rounded border-slate-300 text-[#3b5bfa] cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">Business &amp; Category</th>
                <th className="py-3 px-3">Area</th>
                <th className="py-3 px-3">Public Email</th>
                <th className="py-3 px-3">Phone / WhatsApp</th>
                <th className="py-3 px-3">Website Opportunity</th>
                <th className="py-3 px-3">Source</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProspects.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Compass className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-medium text-slate-600">No prospects match your active filters.</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Try clearing category or keyword filters, or use the Discovery Engine above.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProspects.map((item) => {
                  const isSelected = selectedIds.has(item.id);
                  const isImported = item.is_imported;

                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors ${
                        isSelected
                          ? 'bg-blue-50/40'
                          : isImported
                          ? 'bg-slate-50/30 hover:bg-slate-50/70'
                          : 'hover:bg-slate-50/60'
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(item.id)}
                          className="rounded border-slate-300 text-[#3b5bfa] cursor-pointer"
                        />
                      </td>

                      {/* Business & Category */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 leading-tight">
                          {item.business_name}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                          <span>{item.business_category}</span>
                          {item.verification?.is_verified && (
                            <span className="text-[10px] text-emerald-600 font-semibold">
                              • Verified
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Area */}
                      <td className="py-3 px-3 font-medium text-slate-700 whitespace-nowrap">
                        {item.area}
                      </td>

                      {/* Public Email */}
                      <td className="py-3 px-3">
                        {item.email ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono-tight text-slate-800 text-[11px]">
                              {item.email}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyEmail(item.email!)}
                              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                              title="Copy email"
                            >
                              {copiedEmail === item.email ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">None listed</span>
                        )}
                      </td>

                      {/* Phone / WhatsApp */}
                      <td className="py-3 px-3">
                        {item.phone ? (
                          <div className="flex items-center gap-1.5 whitespace-nowrap">
                            <span className="font-mono-tight text-slate-700 text-[11px]">
                              {item.phone}
                            </span>
                            <a
                              href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                OUTREACH_PITCH_TEMPLATES.version_a.buildText(item.business_name)
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-600 hover:text-emerald-700 p-1"
                              title="Send Version A on WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                            <button
                              type="button"
                              onClick={() => {
                                setActivePitchProspect(item);
                                setActivePitchVersion('version_a');
                              }}
                              className="px-2 py-0.5 rounded-lg bg-[#3b5bfa]/10 hover:bg-[#3b5bfa] text-[#3b5bfa] hover:text-white text-[10px] font-semibold transition-all inline-flex items-center gap-0.5 cursor-pointer"
                              title="Open 1-Click WhatsApp Pitch Scripts (Version A, B, C)"
                            >
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>Pitch</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveProposalProspect(item);
                                setSelectedProposalPackage('growth');
                              }}
                              className="px-2 py-0.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white text-[10px] font-semibold transition-all inline-flex items-center gap-0.5 cursor-pointer"
                              title="Generate 1-Click Proposal & Agreement Link"
                            >
                              <FileText className="w-2.5 h-2.5" />
                              <span>Proposal</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveInvoiceProspect(item);
                                setSelectedInvoiceMilestone('kickoff_50');
                              }}
                              className="px-2 py-0.5 rounded-lg bg-amber-50 hover:bg-amber-600 text-amber-700 hover:text-white text-[10px] font-semibold transition-all inline-flex items-center gap-0.5 cursor-pointer"
                              title="Generate 1-Click Milestone Invoice Link"
                            >
                              <Receipt className="w-2.5 h-2.5" />
                              <span>Invoice</span>
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] text-slate-400 italic">None listed</span>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveProposalProspect(item);
                                setSelectedProposalPackage('growth');
                              }}
                              className="px-2 py-0.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white text-[10px] font-semibold transition-all inline-flex items-center gap-0.5 cursor-pointer"
                              title="Generate 1-Click Proposal & Agreement Link"
                            >
                              <FileText className="w-2.5 h-2.5" />
                              <span>Proposal</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveInvoiceProspect(item);
                                setSelectedInvoiceMilestone('kickoff_50');
                              }}
                              className="px-2 py-0.5 rounded-lg bg-amber-50 hover:bg-amber-600 text-amber-700 hover:text-white text-[10px] font-semibold transition-all inline-flex items-center gap-0.5 cursor-pointer"
                              title="Generate 1-Click Milestone Invoice Link"
                            >
                              <Receipt className="w-2.5 h-2.5" />
                              <span>Invoice</span>
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Website Opportunity */}
                      <td className="py-3 px-3">
                        {(() => {
                          const qScore = calculateProspectScore(item);
                          return (
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span
                                  className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono-tight ${
                                    item.website_status === 'No Website Found'
                                      ? 'bg-rose-50 text-rose-600 border border-rose-100'
                                      : item.website_status === 'Socials Only'
                                      ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                      : item.website_status === 'Outdated / Needs Redesign'
                                      ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                      : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                  }`}
                                >
                                  {item.website_status}
                                </span>
                                <span
                                  className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-bold"
                                  title={qScore.reasons.join(', ')}
                                >
                                  Score: {qScore.score}/5
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1 max-w-[200px]" title={item.verification_note}>
                                {item.verification_note}
                              </p>
                            </div>
                          );
                        })()}
                      </td>

                      {/* Source */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {item.source_link ? (
                          <a
                            href={item.source_link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#3b5bfa] hover:underline inline-flex items-center gap-1 text-[11px]"
                          >
                            <span>{item.source}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-500">{item.source}</span>
                        )}
                      </td>

                      {/* Action: Add to Existing List requested by user */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        {isImported ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>In Existing List</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleImportSingle(item)}
                            disabled={isPending}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#3b5bfa] hover:bg-blue-600 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>+ Add to Existing List</span>
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
      </div>

      {/* ── Add Custom Lead Modal ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xl max-w-xl w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#3b5bfa]" />
                <h3 className="font-display font-bold text-base text-slate-900">
                  Add Custom Researched Lead
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={newLead.business_name || ''}
                  onChange={(e) => setNewLead({ ...newLead, business_name: e.target.value })}
                  placeholder="e.g. Signature Decor Abuja"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:bg-white focus:border-[#3b5bfa] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <select
                    value={newLead.business_category || 'Event Planning & Decor'}
                    onChange={(e) =>
                      setNewLead({ ...newLead, business_category: e.target.value })
                    }
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-[#3b5bfa] focus:outline-none"
                  >
                    {RESEARCH_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Area in Abuja</label>
                  <select
                    value={newLead.area || 'Wuse 2'}
                    onChange={(e) => setNewLead({ ...newLead, area: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-[#3b5bfa] focus:outline-none"
                  >
                    {ABUJA_AREAS.filter((a) => a !== 'All Areas').map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Public Email</label>
                  <input
                    type="email"
                    value={newLead.email || ''}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    placeholder="contact@signaturedecor.ng"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:bg-white focus:border-[#3b5bfa] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newLead.phone || ''}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    placeholder="+234 812 345 6789"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:bg-white focus:border-[#3b5bfa] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Website Status &amp; Opportunity
                </label>
                <select
                  value={newLead.website_status || 'No Website Found'}
                  onChange={(e) =>
                    setNewLead({
                      ...newLead,
                      website_status: e.target.value as WebsiteOpportunityStatus,
                    })
                  }
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-[#3b5bfa] focus:outline-none"
                >
                  <option value="No Website Found">No Website Found (High Opportunity)</option>
                  <option value="Socials Only">Socials Only</option>
                  <option value="Outdated / Needs Redesign">Needs Redesign</option>
                  <option value="Active Website">Active Website</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Verification Note / Research Details
                </label>
                <textarea
                  rows={2}
                  value={newLead.verification_note || ''}
                  onChange={(e) =>
                    setNewLead({ ...newLead, verification_note: e.target.value })
                  }
                  placeholder="e.g. Active Instagram vendor in Wuse 2. Public phone verified on directory."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 focus:bg-white focus:border-[#3b5bfa] focus:outline-none"
                />
              </div>

              <label className="flex items-center gap-2 pt-1 text-slate-700 font-medium cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoAddCustomToExisting}
                  onChange={(e) => setAutoAddCustomToExisting(e.target.checked)}
                  className="rounded border-slate-300 text-[#3b5bfa] focus:ring-0 cursor-pointer"
                />
                <span>Automatically add directly to Existing Outreach List</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCustomLead}
                className="px-4 py-2 rounded-xl bg-[#3b5bfa] hover:bg-blue-600 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                {autoAddCustomToExisting ? 'Save & Add to Existing List' : 'Save to Research Pool'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 9. Sales Pitch Launcher Modal (1-Click Outreach Scripts) ── */}
      {activePitchProspect && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setActivePitchProspect(null)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-800 text-xs p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#3b5bfa] flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      1-Click Outreach Pitch &bull; {activePitchProspect.business_name}
                    </h3>
                    {(() => {
                      const qScore = calculateProspectScore(activePitchProspect);
                      return (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                          Score: {qScore.score}/5 {qScore.priority} Priority
                        </span>
                      );
                    })()}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Category: {activePitchProspect.business_category} &bull; Area: {activePitchProspect.area}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActivePitchProspect(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Script Version Switcher Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-slate-50 border border-slate-100">
              {(['version_a', 'version_b', 'version_c'] as const).map((key) => {
                const template = OUTREACH_PITCH_TEMPLATES[key];
                const isActive = activePitchVersion === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActivePitchVersion(key)}
                    className={`py-2 px-3 rounded-xl text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white text-[#3b5bfa] shadow-sm font-bold border border-slate-200'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-400">
                      {template.badge}
                    </span>
                    <span className="text-xs truncate block">{template.title.split('—')[1] || template.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Template Description */}
            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-blue-900 text-xs">
              <p className="font-medium">
                {OUTREACH_PITCH_TEMPLATES[activePitchVersion].description}
              </p>
            </div>

            {/* Script Text Box */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-slate-500 font-semibold text-[11px] uppercase tracking-wider font-mono">
                  Personalized WhatsApp Script:
                </span>
                <span className="text-slate-400 text-[10px]">Ready to copy or send directly</span>
              </div>
              <textarea
                readOnly
                rows={9}
                value={OUTREACH_PITCH_TEMPLATES[activePitchVersion].buildText(activePitchProspect.business_name)}
                className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 leading-relaxed focus:outline-none"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="text-[11px] text-slate-400">
                Target: <strong>Business Growth System (₦200,000)</strong>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const text = OUTREACH_PITCH_TEMPLATES[activePitchVersion].buildText(activePitchProspect.business_name);
                    navigator.clipboard.writeText(text);
                    setCopiedPitchText(true);
                    showToast('success', 'Outreach script copied to clipboard.');
                    setTimeout(() => setCopiedPitchText(false), 2500);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  {copiedPitchText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPitchText ? 'Copied Script!' : 'Copy Script'}</span>
                </button>

                {activePitchProspect.phone && (
                  <a
                    href={`https://wa.me/${activePitchProspect.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      OUTREACH_PITCH_TEMPLATES[activePitchVersion].buildText(activePitchProspect.business_name)
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-all shadow-sm shadow-emerald-600/20 cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Send on WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 10. 1-Page Proposal & Agreement Generator Modal ── */}
      {activeProposalProspect && (() => {
        const proposalData = generateProposalData(activeProposalProspect.business_name, {
          category: activeProposalProspect.business_category,
          packageId: selectedProposalPackage,
          targetCity: `${activeProposalProspect.area}, Abuja`,
        });

        const proposalPath = `/proposals/${proposalData.slug}`;
        const whatsappNumber = activeProposalProspect.phone ? activeProposalProspect.phone.replace(/[^0-9]/g, '') : '';
        const whatsappShareUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
          `Hello, here is the official 1-Page Scope of Work & Proposal for ${activeProposalProspect.business_name} (${proposalData.formattedPrice}):\nhttps://rayidatech.name.ng${proposalPath}\n\nKey Highlights:\n• Package: ${proposalData.packageName}\n• Turnaround: ${proposalData.deliveryTimeline}\n• Milestones: 50% Kickoff (₦${Math.round(proposalData.totalPrice / 2).toLocaleString()}), 50% Live Launch\n\nYou can review deliverables and accept with 1 click directly on the link above.`
        )}`;

        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
            onClick={() => setActiveProposalProspect(null)}
          >
            <div
              className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-800 text-xs p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">
                        1-Page Proposal Generator &bull; {activeProposalProspect.business_name}
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                        7-Day Turnaround
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Shareable client link &bull; Scope of work, deliverables &amp; 50/50 milestones
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveProposalProspect(null)}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Package Selector */}
              <div>
                <label className="block text-slate-500 font-semibold text-[11px] uppercase tracking-wider font-mono mb-1.5">
                  Choose Package to Propose:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProposalPackage('starter')}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      selectedProposalPackage === 'starter'
                        ? 'border-blue-500 bg-blue-50 text-blue-900 font-bold'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <span className="block text-[10px] font-mono uppercase text-slate-400">Entry Offer</span>
                    <span className="text-xs block font-bold">Starter — ₦100,000</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">3–5 Days Delivery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedProposalPackage('growth')}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      selectedProposalPackage === 'growth'
                        ? 'border-[#3b5bfa] bg-blue-50/80 text-blue-900 font-bold'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <span className="block text-[10px] font-mono uppercase text-blue-600 font-bold">Core Offer</span>
                    <span className="text-xs block font-bold">Growth System — ₦200,000</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">7–10 Days Delivery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedProposalPackage('transformation')}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      selectedProposalPackage === 'transformation'
                        ? 'border-purple-500 bg-purple-50 text-purple-900 font-bold'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <span className="block text-[10px] font-mono uppercase text-slate-400">Enterprise</span>
                    <span className="text-xs block font-bold">Transformation — ₦350,000</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">10–15 Days Delivery</span>
                  </button>
                </div>
              </div>

              {/* Proposal Link Box */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-700">Dedicated Public Proposal Link:</span>
                  <Link
                    href={proposalPath}
                    target="_blank"
                    className="text-[#3b5bfa] hover:underline font-semibold inline-flex items-center gap-1"
                  >
                    <span>Open Live Proposal Preview</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`https://rayidatech.name.ng${proposalPath}`}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 font-mono text-xs text-slate-700 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(`https://rayidatech.name.ng${proposalPath}`);
                      setCopiedProposalLink(true);
                      showToast('success', 'Proposal link copied to clipboard.');
                      setTimeout(() => setCopiedProposalLink(false), 2500);
                    }}
                    className="shrink-0 px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs flex items-center gap-1 cursor-pointer transition-all"
                  >
                    {copiedProposalLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedProposalLink ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>

              {/* Scope of Work Preview */}
              <div className="space-y-1.5">
                <span className="text-slate-500 font-semibold text-[11px] uppercase tracking-wider font-mono">
                  Deliverables Preview ({proposalData.deliverables.length} Items):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50/70 p-3 rounded-2xl border border-slate-100 max-h-36 overflow-y-auto">
                  {proposalData.deliverables.map((d, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-slate-900 leading-tight">{d.title}</strong>
                        <span className="text-[10px] text-slate-500 line-clamp-1">{d.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestones Info */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-emerald-900 text-xs">
                <div>
                  <span className="font-bold block">50/50 Milestone Structure</span>
                  <span className="text-[11px] text-emerald-700">
                    Milestone 1: ₦{Math.round(proposalData.totalPrice / 2).toLocaleString()} to begin &bull; Milestone 2: ₦{Math.round(proposalData.totalPrice / 2).toLocaleString()} at live release
                  </span>
                </div>
                <span className="font-extrabold text-sm text-emerald-800">
                  {proposalData.formattedPrice}
                </span>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    const text = `PROPOSAL & AGREEMENT: ${activeProposalProspect.business_name}\nPackage: ${proposalData.packageName} (${proposalData.formattedPrice})\nLink: https://rayidatech.name.ng${proposalPath}\nMilestones: 50% Kickoff, 50% Launch`;
                    navigator.clipboard.writeText(text);
                    setCopiedProposalText(true);
                    showToast('success', 'Proposal summary copied to clipboard.');
                    setTimeout(() => setCopiedProposalText(false), 2500);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  {copiedProposalText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedProposalText ? 'Copied Summary!' : 'Copy Summary'}</span>
                </button>

                {activeProposalProspect.phone && (
                  <a
                    href={whatsappShareUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-all shadow-sm shadow-emerald-600/20 cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Send Proposal on WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── 11. Milestone Invoice & Bank Remittance Generator Modal ── */}
      {activeInvoiceProspect && (() => {
        const invoiceData = generateMilestoneInvoice(
          activeInvoiceProspect.business_name,
          selectedInvoiceMilestone,
          {
            category: activeInvoiceProspect.business_category,
            area: `${activeInvoiceProspect.area}, Abuja`,
          }
        );

        const invoicePath = `/invoices/${invoiceData.id}`;
        const whatsappNumber = activeInvoiceProspect.phone ? activeInvoiceProspect.phone.replace(/[^0-9]/g, '') : '';
        const whatsappShareUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
          `Hello, here is the official Milestone Invoice ${invoiceData.invoiceNumber} for ${activeInvoiceProspect.business_name} (${invoiceData.formattedAmount}):\nhttps://rayidatech.name.ng${invoicePath}\n\nBank Remittance Instructions:\n• Bank: ${invoiceData.bankDetails.bankName}\n• Account: ${invoiceData.bankDetails.accountNumber} (${invoiceData.bankDetails.accountName})\n• Reference: ${invoiceData.bankDetails.paymentReference}\n\nPlease reply with proof of payment receipt to initiate development immediately.`
        )}`;

        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in text-xs text-slate-800"
            onClick={() => setActiveInvoiceProspect(null)}
          >
            <div
              className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-slate-800 text-xs p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">
                        Milestone Invoice Generator &bull; {activeInvoiceProspect.business_name}
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
                        {invoiceData.invoiceNumber}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Bank remittance instructions &bull; 50/50 milestone invoicing &bull; Instant WhatsApp dispatch
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveInvoiceProspect(null)}
                  className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Milestone Type Selector */}
              <div>
                <label className="block text-slate-500 font-semibold text-[11px] uppercase tracking-wider font-mono mb-1.5">
                  Select Milestone to Invoice:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedInvoiceMilestone('kickoff_50')}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      selectedInvoiceMilestone === 'kickoff_50'
                        ? 'border-blue-500 bg-blue-50 text-blue-900 font-bold'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <span className="block text-[10px] font-mono uppercase text-blue-600 font-bold">Milestone 1</span>
                    <span className="text-xs block font-bold">Kickoff (50%) — ₦100,000</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">To initiate development</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedInvoiceMilestone('handover_50')}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      selectedInvoiceMilestone === 'handover_50'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <span className="block text-[10px] font-mono uppercase text-emerald-600 font-bold">Milestone 2</span>
                    <span className="text-xs block font-bold">Handover (50%) — ₦100,000</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">At final live launch</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedInvoiceMilestone('care_retainer')}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      selectedInvoiceMilestone === 'care_retainer'
                        ? 'border-purple-500 bg-purple-50 text-purple-900 font-bold'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <span className="block text-[10px] font-mono uppercase text-purple-600 font-bold">Retainer</span>
                    <span className="text-xs block font-bold">Monthly Care — ₦35,000</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Recurring maintenance</span>
                  </button>
                </div>
              </div>

              {/* Public Invoice Link Box */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-700">Official Digital Invoice Link:</span>
                  <Link
                    href={invoicePath}
                    target="_blank"
                    className="text-[#3b5bfa] hover:underline font-semibold inline-flex items-center gap-1"
                  >
                    <span>Open Live Invoice Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`https://rayidatech.name.ng${invoicePath}`}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 font-mono text-xs text-slate-700 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(`https://rayidatech.name.ng${invoicePath}`);
                      setCopiedInvoiceLink(true);
                      showToast('success', 'Invoice link copied to clipboard.');
                      setTimeout(() => setCopiedInvoiceLink(false), 2500);
                    }}
                    className="shrink-0 px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs flex items-center gap-1 cursor-pointer transition-all"
                  >
                    {copiedInvoiceLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedInvoiceLink ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>

              {/* Bank Remittance Preview */}
              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-amber-950 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1 text-xs">
                    <CreditCard className="w-3.5 h-3.5 text-amber-700" />
                    Bank Remittance Details:
                  </span>
                  <span className="font-mono font-bold text-sm text-slate-900">{invoiceData.formattedAmount}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Bank Name:</span>
                    <span className="font-semibold text-slate-800">{invoiceData.bankDetails.bankName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Account Number:</span>
                    <span className="font-mono font-bold text-slate-900">{invoiceData.bankDetails.accountNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Account Name:</span>
                    <span className="font-semibold text-slate-800">{invoiceData.bankDetails.accountName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Reference:</span>
                    <span className="font-mono font-bold text-blue-600">{invoiceData.bankDetails.paymentReference}</span>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    const text = `INVOICE ${invoiceData.invoiceNumber}: ${activeInvoiceProspect.business_name}\nAmount: ${invoiceData.formattedAmount}\nBank: ${invoiceData.bankDetails.bankName}\nAccount: ${invoiceData.bankDetails.accountNumber} (${invoiceData.bankDetails.accountName})\nRef: ${invoiceData.bankDetails.paymentReference}\nLink: https://rayidatech.name.ng${invoicePath}`;
                    navigator.clipboard.writeText(text);
                    setCopiedInvoiceSummary(true);
                    showToast('success', 'Invoice details copied to clipboard.');
                    setTimeout(() => setCopiedInvoiceSummary(false), 2500);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  {copiedInvoiceSummary ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedInvoiceSummary ? 'Copied Summary!' : 'Copy Details'}</span>
                </button>

                {activeInvoiceProspect.phone && (
                  <a
                    href={whatsappShareUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-all shadow-sm shadow-emerald-600/20 cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Send Invoice on WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── 12. Objection Battlecards Modal ── */}
      {showBattlecardsModal && (
        <ObjectionBattlecardsModal onClose={() => setShowBattlecardsModal(false)} />
      )}
    </div>
  );
}
