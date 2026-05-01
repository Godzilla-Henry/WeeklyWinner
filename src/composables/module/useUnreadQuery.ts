/**
 * 未讀數量相關 TanStack Query Composables
 */

import { computed, type Ref } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { getUnreadCounts, getUnreadCount, markAsRead, queryKeys } from '@/api';
import { getLiffIdToken } from '@/composables/shared/useLiffToken';
import type { UnreadCountsResponse, UnreadCountResponse, MarkAsReadResponse } from '@/types/api';

/** 所有類型未讀數量 */
export function useUnreadCountsQuery(): ReturnType<typeof useQuery<UnreadCountsResponse>> {
  return useQuery<UnreadCountsResponse>({
    queryKey: queryKeys.unread.counts(),
    queryFn: () => {
      const token = getLiffIdToken();
      if (!token) throw new Error('未登入');
      return getUnreadCounts(token);
    },
    enabled: computed(() => getLiffIdToken() !== null),
  });
}

/** 指定類型未讀數量 */
export function useUnreadCountQuery(
  contentType: Ref<string>,
): ReturnType<typeof useQuery<UnreadCountResponse>> {
  return useQuery<UnreadCountResponse>({
    queryKey: computed(() => queryKeys.unread.byType(contentType.value)),
    queryFn: () => {
      const token = getLiffIdToken();
      if (!token) throw new Error('未登入');
      return getUnreadCount(token, contentType.value);
    },
    enabled: computed(() => !!contentType.value && getLiffIdToken() !== null),
  });
}

/** 標記已讀 Mutation */
export function useMarkAsReadMutation(): ReturnType<
  typeof useMutation<MarkAsReadResponse, Error, { contentType: string; contentId: string }>
> {
  const queryClient = useQueryClient();

  return useMutation<MarkAsReadResponse, Error, { contentType: string; contentId: string }>({
    mutationFn: ({ contentType, contentId }) => {
      const token = getLiffIdToken();
      if (!token) throw new Error('未登入');
      return markAsRead(token, contentType, contentId);
    },
    onSuccess: () => {
      /** 標記已讀後，重新取得未讀數量 */
      void queryClient.invalidateQueries({ queryKey: queryKeys.unread.all });
    },
  });
}
