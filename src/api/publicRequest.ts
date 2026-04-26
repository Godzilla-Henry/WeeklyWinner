/**
 * 公開 API 請求實例
 * 用於證交所、櫃買中心等不需認證的外部 API
 * 不帶 Authorization header，不帶 Content-Type
 */

import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

const instance: AxiosInstance = axios.create({
  timeout: 15000,
});

/** Response 攔截器 — 僅做錯誤格式化 */
instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.statusText ?? error.message;
      return Promise.reject(new Error(`[${status ?? 'NETWORK'}] ${message}`));
    }
    return Promise.reject(error);
  },
);

export default instance;
