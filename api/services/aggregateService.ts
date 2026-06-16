import type {
  Season,
  AggregateResponse,
  KPIData,
  HeatmapPoint,
  TrendData,
  TelescopeItem,
  IdleWarning,
  ObservationPoint,
  Booking,
  RentalRecord,
} from '../../shared/types.js'
import dataRepository from './dataRepository.js'
import { detectAllIdlePoints } from './idleDetector.js'

const SEASONS: Season[] = ['spring', 'summer', 'autumn', 'winter']

const TELESCOPE_COLORS: Record<string, string> = {
  '折射式': '#1890FF',
  '反射式': '#52C41A',
  '折反射式': '#FAAD14',
  '射电式': '#EB2F96',
  '其他': '#722ED1',
}

function getSeasonFromMonth(month: number): Season {
  if (month >= 3 && month <= 5) return 'spring'
  if (month >= 6 && month <= 8) return 'summer'
  if (month >= 9 && month <= 11) return 'autumn'
  return 'winter'
}

function getMonthFromDate(dateStr: string): number {
  return parseInt(dateStr.split('-')[1], 10)
}

function parseDate(dateStr: string): Date {
  return new Date(dateStr)
}

function daysBetween(from: Date, to: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24
  return Math.floor((to.getTime() - from.getTime()) / msPerDay)
}

function getAllRentals(points: ObservationPoint[]): RentalRecord[] {
  const rentals: RentalRecord[] = []
  for (const p of points) {
    for (const t of p.telescopes) {
      rentals.push(...t.rentalRecords)
    }
  }
  return rentals
}

function filterBookingsBySeasons(bookings: Booking[], seasons: Season[] | 'all'): Booking[] {
  if (seasons === 'all') return bookings
  return bookings.filter((b) => {
    const month = getMonthFromDate(b.startDate)
    return seasons.includes(getSeasonFromMonth(month))
  })
}

function filterRentalsBySeasons(rentals: RentalRecord[], seasons: Season[] | 'all'): RentalRecord[] {
  if (seasons === 'all') return rentals
  return rentals.filter((r) => {
    const month = getMonthFromDate(r.startDate)
    return seasons.includes(getSeasonFromMonth(month))
  })
}

function parseSeasonsParam(season: string | Season[]): Season[] | 'all' {
  if (season === 'all' || !season) return 'all'
  if (Array.isArray(season)) {
    return season.filter((s) => SEASONS.includes(s))
  }
  if (typeof season === 'string') {
    const parts = season.split(',').map((s) => s.trim() as Season)
    const filtered = parts.filter((s) => SEASONS.includes(s))
    if (filtered.length === 0) return 'all'
    return filtered
  }
  return 'all'
}

function buildKPIData(
  points: ObservationPoint[],
  seasons: Season[] | 'all',
): KPIData {
  const allBookings = points.flatMap((p) => filterBookingsBySeasons(p.bookings, seasons))
  const allRentals = filterRentalsBySeasons(getAllRentals(points), seasons)

  const validBookings = allBookings.filter((b) => b.status !== 'cancelled')
  const validRentals = allRentals.filter((r) => r.status !== 'cancelled')

  const totalReservations = validBookings.length
  const totalVisitors = validBookings.reduce((sum, b) => sum + b.guests, 0)
  const totalPoints = points.length

  const activePointIds = new Set<string>()
  for (const b of validBookings) activePointIds.add(b.pointId)
  for (const r of validRentals) activePointIds.add(r.pointId)
  const activePoints = activePointIds.size

  let usedDays = 0
  const DAYS_IN_PERIOD = seasons === 'all' ? 365 : seasons.length * 91
  const totalTelescopeDays = points.reduce((sum, p) => sum + p.telescopes.length, 0) * DAYS_IN_PERIOD

  for (const r of validRentals) {
    const start = parseDate(r.startDate)
    const end = parseDate(r.endDate)
    usedDays += Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  }
  const equipmentUsageRate = totalTelescopeDays > 0 ? Math.round((usedDays / totalTelescopeDays) * 10000) / 100 : 0

  const seasonBreakdown: Record<Season, { reservations: number; visitors: number }> = {
    spring: { reservations: 0, visitors: 0 },
    summer: { reservations: 0, visitors: 0 },
    autumn: { reservations: 0, visitors: 0 },
    winter: { reservations: 0, visitors: 0 },
  }

  for (const b of validBookings) {
    const month = getMonthFromDate(b.startDate)
    const s = getSeasonFromMonth(month)
    seasonBreakdown[s].reservations++
    seasonBreakdown[s].visitors += b.guests
  }

  return {
    totalReservations,
    totalVisitors,
    equipmentUsageRate,
    activePoints,
    totalPoints,
    seasonBreakdown,
  }
}

function buildHeatmap(
  points: ObservationPoint[],
  seasons: Season[] | 'all',
): HeatmapPoint[] {
  return points.map((p) => {
    const bookings = filterBookingsBySeasons(p.bookings, seasons)
    const rentals = filterRentalsBySeasons(
      p.telescopes.flatMap((t) => t.rentalRecords),
      seasons,
    )
    const validBookings = bookings.filter((b) => b.status !== 'cancelled')
    const validRentals = rentals.filter((r) => r.status !== 'cancelled')
    const heatValue = validBookings.length * 2 + validRentals.length

    const seasonData: Record<Season, number> = {
      spring: 0,
      summer: 0,
      autumn: 0,
      winter: 0,
    }

    for (const b of validBookings) {
      const month = getMonthFromDate(b.startDate)
      const s = getSeasonFromMonth(month)
      seasonData[s] += b.guests
    }
    for (const r of validRentals) {
      const month = getMonthFromDate(r.startDate)
      const s = getSeasonFromMonth(month)
      seasonData[s]++
    }

    const allDates: Date[] = []
    for (const b of p.bookings) {
      if (b.status !== 'cancelled') allDates.push(parseDate(b.endDate))
    }
    for (const t of p.telescopes) {
      for (const r of t.rentalRecords) {
        if (r.status !== 'cancelled') allDates.push(parseDate(r.endDate))
      }
    }

    let lastActiveDate = '无'
    if (allDates.length > 0) {
      const maxDate = allDates.reduce((max, d) => (d.getTime() > max.getTime() ? d : max))
      lastActiveDate = maxDate.toISOString().split('T')[0]
    }

    return {
      id: p.id,
      name: p.name,
      value: [p.longitude, p.latitude, heatValue],
      province: p.province,
      seasonData,
      lastActiveDate,
    }
  })
}

function buildTrendData(
  points: ObservationPoint[],
  seasons: Season[] | 'all',
): TrendData {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  const seasonArrays: Record<Season, number[]> = {
    spring: new Array(12).fill(0),
    summer: new Array(12).fill(0),
    autumn: new Array(12).fill(0),
    winter: new Array(12).fill(0),
  }

  const allBookings = points.flatMap((p) => filterBookingsBySeasons(p.bookings, seasons))
  const validBookings = allBookings.filter((b) => b.status !== 'cancelled')

  for (const b of validBookings) {
    const month = getMonthFromDate(b.startDate) - 1
    const s = getSeasonFromMonth(month + 1)
    seasonArrays[s][month] += b.guests
  }

  return {
    months,
    seasons: seasonArrays,
  }
}

function classifyTelescope(aperture: number): string {
  if (aperture === 0) return '其他'
  if (aperture < 400) return '折射式'
  if (aperture <= 1000) return '反射式'
  if (aperture <= 2000) return '折反射式'
  return '射电式'
}

function buildTelescopeItems(
  points: ObservationPoint[],
  seasons: Season[] | 'all',
): TelescopeItem[] {
  const categoryCounts: Record<string, number> = {
    '折射式': 0,
    '反射式': 0,
    '折反射式': 0,
    '射电式': 0,
    '其他': 0,
  }

  for (const p of points) {
    for (const t of p.telescopes) {
      const filteredRentals = filterRentalsBySeasons(t.rentalRecords, seasons)
      const validRentals = filteredRentals.filter((r) => r.status !== 'cancelled')
      const category = classifyTelescope(t.aperture)
      categoryCounts[category] += validRentals.length
    }
  }

  const totalCount = Object.values(categoryCounts).reduce((sum, c) => sum + c, 0)

  const items: TelescopeItem[] = Object.keys(categoryCounts).map((name) => ({
    name,
    count: categoryCounts[name],
    percentage: totalCount > 0 ? Math.round((categoryCounts[name] / totalCount) * 10000) / 100 : 0,
    color: TELESCOPE_COLORS[name],
  }))

  return items
}

function buildIdleWarnings(points: ObservationPoint[]): IdleWarning[] {
  const idlePoints = detectAllIdlePoints(points)
  const warnings: IdleWarning[] = []

  for (const ip of idlePoints) {
    if (ip.level === 'normal') continue

    const lastReservation = ip.lastBookingDate || ip.lastRentalDate || '无'
    const severity = ip.level === 'danger' ? 'danger' : 'warning'
    const suggestion = ip.idleDays >= 30
      ? '建议暂停运营并进行设备检修维护'
      : '建议推出优惠套餐或主题观测活动吸引客流'

    warnings.push({
      id: ip.id,
      name: ip.name,
      location: `${ip.province}${ip.city}`,
      idleDays: ip.idleDays,
      lastReservation,
      suggestion,
      severity,
    })
  }

  return warnings
}

export function aggregateData(
  season: string | Season[] = 'all',
  selectedSeasons?: Season[],
): AggregateResponse {
  const points = dataRepository.getAllObservationPoints()
  let effectiveSeasons: Season[] | 'all'

  if (selectedSeasons && selectedSeasons.length > 0) {
    effectiveSeasons = selectedSeasons.filter((s) => SEASONS.includes(s))
    if (effectiveSeasons.length === 0) effectiveSeasons = 'all'
  } else {
    effectiveSeasons = parseSeasonsParam(season)
  }

  return {
    kpi: buildKPIData(points, effectiveSeasons),
    heatmap: buildHeatmap(points, effectiveSeasons),
    trend: buildTrendData(points, effectiveSeasons),
    telescope: buildTelescopeItems(points, effectiveSeasons),
    idleWarnings: buildIdleWarnings(points),
    generatedAt: new Date().toISOString(),
  }
}

export function getKPIData(
  season: string | Season[] = 'all',
  selectedSeasons?: Season[],
): KPIData {
  return aggregateData(season, selectedSeasons).kpi
}

export function getHeatmap(
  season: string | Season[] = 'all',
  selectedSeasons?: Season[],
): HeatmapPoint[] {
  return aggregateData(season, selectedSeasons).heatmap
}

export function getTrendData(
  season: string | Season[] = 'all',
  selectedSeasons?: Season[],
): TrendData {
  return aggregateData(season, selectedSeasons).trend
}

export function getTelescopes(
  season: string | Season[] = 'all',
  selectedSeasons?: Season[],
): TelescopeItem[] {
  return aggregateData(season, selectedSeasons).telescope
}

export function getIdleWarnings(): IdleWarning[] {
  return buildIdleWarnings(dataRepository.getAllObservationPoints())
}

export default {
  aggregateData,
  getKPIData,
  getHeatmap,
  getTrendData,
  getTelescopes,
  getIdleWarnings,
}
