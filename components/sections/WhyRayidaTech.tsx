import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import { Shield, Users, Target, Lightbulb, type LucideIcon } from 'lucide-react';

const values: Array<{
  icon: LucideIcon;
  title: string;
  description: string;
}> = [
  {
    icon: Shield,
    title: 'Trust-Driven',
    description: 'We build solutions people can rely on.',
  },
  {
    icon: Users,
    title: 'User-Centered',
    description: 'Every design starts with real user needs.',
  },
  {
    icon: Target,
    title: 'Results-Focused',
    description: "We don't just design — we deliver impact.",
  },
  {
    icon: Lightbulb,
    title: 'Innovative',
    description: 'Modern tools, fresh thinking, practical solutions.',
  },
];

function GraphNode({
  icon: Icon,
  featured = false,
}: {
  icon: LucideIcon;
  featured?: boolean;
}) {
  return (
    <div
      className={`rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
        featured
          ? 'w-20 h-20 bg-gradient-to-br from-primary to-secondary text-paper shadow-xl shadow-primary/25'
          : 'w-12 h-12 glass border border-(--line) text-secondary shadow-lg shadow-primary/10'
      }`}
    >
      <Icon
        className={featured ? 'w-8 h-8' : 'w-5 h-5'}
        aria-hidden="true"
      />
    </div>
  );
}

function GraphLabel({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="w-44 text-center">
      <h3 className="font-display text-base font-semibold mb-1 text-paper group-hover:text-secondary transition-colors duration-300">
        {title}
      </h3>
      <p className="text-xs text-mist-1 leading-relaxed">{description}</p>
    </div>
  );
}

const desktopPoints = [
  { x: 12.5, y: 25 },
  { x: 37.5, y: 75 },
  { x: 62.5, y: 25 },
  { x: 87.5, y: 75 },
];

const mobilePoints = [
  { x: 25, y: 12 },
  { x: 75, y: 32 },
  { x: 25, y: 52 },
  { x: 75, y: 72 },
];

export default function WhyRayidaTech() {
  return (
    <Section>
      <Container size="default">
        <Reveal>
          <div className="text-center mb-16 md:mb-20">
            <p className="font-mono-tight text-xs uppercase tracking-[0.25em] text-secondary mb-3">
              Trust builds technology
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold">
              Why Work With{' '}
              <span className="gradient-text">Us?</span>
            </h2>
          </div>
        </Reveal>

        {/* Desktop: graph / line chart */}
        <div className="hidden lg:block relative h-[26rem]">
          {/* Graph grid, axis, stems and connecting line */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="graphLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8000ff" />
                <stop offset="100%" stopColor="#00d1ff" />
              </linearGradient>
            </defs>

            {/* Horizontal grid lines */}
            {[20, 40, 60, 80].map((y) => (
              <line
                key={`h-${y}`}
                x1="0"
                y1={y}
                x2="100"
                y2={y}
                stroke="rgba(242, 242, 242, 0.04)"
                strokeWidth="0.25"
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {/* Vertical grid lines */}
            {[12.5, 37.5, 62.5, 87.5].map((x) => (
              <line
                key={`v-${x}`}
                x1={x}
                y1="0"
                x2={x}
                y2="100"
                stroke="rgba(242, 242, 242, 0.04)"
                strokeWidth="0.25"
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {/* X-axis */}
            <line
              x1="0"
              y1="50"
              x2="100"
              y2="50"
              stroke="rgba(242, 242, 242, 0.14)"
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
            />

            {/* Stems from each node to the axis */}
            {desktopPoints.map((p) => (
              <line
                key={`stem-${p.x}`}
                x1={p.x}
                y1={p.y}
                x2={p.x}
                y2="50"
                stroke="rgba(242, 242, 242, 0.12)"
                strokeWidth="0.5"
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {/* Connecting line */}
            <polyline
              points="12.5,25 37.5,75 62.5,25 87.5,75"
              fill="none"
              stroke="url(#graphLine)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* Axis labels */}
          <span className="absolute left-0 top-[calc(50%+0.75rem)] font-mono-tight text-[10px] uppercase tracking-widest text-mist-2">
            Start
          </span>
          <span className="absolute right-0 top-[calc(50%+0.75rem)] font-mono-tight text-[10px] uppercase tracking-widest text-mist-2">
            Outcome
          </span>

          {/* Nodes and labels */}
          {values.map((item, index) => {
            const { x, y } = desktopPoints[index];
            const isLast = index === values.length - 1;
            const labelY = y < 50 ? 65 : 35;

            return (
              <Reveal key={item.title} index={index}>
                <div
                  className="absolute -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <GraphNode icon={item.icon} featured={isLast} />
                </div>
                <div
                  className="absolute -translate-x-1/2 group"
                  style={{ left: `${x}%`, top: `${labelY}%` }}
                >
                  <GraphLabel
                    title={item.title}
                    description={item.description}
                  />
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Mobile / tablet: vertical graph */}
        <div className="lg:hidden relative h-[38rem]">
          {/* Graph grid, axis, stems and connecting line */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id="graphLineMobile"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#8000ff" />
                <stop offset="100%" stopColor="#00d1ff" />
              </linearGradient>
            </defs>

            {/* Vertical grid lines */}
            {[20, 40, 60, 80].map((x) => (
              <line
                key={`mv-${x}`}
                x1={x}
                y1="0"
                x2={x}
                y2="100"
                stroke="rgba(242, 242, 242, 0.04)"
                strokeWidth="0.25"
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {/* Horizontal grid lines */}
            {[12, 32, 52, 72].map((y) => (
              <line
                key={`mh-${y}`}
                x1="0"
                y1={y}
                x2="100"
                y2={y}
                stroke="rgba(242, 242, 242, 0.04)"
                strokeWidth="0.25"
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {/* Y-axis */}
            <line
              x1="50"
              y1="0"
              x2="50"
              y2="100"
              stroke="rgba(242, 242, 242, 0.14)"
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
            />

            {/* Stems from each node to the axis */}
            {mobilePoints.map((p) => (
              <line
                key={`mstem-${p.y}`}
                x1={p.x}
                y1={p.y}
                x2="50"
                y2={p.y}
                stroke="rgba(242, 242, 242, 0.12)"
                strokeWidth="0.5"
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {/* Connecting line */}
            <polyline
              points="25,12 75,32 25,52 75,72"
              fill="none"
              stroke="url(#graphLineMobile)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* Nodes and labels */}
          {values.map((item, index) => {
            const { x, y } = mobilePoints[index];
            const isLast = index === values.length - 1;
            const labelX = x < 50 ? 68 : 32;

            return (
              <Reveal key={item.title} index={index}>
                <div
                  className="absolute -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <GraphNode icon={item.icon} featured={isLast} />
                </div>
                <div
                  className="absolute -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${labelX}%`, top: `${y}%` }}
                >
                  <div className="w-36 text-center">
                    <h3 className="font-display text-base font-semibold mb-1 text-paper group-hover:text-secondary transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-xs text-mist-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
