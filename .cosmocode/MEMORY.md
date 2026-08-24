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

[GitHub 镜像推送与本地对象库缺失修复]
- Date: 2026-08-24
- Context: Agent 执行用户"推送到 GitHub"指令时发现本地 .git 历史断裂
- Category: 运维部署
- Instructions:
  - 项目镜像在 GitHub：`github` remote → `https://github.com/David-Lee-Q/FateAi.git`（分支 master）；每次提交推 origin 后需同步 `git push github master`
  - GitHub 推送凭据由用户逐次提供 token，用一次性 URL 推送（`git push https://x-access-token:<token>@github.com/David-Lee-Q/FateAi.git master`），禁止把 token 写进 remote 配置或任何文件
  - 本地 .git 曾出现历史对象缺失（`error: Could not read <sha>` / fsck `missing commit`，旧提交断链）：修复命令 `git fetch origin --refetch master`（git ≥2.36），修复后 `git fsck --connectivity-only` 应干净、`git rev-list --count HEAD` 恢复 40
  - 若本地无法修复且需立即外推：从 gitlab 全量克隆到 /tmp 后从克隆目录推送（gitlab 端历史完整）

[后端改码不生效：孤儿 nodemon/tsx 占用 3000 端口]
- Date: 2026-08-22
- Context: Agent 在验证登录限流时发现"服务器不加载新代码"
- Category: 排错调试
- Instructions:
  - 症状：`tianji-server/src` 改动后 curl 行为不变、日志无 nodemon 重启记录
  - 原因：多次 `npm run dev` 会累积陈旧 nodemon 实例，实际持有 3000 端口的可能是已失去监听的孤儿 tsx 进程（`ps` 看 ppid=1），它不 watch 文件 → 一直跑旧代码
  - 排查：`ss -tlnp | grep ':3000 '` 找持端口 pid → `ps -o ppid= -p <pid>` 确认是否孤儿；`ps aux | grep -E "nodemon|tsx src/index" | grep -v grep` 看实例数
  - 修复：kill 掉本项目全部 nodemon/tsx 实例 → 确认端口释放 → `cd tianji-server && nohup npm run dev > /tmp/opencode/server-dev.log 2>&1 &` 重新启动 → curl `:3000/api/health` 且新行为生效
  - 生产启动方式（区别于开发）：`cd tianji-server && npm run build` 后 `PORT=<port> node dist/index.js`，单端口同时托管前端 dist（根路径即首页）

[直接改 data/*.json 会被后端内存回刷覆盖]
- Date: 2026-08-21
- Context: Agent 在执行 综合报告真实数据 功能后清理测试账号时发现
- Category: 排错调试
- Instructions:
  - `tianji-server` 的 `ResultStorage`（src/utils/storage.ts）启动时把 `data/results.json` 全量读入内存 Map，之后每次写操作都把整个内存 Map 回刷文件；用户存储同理。直接编辑 `data/*.json` 文件后，后端下一次写操作会用旧内存态覆盖你的修改（实测被"复活"已删除的记录）
  - 正确清理流程：①直接改 JSON 文件删数据 → ②`touch tianji-server/src/index.ts` 触发 nodemon 重启让后端重新加载文件 → ③curl `GET :3000/api/health` 确认恢复
  - 清理测试账号要三处同步：`data/users.json`、`data/sessions.json`、`data/results.json`（按 userId 过滤），否则产生孤儿记录
  - 前端页面白屏（React 崩溃）可用 jsdom + Vite `ssrLoadModule` + `createRoot` 复现：全局装 jsdom（`createRequire` 加载），`process.env.VITE_API_BASE` 设为 `http://localhost:3000/api` 可在 Node 中打真实后端接口，脚本模板见 /tmp/opencode/ssr-repro.mts
  - jsdom 交互测试（模拟 input/click）的两个必坑：①必须在 ssrLoadModule 加载 react-dom 之前先建一个 JSDOM 并设置 `globalThis.window/document`，否则 react-dom 模块级 `canUseDOM/isInputEventSupported` 被冻结为 false，之后 dispatch 的 `input` 事件永远不触发 onChange（click 正常、输入框填不上，极难排查）；②React 重渲染会替换 DOM 节点，按钮等元素必须"点击前现查"（querySelector 现查现点），不能缓存旧引用
  - jsdom 中给受控 input 填值需用原型 setter：`Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(el, v)` 后 dispatch `new window.Event('input', {bubbles:true})`；textarea 同理换 HTMLTextAreaElement
  - /tmp 下的测试脚本裸导入（import 'vite'/'react'）会因模块解析失败报错，需用 `createRequire('/workspace/tianji-app/package.json')` 加载依赖；tsx 从 tianji-server 目录运行（`cd tianji-server && node --import tsx xxx.mts`）；交互冒烟脚本模板见 /tmp/opencode/fix-smoke.mts（自管理 app 根目录 __smoke_re.tsx 共享入口，结束自动清理）

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
