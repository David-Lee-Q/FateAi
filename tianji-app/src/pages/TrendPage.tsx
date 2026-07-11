import { useState } from 'react';
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
} from 'lucide-react';

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

/** 周期分析卡片数据 */
const CYCLE_CARDS = [
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

/** AI 趋势变化原因数据 */
const REASON_ITEMS = [
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

/** AI 行动建议数据 */
const ACTION_ITEMS = [
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

/* ========================================
   趋势追踪页面组件
   ======================================== */
export default function TrendPage() {
  const [dimension, setDimension] = useState('overall');
  const [timeRange, setTimeRange] = useState('30d');

  /** 当前激活维度的标签（用于图表标题） */
  const activeLabel = DIMENSIONS.find((d) => d.value === dimension)?.label ?? '综合运势';

  return (
    <div>
      {/* ===== 内联样式（匹配设计稿自定义 CSS） ===== */}
      <style>{`
        /* 维度 Tab */
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

        /* 时间范围按钮 */
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

        /* 图表卡片 */
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

        /* 图表节点悬停 Tooltip（CSS 驱动，与设计稿一致） */
        .trend-chart-node { cursor: pointer; }
        .trend-chart-node .node-dot {
          transition: r var(--transition-fast, 150ms ease), opacity var(--transition-fast, 150ms ease);
        }
        .trend-chart-node:hover .node-dot {
          r: 7;
        }
        .trend-chart-node .tooltip-box {
          opacity: 0;
          transition: opacity var(--transition-fast, 150ms ease);
          pointer-events: none;
        }
        .trend-chart-node:hover .tooltip-box {
          opacity: 1;
        }

        /* 图例小圆点 */
        .trend-legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: inline-block;
          flex-shrink: 0;
        }

        /* 周期卡片 */
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

        /* AI 解读卡片 */
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

        /* 隐藏滚动条 */
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
            <p
              className="section-subtitle"
              style={{ maxWidth: 560 }}
            >
              时间轴上的运势变化，发现命运的周期规律
            </p>
          </div>
        </div>
      </section>

      {/* ==================== 2. 维度选择 + 时间范围 ==================== */}
      <section style={{ background: '#0a0e1a', padding: 'var(--space-8) 0 var(--space-6)' }}>
        <div
          className="content-container"
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}
        >
          {/* 维度 Tab */}
          <div
            className="flex items-center gap-3 flex-nowrap overflow-x-auto trend-no-scrollbar"
          >
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

          {/* 时间范围 */}
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
                onClick={() => setTimeRange(range.value)}
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
          <div className="trend-chart-card">
            {/* 图例 + 标题 */}
            <div
              className="flex items-center justify-between flex-wrap gap-4"
              style={{ marginBottom: 'var(--space-6)' }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: 'var(--text-xl, 1.25rem)',
                  color: 'var(--color-text)',
                }}
              >
                {activeLabel}趋势
              </h3>
              <div className="flex items-center gap-5 flex-wrap">
                {/* 运势高峰 */}
                <span className="flex items-center gap-2">
                  <span className="trend-legend-dot" style={{ background: 'var(--state-success)' }} />
                  <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm, 0.875rem)', whiteSpace: 'nowrap' }}>
                    运势高峰
                  </span>
                </span>
                {/* 运势低谷 */}
                <span className="flex items-center gap-2">
                  <span className="trend-legend-dot" style={{ background: 'var(--state-error)' }} />
                  <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm, 0.875rem)', whiteSpace: 'nowrap' }}>
                    运势低谷
                  </span>
                </span>
                {/* 转折节点 */}
                <span className="flex items-center gap-2">
                  <span className="trend-legend-dot" style={{ background: 'var(--color-gold)' }} />
                  <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm, 0.875rem)', whiteSpace: 'nowrap' }}>
                    转折节点
                  </span>
                </span>
                {/* 预测区间 */}
                <span className="flex items-center gap-2">
                  <span
                    className="trend-legend-dot"
                    style={{
                      background: 'transparent',
                      border: '1.5px dashed var(--color-text-tertiary)',
                    }}
                  />
                  <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm, 0.875rem)', whiteSpace: 'nowrap' }}>
                    预测区间
                  </span>
                </span>
              </div>
            </div>

            {/* SVG 趋势图（与设计稿完全一致） */}
            <div className="w-full" style={{ minHeight: 320 }}>
              <svg
                viewBox="0 0 1100 380"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full"
                style={{ height: 'auto', minHeight: 320 }}
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  {/* 蓝金色渐变用于曲线 */}
                  <linearGradient id="curveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#004baa" />
                    <stop offset="50%" stopColor="#1a6fd4" />
                    <stop offset="100%" stopColor="#c8a84e" />
                  </linearGradient>
                  {/* 曲线下方填充渐变 */}
                  <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(0,75,170,0.25)" />
                    <stop offset="100%" stopColor="rgba(0,75,170,0)" />
                  </linearGradient>
                  {/* 预测区填充 */}
                  <linearGradient id="predictAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(200,168,78,0.1)" />
                    <stop offset="100%" stopColor="rgba(200,168,78,0)" />
                  </linearGradient>
                </defs>

                {/* 网格线 */}
                <g stroke="rgba(255,255,255,0.04)" strokeWidth={1}>
                  <line x1="80" y1="40" x2="1060" y2="40" />
                  <line x1="80" y1="112" x2="1060" y2="112" />
                  <line x1="80" y1="184" x2="1060" y2="184" />
                  <line x1="80" y1="256" x2="1060" y2="256" />
                  <line x1="80" y1="328" x2="1060" y2="328" />
                </g>

                {/* Y轴标签 */}
                <g
                  fill="var(--color-text-tertiary)"
                  fontSize={11}
                  fontFamily="var(--font-body)"
                  textAnchor="end"
                >
                  <text x="72" y="44">100</text>
                  <text x="72" y="116">75</text>
                  <text x="72" y="188">50</text>
                  <text x="72" y="260">25</text>
                  <text x="72" y="332">0</text>
                </g>

                {/* X轴标签 */}
                <g
                  fill="var(--color-text-tertiary)"
                  fontSize={11}
                  fontFamily="var(--font-body)"
                  textAnchor="middle"
                >
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

                {/* 预测区分隔线 */}
                <line
                  x1="848" y1="40" x2="848" y2="328"
                  stroke="var(--color-gold)"
                  strokeWidth={1}
                  strokeDasharray="4,4"
                  opacity={0.3}
                />
                <text
                  x="855" y="56"
                  fill="var(--color-gold)"
                  fontSize={10}
                  fontFamily="var(--font-body)"
                  opacity={0.6}
                >
                  预测
                </text>

                {/* 曲线下方填充区域（实际数据） */}
                <path
                  d="M80,218 C120,200 155,170 176,160 C210,148 240,175 272,190 C305,205 335,145 368,120 C400,96 430,108 464,130 C498,152 528,168 560,184 C592,200 622,155 656,135 C690,116 720,140 752,160 C785,180 815,148 848,128 L848,328 L80,328 Z"
                  fill="url(#areaGrad)"
                />

                {/* 预测区填充 */}
                <path
                  d="M848,128 C880,108 912,90 944,78 C976,66 1008,72 1040,84 L1040,328 L848,328 Z"
                  fill="url(#predictAreaGrad)"
                />

                {/* 实际数据曲线 */}
                <path
                  d="M80,218 C120,200 155,170 176,160 C210,148 240,175 272,190 C305,205 335,145 368,120 C400,96 430,108 464,130 C498,152 528,168 560,184 C592,200 622,155 656,135 C690,116 720,140 752,160 C785,180 815,148 848,128"
                  fill="none"
                  stroke="url(#curveGrad)"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* 预测虚线曲线 */}
                <path
                  d="M848,128 C880,108 912,90 944,78 C976,66 1008,72 1040,84"
                  fill="none"
                  stroke="var(--color-gold)"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeDasharray="6,4"
                  opacity={0.6}
                />

                {/* ===== 关键数据节点（可悬停查看详情） ===== */}

                {/* 节点1: 低谷 6/18 分数45 */}
                <g className="trend-chart-node">
                  <circle cx="272" cy="190" r="4.5" fill="var(--state-error)" className="node-dot" />
                  <g className="tooltip-box">
                    <rect x="228" y="196" width="88" height="48" rx={8} fill="rgba(10,14,26,0.92)" stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
                    <text x="272" y="215" fill="var(--color-text-secondary)" fontSize={10} fontFamily="var(--font-body)" textAnchor="middle">6/18</text>
                    <text x="272" y="233" fill="var(--state-error)" fontSize={13} fontWeight={600} fontFamily="var(--font-body)" textAnchor="middle">45 分</text>
                    <text x="272" y="246" fill="var(--color-text-tertiary)" fontSize={9} fontFamily="var(--font-body)" textAnchor="middle">低谷期</text>
                  </g>
                </g>

                {/* 节点2: 高峰 6/22 分数78 */}
                <g className="trend-chart-node">
                  <circle cx="368" cy="120" r="4.5" fill="var(--state-success)" className="node-dot" />
                  <g className="tooltip-box">
                    <rect x="324" y="72" width="88" height="48" rx={8} fill="rgba(10,14,26,0.92)" stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
                    <text x="368" y="91" fill="var(--color-text-secondary)" fontSize={10} fontFamily="var(--font-body)" textAnchor="middle">6/22</text>
                    <text x="368" y="109" fill="var(--state-success)" fontSize={13} fontWeight={600} fontFamily="var(--font-body)" textAnchor="middle">78 分</text>
                    <text x="368" y="122" fill="var(--color-text-tertiary)" fontSize={9} fontFamily="var(--font-body)" textAnchor="middle">高峰期</text>
                  </g>
                </g>

                {/* 节点3: 转折 6/30 分数50 */}
                <g className="trend-chart-node">
                  <circle cx="560" cy="184" r="4.5" fill="var(--color-gold)" className="node-dot" />
                  <g className="tooltip-box">
                    <rect x="516" y="136" width="88" height="48" rx={8} fill="rgba(10,14,26,0.92)" stroke="rgba(200,168,78,0.2)" strokeWidth={1} />
                    <text x="560" y="155" fill="var(--color-text-secondary)" fontSize={10} fontFamily="var(--font-body)" textAnchor="middle">6/30</text>
                    <text x="560" y="173" fill="var(--color-gold)" fontSize={13} fontWeight={600} fontFamily="var(--font-body)" textAnchor="middle">50 分</text>
                    <text x="560" y="186" fill="var(--color-text-tertiary)" fontSize={9} fontFamily="var(--font-body)" textAnchor="middle">转折点</text>
                  </g>
                </g>

                {/* 节点4: 高峰 7/4 分数67 */}
                <g className="trend-chart-node">
                  <circle cx="656" cy="135" r="4.5" fill="var(--state-success)" className="node-dot" />
                  <g className="tooltip-box">
                    <rect x="612" y="87" width="88" height="48" rx={8} fill="rgba(10,14,26,0.92)" stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
                    <text x="656" y="106" fill="var(--color-text-secondary)" fontSize={10} fontFamily="var(--font-body)" textAnchor="middle">7/4</text>
                    <text x="656" y="124" fill="var(--state-success)" fontSize={13} fontWeight={600} fontFamily="var(--font-body)" textAnchor="middle">67 分</text>
                    <text x="656" y="137" fill="var(--color-text-tertiary)" fontSize={9} fontFamily="var(--font-body)" textAnchor="middle">高峰期</text>
                  </g>
                </g>

                {/* 节点5: 低谷 7/8 分数58 */}
                <g className="trend-chart-node">
                  <circle cx="752" cy="160" r="4.5" fill="var(--state-error)" className="node-dot" />
                  <g className="tooltip-box">
                    <rect x="708" y="168" width="88" height="48" rx={8} fill="rgba(10,14,26,0.92)" stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
                    <text x="752" y="187" fill="var(--color-text-secondary)" fontSize={10} fontFamily="var(--font-body)" textAnchor="middle">7/8</text>
                    <text x="752" y="205" fill="var(--state-error)" fontSize={13} fontWeight={600} fontFamily="var(--font-body)" textAnchor="middle">58 分</text>
                    <text x="752" y="218" fill="var(--color-text-tertiary)" fontSize={9} fontFamily="var(--font-body)" textAnchor="middle">低谷期</text>
                  </g>
                </g>

                {/* 节点6: 当前 7/10 分数70 */}
                <g className="trend-chart-node">
                  <circle cx="848" cy="128" r="5.5" fill="var(--color-gold)" stroke="#fff" strokeWidth={1.5} className="node-dot" />
                  <g className="tooltip-box">
                    <rect x="804" y="80" width="88" height="48" rx={8} fill="rgba(10,14,26,0.92)" stroke="rgba(200,168,78,0.3)" strokeWidth={1} />
                    <text x="848" y="99" fill="var(--color-text-secondary)" fontSize={10} fontFamily="var(--font-body)" textAnchor="middle">7/10（今天）</text>
                    <text x="848" y="117" fill="var(--color-gold)" fontSize={13} fontWeight={600} fontFamily="var(--font-body)" textAnchor="middle">70 分</text>
                    <text x="848" y="130" fill="var(--color-text-tertiary)" fontSize={9} fontFamily="var(--font-body)" textAnchor="middle">当前值</text>
                  </g>
                </g>

                {/* 预测节点: 7/12 分数84 */}
                <g className="trend-chart-node">
                  <circle cx="944" cy="78" r="4" fill="var(--color-gold)" opacity={0.5} className="node-dot" />
                  <g className="tooltip-box">
                    <rect x="900" y="30" width="88" height="48" rx={8} fill="rgba(10,14,26,0.92)" stroke="rgba(200,168,78,0.2)" strokeWidth={1} />
                    <text x="944" y="49" fill="var(--color-text-secondary)" fontSize={10} fontFamily="var(--font-body)" textAnchor="middle">7/12（预测）</text>
                    <text x="944" y="67" fill="var(--color-gold)" fontSize={13} fontWeight={600} fontFamily="var(--font-body)" textAnchor="middle">84 分</text>
                    <text x="944" y="80" fill="var(--color-text-tertiary)" fontSize={9} fontFamily="var(--font-body)" textAnchor="middle">预测高峰</text>
                  </g>
                </g>

                {/* 预测节点: 7/14 分数75 */}
                <g className="trend-chart-node">
                  <circle cx="1040" cy="84" r="4" fill="var(--color-gold)" opacity={0.5} className="node-dot" />
                  <g className="tooltip-box">
                    <rect x="996" y="94" width="88" height="48" rx={8} fill="rgba(10,14,26,0.92)" stroke="rgba(200,168,78,0.2)" strokeWidth={1} />
                    <text x="1040" y="113" fill="var(--color-text-secondary)" fontSize={10} fontFamily="var(--font-body)" textAnchor="middle">7/14（预测）</text>
                    <text x="1040" y="131" fill="var(--color-gold)" fontSize={13} fontWeight={600} fontFamily="var(--font-body)" textAnchor="middle">75 分</text>
                    <text x="1040" y="144" fill="var(--color-text-tertiary)" fontSize={9} fontFamily="var(--font-body)" textAnchor="middle">预测回落</text>
                  </g>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 4. 周期分析区 ==================== */}
      <section style={{ background: '#0d1220', padding: 'var(--space-16) 0' }}>
        <div className="content-container">
          {/* 板块标题 */}
          <div className="flex items-center gap-3 mb-8">
            <div
              className="flex items-center justify-center"
              style={{
                width: 40,
                height: 40,
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(200, 168, 78, 0.12)',
              }}
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

          {/* 三列卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CYCLE_CARDS.map((item) => (
              <div key={item.tag} className="trend-cycle-card">
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-md font-medium"
                    style={{
                      fontSize: 'var(--text-xs, 0.75rem)',
                      background: item.tagBg,
                      color: item.tagColor,
                    }}
                  >
                    {item.tag}
                  </span>
                  <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm, 0.875rem)' }}>
                    {item.time}
                  </span>
                </div>
                <h4
                  className="font-semibold mb-2"
                  style={{ color: 'var(--color-text)', fontSize: 'var(--text-base, 1rem)' }}
                >
                  {item.title}
                </h4>
                <p
                  className="line-clamp-4"
                  style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: 'var(--text-sm, 0.875rem)',
                    lineHeight: 'var(--leading-relaxed, 1.75)',
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 5. AI 解读区 ==================== */}
      <section
        style={{
          background: 'linear-gradient(180deg, #0d1220 0%, #0a0a2e 100%)',
          padding: 'var(--space-16) 0 var(--space-20)',
        }}
      >
        <div className="content-container">
          {/* 板块标题 */}
          <div className="flex items-center gap-3 mb-8">
            <div
              className="flex items-center justify-center"
              style={{
                width: 40,
                height: 40,
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(200, 168, 78, 0.12)',
              }}
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

          {/* 两列卡片 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 趋势变化原因分析 */}
            <div className="trend-ai-card">
              <div className="flex items-center gap-2 mb-5">
                <BarChart3 size={18} style={{ color: 'var(--color-primary-lighter)' }} />
                <h4
                  className="font-semibold"
                  style={{ color: 'var(--color-text)', fontSize: 'var(--text-base, 1rem)' }}
                >
                  趋势变化原因
                </h4>
              </div>
              <div className="flex flex-col gap-4">
                {REASON_ITEMS.map((item) => (
                  <div key={item.num} className="flex gap-3">
                    <span
                      className="flex-shrink-0 flex items-center justify-center rounded-md font-semibold"
                      style={{
                        width: 24,
                        height: 24,
                        fontSize: 'var(--text-xs, 0.75rem)',
                        background: item.bg,
                        color: item.color,
                      }}
                    >
                      {item.num}
                    </span>
                    <p
                      className="line-clamp-3"
                      style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: 'var(--text-sm, 0.875rem)',
                        lineHeight: 'var(--leading-relaxed, 1.75)',
                      }}
                    >
                      <strong style={{ color: 'var(--color-text)' }}>{item.bold}</strong>
                      ：{item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 行动建议 */}
            <div className="trend-ai-card">
              <div className="flex items-center gap-2 mb-5">
                <Lightbulb size={18} style={{ color: 'var(--color-gold)' }} />
                <h4
                  className="font-semibold"
                  style={{ color: 'var(--color-text)', fontSize: 'var(--text-base, 1rem)' }}
                >
                  行动建议
                </h4>
              </div>
              <div className="flex flex-col gap-4">
                {ACTION_ITEMS.map((item) => (
                  <div key={item.num} className="flex gap-3">
                    <span
                      className="flex-shrink-0 flex items-center justify-center rounded-md font-semibold"
                      style={{
                        width: 24,
                        height: 24,
                        fontSize: 'var(--text-xs, 0.75rem)',
                        background: item.bg,
                        color: item.color,
                      }}
                    >
                      {item.num}
                    </span>
                    <p
                      className="line-clamp-3"
                      style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: 'var(--text-sm, 0.875rem)',
                        lineHeight: 'var(--leading-relaxed, 1.75)',
                      }}
                    >
                      <strong style={{ color: 'var(--color-text)' }}>{item.bold}</strong>
                      ：{item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
