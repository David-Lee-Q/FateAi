import { useEffect, useMemo, useState } from 'react';
import {
  TrendingUp,
  Briefcase,
  Heart,
  DollarSign,
  Activity,
  Calendar,
  Repeat,
  Sparkles,
  BarChart3,
  Lightbulb,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/context/useAuth';
import { getHistory } from '@/services/api';
import type { FortuneResult } from '@/types';
import {
  scoreRecords,
  filterRange,
  buildSeries,
  findKeyPoints,
  cycleAnalysis,
  trendInsight,
  fmtMD,
  type DimensionKey,
  type RangeKey,
  type SeriesPoint,
  type ScoredRecord,
} from '@/services/insights';
import { DemoBanner, EmptyInsights } from '@/components/InsightsShared';

/* ========================================
   数据定义
   ======================================== */

/** 运势维度选项 */
const DIMENSIONS = [
  { label: '综合运势', value: 'overall', icon: TrendingUp },
  { label: '事业运', value: 'career', icon: Briefcase },
  { label: '感情运', value: 'love', icon: Heart },
  { label: '财运', value: 'wealth', icon: DollarSign },
  { label: '健康运', value: 'health', icon: Activity },
] as const;

/** 时间范围选项 */
const TIME_RANGES = [
  { label: '近7天', value: '7d' },
  { label: '近30天', value: '30d' },
  { label: '近12个月', value: '12m' },
  { label: '近5年', value: '5y' },
] as const;

/* ========================================
   演示数据（仅未登录态展示）
   ======================================== */

const DEMO_CYCLE_CARDS = [
  {
    tag: '短周期',
    time: '7-14 天',
    title: '情绪波动周期',
    desc: '你的综合运势呈现约 7 天的短周期波动。每逢农历初一前后运势偏低，新月过后逐步回升，满月前后达到阶段峰值。当前正处于上升周期中段，预计 7 月 12 日前后达到短周期高点。',
    tagBg: 'rgba(0, 75, 170, 0.15)',
    tagColor: 'var(--color-primary-lighter)',
  },
  {
    tag: '中周期',
    time: '28-35 天',
    title: '事业机遇周期',
    desc: '事业运存在约一个月的规律性循环。上一次事业运高峰出现在 6 月 22 日前后，对应职场中一个重要进展节点。下一个事业运窗口期预计在 7 月 20 日前后开启，届时适合推进新项目或提出关键方案。',
    tagBg: 'rgba(200, 168, 78, 0.12)',
    tagColor: 'var(--color-gold)',
  },
  {
    tag: '长周期',
    time: '约 6 个月',
    title: '整体运势大周期',
    desc: '从长周期维度观察，你自 2026 年初进入一个整体运势上升通道。当前处于上升期的中后段，预计 8 月中旬至 9 月初将迎来本轮大周期的高峰阶段。建议把握接下来的黄金窗口期，在事业和感情方面主动出击。',
    tagBg: 'rgba(26, 138, 92, 0.12)',
    tagColor: 'var(--state-success)',
  },
];

const DEMO_REASON_ITEMS = [
  {
    num: '1',
    bg: 'rgba(0, 75, 170, 0.2)',
    color: 'var(--color-primary-lighter)',
    bold: '火星进入狮子座',
    text: '6 月下旬火象能量增强，推动事业运在 6 月 22 日前后达到小高峰，你在此期间展现出的领导力获得认可。',
  },
  {
    num: '2',
    bg: 'rgba(200, 168, 78, 0.15)',
    color: 'var(--color-gold)',
    bold: '水星逆行影响',
    text: '6 月底水逆期间沟通效率下降，导致综合运势短暂回落至 50 分附近。7 月初水逆结束后运势快速反弹。',
  },
  {
    num: '3',
    bg: 'rgba(26, 138, 92, 0.15)',
    color: 'var(--state-success)',
    bold: '木星三分相',
    text: '7 月上旬木星与你的本命太阳形成三分相，带来扩展与幸运的能量，推动当前运势回升至 70 分以上。',
  },
];

const DEMO_ACTION_ITEMS = [
  {
    num: 'A',
    bg: 'rgba(0, 75, 170, 0.2)',
    color: 'var(--color-primary-lighter)',
    bold: '把握本周黄金窗口',
    text: '7 月 10-14 日运势持续走高，适合推进重要谈判、签约、面试等关键事务。建议将核心任务安排在此时间段。',
  },
  {
    num: 'B',
    bg: 'rgba(200, 168, 78, 0.15)',
    color: 'var(--color-gold)',
    bold: '感情主动出击',
    text: '感情运随木星三分相同步上升，单身者适合参加社交活动；有伴侣者适合安排深度对话或共同体验活动。',
  },
  {
    num: 'C',
    bg: 'rgba(26, 138, 92, 0.15)',
    color: 'var(--state-success)',
    bold: '关注 7 月中旬转折',
    text: '预测显示 7 月 14 日后运势将有所回落，提前做好规划，避免将所有重要事项堆叠在高峰之后。',
  },
];

/** 解读条目序号配色（按索引循环） */
const ITEM_BGS = [
  { bg: 'rgba(0, 75, 170, 0.2)', color: 'var(--color-primary-lighter)' },
  { bg: 'rgba(200, 168, 78, 0.15)', color: 'var(--color-gold)' },
  { bg: 'rgba(26, 138, 92, 0.15)', color: 'var(--state-success)' },
];

/** 解读条目 */
function AiReasonItem({ num, bg, color, bold, text }: { num: string; bg: string; color: string; bold: string; text: string }) {
  return (
    <div className="flex gap-3">
      <span
        className="flex-shrink-0 flex items-center justify-center rounded-md font-semibold"
        style={{
          width: 24,
          height: 24,
          fontSize: 'var(--text-xs, 0.75rem)',
          background: bg,
          color,
        }}
      >
        {num}
      </span>
      <p
        className="line-clamp-3"
        style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm, 0.875rem)', lineHeight: 'var(--leading-relaxed, 1.75)' }}
      >
        <strong style={{ color: 'var(--color-text)' }}>{bold}</strong>
        ：{text}
      </p>
    </div>
  );
}

/* ========================================
   动态趋势图（真实数据）
   ======================================== */

interface ChartNode {
  x: number;
  y: number;
  dateLabel: string;
  value: number;
  tagLabel: string;
  color: string;
  isCurrent: boolean;
}

function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length === 0) return '';
  if (pts.length === 1) return `M${pts[0].x},${pts[0].y}`;
  let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d;
}

function pickLabelIndexes(n: number, maxLabels = 8): number[] {
  if (n <= maxLabels) return Array.from({ length: n }, (_, i) => i);
  const idxs = new Set<number>();
  for (let i = 0; i < maxLabels; i++) {
    idxs.add(Math.round((i * (n - 1)) / (maxLabels - 1)));
  }
  return Array.from(idxs).sort((a, b) => a - b);
}

function TrendChart({ series }: { series: SeriesPoint[] }) {
  const W = 1100;
  const X0 = 80;
  const X1 = 1060;
  const Y0 = 40;
  const Y1 = 328;
  const n = series.length;
  const xOf = (i: number) => (n <= 1 ? (X0 + X1) / 2 : X0 + (i / (n - 1)) * (X1 - X0));
  const yOf = (v: number) => Y1 - (v / 100) * (Y1 - Y0);

  const pts = series.map((p, i) => ({ x: xOf(i), y: yOf(p.value) }));
  const linePath = smoothPath(pts);
  const areaPath = n > 0 ? `${linePath} L${pts[n - 1].x.toFixed(1)},${Y1} L${pts[0].x.toFixed(1)},${Y1} Z` : '';

  const kp = findKeyPoints(series);
  const nodes: ChartNode[] = [];
  if (n > 0) {
    series.forEach((p, i) => {
      const base = { x: xOf(i), y: yOf(p.value), dateLabel: fmtMD(p.date), value: p.value };
      if (p === kp.current) nodes.push({ ...base, tagLabel: '当前值', color: 'var(--color-gold)', isCurrent: true });
      else if (p === kp.peak) nodes.push({ ...base, tagLabel: '高峰期', color: 'var(--state-success)', isCurrent: false });
      else if (p === kp.trough) nodes.push({ ...base, tagLabel: '低谷期', color: 'var(--state-error)', isCurrent: false });
      else if (p === kp.turning) nodes.push({ ...base, tagLabel: '转折点', color: 'var(--color-gold)', isCurrent: false });
    });
  }
  // 每个点都加普通节点（无 tooltip 强调色），保证单点数据可见
  if (n === 1 && nodes.length === 0) {
    const p = series[0];
    nodes.push({ x: xOf(0), y: yOf(p.value), dateLabel: fmtMD(p.date), value: p.value, tagLabel: '当前值', color: 'var(--color-gold)', isCurrent: true });
  }

  const labelIdx = pickLabelIndexes(n);
  const clampX = (x: number) => Math.max(X0 + 44, Math.min(X1 - 44, x));

  return (
    <svg
      viewBox={`0 0 ${W} 380`}
      xmlns="http://www.w3.org/2000/svg"
      className="w-full"
      style={{ height: 'auto', minHeight: 320 }}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="curveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#004baa" />
          <stop offset="50%" stopColor="#1a6fd4" />
          <stop offset="100%" stopColor="#c8a84e" />
        </linearGradient>
        <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(0,75,170,0.25)" />
          <stop offset="100%" stopColor="rgba(0,75,170,0)" />
        </linearGradient>
      </defs>

      {/* 网格线 */}
      <g stroke="rgba(255,255,255,0.04)" strokeWidth={1}>
        <line x1={X0} y1={Y0} x2={X1} y2={Y0} />
        <line x1={X0} y1={112} x2={X1} y2={112} />
        <line x1={X0} y1={184} x2={X1} y2={184} />
        <line x1={X0} y1={256} x2={X1} y2={256} />
        <line x1={X0} y1={Y1} x2={X1} y2={Y1} />
      </g>

      {/* Y轴标签 */}
      <g fill="var(--color-text-tertiary)" fontSize={11} fontFamily="var(--font-body)" textAnchor="end">
        <text x={X0 - 8} y={Y0 + 4}>100</text>
        <text x={X0 - 8} y={116}>75</text>
        <text x={X0 - 8} y={188}>50</text>
        <text x={X0 - 8} y={260}>25</text>
        <text x={X0 - 8} y={Y1 + 4}>0</text>
      </g>

      {/* X轴标签 */}
      <g fill="var(--color-text-tertiary)" fontSize={11} fontFamily="var(--font-body)" textAnchor="middle">
        {labelIdx.map((i) => (
          <text key={i} x={xOf(i)} y={356}>{fmtMD(series[i].date)}</text>
        ))}
      </g>

      {/* 数据区域填充 */}
      {n > 0 && <path d={areaPath} fill="url(#areaGrad)" />}
      {n > 1 && (
        <path d={linePath} fill="none" stroke="url(#curveGrad)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      )}

      {/* 关键节点 */}
      {nodes.map((node, idx) => {
        const above = node.y > 110;
        const tx = clampX(node.x);
        const ty = above ? node.y - 64 : node.y + 12;
        return (
          <g key={idx} className="trend-chart-node">
            <circle
              cx={node.x}
              cy={node.y}
              r={node.isCurrent ? 5.5 : 4.5}
              fill={node.color}
              stroke={node.isCurrent ? '#fff' : 'none'}
              strokeWidth={node.isCurrent ? 1.5 : 0}
              className="node-dot"
            />
            <g className="tooltip-box">
              <rect x={tx - 44} y={ty} width={88} height={48} rx={8} fill="rgba(10,14,26,0.92)" stroke="rgba(200,168,78,0.2)" strokeWidth={1} />
              <text x={tx} y={ty + 19} fill="var(--color-text-secondary)" fontSize={10} fontFamily="var(--font-body)" textAnchor="middle">{node.dateLabel}</text>
              <text x={tx} y={ty + 37} fill={node.color} fontSize={13} fontWeight={600} fontFamily="var(--font-body)" textAnchor="middle">{node.value} 分</text>
              <text x={tx} y={ty + 46} fill="var(--color-text-tertiary)" fontSize={9} fontFamily="var(--font-body)" textAnchor="middle">{node.tagLabel}</text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}

/* ========================================
   演示趋势图（静态 SVG，仅未登录态）
   ======================================== */
function DemoTrendChart() {
  return (
    <svg
      viewBox="0 0 1100 380"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full"
      style={{ height: 'auto', minHeight: 320 }}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="dCurveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#004baa" />
          <stop offset="50%" stopColor="#1a6fd4" />
          <stop offset="100%" stopColor="#c8a84e" />
        </linearGradient>
        <linearGradient id="dAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(0,75,170,0.25)" />
          <stop offset="100%" stopColor="rgba(0,75,170,0)" />
        </linearGradient>
        <linearGradient id="dPredictAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(200,168,78,0.1)" />
          <stop offset="100%" stopColor="rgba(200,168,78,0)" />
        </linearGradient>
      </defs>
      <g stroke="rgba(255,255,255,0.04)" strokeWidth={1}>
        <line x1="80" y1="40" x2="1060" y2="40" />
        <line x1="80" y1="112" x2="1060" y2="112" />
        <line x1="80" y1="184" x2="1060" y2="184" />
        <line x1="80" y1="256" x2="1060" y2="256" />
        <line x1="80" y1="328" x2="1060" y2="328" />
      </g>
      <g fill="var(--color-text-tertiary)" fontSize={11} fontFamily="var(--font-body)" textAnchor="end">
        <text x="72" y="44">100</text>
        <text x="72" y="116">75</text>
        <text x="72" y="188">50</text>
        <text x="72" y="260">25</text>
        <text x="72" y="332">0</text>
      </g>
      <g fill="var(--color-text-tertiary)" fontSize={11} fontFamily="var(--font-body)" textAnchor="middle">
        <text x="80" y="356">6/10</text>
        <text x="176" y="356">6/14</text>
        <text x="272" y="356">6/18</text>
        <text x="368" y="356">6/22</text>
        <text x="464" y="356">6/26</text>
        <text x="560" y="356">6/30</text>
        <text x="656" y="356">7/4</text>
        <text x="752" y="356">7/8</text>
        <text x="848" y="356">7/10</text>
        <text x="944" y="356">7/12</text>
        <text x="1040" y="356">7/14</text>
      </g>
      <line x1="848" y1="40" x2="848" y2="328" stroke="var(--color-gold)" strokeWidth={1} strokeDasharray="4,4" opacity={0.3} />
      <text x="855" y="56" fill="var(--color-gold)" fontSize={10} fontFamily="var(--font-body)" opacity={0.6}>预测</text>
      <path d="M80,218 C120,200 155,170 176,160 C210,148 240,175 272,190 C305,205 335,145 368,120 C400,96 430,108 464,130 C498,152 528,168 560,184 C592,200 622,155 656,135 C690,116 720,140 752,160 C785,180 815,148 848,128 L848,328 L80,328 Z" fill="url(#dAreaGrad)" />
      <path d="M848,128 C880,108 912,90 944,78 C976,66 1008,72 1040,84 L1040,328 L848,328 Z" fill="url(#dPredictAreaGrad)" />
      <path d="M80,218 C120,200 155,170 176,160 C210,148 240,175 272,190 C305,205 335,145 368,120 C400,96 430,108 464,130 C498,152 528,168 560,184 C592,200 622,155 656,135 C690,116 720,140 752,160 C785,180 815,148 848,128" fill="none" stroke="url(#dCurveGrad)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M848,128 C880,108 912,90 944,78 C976,66 1008,72 1040,84" fill="none" stroke="var(--color-gold)" strokeWidth={2} strokeLinecap="round" strokeDasharray="6,4" opacity={0.6} />
    </svg>
  );
}

/* ========================================
   趋势追踪页面组件
   ======================================== */
export default function TrendPage() {
  const { user, loading: authLoading } = useAuth();
  const [dimension, setDimension] = useState<DimensionKey>('overall');
  const [timeRange, setTimeRange] = useState<RangeKey>('30d');
  const [records, setRecords] = useState<ScoredRecord[] | null>(null);

  const isDemo = !authLoading && !user;
  const isLoading = Boolean(user) && records === null;

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

  const activeLabel = DIMENSIONS.find((d) => d.value === dimension)?.label ?? '综合运势';
  const rangeRecords = useMemo(
    () => (records ? filterRange(records, timeRange) : []),
    [records, timeRange],
  );
  const series = useMemo(
    () => buildSeries(rangeRecords, dimension, timeRange),
    [rangeRecords, dimension, timeRange],
  );
  const cycleCards = useMemo(
    () => cycleAnalysis(rangeRecords, dimension, timeRange),
    [rangeRecords, dimension, timeRange],
  );
  const insight = useMemo(() => trendInsight(rangeRecords, dimension), [rangeRecords, dimension]);

  const cycleTagStyle = (i: number) =>
    [
      { bg: 'rgba(0, 75, 170, 0.15)', color: 'var(--color-primary-lighter)' },
      { bg: 'rgba(200, 168, 78, 0.12)', color: 'var(--color-gold)' },
      { bg: 'rgba(26, 138, 92, 0.12)', color: 'var(--state-success)' },
    ][i % 3];

  return (
    <div>
      {/* ===== 内联样式 ===== */}
      <style>{`
        .trend-dim-tab {
          padding: 10px 22px;
          border-radius: var(--radius-lg);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: var(--color-text-secondary);
          font-size: var(--text-sm, 0.875rem);
          cursor: pointer;
          transition: all var(--transition-base, 250ms ease);
          white-space: nowrap;
          font-family: var(--font-body);
        }
        .trend-dim-tab:hover {
          background: rgba(200, 168, 78, 0.1);
          border-color: rgba(200, 168, 78, 0.25);
          color: var(--color-gold-light);
        }
        .trend-dim-tab.active {
          background: linear-gradient(135deg, rgba(0, 75, 170, 0.2), rgba(200, 168, 78, 0.15));
          border-color: var(--color-gold);
          color: var(--color-gold-light);
          font-weight: 600;
          box-shadow: 0 0 16px rgba(200, 168, 78, 0.12);
        }
        .trend-range-btn {
          padding: 8px 18px;
          border-radius: var(--radius-md);
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: var(--color-text-tertiary);
          font-size: var(--text-sm, 0.875rem);
          cursor: pointer;
          transition: all var(--transition-fast, 150ms ease);
          white-space: nowrap;
          font-family: var(--font-body);
        }
        .trend-range-btn:hover {
          border-color: rgba(0, 75, 170, 0.3);
          color: var(--color-primary-lighter);
        }
        .trend-range-btn.active {
          background: var(--color-primary-bg-strong);
          border-color: var(--color-primary-light);
          color: var(--color-primary-lighter);
          font-weight: 500;
        }
        .trend-chart-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: var(--radius-xl);
          padding: var(--space-8);
          position: relative;
          overflow: hidden;
        }
        .trend-chart-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--color-gold), transparent);
          opacity: 0.3;
        }
        .trend-chart-node { cursor: pointer; }
        .trend-chart-node .node-dot {
          transition: r var(--transition-fast, 150ms ease), opacity var(--transition-fast, 150ms ease);
        }
        .trend-chart-node:hover .node-dot { r: 7; }
        .trend-chart-node .tooltip-box {
          opacity: 0;
          transition: opacity var(--transition-fast, 150ms ease);
          pointer-events: none;
        }
        .trend-chart-node:hover .tooltip-box { opacity: 1; }
        .trend-legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: inline-block;
          flex-shrink: 0;
        }
        .trend-cycle-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: var(--radius-xl);
          padding: var(--space-8);
          transition: all var(--transition-base, 250ms ease);
        }
        .trend-cycle-card:hover {
          border-color: rgba(200, 168, 78, 0.2);
          box-shadow: 0 4px 20px rgba(0, 75, 170, 0.08);
        }
        .trend-ai-card {
          background: linear-gradient(135deg, rgba(0, 75, 170, 0.08), rgba(200, 168, 78, 0.04));
          border: 1px solid rgba(200, 168, 78, 0.15);
          border-radius: var(--radius-xl);
          padding: var(--space-10);
          position: relative;
          overflow: hidden;
        }
        .trend-ai-card::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 180px; height: 180px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(200, 168, 78, 0.08), transparent 70%);
          pointer-events: none;
        }
        .trend-no-scrollbar::-webkit-scrollbar { display: none; }
        .trend-no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* ==================== 1. Banner 标题区 ==================== */}
      <section
        style={{
          background: 'linear-gradient(180deg, #002060 0%, #0a0e1a 100%)',
          padding: 'var(--space-12) 0 var(--space-12)',
        }}
      >
        <div className="content-container">
          <div style={{ maxWidth: 640 }}>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 'clamp(28px, 3.5vw, 48px)',
                color: '#ffffff',
                lineHeight: 'var(--leading-tight, 1.2)',
                textWrap: 'balance',
                wordBreak: 'keep-all',
                overflowWrap: 'break-word',
                marginBottom: 'var(--space-4)',
              }}
            >
              趋势追踪
            </h1>
            <p className="section-subtitle" style={{ maxWidth: 560 }}>
              {isDemo ? '时间轴上的运势变化，发现命运的周期规律' : '基于你的真实查询记录，追踪运势变化与周期规律'}
            </p>
          </div>
        </div>
      </section>

      {/* ==================== 演示数据横幅（仅未登录态） ==================== */}
      {isDemo && (
        <section style={{ background: '#0a0e1a', padding: 'var(--space-6) 0 0' }}>
          <div className="content-container">
            <DemoBanner />
          </div>
        </section>
      )}

      {/* ==================== 2. 维度选择 + 时间范围 ==================== */}
      <section style={{ background: '#0a0e1a', padding: 'var(--space-8) 0 var(--space-6)' }}>
        <div
          className="content-container"
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}
        >
          <div className="flex items-center gap-3 flex-nowrap overflow-x-auto trend-no-scrollbar">
            {DIMENSIONS.map((dim) => {
              const DimIcon = dim.icon;
              return (
                <button
                  key={dim.value}
                  className={`trend-dim-tab ${dimension === dim.value ? 'active' : ''}`}
                  onClick={() => setDimension(dim.value)}
                >
                  <DimIcon size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                  {dim.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 flex-nowrap overflow-x-auto trend-no-scrollbar">
            <span
              style={{
                color: 'var(--color-text-tertiary)',
                fontSize: 'var(--text-sm, 0.875rem)',
                whiteSpace: 'nowrap',
                marginRight: 'var(--space-2)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Calendar size={14} />
              时间范围
            </span>
            {TIME_RANGES.map((range) => (
              <button
                key={range.value}
                className={`trend-range-btn ${timeRange === range.value ? 'active' : ''}`}
                onClick={() => setTimeRange(range.value as RangeKey)}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 3. 趋势图区 ==================== */}
      <section style={{ background: '#0a0e1a', padding: '0 0 var(--space-16)' }}>
        <div className="content-container">
          {isDemo ? (
            <div className="trend-chart-card">
              <div className="flex items-center justify-between flex-wrap gap-4" style={{ marginBottom: 'var(--space-6)' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-xl, 1.25rem)', color: 'var(--color-text)' }}>
                  {activeLabel}趋势
                </h3>
                <div className="flex items-center gap-5 flex-wrap">
                  <span className="flex items-center gap-2">
                    <span className="trend-legend-dot" style={{ background: 'var(--state-success)' }} />
                    <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm, 0.875rem)', whiteSpace: 'nowrap' }}>运势高峰</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="trend-legend-dot" style={{ background: 'var(--state-error)' }} />
                    <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm, 0.875rem)', whiteSpace: 'nowrap' }}>运势低谷</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="trend-legend-dot" style={{ background: 'var(--color-gold)' }} />
                    <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm, 0.875rem)', whiteSpace: 'nowrap' }}>转折节点</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="trend-legend-dot" style={{ background: 'transparent', border: '1.5px dashed var(--color-text-tertiary)' }} />
                    <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm, 0.875rem)', whiteSpace: 'nowrap' }}>预测区间</span>
                  </span>
                </div>
              </div>
              <div className="w-full" style={{ minHeight: 320 }}>
                <DemoTrendChart />
              </div>
            </div>
          ) : isLoading ? (
            <div className="trend-chart-card" style={{ minHeight: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <Loader2 size={22} className="animate-spin" style={{ color: 'var(--color-gold)' }} />
              <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm, 0.875rem)' }}>正在加载你的查询记录…</span>
            </div>
          ) : rangeRecords.length === 0 ? (
            <EmptyInsights text={`${TIME_RANGES.find((r) => r.value === timeRange)?.label}暂无查询记录`} />
          ) : (
            <div className="trend-chart-card">
              <div className="flex items-center justify-between flex-wrap gap-4" style={{ marginBottom: 'var(--space-6)' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-xl, 1.25rem)', color: 'var(--color-text)' }}>
                  {activeLabel}趋势
                  <span style={{ marginLeft: 10, fontSize: 'var(--text-sm, 0.875rem)', fontWeight: 400, color: 'var(--color-text-tertiary)' }}>
                    共 {rangeRecords.length} 次查询
                  </span>
                </h3>
                <div className="flex items-center gap-5 flex-wrap">
                  <span className="flex items-center gap-2">
                    <span className="trend-legend-dot" style={{ background: 'var(--state-success)' }} />
                    <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm, 0.875rem)', whiteSpace: 'nowrap' }}>运势高峰</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="trend-legend-dot" style={{ background: 'var(--state-error)' }} />
                    <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm, 0.875rem)', whiteSpace: 'nowrap' }}>运势低谷</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="trend-legend-dot" style={{ background: 'var(--color-gold)' }} />
                    <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm, 0.875rem)', whiteSpace: 'nowrap' }}>转折 / 当前</span>
                  </span>
                </div>
              </div>
              <div className="w-full" style={{ minHeight: 320 }}>
                <TrendChart series={series} />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ==================== 4. 周期分析区 ==================== */}
      {!isDemo && !isLoading && rangeRecords.length > 0 && (
        <section style={{ background: '#0d1220', padding: 'var(--space-16) 0' }}>
          <div className="content-container">
            <div className="flex items-center gap-3 mb-8">
              <div
                className="flex items-center justify-center"
                style={{ width: 40, height: 40, borderRadius: 'var(--radius-lg)', background: 'rgba(200, 168, 78, 0.12)' }}
              >
                <Repeat size={20} style={{ color: 'var(--color-gold)' }} />
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: 'clamp(var(--text-xl, 1.25rem), 2vw, var(--text-2xl, 1.5rem))',
                  color: 'var(--color-text-inverse)',
                  textWrap: 'balance',
                  wordBreak: 'keep-all',
                  overflowWrap: 'break-word',
                }}
              >
                周期分析
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cycleCards.map((item, i) => {
                const tagStyle = cycleTagStyle(i);
                return (
                  <div key={item.tag} className="trend-cycle-card">
                    <div className="flex items-center gap-2 mb-4">
                      <span
                        className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-md font-medium"
                        style={{ fontSize: 'var(--text-xs, 0.75rem)', background: tagStyle.bg, color: tagStyle.color }}
                      >
                        {item.tag}
                      </span>
                      <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm, 0.875rem)' }}>{item.time}</span>
                    </div>
                    <h4 className="font-semibold mb-2" style={{ color: 'var(--color-text)', fontSize: 'var(--text-base, 1rem)' }}>
                      {item.title}
                    </h4>
                    <p
                      className="line-clamp-4"
                      style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm, 0.875rem)', lineHeight: 'var(--leading-relaxed, 1.75)' }}
                    >
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
      {isDemo && (
        <section style={{ background: '#0d1220', padding: 'var(--space-16) 0' }}>
          <div className="content-container">
            <div className="flex items-center gap-3 mb-8">
              <div
                className="flex items-center justify-center"
                style={{ width: 40, height: 40, borderRadius: 'var(--radius-lg)', background: 'rgba(200, 168, 78, 0.12)' }}
              >
                <Repeat size={20} style={{ color: 'var(--color-gold)' }} />
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: 'clamp(var(--text-xl, 1.25rem), 2vw, var(--text-2xl, 1.5rem))',
                  color: 'var(--color-text-inverse)',
                  textWrap: 'balance',
                  wordBreak: 'keep-all',
                  overflowWrap: 'break-word',
                }}
              >
                周期分析
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {DEMO_CYCLE_CARDS.map((item) => (
                <div key={item.tag} className="trend-cycle-card">
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-md font-medium"
                      style={{ fontSize: 'var(--text-xs, 0.75rem)', background: item.tagBg, color: item.tagColor }}
                    >
                      {item.tag}
                    </span>
                    <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm, 0.875rem)' }}>{item.time}</span>
                  </div>
                  <h4 className="font-semibold mb-2" style={{ color: 'var(--color-text)', fontSize: 'var(--text-base, 1rem)' }}>
                    {item.title}
                  </h4>
                  <p
                    className="line-clamp-4"
                    style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm, 0.875rem)', lineHeight: 'var(--leading-relaxed, 1.75)' }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================== 5. AI 解读区（空态下隐藏） ==================== */}
      {(isDemo || rangeRecords.length > 0) && (
        <section
          style={{
            background: 'linear-gradient(180deg, #0d1220 0%, #0a0a2e 100%)',
            padding: 'var(--space-16) 0 var(--space-20)',
          }}
        >
          <div className="content-container">
            <div className="flex items-center gap-3 mb-8">
              <div
                className="flex items-center justify-center"
                style={{ width: 40, height: 40, borderRadius: 'var(--radius-lg)', background: 'rgba(200, 168, 78, 0.12)' }}
              >
                <Sparkles size={20} style={{ color: 'var(--color-gold)' }} />
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: 'clamp(var(--text-xl, 1.25rem), 2vw, var(--text-2xl, 1.5rem))',
                  color: 'var(--color-text-inverse)',
                  textWrap: 'balance',
                  wordBreak: 'keep-all',
                  overflowWrap: 'break-word',
                }}
              >
                AI 解读
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 趋势变化原因分析 */}
              <div className="trend-ai-card">
                <div className="flex items-center gap-2 mb-5">
                  <BarChart3 size={18} style={{ color: 'var(--color-primary-lighter)' }} />
                  <h4 className="font-semibold" style={{ color: 'var(--color-text)', fontSize: 'var(--text-base, 1rem)' }}>
                    趋势变化原因{!isDemo ? '（基于真实查询）' : ''}
                  </h4>
                </div>
                <div className="flex flex-col gap-4">
                  {isDemo
                    ? DEMO_REASON_ITEMS.map((item) => (
                        <AiReasonItem key={item.num} num={item.num} bg={item.bg} color={item.color} bold={item.bold} text={item.text} />
                      ))
                    : insight.reasons.map((item, i) => (
                        <AiReasonItem
                          key={i}
                          num={String(i + 1)}
                          bg={ITEM_BGS[i % 3].bg}
                          color={ITEM_BGS[i % 3].color}
                          bold={item.bold}
                          text={item.text}
                        />
                      ))}
                </div>
              </div>

              {/* 行动建议 */}
              <div className="trend-ai-card">
                <div className="flex items-center gap-2 mb-5">
                  <Lightbulb size={18} style={{ color: 'var(--color-gold)' }} />
                  <h4 className="font-semibold" style={{ color: 'var(--color-text)', fontSize: 'var(--text-base, 1rem)' }}>
                    行动建议{!isDemo ? '（基于真实查询）' : ''}
                  </h4>
                </div>
                <div className="flex flex-col gap-4">
                  {isDemo
                    ? DEMO_ACTION_ITEMS.map((item) => (
                        <AiReasonItem key={item.num} num={item.num} bg={item.bg} color={item.color} bold={item.bold} text={item.text} />
                      ))
                    : insight.actions.map((item, i) => (
                        <AiReasonItem
                          key={i}
                          num={String.fromCharCode(65 + i)}
                          bg={ITEM_BGS[i % 3].bg}
                          color={ITEM_BGS[i % 3].color}
                          bold={item.bold}
                          text={item.text}
                        />
                      ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
