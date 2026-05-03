/**
 * 週報相關 TanStack Query Composables
 * 需登入後才能查詢
 */

import { computed, type Ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { getReports, getReportDetail, queryKeys } from '@/api';
import { useIsLiffLoggedIn } from '@/composables/shared/useLiffToken';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import type { ReportsResponse, ReportDetailResponse } from '@/types/api';

/** 週報列表 */
export function useReportsQuery(
  page: Ref<number>,
  limit: Ref<number> | number = DEFAULT_PAGE_SIZE,
): ReturnType<typeof useQuery<ReportsResponse>> {
  const isLoggedIn = useIsLiffLoggedIn();
  const resolvedLimit = computed(() => (typeof limit === 'number' ? limit : limit.value));

  return useQuery<ReportsResponse>({
    queryKey: computed(() => queryKeys.reports.list(page.value, resolvedLimit.value)),
    queryFn: () => getReports(page.value, resolvedLimit.value),
    enabled: isLoggedIn,
  });
}

/** 週報詳情 */
export function useReportDetailQuery(
  reportId: Ref<string>,
): ReturnType<typeof useQuery<ReportDetailResponse>> {
  const isLoggedIn = useIsLiffLoggedIn();

  return useQuery<ReportDetailResponse>({
    queryKey: computed(() => queryKeys.reports.detail(reportId.value)),
    queryFn: () => getReportDetail(reportId.value),
    enabled: computed(() => !!reportId.value && isLoggedIn.value),
  });
}
