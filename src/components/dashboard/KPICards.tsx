import { Calendar, Users, Gauge, MapPin } from 'lucide-react';
import { DataCard } from '@/components/ui/DataCard';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { useDashboardStore } from '@/store/dashboardStore';

interface KPICardItem {
  title: string;
  key: string;
  icon: React.ReactNode;
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  color: string;
}

export function KPICards() {
  const { aggregate, isLoading } = useDashboardStore();
  const kpi = aggregate?.kpi;

  const cards: KPICardItem[] = [
    {
      title: '总预约',
      key: 'totalReservations',
      icon: <Calendar className="w-6 h-6" />,
      value: kpi?.totalReservations ?? 0,
      color: '#1890FF',
    },
    {
      title: '总客流',
      key: 'totalVisitors',
      icon: <Users className="w-6 h-6" />,
      value: kpi?.totalVisitors ?? 0,
      color: '#52C41A',
    },
    {
      title: '器材使用率',
      key: 'equipmentUsageRate',
      icon: <Gauge className="w-6 h-6" />,
      value: kpi?.equipmentUsageRate ?? 0,
      suffix: '%',
      decimals: 1,
      color: '#FAAD14',
    },
    {
      title: '活跃点位',
      key: 'activePoints',
      icon: <MapPin className="w-6 h-6" />,
      value: kpi?.activePoints ?? 0,
      suffix: kpi?.totalPoints ? ` / ${kpi.totalPoints}` : '',
      color: '#EB2F96',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((card) => (
        <DataCard key={card.key} className="h-full">
          <div className="flex items-start justify-between h-full">
            <div className="flex flex-col justify-between h-full py-1">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center shadow-glow-sm"
                style={{
                  background: `linear-gradient(135deg, ${card.color}33 0%, ${card.color}11 100%)`,
                  color: card.color,
                  border: `1px solid ${card.color}44`,
                }}
              >
                {card.icon}
              </div>
              <div className="mt-4">
                <p className="text-accent-50/60 text-xs mb-1 tracking-wider">{card.title}</p>
                {isLoading && !aggregate ? (
                  <div className="h-10 w-32 bg-accent-500/10 rounded animate-pulse" />
                ) : (
                  <AnimatedNumber
                    value={card.value}
                    suffix={card.suffix}
                    prefix={card.prefix}
                    decimals={card.decimals}
                    className="text-3xl font-bold"
                    style={{ color: card.color }}
                  />
                )}
              </div>
            </div>
            <div
              className="w-20 h-20 rounded-full opacity-20 absolute -right-4 -top-4"
              style={{
                background: `radial-gradient(circle, ${card.color} 0%, transparent 70%)`,
              }}
            />
          </div>
        </DataCard>
      ))}
    </div>
  );
}
