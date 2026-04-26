import { defineStore } from 'pinia';
import { loginApi, logoutApi, fetchCurrentUserApi } from '@/api/auth';

/** 認證狀態 */
interface AuthState {
  token: string | null;
  user: UserProfile | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    user: null,
  }),

  getters: {
    /** 是否已登入 */
    isAuthenticated: (state): boolean => state.token !== null,

    /** 使用者角色 */
    userRole: (state): UserRole | null => state.user?.role ?? null,
  },

  actions: {
    /** 登入 */
    async login(payload: LoginPayload): Promise<void> {
      const res = await loginApi(payload);
      this.token = res.data.token;
      this.user = res.data.user;
      localStorage.setItem('auth_token', res.data.token);
    },

    /** 取得當前使用者 */
    async fetchUser(): Promise<void> {
      const res = await fetchCurrentUserApi();
      this.user = res.data;
    },

    /** 登出 */
    async logout(): Promise<void> {
      await logoutApi();
      this.token = null;
      this.user = null;
      localStorage.removeItem('auth_token');
    },
  },

  /**
   * 持久化設定（pinia-plugin-persistedstate）
   * 僅持久化 token，使用者資料每次重新取得
   */
  persist: {
    pick: ['token'],
  },
});
