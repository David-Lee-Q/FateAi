# 用户指令记忆

本文件记录了用户的指令、偏好和教导，用于在未来的交互中提供参考。

## 格式

### 用户指令条目
用户指令条目应遵循以下格式：

[用户指令摘要]
- Date: [YYYY-MM-DD]
- Context: [提及的场景或时间]
- Instructions:
  - [用户教导或指示的内容，逐行描述]

### 项目知识条目
Agent 在任务执行过程中发现的条目应遵循以下格式：

[项目知识摘要]
- Date: [YYYY-MM-DD]
- Context: Agent 在执行 [具体任务描述] 时发现
- Category: [运维部署|构建方法|测试方法|排错调试|工作流协作|环境配置]
- Instructions:
  - [具体的知识点，逐行描述]

## 去重策略
- 添加新条目前，检查是否存在相似或相同的指令
- 若发现重复，跳过新条目或与已有条目合并
- 合并时，更新上下文或日期信息
- 这有助于避免冗余条目，保持记忆文件整洁

## 条目

[天机结果页数据取数排错链路]
- Date: 2026-08-14
- Context: Agent 修复天机 20 个算命结果页「后端真数据不显示」问题时发现
- Category: 排错调试
- Instructions:
  - 结果页统一使用 `tianji-app/src/hooks/useFortuneResult.ts`，返回 `{ result, data, details, interpretation, question, loading, error, notFound, retry }`；`data = result.data`，`details = data.details`
  - 后端各 service 返回结构实测分两类：**平铺型** bazi/tieban/daliuren/zodiac/tarot/dream（字段直接平铺在 data 上）；**包裹型** ziwei/liuyao/meihua/qimen/fengshui/numerology/astrodice/moonphase/rune/nametest/shengxiao/almanac/drawlot/palm（`{ summary, details }` 包裹，前端必须从 `details` 取字段）。注意：tieban/daliuren 是平铺型，不要从 details 取
  - AI 解读统一回退链：`result.interpretation → data.aiInterpretation → data.interpretation`，禁止使用 `data.aiAnalysis` 等假字段
  - 若结果页出现数据空白，先 curl 请求 `POST /api/fortune/query`（参数 `{ system, inputParams }`）核对后端实际返回的字段名与结构，再对照页面取值逻辑；部分系统参数为英文代码（如 fengshui.direction 传 `S`/`N`/`NE` 而非中文「南」，buildingType 传 `residential` 而非「住宅」），参数格式错误会导致返回字段为 undefined 被序列化丢弃
  - 后端启动：`cd tianji-server && npm run build && node dist/index.js`，端口 3000
  - 前端编译验证：根 tsconfig.json 为 `files: []` references 结构，`npx tsc --noEmit` 形同虚设；有效校验是 `cd tianji-app && npx tsc -b --force` 或 `npx tsc -p tsconfig.app.json`，两者结果一致；构建 `npm run build`（Vite）；lint 可用 `npx oxlint`（无 lint 脚本）
  - 前端版本为 TS 6.0.3 + React 19.2 + @types/react 19.2，`JSX.Element` 全局命名空间已废弃，应使用 `React.JSX.Element`（需 `import type * as React from 'react'`）

[TS2322 unknown 聚合报错规律]
- Date: 2026-08-15
- Context: Agent 修复 ResultPage.tsx 最后两个 TS2322 时发现（曾误判为 JSX 注释 bug、类型推断退化）
- Category: 排错调试
- Instructions:
  - 在大型 JSX 组件中，若 JSX 区域内任一子表达式是 `unknown && (<JSX>)`（unknown 参与 `&&` 赋值给 ReactNode），TS 会把 TS2322 错误聚合报错到**该 JSX 区域的第一个子表达式**位置（常落在注释行 `{/* */}`、`{null}`、`{false}` 或任意无关表达式上），而不是真正的 unknown 源
  - 排查方法：不要怀疑 JSX 结构/注释，用 `grep -nE "data\.[a-zA-Z]+ && \("` 扫描含 `data.xxx && (` 的条件；`data.xxx` 在 `Record<string, unknown>` 下是 unknown，需改为 `Boolean(data.xxx) && (`
  - 同样的 unknown 条件还有 `entries[i]?.xxx && (`、`data.a?.b && (` 等可选链+unknown 组合；修复统一用 `Boolean(...)` 包裹 unknown 条件即可，`string | undefined`（如 `dreamTime && (`）不报错无需处理
