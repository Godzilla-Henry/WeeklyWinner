/**
 * LIFF ID Token 取得
 * 提供給 API 層使用的 LINE idToken
 */

import liff from '@line/liff';

/**
 * 取得 LINE ID Token
 * @returns idToken 字串，未登入時回傳 null
 */
export function getLiffIdToken(): string | null {
  try {
    return liff.isLoggedIn() ? liff.getIDToken() : null;
  } catch {
    return null;
  }
}
