import { Link } from 'react-router-dom';
import {
  ArrowRight, BookOpen, PartyPopper, Zap,
} from 'lucide-react';
import type { JSX } from 'react';

/** ==================== 自定义 SVG 图标 ==================== */

// 周公解梦 — 月亮+云
const iconDream = <svg width="32" height="32" viewBox="0 0 32 32"><path d="M20 6A10 10 0 1 0 20 26 8 8 0 0 1 20 6Z" fill="var(--color-gold)" opacity="0.6" stroke="var(--color-gold)" strokeWidth="1"/><path d="M6 20C6 16.5 8.5 14 12 14" stroke="var(--color-primary-lighter)" strokeWidth="0.8" fill="none" opacity="0.5"/><path d="M4 24C4 21 6 19 9 19" stroke="var(--color-primary-lighter)" strokeWidth="0.8" fill="none" opacity="0.4"/></svg>;

// 签诗抽签 — 签筒
const iconDrawlot = <svg width="32" height="32" viewBox="0 0 32 32"><rect x="10" y="8" width="12" height="22" rx="3" fill="none" stroke="var(--color-gold)" strokeWidth="1.2"/><line x1="16" y1="2" x2="16" y2="8" stroke="var(--color-gold)" strokeWidth="1.2" strokeLinecap="round"/><line x1="13" y1="13" x2="19" y2="13" stroke="var(--color-gold)" strokeWidth="0.8" opacity="0.5"/><line x1="13" y1="17" x2="19" y2="17" stroke="var(--color-gold)" strokeWidth="0.8" opacity="0.5"/><line x1="13" y1="21" x2="17" y2="21" stroke="var(--color-gold)" strokeWidth="0.8" opacity="0.5"/></svg>;

// 姓名测算 — 名字/印章
const iconNametest = <svg width="32" height="32" viewBox="0 0 32 32"><rect x="5" y="5" width="22" height="22" rx="3" fill="none" stroke="var(--color-gold)" strokeWidth="1.2"/><text x="16" y="21" textAnchor="middle" fontFamily="var(--font-display)" fontSize="12" fontWeight="700" fill="var(--color-gold)" opacity="0.8">名</text><line x1="8" y1="24" x2="24" y2="24" stroke="var(--color-gold)" strokeWidth="0.6" opacity="0.4"/></svg>;

// 生肖运势 — 12 地支环
const iconShengxiao = <svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="12" fill="none" stroke="var(--color-gold)" strokeWidth="1"/><circle cx="16" cy="16" r="8" fill="none" stroke="var(--color-gold)" strokeWidth="0.6" opacity="0.4"/><circle cx="16" cy="4" r="1.5" fill="var(--color-gold)" opacity="0.7"/><circle cx="26" cy="10" r="1.5" fill="var(--color-gold)" opacity="0.5"/><circle cx="26" cy="22" r="1.5" fill="var(--color-gold)" opacity="0.5"/><circle cx="16" cy="28" r="1.5" fill="var(--color-gold)" opacity="0.7"/><circle cx="6" cy="22" r="1.5" fill="var(--color-gold)" opacity="0.5"/><circle cx="6" cy="10" r="1.5" fill="var(--color-gold)" opacity="0.5"/></svg>;

// 黄历宜忌 — 日历
const iconAlmanac = <svg width="32" height="32" viewBox="0 0 32 32"><rect x="4" y="6" width="24" height="22" rx="3" fill="none" stroke="var(--color-gold)" strokeWidth="1.2"/><line x1="4" y1="12" x2="28" y2="12" stroke="var(--color-gold)" strokeWidth="1"/><line x1="12" y1="4" x2="12" y2="8" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round"/><line x1="20" y1="4" x2="20" y2="8" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinecap="round"/><text x="16" y="22" textAnchor="middle" fontFamily="var(--font-body)" fontSize="10" fontWeight="700" fill="var(--color-gold)" opacity="0.8">宜</text></svg>;

// 手相算命 — 手掌
const iconPalm = <svg width="32" height="32" viewBox="0 0 32 32"><path d="M16 4C16 4 13 8 13 13C13 18 16 21 16 21" stroke="var(--color-gold)" strokeWidth="1.2" strokeLinecap="round" fill="none"/><path d="M10 6C10 6 6 10 6 15C6 20 9 24 9 24" stroke="var(--color-gold)" strokeWidth="1.2" strokeLinecap="round" fill="none"/><path d="M22 6C22 6 26 10 26 15C26 20 23 24 23 24" stroke="var(--color-gold)" strokeWidth="1.2" strokeLinecap="round" fill="none"/><path d="M16 14C16 14 10 17 7 22C4 27 4 30 16 30C28 30 28 27 25 22C22 17 16 14 16 14Z" fill="rgba(200,168,78,0.12)" stroke="var(--color-gold)" strokeWidth="1.2"/></svg>;

/** ==================== 数据与类型 ==================== */

/** 工具卡片数据结构 */
interface ToolItem {
  name: string;
  path: string;
  desc: string;
  icon: JSX.Element;
}

/** 民俗趣味工具列表 — 使用自定义 SVG 图标 */
const FOLK_TOOLS: ToolItem[] = [
  { name: '周公解梦', path: '/dream', desc: '输入梦境关键词，AI 智能解读梦境寓意', icon: iconDream },
  { name: '签诗抽签', path: '/drawlot', desc: '虚拟摇签体验，AI 解读签诗启示', icon: iconDrawlot },
  { name: '手相算命', path: '/palm', desc: '上传手掌照片，AI 分析三大主线与掌型特征', icon: iconPalm },
  { name: '姓名测算', path: '/nametest', desc: '三才五格数理分析，揭示姓名吉凶密码', icon: iconNametest },
  { name: '生肖运势', path: '/shengxiao', desc: '十二生肖专属运势详解，每日更新', icon: iconShengxiao },
  { name: '黄历宜忌', path: '/almanac', desc: '传统黄历通胜，每日宜忌一览', icon: iconAlmanac },
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

/** 特色说明区数据 — 与设计稿一致 */
const FEATURES = [
  {
    icon: BookOpen,
    iconBg: 'rgba(200, 168, 78, 0.1)',
    iconColor: 'var(--color-gold)',
    title: '通俗易懂',
    desc: '无需专业命理知识，人人可用',
  },
  {
    icon: PartyPopper,
    iconBg: 'rgba(0, 75, 170, 0.12)',
    iconColor: 'var(--color-primary-lighter)',
    title: '趣味性强',
    desc: '把传统占卜变成有趣的日常体验',
  },
  {
    icon: Zap,
    iconBg: 'rgba(200, 168, 78, 0.1)',
    iconColor: 'var(--color-gold)',
    title: '即时解读',
    desc: '输入即可获得 AI 智能解读',
  },
];

/** ==================== 民俗趣味聚合页 ==================== */
export default function FolkPage() {
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
              民间智慧
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
            民俗趣味
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
            周公解梦、姓名测算、生肖运势......来自民间智慧的趣味占卜，轻松解读日常生活中的运势密码
          </p>
        </div>
      </section>

      {/* ====== 功能入口网格（3 列） ====== */}
      <section style={{ background: '#0a0e1a', padding: 'var(--space-16) 0 var(--space-24)' }}>
        <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 var(--space-6)' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {FOLK_TOOLS.map((tool) => (
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
            为什么选择民俗趣味
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
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
