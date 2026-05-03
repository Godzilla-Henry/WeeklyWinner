/**
 * LIFF 登入狀態響應式封裝
 * 提供給 TanStack Query 的 enabled 使用
 */

import { computed, type ComputedRef } from 'vue';
import { useLiff } from '@/composables/useLiff';

/** 響應式 — 是否已登入（供 Query enabled 使用） */
export function useIsLiffLoggedIn(): ComputedRef<boolean> {
  const { loggedIn } = useLiff();
  return computed(() => loggedIn.value);
}
