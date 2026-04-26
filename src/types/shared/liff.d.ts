/** LIFF 使用者資料 */
interface LiffUserProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

/** LIFF 初始化狀態 */
interface LiffState {
  initialized: boolean;
  loggedIn: boolean;
  inClient: boolean;
  profile: LiffUserProfile | null;
  error: string | null;
}
