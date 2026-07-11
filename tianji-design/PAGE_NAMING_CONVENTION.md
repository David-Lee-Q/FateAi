# 天机 - 页面命名规范文档

## 1. 命名规则概述

### 1.1 文件命名规范
- **格式**: `{模块标识}_{主题}.html`
- **主题后缀**: `_dark` (深色主题) / `_light` (浅色主题)
- **模块标识**: 使用拼音命名，简短且语义清晰

### 1.2 页面标题规范
- **格式**: `{页面名称} — 天机`
- **结果页格式**: `{页面名称}分析 — 天机` / `{页面名称}结果 — 天机`

### 1.3 Canvas 区域划分

| Group | 区域 | X坐标 | 颜色系 |
|-------|------|-------|--------|
| 0 | 首页 | 0 / 1400 | 蓝色 #004baa |
| 1 | 东方命理分类页 | 0 / 1400 | 蓝色 #004baa |
| 2 | 东方命理子页面 | 0 / 1400 | 按占卜类型区分 |
| 3 | 西方占卜分类页/子页面 | 300 / 1700 | 紫色 #8b5cf6 |
| 4 | 民俗趣味分类页/子页面 | 600 / 2000 | 多色系 |
| 5 | AI功能/系统页面 | 900 / 2300 | 蓝色 #004baa |

---

## 2. 主功能页面映射表

### 2.1 东方命理类 (pages-dark/eastern_*.html, pages-light/eastern_*.html)

| 文件名 | 页面标题 | 功能描述 | 主题色 |
|--------|----------|----------|--------|
| bazi_dark.html / bazi_light.html | 八字排盘 — 天机 | 八字排盘输入页 | #004baa 蓝色 |
| ziwei_dark.html / ziwei_light.html | 紫微斗数 — 天机 | 紫微斗数输入页 | #7c3aed 紫色 |
| liuyao_dark.html / liuyao_light.html | 六爻卦象 — 天机 | 六爻卦象输入页 | #059669 绿色 |
| qimen_dark.html / qimen_light.html | 奇门遁甲 — 天机 | 奇门遁甲输入页 | #7c3aed 紫色 |
| meihua_dark.html / meihua_light.html | 梅花易数 — 天机 | 梅花易数输入页 | #ec4899 粉色 |
| fengshui_dark.html / fengshui_light.html | 风水罗盘 — 天机 | 风水堪舆输入页 | #059669 绿色 |
| tieban_dark.html / tieban_light.html | 铁板神数 — 天机 | 铁板神数输入页 | #7c3aed 紫色 |
| daliuren_dark.html / daliuren_light.html | 大六壬 — 天机 | 大六壬输入页 | #f59e0b 金色 |

### 2.2 西方占卜类 (pages-dark/western_*.html, pages-light/western_*.html)

| 文件名 | 页面标题 | 功能描述 | 主题色 |
|--------|----------|----------|--------|
| zodiac_dark.html / zodiac_light.html | 星座运势 — 天机 | 星座运势输入页 | #8b5cf6 紫色 |
| tarot_dark.html / tarot_light.html | 塔罗牌占卜 — 天机 | 塔罗牌输入页 | #7c3aed 紫色 |
| astrodice_dark.html / astrodice_light.html | 占星骰子 — 天机 | 占星骰子输入页 | #6366f1 靛蓝 |

### 2.3 民俗趣味类 (pages-dark/folk_*.html, pages-light/folk_*.html)

| 文件名 | 页面标题 | 功能描述 | 主题色 |
|--------|----------|----------|--------|
| moonphase_dark.html / moonphase_light.html | 月相能量 — 天机 | 月相占卜输入页 | #6366f1 靛蓝 |
| rune_dark.html / rune_light.html | 符文占卜 — 天机 | 符文占卜输入页 | #ea580c 橙色 |
| drawlot_dark.html / drawlot_light.html | 签诗抽签 — 天机 | 抽签占卜输入页 | #f59e0b 金色 |
| dream_dark.html / dream_light.html | 周公解梦 — 天机 | 解梦输入页 | #8b5cf6 紫色 |
| palm_dark.html / palm_light.html | 手相算命 — 天机 | 手相算命输入页 | #c8a84e 金棕 |
| nametest_dark.html / nametest_light.html | 姓名测算 — 天机 | 姓名测算输入页 | #06b6d4 青色 |
| numerology_dark.html / numerology_light.html | 数字能量 — 天机 | 数字能量输入页 | #06b6d4 青色 |
| shengxiao_dark.html / shengxiao_light.html | 生肖运势 — 天机 | 生肖运势输入页 | #f59e0b 琥珀 |

### 2.4 AI功能类

| 文件名 | 页面标题 | 功能描述 | 主题色 |
|--------|----------|----------|--------|
| aiinsight_dark.html / aiinsight_light.html | AI 洞察 — 天机 | AI洞察 | #004baa 蓝色 |
| advice_dark.html / advice_light.html | 个性化建议 — 天机 | AI建议 | #004baa 蓝色 |
| report_dark.html / report_light.html | 综合运势报告 — 天机 | 运势报告 | #004baa 蓝色 |

### 2.5 工具与系统页面

| 文件名 | 页面标题 | 功能描述 | 主题色 |
|--------|----------|----------|--------|
| almanac_dark.html / almanac_light.html | 黄历宜忌 — 天机 | 黄历查询 | #f59e0b 金色 |
| home_dark.html / home_light.html | 天机 — 首页 | 首页 | #004baa 蓝色 |
| profile_dark.html / profile_light.html | 个人中心 — 天机 | 用户中心 | #004baa 蓝色 |
| history_dark.html / history_light.html | 历史记录 — 天机 | 算命记录 | #004baa 蓝色 |
| search_dark.html / search_light.html | 搜索 — 天机 | 全局搜索 | #004baa 蓝色 |
| calendar_dark.html / calendar_light.html | 运势日历 — 天机 | 日历功能 | #004baa 蓝色 |
| trend_dark.html / trend_light.html | 趋势追踪 — 天机 | 趋势分析 | #004baa 蓝色 |
| compare_dark.html / compare_light.html | 多维对比 — 天机 | 多维对比 | #004baa 蓝色 |
| result_dark.html / result_light.html | 运势结果 — 天机 | 通用结果页 | #004baa 蓝色 |

---

## 3. 占卜结果页映射表 (result_pages/)

### 3.1 命名规则
- **格式**: `result_{模块标识}_{主题}.html`
- **前缀**: `result_` 固定前缀
- **主题色**: 每种占卜类型有独特的主题色

### 3.2 结果页映射表

| 文件名 | 页面标题 | 占卜类型 | 主题色 |
|--------|----------|----------|--------|
| result_bazi_dark.html / result_bazi_light.html | 八字命盘分析 — 天机 | 八字排盘 | #004baa 深天蓝 |
| result_ziwei_dark.html / result_ziwei_light.html | 紫微斗数分析 — 天机 | 紫微斗数 | #7c3aed 紫色 |
| result_liuyao_dark.html / result_liuyao_light.html | 六爻占卜分析 — 天机 | 六爻占卜 | #059669 绿色 |
| result_qimen_dark.html / result_qimen_light.html | 奇门遁甲分析 — 天机 | 奇门遁甲 | #7c3aed 紫色 |
| result_meihua_dark.html / result_meihua_light.html | 梅花易数分析 — 天机 | 梅花易数 | #ec4899 粉色 |
| result_daliuren_dark.html / result_daliuren_light.html | 大六壬分析 — 天机 | 大六壬 | #f59e0b 金色 |
| result_tieban_dark.html / result_tieban_light.html | 铁板神数分析 — 天机 | 铁板神数 | #7c3aed 紫色 |
| result_fengshui_dark.html / result_fengshui_light.html | 风水堪舆分析 — 天机 | 风水堪舆 | #059669 绿色 |
| result_xingzuo_dark.html / result_xingzuo_light.html | 星座运势分析 — 天机 | 星座运势 | #8b5cf6 紫色 |
| result_tarot_dark.html / result_tarot_light.html | 塔罗牌分析 — 天机 | 塔罗牌 | #7c3aed 紫色 |
| result_astrology_dark.html / result_astrology_light.html | 占星骰子分析 — 天机 | 占星骰子 | #6366f1 靛蓝 |
| result_moon_dark.html / result_moon_light.html | 月相占卜分析 — 天机 | 月相占卜 | #6366f1 靛蓝 |
| result_rune_dark.html / result_rune_light.html | 符文占卜分析 — 天机 | 符文占卜 | #ea580c 橙色 |
| result_number_dark.html / result_number_light.html | 数字能量分析 — 天机 | 数字能量 | #06b6d4 青色 |
| result_zodiac_dark.html / result_zodiac_light.html | 生肖运势分析 — 天机 | 生肖运势 | #f59e0b 琥珀 |
| result_sign_dark.html | 抽签占卜结果 — 天机 | 抽签占卜 | #f59e0b 金色 |
| result_dream_dark.html | 解梦结果 — 天机 | 解梦 | #8b5cf6 紫色 |
| result_palm_dark.html | 手相算命结果 — 天机 | 手相算命 | #c8a84e 金棕 |
| result_name_dark.html | 姓名测算结果 — 天机 | 姓名测算 | #06b6d4 青色 |

---

## 4. 页面分类统计

### 4.1 按功能分类

| 分类 | 数量 | 页面 |
|------|------|------|
| 东方命理 | 8 | 八字、紫微斗数、六爻、奇门遁甲、梅花易数、风水堪舆、铁板神数、大六壬 |
| 西方占卜 | 3 | 星座运势、塔罗牌、占星骰子 |
| 民俗趣味 | 8 | 月相、符文、抽签、解梦、手相、姓名、数字能量、生肖 |
| AI功能 | 3 | AI洞察、个性化建议、综合运势报告 |
| 工具功能 | 5 | 黄历、日历、趋势、对比、搜索 |
| 系统功能 | 4 | 首页、个人中心、历史记录、通用结果页 |
| 结果展示 | 19 | 各类占卜结果页 |

**总计**: 50 页面（含深浅两套）

### 4.2 按主题分类

| 主题 | 输入页 | 结果页 | 总计 |
|------|--------|--------|------|
| 深色 (dark) | 31 | 19 | 50 |
| 浅色 (light) | 31 | 17 | 48 |

---

## 5. 主题色系统

| 颜色系 | 色值 | 适用页面 |
|--------|------|----------|
| 蓝色 | #004baa | 八字排盘、系统页面 |
| 紫色 | #7c3aed / #8b5cf6 | 紫微斗数、奇门遁甲、塔罗牌、星座、铁板神数、解梦 |
| 绿色 | #059669 | 六爻、风水堪舆 |
| 金色 | #f59e0b | 大六壬、抽签、生肖、黄历 |
| 粉色 | #ec4899 | 梅花易数 |
| 青色 | #06b6d4 | 姓名测算、数字能量 |
| 橙色 | #ea580c | 符文占卜 |
| 靛蓝 | #6366f1 | 占星骰子、月相占卜 |
| 金棕 | #c8a84e | 手相算命 |

---

## 6. 版本历史

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| 1.2.0 | 2026-07-11 | 重新整理 .design 文件，按色系区域划分；新增铁板神数、大六壬完整深浅版本；更新文档 |
| 1.1.0 | 2026-07-11 | 新增铁板神数、大六壬输入页 |
| 1.0.0 | 2026-07-11 | 初始文档 |

---

*文档更新时间: 2026-07-11*