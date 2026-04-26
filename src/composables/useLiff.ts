/**
 * LIFF SDK 封裝 — 單例模式
 *
 * 職責：
 * - 初始化 LIFF SDK（僅瀏覽器端）
 * - 登入狀態檢查與自動導向
 * - 使用者資料取得
 * - LINE 內建瀏覽器 vs 外部瀏覽器差異處理
 */

import { ref, readonly } from 'vue';
import liff from '@line/liff';
import { LIFF_ID } from '@/constants';

/* ── 響應式狀態 ── */
const initialized = ref(false);
const loggedIn = ref(false);
const inClient = ref(false);
const profile = ref<LiffUserProfile | null>(null);
const error = ref<string | null>(null);
const loading = ref(false);

/* ── 單例鎖 ── */
let initPromise: Promise<void> | null = null;

/**
 * 初始化 LIFF SDK
 * 使用單例模式，多次呼叫只會執行一次
 */
function init(): Promise<void> {
  if (initPromise) return initPromise;

  /* 僅在瀏覽器端執行 */
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  loading.value = true;
  error.value = null;

  initPromise = liff
    .init({ liffId: LIFF_ID })
    .then(() => {
      initialized.value = true;
      loggedIn.value = liff.isLoggedIn();
      inClient.value = liff.isInClient();
    })
    .catch((e: unknown) => {
      const message = e instanceof Error ? e.message : '初始化失敗';
      error.value = `LIFF 初始化錯誤：${message}`;
      initPromise = null;
    })
    .finally(() => {
      loading.value = false;
    });

  return initPromise;
}

/**
 * 登入
 * 記錄當前路徑，登入後導回原頁面
 */
function login(): void {
  if (!initialized.value) return;

  const redirectUri = window.location.href;
  liff.login({ redirectUri });
}

/**
 * 登出
 */
function logout(): void {
  if (!initialized.value) return;

  liff.logout();
  loggedIn.value = false;
  profile.value = null;
  window.location.reload();
}

/**
 * 取得使用者資料
 */
async function fetchProfile(): Promise<LiffUserProfile | null> {
  if (!initialized.value || !loggedIn.value) return null;

  try {
    const p = await liff.getProfile();
    const userProfile: LiffUserProfile = {
      userId: p.userId,
      displayName: p.displayName,
      pictureUrl: p.pictureUrl,
      statusMessage: p.statusMessage,
    };
    profile.value = userProfile;
    return userProfile;
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : '取得資料失敗';
    error.value = `取得使用者資料錯誤：${message}`;
    return null;
  }
}

/**
 * 確認登入狀態，未登入則自動導向
 */
function requireLogin(): void {
  if (!initialized.value) return;

  if (!liff.isLoggedIn()) {
    login();
  }
}

/**
 * 取得 Access Token
 */
function getAccessToken(): string | null {
  if (!initialized.value || !loggedIn.value) return null;
  return liff.getAccessToken();
}

/**
 * 關閉 LIFF 視窗（僅在 LINE 內建瀏覽器有效）
 */
function closeWindow(): void {
  if (initialized.value && inClient.value) {
    liff.closeWindow();
  }
}

/** Composable 入口 */
export function useLiff(): {
  initialized: typeof initialized;
  loggedIn: typeof loggedIn;
  inClient: typeof inClient;
  profile: typeof profile;
  error: typeof error;
  loading: typeof loading;
  init: typeof init;
  login: typeof login;
  logout: typeof logout;
  fetchProfile: typeof fetchProfile;
  requireLogin: typeof requireLogin;
  getAccessToken: typeof getAccessToken;
  closeWindow: typeof closeWindow;
} {
  return {
    initialized: readonly(initialized),
    loggedIn: readonly(loggedIn),
    inClient: readonly(inClient),
    profile: readonly(profile),
    error: readonly(error),
    loading: readonly(loading),
    init,
    login,
    logout,
    fetchProfile,
    requireLogin,
    getAccessToken,
    closeWindow,
  };
}
