import type {
  ObservationPoint,
  Booking,
  IdlePoint,
  IdleLevel,
} from '../../shared/types.js'

const REFERENCE_DATE = new Date('2026-06-16')
const WARNING_DAYS = 15
const DANGER_DAYS = 30

function parseDate(dateStr: string): Date {
  return new Date(dateStr)
}

function daysBetween(from: Date, to: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24
  return Math.floor((to.getTime() - from.getTime()) / msPerDay)
}

function getMaxDate(dates: Date[]): Date | null {
  if (dates.length === 0) return null
  return dates.reduce((max, d) => (d.getTime() > max.getTime() ? d : max))
}

function extractBookingDates(bookings: Booking[]): Date[] {
  return bookings
    .filter((b) => b.status !== 'cancelled')
    .map((b) => parseDate(b.endDate))
}

function extractRentalDates(point: ObservationPoint): Date[] {
  const dates: Date[] = []
  for (const t of point.telescopes) {
    for (const r of t.rentalRecords) {
      if (r.status !== 'cancelled') {
        dates.push(parseDate(r.endDate))
      }
    }
  }
  return dates
}

function determineIdleLevel(idleDays: number): IdleLevel {
  if (idleDays >= DANGER_DAYS) return 'danger'
  if (idleDays >= WARNING_DAYS) return 'warning'
  return 'normal'
}

export function detectIdlePoint(point: ObservationPoint, refDate: Date = REFERENCE_DATE): IdlePoint {
  const bookingDates = extractBookingDates(point.bookings)
  const rentalDates = extractRentalDates(point)
  const allDates = [...bookingDates, ...rentalDates]
  const lastActivity = getMaxDate(allDates)

  let idleDays: number
  let lastBookingDate: string | null = null
  let lastRentalDate: string | null = null

  if (lastActivity) {
    idleDays = daysBetween(lastActivity, refDate)
    const lastBooking = getMaxDate(bookingDates)
    const lastRental = getMaxDate(rentalDates)
    if (lastBooking) lastBookingDate = lastBooking.toISOString().split('T')[0]
    if (lastRental) lastRentalDate = lastRental.toISOString().split('T')[0]
  } else {
    idleDays = 999
  }

  return {
    id: point.id,
    name: point.name,
    province: point.province,
    city: point.city,
    latitude: point.latitude,
    longitude: point.longitude,
    lastBookingDate,
    lastRentalDate,
    idleDays,
    level: determineIdleLevel(idleDays),
  }
}

export function detectAllIdlePoints(
  points: ObservationPoint[],
  refDate: Date = REFERENCE_DATE,
): IdlePoint[] {
  return points.map((p) => detectIdlePoint(p, refDate))
}

export function getIdlePointsByLevel(
  points: ObservationPoint[],
  level?: IdleLevel,
  refDate: Date = REFERENCE_DATE,
): IdlePoint[] {
  const all = detectAllIdlePoints(points, refDate)
  if (!level) return all
  return all.filter((p) => p.level === level)
}

export default {
  detectIdlePoint,
  detectAllIdlePoints,
  getIdlePointsByLevel,
}
