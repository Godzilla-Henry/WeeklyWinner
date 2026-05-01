/**
 * 週報相關 TanStack Query Composables
 */

import { computed, type Ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { getReports, getReportDetail, queryKeys } from '@/api';
import { getLiffIdToken } from '@/composables/shared/useLiffToken';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import type { ReportsResponse, ReportDetailResponse } from '@/types/api';

/** 週報列表 */
export function useReportsQuery(
  page: Ref<number>,
  limit: Ref<number> | number = DEFAULT_PAGE_SIZE,
): ReturnType<typeof useQuery<ReportsResponse>> {
  const resolvedLimit = computed(() => (typeof limit === 'number' ? limit : limit.value));

  return useQuery<ReportsResponse>({
    queryKey: computed(() => queryKeys.reports.list(page.value, resolvedLimit.value)),
    queryFn: () => {
      const token = getLiffIdToken();
      if (!token) throw new Error('未登入');
      return getReports(token, page.value, resolvedLimit.value);
    },
    enabled: computed(() => getLiffIdToken() !== null),
  });
}

/** 週報詳情 */
export function useReportDetailQuery(
  reportId: Ref<string>,
): ReturnType<typeof useQuery<ReportDetailResponse>> {
  return useQuery<ReportDetailResponse>({
    queryKey: computed(() => queryKeys.reports.detail(reportId.value)),
    queryFn: () => {
      const token = getLiffIdToken();
      if (!token) throw new Error('未登入');
      return getReportDetail(token, reportId.value);
    },
    enabled: computed(() => !!reportId.value && getLiffIdToken() !== null),
  });
}
