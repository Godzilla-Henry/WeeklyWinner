import { http } from './http';

/** 登入 */
export function loginApi(payload: LoginPayload): Promise<ApiResponse<LoginResult>> {
  return http.post<LoginResult>('/auth/login', payload);
}

/** 取得當前使用者資訊 */
export function fetchCurrentUserApi(): Promise<ApiResponse<UserProfile>> {
  return http.get<UserProfile>('/auth/me');
}

/** 登出 */
export function logoutApi(): Promise<ApiResponse<null>> {
  return http.post<null>('/auth/logout', {});
}
