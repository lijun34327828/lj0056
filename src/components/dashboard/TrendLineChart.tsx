import ReactECharts from 'echarts-for-react';
import { useDashboardStore } from '@/store/dashboardStore';
import { SEASON_COLORS, SEASON_LABELS } from '@/types';
import type { EChartsOption } from 'echarts';

export function TrendLineChart() {
  const { aggregate, selectedSeasons } = useDashboardStore();
  const trend = aggregate?.trend;
  const months = trend?.months ?? [];

  const series = selectedSeasons.map((season) => ({
    name: SEASON_LABELS[season],
    type: 'line' as const,
    smooth: true,
    symbol: 'circle',
    symbolSize: 6,
    showSymbol: true,
    lineStyle: {
      width: 2.5,
      color: SEASON_COLORS[season],
      shadowBlur: 10,
      shadowColor: SEASON_COLORS[season],
    },
    itemStyle: {
      color: SEASON_COLORS[season],
      borderWidth: 2,
      borderColor: '#fff',
    },
    areaStyle: {
      color: {
        type: 'linear' as const,
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          { offset: 0, color: `${SEASON_COLORS[season]}55` },
          { offset: 1, color: `${SEASON_COLORS[season]}00` },
        ],
      },
    },
    emphasis: {
      focus: 'series' as const,
      itemStyle: {
        borderWidth: 3,
        shadowBlur: 15,
        shadowColor: SEASON_COLORS[season],
      },
    },
    data: trend?.seasons[season] ?? [],
  }));

  const option: EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(10, 25, 41, 0.95)',
      borderColor: 'rgba(24, 144, 255, 0.5)',
      borderWidth: 1,
      textStyle: {
        color: '#fff',
        fontFamily: 'Noto Sans SC',
      },
      axisPointer: {
        type: 'cross',
        lineStyle: {
          color: 'rgba(24, 144, 255, 0.5)',
        },
        crossStyle: {
          color: 'rgba(24, 144, 255, 0.5)',
        },
      },
    },
    legend: {
      data: selectedSeasons.map((s) => SEASON_LABELS[s]),
      top: 0,
      right: 10,
      textStyle: {
        color: 'rgba(255,255,255,0.7)',
        fontFamily: 'Noto Sans SC',
      },
      itemWidth: 16,
      itemHeight: 8,
      itemGap: 20,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: months,
      axisLine: {
        lineStyle: {
          color: 'rgba(24, 144, 255, 0.3)',
        },
      },
      axisLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontFamily: 'Noto Sans SC',
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
      },
      axisLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontFamily: 'Orbitron',
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(24, 144, 255, 0.1)',
          type: 'dashed',
        },
      },
    },
    series,
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: '100%', width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
}
