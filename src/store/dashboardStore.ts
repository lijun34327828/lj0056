import { create } from 'zustand';
import type { Season, AggregateResponse } from '@/types';

interface DashboardState {
  selectedSeasons: Season[];
  aggregate: AggregateResponse | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  toggleSeason: (season: Season) => void;
  setSeasons: (seasons: Season[]) => void;
  setAggregate: (data: AggregateResponse) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  selectedSeasons: ['spring', 'summer', 'autumn', 'winter'],
  aggregate: null,
  isLoading: false,
  error: null,
  lastUpdated: null,

  toggleSeason: (season: Season) => {
    const current = get().selectedSeasons;
    const hasSeason = current.includes(season);
    if (hasSeason) {
      if (current.length > 1) {
        set({ selectedSeasons: current.filter((s) => s !== season) });
      }
    } else {
      set({ selectedSeasons: [...current, season] });
    }
  },

  setSeasons: (seasons: Season[]) => {
    set({ selectedSeasons: seasons });
  },

  setAggregate: (data: AggregateResponse) => {
    set({ aggregate: data, lastUpdated: data.generatedAt });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));
