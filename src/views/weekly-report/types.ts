/** 週報詳細頁面的 Mock 資料 */

export function getReportById(id: string): WeeklyReportDetail | undefined {
  return reports.find((r) => r.id === id);
}

const reports: WeeklyReportDetail[] = [
  {
    id: '0419',
    title: '04/19 選股週報',
    date: '2026-04-19',
    summary: 'AI 伺服器需求持續攀升，輝達新一代晶片帶動台系 ODM 廠訂單能見度延伸至 Q3，科技股維持偏多格局。',
    content: '本週市場聚焦 AI 基礎建設擴張，台積電法說會釋出正面展望，帶動半導體供應鏈全面走強。建議投資人關注具備 AI 伺服器代工能力的 ODM 廠，以及先進封裝相關標的。',
    tags: ['台積電', '聯發科', '廣達', '緯創'],
    selections: [
      { symbol: '2330', name: '台積電', type: '多方', industry: '半導體', fundamental: '營收創高', technical: '站穩季線', closePrice: 908, ma20: 885, monthlyBias: 2.6, targetPrice: 1000 },
      { symbol: '2454', name: '聯發科', type: '多方', industry: '半導體', fundamental: 'AI 晶片放量', technical: '突破前高', closePrice: 1245, ma20: 1198, monthlyBias: 3.9, targetPrice: 1400 },
      { symbol: '2382', name: '廣達', type: '多方', industry: 'ODM', fundamental: 'GB200 出貨', technical: '量增價揚', closePrice: 328, ma20: 310, monthlyBias: 5.8, targetPrice: 380 },
      { symbol: '3231', name: '緯創', type: '觀望', industry: 'ODM', fundamental: '毛利率待觀察', technical: '整理格局', closePrice: 118, ma20: 122, monthlyBias: -3.3, targetPrice: 135 },
    ],
  },
  {
    id: '0412',
    title: '04/12 選股週報',
    date: '2026-04-12',
    summary: '電動車與 AI 雙引擎驅動，功率半導體與封測族群營收季增雙位數，留意拉回佈局時機。',
    content: '車用半導體庫存回補啟動，歐美車廠拉貨動能回溫。封測產業受惠於 AI 晶片先進封裝需求，產能利用率持續攀升。',
    tags: ['鴻海', '台達電', '日月光'],
    selections: [
      { symbol: '2317', name: '鴻海', type: '多方', industry: '電子代工', fundamental: 'AI 伺服器營收佔比提升', technical: '月線支撐', closePrice: 198, ma20: 192, monthlyBias: 3.1, targetPrice: 230 },
      { symbol: '2308', name: '台達電', type: '多方', industry: '電源', fundamental: 'AI 電源需求強勁', technical: '創歷史新高', closePrice: 425, ma20: 408, monthlyBias: 4.2, targetPrice: 480 },
      { symbol: '3711', name: '日月光', type: '觀望', industry: '封測', fundamental: '先進封裝產能滿載', technical: '區間整理', closePrice: 168, ma20: 172, monthlyBias: -2.3, targetPrice: 195 },
    ],
  },
  {
    id: '0405',
    title: '04/05 選股週報',
    date: '2026-04-05',
    summary: '央行利率決議維持不變，市場預期下半年降息機率升高，壽險股短線承壓但長線具配息吸引力。',
    content: '金融股本週受利率政策影響表現分歧，壽險股因債券評價壓力短線走弱，但銀行股受惠於利差擴大表現穩健。',
    tags: ['富邦金', '國泰金', '中信金'],
    selections: [
      { symbol: '2881', name: '富邦金', type: '觀望', industry: '金融', fundamental: '壽險避險成本高', technical: '跌破月線', closePrice: 68.5, ma20: 71.2, monthlyBias: -3.8, targetPrice: 78 },
      { symbol: '2882', name: '國泰金', type: '多方', industry: '金融', fundamental: '銀行獲利穩健', technical: '月線支撐', closePrice: 58.3, ma20: 57.1, monthlyBias: 2.1, targetPrice: 65 },
      { symbol: '2891', name: '中信金', type: '多方', industry: '金融', fundamental: '股利政策優', technical: '底部翻揚', closePrice: 32.8, ma20: 31.5, monthlyBias: 4.1, targetPrice: 38 },
    ],
  },
  {
    id: '0331',
    title: '03/31 選股週報',
    date: '2026-03-31',
    summary: '紅海危機持續推升運價，貨櫃三雄 Q1 獲利優於預期，關注旺季前的運價走勢。',
    content: '航運股受惠於紅海繞道效應，運價維持高檔。貨櫃三雄 Q1 獲利大幅優於市場預期，但需留意運價回落風險。',
    tags: ['長榮', '陽明', '萬海'],
    selections: [
      { symbol: '2603', name: '長榮', type: '多方', industry: '航運', fundamental: 'Q1 EPS 超預期', technical: '帶量突破', closePrice: 178, ma20: 165, monthlyBias: 7.9, targetPrice: 210 },
      { symbol: '2609', name: '陽明', type: '觀望', industry: '航運', fundamental: '獲利改善', technical: '壓力區間', closePrice: 72.5, ma20: 70.8, monthlyBias: 2.4, targetPrice: 85 },
      { symbol: '2615', name: '萬海', type: '空方', industry: '航運', fundamental: '運價敏感度高', technical: '跌破支撐', closePrice: 68.2, ma20: 73.5, monthlyBias: -7.2, targetPrice: 60 },
    ],
  },
];
