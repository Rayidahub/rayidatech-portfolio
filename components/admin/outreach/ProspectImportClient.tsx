'use client';

import { useState, useTransition, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Download,
  ArrowRight,
  RefreshCw,
  Loader2,
  Info,
  Check,
  ChevronDown,
} from 'lucide-react';
import { batchImportContacts } from '@/app/actions/outreach-contacts';
import { isValidEmailAddress } from '@/lib/email/outreach-utils';
import GlassCard from '@/components/ui/GlassCard';
import type { ColumnMapping, ImportPreviewRow, OutreachContact } from '@/types/outreach';

const EXPECTED_FIELDS: Array<{ key: keyof ColumnMapping; label: string; required: boolean }> = [
  { key: 'business_name', label: 'Business Name', required: true },
  { key: 'contact_name', label: 'Contact Person', required: false },
  { key: 'email', label: 'Email Address', required: false },
  { key: 'business_type', label: 'Business Type / Industry', required: false },
  { key: 'location', label: 'Location (City / Area)', required: false },
  { key: 'website', label: 'Website', required: false },
  { key: 'instagram', label: 'Instagram Handle', required: false },
  { key: 'phone', label: 'Phone Number', required: false },
  { key: 'notes', label: 'Notes', required: false },
];

/**
 * Sanitizes spreadsheet cell strings to defend against CSV/Excel formula injection.
 */
function sanitizeCell(val: unknown): string {
  if (val === undefined || val === null) return '';
  const str = String(val).trim();
  if (str.startsWith('=') || str.startsWith('+') || str.startsWith('-') || str.startsWith('@')) {
    return `'${str}`;
  }
  return str;
}

export default function ProspectImportClient() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<'upload' | 'mapping' | 'preview' | 'completed'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [sheetHeaders, setSheetHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<Record<string, unknown>[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>({
    business_name: '',
    contact_name: '',
    email: '',
    business_type: '',
    location: '',
    website: '',
    instagram: '',
    phone: '',
    notes: '',
  });

  const [previewRows, setPreviewRows] = useState<ImportPreviewRow[]>([]);
  const [isPending, startTransition] = useTransition();
  const [importSummary, setImportSummary] = useState<{ inserted: number; skipped: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Downloadable pre-populated templates
  const handleDownloadSample = (format: 'xlsx' | 'csv') => {
    const sampleData = [
      {
        'Business Name': 'Pebbles Rentals & Events',
        'Contact Person': 'Amina Bello',
        'Email Address': 'hello@pebblesevents.com',
        'Business Type': 'Event Rentals & Decor',
        'Location': 'Wuse 2, Abuja',
        'Website': 'https://pebblesevents.com',
        'Instagram': '@pebblesevents',
        'Phone Number': '+234 803 123 4567',
        'Notes': 'Top luxury marquee and chairs rental in Abuja.',
      },
      {
        'Business Name': 'Maitama Prime Residences',
        'Contact Person': 'Chinedu Eze',
        'Email Address': 'inquiries@maitamaprime.ng',
        'Business Type': 'Real Estate & Shortlets',
        'Location': 'Maitama, Abuja',
        'Website': 'https://maitamaprime.ng',
        'Instagram': '@maitamaprime',
        'Phone Number': '+234 812 987 6543',
        'Notes': 'Serviced luxury apartments, looking to automate bookings.',
      },
      {
        'Business Name': 'Spice Garden Bistro & Lounge',
        'Contact Person': '',
        'Email Address': 'contact@spicegardenbistro.com',
        'Business Type': 'Hospitality & Dining',
        'Location': 'Garki 2, Abuja',
        'Website': '',
        'Instagram': '@spicegardenabuja',
        'Phone Number': '+234 908 555 1234',
        'Notes': 'Needs digital food menu and online reservation system.',
      },
      {
        'Business Name': 'Kano Leatherworks Studio',
        'Contact Person': 'Ibrahim Musa',
        'Email Address': '', // Missing email demonstration
        'Business Type': 'Fashion & Leather Craft',
        'Location': 'Central Business District, Abuja',
        'Website': '',
        'Instagram': '@kanoleather',
        'Phone Number': '+234 802 333 4444',
        'Notes': 'Instagram-first brand without a website or public email yet.',
      },
    ];

    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Prospects');

    if (format === 'xlsx') {
      XLSX.writeFile(wb, 'Rayida_Tech_Abuja_Prospects_Template.xlsx');
    } else {
      XLSX.writeFile(wb, 'Rayida_Tech_Abuja_Prospects_Template.csv');
    }
  };

  // 2. Parse uploaded file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setErrorMessage('');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const parsedRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
          defval: '',
        });

        if (parsedRows.length === 0) {
          setErrorMessage('The uploaded spreadsheet contains no data rows.');
          return;
        }

        // Extract headers
        const headers = Object.keys(parsedRows[0]);
        setSheetHeaders(headers);
        setRawRows(parsedRows);

        // Auto-detect and map columns intelligently
        const autoMapping: ColumnMapping = { business_name: '', email: '' };

        headers.forEach((h) => {
          const lh = h.toLowerCase().trim();
          if (lh.includes('business') || lh.includes('company') || lh.includes('brand') || lh === 'name') {
            if (!autoMapping.business_name) autoMapping.business_name = h;
          } else if (lh.includes('contact') || lh.includes('person') || lh.includes('owner')) {
            if (!autoMapping.contact_name) autoMapping.contact_name = h;
          } else if (lh.includes('email') || lh.includes('mail')) {
            if (!autoMapping.email) autoMapping.email = h;
          } else if (lh.includes('type') || lh.includes('industry') || lh.includes('category') || lh.includes('niche')) {
            if (!autoMapping.business_type) autoMapping.business_type = h;
          } else if (lh.includes('loc') || lh.includes('city') || lh.includes('address') || lh.includes('area')) {
            if (!autoMapping.location) autoMapping.location = h;
          } else if (lh.includes('web') || lh.includes('site') || lh.includes('url')) {
            if (!autoMapping.website) autoMapping.website = h;
          } else if (lh.includes('insta') || lh.includes('ig') || lh.includes('social')) {
            if (!autoMapping.instagram) autoMapping.instagram = h;
          } else if (lh.includes('phone') || lh.includes('mobile') || lh.includes('tel') || lh.includes('whatsapp')) {
            if (!autoMapping.phone) autoMapping.phone = h;
          } else if (lh.includes('note') || lh.includes('remark') || lh.includes('comment')) {
            if (!autoMapping.notes) autoMapping.notes = h;
          }
        });

        setMapping(autoMapping);
        setStep('mapping');
      } catch (err: unknown) {
        setErrorMessage(`Failed to read file: ${err instanceof Error ? err.message : String(err)}`);
      }
    };
    reader.readAsArrayBuffer(selected);
  };

  // 3. Move from Mapping to Preview
  const handleProceedToPreview = () => {
    if (!mapping.business_name) {
      setErrorMessage('Please map the Business Name column (required).');
      return;
    }
    setErrorMessage('');

    const seenEmails = new Set<string>();
    const previews: ImportPreviewRow[] = rawRows.map((row, idx) => {
      const bName = sanitizeCell(row[mapping.business_name]);
      const cName = mapping.contact_name ? sanitizeCell(row[mapping.contact_name]) : '';
      const email = mapping.email ? sanitizeCell(row[mapping.email]).toLowerCase() : '';
      const bType = mapping.business_type ? sanitizeCell(row[mapping.business_type]) : '';
      const loc = mapping.location ? sanitizeCell(row[mapping.location]) : '';
      const web = mapping.website ? sanitizeCell(row[mapping.website]) : '';
      const ig = mapping.instagram ? sanitizeCell(row[mapping.instagram]) : '';
      const phone = mapping.phone ? sanitizeCell(row[mapping.phone]) : '';
      const notes = mapping.notes ? sanitizeCell(row[mapping.notes]) : '';

      const hasMissingEmail = !email;
      const isValidEmail = !hasMissingEmail && isValidEmailAddress(email);
      let isDuplicateInFile = false;

      if (email) {
        if (seenEmails.has(email)) {
          isDuplicateInFile = true;
        } else {
          seenEmails.add(email);
        }
      }

      return {
        rowNumber: idx + 1,
        business_name: bName || 'Unnamed Business',
        contact_name: cName,
        email,
        business_type: bType,
        location: loc,
        website: web,
        instagram: ig,
        phone,
        notes,
        hasMissingEmail,
        isValidEmail,
        isDuplicateInFile,
        isDuplicateInDb: false,
        isSuppressed: false,
      };
    });

    setPreviewRows(previews);
    setStep('preview');
  };

  // 4. Execute final import
  const handleConfirmImport = () => {
    startTransition(async () => {
      const contactsToInsert: Partial<OutreachContact>[] = previewRows.map((r) => ({
        business_name: r.business_name,
        contact_name: r.contact_name || undefined,
        email: r.email || undefined,
        business_type: r.business_type || undefined,
        location: r.location || undefined,
        website: r.website || undefined,
        instagram: r.instagram || undefined,
        phone: r.phone || undefined,
        notes: r.notes || undefined,
      }));

      const res = await batchImportContacts(contactsToInsert);
      if (res.success) {
        setImportSummary({ inserted: res.inserted, skipped: res.skipped });
        setStep('completed');
        router.refresh();
      } else {
        setErrorMessage(res.error || 'Failed to complete batch import.');
      }
    });
  };

  const validCount = previewRows.filter((r) => r.isValidEmail && !r.isDuplicateInFile).length;
  const missingEmailCount = previewRows.filter((r) => r.hasMissingEmail).length;
  const invalidOrDuplicateCount = previewRows.filter((r) => (!r.isValidEmail && !r.hasMissingEmail) || r.isDuplicateInFile).length;

  return (
    <div>
      {/* Step Indicators */}
      <div className="flex items-center justify-between mb-8 max-w-2xl">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
            step === 'upload' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-emerald-500/20 text-emerald-400'
          }`}>
            {step !== 'upload' ? <Check className="w-4 h-4" /> : '1'}
          </div>
          <span className="text-xs font-medium text-paper">Upload File</span>
        </div>
        <div className="flex-1 h-[1px] bg-(--line) mx-3" />

        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
            step === 'mapping' ? 'bg-primary text-white shadow-md shadow-primary/20' : step === 'preview' || step === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-mist-2'
          }`}>
            {step === 'preview' || step === 'completed' ? <Check className="w-4 h-4" /> : '2'}
          </div>
          <span className="text-xs font-medium text-paper">Map Columns</span>
        </div>
        <div className="flex-1 h-[1px] bg-(--line) mx-3" />

        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
            step === 'preview' ? 'bg-primary text-white shadow-md shadow-primary/20' : step === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-mist-2'
          }`}>
            {step === 'completed' ? <Check className="w-4 h-4" /> : '3'}
          </div>
          <span className="text-xs font-medium text-paper">Validate &amp; Save</span>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP 1: UPLOAD */}
      {step === 'upload' && (
        <div className="space-y-6">
          <GlassCard className="p-8 sm:p-12 text-center border-2 border-dashed border-(--line) hover:border-primary/50 transition-colors">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".xlsx,.xls,.csv"
              className="hidden"
            />
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="font-display text-lg font-semibold text-paper mb-1">
              Select or Drag &amp; Drop Prospect Spreadsheet
            </h3>
            <p className="text-xs text-mist-2 max-w-md mx-auto mb-6">
              Supports Microsoft Excel (.xlsx, .xls) and CSV files. Auto-detects headers like Business Name, Contact Person, Email, Location, and Business Type.
            </p>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-lg shadow-primary/25 transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Browse Computer Files</span>
            </button>
          </GlassCard>

          {/* Downloadable Standard Templates */}
          <div className="p-6 rounded-2xl glass border border-(--line) flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-display text-sm font-semibold text-paper">
                Need a pre-formatted Abuja prospect template?
              </h4>
              <p className="text-xs text-mist-2">
                Download a ready-to-use template with sample businesses, types, locations, and notes.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => handleDownloadSample('xlsx')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-(--line) bg-white/5 hover:bg-white/10 text-xs font-medium text-paper transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-secondary" />
                <span>Excel (.xlsx)</span>
              </button>
              <button
                type="button"
                onClick={() => handleDownloadSample('csv')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-(--line) bg-white/5 hover:bg-white/10 text-xs font-medium text-paper transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-secondary" />
                <span>CSV Template</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: COLUMN MAPPING */}
      {step === 'mapping' && (
        <div className="space-y-6">
          <GlassCard className="p-6 sm:p-8 border border-(--line)">
            <div className="flex items-center justify-between pb-4 border-b border-(--line) mb-6">
              <div>
                <h3 className="font-display text-base font-semibold text-paper">
                  Map Spreadsheet Columns to Contact Fields
                </h3>
                <p className="text-xs text-mist-2 mt-0.5">
                  Confirm matching for your {rawRows.length} imported prospect row{rawRows.length === 1 ? '' : 's'}.
                </p>
              </div>
              <span className="text-xs font-mono-tight text-secondary">
                File: {file?.name}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {EXPECTED_FIELDS.map((f) => (
                <div key={f.key} className="p-3.5 rounded-xl bg-white/[0.02] border border-(--line)">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-paper flex items-center gap-1.5">
                      <span>{f.label}</span>
                      {f.required && <span className="text-primary font-bold">*</span>}
                    </label>
                    <span className="text-[10px] font-mono-tight text-mist-2">
                      {f.required ? 'Required' : 'Optional'}
                    </span>
                  </div>

                  <select
                    value={mapping[f.key] || ''}
                    onChange={(e) =>
                      setMapping((prev) => ({ ...prev, [f.key]: e.target.value }))
                    }
                    className="w-full bg-white/5 border border-(--line) rounded-lg px-3 py-2 text-xs text-paper focus:outline-none focus:border-primary/50"
                  >
                    <option value="" className="bg-ink text-mist-2">
                      -- Do not import this field --
                    </option>
                    {sheetHeaders.map((h) => (
                      <option key={h} value={h} className="bg-ink text-paper">
                        Column: &quot;{h}&quot;
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-(--line) mt-6">
              <button
                type="button"
                onClick={() => setStep('upload')}
                className="px-4 py-2 rounded-xl text-xs text-mist-2 hover:text-paper hover:bg-white/5 transition-colors cursor-pointer"
              >
                &larr; Choose Different File
              </button>

              <button
                type="button"
                onClick={handleProceedToPreview}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-md shadow-primary/25 transition-all cursor-pointer"
              >
                <span>Preview {rawRows.length} Records</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* STEP 3: PREVIEW & VALIDATION */}
      {step === 'preview' && (
        <div className="space-y-6">
          {/* Validation Metrics Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl glass border border-(--line)">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Ready for Campaigns</span>
              </div>
              <div className="font-display text-2xl font-bold text-paper">
                {validCount}
              </div>
              <p className="text-[11px] text-mist-2 mt-0.5">Valid email, ready for outreach.</p>
            </div>

            <div className="p-4 rounded-xl glass border border-(--line)">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-medium mb-1">
                <AlertCircle className="w-4 h-4" />
                <span>Missing Email</span>
              </div>
              <div className="font-display text-2xl font-bold text-rose-300">
                {missingEmailCount}
              </div>
              <p className="text-[11px] text-mist-2 mt-0.5">Saved to CRM, excluded from campaigns.</p>
            </div>

            <div className="p-4 rounded-xl glass border border-(--line)">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-medium mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span>Duplicates / Invalid</span>
              </div>
              <div className="font-display text-2xl font-bold text-amber-300">
                {invalidOrDuplicateCount}
              </div>
              <p className="text-[11px] text-mist-2 mt-0.5">Auto-deduplicated upon import.</p>
            </div>
          </div>

          {/* Table Preview */}
          <div className="glass rounded-xl overflow-hidden border border-(--line)">
            <div className="p-4 border-b border-(--line) flex items-center justify-between">
              <h4 className="font-display text-sm font-semibold text-paper">
                Record Preview (First {Math.min(previewRows.length, 50)} rows)
              </h4>
              <span className="text-xs text-mist-2 font-mono-tight">
                Total {previewRows.length} rows to process
              </span>
            </div>

            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-[var(--ink-deep)] border-b border-(--line)">
                  <tr>
                    <th className="px-3 py-2 text-left text-mist-2">#</th>
                    <th className="px-3 py-2 text-left text-mist-2">Business Name</th>
                    <th className="px-3 py-2 text-left text-mist-2">Contact Person</th>
                    <th className="px-3 py-2 text-left text-mist-2">Email</th>
                    <th className="px-3 py-2 text-left text-mist-2">Type</th>
                    <th className="px-3 py-2 text-left text-mist-2">Location</th>
                    <th className="px-3 py-2 text-center text-mist-2">Validation Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-(--line)">
                  {previewRows.slice(0, 50).map((r) => (
                    <tr key={r.rowNumber} className="hover:bg-white/[0.02]">
                      <td className="px-3 py-2 font-mono-tight text-mist-2">{r.rowNumber}</td>
                      <td className="px-3 py-2 font-medium text-paper">{r.business_name}</td>
                      <td className="px-3 py-2 text-mist-1">
                        {r.contact_name || <span className="italic text-mist-2">Fallback to business</span>}
                      </td>
                      <td className="px-3 py-2 font-mono-tight">
                        {r.email || <span className="text-rose-400 italic">No email</span>}
                      </td>
                      <td className="px-3 py-2 text-mist-1">{r.business_type || '—'}</td>
                      <td className="px-3 py-2 text-mist-1">{r.location || '—'}</td>
                      <td className="px-3 py-2 text-center">
                        {r.isValidEmail && !r.isDuplicateInFile && (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                            Valid
                          </span>
                        )}
                        {r.hasMissingEmail && (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-rose-500/15 text-rose-300 border border-rose-500/20">
                            Missing Email
                          </span>
                        )}
                        {r.isDuplicateInFile && (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-amber-500/15 text-amber-300 border border-amber-500/20">
                            Duplicate in File
                          </span>
                        )}
                        {!r.isValidEmail && !r.hasMissingEmail && (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-rose-500/15 text-rose-300 border border-rose-500/20">
                            Invalid Syntax
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep('mapping')}
              className="px-4 py-2 rounded-xl text-xs text-mist-2 hover:text-paper hover:bg-white/5 transition-colors cursor-pointer"
            >
              &larr; Adjust Mapping
            </button>

            <button
              type="button"
              disabled={isPending}
              onClick={handleConfirmImport}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-lg shadow-primary/25 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Importing Records...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Confirm &amp; Import {previewRows.length} Records</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: COMPLETED */}
      {step === 'completed' && importSummary && (
        <GlassCard className="p-8 sm:p-12 text-center border border-(--line) max-w-lg mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="font-display text-xl font-semibold text-paper mb-1">
            Import Completed Successfully!
          </h3>
          <p className="text-xs text-mist-1 mb-6">
            Your prospect database has been updated with {importSummary.inserted} new record{importSummary.inserted === 1 ? '' : 's'}.
            {importSummary.skipped > 0 && ` (${importSummary.skipped} duplicate or invalid entries skipped)`}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/admin/outreach/contacts"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-(--line) bg-white/5 hover:bg-white/10 text-xs font-medium text-paper transition-all"
            >
              View Prospect Database
            </Link>
            <Link
              href="/admin/outreach/campaigns/new"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold shadow-md shadow-primary/25 transition-all"
            >
              Launch Email Campaign &rarr;
            </Link>
          </div>
        </GlassCard>
      )}
    </div>
  );
}

