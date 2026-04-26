/** 集中管理所有模擬資料 */

export function useMarketIndices(): MarketIndex[] {
  return [
    { name: '加權指數', value: 22856.72, change: 156.38, changePercent: 0.69, volume: 3842, updatedAt: '2026-04-25 13:30' },
    { name: '櫃買指數', value: 235.18, change: -2.41, changePercent: -1.01, volume: 1023, updatedAt: '2026-04-25 13:30' },
    { name: '電子類指數', value: 1128.56, change: 22.14, changePercent: 2.0, volume: 2156, updatedAt: '2026-04-25 13:30' },
    { name: '金融類指數', value: 1876.33, change: -8.72, changePercent: -0.46, volume: 487, updatedAt: '2026-04-25 13:30' },
  ];
}

export function useWeeklyNews(): WeeklyNews[] {
  return [
    { id: '1', title: 'AI 伺服器需求持續攀升', direction: '看多科技股', summary: '輝達新一代晶片帶動供應鏈，台系 ODM 廠訂單能見度延伸至 Q3。', publishedAt: '2026-04-25' },
    { id: '2', title: '央行利率決議維持不變', direction: '金融股觀望', summary: '市場預期下半年降息機率升高，壽險股短線承壓。', publishedAt: '2026-04-24' },
    { id: '3', title: '車用半導體庫存回補啟動', direction: '留意車電族群', summary: '歐美車廠拉貨動能回溫，功率半導體廠營收有望季增雙位數。', publishedAt: '2026-04-23' },
  ];
}

export function useStockQuote(): StockQuote {
  return {
    symbol: '2330',
    name: '台積電',
    open: 895,
    high: 912,
    low: 890,
    close: 908,
    prevClose: 892,
    volume: 42568,
    change: 16,
    changePercent: 1.79,
    updatedAt: '2026-04-25 13:30',
  };
}

export function useCompanyInfo(): CompanyInfo {
  return {
    symbol: '2330',
    name: '台積電',
    industry: '半導體',
    description: '全球最大專業積體電路製造服務公司，提供業界最先進的製程技術，客戶涵蓋全球各大 IC 設計公司。',
    marketCap: 23520000,
    pe: 28.5,
    eps: 31.85,
    dividendYield: 1.42,
    roe: 26.8,
  };
}
