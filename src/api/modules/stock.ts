/**
 * 台股加權指數 API 模組
 *
 * 資料來源：證交所 TWSE FMTQIK（每月各日成交資訊）
 * 欄位順序：日期, 成交股數, 成交金額, 成交筆數, 發行量加權股價指數, 漲跌點數
 *
 * 注意：date 參數代表「查詢該月份」，若當月尚無交易日（如月初遇假日），
 * 會自動 fallback 查上個月資料。
 */

import type { MarketIndexData } from '@/types/module/market';

/** 證交所 API base — 開發走 proxy，正式直連 */
const TWSE_BASE = import.meta.env.VITE_TWSE_BASE_URL ?? '/twse';

/** 移除逗號並轉為 number */
function parseNumber(raw: string): number {
  const num = Number(raw.replace(/,/g, '').trim());
  return Number.isNaN(num) ? 0 : num;
}

/** 日期轉 yyyyMMdd */
function toDateString(d: Date): string {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}

/** 格式化時間戳 */
function formatTimestamp(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/** 證交所 FMTQIK 原始回應 */
interface TwseFmtqikResponse {
  stat: string;
  data?: string[][];
}

/** 嘗試取得指定月份的 FMTQIK 資料 */
async function fetchFmtqik(dateStr: string): Promise<TwseFmtqikResponse> {
  const res = await fetch(
    `${TWSE_BASE}/exchangeReport/FMTQIK?response=json&date=${dateStr}`,
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as TwseFmtqikResponse;
}

/**
 * 取得加權指數
 * 當月查無資料時，自動 fallback 查上個月
 */
export async function fetchTaiex(): Promise<MarketIndexData> {
  const now = new Date();
  let raw = await fetchFmtqik(toDateString(now));

  /* 當月無資料 → fallback 上個月 */
  if (raw.stat !== 'OK' || !raw.data?.length) {
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    raw = await fetchFmtqik(toDateString(prevMonth));
  }

  if (raw.stat !== 'OK' || !raw.data?.length) {
    throw new Error('證交所資料取得失敗');
  }

  const latest = raw.data[raw.data.length - 1];
  if (!latest || latest.length < 6) {
    throw new Error('證交所資料格式異常');
  }

  const closeValue = parseNumber(latest[4] ?? '0');
  const change = parseNumber(latest[5] ?? '0');
  const tradingValue = parseNumber(latest[2] ?? '0');

  return {
    name: '加權指數',
    value: closeValue,
    change,
    changePercent: closeValue - change !== 0 ? (change / (closeValue - change)) * 100 : 0,
    volume: Math.round(tradingValue / 100000000),
    updatedAt: formatTimestamp(),
  };
}
