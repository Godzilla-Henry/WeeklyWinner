/**
 * HTTP 請求封裝
 * 基於 fetch API，提供型別安全的請求方法
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

/** 請求設定 */
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
}

/** 取得認證 Token */
function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

/** 統一請求方法 */
async function request<T>(url: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const { method = 'GET', body, headers = {} } = options;

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

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

  const response = await fetch(`${BASE_URL}${url}`, config);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data: ApiResponse<T> = (await response.json()) as ApiResponse<T>;
  return data;
}

/** HTTP 方法快捷封裝 */
export const http = {
  get: <T>(url: string): Promise<ApiResponse<T>> => request<T>(url),

  post: <T>(url: string, body: unknown): Promise<ApiResponse<T>> =>
    request<T>(url, { method: 'POST', body }),

  put: <T>(url: string, body: unknown): Promise<ApiResponse<T>> =>
    request<T>(url, { method: 'PUT', body }),

  patch: <T>(url: string, body: unknown): Promise<ApiResponse<T>> =>
    request<T>(url, { method: 'PATCH', body }),

  delete: <T>(url: string): Promise<ApiResponse<T>> =>
    request<T>(url, { method: 'DELETE' }),
};
