/**
 * 天机 AI 运势查询工具 - 服务入口
 * 基于 Express 的 REST API 服务
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import fortuneRouter from './routes/fortune';
import configRouter from './routes/config';
import authRouter from './routes/auth';
import { warmupKnowledgeCache } from './services/knowledge.loader';

dotenv.config();

// 预热知识库缓存，避免运行时同步磁盘 IO 阻塞事件循环
const warmedSystems = warmupKnowledgeCache();

const app = express();

// 中间件配置
app.use(cors());
// 手相算命需上传 Base64 图片，默认 100kb 限制不足，设置为 50MB
app.use(express.json({ limit: '50mb' }));

// 健康检查接口
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', name: '天机 AI 运势查询工具', version: '1.0.0' });
});

// 注册占卜路由
app.use('/api/fortune', fortuneRouter);

// 注册 AI 配置管理路由
app.use('/api/config', configRouter);

// 注册认证路由（登录 / 注册 / 个人资料）
app.use('/api/auth', authRouter);

// 生产模式：托管前端构建产物（单端口部署，API 与静态资源同源）
// 开发模式下 dist 不存在则跳过，由 Vite DevServer 负责前端
const frontendDist = path.resolve(__dirname, '../../tianji-app/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  // SPA 回退：非 /api 的 GET 请求一律返回 index.html，交由前端路由接管
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendDist, 'index.html'));
      return;
    }
    next();
  });
}

// 启动服务
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`天机服务已启动: http://localhost:${PORT}`);
  console.log(`接口文档:`);
  console.log(`  POST /api/fortune/query   - 提交占卜查询`);
  console.log(`  GET  /api/fortune/result/:id - 获取查询结果`);
  console.log(`  GET  /api/fortune/history   - 获取历史记录`);
  console.log(`  GET  /api/health             - 健康检查`);
  console.log(`  GET  /api/config/ai          - 获取AI配置`);
  console.log(`  PUT  /api/config/ai          - 保存AI配置`);
  console.log(`  POST /api/auth/register      - 用户注册`);
  console.log(`  POST /api/auth/login         - 用户登录`);
  console.log(`  GET  /api/auth/me            - 当前用户`);
  console.log(`  PUT  /api/auth/profile       - 更新个人资料`);
  console.log(`  POST /api/auth/logout        - 退出登录`);
  console.log(`  知识库已加载 ${warmedSystems.length} 个系统: ${warmedSystems.join(', ')}`);
});
