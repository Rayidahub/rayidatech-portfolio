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
