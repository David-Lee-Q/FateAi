import { useEffect, useState } from 'react';
import { useAuth } from '@/context/useAuth';
import { getHistory } from '@/services/api';
import { scoreRecords, type ScoredRecord } from '@/services/insights';
import type { FortuneResult } from '@/types';

/**
 * 洞察页登录态取数（建议 / 综合报告 / 运势趋势共用口径）：
 * - 未登录：records 为 null，展示演示数据；
 * - 登录态：拉取最近 200 条真实查询记录并打分。
 */
export function useAuthedHistory() {
  const { user, loading: authLoading } = useAuth();
  const [records, setRecords] = useState<ScoredRecord[] | null>(null);

  useEffect(() => {
    if (!user) {
      setRecords(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const resp = await getHistory(200);
        if (cancelled) return;
        const list = (resp.data ?? []) as FortuneResult[];
        setRecords(scoreRecords(list));
      } catch {
        if (!cancelled) setRecords([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const isDemo = !authLoading && !user;
  const isLoading = Boolean(user) && records === null;
  const isEmpty = Boolean(user) && records !== null && records.length === 0;

  return { user, authLoading, records, isDemo, isLoading, isEmpty };
}
