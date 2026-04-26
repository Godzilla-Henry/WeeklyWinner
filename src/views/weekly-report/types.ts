/** 週報詳細頁面的 Mock 資料 */

import type { WeeklyReportDetail } from '@/types/module/report';

export function getReportById(id: string): WeeklyReportDetail | undefined {
  return reports.find((r) => r.id === id);
}

const reports: WeeklyReportDetail[] = [
  {
    id: '0426',
    title: '04/26 選股週報',
    date: '2026-04-26',
    summary: '台積電技術論壇揭露A16至A12的埃米世代最新製程,相關設備廠務、先進測試、CPO等都是最大受惠,惟因短線漲多,漲幅乖離過大必然修正,看好拉回守穩再上。',
    content: '主動式ETF近期績效佳,台積電條款解禁也具有話題性,第二季法人作帳行情已提前啟動,另外本週有台達電、聯發科、旺宏等召開法說會,關注重點在AI和記憶體展望。',
    tags: ['均華', '中探針',],
    selections: [
      { symbol: '6640', name: '均華', type: '主力買進', industry: 'AI 先進封裝，CoWos', fundamental: '3月營收年增達250.1%，累計前3月營收年增93%', technical: '站上五周均線, 但不符合666', closePrice: 1505, ma20: 1510.75, monthlyBias: 0, targetPrice: 1760 },
      { symbol: '6217', name: '中探針', type: '技術面強勢', industry: '半導體測試、電動車（EV）及消費性電子', fundamental: '1月營收顯著年增，顯示佈局開始收割。近期毛利率約在 16-17% 水準。', technical: '站上所有短期均線，符合666', closePrice: 295, ma20: 284.9, monthlyBias: 3.5, targetPrice: 850 },
    ],
  },
  {
    id: '0419',
    title: '04/19 選股週報',
    date: '2026-04-19',
    summary: 'AI 伺服器需求持續攀升，輝達新一代晶片帶動台系 ODM 廠訂單能見度延伸至 Q3，科技股維持偏多格局。',
    content: '本週市場聚焦 AI 基礎建設擴張，台積電法說會釋出正面展望，帶動半導體供應鏈全面走強。建議投資人關注具備 AI 伺服器代工能力的 ODM 廠，以及先進封裝相關標的。',
    tags: ['營邦', '精測', '勤誠', '順達'],
    selections: [
      { symbol: '3693', name: '營邦', type: '技術面強勢', industry: 'AI 機殼櫃、AI 儲存平台', fundamental: '- -', technical: '- -', closePrice: 662, ma20: 540.6, monthlyBias: 22.5, targetPrice: 800 },
      { symbol: '6510', name: '精測', type: '主力買進', industry: 'AI晶片、先進測試', fundamental: 'EPS爆發成長', technical: '- -', closePrice: 3740, ma20: 3381.25, monthlyBias: 10.6, targetPrice: 0 },
      { symbol: '8210', name: '勤誠', type: '技術面轉強', industry: 'AI 機殼櫃', fundamental: 'EPS 穩定成長', technical: '- -', closePrice: 1020, ma20: 908.7, monthlyBias: 12.2, targetPrice: 1280 },
      { symbol: '3211', name: '順達', type: '技術面轉強', industry: 'BBU 電池', fundamental: '- - ', technical: '- -', closePrice: 359, ma20: 347.27, monthlyBias: 3.4, targetPrice: 400 },
    ],
  },
];
