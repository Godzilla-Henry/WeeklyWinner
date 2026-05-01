/**
 * 認證相關 TanStack Query Composable
 */

import { useMutation } from '@tanstack/vue-query';
import { login } from '@/api';
import { getLiffIdToken } from '@/composables/shared/useLiffToken';
import type { LoginResponse } from '@/types/api';

/** 登入同步 Mutation */
export function useLoginMutation(): ReturnType<typeof useMutation<LoginResponse, Error>> {
  return useMutation<LoginResponse, Error>({
    mutationFn: () => {
      const token = getLiffIdToken();
      if (!token) throw new Error('未登入 LINE');
      return login(token);
    },
  });
}
