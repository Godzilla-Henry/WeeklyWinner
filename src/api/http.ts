/**
 * HTTP 請求封裝
 * 基於 fetch API，提供型別安全的請求方法
 * 認證方式：Authorization: Bearer <LINE idToken>
 */

import { snakeToCamel } from '@/utils/caseTransform';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

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
  /** 是否跳過 snake_case → camelCase 轉換 */
  skipTransform?: boolean;
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
    if (response.status === 401) {
      throw new ApiError(401, '登入已過期，請重新登入');
    }

    /* 嘗試解析後端錯誤訊息 */
    let errorMessage = `伺服器錯誤 (${response.status})`;
    try {
      const errorBody = (await response.json()) as { error?: string };
      if (errorBody.error) {
        errorMessage = errorBody.error;
      }
    } catch {
      /* 無法解析 JSON，使用預設訊息 */
    }

    throw new ApiError(response.status, errorMessage);
  }

  const data: unknown = await response.json();
  return skipTransform ? (data as T) : snakeToCamel<T>(data);
}

/** 帶認證的請求 */
function authRequest<T>(url: string, idToken: string, options: RequestOptions = {}): Promise<T> {
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${idToken}`,
  };
  return request<T>(url, { ...options, headers });
}

/** HTTP 方法快捷封裝（需認證） */
export const http = {
  get: <T>(url: string, idToken: string): Promise<T> => authRequest<T>(url, idToken),

  post: <T>(url: string, idToken: string, body?: unknown): Promise<T> =>
    authRequest<T>(url, idToken, { method: 'POST', body }),
};
