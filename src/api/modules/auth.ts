/**
 * 認證 API
 */

import { http } from '@/api/http';
import type { LoginResponse } from '@/types/api';

/** 登入同步 — LIFF 登入成功後呼叫，後端 upsert 用戶資料 */
export function login(): Promise<LoginResponse> {
  return http.post<LoginResponse>('/auth/login');
}
