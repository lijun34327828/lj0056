import { useEffect, useCallback, useRef } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';
import type { AggregateResponse } from '@/types';

const POLL_INTERVAL = 30000;

interface ApiResponse {
  success: boolean;
  kpi: AggregateResponse['kpi'];
  heatmap: AggregateResponse['heatmap'];
  trend: AggregateResponse['trend'];
  telescope: AggregateResponse['telescope'];
  idleWarnings: AggregateResponse['idleWarnings'];
  generatedAt: string;
  error?: string;
}

export function useAggregateData() {
  const {
    selectedSeasons,
    setAggregate,
    setLoading,
    setError,
  } = useDashboardStore();

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (selectedSeasons.length > 0) {
        params.set('seasons', selectedSeasons.join(','));
      }

      const url = `/api/aggregate${params.toString() ? `?${params.toString()}` : ''}`;

      const response = await fetch(url, {
        signal: abortControllerRef.current.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json: ApiResponse = await response.json();

      if (!json.success) {
        throw new Error(json.error || '获取数据失败');
      }

      const data: AggregateResponse = {
        kpi: json.kpi,
        heatmap: json.heatmap,
        trend: json.trend,
        telescope: json.telescope,
        idleWarnings: json.idleWarnings,
        generatedAt: json.generatedAt,
      };

      setAggregate(data);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message || '获取数据失败');
      }
    } finally {
      setLoading(false);
    }
  }, [selectedSeasons, setAggregate, setLoading, setError]);

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(fetchData, POLL_INTERVAL);

    return () => {
      clearInterval(intervalId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  return { fetchData };
}
