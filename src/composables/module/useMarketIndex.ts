/**
 * 加權指數 TanStack Query Composable
 * - 呼叫證交所 API 取得 TAIEX
 * - 當月無資料時自動 fallback 上個月
 */

import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { fetchTaiex, queryKeys } from '@/api';
import type { MarketIndexData } from '@/types/module/market';

interface UseMarketIndexReturn {
  /** 指數資料 */
  index: ReturnType<typeof useQuery<MarketIndexData>>['data'];
  /** 載入中 */
  loading: ReturnType<typeof useQuery<MarketIndexData>>['isLoading'];
  /** 錯誤訊息 */
  error: ReturnType<typeof useQuery<MarketIndexData>>['error'];
  /** 手動重新取得 */
  refresh: () => Promise<void>;
}

export function useMarketIndex(): UseMarketIndexReturn {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<MarketIndexData>({
    queryKey: queryKeys.market.taiex,
    queryFn: fetchTaiex,
    /** 指數資料 10 分鐘內不重新請求 */
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });

  async function refresh(): Promise<void> {
    await queryClient.invalidateQueries({ queryKey: queryKeys.market.taiex });
  }

  return {
    index: data,
    loading: isLoading,
    error,
    refresh,
  };
}
