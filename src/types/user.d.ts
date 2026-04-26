/** 使用者角色 */
type UserRole = 'admin' | 'editor' | 'viewer';

/** 使用者資料 */
interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

/** 登入請求 */
interface LoginPayload {
  email: string;
  password: string;
}

/** 登入回應 */
interface LoginResult {
  token: string;
  user: UserProfile;
}
