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
      <div className="text-paper text-sm font-mono-tight p-6 rounded-xl border border-(--line) bg-white/[0.02]">
        Loading Prospect Research...
      </div>
    </div>
  );
}
