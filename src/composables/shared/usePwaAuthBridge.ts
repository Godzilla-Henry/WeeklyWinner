/**
 * PWA 登入橋接器 — BroadcastChannel 機制
 *
 * 問題背景：
 *   PWA standalone 模式下，liff.login() 會在系統瀏覽器（Safari/Chrome）開啟 LINE OAuth。
 *   授權完成後 redirect 回系統瀏覽器，Token 存在瀏覽器的 localStorage，
 *   PWA 視窗因環境隔離完全無法感知，導致登入狀態永遠丟失。
 *
 * 解法：BroadcastChannel
 *   - 系統瀏覽器完成 LIFF init 後，偵測到 liff.state 參數，廣播 TOKEN_READY 訊息
 *   - PWA 視窗監聽到訊息後，重新執行 liff.init() 取得 Token，完成登入同步
 *   - 同源（same-origin）的所有視窗/Tab 都能收到廣播，不受 standalone 隔離影響
 */

/** BroadcastChannel 頻道名稱 */
const CHANNEL_NAME = 'ww-pwa-auth';

/** 訊息類型 */
export type AuthBridgeMessage =
  | { type: 'TOKEN_READY' }   /* 系統瀏覽器：LIFF 授權完成，通知 PWA 重新 init */
  | { type: 'RELOAD_PWA' };   /* 保留：未來可擴充 */

/** 是否為 PWA standalone 模式 */
export function isStandaloneMode(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in navigator &&
      (navigator as unknown as { standalone: boolean }).standalone === true)
  );
}

/** 是否為 LIFF OAuth callback（URL 含 liff.state） */
export function isLiffCallback(): boolean {
  return window.location.search.includes('liff.state') ||
    window.location.hash.includes('liff.state');
}

/**
 * 廣播 TOKEN_READY（由系統瀏覽器的 callback 頁呼叫）
 * 通知所有同源視窗（包含 PWA）LIFF 授權已完成
 */
export function broadcastTokenReady(): void {
  if (!('BroadcastChannel' in window)) return;

  try {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    const message: AuthBridgeMessage = { type: 'TOKEN_READY' };
    channel.postMessage(message);
    /* 短暫延遲後關閉，確保訊息送出 */
    setTimeout(() => channel.close(), 500);
  } catch (e: unknown) {
    console.warn('[PwaAuthBridge] 廣播失敗：', e instanceof Error ? e.message : e);
  }
}

/**
 * 監聽 TOKEN_READY 訊息（由 PWA 視窗呼叫）
 * 收到後執行 onTokenReady callback（通常是重新 init LIFF）
 * 回傳 cleanup 函式，元件 unmount 時呼叫
 */
export function listenForTokenReady(onTokenReady: () => void): () => void {
  if (!('BroadcastChannel' in window)) return () => undefined;

  const channel = new BroadcastChannel(CHANNEL_NAME);

  channel.onmessage = (event: MessageEvent<AuthBridgeMessage>) => {
    if (event.data?.type === 'TOKEN_READY') {
      onTokenReady();
    }
  };

  return () => channel.close();
}
