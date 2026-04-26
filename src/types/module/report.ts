/** 選股標的類型 */
export type StockType = '多方' | '空方' | '觀望';

/** 選股標的 */
export interface StockSelection {
  symbol: string;
  name: string;
  type: StockType;
  industry: string;
  fundamental: string;
  technical: string;
  closePrice: number;
  ma20: number;
  monthlyBias: number;
  targetPrice: number;
}

/** 週報詳細資料 */
export interface WeeklyReportDetail {
  id: string;
  title: string;
  date: string;
  summary: string;
  content: string;
  tags: string[];
  selections: StockSelection[];
}
