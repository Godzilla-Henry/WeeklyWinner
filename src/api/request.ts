/**
 * Axios 請求封裝
 * - 基礎 URL / Timeout 設定
 * - Request / Response 攔截器
 * - 統一錯誤處理
 */

import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

/** 建立 Axios 實例 */
const instance: AxiosInstance = axios.create({
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/** Request 攔截器 */
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => Promise.reject(error),
);

/** Response 攔截器 */
instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.statusText ?? error.message;

      if (status === 401) {
        localStorage.removeItem('auth_token');
      }

      return Promise.reject(new Error(`[${status ?? 'NETWORK'}] ${message}`));
    }
    return Promise.reject(error);
  },
);

export default instance;
