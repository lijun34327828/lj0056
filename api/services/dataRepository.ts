import type {
  ObservationPoint,
  Telescope,
  Booking,
  RentalRecord,
} from '../../shared/types.js'

const SEED = 20260616

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

const rand = seededRandom(SEED)

const pointConfigs = [
  { name: '国家天文台兴隆观测站', province: '河北省', city: '承德市', lat: 40.396, lng: 117.579, alt: 960 },
  { name: '紫金山天文台盱眙观测站', province: '江苏省', city: '淮安市', lat: 33.053, lng: 118.279, alt: 180 },
  { name: '上海天文台佘山观测站', province: '上海市', city: '上海市', lat: 31.094, lng: 121.194, alt: 98 },
  { name: '云南天文台昆明观测站', province: '云南省', city: '昆明市', lat: 25.028, lng: 102.792, alt: 2015 },
  { name: '云南天文台丽江观测站', province: '云南省', city: '丽江市', lat: 26.693, lng: 100.033, alt: 3200 },
  { name: '新疆天文台乌鲁木齐观测站', province: '新疆维吾尔自治区', city: '乌鲁木齐市', lat: 43.472, lng: 87.176, alt: 2080 },
  { name: '新疆天文台南山观测站', province: '新疆维吾尔自治区', city: '乌鲁木齐市', lat: 43.467, lng: 87.183, alt: 2100 },
  { name: '陕西天文台临潼观测站', province: '陕西省', city: '西安市', lat: 34.376, lng: 109.224, alt: 500 },
  { name: '北京天文台怀柔观测站', province: '北京市', city: '北京市', lat: 40.356, lng: 116.638, alt: 540 },
  { name: '山东大学威海天文台', province: '山东省', city: '威海市', lat: 37.536, lng: 122.069, alt: 130 },
  { name: '中国科学技术大学天体物理中心', province: '安徽省', city: '合肥市', lat: 31.821, lng: 117.228, alt: 40 },
  { name: '南京大学天文系观测站', province: '江苏省', city: '南京市', lat: 32.055, lng: 118.784, alt: 30 },
  { name: '北京大学天文系观测站', province: '北京市', city: '北京市', lat: 39.992, lng: 116.305, alt: 50 },
  { name: '清华大学天体物理中心', province: '北京市', city: '北京市', lat: 40.000, lng: 116.326, alt: 48 },
  { name: '广州大学天体物理中心', province: '广东省', city: '广州市', lat: 23.092, lng: 113.355, alt: 20 },
  { name: '四川大学天文系观测站', province: '四川省', city: '成都市', lat: 30.657, lng: 104.066, alt: 500 },
  { name: '武汉大学天文系观测站', province: '湖北省', city: '武汉市', lat: 30.538, lng: 114.354, alt: 30 },
  { name: '厦门大学天文系观测站', province: '福建省', city: '厦门市', lat: 24.491, lng: 118.089, alt: 60 },
  { name: '贵州大学天文观测站', province: '贵州省', city: '贵阳市', lat: 26.647, lng: 106.630, alt: 1100 },
  { name: '吉林大学天文观测站', province: '吉林省', city: '长春市', lat: 43.855, lng: 125.325, alt: 220 },
  { name: '哈尔滨工业大学天文观测站', province: '黑龙江省', city: '哈尔滨市', lat: 45.740, lng: 126.641, alt: 150 },
  { name: '兰州大学天文观测站', province: '甘肃省', city: '兰州市', lat: 36.058, lng: 103.841, alt: 1520 },
  { name: '内蒙古大学天文观测站', province: '内蒙古自治区', city: '呼和浩特市', lat: 40.842, lng: 111.750, alt: 1060 },
  { name: '青海大学天文观测站', province: '青海省', city: '西宁市', lat: 36.617, lng: 101.778, alt: 2260 },
  { name: '宁夏大学天文观测站', province: '宁夏回族自治区', city: '银川市', lat: 38.487, lng: 106.230, alt: 1110 },
  { name: '西藏大学天文观测站', province: '西藏自治区', city: '拉萨市', lat: 29.652, lng: 91.172, alt: 3650 },
  { name: '广西大学天文观测站', province: '广西壮族自治区', city: '南宁市', lat: 22.817, lng: 108.366, alt: 80 },
  { name: '海南大学天文观测站', province: '海南省', city: '海口市', lat: 20.044, lng: 110.333, alt: 20 },
  { name: '天津大学天文观测站', province: '天津市', city: '天津市', lat: 39.131, lng: 117.166, alt: 10 },
  { name: '重庆大学天文观测站', province: '重庆市', city: '重庆市', lat: 29.563, lng: 106.551, alt: 260 },
  { name: '大连理工大学天文观测站', province: '辽宁省', city: '大连市', lat: 38.888, lng: 121.539, alt: 90 },
  { name: 'FAST观测基地', province: '贵州省', city: '黔南布依族苗族自治州', lat: 25.653, lng: 106.857, alt: 1110 },
]

const telescopeModels = [
  { name: 'LAMOST郭守敬望远镜', model: 'LAMOST-4m', aperture: 4000, focal: 20000 },
  { name: '2.16米光学望远镜', model: 'BOK-2.16m', aperture: 2160, focal: 19440 },
  { name: '1.56米光学望远镜', model: 'TS-1.56m', aperture: 1560, focal: 12480 },
  { name: '1.26米红外望远镜', model: 'IR-1.26m', aperture: 1260, focal: 10080 },
  { name: '1米反光望远镜', model: 'R-C-1m', aperture: 1000, focal: 8000 },
  { name: '85厘米反光望远镜', model: 'R-C-85cm', aperture: 850, focal: 6800 },
  { name: '60厘米反光望远镜', model: 'R-C-60cm', aperture: 600, focal: 4800 },
  { name: '40厘米施密特望远镜', model: 'S-40cm', aperture: 400, focal: 1200 },
  { name: '30厘米折射望远镜', model: 'R-30cm', aperture: 300, focal: 4500 },
  { name: '25厘米牛顿望远镜', model: 'N-25cm', aperture: 250, focal: 1200 },
]

const userNames = [
  '张三', '李四', '王五', '赵六', '陈七', '周八', '吴九', '郑十',
  '孙明', '钱华', '林强', '黄磊', '徐伟', '马超', '朱红', '胡静',
  '郭涛', '何刚', '高翔', '罗琳', '宋佳', '谢雨', '唐杰', '韩雪',
  '冯峰', '曹阳', '彭博', '曾辉', '田野', '董超', '杨洋', '潘玉',
]

const statusList: ('confirmed' | 'completed' | 'cancelled')[] = ['confirmed', 'completed', 'cancelled']

function generateDate(year: number, month: number, day: number): string {
  const m = String(month).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  return `${year}-${m}-${d}`
}

function generateDateRange(startYear: number, endYear: number): { startDate: string; endDate: string; duration: number } {
  const year = startYear + Math.floor(rand() * (endYear - startYear + 1))
  let month = 1 + Math.floor(rand() * 12)
  let maxDay = month === 2 ? 28 : [4, 6, 9, 11].includes(month) ? 30 : 31

  if (year === 2026 && month > 6) {
    month = 1 + Math.floor(rand() * 6)
    maxDay = month === 2 ? 28 : [4, 6].includes(month) ? 30 : 31
  }

  let startDay = 1 + Math.floor(rand() * (maxDay - 3))

  if (year === 2026 && month === 6 && startDay > 13) {
    startDay = 1 + Math.floor(rand() * 13)
  }

  const duration = 1 + Math.floor(rand() * 5)
  const endDay = Math.min(startDay + duration, year === 2026 && month === 6 ? 16 : maxDay)
  return {
    startDate: generateDate(year, month, startDay),
    endDate: generateDate(year, month, endDay),
    duration: endDay - startDay + 1,
  }
}

let idCounter = 1000
function nextId(prefix: string): string {
  idCounter++
  return `${prefix}_${idCounter}`
}

function generateTelescopes(pointId: string, count: number): Telescope[] {
  const telescopes: Telescope[] = []
  for (let i = 0; i < count; i++) {
    const modelIdx = Math.floor(rand() * telescopeModels.length)
    const tm = telescopeModels[modelIdx]
    telescopes.push({
      id: nextId('TS'),
      name: tm.name,
      model: tm.model,
      aperture: tm.aperture,
      focalLength: tm.focal,
      rentalRecords: [],
    })
  }
  return telescopes
}

function generateBookings(pointId: string, count: number): Booking[] {
  const bookings: Booking[] = []
  for (let i = 0; i < count; i++) {
    const { startDate, endDate, duration } = generateDateRange(2024, 2026)
    const userIdx = Math.floor(rand() * userNames.length)
    const statusIdx = Math.floor(rand() * statusList.length)
    bookings.push({
      id: nextId('BK'),
      pointId,
      userId: `U${100 + userIdx}`,
      userName: userNames[userIdx],
      startDate,
      endDate,
      status: statusList[statusIdx],
      guests: 1 + Math.floor(rand() * 6),
    })
  }
  return bookings
}

function generateRentalRecords(
  telescopeId: string,
  pointId: string,
  count: number,
): RentalRecord[] {
  const records: RentalRecord[] = []
  for (let i = 0; i < count; i++) {
    const { startDate, endDate, duration } = generateDateRange(2024, 2026)
    const userIdx = Math.floor(rand() * userNames.length)
    const statusIdx = Math.floor(rand() * statusList.length)
    const basePrice = 500 + Math.floor(rand() * 4500)
    records.push({
      id: nextId('RR'),
      telescopeId,
      pointId,
      userId: `U${100 + userIdx}`,
      userName: userNames[userIdx],
      startDate,
      endDate,
      price: basePrice * duration,
      status: statusList[statusIdx],
    })
  }
  return records
}

function buildObservationPoints(): ObservationPoint[] {
  const points: ObservationPoint[] = []

  for (let i = 0; i < pointConfigs.length; i++) {
    const cfg = pointConfigs[i]
    const pid = `OP_${String(i + 1).padStart(3, '0')}`

    const telescopeCount = 2 + Math.floor(rand() * 5)
    const telescopes = generateTelescopes(pid, telescopeCount)

    const bookingCount = 5 + Math.floor(rand() * 40)
    const bookings = generateBookings(pid, bookingCount)

    for (const t of telescopes) {
      const rentalCount = 2 + Math.floor(rand() * 15)
      t.rentalRecords.push(...generateRentalRecords(t.id, pid, rentalCount))
    }

    points.push({
      id: pid,
      name: cfg.name,
      province: cfg.province,
      city: cfg.city,
      latitude: cfg.lat,
      longitude: cfg.lng,
      altitude: cfg.alt,
      telescopes,
      bookings,
    })
  }

  return points
}

class DataRepository {
  private observationPoints: ObservationPoint[] = []

  constructor() {
    this.initialize()
  }

  private initialize(): void {
    this.observationPoints = buildObservationPoints()
    console.log(`[DataRepository] 已加载 ${this.observationPoints.length} 个观测站数据`)
    const totalBookings = this.observationPoints.reduce((sum, p) => sum + p.bookings.length, 0)
    const totalRentals = this.observationPoints.reduce(
      (sum, p) => sum + p.telescopes.reduce((s, t) => s + t.rentalRecords.length, 0),
      0,
    )
    console.log(`[DataRepository] 预约记录: ${totalBookings} 条, 租借记录: ${totalRentals} 条`)
  }

  getAllObservationPoints(): ObservationPoint[] {
    return this.observationPoints
  }

  getPointById(id: string): ObservationPoint | undefined {
    return this.observationPoints.find((p) => p.id === id)
  }
}

export const dataRepository = new DataRepository()
export default dataRepository
