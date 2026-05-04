/** 週報摘要（列表用） — 重新匯出 API 型別 */
export type { WeeklyReport } from '@/types/api';

/** 投資記事型別 — 重新匯出 API 型別 */
export type { NoteCategory, InvestNoteSummary, InvestNoteDetail } from '@/types/api';

/** 類型標籤對應 */
export const noteCategoryLabel: Record<
  import('@/types/api').NoteCategory,
  string
> = {
  direction: '操作方向',
  note: '技術分享',
  event: '重大事件',
};
