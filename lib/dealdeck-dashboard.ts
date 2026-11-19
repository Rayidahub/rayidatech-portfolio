// lib/dealdeck-dashboard.ts
// DealDeck Modern White Admin Dashboard Architecture & Visual Calculations
// Powers the light-mode DealDeck aesthetic with clean data models and SVG helpers.

export interface DealDeckStatMetric {
  id: string;
  title: string;
  value: string;
  numericValue: number;
  changePercent: string;
  isPositive: boolean;
  subtitle: string;
  iconType: 'document' | 'package' | 'users' | 'truck' | 'sparkles' | 'activity';
}

export interface MonthlyHabitBar {
  month: string;
  seenProducts: number;
  sales: number;
}

export interface ProductStatisticItem {
  id: string;
  name: string;
  count: string;
  numericCount: number;
  changePercent: string;
  isPositive: boolean;
  iconName: string;
}

export interface GeographicGrowthItem {
  id: string;
  country: string;
  flag: string;
  visitors: string;
  numericVisitors: number;
  bubbleColor: string;
}

export const DEALDECK_THEME_TOKENS = {
  canvasBackground: '#f4f5f9',
  cardBackground: '#ffffff',
  primaryBlue: '#3b5bfa',
  primaryBlueHover: '#2f49d1',
  darkContainer: '#0f172a',
  textPrimary: '#0f172a',
  textSecondary: '#475569',
  textMuted: '#94a3b8',
  borderLight: '#e2e8f0',
  pillGreenBg: '#ecfdf5',
  pillGreenText: '#059669',
  pillRedBg: '#fef2f2',
  pillRedText: '#dc2626',
} as const;

/**
 * Formats numbers into DealDeck European/Dot format (e.g., 34760 -> "34.760")
 */
export function formatDealDeckNumber(num: number): string {
  if (isNaN(num)) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Calculates percentage height for bar charts based on max scale
 */
export function calculateBarHeight(value: number, maxValue = 60000): number {
  if (maxValue <= 0) return 0;
  const ratio = (value / maxValue) * 100;
  return Math.min(100, Math.max(8, Math.round(ratio)));
}

/**
 * Returns Tailwind class string for DealDeck percentage change pills
 */
export function getDealDeckPillClass(isPositive: boolean): string {
  if (isPositive) {
    return 'bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-semibold px-2.5 py-0.5 rounded-full';
  }
  return 'bg-rose-50 text-rose-500 border border-rose-100 text-xs font-semibold px-2.5 py-0.5 rounded-full';
}

/**
 * Computes SVG stroke-dasharray for concentric circular progress rings
 */
export function calculateRingCircumference(radius: number): number {
  return 2 * Math.PI * radius;
}

export function calculateRingOffset(radius: number, percent: number): number {
  const c = calculateRingCircumference(radius);
  const clamped = Math.min(100, Math.max(0, percent));
  return c - (clamped / 100) * c;
}

/**
 * Default monthly habit activity dataset matching DealDeck visual bars (Jan - Jul)
 */
export const DEFAULT_MONTHLY_HABITS: MonthlyHabitBar[] = [
  { month: 'Jan', seenProducts: 24000, sales: 18000 },
  { month: 'Feb', seenProducts: 48000, sales: 38000 },
  { month: 'Mar', seenProducts: 36000, sales: 26000 },
  { month: 'Apr', seenProducts: 43787, sales: 39784 }, // Feature tooltip point
  { month: 'May', seenProducts: 32000, sales: 22000 },
  { month: 'Jun', seenProducts: 40000, sales: 31000 },
  { month: 'Jul', seenProducts: 46000, sales: 37000 },
];

/**
 * Default geographic visitor distribution dataset matching DealDeck bubbles
 */
export const DEFAULT_GEOGRAPHIC_GROWTH: GeographicGrowthItem[] = [
  {
    id: 'geo-1',
    country: 'United States',
    flag: '🇺🇸',
    visitors: '2.417',
    numericVisitors: 2417,
    bubbleColor: '#3b5bfa',
  },
  {
    id: 'geo-2',
    country: 'Germany',
    flag: '🇩🇪',
    visitors: '2.281',
    numericVisitors: 2281,
    bubbleColor: '#4f6ef7',
  },
  {
    id: 'geo-3',
    country: 'Australia',
    flag: '🇦🇺',
    visitors: '812',
    numericVisitors: 812,
    bubbleColor: '#758ef8',
  },
  {
    id: 'geo-4',
    country: 'France',
    flag: '🇫🇷',
    visitors: '287',
    numericVisitors: 287,
    bubbleColor: '#9bb0fa',
  },
];
