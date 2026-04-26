/** 選股週報（列表用） */
export interface WeeklyReport {
  id: string;
  title: string;
  date: string;
  tags: string[];
  summary: string;
}

/** 記事類型 */
export type NoteCategory = 'direction' | 'indicator' | 'event';

/** 投資記事 */
export interface InvestNote {
  id: string;
  category: NoteCategory;
  title: string;
  content: string;
  date: string;
}

/** 類型標籤對應 */
export const noteCategoryLabel: Record<NoteCategory, string> = {
  direction: '操作方向',
  indicator: '市場指標',
  event: '重大事件',
};
