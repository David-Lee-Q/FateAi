import { useState, useCallback } from 'react';
import type { FortuneSystem, FortuneResult } from '@/types';
import { submitFortuneQuery, getFortuneResult } from '@/services/api';

/** 占卜查询 Hook */
export function useFortune(system: FortuneSystem) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  /** 提交查询 */
  const query = useCallback(async (params: Record<string, unknown>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await submitFortuneQuery(system, params);
      setResult(res.data);
      return res.data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : '查询失败，请稍后重试';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [system]);

  /** 获取已有结果 */
  const fetchResult = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getFortuneResult(id);
      setResult(res.data);
      return res.data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : '获取结果失败';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, result, error, query, fetchResult };
}
