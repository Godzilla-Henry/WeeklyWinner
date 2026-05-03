/**
 * 未讀 / 已讀狀態 TanStack Query Composables
 */

import { computed, type Ref } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { getUnreadCounts, getUnreadCount, getReadStatus, markAsRead, queryKeys } from '@/api';
import { useIsLiffLoggedIn } from '@/composables/shared/useLiffToken';
import type {
  UnreadCountsResponse,
  UnreadCountResponse,
  ReadStatusResponse,
  MarkAsReadResponse,
} from '@/types/api';

/** 所有類型未讀數量（每 60 秒自動刷新） */
export function useUnreadCountsQuery(): ReturnType<typeof useQuery<UnreadCountsResponse>> {
  const isLoggedIn = useIsLiffLoggedIn();

  return useQuery<UnreadCountsResponse>({
    queryKey: queryKeys.unread.counts(),
    queryFn: () => getUnreadCounts(),
    enabled: isLoggedIn,
    refetchInterval: 60_000,
  });
}

/** 指定類型未讀數量 */
export function useUnreadCountQuery(
  contentType: Ref<string>,
): ReturnType<typeof useQuery<UnreadCountResponse>> {
  const isLoggedIn = useIsLiffLoggedIn();

  return useQuery<UnreadCountResponse>({
    queryKey: computed(() => queryKeys.unread.byType(contentType.value)),
    queryFn: () => getUnreadCount(contentType.value),
    enabled: computed(() => !!contentType.value && isLoggedIn.value),
  });
}

/** 批次已讀狀態（列表頁紅點用） */
export function useReadStatusQuery(
  contentType: string,
): ReturnType<typeof useQuery<ReadStatusResponse>> {
  const isLoggedIn = useIsLiffLoggedIn();

  return useQuery<ReadStatusResponse>({
    queryKey: queryKeys.readStatus.byType(contentType),
    queryFn: () => getReadStatus(contentType),
    enabled: isLoggedIn,
  });
}

/** 標記已讀 Mutation */
export function useMarkAsReadMutation(): ReturnType<
  typeof useMutation<MarkAsReadResponse, Error, { contentType: string; contentId: string }>
> {
  const queryClient = useQueryClient();

  return useMutation<MarkAsReadResponse, Error, { contentType: string; contentId: string }>({
    mutationFn: ({ contentType, contentId }) => markAsRead(contentType, contentId),
    onSuccess: (_data, variables) => {
      /* 更新全域 Badge 數字 */
      void queryClient.invalidateQueries({ queryKey: queryKeys.unread.all });
      /* 更新列表頁紅點狀態 */
      void queryClient.invalidateQueries({
        queryKey: queryKeys.readStatus.byType(variables.contentType),
      });
    },
  });
}
