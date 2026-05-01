/**
 * 認證 API
 */

import { http } from '@/api/http';
import type { LoginResponse } from '@/types/api';

/** 登入同步 */
export function login(idToken: string): Promise<LoginResponse> {
  return http.post<LoginResponse>('/auth/login', idToken);
}
