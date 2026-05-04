/** 週報摘要（列表用） — 重新匯出 API 型別 */
export type { WeeklyReport } from '@/types/api';

/** 記事類型 */
export type NoteCategory = 'direction' | 'note' | 'event';

/** 投資記事 */
export interface InvestNote {
  id: string;
  category: NoteCategory;
  title: string;
  content: string;
  date: string;
  /** 封面圖片（可選） */
  imageUrl?: string;
}

/** 類型標籤對應 */
export const noteCategoryLabel: Record<NoteCategory, string> = {
  direction: '操作方向',
  note: '技術分享',
  event: '重大事件',
};
