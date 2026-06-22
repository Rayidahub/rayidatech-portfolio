import {
  Palette,
  Package,
  Fingerprint,
  Image,
  Monitor,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Palette,
  Package,
  Fingerprint,
  Image,
  Monitor,
  GraduationCap,
};

export function getServiceIcon(name: string): LucideIcon {
  return iconMap[name] || Palette;
}
