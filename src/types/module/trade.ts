/** 交易操作類型 */
export type TradeAction = 'buy' | 'sell';

/** 操作日誌 */
export interface TradeRecord {
  id: string;
  symbol: string;
  name: string;
  action: TradeAction;
  shares: number;
  price: number;
  profitLoss: number;
  date: string;
}

/** 週期統計 */
export interface PeriodSummary {
  label: string;
  period: 'weekly' | 'monthly' | 'yearly';
  totalProfitLoss: number;
  tradeCount: number;
  winRate: number;
}
