/**
 * 加權指數 Composable
 * - 呼叫證交所 API 取得 TAIEX
 * - 失敗時 fallback 至 Mock
 */

import { ref, onMounted } from 'vue';
import type { MarketIndexData } from '@/types/module/market';
import { fetchTaiex } from '@/api/modules/stock';

const FALLBACK: MarketIndexData = {
  name: '加權指數',
  value: 22856.72,
  change: 156.38,
  changePercent: 0.69,
  volume: 3842,
  updatedAt: '—',
};

interface UseMarketIndexReturn {
  index: ReturnType<typeof ref<MarketIndexData>>;
  loading: ReturnType<typeof ref<boolean>>;
  error: ReturnType<typeof ref<string | null>>;
  refresh: () => Promise<void>;
}

export function useMarketIndex(): UseMarketIndexReturn {
  const index = ref<MarketIndexData>(FALLBACK);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function refresh(): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      index.value = await fetchTaiex();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : '未知錯誤';
      error.value = `指數載入失敗：${message}`;
      index.value = FALLBACK;
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => void refresh());

  return { index, loading, error, refresh };
}
