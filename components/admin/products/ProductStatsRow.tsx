import { Boxes, Rocket, Sparkles, CheckCircle2 } from 'lucide-react';
import type { EcosystemProduct } from '@/types/ecosystem-product';
import { calculateProductStats } from '@/lib/products';

interface ProductStatsRowProps {
  products: EcosystemProduct[];
}

export default function ProductStatsRow({ products }: ProductStatsRowProps) {
  const stats = calculateProductStats(products);

  const cards = [
    {
      label: 'Total Products',
      value: stats.total,
      sub: 'Ecosystem catalog',
      icon: Boxes,
      color: 'text-secondary',
      bg: 'bg-secondary/10',
      border: 'border-secondary/20',
    },
    {
      label: 'Live in Market',
      value: stats.live,
      sub: 'Publicly released',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    },
    {
      label: 'Coming Soon',
      value: stats.comingSoon,
      sub: 'In flight & roadmapped',
      icon: Rocket,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
    },
    {
      label: 'Active in Showcase',
      value: stats.active,
      sub: 'Visible on /products',
      icon: Sparkles,
      color: 'text-primary',
      bg: 'bg-primary/10',
      border: 'border-primary/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className="glass rounded-xl p-4 border border-(--line) flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-mono-tight text-mist-2 uppercase tracking-wider">{c.label}</p>
              <p className="text-2xl font-bold text-paper font-display mt-0.5">{c.value}</p>
              <p className="text-[11px] text-mist-1 mt-0.5">{c.sub}</p>
            </div>
            <div className={`p-3 rounded-xl border ${c.bg} ${c.border} ${c.color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
