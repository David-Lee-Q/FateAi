import type { FortuneResult } from '@/types';

/* ================================================================
 *  真实数据分析引擎
 *  基于用户真实查询记录计算趋势、周期、AI 解读与综合报告
 * ================================================================ */

export type DimensionKey = 'overall' | 'career' | 'love' | 'wealth' | 'health';
export type RangeKey = '7d' | '30d' | '12m' | '5y';

export const DIM_KEYS: DimensionKey[] = ['overall', 'career', 'love', 'wealth', 'health'];

export const DIM_LABELS: Record<DimensionKey, string> = {
  overall: '综合运势',
  career: '事业运',
  love: '感情运',
  wealth: '财运',
  health: '健康运',
};

export const RANGE_DAYS: Record<RangeKey, number> = { '7d': 7, '30d': 30, '12m': 365, '5y': 1825 };

/** 占卜系统中文名 */
export const SYSTEM_NAMES: Record<string, string> = {
  bazi: '八字命理', ziwei: '紫微斗数', liuyao: '六爻占卜', meihua: '梅花易数',
  qimen: '奇门遁甲', tieban: '铁板神数', daliuren: '大六壬', fengshui: '风水堪舆',
  tarot: '塔罗占卜', zodiac: '星座运势', numerology: '数字能量', astrodice: '骰子占卜',
  moonphase: '月相占卜', rune: '符文占卜', dream: '周公解梦', nametest: '姓名测试',
  shengxiao: '生肖运势', almanac: '黄历宜忌', drawlot: '签诗抽签', palm: '手相算命',
  report: '综合报告', compare: '对比分析', search: '运势搜索', trend: '趋势分析',
};

/** 参与统计的系统（排除聚合类系统） */
const AGGREGATE_SYSTEMS = new Set(['report', 'compare', 'search', 'trend']);

export interface ScoredRecord {
  id: string;
  system: string;
  systemName: string;
  date: Date;
  score: number;
  dims: Record<DimensionKey, number>;
  summary: string;
  aiText: string;
  tags: string[];
}

export interface SeriesPoint {
  date: Date;
  value: number;
  count: number;
}

export interface KeyPoints {
  peak: SeriesPoint | null;
  trough: SeriesPoint | null;
  turning: SeriesPoint | null;
  current: SeriesPoint | null;
}

export interface CycleCard {
  tag: string;
  time: string;
  title: string;
  desc: string;
}

export interface InsightItem {
  bold: string;
  text: string;
}

export interface RealReportContent {
  score: number;
  headline: string;
  summary: string;
  dimensions: { label: string; value: number }[];
  systems: { score: number; content: string; tags: string[]; name?: string; subtitle?: string }[];
  consensus: { title: string; desc: string }[];
  divergences: { title: string; desc: string }[];
  timeline: { date: string; tagLabel: string; title: string; desc: string }[];
  advice: string[];
}

/* ============ 基础工具 ============ */

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
}

function num(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v))) return Number(v);
  return null;
}

function clampScore(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function avg(arr: number[]): number {
  if (arr.length === 0) return 0;
  return Math.round(arr.reduce((s, v) => s + v, 0) / arr.length);
}

/** 确定性字符串哈希（同一记录同一维度始终得到相同分值） */
function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** 无原生分数的体系：基于查询内容派生稳定分值（不同内容/维度结果不同） */
function derivedDim(content: string, dim: DimensionKey): number {
  const base = 52 + (hashStr(content) % 41);
  const delta = (hashStr(`${content}::${dim}`) % 17) - 8;
  return clampScore(base + delta);
}

function textOf(d: Record<string, unknown>, ...keys: string[]): string {
  for (const k of keys) {
    const v = d[k];
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return '';
}

/** 截取文本（保留完整句子边界） */
function clip(text: string, max: number): string {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const m = cut.search(/[。；;！!？?，,]$/);
  if (m > max * 0.5) return cut.slice(0, m + 1);
  return `${cut}…`;
}

export function fmtMD(d: Date): string {
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function fmtDateTime(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

/* ============ 分值提取 ============ */

/** 提取体系原生分数（部分体系无原生分数，返回空） */
function nativeDims(r: FortuneResult): Partial<Record<DimensionKey, number>> {
  const d = asRecord(r.data);
  const details = asRecord(d.details);
  const out: Partial<Record<DimensionKey, number>> = {};
  const put = (k: DimensionKey, v: unknown) => {
    const n = num(v);
    if (n !== null) out[k] = clampScore(n);
  };

  const subScores = (src: Record<string, unknown>) => {
    for (const s of ['love', 'career', 'wealth', 'health'] as const) {
      put(s, asRecord(src[s]).score);
    }
  };

  if (r.system === 'zodiac') {
    put('overall', d.overallScore);
    subScores(d);
  } else if (r.system === 'shengxiao') {
    const z = asRecord(details.zodiac);
    put('overall', z.overallScore ?? d.overallScore);
    subScores(z);
  } else if (r.system === 'nametest') {
    const sc = asRecord(details.scores);
    put('overall', sc.overall);
    put('career', sc.career);
    put('wealth', sc.wealth);
    put('love', sc.love);
    put('health', sc.health);
  } else if (r.system === 'drawlot') {
    put('overall', details.score ?? d.score);
  } else if (r.system === 'tieban') {
    const lv = String(d.fortuneLevel ?? details.fortuneLevel ?? '');
    const map: Record<string, number> = {
      '上上吉': 95, '上吉': 90, '中吉': 76, '小吉': 64,
      '平': 55, '小凶': 42, '中凶': 34, '大凶': 24,
    };
    if (map[lv] !== undefined) out.overall = map[lv];
  }
  return out;
}

/** 从结果中提取展示标签（真实字段） */
function recordTags(r: FortuneResult): string[] {
  const d = asRecord(r.data);
  const tags: string[] = [];
  if (typeof d.sign === 'string' && d.sign) tags.push(d.sign);
  if (typeof d.luckyColor === 'string' && d.luckyColor) tags.push(`幸运色 ${d.luckyColor}`);
  if (num(d.luckyNumber) !== null) tags.push(`幸运数字 ${d.luckyNumber}`);
  if (Array.isArray(d.luckyNumbers) && d.luckyNumbers.length > 0) {
    tags.push(`幸运数字 ${d.luckyNumbers.slice(0, 3).join('、')}`);
  }
  if (typeof d.fortuneLevel === 'string' && d.fortuneLevel) tags.push(d.fortuneLevel);
  const details = asRecord(d.details);
  if (typeof details.level === 'string' && details.level) tags.push(details.level);
  const wxc = asRecord(d.wuXingCount);
  const wxEntries = Object.entries(wxc);
  if (wxEntries.length === 5) {
    const sorted = [...wxEntries].sort((a, b) => (b[1] as number) - (a[1] as number));
    tags.push(`五行 ${sorted[0][0]}最旺`);
  }
  return tags.slice(0, 3);
}

/** 将查询记录转为带分值的分析记录 */
export function scoreRecords(records: FortuneResult[]): ScoredRecord[] {
  const list: ScoredRecord[] = [];
  for (const r of records) {
    if (r.status !== 'completed' || AGGREGATE_SYSTEMS.has(r.system)) continue;
    const d = asRecord(r.data);
    const summary = textOf(d, 'summary', 'overallInterpretation', 'interpretation', 'advice', 'aiInterpretation');
    const aiText = textOf(d, 'aiInterpretation') || (typeof r.interpretation === 'string' ? r.interpretation : '');
    const content = summary || aiText || JSON.stringify(d).slice(0, 200);
    const native = nativeDims(r);
    const dims = {} as Record<DimensionKey, number>;
    for (const dim of DIM_KEYS) {
      dims[dim] = native[dim] ?? derivedDim(content, dim);
    }
    list.push({
      id: r.id,
      system: r.system,
      systemName: SYSTEM_NAMES[r.system] || r.system,
      date: new Date(r.createdAt),
      score: native.overall ?? dims.overall,
      dims,
      summary: summary ? clip(summary, 120) : '',
      aiText: clip(aiText, 300),
      tags: recordTags(r),
    });
  }
  return list.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/** 按时间范围过滤 */
export function filterRange(records: ScoredRecord[], range: RangeKey): ScoredRecord[] {
  const cutoff = Date.now() - RANGE_DAYS[range] * 86400000;
  return records.filter((r) => r.date.getTime() >= cutoff);
}

/* ============ 趋势序列 ============ */

/** 按时间桶聚合维度分值 */
export function buildSeries(records: ScoredRecord[], dim: DimensionKey, range: RangeKey): SeriesPoint[] {
  const bucketDays = range === '7d' || range === '30d' ? 1 : range === '12m' ? 7 : 30;
  const bucketMs = bucketDays * 86400000;
  const map = new Map<number, { sum: number; count: number }>();
  for (const r of records) {
    const dayStart = new Date(r.date);
    dayStart.setHours(0, 0, 0, 0);
    const bucket = Math.floor(dayStart.getTime() / bucketMs) * bucketMs;
    const cur = map.get(bucket) ?? { sum: 0, count: 0 };
    cur.sum += r.dims[dim];
    cur.count += 1;
    map.set(bucket, cur);
  }
  return Array.from(map.entries())
    .map(([t, v]) => ({ date: new Date(t), value: avg([v.sum / v.count]), count: v.count }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

/** 找出序列中的高峰 / 低谷 / 转折点 / 当前值 */
export function findKeyPoints(series: SeriesPoint[]): KeyPoints {
  if (series.length === 0) return { peak: null, trough: null, turning: null, current: null };
  let peak = series[0];
  let trough = series[0];
  for (const p of series) {
    if (p.value > peak.value) peak = p;
    if (p.value < trough.value) trough = p;
  }
  let turning: SeriesPoint | null = null;
  for (let i = 1; i < series.length - 1; i++) {
    const d1 = series[i].value - series[i - 1].value;
    const d2 = series[i + 1].value - series[i].value;
    if (d1 * d2 < 0 && Math.abs(d1) + Math.abs(d2) >= 10) {
      turning = series[i];
      break;
    }
  }
  return { peak, trough, turning, current: series[series.length - 1] };
}

/* ============ 周期分析（基于真实记录） ============ */

export const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

export function cycleAnalysis(records: ScoredRecord[], dim: DimensionKey, _range: RangeKey): CycleCard[] {
  const cards: CycleCard[] = [];
  const n = records.length;
  const dimLabel = DIM_LABELS[dim];

  if (n === 0) return cards;

  // 短周期：查询节奏
  const spanDays = Math.max(1, Math.round((records[n - 1].date.getTime() - records[0].date.getTime()) / 86400000));
  const gapAvg = n > 1 ? Math.max(1, Math.round(spanDays / (n - 1))) : 1;
  const weekdayCount = new Array(7).fill(0) as number[];
  for (const r of records) weekdayCount[r.date.getDay()] += 1;
  const topWeekday = weekdayCount.indexOf(Math.max(...weekdayCount));
  let best = records[0];
  for (const r of records) if (r.dims[dim] > best.dims[dim]) best = r;
  cards.push({
    tag: '短周期',
    time: `查询间隔约 ${gapAvg} 天`,
    title: '查询节奏与高点',
    desc: `你在所选时间段内共查询 ${n} 次，平均间隔约 ${gapAvg} 天，查询最集中在${WEEKDAYS[topWeekday]}。${dimLabel}的最高分 ${best.dims[dim]} 分出现在 ${fmtMD(best.date)}（${best.systemName}），可作为近期状态参照点。`,
  });

  // 中周期：体系偏好
  const sysCount = new Map<string, ScoredRecord[]>();
  for (const r of records) {
    const arr = sysCount.get(r.system) ?? [];
    arr.push(r);
    sysCount.set(r.system, arr);
  }
  const topSys = Array.from(sysCount.entries()).sort((a, b) => b[1].length - a[1].length)[0];
  const topSysScore = avg(topSys[1].map((r) => r.dims[dim]));
  const latestSys = topSys[1][topSys[1].length - 1];
  cards.push({
    tag: '中周期',
    time: `覆盖 ${sysCount.size} 个体系`,
    title: '体系使用偏好',
    desc: `你最常用的体系是${topSys[1][0].systemName}（${topSys[1].length} 次），其${dimLabel}均分为 ${topSysScore} 分。最近一次该体系查询（${fmtMD(latestSys.date)}）显示：${clip(latestSys.summary || latestSys.aiText, 60)}`,
  });

  // 长周期：前后半程对比
  const mid = (records[0].date.getTime() + records[n - 1].date.getTime()) / 2;
  const first = records.filter((r) => r.date.getTime() <= mid);
  const second = records.filter((r) => r.date.getTime() > mid);
  const firstAvg = avg(first.map((r) => r.dims[dim]));
  const secondAvg = avg(second.map((r) => r.dims[dim]));
  const delta = secondAvg - firstAvg;
  const direction = delta > 5 ? '上升通道' : delta < -5 ? '回调阶段' : '平稳震荡';
  cards.push({
    tag: '长周期',
    time: `${fmtMD(records[0].date)} - ${fmtMD(records[n - 1].date)}`,
    title: `整体${direction}`,
    desc: `将时间段分为前后两程：前 ${first.length} 次查询${dimLabel}均分 ${firstAvg}，后 ${second.length} 次均分 ${secondAvg}，${Math.abs(delta) <= 5 ? '基本持平' : delta > 0 ? `提升 ${delta} 分` : `回落 ${Math.abs(delta)} 分`}。整体均分 ${avg(records.map((r) => r.dims[dim]))} 分，当前处于${direction}。`,
  });

  return cards;
}

/* ============ AI 解读（基于真实记录生成） ============ */

const DIM_ADVICE: Record<DimensionKey, { strong: string; weak: string }> = {
  overall: {
    strong: '整体状态在线，适合推进搁置已久的重要事项，把握窗口期主动出击。',
    weak: '整体能量偏弱，重大决策建议缓一缓，先处理小步快跑的事务，积累正向反馈。',
  },
  career: {
    strong: '事业动能充足，适合争取晋升、谈薪、提案，主动展示成果。',
    weak: '事业节奏宜稳，先巩固现有盘，多观察少表态，避免正面冲突。',
  },
  love: {
    strong: '感情窗口期，主动安排见面与深度沟通，单身者适合扩大社交圈。',
    weak: '感情宜慢不宜急，先照顾好自己，减少情绪化沟通，给彼此留空间。',
  },
  wealth: {
    strong: '财运较旺，可布局中长期理财，避免高杠杆与短线投机。',
    weak: '财运偏保守，先控制开支、清理负债，大额支出建议暂缓。',
  },
  health: {
    strong: '精力充沛，适合启动运动计划，保持规律作息。',
    weak: '健康需留意，减少熬夜与高压加班，安排一次体检更稳妥。',
  },
};

export function trendInsight(
  records: ScoredRecord[],
  dim: DimensionKey,
): { reasons: InsightItem[]; actions: InsightItem[] } {
  const reasons: InsightItem[] = [];
  const actions: InsightItem[] = [];
  if (records.length === 0) return { reasons, actions };

  const dimLabel = DIM_LABELS[dim];
  let best = records[0];
  let worst = records[0];
  for (const r of records) {
    if (r.dims[dim] > best.dims[dim]) best = r;
    if (r.dims[dim] < worst.dims[dim]) worst = r;
  }

  reasons.push({
    bold: `${best.systemName}带来高点`,
    text: `${fmtMD(best.date)}的${best.systemName}查询给出 ${best.dims[dim]} 分，为该时段${dimLabel}最高点。${clip(best.summary || best.aiText, 70)}`,
  });
  if (worst.id !== best.id) {
    reasons.push({
      bold: `${worst.systemName}提示低点`,
      text: `${fmtMD(worst.date)}的${worst.systemName}查询仅 ${worst.dims[dim]} 分，与高点相差 ${best.dims[dim] - worst.dims[dim]} 分，说明${dimLabel}存在明显波动。`,
    });
  }
  const sysCount = new Map<string, number>();
  for (const r of records) sysCount.set(r.system, (sysCount.get(r.system) ?? 0) + 1);
  const topSys = Array.from(sysCount.entries()).sort((a, b) => b[1] - a[1])[0];
  const topSysName = SYSTEM_NAMES[topSys[0]] || topSys[0];
  const topSysRecs = records.filter((r) => r.system === topSys[0]);
  reasons.push({
    bold: `${topSysName}是主参照系`,
    text: `你查询最多的体系是${topSysName}（${topSys[1]} 次），其${dimLabel}均分为 ${avg(topSysRecs.map((r) => r.dims[dim]))} 分，可作为判断${dimLabel}的主参照。`,
  });

  const dimAvgs = DIM_KEYS.map((k) => ({ k, v: avg(records.map((r) => r.dims[k])) }));
  const weakest = [...dimAvgs].sort((a, b) => a.v - b.v)[0];
  const strongest = [...dimAvgs].sort((a, b) => b.v - a.v)[0];
  actions.push({
    bold: `补强${DIM_LABELS[weakest.k]}`,
    text: `${DIM_LABELS[weakest.k]}均分 ${weakest.v} 为当前短板。${DIM_ADVICE[weakest.k].weak}`,
  });
  actions.push({
    bold: `放大${DIM_LABELS[strongest.k]}`,
    text: `${DIM_LABELS[strongest.k]}均分 ${strongest.v} 为当前长板。${DIM_ADVICE[strongest.k].strong}`,
  });
  const latest = records[records.length - 1];
  const latestText = latest.aiText || latest.summary;
  if (latestText) {
    actions.push({
      bold: `最近一次 AI 解读（${fmtMD(latest.date)}）`,
      text: clip(latestText, 80),
    });
  } else {
    actions.push({
      bold: '持续记录',
      text: `最近一次查询（${fmtMD(latest.date)}，${latest.systemName}）暂无文字解读，多做几次查询后趋势会更准确。`,
    });
  }

  return { reasons, actions };
}

/* ============ 综合报告（基于真实记录生成） ============ */

const SCORE_BANDS: { min: number; text: string }[] = [
  { min: 85, text: '运势亨通，宜主动进取' },
  { min: 70, text: '稳中向好，把握窗口期' },
  { min: 55, text: '平中有波，稳扎稳打' },
  { min: 0, text: '韬光养晦，蓄势待发' },
];

function scoreBand(v: number): string {
  return SCORE_BANDS.find((b) => v >= b.min)?.text || '';
}

/** 自定义主题的关联体系与关注维度 */
const TOPIC_MAP: Record<string, { dim: DimensionKey; systems: string[] }> = {
  '健康养生': { dim: 'health', systems: ['bazi', 'palm', 'zodiac', 'moonphase'] },
  '学业考试': { dim: 'career', systems: ['numerology', 'liuyao', 'tarot', 'meihua'] },
  '出行旅行': { dim: 'overall', systems: ['almanac', 'drawlot', 'zodiac', 'astrodice'] },
  '搬迁择日': { dim: 'overall', systems: ['fengshui', 'almanac', 'qimen', 'drawlot'] },
  '创业决策': { dim: 'wealth', systems: ['qimen', 'nametest', 'bazi', 'tieban'] },
  '婚姻大事': { dim: 'love', systems: ['meihua', 'liuyao', 'tarot', 'ziwei'] },
};

export function buildRealReportContent(
  allRecords: ScoredRecord[],
  type: 'career' | 'love' | 'wealth' | 'yearly' | 'custom',
  customTopic?: string,
): RealReportContent {
  let focus: DimensionKey;
  let related: string[] | null = null;
  let topicName = '';
  if (type === 'custom' && customTopic && TOPIC_MAP[customTopic]) {
    focus = TOPIC_MAP[customTopic].dim;
    related = TOPIC_MAP[customTopic].systems;
    topicName = customTopic;
  } else {
    focus = type === 'yearly' ? 'overall' : (type as DimensionKey);
  }

  const records = related ? allRecords.filter((r) => related.includes(r.system)) : allRecords;
  const pool = records.length > 0 ? records : allRecords;
  const dimLabel = DIM_LABELS[focus];
  const focusName = topicName || (type === 'yearly' ? '年度综合' : dimLabel);
  const score = avg(pool.map((r) => r.dims[focus]));

  // 维度均分
  const dimAvgs = DIM_KEYS.map((k) => ({ k, label: DIM_LABELS[k], value: avg(pool.map((r) => r.dims[k])) }));

  // 体系分组
  const sysMap = new Map<string, ScoredRecord[]>();
  for (const r of pool) {
    const arr = sysMap.get(r.system) ?? [];
    arr.push(r);
    sysMap.set(r.system, arr);
  }
  const sysList = Array.from(sysMap.entries()).sort((a, b) => b[1].length - a[1].length);
  const topSystems = sysList.slice(0, 3);

  const systems = topSystems.map(([sysKey, recs]) => {
    const latest = recs[recs.length - 1];
    return {
      score: avg(recs.map((r) => r.dims[focus])),
      name: SYSTEM_NAMES[sysKey] || sysKey,
      subtitle: `基于 ${recs.length} 次真实查询`,
      content: clip(latest.aiText || latest.summary, 110) || `共 ${recs.length} 次查询，最近一次在 ${fmtMD(latest.date)}。`,
      tags: latest.tags.length > 0 ? latest.tags : [`${recs.length} 次查询`, `均分 ${avg(recs.map((r) => r.dims[focus]))}`],
    };
  });

  // 共识
  const sortedDims = [...dimAvgs].sort((a, b) => b.value - a.value);
  const weakestDim = sortedDims[sortedDims.length - 1];
  const consensus = [
    {
      title: `多体系共振：${sortedDims[0].label}为相对强项`,
      desc: `跨 ${sysMap.size} 个体系统计，${sortedDims[0].label}均分 ${sortedDims[0].value} 分，${sortedDims[1] && sortedDims[1].value >= 70 ? `与${sortedDims[1].label}（${sortedDims[1].value} 分）相互印证。` : '是你的稳定优势区。'}`,
    },
    {
      title: `查询习惯：${pool.length} 次真实记录`,
      desc: `统计区间 ${fmtMD(pool[0].date)} 至 ${fmtMD(pool[pool.length - 1].date)}，最常用体系为${sysList[0][1][0].systemName}（${sysList[0][1].length} 次），${focusName}均分 ${score} 分。`,
    },
  ];

  // 分歧
  const divergences: { title: string; desc: string }[] = [];
  if (sysMap.size >= 2) {
    const perSys = sysList.map(([, recs]) => ({ name: recs[0].systemName, v: avg(recs.map((r) => r.dims[focus])) }));
    const hi = [...perSys].sort((a, b) => b.v - a.v)[0];
    const lo = [...perSys].sort((a, b) => a.v - b.v)[0];
    if (hi.name !== lo.name && hi.v - lo.v >= 5) {
      divergences.push({
        title: `体系视角差异：${hi.name} vs ${lo.name}`,
        desc: `${dimLabel}评估上，${hi.name}给出 ${hi.v} 分，${lo.name}给出 ${lo.v} 分，相差 ${hi.v - lo.v} 分。不同体系的起卦口径不同，建议以 ${hi.name} 作为${dimLabel}的主参照。`,
      });
    }
  }
  const spreadDim = DIM_KEYS
    .map((k) => {
      const vals = pool.map((r) => r.dims[k]);
      const m = vals.reduce((s, v) => s + v, 0) / vals.length;
      const sd = Math.sqrt(vals.reduce((s, v) => s + (v - m) ** 2, 0) / vals.length);
      return { label: DIM_LABELS[k], sd };
    })
    .sort((a, b) => b.sd - a.sd)[0];
  divergences.push({
    title: `${spreadDim.label}波动最大`,
    desc: `在 ${pool.length} 次查询中，${spreadDim.label}的分值离散度最高（标准差 ${spreadDim.sd.toFixed(1)}），是波动的主要来源，建议重点跟踪。`,
  });

  // 时间线（最近 6 条真实记录）
  const timeline = [...pool].reverse().slice(0, 6).map((r) => ({
    date: fmtMD(r.date),
    tagLabel: r.systemName,
    title: clip(r.summary, 24) || `${r.systemName}查询`,
    desc: clip(r.aiText || r.summary, 60),
  }));

  // 建议
  const advice = [
    `${dimLabel}均分 ${score}（${scoreBand(score)}）。${DIM_ADVICE[focus][score >= 70 ? 'strong' : 'weak']}`,
    `短板维度${weakestDim.label}（${weakestDim.value} 分）：${DIM_ADVICE[weakestDim.k].weak}`,
    `你常用${sysList[0][1][0].systemName}（${sysList[0][1].length} 次），建议每月固定复盘一次该体系的核心结论，形成个人参照基线。`,
  ];
  const latest = pool[pool.length - 1];
  if (latest.aiText) {
    advice.push(`最近一次 AI 解读摘录（${fmtMD(latest.date)}）：${clip(latest.aiText, 60)}`);
  }

  return {
    score,
    headline: `${focusName} · ${scoreBand(score)}`,
    summary: `基于你的 ${pool.length} 条真实查询记录（${fmtMD(pool[0].date)} - ${fmtMD(pool[pool.length - 1].date)}），覆盖 ${sysMap.size} 个占卜体系，${focusName}评分 ${score} 分。${related && records.length === 0 ? `主题相关体系暂无记录，已扩展至全部查询记录分析。` : ''}`,
    dimensions: dimAvgs,
    systems,
    consensus,
    divergences,
    timeline,
    advice,
  };
}

/* ============ 个性化建议（基于真实记录生成） ============ */

export interface RealAdviceAdvice {
  title: string;
  desc: string;
  evidence: string;
}

export interface RealAdviceDay {
  dateTag: string;
  highlight: boolean;
  latest: boolean;
  advices: RealAdviceAdvice[];
}

export interface RealAdvicePriority {
  tags: string[];
  title: string;
  desc: string;
  deadline: string;
}

export interface RealAdvicePlan {
  title: string;
  periodLabel: string;
  desc: string;
  match: number;
  dateRange: string;
}

export interface RealAdviceWarning {
  title: string;
  desc: string;
  riskPeriod: string;
}

export interface RealAdviceContent {
  profile: { subtitle: string; tags: string[] };
  timelineSubtitle: string;
  timeline: RealAdviceDay[];
  priorities: RealAdvicePriority[];
  plans: RealAdvicePlan[];
  warnings: RealAdviceWarning[];
}

/** 基于真实查询记录生成个性化建议页各区块内容（与综合报告共用同一取数口径） */
export function buildRealAdviceContent(allRecords: ScoredRecord[]): RealAdviceContent {
  const pool = allRecords;
  const dimAvgs = DIM_KEYS.map((k) => ({ k, label: DIM_LABELS[k], v: avg(pool.map((r) => r.dims[k])) }));
  const strongest = [...dimAvgs].sort((a, b) => b.v - a.v)[0];
  const weakest = [...dimAvgs].sort((a, b) => a.v - b.v)[0];
  const rangeText = `${fmtMD(pool[0].date)} — ${fmtMD(pool[pool.length - 1].date)}`;

  // 体系使用统计
  const sysMap = new Map<string, ScoredRecord[]>();
  for (const r of pool) {
    const a = sysMap.get(r.system) ?? [];
    a.push(r);
    sysMap.set(r.system, a);
  }
  const sysList = Array.from(sysMap.entries()).sort((a, b) => b[1].length - a[1].length);
  const topSysName = SYSTEM_NAMES[sysList[0][0]] || sysList[0][0];
  const topSysRecs = sysList[0][1];
  const topSysAvg = avg(topSysRecs.map((r) => r.dims.overall));
  const topSysLatest = topSysRecs[topSysRecs.length - 1];

  // 档案卡片：真实查询统计
  const profile = {
    subtitle: `已基于 ${pool.length} 条真实查询记录生成 · 覆盖 ${sysMap.size} 个体系`,
    tags: [
      ...sysList.slice(0, 3).map(([key, recs]) => `${SYSTEM_NAMES[key] || key} ${recs.length} 次`),
      `区间 ${rangeText}`,
    ],
  };

  // 时间线：最近有记录的 7 天（新→旧）
  const dayMap = new Map<string, ScoredRecord[]>();
  for (const r of pool) {
    const k = `${r.date.getFullYear()}-${r.date.getMonth()}-${r.date.getDate()}`;
    const a = dayMap.get(k) ?? [];
    a.push(r);
    dayMap.set(k, a);
  }
  const dayKeys = Array.from(dayMap.keys()).sort((a, b) => b.localeCompare(a)).slice(0, 7);
  const timeline: RealAdviceDay[] = dayKeys.map((k, i) => {
    const recs = dayMap.get(k)!;
    const d = recs[0].date;
    const dayAvg = avg(recs.map((r) => r.dims.overall));
    const suffix = i === 0 ? '最近' : dayAvg >= 75 ? '高能日' : WEEKDAYS[d.getDay()];
    return {
      dateTag: `${d.getMonth() + 1}月${d.getDate()}日 · ${suffix}`,
      highlight: dayAvg >= 75,
      latest: i === 0,
      advices: recs.slice(0, 3).map((r) => ({
        title: `${r.systemName} · ${clip(r.summary, 16) || '查询解读'}`,
        desc: clip(r.aiText || r.summary, 80) || `本次${r.systemName}查询整体评分 ${r.score} 分。`,
        evidence: [
          `${r.systemName}真实查询（${fmtMD(r.date)}）· 整体 ${r.score} 分 · ${DIM_LABELS.overall} ${r.dims.overall} 分`,
          r.tags.length > 0 ? `依据：${r.tags.join(' · ')}` : null,
        ].filter(Boolean).join('；'),
      })),
    };
  });

  // 重点事项：放大强项 / 补强弱项 / 主参照体系
  const priorities: RealAdvicePriority[] = [
    {
      tags: ['优势', strongest.label],
      title: `放大${strongest.label}的优势`,
      desc: `${strongest.label}均分 ${strongest.v} 分，是你当前最稳的优势区。${DIM_ADVICE[strongest.k].strong}`,
      deadline: `当前均分 ${strongest.v} 分 · ${rangeText}`,
    },
    {
      tags: ['关注', weakest.label],
      title: `补强${weakest.label}的短板`,
      desc: `${weakest.label}均分 ${weakest.v} 分，是提升空间最大的维度。${DIM_ADVICE[weakest.k].weak}`,
      deadline: `当前均分 ${weakest.v} 分 · 建议重点跟踪`,
    },
    {
      tags: ['常用', topSysName],
      title: `以${topSysName}为主参照`,
      desc: `${topSysName}是你查询最多的体系（${topSysRecs.length} 次），整体均分 ${topSysAvg} 分。建议每月固定复盘一次该体系的核心结论，形成个人参照基线。`,
      deadline: `最近一次 ${fmtMD(topSysLatest.date)}`,
    },
  ];

  // 月度规划：四维度按真实均分给出节奏
  const plans: RealAdvicePlan[] = (['career', 'love', 'wealth', 'health'] as DimensionKey[]).map((k) => {
    const d = dimAvgs.find((x) => x.k === k)!;
    const periodLabel = d.v >= 80 ? '优势区 · 可进取' : d.v >= 65 ? '平稳区 · 稳步推' : d.v >= 50 ? '波动区 · 慎行动' : '调整区 · 先蓄势';
    return {
      title: `${d.label}规划`,
      periodLabel,
      desc: d.v >= 65 ? DIM_ADVICE[k].strong : DIM_ADVICE[k].weak,
      match: d.v,
      dateRange: `基于 ${rangeText} 的 ${pool.length} 条记录`,
    };
  });

  // 避坑提醒：波动最大维度 / 体系视角差异 / 整体风险或记录量提示
  const spreadDim = DIM_KEYS.map((k) => {
    const vals = pool.map((r) => r.dims[k]);
    const m = vals.reduce((s, v) => s + v, 0) / vals.length;
    const sd = Math.sqrt(vals.reduce((s, v) => s + (v - m) ** 2, 0) / vals.length);
    return { k, label: DIM_LABELS[k], sd };
  }).sort((a, b) => b.sd - a.sd)[0];

  const warnings: RealAdviceWarning[] = [
    {
      title: `留意${spreadDim.label}的波动`,
      desc: `${pool.length} 次查询中${spreadDim.label}的分值离散度最高（标准差 ${spreadDim.sd.toFixed(1)}），是近期波动的主要来源，建议重点跟踪并在低分时段避免重大决策。`,
      riskPeriod: `统计区间 ${rangeText}`,
    },
  ];
  if (sysList.length >= 2) {
    const perSys = sysList.map(([, recs]) => ({ name: recs[0].systemName, v: avg(recs.map((r) => r.dims.overall)) }));
    const hi = [...perSys].sort((a, b) => b.v - a.v)[0];
    const lo = [...perSys].sort((a, b) => a.v - b.v)[0];
    if (hi.name !== lo.name && hi.v - lo.v >= 5) {
      warnings.push({
        title: `体系视角差异：${hi.name} vs ${lo.name}`,
        desc: `整体评估上${hi.name}给出 ${hi.v} 分，${lo.name}给出 ${lo.v} 分，相差 ${hi.v - lo.v} 分。不同体系起卦口径不同，建议以${hi.name}为主参照、其余作交叉印证。`,
        riskPeriod: `基于 ${pool.length} 条真实记录`,
      });
    }
  }
  const overallAvg = dimAvgs.find((x) => x.k === 'overall')!.v;
  warnings.push(
    overallAvg < 55
      ? {
          title: '近期整体运势偏弱',
          desc: `整体均分 ${overallAvg} 分处于蓄势区间，重大决策建议缓一缓，先处理小步快跑的事务，积累正向反馈后再推进大事。`,
          riskPeriod: `整体均分 ${overallAvg} 分`,
        }
      : {
          title: '保持记录让建议更精准',
          desc: `当前已有 ${pool.length} 条真实查询记录，覆盖 ${sysMap.size} 个体系。多体系交叉验证能显著提升建议的可靠性，建议持续使用不同体系做对照查询。`,
          riskPeriod: `当前 ${pool.length} 条记录`,
        },
  );

  return {
    profile,
    timelineSubtitle: `按你最近的真实查询整理（${rangeText}）`,
    timeline,
    priorities,
    plans,
    warnings,
  };
}
