# API 参考

基础路径：`/api`。除注明外，所有接口返回 `{ success, data?, message? }`。登录态接口需请求头 `Authorization: Bearer <token>`。

## 健康检查

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/health` | 返回 `{ status: 'ok', name, version }` |

## 占卜查询（/api/fortune）

### POST `/fortune/query`

提交占卜查询。

请求体：

```json
{ "system": "bazi", "inputParams": { "year": 1995, "month": 6, "day": 15, "hour": 6, "gender": "男", "city": "北京", "province": "北京市" } }
```

- `system`：20 套体系之一——`bazi, ziwei, liuyao, meihua, qimen, fengshui, tieban, daliuren, tarot, zodiac, numerology, astrodice, moonphase, rune, dream, nametest, shengxiao, almanac, drawlot, palm`
- `inputParams`：随体系而异（八字传出生年月日时/性别/城市省份；塔罗传 `question`；黄历传 `date`；手相传 Base64 `image` 等）。
- 登录态下结果绑定当前用户。

响应 `data`：结果记录 `{ id, system, createdAt, status, interpretation, input, data }`，其中 `data` 为体系原始结果。

### GET `/fortune/result/:id`

按 id 获取结果（无鉴权，用于分享链接）。

### GET `/fortune/history?limit=20`

获取历史记录。登录态仅返回当前用户自己的记录，匿名返回全局最近记录。响应：`{ success, data: [结果...], mine: boolean }`（`mine` 标记记录是否属于当前用户，前端依赖此结构）。

### POST `/fortune/followup`

针对某条结果追问 AI。请求体 `{ resultId, question }`，以原结果的 AI 解读为上下文调用模型。

### POST `/fortune/ai-chat`

自由提问 AI 建议（匿名可用，不入库）。请求体 `{ question, context? }`，`question` 最长 500 字。响应 `data: { answer, question, timestamp }`。

## 认证（/api/auth）

| 方法 | 路径 | 限流 | 说明 |
|------|------|------|------|
| POST | `/auth/register` | 3 次/小时/IP | 注册，返回 `{ token, user }` |
| POST | `/auth/login` | 5 次/分钟/IP | 登录，返回 `{ token, user }` |
| GET | `/auth/me` | — | 当前用户信息 |
| PUT | `/auth/profile` | — | 更新个人资料（昵称/出生信息等） |
| POST | `/auth/logout` | — | 注销当前会话 |

限流超限返回 `429` 与友好提示。

## AI 配置（/api/config）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/config/ai` | 读取 AI 配置（Key 脱敏） |
| PUT | `/config/ai` | 保存 AI 配置（`apiKey/apiBase/model`），写入 `.env` 并热更新进程环境变量 |

## 通用约定

- 参数缺失/非法：`400` + `message` 说明。
- 结果不存在：`404`。
- AI 功能在无 Key / 调用失败时自动降级为模板解读，接口仍返回 `success: true`（结果中带降级来源标注）。
