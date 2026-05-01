/**
 * 未讀數量 API
 */

import { http } from '@/api/http';
import type {
  UnreadCountsResponse,
  UnreadCountResponse,
  MarkAsReadResponse,
} from '@/types/api';

/** 取得所有類型未讀數量 */
export function getUnreadCounts(idToken: string): Promise<UnreadCountsResponse> {
  return http.get<UnreadCountsResponse>('/unread-count', idToken);
}

/** 取得指定類型未讀數量 */
export function getUnreadCount(
  idToken: string,
  contentType: string,
): Promise<UnreadCountResponse> {
  return http.get<UnreadCountResponse>(`/unread-count/${contentType}`, idToken);
}

/** 標記內容已讀 */
export function markAsRead(
  idToken: string,
  contentType: string,
  contentId: string,
): Promise<MarkAsReadResponse> {
  return http.post<MarkAsReadResponse>('/mark-as-read', idToken, { contentType, contentId });
}
