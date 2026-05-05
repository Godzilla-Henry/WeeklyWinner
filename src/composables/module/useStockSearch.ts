/**
 * 股票搜尋 Autocomplete
 * 資料來源：靜態台股清單（src/data/twStocks.ts）
 * 支援名稱與代碼模糊搜尋
 */

import { ref, computed, type Ref, type ComputedRef } from 'vue';
import { TW_STOCKS } from '@/data/twStocks';

/** 股票項目 */
export interface StockOption {
  symbol: string;
  name: string;
  label: string; // 顯示用：名稱(代碼)
}

/** 預先建立搜尋用清單 */
const STOCK_OPTIONS: StockOption[] = TW_STOCKS.map(([symbol, name]) => ({
  symbol,
  name,
  label: `${name}(${symbol})`,
}));

interface UseStockSearchReturn {
  /** 搜尋關鍵字 */
  keyword: Ref<string>;
  /** 篩選後的選項（最多 10 筆） */
  suggestions: ComputedRef<StockOption[]>;
}

export function useStockSearch(): UseStockSearchReturn {
  const keyword = ref('');

  /** 根據關鍵字篩選（名稱或代碼） */
  const suggestions = computed((): StockOption[] => {
    const q = keyword.value.trim();
    if (!q || q.length < 1) return [];

    return STOCK_OPTIONS
      .filter((s) => s.name.includes(q) || s.symbol.includes(q))
      .slice(0, 10);
  });

  return {
    keyword,
    suggestions,
  };
}
