/**
 * 認證相關 TanStack Query Composable
 */

import { useMutation } from '@tanstack/vue-query';
import { login } from '@/api';
import type { LoginResponse } from '@/types/api';

/** 登入同步 Mutation — App 啟動時呼叫一次 */
export function useLoginMutation(): ReturnType<typeof useMutation<LoginResponse, Error>> {
  return useMutation<LoginResponse, Error>({
    mutationFn: () => login(),
  });
}
