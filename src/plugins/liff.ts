/**
 * LIFF 初始化插件
 * 在 app mount 前完成 SDK 初始化與登入狀態檢查
 */

import { useLiff } from '@/composables/useLiff';

export async function initLiff(): Promise<void> {
  const { init, fetchProfile, loggedIn } = useLiff();

  await init();

  /* 已登入則預先載入使用者資料 */
  if (loggedIn.value) {
    await fetchProfile();
  }
}
