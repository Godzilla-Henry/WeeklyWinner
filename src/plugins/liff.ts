/**
 * LIFF 初始化插件
 * 在 app mount 前完成 SDK 初始化、登入狀態檢查、後端同步
 *
 * PWA standalone 模式額外處理：
 *   監聽 BroadcastChannel TOKEN_READY 訊息。
 *   當系統瀏覽器完成 LINE OAuth 後廣播通知，PWA 重新 init LIFF 完成登入同步。
 */

import { useLiff, resetLiffInitPromise } from '@/composables/useLiff';
import { login } from '@/api';
import { useAuthStore } from '@/stores/useAuthStore';
import { isStandaloneMode, listenForTokenReady } from '@/composables/shared/usePwaAuthBridge';

/** 執行後端登入同步並更新 AuthStore */
async function syncBackendLogin(): Promise<void> {
  const { fetchProfile, loggedIn } = useLiff();

  if (!loggedIn.value) return;

  await fetchProfile();

  try {
    const res = await login();
    if (res.ok && res.profile) {
      const authStore = useAuthStore();
      authStore.setProfile(res.profile);
    }
  } catch (e: unknown) {
    console.warn('登入同步失敗：', e instanceof Error ? e.message : e);
  }
}

export async function initLiff(): Promise<void> {
  const { init, loggedIn } = useLiff();

  await init();

  /* 已登入 → 直接同步後端 */
  if (loggedIn.value) {
    await syncBackendLogin();
    return;
  }

  /**
   * PWA standalone 模式 + 尚未登入：
   * 監聽系統瀏覽器完成 LINE OAuth 後的 BroadcastChannel 廣播。
   * 收到 TOKEN_READY 後重新 init LIFF，完成登入同步後重載頁面。
   */
  if (isStandaloneMode()) {
    const cleanup = listenForTokenReady(async () => {
      cleanup(); /* 只處理一次，立即取消監聽 */

      /* 重置單例鎖，讓 init() 可以重新執行並取得最新 Token */
      resetLiffInitPromise();

      const { init: reinit, loggedIn: reLoggedIn } = useLiff();
      await reinit();

      if (reLoggedIn.value) {
        await syncBackendLogin();
        /* 重新載入讓 Vue App 以登入狀態重新渲染 */
        window.location.reload();
      }
    });
  }
}
