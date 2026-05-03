/**
 * 未讀 / 已讀狀態 API（需認證）
 */

import { http } from '@/api/http';
import type {
  UnreadCountsResponse,
  UnreadCountResponse,
  ReadStatusResponse,
  MarkAsReadResponse,
} from '@/types/api';

/** 取得所有類型未讀數量彙總 */
export function getUnreadCounts(): Promise<UnreadCountsResponse> {
  return http.get<UnreadCountsResponse>('/unread-count');
}

/** 取得指定類型未讀數量 */
export function getUnreadCount(contentType: string): Promise<UnreadCountResponse> {
  return http.get<UnreadCountResponse>(`/unread-count/${contentType}`);
}

/** 批次查詢已讀狀態（列表頁紅點用） */
export function getReadStatus(contentType: string): Promise<ReadStatusResponse> {
  return http.get<ReadStatusResponse>(`/read-status/${contentType}`);
}

/** 標記內容已讀 */
export function markAsRead(contentType: string, contentId: string): Promise<MarkAsReadResponse> {
  return http.post<MarkAsReadResponse>('/mark-as-read', { contentType, contentId });
}
