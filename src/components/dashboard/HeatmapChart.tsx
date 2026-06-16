import ReactECharts from 'echarts-for-react';
import { useDashboardStore } from '@/store/dashboardStore';
import type { EChartsOption } from 'echarts';

export function HeatmapChart() {
  const { aggregate, selectedSeasons } = useDashboardStore();
  const heatmap = aggregate?.heatmap ?? [];

  const filteredData = heatmap.map((point) => {
    let value = 0;
    selectedSeasons.forEach((season) => {
      value += point.seasonData[season] || 0;
    });
    return {
      name: point.name,
      value: [...point.value.slice(0, 2), value],
      province: point.province,
      lastActiveDate: point.lastActiveDate,
      seasonData: point.seasonData,
    };
  }).filter((d) => d.value[2] > 0);

  const option: EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(10, 25, 41, 0.95)',
      borderColor: 'rgba(24, 144, 255, 0.5)',
      borderWidth: 1,
      textStyle: {
        color: '#fff',
        fontFamily: 'Noto Sans SC',
      },
      formatter: (params) => {
        const data = params.data as {
          name: string;
          province?: string;
          lastActiveDate?: string;
          value: [number, number, number];
        } | undefined;
        if (!data) return '';
        return `
          <div style="padding: 4px;">
            <div style="font-weight: bold; color: #1890FF; margin-bottom: 8px; font-size: 14px;">
              📍 ${data.name}
            </div>
            <div style="color: rgba(255,255,255,0.7); margin-bottom: 4px;">
              省份：<span style="color: #fff;">${data.province || '-'}</span>
            </div>
            <div style="color: rgba(255,255,255,0.7); margin-bottom: 4px;">
              热度值：<span style="color: #52C41A; font-weight: bold;">${data.value[2].toLocaleString()}</span>
            </div>
            <div style="color: rgba(255,255,255,0.7);">
              最近活跃：<span style="color: #FAAD14;">${data.lastActiveDate || '-'}</span>
            </div>
          </div>
        `;
      },
    },
    geo: {
      map: 'china',
      roam: true,
      zoom: 1.2,
      label: {
        show: false,
      },
      itemStyle: {
        areaColor: 'rgba(24, 144, 255, 0.08)',
        borderColor: 'rgba(24, 144, 255, 0.3)',
        borderWidth: 1,
      },
      emphasis: {
        label: {
          show: true,
          color: '#fff',
        },
        itemStyle: {
          areaColor: 'rgba(24, 144, 255, 0.2)',
          borderColor: '#1890FF',
        },
      },
    },
    series: [
      {
        name: '点位热度',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: filteredData,
        symbolSize: (val: number[]) => {
          return Math.max(8, Math.min(28, Math.sqrt(val[2]) / 2));
        },
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke',
          scale: 3,
          period: 4,
        },
        label: {
          formatter: '{b}',
          position: 'right',
          show: false,
          color: '#fff',
          fontSize: 11,
        },
        emphasis: {
          label: {
            show: true,
          },
        },
        itemStyle: {
          color: {
            type: 'radial',
            x: 0.5,
            y: 0.5,
            r: 0.5,
            colorStops: [
              { offset: 0, color: '#fff' },
              { offset: 0.5, color: '#1890FF' },
              { offset: 1, color: 'rgba(24, 144, 255, 0.3)' },
            ],
          },
          shadowBlur: 15,
          shadowColor: '#1890FF',
        },
        zlevel: 1,
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: '100%', width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
}
