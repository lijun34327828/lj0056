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
  province: string;
  city: string;
  latitude: number;
  longitude: number;
  lastBookingDate: string | null;
  lastRentalDate: string | null;
  idleDays: number;
  level: 'normal' | 'warning' | 'danger';
}

export interface IdleWarning {
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
  idleWarnings: IdleWarning[];
  generatedAt: string;
}

export const SEASONS: Season[] = ['spring', 'summer', 'autumn', 'winter'];
