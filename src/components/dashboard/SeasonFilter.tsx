import { useDashboardStore } from '@/store/dashboardStore';
import { SEASONS, SEASON_LABELS, SEASON_ICONS, SEASON_COLORS } from '@/types';
import type { Season } from '@/types';

export function SeasonFilter() {
  const { selectedSeasons, toggleSeason } = useDashboardStore();

  return (
    <div className="flex items-center gap-3">
      <span className="text-accent-50/70 text-sm tracking-wider">季节筛选：</span>
      <div className="flex gap-2">
        {SEASONS.map((season: Season) => {
          const isSelected = selectedSeasons.includes(season);
          const color = SEASON_COLORS[season];
          return (
            <button
              key={season}
              onClick={() => toggleSeason(season)}
              className="relative px-4 py-2 rounded-lg transition-all duration-300 group"
              style={{
                background: isSelected
                  ? `linear-gradient(135deg, ${color}33 0%, ${color}11 100%)`
                  : 'rgba(24, 144, 255, 0.05)',
                border: `1px solid ${isSelected ? `${color}88` : 'rgba(24, 144, 255, 0.2)'}`,
                boxShadow: isSelected ? `0 0 15px ${color}33` : 'none',
              }}
            >
              <span className="flex items-center gap-1.5">
                <span className="text-lg">{SEASON_ICONS[season]}</span>
                <span
                  className="text-sm font-medium tracking-wider"
                  style={{
                    color: isSelected ? color : 'rgba(255,255,255,0.6)',
                  }}
                >
                  {SEASON_LABELS[season]}
                </span>
              </span>
              {isSelected && (
                <span
                  className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full animate-pulse"
                  style={{ background: color }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
