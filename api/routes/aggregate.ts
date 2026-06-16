import { Router, type Request, type Response } from 'express'
import type { Season, AggregateResponse, KPIData, HeatmapPoint, TrendData, TelescopeItem, IdleWarning } from '../../shared/types.js'
import aggregateService from '../services/aggregateService.js'

const router = Router()

const VALID_SEASONS: Season[] = ['spring', 'summer', 'autumn', 'winter']

function parseSeasonsParam(seasonsStr: string | undefined): Season[] | undefined {
  if (!seasonsStr) return undefined
  const parts = seasonsStr.split(',').map((s) => s.trim() as Season)
  const filtered = parts.filter((s) => VALID_SEASONS.includes(s))
  return filtered.length > 0 ? filtered : undefined
}

router.get('/', (req: Request, res: Response): void => {
  const seasonsParam = Array.isArray(req.query.seasons)
    ? req.query.seasons[0] as string
    : (req.query.seasons as string)
  const selectedSeasons = parseSeasonsParam(seasonsParam)
  const data: AggregateResponse = aggregateService.aggregateData('all', selectedSeasons)
  res.status(200).json({
    success: true,
    ...data,
  })
})

router.get('/kpi', (req: Request, res: Response): void => {
  const seasonsParam = Array.isArray(req.query.seasons)
    ? req.query.seasons[0] as string
    : (req.query.seasons as string)
  const selectedSeasons = parseSeasonsParam(seasonsParam)
  const data: KPIData = aggregateService.getKPIData('all', selectedSeasons)
  res.status(200).json({
    success: true,
    data,
  })
})

router.get('/heatmap', (req: Request, res: Response): void => {
  const seasonsParam = Array.isArray(req.query.seasons)
    ? req.query.seasons[0] as string
    : (req.query.seasons as string)
  const selectedSeasons = parseSeasonsParam(seasonsParam)
  const data: HeatmapPoint[] = aggregateService.getHeatmap('all', selectedSeasons)
  res.status(200).json({
    success: true,
    data,
  })
})

router.get('/trend', (req: Request, res: Response): void => {
  const seasonsParam = Array.isArray(req.query.seasons)
    ? req.query.seasons[0] as string
    : (req.query.seasons as string)
  const selectedSeasons = parseSeasonsParam(seasonsParam)
  const data: TrendData = aggregateService.getTrendData('all', selectedSeasons)
  res.status(200).json({
    success: true,
    data,
  })
})

router.get('/telescope', (req: Request, res: Response): void => {
  const seasonsParam = Array.isArray(req.query.seasons)
    ? req.query.seasons[0] as string
    : (req.query.seasons as string)
  const selectedSeasons = parseSeasonsParam(seasonsParam)
  const data: TelescopeItem[] = aggregateService.getTelescopes('all', selectedSeasons)
  res.status(200).json({
    success: true,
    data,
  })
})

router.get('/idle', (req: Request, res: Response): void => {
  const data: IdleWarning[] = aggregateService.getIdleWarnings()
  res.status(200).json({
    success: true,
    data,
  })
})

export default router
