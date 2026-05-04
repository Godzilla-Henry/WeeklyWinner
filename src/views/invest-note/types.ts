/** 投資記事詳細頁面型別 + Mock 資料 */

import type { InvestNote } from '@/types/module/dashboard';

export type { InvestNote, NoteCategory } from '@/types/module/dashboard';
export { noteCategoryLabel } from '@/types/module/dashboard';

/** 取得記事（暫用 Mock，未來接 API） */
export function getNoteById(id: string): InvestNote | undefined {
  return notes.find((n) => n.id === id);
}

/** 取得相關記事（排除自身，最多 3 筆） */
export function getRelatedNotes(id: string, limit = 3): InvestNote[] {
  return notes.filter((n) => n.id !== id).slice(0, limit);
}

const notes: InvestNote[] = [
  {
    id: 'n1',
    category: 'direction',
    title: '短線偏多，留意量能變化',
    content:
      '加權指數站穩季線之上，短線維持偏多操作。若量能未能持續放大，建議降低追價意願，以拉回佈局為主。\n\n目前觀察重點：\n1. 成交量是否維持在 3,000 億以上\n2. 外資期貨未平倉多空比\n3. 融資餘額變化趨勢\n\n操作建議：持股 6 成，預留資金等待拉回時加碼。重點關注 AI 伺服器供應鏈與先進封裝族群。',
    date: '2026-04-25',
  },
  {
    id: 'n2',
    category: 'note',
    title: 'VIX 恐慌指數回落至 14',
    content:
      'CBOE VIX 指數從上週的 18.5 回落至 14.2，顯示市場恐慌情緒降溫，有利於風險性資產表現。\n\nVIX 指數解讀：\n- VIX < 15：市場極度樂觀，留意反轉風險\n- VIX 15-20：正常波動區間\n- VIX 20-30：市場開始緊張\n- VIX > 30：恐慌模式\n\n目前 VIX 處於低檔，短線有利多方，但需留意突發事件可能造成的急升。',
    date: '2026-04-24',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop',
  },
  {
    id: 'n3',
    category: 'event',
    title: '聯準會利率決議下週登場',
    content:
      '市場預期維持利率不變，但關注點在於點陣圖是否釋出年內降息訊號。建議決議前減少槓桿部位。\n\n時間：台灣時間 5/2（四）凌晨 2:00\n\n市場預期：\n- 維持利率不變機率 97%\n- 年內降息 1 碼機率 62%\n- 年內降息 2 碼機率 28%\n\n操作策略：決議前一日減碼至 5 成持股，待結果明朗後再行佈局。',
    date: '2026-04-23',
  },
  {
    id: 'n4',
    category: 'note',
    title: '外資連三日買超台股',
    content:
      '外資本週累計買超 285 億元，主要集中在半導體與金融權值股，為近一個月最大單週買超。\n\n買超前五大標的：\n1. 台積電 +98 億\n2. 聯發科 +42 億\n3. 富邦金 +28 億\n4. 鴻海 +22 億\n5. 中信金 +18 億\n\n外資動向為短線重要風向指標，連續買超有助於大盤維持多方格局。',
    date: '2026-04-21',
  },
];
