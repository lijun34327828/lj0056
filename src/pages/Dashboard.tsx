import { useEffect, useMemo, useState } from 'react';
import * as echarts from 'echarts';
import { Telescope, RefreshCw, Clock, Database, MapPin, AlertCircle } from 'lucide-react';
import { DataCard } from '@/components/ui/DataCard';
import { KPICards } from '@/components/dashboard/KPICards';
import { SeasonFilter } from '@/components/dashboard/SeasonFilter';
import { HeatmapChart } from '@/components/dashboard/HeatmapChart';
import { TrendLineChart } from '@/components/dashboard/TrendLineChart';
import { TelescopePieChart } from '@/components/dashboard/TelescopePieChart';
import { IdleWarningTable } from '@/components/dashboard/IdleWarningTable';
import { useAggregateData } from '@/hooks/useAggregateData';
import { useDashboardStore } from '@/store/dashboardStore';

function StarsBackground() {
  const stars = useMemo(() => {
    return Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 4,
      duration: 3 + Math.random() * 3,
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
            opacity: 0.6,
          }}
        />
      ))}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 10%, rgba(24, 144, 255, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 90%, rgba(82, 196, 26, 0.05) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(235, 47, 150, 0.03) 0%, transparent 70%)
          `,
        }}
      />
    </div>
  );
}

export default function Dashboard() {
  const { lastUpdated, error, isLoading } = useDashboardStore();
  const { fetchData } = useAggregateData();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch('/china-map.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load map');
        return res.json();
      })
      .then((geoJson) => {
        if (cancelled) return;
        echarts.registerMap('china', geoJson);
        setMapLoaded(true);
      })
      .catch((err) => {
        if (cancelled) return;
        console.warn('加载中国地图失败，将使用备用模式:', err);
        setMapError(true);
        setMapLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const formatTime = (isoString: string | null) => {
    if (!isoString) return '--';
    const date = new Date(isoString);
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="relative min-h-screen w-full bg-space-900 text-accent-50 overflow-hidden">
      <StarsBackground />

      <div className="relative z-10 h-screen w-full p-4 flex flex-col gap-4">
        <header className="flex items-center justify-between px-6 py-3 rounded-xl border border-accent-500/20"
          style={{
            background: 'linear-gradient(90deg, rgba(24, 144, 255, 0.1) 0%, rgba(10, 25, 41, 0.8) 50%, rgba(24, 144, 255, 0.1) 100%)',
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-glow"
              style={{
                background: 'linear-gradient(135deg, #1890FF 0%, #096DD9 100%)',
              }}
            >
              <Telescope className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-orbitron tracking-wider bg-gradient-to-r from-accent-100 via-accent-300 to-accent-100 bg-clip-text text-transparent">
                天文观测站运营监控大屏
              </h1>
              <p className="text-xs text-accent-50/50 mt-0.5 tracking-wider">
                ASTRONOMICAL OBSERVATION OPERATION MONITORING SYSTEM
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <SeasonFilter />

            <div className="flex items-center gap-4 pl-4 border-l border-accent-500/20">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-accent-500" />
                <span className="text-accent-50/60">更新：</span>
                <span className="font-orbitron text-accent-300">
                  {formatTime(lastUpdated)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {isLoading && (
                  <div className="flex items-center gap-1.5 text-xs text-accent-400">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>加载中...</span>
                  </div>
                )}
                {error && (
                  <div className="flex items-center gap-1.5 text-xs text-red-400">
                    <Database className="w-3.5 h-3.5" />
                    <span>数据异常</span>
                  </div>
                )}
                <button
                  onClick={fetchData}
                  className="p-2 rounded-lg border border-accent-500/30 hover:border-accent-500/60 hover:bg-accent-500/10 transition-all text-accent-50/70 hover:text-accent-300"
                  title="手动刷新数据"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </header>

        <KPICards />

        <div className="flex-1 min-h-0 grid grid-cols-12 gap-4">
          <DataCard
            title="全国点位热力分布"
            icon={<MapPin className="w-4 h-4" />}
            className="col-span-7"
          >
            {!mapLoaded ? (
              <div className="h-full flex flex-col items-center justify-center text-accent-50/40">
                <MapPin className="w-12 h-12 mb-3 animate-pulse opacity-50" />
                <span className="text-sm">地图加载中...</span>
              </div>
            ) : mapError ? (
              <div className="h-full flex flex-col items-center justify-center text-yellow-500/70">
                <AlertCircle className="w-12 h-12 mb-3" />
                <span className="text-sm">地图加载失败，使用备用模式</span>
              </div>
            ) : (
              <HeatmapChart />
            )}
          </DataCard>

          <div className="col-span-5 flex flex-col gap-4 min-h-0">
            <DataCard
              title="月度客流趋势"
              icon={<Clock className="w-4 h-4" />}
              className="flex-1"
            >
              <TrendLineChart />
            </DataCard>

            <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
              <DataCard
                title="望远镜租借占比"
                icon={<Telescope className="w-4 h-4" />}
              >
                <TelescopePieChart />
              </DataCard>

              <DataCard
                title="空置点位预警"
                icon={<RefreshCw className="w-4 h-4" />}
                contentClassName="!p-2 !pt-3"
              >
                <IdleWarningTable />
              </DataCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
