/**
 * 年度目標 TanStack Query Composables
 * 需登入後才能查詢
 */

import { computed, type Ref } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { getYearlyGoals, upsertYearlyGoal, queryKeys } from '@/api';
import { useIsLiffLoggedIn } from '@/composables/shared/useLiffToken';
import type { YearlyGoalsResponse, YearlyGoalResponse } from '@/types/api';

/** 取得年度目標列表 */
export function useYearlyGoalsQuery(
  year?: Ref<number>,
): ReturnType<typeof useQuery<YearlyGoalsResponse>> {
  const isLoggedIn = useIsLiffLoggedIn();

  return useQuery<YearlyGoalsResponse>({
    queryKey: computed(() =>
      year ? queryKeys.yearlyGoals.byYear(year.value) : queryKeys.yearlyGoals.all,
    ),
    queryFn: () => getYearlyGoals(year?.value),
    enabled: isLoggedIn,
  });
}

/** 設定或更新年度目標 */
export function useUpsertYearlyGoal(): ReturnType<typeof useMutation<YearlyGoalResponse, Error, { year: number; targetAmount: number }>> {
  const queryClient = useQueryClient();

  return useMutation<YearlyGoalResponse, Error, { year: number; targetAmount: number }>({
    mutationFn: ({ year, targetAmount }) => upsertYearlyGoal(year, targetAmount),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.yearlyGoals.all });
    },
  });
}
