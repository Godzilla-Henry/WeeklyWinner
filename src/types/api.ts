/**
 * 後端 API 型別定義
 * 所有欄位已轉換為 camelCase（後端回傳 snake_case）
 */

/** 選股類型 */
export type StockType = '技術面強勢' | '技術面轉強' | '主力買進';

/** 選股標的 */
export interface StockSelection {
  id: string;
  reportId: string;
  symbol: string;
  name: string;
  type: StockType;
  industry: string;
  fundamental: string;
  technical: string;
  closePrice: number;
  ma20: number;
  monthlyBias: number;
  targetPrice: number;
  createdAt: string;
}

/** 週報摘要（列表用，不含選股標的） */
export interface WeeklyReport {
  id: string;
  title: string;
  date: string;
  summary: string;
  content: string;
  tags: string[];
  createdAt: string;
}

/** 週報詳情（含選股標的） */
export interface WeeklyReportDetail extends WeeklyReport {
  selections: StockSelection[];
}

/** 用戶 Profile */
export interface Profile {
  id: string;
  name: string;
  avatar: string | null;
  createdAt: string;
}

/** 未讀數量彙總 */
export interface UnreadCounts {
  weeklyReport: number;
  total: number;
}

/** 已讀紀錄 */
export interface ReadLog {
  id: string;
  userId: string;
  contentType: string;
  contentId: string;
  readAt: string;
}

/* ── API 回應結構 ── */

/** 通用 API 回應 */
export interface ApiResponse<T = unknown> {
  ok: boolean;
  error?: string;
  [key: string]: T | boolean | string | undefined;
}

/** 週報列表回應 */
export interface ReportsResponse {
  ok: boolean;
  reports: WeeklyReport[];
  total: number;
}

/** 週報詳情回應 */
export interface ReportDetailResponse {
  ok: boolean;
  report: WeeklyReportDetail;
}

/** 登入回應 */
export interface LoginResponse {
  ok: boolean;
  profile: Profile;
}

/** 未讀數量回應（彙總） */
export interface UnreadCountsResponse {
  ok: boolean;
  counts: {
    weekly_report: number;
    total: number;
  };
}

/** 指定類型未讀數量回應 */
export interface UnreadCountResponse {
  ok: boolean;
  contentType: string;
  unreadCount: number;
}

/** 標記已讀回應 */
export interface MarkAsReadResponse {
  ok: boolean;
  readLog: ReadLog;
}
