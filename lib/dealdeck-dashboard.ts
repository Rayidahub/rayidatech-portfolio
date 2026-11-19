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

