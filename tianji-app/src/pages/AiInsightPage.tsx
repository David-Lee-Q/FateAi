import { Link } from 'react-router-dom';
import {
  ArrowRight, Brain, Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { JSX } from 'react';

/** ==================== 自定义 SVG 图标 ==================== */

// 综合报告 — 文档+图表
const iconReport = <svg width="32" height="32" viewBox="0 0 32 32"><rect x="5" y="3" width="16" height="22" rx="2" fill="none" stroke="var(--color-gold)" strokeWidth="1.2"/><rect x="11" y="7" width="16" height="22" rx="2" fill="none" stroke="var(--color-primary-lighter)" strokeWidth="1" opacity="0.6"/><line x1="9" y1="10" x2="17" y2="10" stroke="var(--color-gold)" strokeWidth="0.8" opacity="0.5"/><line x1="9" y1="14" x2="17" y2="14" stroke="var(--color-gold)" strokeWidth="0.8" opacity="0.5"/><line x1="9" y1="18" x2="15" y2="18" stroke="var(--color-gold)" strokeWidth="0.8" opacity="0.5"/><rect x="15" y="17" width="8" height="6" rx="1" fill="var(--color-primary-lighter)" opacity="0.2"/></svg>;

// 趋势追踪 — 上升曲线
const iconTrend = <svg width="32" height="32" viewBox="0 0 32 32"><polyline points="4,24 10,20 16,22 22,14 28,8" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="28" cy="8" r="2" fill="var(--color-gold)" opacity="0.5"/><polyline points="4,26 28,26" stroke="var(--color-gold)" strokeWidth="0.6" opacity="0.3"/></svg>;

// 多维对比 — 双向箭头对比
const iconCompare = <svg width="32" height="32" viewBox="0 0 32 32"><rect x="3" y="8" width="10" height="16" rx="2" fill="none" stroke="var(--color-gold)" strokeWidth="1"/><rect x="19" y="8" width="10" height="16" rx="2" fill="none" stroke="var(--color-primary-lighter)" strokeWidth="1" opacity="0.7"/><path d="M15 12L17 16L15 20" stroke="var(--color-gold)" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M17 12L15 16L17 20" stroke="var(--color-gold)" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/><line x1="8" y1="13" x2="8" y2="19" stroke="var(--color-gold)" strokeWidth="0.8" opacity="0.4"/><line x1="24" y1="13" x2="24" y2="19" stroke="var(--color-primary-lighter)" strokeWidth="0.8" opacity="0.4"/></svg>;

// 运势结果 — 柱状图
const iconResult = <svg width="32" height="32" viewBox="0 0 32 32"><rect x="4" y="20" width="5" height="8" rx="1" fill="var(--color-gold)" opacity="0.4"/><rect x="11" y="14" width="5" height="14" rx="1" fill="var(--color-gold)" opacity="0.6"/><rect x="18" y="10" width="5" height="18" rx="1" fill="var(--color-gold)" opacity="0.8"/><rect x="25" y="6" width="5" height="22" rx="1" fill="var(--color-gold)"/><line x1="3" y1="28" x2="31" y2="28" stroke="var(--color-gold)" strokeWidth="0.8" opacity="0.3"/></svg>;

/** ==================== 数据与类型 ==================== */

/** 工具卡片数据结构 */
interface ToolItem {
  name: string;
  path: string;
  desc: string;
  linkText: string;
  icon: JSX.Element;
}

/** AI 洞察工具列表 — 使用自定义 SVG 图标 */
// 个性化建议 — 齿轮+星星
const iconAdvice = <svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="6" fill="none" stroke="var(--color-gold)" strokeWidth="1.2"/><circle cx="16" cy="16" r="2" fill="var(--color-gold)" opacity="0.5"/><g stroke="var(--color-gold)" strokeWidth="1" opacity="0.6"><line x1="16" y1="2" x2="16" y2="6"/><line x1="16" y1="26" x2="16" y2="30"/><line x1="2" y1="16" x2="6" y2="16"/><line x1="26" y1="16" x2="30" y2="16"/><line x1="6" y1="6" x2="9" y2="9"/><line x1="23" y1="23" x2="26" y2="26"/><line x1="26" y1="6" x2="23" y2="9"/><line x1="9" y1="23" x2="6" y2="26"/></g><path d="M20 8L22 10L24 6" stroke="var(--color-primary-lighter)" strokeWidth="0.8" fill="none" opacity="0.5"/></svg>;

const AI_TOOLS: ToolItem[] = [
  { name: '综合报告', path: '/report', desc: '融合多个占卜体系的结果，生成全面的综合运势分析报告', linkText: '查看报告', icon: iconReport },
  { name: '趋势追踪', path: '/trend', desc: '追踪你的运势变化趋势，提前预判未来走向与关键节点', linkText: '开始追踪', icon: iconTrend },
  { name: '多维对比', path: '/compare', desc: '横向对比不同体系间的解读差异，全面理解命运信号', linkText: '开始对比', icon: iconCompare },
  { name: '运势结果', path: '/history', desc: '查看历史占卜结果与 AI 深度解读', linkText: '查看结果', icon: iconResult },
  { name: '个性化建议', path: '/advice', desc: '基于命理信息，生成可执行的行动建议与日程规划', linkText: '获取建议', icon: iconAdvice },
];

/** ==================== 子组件 ==================== */

/** 工具卡片组件 — 使用 ai-card 样式 */
function ToolCard({ tool }: { tool: ToolItem }) {
  return (
    <Link
      to={tool.path}
      className="ai-card flex flex-col relative z-10"
      style={{ textDecoration: 'none' }}
    >
      {/* 图标 + 标题 */}
      <div className="flex items-center gap-4 mb-5">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'rgba(0, 75, 170, 0.15)' }}
        >
          {tool.icon}
        </div>
        <h3 className="font-semibold text-lg" style={{ color: 'var(--color-text)' }}>
          {tool.name}
        </h3>
      </div>

      {/* 描述 */}
      <p
        className="flex-1 mb-5"
        style={{
          color: 'var(--color-text-secondary)',
          fontSize: 'var(--text-sm)',
          lineHeight: 'var(--leading-relaxed)',
        }}
      >
        {tool.desc}
      </p>

      {/* 底部链接 */}
      <span
        className="card-link"
        style={{ color: 'var(--color-gold)' }}
      >
        {tool.linkText} <ArrowRight size={14} />
      </span>
    </Link>
  );
}

/** 五角星 SVG 装饰 */
function StarDecorSVG() {
  const starPath = 'M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4 5.6 21.2 8 14l-6-4.8h7.6z';
  return (
    <>
      <svg className="absolute top-20 left-10" width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.3 }}>
        <path d={starPath} fill="var(--color-gold)" />
      </svg>
      <svg className="absolute top-32 right-20" width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.25 }}>
        <path d={starPath} fill="var(--color-gold)" />
      </svg>
      <svg className="absolute bottom-24 left-1/4" width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.2 }}>
        <path d={starPath} fill="var(--color-gold)" />
      </svg>
    </>
  );
}

/** AI 核心能力说明区数据 — 与设计稿一致（4 列） */
const AI_CAPABILITIES = [
  {
    icon: Brain,
    isLucide: true as const,
    iconBg: 'rgba(0, 75, 170, 0.15)',
    iconColor: 'var(--color-primary-lighter)',
    title: '深度理解',
    desc: 'AI 理解 17+ 种占卜体系的专业知识',
  },
  {
    icon: iconTrend,
    isLucide: false as const,
    iconBg: 'rgba(200, 168, 78, 0.12)',
    iconColor: 'var(--color-gold)',
    title: '趋势预测',
    desc: '基于时间序列分析运势变化规律',
  },
  {
    icon: iconCompare,
    isLucide: false as const,
    iconBg: 'rgba(0, 75, 170, 0.15)',
    iconColor: 'var(--color-primary-lighter)',
    title: '交叉验证',
    desc: '对比不同体系的结论，提升解读可靠性',
  },
  {
    icon: Zap,
    isLucide: true as const,
    iconBg: 'rgba(200, 168, 78, 0.12)',
    iconColor: 'var(--color-gold)',
    title: '即时生成',
    desc: '秒级生成个性化解读报告',
  },
];

/** ==================== AI 洞察聚合页 ==================== */
export default function AiInsightPage() {
  return (
    <div className="min-h-screen" style={{ background: '#0a0e1a', color: 'var(--color-text)' }}>
      {/* ====== 标题区 — 星空粒子 + 五角星装饰 + 面包屑 + 金色徽章 + h1 + 副标题 ====== */}
      <section
        className="relative flex flex-col items-center justify-center text-center overflow-hidden"
        style={{
          minHeight: 480,
          background: 'linear-gradient(180deg, var(--color-primary-darker), #0a0f2e)',
          paddingTop: 'calc(var(--navbar-height, 64px) + 60px)',
          paddingBottom: 60,
        }}
      >
        {/* 星空粒子层 */}
        <div className="starfield">
          <div className="layer-1" />
          <div className="layer-2" />
          <div className="layer-3" />
        </div>

        {/* 五角星装饰 */}
        <StarDecorSVG />

        {/* 内容区 — z-10 确保在星空粒子之上 */}
        <div className="relative z-10 flex flex-col items-center" style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 var(--space-6)' }}>
          {/* 面包屑 — 距标题区顶部 40px，距 h1 标题 24px */}

          {/* 金色徽章 */}
          <div
            className="mb-6"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '6px 20px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(200, 168, 78, 0.12)',
              border: '1px solid rgba(200, 168, 78, 0.3)',
            }}
          >
            <span style={{ color: 'var(--color-gold-light)', fontSize: 'var(--text-sm)', fontWeight: 500, letterSpacing: '0.04em' }}>
              智能分析
            </span>
          </div>

          {/* 主标题 */}
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 5vw, var(--text-5xl))',
              color: '#ffffff',
              letterSpacing: '0.06em',
              textWrap: 'balance',
              wordBreak: 'keep-all',
              overflowWrap: 'break-word',
              marginBottom: 'var(--space-6)',
              lineHeight: 'var(--leading-tight)',
              fontWeight: 700,
            }}
          >
            AI 洞察
          </h1>

          {/* 副标题 */}
          <p
            className="text-center max-w-2xl"
            style={{
              fontSize: 'clamp(var(--text-sm), 1.4vw, var(--text-lg))',
              color: 'var(--color-primary-lightest)',
              lineHeight: 'var(--leading-relaxed)',
              maxWidth: '42rem',
            }}
          >
            综合多个占卜体系，运用 AI 深度分析，生成跨维度的命运解读与行动指南
          </p>
        </div>
      </section>

      {/* ====== 功能入口网格（2 列 x 2 行，最大宽度 900px 居中） ====== */}
      <section style={{ background: '#0a0e1a', padding: 'var(--space-16) 0 var(--space-24)' }}>
        <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 var(--space-6)' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" style={{ maxWidth: 1100, margin: '0 auto' }}>
            {AI_TOOLS.map((tool) => (
              <ToolCard key={tool.path} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* ====== AI 核心能力说明区（4 列） ====== */}
      <section style={{ background: 'linear-gradient(180deg, #0a0e1a 0%, #0d1220 100%)', padding: 'var(--space-20) 0 var(--space-24)' }}>
        <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 var(--space-6)' }}>
          <h2
            className="section-title text-center"
            style={{ marginBottom: 'var(--space-16)' }}
          >
            AI 核心能力
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {AI_CAPABILITIES.map((cap) => {
              return (
                <div
                  key={cap.title}
                  className="ai-card flex flex-col items-center text-center"
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 relative z-10"
                    style={{ background: cap.iconBg }}
                  >
                    {cap.isLucide
                      ? <cap.icon size={26} style={{ color: cap.iconColor }} />
                      : <>{cap.icon}</>
                    }
                  </div>
                  <h3 className="font-semibold text-lg mb-3 relative z-10" style={{ color: 'var(--color-text)' }}>
                    {cap.title}
                  </h3>
                  <p className="text-sm relative z-10" style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
                    {cap.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
