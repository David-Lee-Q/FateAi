import { Link } from 'react-router-dom';
import {
  ArrowRight, Scroll, Heart, Orbit,
} from 'lucide-react';
import type { JSX } from 'react';

/** ==================== 自定义 SVG 图标 ==================== */

// 塔罗牌 — 竖着的牌
const iconTarot = <svg width="32" height="32" viewBox="0 0 32 32"><rect x="7" y="3" width="18" height="26" rx="3" fill="none" stroke="var(--color-gold)" strokeWidth="1.2"/><path d="M12 10H20M12 15H20M12 20H17" stroke="var(--color-gold)" strokeWidth="0.8" strokeLinecap="round"/><path d="M16 7V9M16 23V25" stroke="var(--color-primary-lighter)" strokeWidth="0.8" opacity="0.5"/></svg>;

// 星座 — 太阳与星星
const iconZodiac = <svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="6" fill="none" stroke="var(--color-gold)" strokeWidth="1.2"/><circle cx="16" cy="16" r="2" fill="var(--color-gold)" opacity="0.4"/><g stroke="var(--color-gold)" strokeWidth="0.8" opacity="0.6"><line x1="16" y1="3" x2="16" y2="7"/><line x1="16" y1="25" x2="16" y2="29"/><line x1="3" y1="16" x2="7" y2="16"/><line x1="25" y1="16" x2="29" y2="16"/><line x1="7" y1="7" x2="10" y2="10"/><line x1="22" y1="22" x2="25" y2="25"/><line x1="25" y1="7" x2="22" y2="10"/><line x1="10" y1="22" x2="7" y2="25"/></g></svg>;

// 数字能量 — 数字 8 / 无穷
const iconNumerology = <svg width="32" height="32" viewBox="0 0 32 32"><path d="M10 8C10 5 13 3 16 3C19 3 22 5 22 8C22 11 19 13 16 13C13 13 10 15 10 18C10 21 13 23 16 23C19 23 22 25 22 28" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round"/><circle cx="16" cy="15.5" r="1" fill="var(--color-gold)" opacity="0.4"/></svg>;

// 占星骰子 — 骰子
const iconAstrodice = <svg width="32" height="32" viewBox="0 0 32 32"><rect x="6" y="6" width="20" height="20" rx="4" fill="none" stroke="var(--color-gold)" strokeWidth="1.2" transform="rotate(5 16 16)"/><circle cx="12" cy="12" r="1.5" fill="var(--color-gold)" opacity="0.7"/><circle cx="20" cy="12" r="1.5" fill="var(--color-gold)" opacity="0.7"/><circle cx="16" cy="16" r="1.5" fill="var(--color-gold)" opacity="0.7"/><circle cx="12" cy="20" r="1.5" fill="var(--color-gold)" opacity="0.7"/><circle cx="20" cy="20" r="1.5" fill="var(--color-gold)" opacity="0.7"/></svg>;

// 月相 — 月牙
const iconMoonphase = <svg width="32" height="32" viewBox="0 0 32 32"><path d="M18 4A12 12 0 1 0 18 28A9 9 0 0 1 18 4Z" fill="var(--color-gold)" opacity="0.7" stroke="var(--color-gold)" strokeWidth="0.8"/><circle cx="22" cy="10" r="1" fill="var(--color-gold-light)" opacity="0.5"/><circle cx="25" cy="16" r="0.8" fill="var(--color-gold-light)" opacity="0.3"/></svg>;

// 符文 — 六角形 + 符文标记
const iconRune = <svg width="32" height="32" viewBox="0 0 32 32"><polygon points="16,2 28,9 28,23 16,30 4,23 4,9" fill="none" stroke="var(--color-gold)" strokeWidth="1.2"/><line x1="16" y1="2" x2="16" y2="30" stroke="var(--color-gold)" strokeWidth="0.6" opacity="0.4"/><line x1="4" y1="16" x2="28" y2="16" stroke="var(--color-gold)" strokeWidth="0.6" opacity="0.4"/><path d="M14 12L16 18L18 12" stroke="var(--color-gold)" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>;

/** ==================== 数据与类型 ==================== */

/** 工具卡片数据结构 */
interface ToolItem {
  name: string;
  path: string;
  desc: string;
  icon: JSX.Element;
}

/** 西方占卜工具列表 — 使用自定义 SVG 图标 */
const WESTERN_TOOLS: ToolItem[] = [
  { name: '塔罗牌占卜', path: '/tarot', desc: '透过塔罗牌的神秘象征，探索潜意识中的指引', icon: iconTarot },
  { name: '星座运势', path: '/zodiac', desc: '十二星座每日/每周/每月运势详解', icon: iconZodiac },
  { name: '数字能量', path: '/numerology', desc: '揭示姓名、生日、号码背后的数字密码', icon: iconNumerology },
  { name: '占星骰子', path: '/astrodice', desc: '三颗骰子，星座 x 行星 x 宫位的精准回答', icon: iconAstrodice },
  { name: '月相能量', path: '/moonphase', desc: '倾听月亮的声音，感受月相能量的指引', icon: iconMoonphase },
  { name: '符文占卜', path: '/rune', desc: '聆听北欧古老符文的神秘指引', icon: iconRune },
];

/** ==================== 子组件 ==================== */

/** 工具卡片组件 — 使用 glass-card 样式 */
function ToolCard({ tool }: { tool: ToolItem }) {
  return (
    <Link
      to={tool.path}
      className="glass-card flex flex-col"
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
        进入占卜 <ArrowRight size={14} />
      </span>
    </Link>
  );
}

/** 五角星 SVG 装饰 */
function StarDecorSVG() {
  const starPath = 'M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4 5.6 21.2 8 14l-6-4.8h7.6z';
  return (
    <>
      <svg className="absolute top-16 right-16" width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.3 }}>
        <path d={starPath} fill="var(--color-gold)" />
      </svg>
      <svg className="absolute top-36 left-24" width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.25 }}>
        <path d={starPath} fill="var(--color-gold)" />
      </svg>
      <svg className="absolute bottom-28 right-1/4" width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.2 }}>
        <path d={starPath} fill="var(--color-gold)" />
      </svg>
    </>
  );
}

/** 特色说明区数据 — 与设计稿一致 */
const FEATURES = [
  {
    icon: Scroll,
    iconBg: 'rgba(200, 168, 78, 0.12)',
    iconColor: 'var(--color-gold)',
    title: '神秘传承',
    desc: '源自古希腊、北欧等西方神秘学传统，塔罗、符文、占星骰子等工具承载千年智慧，为你打开神秘世界的大门',
  },
  {
    icon: Heart,
    iconBg: 'rgba(0, 75, 170, 0.15)',
    iconColor: 'var(--color-primary-lighter)',
    title: '直觉引导',
    desc: '唤醒内在直觉，而非被动接受命运。通过西方占卜工具的象征语言，帮助你主动探索内心深处的真实声音',
  },
  {
    icon: Orbit,
    iconBg: 'rgba(200, 168, 78, 0.12)',
    iconColor: 'var(--color-gold)',
    title: '能量共振',
    desc: '通过数字、星象、符号感知宇宙能量，了解你与日月星辰的共振频率，把握时机顺势而为',
  },
];

/** ==================== 西方占卜聚合页 ==================== */
export default function WesternPage() {
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
              探索神秘力量
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
            西方占卜
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
            从古老的塔罗到现代的数字能量，西方占卜体系帮你聆听直觉的声音
          </p>
        </div>
      </section>

      {/* ====== 功能入口网格（3 列 x 2 行） ====== */}
      <section style={{ background: '#0a0e1a', padding: 'var(--space-16) 0 var(--space-24)' }}>
        <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 var(--space-6)' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {WESTERN_TOOLS.map((tool) => (
              <ToolCard key={tool.path} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* ====== 底部特色说明区（3 列） ====== */}
      <section style={{ background: 'linear-gradient(180deg, #0a0e1a 0%, #0d1220 100%)', padding: 'var(--space-20) 0 var(--space-24)' }}>
        <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 var(--space-6)' }}>
          <h2
            className="section-title text-center"
            style={{ marginBottom: 'var(--space-16)' }}
          >
            为什么选择天机西方占卜
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((feature) => {
              const IconComp = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="flex flex-col items-center text-center"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--space-8)',
                    textAlign: 'center',
                    transition: 'border-color var(--transition-base)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(200, 168, 78, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: feature.iconBg }}
                  >
                    <IconComp size={26} style={{ color: feature.iconColor }} />
                  </div>
                  <h3 className="font-semibold text-lg mb-3" style={{ color: 'var(--color-text)' }}>
                    {feature.title}
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)' }}>
                    {feature.desc}
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
