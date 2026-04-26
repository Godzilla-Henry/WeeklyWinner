/** 資產分析與交易紀錄模擬資料 */

import type { TradeRecord, PeriodSummary } from '@/types/module/trade';

export function useHoldings(): HoldingItem[] {
  return [
    { symbol: '2330', name: '台積電', shares: 5000, avgCost: 850, currentPrice: 908, profitLoss: 290000, profitLossPercent: 6.82, weight: 42 },
    { symbol: '2454', name: '聯發科', shares: 2000, avgCost: 1180, currentPrice: 1245, profitLoss: 130000, profitLossPercent: 5.51, weight: 23 },
    { symbol: '2881', name: '富邦金', shares: 10000, avgCost: 72, currentPrice: 68.5, profitLoss: -35000, profitLossPercent: -4.86, weight: 6 },
    { symbol: '3008', name: '大立光', shares: 500, avgCost: 2350, currentPrice: 2480, profitLoss: 65000, profitLossPercent: 5.53, weight: 11 },
    { symbol: '2603', name: '長榮', shares: 8000, avgCost: 165, currentPrice: 178, profitLoss: 104000, profitLossPercent: 7.88, weight: 13 },
    { symbol: '6505', name: '台塑化', shares: 3000, avgCost: 58, currentPrice: 55.2, profitLoss: -8400, profitLossPercent: -4.83, weight: 5 },
  ];
}

export function useTradeRecords(): TradeRecord[] {
  return [
    { id: '1', symbol: '2330', name: '台積電', action: 'buy', shares: 1000, price: 895, profitLoss: 0, date: '2026-04-25' },
    { id: '2', symbol: '2454', name: '聯發科', action: 'sell', shares: 500, price: 1245, profitLoss: 32500, date: '2026-04-24' },
    { id: '3', symbol: '2881', name: '富邦金', action: 'buy', shares: 5000, price: 68.5, profitLoss: 0, date: '2026-04-23' },
    { id: '4', symbol: '2603', name: '長榮', action: 'sell', shares: 2000, price: 178, profitLoss: 26000, date: '2026-04-22' },
    { id: '5', symbol: '3008', name: '大立光', action: 'buy', shares: 200, price: 2480, profitLoss: 0, date: '2026-04-21' },
    { id: '6', symbol: '2330', name: '台積電', action: 'sell', shares: 2000, price: 910, profitLoss: 120000, date: '2026-04-18' },
  ];
}

export function usePeriodSummaries(): PeriodSummary[] {
  return [
    { label: '本週', period: 'weekly', totalProfitLoss: 58500, tradeCount: 6, winRate: 66.7 },
    { label: '本月', period: 'monthly', totalProfitLoss: 245800, tradeCount: 23, winRate: 60.9 },
    { label: '今年', period: 'yearly', totalProfitLoss: 1823400, tradeCount: 156, winRate: 58.3 },
  ];
}
