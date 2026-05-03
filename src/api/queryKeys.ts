/**
 * TanStack Query Key 工廠
 * 集中管理所有 query key，確保快取一致性
 */

export const queryKeys = {
  /** 週報相關 */
  reports: {
    all: ['reports'] as const,
    list: (page: number, limit: number) => ['reports', 'list', { page, limit }] as const,
    detail: (id: string) => ['reports', 'detail', id] as const,
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
};
