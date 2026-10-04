import { createElement } from 'react';
import {
  Palette,
  Package,
  Fingerprint,
  Image,
  Monitor,
  GraduationCap,
  Megaphone,
  Code,
  Smartphone,
  Globe,
  Bot,
  Cpu,
  Sparkles,
  Layers,
  ShieldCheck,
  Zap,
  BarChart,
  Compass,
  Briefcase,
  Server,
  Database,
  Workflow,
  type LucideIcon,
} from 'lucide-react';

export const AVAILABLE_SERVICE_ICONS: { name: string; label: string; icon: LucideIcon }[] = [
  { name: 'Palette', label: 'Palette (Design / UI)', icon: Palette },
  { name: 'Package', label: 'Package (Product / Box)', icon: Package },
  { name: 'Fingerprint', label: 'Fingerprint (Identity / Brand)', icon: Fingerprint },
  { name: 'Image', label: 'Image (Graphics / Visuals)', icon: Image },
  { name: 'Monitor', label: 'Monitor (Web / Frontend)', icon: Monitor },
  { name: 'Code', label: 'Code (Engineering / Dev)', icon: Code },
  { name: 'Smartphone', label: 'Smartphone (Mobile / App)', icon: Smartphone },
  { name: 'Globe', label: 'Globe (Web / Worldwide)', icon: Globe },
  { name: 'Bot', label: 'Bot (AI / Automation)', icon: Bot },
  { name: 'Cpu', label: 'CPU (Tech / AI Systems)', icon: Cpu },
  { name: 'Sparkles', label: 'Sparkles (Innovation / Magic)', icon: Sparkles },
  { name: 'Layers', label: 'Layers (Architecture / Fullstack)', icon: Layers },
  { name: 'GraduationCap', label: 'Graduation Cap (Education / Training)', icon: GraduationCap },
  { name: 'Megaphone', label: 'Megaphone (Marketing / Social)', icon: Megaphone },
  { name: 'ShieldCheck', label: 'Shield Check (Security / Trust)', icon: ShieldCheck },
  { name: 'Zap', label: 'Zap (Performance / Speed)', icon: Zap },
  { name: 'BarChart', label: 'Bar Chart (Analytics / Growth)', icon: BarChart },
  { name: 'Compass', label: 'Compass (Strategy / Direction)', icon: Compass },
  { name: 'Briefcase', label: 'Briefcase (Business / Consulting)', icon: Briefcase },
  { name: 'Server', label: 'Server (Backend / Cloud)', icon: Server },
  { name: 'Database', label: 'Database (Data / SQL)', icon: Database },
  { name: 'Workflow', label: 'Workflow (Processes / Systems)', icon: Workflow },
];

const iconMap: Record<string, LucideIcon> = {
  Palette,
  Package,
  Fingerprint,
  Image,
  Monitor,
  GraduationCap,
  Megaphone,
  Code,
  Smartphone,
  Globe,
  Bot,
  Cpu,
  Sparkles,
  Layers,
  ShieldCheck,
  Zap,
  BarChart,
  Compass,
  Briefcase,
  Server,
  Database,
  Workflow,
};

export function getServiceIcon(name: string): LucideIcon {
  return iconMap[name] || Palette;
}

export function ServiceIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return createElement(getServiceIcon(name), { className });
}
