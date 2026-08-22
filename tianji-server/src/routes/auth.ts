/**
 * 认证路由
 * POST /api/auth/register - 注册
 * POST /api/auth/login    - 登录
 * POST /api/auth/logout   - 退出登录
 * GET  /api/auth/me       - 当前用户信息
 * PUT  /api/auth/profile  - 更新个人资料
 *
 * 存储：data/users.json + data/sessions.json（与 results.json 相同的 JSON 文件模式）
 * 密码：scrypt 散列 + 随机盐；会话：随机 32 字节 token，7 天过期
 */

import { Router, Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(__dirname, '../../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 天

/** 个人资料（与前端 ProfilePage 字段对应） */
export interface UserProfile {
  birthday: string;      // 出生日期，如 1995年6月15日（阳历）
  birthdayLunar: string; // 农历日期（可选）
  birthTime: string;     // 出生时间，如 14:30
  birthPlace: string;    // 出生地，如 广东省 · 广州市
  gender: string;        // 性别：男 / 女
}

interface UserRecord {
  id: string;
  username: string;
  nickname: string;
  passwordHash: string;
  salt: string;
  profile: UserProfile;
  createdAt: string;
}

type SessionMap = Record<string, { userId: string; expiresAt: number }>;

const EMPTY_PROFILE: UserProfile = {
  birthday: '',
  birthdayLunar: '',
  birthTime: '',
  birthPlace: '',
  gender: '',
};

/* ============ 文件读写 ============ */

function ensureFiles(): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[]', 'utf-8');
  if (!fs.existsSync(SESSIONS_FILE)) fs.writeFileSync(SESSIONS_FILE, '{}', 'utf-8');
}

function loadUsers(): UserRecord[] {
  ensureFiles();
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    const arr: UserRecord[] = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveUsers(users: UserRecord[]): void {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (error) {
    console.error('保存用户文件失败:', error);
  }
}

function loadSessions(): SessionMap {
  ensureFiles();
  try {
    const raw = fs.readFileSync(SESSIONS_FILE, 'utf-8');
    const obj: SessionMap = JSON.parse(raw);
    return obj && typeof obj === 'object' ? obj : {};
  } catch {
    return {};
  }
}

function saveSessions(sessions: SessionMap): void {
  try {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2), 'utf-8');
  } catch (error) {
    console.error('保存会话文件失败:', error);
  }
}

/* ============ 密码与会话 ============ */

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  const actual = Buffer.from(hashPassword(password, salt), 'hex');
  const expected = Buffer.from(expectedHash, 'hex');
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

function createToken(userId: string): string {
  const sessions = loadSessions();
  const now = Date.now();
  for (const [token, session] of Object.entries(sessions)) {
    if (session.expiresAt < now) delete sessions[token];
  }
  const token = crypto.randomBytes(32).toString('hex');
  sessions[token] = { userId, expiresAt: now + TOKEN_TTL_MS };
  saveSessions(sessions);
  return token;
}

function revokeToken(token: string): void {
  const sessions = loadSessions();
  if (sessions[token]) {
    delete sessions[token];
    saveSessions(sessions);
  }
}

function userFromToken(token: string | undefined): UserRecord | null {
  if (!token) return null;
  const sessions = loadSessions();
  const session = sessions[token];
  if (!session || session.expiresAt < Date.now()) return null;
  const user = loadUsers().find((u) => u.id === session.userId);
  return user ?? null;
}

/* ============ 工具 ============ */

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
}

function publicUser(u: UserRecord) {
  return {
    id: u.id,
    username: u.username,
    nickname: u.nickname,
    profile: u.profile,
    createdAt: u.createdAt,
  };
}

/** 认证中间件：从 Authorization: Bearer <token> 解析当前用户 */
function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : undefined;
  const user = userFromToken(token);
  if (!user) {
    res.status(401).json({ success: false, message: '未登录或登录已过期，请重新登录' });
    return;
  }
  (req as Request & { authUser: UserRecord }).authUser = user;
  next();
}

/** 可选认证：从请求解析 Bearer token，返回用户 ID；未登录或 token 无效时返回 null */
export function getOptionalAuthUserId(req: Request): string | null {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : undefined;
  const user = userFromToken(token);
  return user ? user.id : null;
}

/* ============ 路由 ============ */

const router = Router();

/** 注册 */
router.post('/register', (req: Request, res: Response) => {
  try {
    const { username, password, nickname } = (req.body || {}) as {
      username?: string; password?: string; nickname?: string;
    };

    if (!username || typeof username !== 'string' || !/^[\u4e00-\u9fa5A-Za-z0-9_]{2,20}$/.test(username)) {
      res.status(400).json({ success: false, message: '用户名需为 2-20 位中文、字母、数字或下划线' });
      return;
    }
    if (!password || typeof password !== 'string' || password.length < 6 || password.length > 64) {
      res.status(400).json({ success: false, message: '密码长度需为 6-64 位' });
      return;
    }

    const users = loadUsers();
    if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
      res.status(409).json({ success: false, message: '该用户名已被注册' });
      return;
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const user: UserRecord = {
      id: generateId(),
      username,
      nickname: (typeof nickname === 'string' && nickname.trim()) ? nickname.trim().slice(0, 20) : username,
      passwordHash: hashPassword(password, salt),
      salt,
      profile: { ...EMPTY_PROFILE },
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    saveUsers(users);

    const token = createToken(user.id);
    res.json({ success: true, data: { token, user: publicUser(user) } });
  } catch (error) {
    console.error('注册失败:', error);
    res.status(500).json({ success: false, message: '注册失败，请稍后重试' });
  }
});

/** 登录 */
router.post('/login', (req: Request, res: Response) => {
  try {
    const { username, password } = (req.body || {}) as { username?: string; password?: string };
    if (!username || !password) {
      res.status(400).json({ success: false, message: '请输入用户名和密码' });
      return;
    }

    const user = loadUsers().find((u) => u.username.toLowerCase() === String(username).toLowerCase());
    if (!user || !verifyPassword(String(password), user.salt, user.passwordHash)) {
      res.status(401).json({ success: false, message: '用户名或密码错误' });
      return;
    }

    const token = createToken(user.id);
    res.json({ success: true, data: { token, user: publicUser(user) } });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({ success: false, message: '登录失败，请稍后重试' });
  }
});

/** 当前用户 */
router.get('/me', requireAuth, (req: Request, res: Response) => {
  const user = (req as Request & { authUser: UserRecord }).authUser;
  res.json({ success: true, data: publicUser(user) });
});

/** 更新个人资料 */
router.put('/profile', requireAuth, (req: Request, res: Response) => {
  try {
    const current = (req as Request & { authUser: UserRecord }).authUser;
    const body = (req.body || {}) as Record<string, unknown>;

    const users = loadUsers();
    const user = users.find((u) => u.id === current.id);
    if (!user) {
      res.status(404).json({ success: false, message: '用户不存在' });
      return;
    }

    const profile = user.profile;
    if (typeof body.nickname === 'string' && body.nickname.trim()) {
      user.nickname = body.nickname.trim().slice(0, 20);
    }
    const profileFields: (keyof UserProfile)[] = ['birthday', 'birthdayLunar', 'birthTime', 'birthPlace', 'gender'];
    for (const field of profileFields) {
      if (typeof body[field] === 'string') {
        profile[field] = (body[field] as string).trim().slice(0, 50);
      }
    }
    user.profile = profile;
    saveUsers(users);

    res.json({ success: true, data: publicUser(user) });
  } catch (error) {
    console.error('更新资料失败:', error);
    res.status(500).json({ success: false, message: '更新资料失败，请稍后重试' });
  }
});

/** 退出登录 */
router.post('/logout', requireAuth, (req: Request, res: Response) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : undefined;
  if (token) revokeToken(token);
  res.json({ success: true, message: '已退出登录' });
});

export default router;
