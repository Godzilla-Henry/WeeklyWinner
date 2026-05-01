import { defineStore } from 'pinia';
import type { Profile } from '@/types/api';

/** 認證狀態 */
interface AuthState {
  profile: Profile | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    profile: null,
  }),

  getters: {
    /** 是否已同步 Profile */
    hasSynced: (state): boolean => state.profile !== null,

    /** 使用者名稱 */
    userName: (state): string => state.profile?.name ?? '',

    /** 使用者頭像 */
    userAvatar: (state): string | null => state.profile?.avatar ?? null,
  },

  actions: {
    /** 設定 Profile（登入同步後呼叫） */
    setProfile(profile: Profile): void {
      this.profile = profile;
    },

    /** 清除 Profile */
    clearProfile(): void {
      this.profile = null;
    },
  },

  persist: {
    pick: ['profile'],
  },
});
