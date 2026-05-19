/**
 * HTTP 請求封裝
 * 基於 fetch API，提供型別安全的請求方法
 *
 * - publicHttp：公開 API
 * - http：認證 API，自動帶入 Authorization: Bearer <LINE Access Token>
 * - 401 自動觸發 liff.login() 重新登入（含防迴圈機制）
 * - 回應自動 snake_case → camelCase 轉換
 */

import liff from '@line/liff';
import { snakeToCamel } from '@/utils/caseTransform';
import { isStandaloneMode } from '@/composables/shared/usePwaAuthBridge';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

/** 防止重複觸發 liff.login() 造成無限迴圈 */
const RELOGIN_KEY = '__ww_relogin';

/** API 錯誤類別 */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** 請求設定 */
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  skipTransform?: boolean;
}

/** 取得 LINE Access Token（由 LIFF SDK 自動管理，不會過期） */
function getAccessToken(): string | null {
  try {
    if (!liff.isLoggedIn()) return null;
    return liff.getAccessToken();
  } catch {
    return null;
  }
}

/**
 * 強制重新登入 LINE（含防迴圈機制）
 * 用 sessionStorage 記錄已觸發過，避免無限迴圈
 * PWA standalone 模式下 redirectUri 只用 origin，避免跳出 App
 */
function forceReLogin(): void {
  if (sessionStorage.getItem(RELOGIN_KEY)) {
    console.warn('[http] 已嘗試重新登入，不再重複觸發');
    sessionStorage.removeItem(RELOGIN_KEY);
    return;
  }

  sessionStorage.setItem(RELOGIN_KEY, '1');

  try {
    const { origin, pathname } = window.location;
    const redirectUri = isStandaloneMode() ? origin : `${origin}${pathname}`;
    liff.login({ redirectUri });
  } catch {
    sessionStorage.removeItem(RELOGIN_KEY);
  }
}

/** 統一請求方法 */
async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {}, skipTransform = false } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${url}`, config);
  } catch {
    throw new ApiError(0, '網路連線異常，請檢查網路狀態');
  }

  if (!response.ok) {
    let errorMessage = '伺服器錯誤，請稍後再試';
    try {
      const errorBody = (await response.json()) as { error?: string };
      if (errorBody.error) {
        errorMessage = errorBody.error;
      }
    } catch {
      /* 無法解析 JSON */
    }

    /* 401 → 觸發重新登入 */
    if (response.status === 401) {
      forceReLogin();
      throw new ApiError(401, '登入已過期，正在重新登入…');
    }

    throw new ApiError(response.status, errorMessage);
  }

  /* 請求成功 → 清除重新登入標記 */
  sessionStorage.removeItem(RELOGIN_KEY);

  const data: unknown = await response.json();
  return skipTransform ? (data as T) : snakeToCamel<T>(data);
}

/** 公開請求（不帶認證） */
export const publicHttp = {
  get: <T>(url: string): Promise<T> => request<T>(url),
};

/** 認證請求 — 自動帶入 Bearer Access Token */
export const http = {
  get: <T>(url: string): Promise<T> => {
    const token = getAccessToken();
    if (!token) {
      forceReLogin();
      return Promise.reject(new ApiError(401, '未登入，正在導向登入頁…'));
    }
    return request<T>(url, { headers: { Authorization: `Bearer ${token}` } });
  },

  post: <T>(url: string, body?: unknown): Promise<T> => {
    const token = getAccessToken();
    if (!token) {
      forceReLogin();
      return Promise.reject(new ApiError(401, '未登入，正在導向登入頁…'));
    }
    return request<T>(url, {
      method: 'POST',
      body: body ?? {},
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  put: <T>(url: string, body?: unknown): Promise<T> => {
    const token = getAccessToken();
    if (!token) {
      forceReLogin();
      return Promise.reject(new ApiError(401, '未登入，正在導向登入頁…'));
    }
    return request<T>(url, {
      method: 'PUT',
      body: body ?? {},
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  delete: <T>(url: string): Promise<T> => {
    const token = getAccessToken();
    if (!token) {
      forceReLogin();
      return Promise.reject(new ApiError(401, '未登入，正在導向登入頁…'));
    }
    return request<T>(url, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
