/**
 * JSON 文件持久化存储工具类
 * 内存缓存 + 文件读写，替代内存 Map 存储
 */

import fs from 'fs';
import path from 'path';
import type { FortuneResult } from '../types';

/** 数据文件路径：项目根目录 data/results.json */
const DATA_DIR = path.join(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'results.json');

/**
 * 确保数据目录和文件存在
 */
function ensureDataFile(): void {
  // 确保目录存在
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  // 确保文件存在
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
  }
}

/**
 * 结果持久化存储类
 * - 内存中维护 Map 缓存，保证读取性能
 * - 每次写操作后同步写入 JSON 文件，保证持久化
 */
class ResultStorage {
  private store: Map<string, FortuneResult> = new Map();
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.load();
  }

  /** 从 JSON 文件加载数据到内存 */
  private load(): void {
    ensureDataFile();
    try {
      const raw = fs.readFileSync(this.filePath, 'utf-8');
      const arr: FortuneResult[] = JSON.parse(raw);
      this.store = new Map(arr.map((item) => [item.id, item]));
    } catch (error) {
      console.error('加载数据文件失败，使用空存储:', error);
      this.store = new Map();
    }
  }

  /** 将内存数据写入 JSON 文件 */
  private save(): void {
    try {
      const data = Array.from(this.store.values());
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error('保存数据文件失败:', error);
    }
  }

  /** 存储一条结果 */
  set(id: string, result: FortuneResult): void {
    this.store.set(id, result);
    this.save();
  }

  /** 根据 ID 获取一条结果 */
  get(id: string): FortuneResult | undefined {
    return this.store.get(id);
  }

  /** 获取所有结果 */
  getAll(): FortuneResult[] {
    return Array.from(this.store.values());
  }

  /** 获取最近的历史记录（按创建时间倒序） */
  getHistory(limit: number = 20): FortuneResult[] {
    return Array.from(this.store.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  /** 根据 ID 删除一条结果 */
  delete(id: string): boolean {
    const deleted = this.store.delete(id);
    if (deleted) {
      this.save();
    }
    return deleted;
  }

  /** 清空所有数据 */
  clear(): void {
    this.store.clear();
    this.save();
  }
}

// 导出单例实例
export const resultStorage = new ResultStorage(DATA_FILE);
