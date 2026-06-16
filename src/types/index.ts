export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export interface KPIData {
  totalReservations: number;
  totalVisitors: number;
  equipmentUsageRate: number;
  activePoints: number;
  totalPoints: number;
  seasonBreakdown: Record<Season, { reservations: number; visitors: number }>;
}

export interface HeatmapPoint {
  id: string;
  name: string;
  value: [number, number, number];
  province: string;
  seasonData: Record<Season, number>;
  lastActiveDate: string;
}

export interface TrendData {
  months: string[];
  seasons: Record<Season, number[]>;
}

export interface TelescopeItem {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface IdlePoint {
  id: string;
  name: string;
  location: string;
  idleDays: number;
  lastReservation: string;
  suggestion: string;
  severity: 'warning' | 'danger';
}

export interface AggregateResponse {
  kpi: KPIData;
  heatmap: HeatmapPoint[];
  trend: TrendData;
  telescope: TelescopeItem[];
  idleWarnings: IdlePoint[];
  generatedAt: string;
}

export const SEASONS: Season[] = ['spring', 'summer', 'autumn', 'winter'];

export const SEASON_LABELS: Record<Season, string> = {
  spring: '春',
  summer: '夏',
  autumn: '秋',
  winter: '冬',
};

export const SEASON_ICONS: Record<Season, string> = {
  spring: '🌸',
  summer: '☀️',
  autumn: '🍂',
  winter: '❄️',
};

export const SEASON_COLORS: Record<Season, string> = {
  spring: '#52C41A',
  summer: '#FA8C16',
  autumn: '#EB2F96',
  winter: '#1890FF',
};
