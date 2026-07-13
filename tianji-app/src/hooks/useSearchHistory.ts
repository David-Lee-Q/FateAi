/**
 * 搜索历史管理 Hook
 * 支持持久化存储到 localStorage
 */
import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'tianji_search_history';
const MAX_HISTORY = 50; // 最多保存50条

export interface SearchHistoryItem {
  id: string;
  text: string;       // 搜索关键词
  system?: string;    // 对应的占卜系统
  timestamp: number;  // 时间戳
}

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 初始化加载
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch {
      // 忽略解析错误
    }
    setLoading(false);
  }, []);

  // 保存到 localStorage
  const saveToStorage = useCallback((items: SearchHistoryItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // 忽略存储错误
    }
  }, []);

  // 添加搜索记录
  const addHistory = useCallback((text: string, system?: string) => {
    const now = Date.now();
    setHistory((prev) => {
      // 检查是否已存在相同关键词
      const filtered = prev.filter((item) => item.text !== text);
      const newItem: SearchHistoryItem = {
        id: `search_${now}`,
        text,
        system,
        timestamp: now,
      };
      const updated = [newItem, ...filtered].slice(0, MAX_HISTORY);
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  // 删除单条记录
  const deleteHistory = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  // 清空全部记录
  const clearHistory = useCallback(() => {
    setHistory([]);
    saveToStorage([]);
  }, [saveToStorage]);

  // 格式化时间显示
  const formatTime = useCallback((timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;

    if (diff < minute) return '刚刚';
    if (diff < hour) return `${Math.floor(diff / minute)} 分钟前`;
    if (diff < day) return `${Math.floor(diff / hour)} 小时前`;
    if (diff < 7 * day) return `${Math.floor(diff / day)} 天前`;
    if (diff < 30 * day) return `${Math.floor(diff / (7 * day))} 周前`;
    return new Date(timestamp).toLocaleDateString('zh-CN');
  }, []);

  // 获取所有记录（包含格式化时间）
  const getFormattedHistory = useCallback(() => {
    return history.map((item) => ({
      ...item,
      time: formatTime(item.timestamp),
    }));
  }, [history, formatTime]);

  // 导出数据为 JSON
  const exportData = useCallback((): string => {
    return JSON.stringify({
      searchHistory: history,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    }, null, 2);
  }, [history]);

  // 导入数据
  const importData = useCallback((jsonStr: string) => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.searchHistory && Array.isArray(data.searchHistory)) {
        setHistory(data.searchHistory);
        saveToStorage(data.searchHistory);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [saveToStorage]);

  return {
    history,
    loading,
    addHistory,
    deleteHistory,
    clearHistory,
    formatTime,
    getFormattedHistory,
    exportData,
    importData,
    getCount: () => history.length,
  };
}