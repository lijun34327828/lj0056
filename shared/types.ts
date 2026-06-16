export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

export interface ObservationPoint {
  id: string
  name: string
  province: string
  city: string
  latitude: number
  longitude: number
  altitude: number
  telescopes: Telescope[]
  bookings: Booking[]
}

export interface Telescope {
  id: string
  name: string
  model: string
  aperture: number
  focalLength: number
  rentalRecords: RentalRecord[]
}

export interface Booking {
  id: string
  pointId: string
  userId: string
  userName: string
  startDate: string
  endDate: string
  status: 'confirmed' | 'completed' | 'cancelled'
  guests: number
}

export interface RentalRecord {
  id: string
  telescopeId: string
  pointId: string
  userId: string
  userName: string
  startDate: string
  endDate: string
  price: number
  status: 'confirmed' | 'completed' | 'cancelled'
}

export interface KPIData {
  totalReservations: number
  totalVisitors: number
  equipmentUsageRate: number
  activePoints: number
  totalPoints: number
  seasonBreakdown: Record<Season, { reservations: number; visitors: number }>
}

export interface HeatmapPoint {
  id: string
  name: string
  value: [number, number, number]
  province: string
  seasonData: Record<Season, number>
  lastActiveDate: string
}

export interface TrendData {
  months: string[]
  seasons: Record<Season, number[]>
}

export interface TelescopeItem {
  name: string
  count: number
  percentage: number
  color: string
}

export type IdleLevel = 'normal' | 'warning' | 'danger'

export interface IdlePoint {
  id: string
  name: string
  province: string
  city: string
  latitude: number
  longitude: number
  lastBookingDate: string | null
  lastRentalDate: string | null
  idleDays: number
  level: IdleLevel
}

export interface IdleWarning {
  id: string
  name: string
  location: string
  idleDays: number
  lastReservation: string
  suggestion: string
  severity: 'warning' | 'danger'
}

export interface AggregateResponse {
  kpi: KPIData
  heatmap: HeatmapPoint[]
  trend: TrendData
  telescope: TelescopeItem[]
  idleWarnings: IdleWarning[]
  generatedAt: string
}
