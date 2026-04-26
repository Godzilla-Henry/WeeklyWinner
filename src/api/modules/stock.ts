/**
 * 台股加權指數 API 模組
 *
 * 資料來源：證交所 TWSE FMTQIK（每月各日成交資訊）
 * 欄位順序：日期, 成交股數, 成交金額, 成交筆數, 發行量加權股價指數, 漲跌點數
 */

import publicRequest from '@/api/publicRequest';
import type { MarketIndexData } from '@/types/module/market';

/** 證交所 API base — 開發走 proxy，正式直連 */
const TWSE_BASE = import.meta.env.VITE_TWSE_BASE_URL ?? '/twse';

/** 移除逗號並轉為 number */
function parseNumber(raw: string): number {
  const num = Number(raw.replace(/,/g, '').trim());
  return Number.isNaN(num) ? 0 : num;
}

/** 今日日期 yyyyMMdd */
function getTodayString(): string {
  const d = new Date();
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
  data: string[][];
}

/**
 * 取得加權指數
 * data 每列：[日期, 成交股數, 成交金額, 成交筆數, 發行量加權股價指數, 漲跌點數]
 */
export async function fetchTaiex(): Promise<MarketIndexData> {
  const res = await publicRequest.get<TwseFmtqikResponse>(
    `${TWSE_BASE}/exchangeReport/FMTQIK?response=json&date=${getTodayString()}`,
  );

  const raw = res.data;
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
