/**
 * 收益記錄 TanStack Query Composables
 * 需登入後才能查詢
 */

import { computed, type Ref } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import {
  getProfitRecords,
  createProfitRecord,
  updateProfitRecord,
  deleteProfitRecord,
  queryKeys,
} from '@/api';
import { useIsLiffLoggedIn } from '@/composables/shared/useLiffToken';
import type {
  ProfitRecordsResponse,
  ProfitRecordResponse,
} from '@/types/api';
import type { ProfitRecordForm } from '@/types/module/records';

/** 收益記錄列表 */
export function useProfitRecordsQuery(
  year: Ref<number>,
  month?: Ref<number | undefined>,
): ReturnType<typeof useQuery<ProfitRecordsResponse>> {
  const isLoggedIn = useIsLiffLoggedIn();

  return useQuery<ProfitRecordsResponse>({
    queryKey: computed(() =>
      queryKeys.profitRecords.list(year.value, month?.value),
    ),
    queryFn: () => getProfitRecords(year.value, month?.value),
    enabled: isLoggedIn,
  });
}

/** 年度全部記錄（不篩月份，用於長條圖） */
export function useYearProfitRecordsQuery(
  year: Ref<number>,
): ReturnType<typeof useQuery<ProfitRecordsResponse>> {
  const isLoggedIn = useIsLiffLoggedIn();

  return useQuery<ProfitRecordsResponse>({
    queryKey: computed(() => queryKeys.profitRecords.list(year.value, undefined)),
    queryFn: () => getProfitRecords(year.value),
    enabled: isLoggedIn,
  });
}

/** 新增收益記錄 */
export function useCreateProfitRecord(): ReturnType<typeof useMutation<ProfitRecordResponse, Error, ProfitRecordForm>> {
  const queryClient = useQueryClient();

  return useMutation<ProfitRecordResponse, Error, ProfitRecordForm>({
    mutationFn: (form: ProfitRecordForm) => createProfitRecord(form),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.profitRecords.all });
    },
  });
}

/** 更新收益記錄 */
export function useUpdateProfitRecord(): ReturnType<typeof useMutation<ProfitRecordResponse, Error, { id: string; form: Partial<ProfitRecordForm> }>> {
  const queryClient = useQueryClient();

  return useMutation<ProfitRecordResponse, Error, { id: string; form: Partial<ProfitRecordForm> }>({
    mutationFn: ({ id, form }) => updateProfitRecord(id, form),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.profitRecords.all });
    },
  });
}

/** 刪除收益記錄 */
export function useDeleteProfitRecord(): ReturnType<typeof useMutation<{ ok: boolean }, Error, string>> {
  const queryClient = useQueryClient();

  return useMutation<{ ok: boolean }, Error, string>({
    mutationFn: (id: string) => deleteProfitRecord(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.profitRecords.all });
    },
  });
}
