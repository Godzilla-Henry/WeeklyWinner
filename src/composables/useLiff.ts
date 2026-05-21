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
import { isStandaloneMode, broadcastTokenReady, isLiffCallback } from '@/composables/shared/usePwaAuthBridge';

/* ── 響應式狀態 ── */
const initialized = ref(false);
const loggedIn = ref(false);
const inClient = ref(false);
const profile = ref<LiffUserProfile | null>(null);
const error = ref<string | null>(null);
const loading = ref(false);

/* ── 單例鎖 ── */
let initPromise: Promise<void> | null = null;

/** 重置單例鎖（供 PWA 橋接重新 init 使用） */
export function resetLiffInitPromise(): void {
  initPromise = null;
  initialized.value = false;
  loggedIn.value = false;
}

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

      /**
       * LIFF OAuth callback 偵測：
       * 若 URL 含 liff.state，代表這是系統瀏覽器處理 LINE 授權後的 callback 頁面。
       * 廣播 TOKEN_READY 通知 PWA 視窗重新 init，然後清理 URL。
       */
      if (!inClient.value && isLiffCallback()) {
        if (loggedIn.value) {
          /* 授權成功 → 廣播通知 PWA */
          broadcastTokenReady();
        }
        /* 清理 URL 上的 liff.state 參數 */
        const cleanUrl = `${window.location.origin}${window.location.pathname}`;
        window.history.replaceState(null, '', cleanUrl);
      }
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
 * - 行動裝置：使用 line://app/{LIFF_ID} 深層連結開啟 LINE App，在 WebView 內完成登入
 * - 桌面一般模式：redirectUri 帶當前路徑
 * - 桌面 PWA standalone 模式：redirectUri 只用 origin（根路徑）
 *   LINE OAuth 完成後系統瀏覽器會廣播 TOKEN_READY，PWA 收到後重新 init
 */
function login(): void {
  if (!initialized.value) return;

  // 行動裝置偵測：UA 含行動裝置關鍵字或 maxTouchPoints > 1（涵蓋 iPad 等平板）
  const isMobile =
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || navigator.maxTouchPoints > 1;

  if (isMobile) {
    // 行動裝置：深層連結開啟 LINE App → WebView 載入 LIFF URL → 自動登入
    window.location.href = `line://app/${LIFF_ID}`;
    return;
  }

  // 桌面：維持現有 liff.login() 流程
  const { origin, pathname } = window.location;
  const redirectUri = isStandaloneMode() ? origin : `${origin}${pathname}`;
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
