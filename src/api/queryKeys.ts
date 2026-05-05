/**
 * TanStack Query Key 工廠
 * 集中管理所有 query key，確保快取一致性
 */

import type { NoteCategory } from '@/types/api';

export const queryKeys = {
  /** 週報相關 */
  reports: {
    all: ['reports'] as const,
    list: (page: number, limit: number) => ['reports', 'list', { page, limit }] as const,
    detail: (id: string) => ['reports', 'detail', id] as const,
  },

  /** 投資記事 */
  investNotes: {
    all: ['investNotes'] as const,
    list: (page: number, limit: number, category?: NoteCategory) =>
      ['investNotes', 'list', { page, limit, category }] as const,
    detail: (id: string) => ['investNotes', 'detail', id] as const,
  },

  /** 未讀 / 已讀狀態 */
  unread: {
    all: ['unread'] as const,
    counts: () => ['unread', 'counts'] as const,
    byType: (contentType: string) => ['unread', contentType] as const,
  },

  /** 已讀狀態（列表頁紅點） */
  readStatus: {
    all: ['readStatus'] as const,
    byType: (contentType: string) => ['readStatus', contentType] as const,
  },

  /** 認證 */
  auth: {
    profile: ['auth', 'profile'] as const,
  },

  /** 台股指數 */
  market: {
    taiex: ['market', 'taiex'] as const,
  },

  /** 收益記錄 */
  profitRecords: {
    all: ['profitRecords'] as const,
    list: (year?: number, month?: number) =>
      ['profitRecords', 'list', { year, month }] as const,
  },

  /** 年度目標 */
  yearlyGoals: {
    all: ['yearlyGoals'] as const,
    byYear: (year: number) => ['yearlyGoals', year] as const,
  },
};
