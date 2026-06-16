import { AlertTriangle, MapPin, Calendar, Lightbulb } from 'lucide-react';
import { useDashboardStore } from '@/store/dashboardStore';
import type { IdlePoint } from '@/types';

function getRowStyle(idleDays: number): string {
  if (idleDays >= 30) {
    return 'bg-red-950/50 hover:bg-red-950/70';
  }
  if (idleDays >= 15) {
    return 'bg-yellow-950/30 hover:bg-yellow-950/50';
  }
  return 'hover:bg-accent-500/5';
}

function getSeverityBadge(idleDays: number) {
  if (idleDays >= 30) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/40">
        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-blink" />
        严重
      </span>
    );
  }
  if (idleDays >= 15) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/40">
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-blink" />
        警告
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-accent-500/20 text-accent-400 border border-accent-500/40">
      正常
    </span>
  );
}

function getIdleDaysStyle(idleDays: number): string {
  if (idleDays >= 30) {
    return 'text-red-400 font-orbitron font-bold text-lg';
  }
  if (idleDays >= 15) {
    return 'text-yellow-400 font-orbitron font-bold';
  }
  return 'text-accent-50/70 font-orbitron';
}

export function IdleWarningTable() {
  const { aggregate, isLoading } = useDashboardStore();
  const warnings = aggregate?.idleWarnings ?? [];

  const sortedWarnings = [...warnings].sort((a, b) => b.idleDays - a.idleDays);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden rounded-lg border border-accent-500/10">
        <div className="overflow-auto h-full max-h-full">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 backdrop-blur-md">
              <tr className="bg-space-800/80 border-b border-accent-500/20">
                <th className="text-left px-3 py-2.5 font-semibold text-accent-50/80 w-8">
                  <span className="sr-only">状态</span>
                </th>
                <th className="text-left px-3 py-2.5 font-semibold text-accent-50/80">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    点位名称
                  </div>
                </th>
                <th className="text-left px-3 py-2.5 font-semibold text-accent-50/80">位置</th>
                <th className="text-right px-3 py-2.5 font-semibold text-accent-50/80">
                  空置天数
                </th>
                <th className="text-left px-3 py-2.5 font-semibold text-accent-50/80">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    上次预约
                  </div>
                </th>
                <th className="text-left px-3 py-2.5 font-semibold text-accent-50/80">
                  <div className="flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5" />
                    建议
                  </div>
                </th>
                <th className="text-center px-3 py-2.5 font-semibold text-accent-50/80 w-20">
                  等级
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading && sortedWarnings.length === 0 ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-accent-500/5">
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="px-3 py-3">
                        <div className="h-4 bg-accent-500/10 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : sortedWarnings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-12 text-center text-accent-50/40">
                    <div className="flex flex-col items-center gap-2">
                      <AlertTriangle className="w-10 h-10 opacity-30" />
                      <span>暂无空置预警数据</span>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedWarnings.map((point: IdlePoint) => (
                  <tr
                    key={point.id}
                    className={`border-b border-accent-500/5 transition-colors ${getRowStyle(point.idleDays)}`}
                  >
                    <td className="px-3 py-2.5">
                      {(point.idleDays >= 15) && (
                        <AlertTriangle
                          className={`w-4 h-4 animate-blink ${
                            point.idleDays >= 30 ? 'text-red-400' : 'text-yellow-400'
                          }`}
                        />
                      )}
                    </td>
                    <td className="px-3 py-2.5 font-medium text-accent-50">
                      {point.name}
                    </td>
                    <td className="px-3 py-2.5 text-accent-50/60">
                      {point.location}
                    </td>
                    <td className={`px-3 py-2.5 text-right ${getIdleDaysStyle(point.idleDays)}`}>
                      {point.idleDays}<span className="text-xs ml-0.5 opacity-70">天</span>
                    </td>
                    <td className="px-3 py-2.5 text-accent-50/70 font-orbitron text-xs">
                      {point.lastReservation}
                    </td>
                    <td className="px-3 py-2.5 text-accent-50/60 text-xs max-w-[200px]">
                      <span className="line-clamp-2">{point.suggestion}</span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      {getSeverityBadge(point.idleDays)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
