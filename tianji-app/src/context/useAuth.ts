/**
 * 认证状态 Hook（与 AuthContext 分离，保证 fast refresh）
 */
import { useContext } from 'react';
import AuthContext, { type AuthContextValue } from '@/context/AuthContext';

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth 必须在 AuthProvider 内使用');
  return ctx;
}
