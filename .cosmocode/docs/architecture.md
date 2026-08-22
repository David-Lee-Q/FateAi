# 架构与关键设计

## 总体架构

前后端分离的单体部署：

```
浏览器（React SPA，生产构建后由后端同端口托管）
   │  /api/*（JSON，Bearer token 可选）
   ▼
Express 5（tianji-server）
   ├── routes/fortune   20 套占卜体系查询 + 结果存取 + AI 追问/对话
   ├── routes/auth      注册 / 登录 / 资料（JWT 会话，存 sessions.json）
   ├── routes/config    AI 配置读写（持久化到 .env 并热更新）
   ├── middleware/rateLimit  登录/注册限流（内存滑动窗口）
   └── services/*       各体系算法 + AI 解读 + 模板填充
        │
        ▼
   data/*.json（users / sessions / results，内存 Map 为主，写操作回刷文件）
```

- 前端 `tianji-app`：React 19 + React Router，页面按「占卜输入 → 结果展示 → 洞察分析」三层组织。
- 结果页 `ResultPage` 为统一结果容器，20 套体系按条件分发：19 套对应 `src/pages/result/layouts/*` 专属布局组件，解梦分支在 dispatcher 内联（复用 `DreamLayout`）。
- 洞察页（建议 / 综合报告 / 趋势）共用 `useAuthedHistory` hook 拉取登录用户的真实查询记录并打分（`services/insights.ts`），未登录时展示演示数据。

## 关键设计

### 1. 历法数据：lunar-typescript 前后端同源

黄历（干支、冲煞、宜忌、吉神凶煞、吉时、节气）与农历转换统一使用 `lunar-typescript` 库，前后端同一版本（1.8.6），保证口径一致。

- 后端 `almanac.service.ts` 输出黄历数据；`bazi.service.ts` 的月柱/时柱按立春与节气月分界。
- 前端 `CalendarPage` 日历页与 `zodiac2026.ts` 生肖历表同库生成。
- 日级宜忌取 `getTimes()[0]`（子时），时辰吉凶取前 12 个时辰。

### 2. 八字真太阳时校正

`bazi.service.ts`：

- `cityLongitude.ts` 内置 300+ 城市经度（数据源 Naccl/region2coord），未命中城市回退省份省会经度。
- 偏移 = `(经度 − 120°) × 4 分钟 + 均时差(EoT)`，EoT = `9.87·sin(2b) − 7.53·cos(b) − 1.5·sin(b)`，`b = 2π(年内第N天−81)/365`。
- 按**时辰中点**（`hour*120+60 分钟`）加偏移后取整回时辰，校正结果与说明写入 `trueSolar` 字段并在结果页展示；无城市信息时不校正。

### 3. AI 解读与降级策略

`ai-interpreter.ts`：

- 文本解读 `callAI(prompt)`（10s 超时）与视觉识别 `callAIWithImage(prompt, imageUrl)`（30s 超时），走 OpenAI 兼容接口。
- 无 Key / 配置占位 / 请求失败时返回 `null`，调用方降级为模板解读（`template-filler.ts` / `mock-templates.ts`），功能永不因 AI 不可用而中断。
- 手相体系：上传 Base64 手掌照片 → 视觉模型识别 → 严格 JSON 解析（`parsePalmAIJson`），失败降级模板；结果带 `mode: 'ai' | 'mock'` 标注来源，前端据此展示来源提示。
- 建议页「自定义需求」`ai-chat` 接口匿名可用、不入库。

### 4. 用户与结果存储

- `utils/storage.ts`：启动时把 `data/*.json` 读入内存 Map，写操作后整体回刷文件。**直接手改 JSON 文件会被下一次写操作覆盖**，清理数据须改文件 + 重启服务。
- 结果 `GET /api/fortune/result/:id` 无鉴权（凭 id 可访问），支撑分享链接场景；历史记录接口 `history` 仅返回当前用户自己的记录（响应含 `mine` 标记）。

### 5. 限流

`middleware/rateLimit.ts`：内存滑动窗口，key = `路径:IP`，5 分钟定时清桶。

- 注册：3 次 / 小时 / IP
- 登录：5 次 / 分钟 / IP
- 超限返回 429 + 友好提示。

### 6. 分享

`src/utils/share.ts`：

- 分享文本：体系名 + 核心信息行（八字四柱 / 塔罗牌面 / 黄历摘要等）+ 解读摘要 + 结果链接。
- 分享图片：Canvas 绘制 750×1050 卡片（品牌 / 体系 / 核心行 / 解读正文 / 时间链接），`toDataURL` 下载，无 Canvas 环境自动降级提示。

### 7. 部署

- 开发：`start.sh`（nodemon 热重载 + Vite，`/api` 代理到 3000）。
- 生产：`deploy.sh` 构建两端后以 `node dist/index.js` 单端口启动；`index.ts` 检测 `tianji-app/dist` 存在时挂载静态资源并对非 `/api` 的 GET 请求做 SPA 回退，根路径即首页。

## 测试

- 前端 `tests/`（vitest + jsdom）：生肖历表区间、生肖页本月 tab、分享工具函数；页面级 DOM 断言。
- 后端 `tests/`（vitest）：真太阳时与城市经度、黄历数据口径、农历/干支换算、限流、手相 AI JSON 解析。
- 运行：两端各自 `npm test`。
