/**
 * 认证服务
 * 对接后端 /api/auth 接口，token 持久化到 localStorage
 */
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';
const TOKEN_KEY = 'tianji_auth_token';
const ACCOUNTS_KEY = 'tianji_auth_accounts';
const MAX_ACCOUNTS = 10;

const http = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ============ 类型 ============ */

export interface UserProfile {
  birthday: string;
  birthdayLunar: string;
  birthTime: string;
  birthPlace: string;
  gender: string;
}

export interface PublicUser {
  id: string;
  username: string;
  nickname: string;
  profile: UserProfile;
  createdAt: string;
}

interface AuthData {
  token: string;
  user: PublicUser;
}

interface AuthApiResponse {
  success: boolean;
  message?: string;
  data?: AuthData | PublicUser;
}

/* ============ Token 管理 ============ */

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // 忽略存储错误
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // 忽略存储错误
  }
}

/* ============ 历史账号（多账号切换，token 本地保留） ============ */

export interface SavedAccount {
  username: string;
  token: string;
  user: PublicUser;
  lastLoginAt: number;
}

export function getAccounts(): SavedAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    const arr: SavedAccount[] = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveAccounts(list: SavedAccount[]): void {
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(list));
  } catch {
    // 忽略存储错误
  }
}

/** 登录/注册成功后记录账号（按 username 去重，最近的在前） */
export function upsertAccount(username: string, token: string, user: PublicUser): SavedAccount[] {
  const list = getAccounts().filter((a) => a.username.toLowerCase() !== username.toLowerCase());
  list.unshift({ username, token, user, lastLoginAt: Date.now() });
  const trimmed = list.slice(0, MAX_ACCOUNTS);
  saveAccounts(trimmed);
  return trimmed;
}

export function findAccount(username: string): SavedAccount | undefined {
  return getAccounts().find((a) => a.username.toLowerCase() === username.toLowerCase());
}

export function removeAccount(username: string): SavedAccount[] {
  const list = getAccounts().filter((a) => a.username.toLowerCase() !== username.toLowerCase());
  saveAccounts(list);
  return list;
}

/**
 * 忘记账号：从浏览器移除。若该账号为当前会话，同时调用后端吊销 token。
 */
export async function forgetAccount(username: string): Promise<SavedAccount[]> {
  const acc = findAccount(username);
  if (acc && acc.token === getToken()) {
    try {
      await http.post('/auth/logout');
    } catch {
      // 忽略吊销失败
    }
    clearToken();
  }
  return removeAccount(username);
}

/** 使用本地保留的 token 直接切换账号（token 过期时抛错） */
export async function resumeAccount(username: string): Promise<PublicUser> {
  const acc = findAccount(username);
  if (!acc) throw new Error('账号不存在，请重新登录');
  setToken(acc.token);
  try {
    const user = await fetchMe();
    upsertAccount(acc.username, acc.token, user);
    return user;
  } catch {
    removeAccount(username);
    clearToken();
    throw new Error('该账号登录已过期，请重新输入密码');
  }
}

/* ============ 接口 ============ */

/** 登录 */
export async function login(username: string, password: string): Promise<PublicUser> {
  const { data } = await http.post<AuthApiResponse>('/auth/login', { username, password });
  if (!data.success || !data.data) throw new Error(data.message || '登录失败');
  const payload = data.data as AuthData;
  setToken(payload.token);
  return payload.user;
}

/** 注册 */
export async function register(username: string, password: string, nickname?: string): Promise<PublicUser> {
  const { data } = await http.post<AuthApiResponse>('/auth/register', { username, password, nickname });
  if (!data.success || !data.data) throw new Error(data.message || '注册失败');
  const payload = data.data as AuthData;
  setToken(payload.token);
  return payload.user;
}

/** 获取当前用户（token 有效时） */
export async function fetchMe(): Promise<PublicUser> {
  const { data } = await http.get<AuthApiResponse>('/auth/me');
  if (!data.success || !data.data) throw new Error(data.message || '未登录');
  return data.data as PublicUser;
}

/** 更新个人资料（昵称 + 资料字段，传哪个改哪个） */
export async function updateProfile(patch: Partial<UserProfile> & { nickname?: string }): Promise<PublicUser> {
  const { data } = await http.put<AuthApiResponse>('/auth/profile', patch);
  if (!data.success || !data.data) throw new Error(data.message || '保存失败');
  return data.data as PublicUser;
}

/**
 * 退出当前登录（仅结束当前会话，token 仍保留在历史账号中，可一键切换回来）
 */
export async function logout(): Promise<void> {
  clearToken();
}
