/** 交易操作類型 */
type TradeAction = 'buy' | 'sell';

/** 操作日誌 */
interface TradeRecord {
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
interface PeriodSummary {
  label: string;
  period: 'weekly' | 'monthly' | 'yearly';
  totalProfitLoss: number;
  tradeCount: number;
  winRate: number;
}
