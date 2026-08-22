# 天机 AI 运势查询工具

集东方命理、西方占卜、民俗趣味与 AI 洞察于一体的运势查询平台。20 种占卜体系（八字、紫微斗数、六爻、奇门遁甲、铁板神数、大六壬、塔罗、星座、解梦、黄历、手相等）+ AI 个性化洞察（建议 / 报告 / 趋势）。

## 技术栈

| 层 | 技术 |
|----|------|
| 前端 | React 19 + TypeScript + Vite + Tailwind CSS + React Router |
| 后端 | Node.js + Express 5 + TypeScript |
| 历法数据 | [lunar-typescript](https://github.com/6tail/lunar-javascript)（黄历/农历/节气，前后端同源同库） |
| 存储 | 文件存储（JSON，`tianji-server/data/`），无外部数据库依赖 |
| AI | OpenAI 兼容接口（可配置，无 Key 时自动降级模板解读） |

## 目录结构

```
tianji-app/       前端（React SPA）
  src/pages/          页面（占卜输入页 / 结果页 / 洞察页 / 日历等）
  src/pages/result/   结果页 19 个系统专属布局组件
  src/services/       API 客户端与洞察数据加工
  src/hooks/          业务 hooks（useAuthedHistory 等）
  src/data/           静态数据（体系元信息 systemMeta 等）
  src/tests 与 tests/ 单元测试（vitest）
tianji-server/    后端（Express REST API）
  src/routes/         路由（fortune / auth / config）
  src/services/       20 套体系算法 + AI 解读 + 模板填充
  src/middleware/     限流（内存滑动窗口）
  src/utils/          农历工具 / 城市经度表 / 存储
  data/               运行时数据（users/results/sessions/dream 词典，不入库）
  tests/              单元测试（vitest）
deploy.sh         生产部署脚本（单端口）
start.sh / stop.sh 开发环境启停脚本
```

## 快速开始

### 开发模式（前后端分离，Vite 代理 /api）

```bash
# 一键启动（前端 5174，后端 3000，Vite 代理 /api -> 3000）
./start.sh
```

或手动：

```bash
# 启动后端（nodemon 热重载，端口 3000）
cd tianji-server && npm install && npm run dev

# 启动前端（端口 5174）
cd tianji-app && npm install && npm run dev
```

### 生产模式（单端口，后端托管前端构建产物）

```bash
# 构建前后端并启动（默认端口 3000，根路径即首页）
./deploy.sh
# 自定义端口
PORT=8080 ./deploy.sh
```

生产模式下访问 `http://<host>:<port>/` 即为首页，`/api/*` 为后端接口，二者同源，无需 CORS / 反代。

## 常用命令

| 场景 | 命令 |
|------|------|
| 后端类型检查 | `cd tianji-server && npx tsc --noEmit` |
| 后端构建 | `cd tianji-server && npm run build` |
| 前端类型检查 | `cd tianji-app && npx tsc -b --force` |
| 前端 Lint | `cd tianji-app && npx oxlint src/` |
| 前端构建 | `cd tianji-app && npm run build` |
| 运行测试 | 前后端各自目录 `npm test`（vitest） |

## 环境变量（tianji-server/.env）

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `PORT` | 服务端口 | `3000` |
| `AI_API_KEY` | AI 接口 Key（可在界面「AI 配置」中在线修改） | 空（无 Key 时 AI 功能降级为模板解读） |
| `AI_API_BASE` | AI 接口地址（OpenAI 兼容） | `https://api.openai.com/v1` |
| `AI_MODEL` | AI 模型 | `gpt-4o-mini` |

## 文档

- 架构与关键设计：[.cosmocode/docs/architecture.md](.cosmocode/docs/architecture.md)
- API 参考：[.cosmocode/docs/api.md](.cosmocode/docs/api.md)
- 产品操作文档（面向用户）：[操作文档_AI运势查询工具.md](操作文档_AI运势查询工具.md)
- 产品需求：[PRD_AI运势查询工具.md](PRD_AI运势查询工具.md)
