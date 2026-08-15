/**
 * 知识库加载器（轻量 RAG）
 * 将 tianji-server/src/knowledge/{system}.md 按章节分块加载，
 * 供 AI 解读 prompt 注入专业知识上下文。
 */

import * as fs from 'fs';
import * as path from 'path';

const KNOWLEDGE_DIR = path.join(__dirname, '../knowledge');

export interface KnowledgeSection {
  heading: string;
  content: string;
}

export interface KnowledgeDoc {
  system: string;
  title: string;
  meta: Record<string, string>;
  sections: KnowledgeSection[];
  sources: string[];
}

const cache: Record<string, KnowledgeDoc | null> = {};

/** 解析 markdown 知识文档 */
function parseKnowledge(system: string): KnowledgeDoc | null {
  const file = path.join(KNOWLEDGE_DIR, `${system}.md`);
  if (!fs.existsSync(file)) return null;

  const raw = fs.readFileSync(file, 'utf-8');
  const lines = raw.split('\n');

  let title = system;
  const meta: Record<string, string> = {};
  const sections: KnowledgeSection[] = [];
  const sources: string[] = [];

  let currentHeading = '';
  let currentLines: string[] = [];

  const flush = () => {
    const content = currentLines.join('\n').trim();
    if (currentHeading && content) {
      sections.push({ heading: currentHeading, content });
    }
    currentLines = [];
  };

  for (const line of lines) {
    const titleMatch = line.match(/^#\s+(.+)$/);
    if (titleMatch) {
      title = titleMatch[1].trim();
      continue;
    }

    const metaMatch = line.match(/^>\s*([^：:]+)：\s*(.+)$/);
    if (metaMatch && sections.length === 0) {
      meta[metaMatch[1].trim()] = metaMatch[2].trim();
      continue;
    }

    const headMatch = line.match(/^##\s+(.+)$/);
    if (headMatch) {
      flush();
      currentHeading = headMatch[1].trim();
      continue;
    }

    if (currentHeading === '参考来源' || currentHeading === '来源' || currentHeading === '参考文献') {
      const srcMatch = line.match(/^\d+\.\s*\[[^\]]+\]\(([^)]+)\)/);
      const plainMatch = line.match(/^\d+\.\s*(.+)/);
      if (srcMatch) sources.push(srcMatch[1]);
      else if (plainMatch) sources.push(plainMatch[1]);
      // 来源行不进入 sections 内容
      if (line.trim().length > 0 && !line.match(/^\d+\./)) currentLines.push(line);
      continue;
    }

    currentLines.push(line);
  }
  flush();

  return { system, title, meta, sections, sources };
}

/** 加载系统知识文档（带缓存） */
export function loadKnowledge(system: string): KnowledgeDoc | null {
  if (system in cache) return cache[system];
  const doc = parseKnowledge(system);
  cache[system] = doc;
  return doc;
}

/** 获取全部已建知识库的系统清单 */
export function listKnowledgeSystems(): string[] {
  if (!fs.existsSync(KNOWLEDGE_DIR)) return [];
  return fs.readdirSync(KNOWLEDGE_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace(/\.md$/, ''));
}

/**
 * 预热知识库缓存：服务启动时一次性读入全部知识库，
 * 运行时 loadKnowledge 全部命中缓存，避免同步磁盘 IO 阻塞事件循环。
 */
export function warmupKnowledgeCache(): string[] {
  const systems = listKnowledgeSystems();
  for (const sys of systems) loadKnowledge(sys);
  return systems;
}

/** 简单的关键词/TF 相关度评分 */
function scoreSection(queryTerms: string[], text: string): number {
  const lower = text.toLowerCase();
  let score = 0;
  for (const term of queryTerms) {
    const t = term.toLowerCase();
    if (!t) continue;
    let idx = 0;
    while ((idx = lower.indexOf(t, idx)) !== -1) {
      score += 1;
      idx += t.length;
    }
  }
  return score;
}

/**
 * 按系统选择知识块并拼接为注入文本（轻量 RAG）
 * @param system 系统标识
 * @param query 检索词（为空则取核心章节前 topN）
 * @param topN 注入章节数上限（默认 5，防止 Prompt 超长）
 */
export function selectKnowledgeChunks(
  system: string,
  query = '',
  topN = 5
): string {
  const doc = loadKnowledge(system);
  if (!doc) return '';

  const queryTerms = query.split(/[\s,，、;；]+/).filter(Boolean);
  let selected = doc.sections;

  if (queryTerms.length > 0) {
    selected = [...doc.sections]
      .map(s => ({ s, score: scoreSection(queryTerms, `${s.heading}\n${s.content}`) }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(x => x.s);
  }

  selected = selected.slice(0, topN);

  const metaLine = doc.meta['领域']
    ? `（领域：${doc.meta['领域']}｜${doc.meta['系统'] || system}）`
    : '';

  const body = selected
    .map(s => `### ${s.heading}\n${s.content}`)
    .join('\n\n');

  if (!body) return '';

  return `《${doc.title}》知识库${metaLine}\n${body}`;
}
