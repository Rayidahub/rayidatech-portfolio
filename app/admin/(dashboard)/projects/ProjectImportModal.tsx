'use client';

import { useState, useRef, useId } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';
import * as XLSX from 'xlsx';
import {
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  Loader2,
  Check,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import type { CaseStudy } from '@/types/project';
import { SERVICE_CATEGORIES } from '@/lib/data/services';
import { normalizeSlug } from '@/lib/slug';

/* ─────────────────────────────────────────────────────────────
   EXACT COLUMN HEADERS SPECIFIED BY USER
   ───────────────────────────────────────────────────────────── */

export const TEMPLATE_COLUMNS = [
  'Title *',
  'Slug *',
  'Description *',
  'Content (Markdown)',
  'Project Cover Image',
  'Role',
  'Duration',
  'Live Link',
  'Service Category *',
  'Additional Tags (comma-separated)',
  'Featured project',
  'Client / Business',
  'Objective',
  'Target Audience',
  'Overview Image URL',
  'Challenge',
  'Business Goals',
  'User Goals',
  'Problem Image URL',
  'Research & Strategy',
  'Research Image URL',
  'Design Process',
  'Design Process Image URL',
  'Design System',
  'Design System Image URL',
  'Final Solution',
  'Final Mobile Screens URL',
  'Final Desktop Screens URL',
  'Key Features (one per line)',
  'Key Features Image URL',
  'Results & Impact',
  'Results Image URL',
  'Reflection & Learnings',
  'Reflection Image URL',
  'Next Project Slug',
];

const SAMPLE_PROJECT_ROW: Record<string, string> = {
  'Title *': 'FlavorEase Mobile App',
  'Slug *': 'flavorease-mobile-app',
  'Description *': 'A modern food discovery and meal-planning mobile application designed to simplify cooking experiences.',
  'Content (Markdown)': '## Overview\n\nFlavorEase simplifies everyday cooking with intelligent recipe discovery and meal planning.',
  'Project Cover Image': 'https://rayidatech.wordpress.com/wp-content/uploads/2026/04/vertical-business-card-mockup.png',
  'Role': 'Lead Product Designer',
  'Duration': '4 Weeks',
  'Live Link': 'https://rayidatech.name.ng/projects/flavorease-mobile-food-discovery-app',
  'Service Category *': 'UI/UX Design',
  'Additional Tags (comma-separated)': 'Mobile App, FoodTech, Concept',
  'Featured project': 'Yes',
  'Client / Business': 'Concept Project',
  'Objective': 'Create an engaging and intuitive mobile experience that makes recipe discovery simple, enjoyable, and personalized.',
  'Target Audience': '🍽️ Food Enthusiasts looking to explore new recipes\n👨‍🍳 Home Cooks seeking simple meal preparation\n🎓 Students needing quick affordable recipes',
  'Overview Image URL': 'https://rayidatech.wordpress.com/wp-content/uploads/2026/04/post-1.png',
  'Challenge': 'Users experience difficulty finding relevant recipes, overwhelming food content online, and lack of personalized recommendations.',
  'Business Goals': 'Increase user engagement\nImprove recipe discovery\nEncourage daily app usage',
  'User Goals': 'Discover meals quickly\nSave favorite recipes\nPersonalized recommendations',
  'Problem Image URL': 'https://rayidatech.wordpress.com/wp-content/uploads/2026/04/vertical-business-card-mockup.png',
  'Research & Strategy': 'Fast recipe discovery, personalized content, easy navigation, and attractive food imagery.',
  'Research Image URL': 'https://rayidatech.wordpress.com/wp-content/uploads/2026/04/post-1.png',
  'Design Process': 'Home → Search → Recipe Details → Save Recipe',
  'Design Process Image URL': 'https://rayidatech.wordpress.com/wp-content/uploads/2026/04/vertical-business-card-mockup.png',
  'Design System': 'Primary: #FF6B35\nSecondary: #FFF4EE\nAccent: #2E2E2E\nHeading: Poppins Bold\nBody: Inter Regular',
  'Design System Image URL': 'https://rayidatech.wordpress.com/wp-content/uploads/2026/04/71081b3988fa1c62683288b844da1016.jpg',
  'Final Solution': 'Delivered a visually engaging and user-friendly mobile experience allowing users to explore recipes and save custom meal collections.',
  'Final Mobile Screens URL': 'https://rayidatech.wordpress.com/wp-content/uploads/2026/04/71081b3988fa1c62683288b844da1016.jpg',
  'Final Desktop Screens URL': 'https://rayidatech.wordpress.com/wp-content/uploads/2026/04/joy-copy-indalo-5.png',
  'Key Features (one per line)': 'Smart Search\nPersonalized Recommendations\nFavorites Collection\nTrending Recipes',
  'Key Features Image URL': 'https://rayidatech.wordpress.com/wp-content/uploads/2026/04/joy-copy-indalo-5.png',
  'Results & Impact': 'Improved content discoverability, faster navigation, and higher user satisfaction.',
  'Results Image URL': 'https://rayidatech.wordpress.com/wp-content/uploads/2026/04/joy-copy-indalo-5.png',
  'Reflection & Learnings': 'Balancing aesthetics with usability requires iterative testing and strong visual hierarchy.',
  'Reflection Image URL': 'https://rayidatech.wordpress.com/wp-content/uploads/2026/04/joy-copy-indalo-5.png',
  'Next Project Slug': 'another-project-slug',
};

/* ─────────────────────────────────────────────────────────────
   ROBUST HEADER MAPPING (Tolerates case variations & formatting)
   ───────────────────────────────────────────────────────────── */

const HEADER_NORMALIZE: Record<string, string> = {
  // Title
  title: 'title',
  'title *': 'title',
  'project title': 'title',

  // Slug
  slug: 'slug',
  'slug *': 'slug',
  'project slug': 'slug',

  // Description
  description: 'description',
  'description *': 'description',
  summary: 'description',

  // Content
  content: 'content',
  'content (markdown)': 'content',
  'markdown content': 'content',

  // Cover Image
  'project cover image': 'cover_image',
  'cover image': 'cover_image',
  cover_image: 'cover_image',
  image: 'cover_image',

  // Role
  role: 'role',
  'lead designer': 'role',

  // Duration
  duration: 'duration',
  timeline: 'duration',

  // Link
  'live link': 'link',
  link: 'link',
  url: 'link',

  // Service Category
  'service category': 'category',
  'service category *': 'category',
  category: 'category',

  // Tags
  'additional tags (comma-separated)': 'additional_tags',
  'additional tags': 'additional_tags',
  tags: 'additional_tags',

  // Featured
  'featured project': 'featured',
  featured: 'featured',

  // Case Study: Client
  'client / business': 'cs_client',
  client: 'cs_client',
  business: 'cs_client',

  // Objective
  objective: 'cs_objective',

  // Target Audience
  'target audience': 'cs_target_audience',
  audience: 'cs_target_audience',

  // Overview Image
  'overview image url': 'cs_overview_image',
  'overview image': 'cs_overview_image',
  overview_image: 'cs_overview_image',

  // Challenge / Problem
  challenge: 'cs_problem',
  problem: 'cs_problem',
  'the challenge': 'cs_problem',

  // Goals
  'business goals': 'cs_business_goals',
  business_goals: 'cs_business_goals',

  'user goals': 'cs_user_goals',
  user_goals: 'cs_user_goals',

  // Problem Image
  'problem image url': 'cs_problem_image',
  'problem image': 'cs_problem_image',
  problem_image: 'cs_problem_image',

  // Research
  'research & strategy': 'cs_research',
  research: 'cs_research',
  strategy: 'cs_research',

  'research image url': 'cs_research_image',
  'research image': 'cs_research_image',
  research_image: 'cs_research_image',

  // Design Process
  'design process': 'cs_design_process',
  design_process: 'cs_design_process',
  process: 'cs_design_process',

  'design process image url': 'cs_design_process_image',
  'design process image': 'cs_design_process_image',
  design_process_image: 'cs_design_process_image',

  // Design System
  'design system': 'cs_design_system',
  design_system: 'cs_design_system',

  'design system image url': 'cs_design_system_image',
  'design system image': 'cs_design_system_image',
  design_system_image: 'cs_design_system_image',

  // Final Solution
  'final solution': 'cs_final_solution',
  final_solution: 'cs_final_solution',
  solution: 'cs_final_solution',

  'final mobile screens url': 'cs_final_mobile_image',
  'final mobile image': 'cs_final_mobile_image',
  final_mobile_image: 'cs_final_mobile_image',
  'mobile screens url': 'cs_final_mobile_image',

  'final desktop screens url': 'cs_final_desktop_image',
  'final desktop image': 'cs_final_desktop_image',
  final_desktop_image: 'cs_final_desktop_image',
  'desktop screens url': 'cs_final_desktop_image',

  // Key Features
  'key features (one per line)': 'cs_key_features',
  'key features': 'cs_key_features',
  key_features: 'cs_key_features',
  features: 'cs_key_features',

  'key features image url': 'cs_key_features_image',
  'key features image': 'cs_key_features_image',
  key_features_image: 'cs_key_features_image',

  // Results
  'results & impact': 'cs_results',
  results: 'cs_results',
  impact: 'cs_results',

  'results image url': 'cs_results_image',
  'results image': 'cs_results_image',
  results_image: 'cs_results_image',

  // Reflection
  'reflection & learnings': 'cs_reflection',
  reflection: 'cs_reflection',
  learnings: 'cs_reflection',

  'reflection image url': 'cs_reflection_image',
  'reflection image': 'cs_reflection_image',
  reflection_image: 'cs_reflection_image',

  // Next Project
  'next project slug': 'cs_next_project_slug',
  next_project_slug: 'cs_next_project_slug',
};

interface ParsedProjectRow {
  rowIndex: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  cover_image: string | null;
  role: string | null;
  duration: string | null;
  link: string | null;
  featured: boolean;
  category: string;
  tags: string[];
  case_study: CaseStudy | null;
  status: 'valid' | 'warning' | 'error';
  message: string;
}

export default function ProjectImportModal() {
  const router = useRouter()
  const fileInputId = useId()
  const [isOpen, setIsOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState('')
  const [parsedRows, setParsedRows] = useState<ParsedProjectRow[]>([])
  const [parseError, setParseError] = useState('')
  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0 })
  const [importSummary, setImportSummary] = useState<{
    success: number
    updated: number
    errors: string[]
  } | null>(null)
  const [overwriteExisting, setOverwriteExisting] = useState(true)

  const fileInputRef = useRef<HTMLInputElement>(null)

  /* ─────────────────────────────────────────────────────────────
     DOWNLOAD TEMPLATE GENERATOR
     ───────────────────────────────────────────────────────────── */

  const downloadTemplate = (format: 'xlsx' | 'csv') => {
    try {
      const wb = XLSX.utils.book_new()
      const data = [TEMPLATE_COLUMNS, TEMPLATE_COLUMNS.map((col) => SAMPLE_PROJECT_ROW[col] || '')]
      const ws = XLSX.utils.aoa_to_sheet(data)

      // Set comfortable column widths for spreadsheet viewers
      ws['!cols'] = TEMPLATE_COLUMNS.map((col) => ({
        wch: Math.max(col.length + 4, 22),
      }))

      XLSX.utils.book_append_sheet(wb, ws, 'Projects Template')

      if (format === 'xlsx') {
        XLSX.writeFile(wb, 'rayidatech_projects_template.xlsx', { bookType: 'xlsx' })
      } else {
        XLSX.writeFile(wb, 'rayidatech_projects_template.csv', { bookType: 'csv' })
      }
    } catch (err: any) {
      alert('Failed to generate template: ' + (err?.message || err))
    }
  }

  /* ─────────────────────────────────────────────────────────────
     SLUG GENERATOR
     ───────────────────────────────────────────────────────────── */

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  /* ─────────────────────────────────────────────────────────────
     PROCESS SPREADSHEET FILE (CSV / XLSX / XLS)
     ───────────────────────────────────────────────────────────── */

  const handleFileProcess = async (file: File) => {
    setParseError('')
    setImportSummary(null)
    setFileName(file.name)

    const validExtensions = ['.csv', '.xlsx', '.xls']
    const hasValidExt = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))

    if (!hasValidExt) {
      setParseError('Please upload a valid .csv, .xlsx, or .xls spreadsheet file.')
      return
    }

    try {
      const buffer = await file.arrayBuffer()
      const wb = XLSX.read(buffer, { type: 'array' })

      if (!wb.SheetNames || wb.SheetNames.length === 0) {
        setParseError('The uploaded workbook contains no sheets.')
        return
      }

      const firstSheet = wb.Sheets[wb.SheetNames[0]]
      const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(firstSheet, { defval: '' })

      if (rawRows.length === 0) {
        setParseError('The uploaded spreadsheet is empty or has no data rows.')
        return
      }

      const parsed: ParsedProjectRow[] = []

      rawRows.forEach((row, idx) => {
        // Normalize headers
        const normalized: Record<string, string> = {}
        Object.entries(row).forEach(([rawKey, val]) => {
          const cleanKey = rawKey.trim().toLowerCase()
          const mappedKey = HEADER_NORMALIZE[cleanKey] || cleanKey
          normalized[mappedKey] = String(val ?? '').trim()
        })

        const title = normalized['title'] || ''
        let slug = normalized['slug'] ? normalizeSlug(normalized['slug']) : ''
        const description = normalized['description'] || ''
        const content = normalized['content'] || ''
        const cover_image = normalized['cover_image'] || null
        const role = normalized['role'] || null
        const duration = normalized['duration'] || null
        const link = normalized['link'] || null

        // Parse boolean featured
        const featuredRaw = normalized['featured']?.toLowerCase() || ''
        const featured = ['true', 'yes', '1', 'y'].includes(featuredRaw)

        // Parse category & tags
        let category = normalized['category'] || ''
        if (!category && SERVICE_CATEGORIES.length > 0) {
          category = SERVICE_CATEGORIES[0] // fallback to default category if omitted
        }

        const additionalTags = (normalized['additional_tags'] || '')
          .split(/[,;\n]/)
          .map((t) => t.trim())
          .filter(Boolean)

        const tags = category
          ? [category, ...additionalTags.filter((t) => t.toLowerCase() !== category.toLowerCase())]
          : additionalTags

        // Parse case study
        const cs: CaseStudy = {}
        if (normalized['cs_client']) cs.client = normalized['cs_client']
        if (normalized['cs_objective']) cs.objective = normalized['cs_objective']
        if (normalized['cs_target_audience']) cs.target_audience = normalized['cs_target_audience']
        if (normalized['cs_overview_image']) cs.overview_image = normalized['cs_overview_image']

        if (normalized['cs_problem']) cs.problem = normalized['cs_problem']
        if (normalized['cs_business_goals']) cs.business_goals = normalized['cs_business_goals']
        if (normalized['cs_user_goals']) cs.user_goals = normalized['cs_user_goals']
        if (normalized['cs_problem_image']) cs.problem_image = normalized['cs_problem_image']

        if (normalized['cs_research']) cs.research = normalized['cs_research']
        if (normalized['cs_research_image']) cs.research_image = normalized['cs_research_image']

        if (normalized['cs_design_process']) cs.design_process = normalized['cs_design_process']
        if (normalized['cs_design_process_image']) cs.design_process_image = normalized['cs_design_process_image']

        if (normalized['cs_design_system']) cs.design_system = normalized['cs_design_system']
        if (normalized['cs_design_system_image']) cs.design_system_image = normalized['cs_design_system_image']

        if (normalized['cs_final_solution']) cs.final_solution = normalized['cs_final_solution']
        if (normalized['cs_final_mobile_image']) cs.final_mobile_image = normalized['cs_final_mobile_image']
        if (normalized['cs_final_desktop_image']) cs.final_desktop_image = normalized['cs_final_desktop_image']

        if (normalized['cs_key_features']) {
          cs.key_features = normalized['cs_key_features']
            .split(/[\n;]/)
            .map((s) => s.trim())
            .filter(Boolean)
        }
        if (normalized['cs_key_features_image']) cs.key_features_image = normalized['cs_key_features_image']

        if (normalized['cs_results']) cs.results = normalized['cs_results']
        if (normalized['cs_results_image']) cs.results_image = normalized['cs_results_image']

        if (normalized['cs_reflection']) cs.reflection = normalized['cs_reflection']
        if (normalized['cs_reflection_image']) cs.reflection_image = normalized['cs_reflection_image']

        if (normalized['cs_next_project_slug']) cs.next_project_slug = normalized['cs_next_project_slug']

        const hasCaseStudy = Object.keys(cs).length > 0

        // Validation
        let status: 'valid' | 'warning' | 'error' = 'valid'
        let message = 'Ready to import'

        if (!title) {
          status = 'error'
          message = 'Missing required Title'
        } else if (!description) {
          status = 'error'
          message = 'Missing required Description'
        } else if (!slug) {
          slug = generateSlug(title)
          status = 'warning'
          message = `Slug auto-generated: "${slug}"`
        }

        parsed.push({
          rowIndex: idx + 2, // 1-based, taking header row into account
          title,
          slug,
          description,
          content,
          cover_image,
          role,
          duration,
          link,
          featured,
          category,
          tags,
          case_study: hasCaseStudy ? cs : null,
          status,
          message,
        })
      })

      setParsedRows(parsed)
    } catch (err: any) {
      setParseError('Failed to read spreadsheet file: ' + (err?.message || err))
    }
  }

  /* ─────────────────────────────────────────────────────────────
     DRAG & DROP HANDLERS
     ───────────────────────────────────────────────────────────── */

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0])
    }
  }

  /* ─────────────────────────────────────────────────────────────
     IMPORT EXECUTION INTO SUPABASE
     ───────────────────────────────────────────────────────────── */

  const executeImport = async () => {
    const validRows = parsedRows.filter((r) => r.status !== 'error')
    if (validRows.length === 0) {
      alert('No valid rows found to import.')
      return
    }

    setIsImporting(true)
    setImportProgress({ current: 0, total: validRows.length })

    const supabase = createClient()
    let successCount = 0
    let updatedCount = 0
    const errorsList: string[] = []

    for (let i = 0; i < validRows.length; i++) {
      const row = validRows[i]
      setImportProgress({ current: i + 1, total: validRows.length })

      try {
        // Check if project exists by slug
        const { data: existing } = await supabase
          .from('projects')
          .select('id, slug')
          .eq('slug', row.slug)
          .maybeSingle()

        const payload = {
          title: row.title,
          slug: row.slug,
          description: row.description,
          content: row.content || '',
          cover_image: row.cover_image,
          role: row.role,
          duration: row.duration,
          link: row.link,
          featured: row.featured,
          tags: row.tags.length > 0 ? row.tags : null,
          case_study: row.case_study,
        }

        if (existing) {
          if (overwriteExisting) {
            const { error: updateError } = await supabase
              .from('projects')
              .update(payload)
              .eq('id', existing.id)

            if (updateError) {
              errorsList.push(`Row ${row.rowIndex} (${row.title}): ${updateError.message}`)
            } else {
              updatedCount++
            }
          } else {
            // Suffix slug
            const newSlug = `${row.slug}-${Date.now().toString().slice(-4)}`
            const { error: insertError } = await supabase.from('projects').insert({
              ...payload,
              slug: newSlug,
            })

            if (insertError) {
              errorsList.push(`Row ${row.rowIndex} (${row.title}): ${insertError.message}`)
            } else {
              successCount++
            }
          }
        } else {
          // New insert
          const { error: insertError } = await supabase.from('projects').insert(payload)

          if (insertError) {
            errorsList.push(`Row ${row.rowIndex} (${row.title}): ${insertError.message}`)
          } else {
            successCount++
          }
        }
      } catch (err: any) {
        errorsList.push(`Row ${row.rowIndex} (${row.title}): ${err?.message || err}`)
      }
    }

    setIsImporting(false)
    setImportSummary({
      success: successCount,
      updated: updatedCount,
      errors: errorsList,
    })

    router.refresh()
  }

  const resetModal = () => {
    setFileName('')
    setParsedRows([])
    setParseError('')
    setImportSummary(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleClose = () => {
    resetModal()
    setIsOpen(false)
  }

  const validCount = parsedRows.filter((r) => r.status !== 'error').length
  const errorCount = parsedRows.filter((r) => r.status === 'error').length

  return (
    <>
      {/* ── Open Trigger Button ── */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-paper border border-(--line) hover:border-primary/40 rounded-lg px-3.5 py-2 text-sm font-medium transition-all cursor-pointer shadow-sm"
      >
        <FileSpreadsheet className="w-4 h-4 text-secondary" />
        <span>Import CSV / XLSX</span>
      </button>

      {/* ── Modal Dialog ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={handleClose}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl glass-strong border border-(--line) flex flex-col shadow-2xl bg-ink"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-(--line)">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-semibold text-paper">
                    Import Projects from Spreadsheet
                  </h2>
                  <p className="text-xs text-mist-2">
                    Upload new projects or batch update existing ones using CSV or Excel (.xlsx)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="p-2 text-mist-2 hover:text-paper hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* ── STEP 1: Download Templates Banner ── */}
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-paper font-medium text-sm">
                    <FileText className="w-4 h-4 text-secondary" />
                    <span>Need the official spreadsheet template?</span>
                  </div>
                  <p className="text-xs text-mist-1 max-w-xl">
                    Download our structured template containing all 35 project and case study columns with sample data so your upload remains 100% formatted.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => downloadTemplate('xlsx')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-medium transition-colors shadow-sm cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Excel (.xlsx)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadTemplate('csv')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass border border-(--line) hover:border-secondary/40 text-paper text-xs font-medium transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-secondary" />
                    <span>CSV (.csv)</span>
                  </button>
                </div>
              </div>

              {/* ── STEP 2: Dropzone ── */}
              {!fileName && (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 md:p-10 text-center transition-all cursor-pointer ${
                    isDragging
                      ? 'border-secondary bg-secondary/10'
                      : 'border-(--line) hover:border-primary/50 bg-white/[0.02]'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    id={fileInputId}
                    type="file"
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileProcess(e.target.files[0])
                      }
                    }}
                  />

                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-(--line) flex items-center justify-center text-secondary mx-auto mb-4">
                    <Upload className="w-6 h-6" />
                  </div>

                  <p className="text-sm font-medium text-paper mb-1">
                    Click to browse your device or drag & drop spreadsheet
                  </p>
                  <p className="text-xs text-mist-2">
                    Supports Microsoft Excel (.xlsx, .xls) and CSV (.csv)
                  </p>
                </div>
              )}

              {/* Parse Error Alert */}
              {parseError && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{parseError}</span>
                </div>
              )}

              {/* ── STEP 3: Preview Table & Results ── */}
              {parsedRows.length > 0 && !importSummary && (
                <div className="space-y-4">
                  {/* File Info Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl glass border border-(--line)">
                    <div className="flex items-center gap-2.5">
                      <FileSpreadsheet className="w-4 h-4 text-secondary" />
                      <span className="text-sm font-medium text-paper">{fileName}</span>
                      <span className="font-mono-tight text-xs text-mist-2">
                        ({parsedRows.length} {parsedRows.length === 1 ? 'row' : 'rows'})
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {validCount} ready
                      </span>
                      {errorCount > 0 && (
                        <span className="inline-flex items-center gap-1.5 text-xs text-red-400 font-medium">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errorCount} invalid
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={resetModal}
                        className="text-xs text-mist-2 hover:text-paper underline cursor-pointer ml-2"
                      >
                        Choose another file
                      </button>
                    </div>
                  </div>

                  {/* Overwrite Option Toggle */}
                  <label className="flex items-center gap-2.5 px-1 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={overwriteExisting}
                      onChange={(e) => setOverwriteExisting(e.target.checked)}
                      className="w-4 h-4 rounded border-(--line) bg-white/5 text-primary focus:ring-primary/30"
                    />
                    <span className="text-xs text-mist-1">
                      Update existing projects if a matching slug already exists in the database
                    </span>
                  </label>

                  {/* Preview Table */}
                  <div className="border border-(--line) rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-white/5 border-b border-(--line) sticky top-0">
                        <tr>
                          <th className="text-left text-mist-2 font-medium px-3 py-2.5">Row</th>
                          <th className="text-left text-mist-2 font-medium px-3 py-2.5">Status</th>
                          <th className="text-left text-mist-2 font-medium px-3 py-2.5">Title</th>
                          <th className="text-left text-mist-2 font-medium px-3 py-2.5">Slug</th>
                          <th className="text-left text-mist-2 font-medium px-3 py-2.5">Category</th>
                          <th className="text-center text-mist-2 font-medium px-3 py-2.5">Case Study</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-(--line)">
                        {parsedRows.map((row) => (
                          <tr key={row.rowIndex} className="hover:bg-white/[0.02]">
                            <td className="px-3 py-2 font-mono-tight text-mist-2">{row.rowIndex}</td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              {row.status === 'valid' && (
                                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                                  <Check className="w-3 h-3" /> Ready
                                </span>
                              )}
                              {row.status === 'warning' && (
                                <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-medium" title={row.message}>
                                  <HelpCircle className="w-3 h-3" /> Notice
                                </span>
                              )}
                              {row.status === 'error' && (
                                <span className="inline-flex items-center gap-1 text-[11px] text-red-400 font-medium" title={row.message}>
                                  <AlertCircle className="w-3 h-3" /> {row.message}
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-2 font-medium text-paper truncate max-w-[160px]">
                              {row.title || '—'}
                            </td>
                            <td className="px-3 py-2 font-mono-tight text-mist-1 truncate max-w-[140px]">
                              {row.slug || '—'}
                            </td>
                            <td className="px-3 py-2 text-mist-1 whitespace-nowrap">
                              {row.category || '—'}
                            </td>
                            <td className="px-3 py-2 text-center text-mist-2">
                              {row.case_study ? (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                                  Included
                                </span>
                              ) : (
                                '—'
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── STEP 4: Import Summary & Success ── */}
              {importSummary && (
                <div className="p-6 rounded-2xl glass border border-(--line) space-y-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-paper">
                      Spreadsheet Import Completed
                    </h3>
                    <p className="text-xs text-mist-1 mt-1">
                      {importSummary.success} new projects created, {importSummary.updated} existing projects updated.
                    </p>
                  </div>

                  {importSummary.errors.length > 0 && (
                    <div className="text-left p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs space-y-1 max-h-32 overflow-y-auto">
                      <p className="font-semibold">Some rows encountered errors:</p>
                      {importSummary.errors.map((err, i) => (
                        <p key={i}>• {err}</p>
                      ))}
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="btn-glow px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-medium cursor-pointer"
                    >
                      Done & Close
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            {!importSummary && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-(--line) bg-white/[0.01]">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-xs font-medium text-mist-2 hover:text-paper transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-3">
                  {isImporting ? (
                    <div className="inline-flex items-center gap-2 text-xs text-secondary font-mono-tight">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>
                        Importing {importProgress.current} of {importProgress.total}...
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={validCount === 0 || isImporting}
                      onClick={executeImport}
                      className="btn-glow inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-medium hover:brightness-110 transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-primary/25"
                    >
                      <span>Import {validCount} {validCount === 1 ? 'Project' : 'Projects'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
