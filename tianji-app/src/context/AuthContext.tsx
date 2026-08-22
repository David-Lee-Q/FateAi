/**
 * 全局认证上下文
 * 应用启动时若存在 token 则自动拉取当前用户；提供登录/注册/登出/改资料
 * 多账号：本地保留历史账号（token 有效时一键切换，无需重复输密码）
 */
import { createContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import {
  getToken, clearToken,
  login as apiLogin, register as apiRegister,
  fetchMe, updateProfile as apiUpdateProfile, logout as apiLogout,
  getAccounts, upsertAccount, forgetAccount as apiForgetAccount, resumeAccount as apiResumeAccount,
  type PublicUser, type UserProfile, type SavedAccount,
} from '@/services/auth';

export interface AuthContextValue {
  user: PublicUser | null;
  loading: boolean;
  accounts: SavedAccount[];
  login: (username: string, password: string) => Promise<PublicUser>;
  register: (username: string, password: string, nickname?: string) => Promise<PublicUser>;
  logout: () => Promise<void>;
  switchAccount: (username: string) => Promise<PublicUser>;
  forgetAccount: (username: string) => Promise<void>;
  updateProfile: (patch: Partial<UserProfile> & { nickname?: string }) => Promise<PublicUser>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<SavedAccount[]>(getAccounts);

  // 启动时恢复会话
  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    fetchMe()
      .then(setUser)
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const u = await apiLogin(username, password);
    setUser(u);
    setAccounts(upsertAccount(u.username, getToken() || '', u));
    return u;
  }, []);

  const register = useCallback(async (username: string, password: string, nickname?: string) => {
    const u = await apiRegister(username, password, nickname);
    setUser(u);
    setAccounts(upsertAccount(u.username, getToken() || '', u));
    return u;
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
  }, []);

  const switchAccount = useCallback(async (username: string) => {
    const u = await apiResumeAccount(username);
    setUser(u);
    setAccounts(getAccounts());
    return u;
  }, []);

  const forgetAccount = useCallback(async (username: string) => {
    const wasCurrent = user?.username.toLowerCase() === username.toLowerCase();
    const list = await apiForgetAccount(username);
    setAccounts(list);
    if (wasCurrent) setUser(null);
  }, [user]);

  const updateProfile = useCallback(async (patch: Partial<UserProfile> & { nickname?: string }) => {
    const u = await apiUpdateProfile(patch);
    setUser(u);
    // 同步历史账号中的资料快照
    setAccounts(upsertAccount(u.username, getToken() || '', u));
    return u;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, accounts, login, register, logout, switchAccount, forgetAccount, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
