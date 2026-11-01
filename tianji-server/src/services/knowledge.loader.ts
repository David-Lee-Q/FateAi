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

/** 中文友好的检索分词：抽取 2-3 字词块 + 英文/数字词，去除标点与常见停用词 */
const STOPWORDS = new Set([
  '什么', '怎么', '如何', '是否', '可以', '有没有', '我的', '我们', '他们', '这个', '那个',
  '一个', '一些', '现在', '最近', '今年', '今天', '请问', '帮我', '看看', '分析', '解读',
  'the', 'and', 'for', 'with', 'you', 'are',
]);

export function tokenize(query: string): string[] {
  const cleaned = query
    .replace(/[\s，。！？、；：""''（）()【】\[\]…—\-_.!?,;:]/g, ' ')
    .toLowerCase();
  const raw = cleaned.split(/\s+/).filter(Boolean);
  const tokens: string[] = [];
  for (const seg of raw) {
    if (/^[a-z0-9]+$/.test(seg)) {
      if (seg.length > 1 && !STOPWORDS.has(seg)) tokens.push(seg);
      continue;
    }
    const chars = Array.from(seg);
    if (chars.length <= 3) {
      if (!STOPWORDS.has(seg)) tokens.push(seg);
      continue;
    }
    // 长串：滑窗切 2 字与 3 字，保留有意义的块
    for (let i = 0; i + 1 < chars.length; i++) {
      const bi = chars[i] + chars[i + 1];
      if (!STOPWORDS.has(bi)) tokens.push(bi);
    }
    for (let i = 0; i + 2 < chars.length; i++) {
      const tri = chars[i] + chars[i + 1] + chars[i + 2];
      if (!STOPWORDS.has(tri)) tokens.push(tri);
    }
  }
  return Array.from(new Set(tokens));
}

/** 词频 */
function termFreq(term: string, text: string): number {
  if (!term) return 0;
  let count = 0;
  let idx = 0;
  while ((idx = text.indexOf(term, idx)) !== -1) {
    count += 1;
    idx += term.length;
  }
  return count;
}

/** BM25 相关度评分（k1=1.5, b=0.75） */
function bm25(
  terms: string[],
  docs: Array<{ text: string; length: number }>,
  docIndex: number
): number {
  const k1 = 1.5;
  const b = 0.75;
  const N = docs.length;
  const avgdl = docs.reduce((sum, d) => sum + d.length, 0) / Math.max(1, N);
  const d = docs[docIndex];
  let score = 0;
  for (const term of terms) {
    const df = docs.reduce((n, doc) => n + (doc.text.includes(term) ? 1 : 0), 0);
    if (df === 0) continue;
    const idf = Math.log(1 + (N - df + 0.5) / (df + 0.5));
    const tf = termFreq(term, d.text);
    if (tf === 0) continue;
    score += idf * ((tf * (k1 + 1)) / (tf + k1 * (1 - b + b * (d.length / Math.max(1, avgdl)))));
  }
  return score;
}

/**
 * 按系统选择知识块并拼接为注入文本（BM25 检索）
 * @param system 系统标识
 * @param query 检索内容（用户问题 + 排盘关键词；为空则取核心章节）
 * @param topN 注入章节数上限（默认 5）
 * @param maxChars 注入文本字符上限（默认 2600，防止 Prompt 过长）
 */
export function selectKnowledgeChunks(
  system: string,
  query = '',
  topN = 5,
  maxChars = 2600
): string {
  const doc = loadKnowledge(system);
  if (!doc || doc.sections.length === 0) return '';

  const terms = tokenize(query);
  const docs = doc.sections.map((s) => ({
    text: `${s.heading}\n${s.content}`.toLowerCase(),
    length: `${s.heading}${s.content}`.length,
  }));

  let selected: KnowledgeSection[];
  if (terms.length === 0) {
    selected = doc.sections.slice(0, topN);
  } else {
    const scored = doc.sections
      .map((s, i) => ({ s, score: bm25(terms, docs, i) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.s);
    // 命中不足时补核心章节，保证上下文完整
    const core = doc.sections.filter((s) => !scored.includes(s)).slice(0, Math.max(0, topN - scored.length));
    selected = [...scored.slice(0, topN), ...core].slice(0, topN);
    if (selected.length === 0) selected = doc.sections.slice(0, topN);
  }

  const metaLine = doc.meta['领域']
    ? `（领域：${doc.meta['领域']}｜${doc.meta['系统'] || system}）`
    : '';

  const parts: string[] = [];
  let used = 0;
  for (const s of selected) {
    const block = `### ${s.heading}\n${s.content}`;
    if (used + block.length > maxChars && parts.length > 0) break;
    parts.push(block);
    used += block.length;
  }
  if (parts.length === 0) return '';

  return `《${doc.title}》知识库${metaLine}\n${parts.join('\n\n')}`;
}

