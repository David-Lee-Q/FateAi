/* ================================================================
 *  天机 AI 运势查询工具 — 类型定义
 * ================================================================ */

/** 占卜系统标识（23 种，与后端保持一致） */
export type FortuneSystem =
  | 'bazi'
  | 'tarot'
  | 'zodiac'
  | 'dream'
  | 'ziwei'
  | 'liuyao'
  | 'meihua'
  | 'qimen'
  | 'fengshui'
  | 'numerology'
  | 'astrodice'
  | 'moonphase'
  | 'rune'
  | 'nametest'
  | 'shengxiao'
  | 'almanac'
  | 'drawlot'
  | 'palm'
  | 'tieban'
  | 'daliuren'
  | 'report'
  | 'trend'
  | 'compare';

/** 运势分类 */
export type FortuneCategory = 'eastern' | 'western' | 'folk' | 'ai';

/* ================================================================
 *  核心数据模型
 * ================================================================ */

/** 占卜查询请求 */
export interface FortuneQuery {
  system: FortuneSystem;
  inputParams: Record<string, unknown>;
  createdAt: string;
}

/** 占卜结果（与后端返回结构一致） */
export interface FortuneResult {
  id: string;
  system: FortuneSystem;
  createdAt: string;
  status: 'completed' | 'pending';
  data: Record<string, unknown>;
}

/** 通用 API 响应（兼容后端 { success, data } 和 { code, message, data } 两种格式） */
export interface ApiResponse<T = unknown> {
  success?: boolean;
  code?: number;
  message?: string;
  data: T;
}

/* ================================================================
 *  扩展数据模型
 * ================================================================ */

/** 黄历查询结果 */
export interface AlmanacResult {
  date: string;
  lunarDate: string;
  yi: string[];       // 宜
  ji: string[];       // 忌
  constellation: string;
  pengzu: string;
  godDirection: string;
  summary: string;
}

/** 运势趋势数据点 */
export interface TrendDataPoint {
  date: string;
  score: number;       // 0-100 运势评分
  label?: string;      // 可选的文字标签
}

/** 运势趋势结果 */
export interface TrendData {
  system: string;
  dimension: string;
  days: number;
  data: TrendDataPoint[];
  summary: string;
}

/** 对比分析单项结果 */
export interface CompareItem {
  label: string;
  params: Record<string, unknown>;
  scores: Record<string, number>;  // 各维度得分
}

/** 对比分析结果 */
export interface CompareResult {
  items: CompareItem[];
  analysis: string;     // AI 综合分析
  suggestions: string[]; // 建议
}

/* ================================================================
 *  UI 展示类型
 * ================================================================ */

/** 首页工具卡片 */
export interface FortuneTool {
  id: FortuneSystem;
  name: string;
  desc: string;
  icon: string;
  path: string;
  category: FortuneCategory;
}

/** 导航菜单项 */
export interface NavItem {
  label: string;
  path: string;
  category?: FortuneCategory;
}
