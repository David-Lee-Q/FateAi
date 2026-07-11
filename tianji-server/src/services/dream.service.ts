/**
 * 周公解梦服务
 * 从词典文件加载解梦数据，关键词匹配解梦
 */

import fs from 'fs';
import path from 'path';
import type { DreamEntry, DreamResult } from '../types';

/** 词典原始条目（JSON 文件结构） */
interface DictEntry {
  symbol: string;
  fortune: string;
  interpretation: string;
}

/** 解梦词典缓存 */
let dreamDict: Record<string, DictEntry> | null = null;

/** 词典文件路径 */
const DICT_FILE_PATH = path.resolve(__dirname, '../../data/dream-dict.json');

/**
 * 加载解梦词典（带缓存）
 */
function loadDreamDict(): Record<string, DictEntry> {
  if (dreamDict) return dreamDict;

  try {
    const raw = fs.readFileSync(DICT_FILE_PATH, 'utf-8');
    dreamDict = JSON.parse(raw);
    return dreamDict!;
  } catch (error) {
    console.error('加载解梦词典失败:', error);
    // 返回空词典，不中断服务
    return {};
  }
}

/**
 * 关键词匹配解梦
 * @param keywords 用户输入的梦境关键词列表
 * @returns 匹配到的解梦词条及综合解读
 */
export function interpretDream(keywords: string[]): DreamResult {
  const dict = loadDreamDict();
  const matchedEntries: DreamEntry[] = [];
  const fortuneScores: number[] = [];

  for (const keyword of keywords) {
    // 精确匹配
    if (dict[keyword]) {
      matchedEntries.push({ keyword, ...dict[keyword] });
      fortuneScores.push(getFortuneScore(dict[keyword].fortune));
      continue;
    }

    // 模糊匹配：检查词典中是否包含该关键词
    for (const [dictKey, entry] of Object.entries(dict)) {
      if (dictKey.includes(keyword) || keyword.includes(dictKey)) {
        matchedEntries.push({ keyword, symbol: entry.symbol, fortune: entry.fortune, interpretation: entry.interpretation });
        fortuneScores.push(getFortuneScore(entry.fortune));
        break; // 每个用户关键词最多匹配一个词典词条
      }
    }
  }

  // 生成综合解读
  const overallInterpretation = generateOverallInterpretation(keywords, matchedEntries, fortuneScores);

  return {
    keywords,
    entries: matchedEntries,
    overallInterpretation,
  };
}

/**
 * 将运势等级转换为数值分数
 */
function getFortuneScore(fortune: string): number {
  const scoreMap: Record<string, number> = {
    '大吉': 5,
    '吉': 4,
    '中吉': 3,
    '小吉': 2,
    '平': 1,
    '小凶': -1,
    '凶': -2,
    '大凶': -3,
  };
  return scoreMap[fortune] || 0;
}

/**
 * 生成综合解梦分析
 */
function generateOverallInterpretation(
  keywords: string[],
  entries: DreamEntry[],
  scores: number[]
): string {
  if (entries.length === 0) {
    return `未在解梦词典中找到与"${keywords.join('、')}"相关的内容。` +
      '梦境的解读因人而异，建议结合自身近期的生活状态和情绪进行综合思考。';
  }

  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  let overallFortune: string;
  if (avgScore >= 3.5) overallFortune = '整体吉兆，运势良好';
  else if (avgScore >= 1.5) overallFortune = '整体运势平稳，小有波折但无碍';
  else if (avgScore >= 0) overallFortune = '整体运势一般，需谨慎行事';
  else overallFortune = '整体需注意，建议近期凡事多留心';

  const symbols = entries.map(e => e.symbol).filter(Boolean).join('、');

  const lines: string[] = [
    `【梦境关键词】${keywords.join('、')}`,
    `【匹配词条】${entries.length} 条`,
    `【核心象征】${symbols || '暂无'}`,
    `【综合运势】${overallFortune}`,
    '',
    '详细解读：',
    ...entries.map(e => `  · ${e.symbol}：${e.interpretation}`),
    '',
    overallFortune,
  ];

  return lines.join('\n');
}

/**
 * 查询单个关键词的解梦信息
 */
export function lookupDreamKeyword(keyword: string): DreamEntry | null {
  const dict = loadDreamDict();
  if (dict[keyword]) {
    return { keyword, ...dict[keyword] };
  }
  return null;
}

/**
 * 获取所有可用关键词列表
 */
export function getAllKeywords(): string[] {
  const dict = loadDreamDict();
  return Object.keys(dict);
}
