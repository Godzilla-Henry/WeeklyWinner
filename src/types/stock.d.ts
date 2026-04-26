/** 大盤指數資料 */
interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
  volume: number;
  updatedAt: string;
}

/** 週報消息 */
interface WeeklyNews {
  id: string;
  title: string;
  direction: string;
  summary: string;
  publishedAt: string;
}

/** K 線單根資料 */
interface CandlestickData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/** 股票報價 */
interface StockQuote {
  symbol: string;
  name: string;
  open: number;
  high: number;
  low: number;
  close: number;
  prevClose: number;
  volume: number;
  change: number;
  changePercent: number;
  updatedAt: string;
}

/** 公司資訊 */
interface CompanyInfo {
  symbol: string;
  name: string;
  industry: string;
  description: string;
  marketCap: number;
  pe: number;
  eps: number;
  dividendYield: number;
  roe: number;
}

/** 持股明細 */
interface HoldingItem {
  symbol: string;
  name: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  profitLoss: number;
  profitLossPercent: number;
  weight: number;
}
