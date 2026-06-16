import ReactECharts from 'echarts-for-react';
import { useDashboardStore } from '@/store/dashboardStore';
import type { EChartsOption } from 'echarts';

export function TelescopePieChart() {
  const { aggregate } = useDashboardStore();
  const telescope = aggregate?.telescope ?? [];

  const total = telescope.reduce((sum, item) => sum + item.count, 0);

  const data = telescope.map((item) => ({
    value: item.count,
    name: item.name,
    itemStyle: {
      color: item.color,
    },
  }));

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
        return `
          <div style="padding: 4px;">
            <div style="font-weight: bold; color: ${params.color}; margin-bottom: 6px;">
              ${params.name}
            </div>
            <div style="color: rgba(255,255,255,0.7);">
              租借次数：<span style="color: #fff; font-weight: bold;">${params.value.toLocaleString()}</span>
            </div>
            <div style="color: rgba(255,255,255,0.7);">
              占比：<span style="color: #1890FF; font-weight: bold;">${params.percent}%</span>
            </div>
          </div>
        `;
      },
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      textStyle: {
        color: 'rgba(255,255,255,0.7)',
        fontFamily: 'Noto Sans SC',
        fontSize: 12,
      },
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 12,
    },
    title: {
      text: '租借占比',
      subtext: `总 ${total.toLocaleString()} 次`,
      left: '25%',
      top: '42%',
      textAlign: 'center',
      textStyle: {
        color: '#1890FF',
        fontFamily: 'Orbitron',
        fontSize: 12,
        fontWeight: 'normal',
      },
      subtextStyle: {
        color: '#fff',
        fontFamily: 'Orbitron',
        fontSize: 20,
        fontWeight: 'bold',
      },
      itemGap: 4,
    },
    series: [
      {
        name: '望远镜类型',
        type: 'pie',
        radius: ['50%', '72%'],
        center: ['32%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#0A1929',
          borderWidth: 2,
        },
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
            color: '#fff',
            fontFamily: 'Noto Sans SC',
          },
          itemStyle: {
            shadowBlur: 20,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
          scale: true,
          scaleSize: 8,
        },
        labelLine: {
          show: false,
        },
        data,
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
