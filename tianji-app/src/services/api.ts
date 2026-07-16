import axios from 'axios';
import type {
  ApiResponse,
  FortuneResult,
  AlmanacResult,
  TrendData,
  CompareResult,
} from '@/types';

/** API 基础地址 */
const API_BASE = import.meta.env.VITE_API_BASE || '/api';

/** 创建 axios 实例 */
const http = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/** 请求拦截器：可在此附加 token 等通用逻辑 */
http.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

/** 响应拦截器：统一错误处理 */
http.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API 请求失败:', error);
    return Promise.reject(error);
  }
);

/* ================================================================
 *  基础接口（后端已实现）
 * ================================================================ */

/**
 * 提交占卜查询
 * 统一通过 /fortune/query 接口，以 system 字段区分占卜类型
 * @param system 占卜系统标识
 * @param params 查询参数
 */
export async function submitFortuneQuery(
  system: string,
  params: Record<string, unknown>
): Promise<ApiResponse<FortuneResult>> {
  const response = await http.post<ApiResponse<FortuneResult>>('/fortune/query', {
    system,
    inputParams: params,
  });
  return response.data;
}

/**
 * 获取占卜结果详情
 * @param id 结果 ID
 */
export async function getFortuneResult(
  id: string
): Promise<ApiResponse<FortuneResult>> {
  const response = await http.get<ApiResponse<FortuneResult>>(
    `/fortune/result/${id}`
  );
  return response.data;
}

/**
 * 获取占卜结果（兼容前端调用习惯）
 * @param id 结果 ID
 */
export async function fetchFortuneResult(
  id: string
): Promise<any> {
  const response = await http.get<any>(`/fortune/result/${id}`);
  return response.data;
}

/**
 * 获取历史查询记录
 */
export async function getHistory(): Promise<ApiResponse<FortuneResult[]>> {
  const response = await http.get<ApiResponse<FortuneResult[]>>(
    '/fortune/history'
  );
  return response.data;
}

/**
 * AI 追问
 * 基于已有占卜结果进行追问解读
 * @param resultId 结果 ID
 * @param question 追问问题
 */
export async function submitFollowUp(
  resultId: string,
  question: string
): Promise<ApiResponse<{ answer: string; question: string; timestamp: string }>> {
  const response = await http.post<
    ApiResponse<{ answer: string; question: string; timestamp: string }>
  >('/fortune/followup', {
    resultId,
    question,
  });
  return response.data;
}

/* ================================================================
 *  扩展接口（通过 fortune/query 统一调度）
 * ================================================================ */

/**
 * 获取黄历信息
 * 通过 fortune/query 接口传递 system='almanac'
 * @param date 日期字符串，格式 YYYY-MM-DD
 */
export async function getAlmanac(
  date: string
): Promise<ApiResponse<AlmanacResult>> {
  try {
    const response = await http.post<ApiResponse<AlmanacResult>>(
      '/fortune/query',
      { system: 'almanac', inputParams: { date } }
    );
    return response.data;
  } catch (error) {
    // 后端尚未实现 almanac system 时优雅降级
    console.warn('黄历接口暂不可用:', error);
    return {
      code: -1,
      message: '黄历功能暂未开放，请稍后再试',
      data: {} as AlmanacResult,
    };
  }
}

/**
 * 搜索运势相关内容
 * 通过 fortune/query 接口传递 system='search'
 * @param keyword 搜索关键词
 */
export async function searchFortune(
  keyword: string
): Promise<ApiResponse<FortuneResult[]>> {
  try {
    const response = await http.post<ApiResponse<FortuneResult[]>>(
      '/fortune/query',
      { system: 'search', inputParams: { keyword } }
    );
    return response.data;
  } catch (error) {
    console.warn('搜索接口暂不可用:', error);
    return {
      code: -1,
      message: '搜索功能暂未开放，请稍后再试',
      data: [],
    };
  }
}

/**
 * 获取运势趋势数据
 * 通过 fortune/query 接口传递 system='trend'
 * @param system 占卜系统标识
 * @param dimension 分析维度（如 'overall', 'career', 'love'）
 * @param days 天数
 */
export async function getTrend(
  system: string,
  dimension: string,
  days: number
): Promise<ApiResponse<TrendData>> {
  try {
    const response = await http.post<ApiResponse<TrendData>>(
      '/fortune/query',
      { system: 'trend', inputParams: { source: system, dimension, days } }
    );
    return response.data;
  } catch (error) {
    console.warn('趋势分析接口暂不可用:', error);
    return {
      code: -1,
      message: '趋势分析功能暂未开放，请稍后再试',
      data: {} as TrendData,
    };
  }
}

/**
 * 运势对比分析
 * 通过 fortune/query 接口传递 system='compare'
 * @param params1 第一组查询参数
 * @param params2 第二组查询参数
 */
export async function getCompare(
  params1: Record<string, unknown>,
  params2: Record<string, unknown>
): Promise<ApiResponse<CompareResult>> {
  try {
    const response = await http.post<ApiResponse<CompareResult>>(
      '/fortune/query',
      {
        system: 'compare',
        inputParams: { params1, params2 },
      }
    );
    return response.data;
  } catch (error) {
    console.warn('对比分析接口暂不可用:', error);
    return {
      code: -1,
      message: '对比分析功能暂未开放，请稍后再试',
      data: {} as CompareResult,
    };
  }
}

/* ================================================================
 *  AI 配置接口
 * ================================================================ */

/** AI 配置信息 */
export interface AiConfig {
  apiKey: string;       // 脱敏后的 key
  hasApiKey: boolean;   // 是否已配置
  apiBase: string;      // API 地址
  model: string;        // 模型名称
}

/** 获取 AI 配置 */
export async function getAiConfig(): Promise<AiConfig> {
  const response = await http.get<{ success: boolean; data: AiConfig }>('/config/ai');
  return response.data.data;
}

/** 保存 AI 配置 */
export async function saveAiConfig(config: {
  apiKey?: string;
  apiBase?: string;
  model?: string;
}): Promise<void> {
  await http.put('/config/ai', config);
}
