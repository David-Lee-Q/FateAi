import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFortuneResult } from '@/services/api';
import type { FortuneResult } from '@/types';

/** 结果数据访问器（统一数据契约） */
export interface FortuneResultData {
  /** 顶层排盘字段（八字/铁板/大六壬/塔罗/星座/解梦为平铺，其余系统为 { summary, details } 的 summary 之外字段） */
  data: Record<string, unknown>;
  /** details 子对象（14 个 { summary, details } 包裹系统的排盘主体） */
  details: Record<string, unknown>;
  /** 统一 AI 解读文本 */
  interpretation: string;
  /** 统一问题展示 */
  question: string;
}

export interface UseFortuneResultReturn extends FortuneResultData {
  id?: string;
  result: FortuneResult | null;
  loading: boolean;
  error: string;
  notFound: boolean;
  retry: () => void;
}

/**
 * 统一结果页取数 Hook
 * 从路由 :id 获取结果，处理 loading/error/404 三态，
 * 并归一化 data/details/interpretation/question 读取。
 */
export function useFortuneResult(): UseFortuneResultReturn {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async () => {
    if (!id) {
      setError('缺少结果 ID');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    setNotFound(false);
    try {
      const res = await getFortuneResult(id);
      const r = res?.data as FortuneResult | undefined;
      if (!r || !r.id) {
        setNotFound(true);
        setError('未找到该查询结果，可能已被清理');
      } else {
        setResult(r);
      }
    } catch (err) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 404) {
        setNotFound(true);
        setError('未找到该查询结果，可能已被清理');
      } else {
        setError('获取结果失败，请稍后重试');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const data = (result?.data ?? {}) as Record<string, unknown>;
  const details = (data.details ?? {}) as Record<string, unknown>;
  const interpretation =
    result?.interpretation ||
    (typeof data.aiInterpretation === 'string' ? data.aiInterpretation : '') ||
    (typeof data.interpretation === 'string' ? data.interpretation : '');
  const input = (result?.input ?? {}) as Record<string, unknown>;
  const question =
    (typeof data.question === 'string' && data.question) ||
    (typeof input.question === 'string' && input.question) ||
    '';

  return { id, result, data, details, interpretation, question, loading, error, notFound, retry: load };
}
