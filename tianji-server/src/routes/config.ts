/**
 * AI 配置管理路由
 * 提供读取和修改 AI API Key、模型等配置的接口
 */

import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

// .env 文件路径（项目根目录）
const ENV_FILE = path.join(__dirname, '../../.env');

/** 读取 .env 文件全部内容 */
function readEnvFile(): string {
  try {
    return fs.readFileSync(ENV_FILE, 'utf-8');
  } catch {
    return '';
  }
}

/** 将内容写入 .env 文件 */
function writeEnvFile(content: string): void {
  fs.writeFileSync(ENV_FILE, content, 'utf-8');
}

/**
 * 更新或新增 .env 中的 key=value
 * 如果 key 已存在则替换，否则追加到末尾
 */
function updateEnvValue(content: string, key: string, value: string): string {
  const regex = new RegExp(`^${key}=.*$`, 'm');
  if (regex.test(content)) {
    return content.replace(regex, `${key}=${value}`);
  }
  return content.trimEnd() + `\n${key}=${value}\n`;
}

/** 从 .env 文本中按 key 读取 value */
function getEnvValue(content: string, key: string): string {
  const match = content.match(new RegExp(`^${key}=(.*)$`, 'm'));
  return match ? match[1].trim() : '';
}

/**
 * GET /api/config/ai
 * 获取当前 AI 配置，API Key 做脱敏处理
 */
router.get('/ai', (_req: Request, res: Response) => {
  const envContent = readEnvFile();
  const apiKey = getEnvValue(envContent, 'AI_API_KEY');
  const apiBase = getEnvValue(envContent, 'AI_API_BASE') || 'https://api.openai.com/v1';
  const model = getEnvValue(envContent, 'AI_MODEL') || 'gpt-4o-mini';

  // Key 脱敏：仅显示前4位和后4位
  const maskedKey = apiKey && apiKey !== 'your_api_key_here' && apiKey.length > 8
    ? apiKey.slice(0, 4) + '****' + apiKey.slice(-4)
    : '';

  res.json({
    success: true,
    data: {
      apiKey: maskedKey,
      hasApiKey: !!(apiKey && apiKey !== 'your_api_key_here'),
      apiBase,
      model,
    },
  });
});

/**
 * PUT /api/config/ai
 * 保存 AI 配置到 .env 文件，同时热更新 process.env
 */
router.put('/ai', (req: Request, res: Response) => {
  const { apiKey, apiBase, model } = req.body;

  // 参数校验
  if (apiKey !== undefined && typeof apiKey !== 'string') {
    res.status(400).json({ success: false, message: 'apiKey 必须是字符串' });
    return;
  }

  let envContent = readEnvFile();

  // 按字段逐一更新 .env 文件内容和 process.env
  if (apiKey !== undefined) {
    envContent = updateEnvValue(envContent, 'AI_API_KEY', apiKey);
    process.env.AI_API_KEY = apiKey; // 热更新
  }
  if (apiBase !== undefined) {
    envContent = updateEnvValue(envContent, 'AI_API_BASE', apiBase);
    process.env.AI_API_BASE = apiBase; // 热更新
  }
  if (model !== undefined) {
    envContent = updateEnvValue(envContent, 'AI_MODEL', model);
    process.env.AI_MODEL = model; // 热更新
  }

  writeEnvFile(envContent);

  res.json({ success: true, message: 'AI 配置已保存' });
});

export default router;
