/**
 * LIFF 初始化插件
 * 在 app mount 前完成 SDK 初始化、登入狀態檢查、後端同步
 */

import { useLiff } from '@/composables/useLiff';
import { login } from '@/api';
import { useAuthStore } from '@/stores/useAuthStore';

export async function initLiff(): Promise<void> {
  const { init, fetchProfile, loggedIn } = useLiff();

  await init();

  if (!loggedIn.value) return;

  /* 已登入 → 載入 LIFF Profile */
  await fetchProfile();

  /* 後端登入同步（失敗不阻擋 App 掛載，由 http.ts 處理重新登入） */
  try {
    const res = await login();
    if (res.ok && res.profile) {
      const authStore = useAuthStore();
      authStore.setProfile(res.profile);
    }
  } catch (e: unknown) {
    console.warn('登入同步失敗：', e instanceof Error ? e.message : e);
    /* 不在這裡觸發 forceReLogin，交給 http.ts 統一處理 */
  }
}
