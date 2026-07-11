import { Link } from 'react-router-dom';
import {
  ArrowRight, BookOpen, Sparkles, Layers,
} from 'lucide-react';
import type { JSX } from 'react';

/** ==================== 自定义 SVG 图标 ==================== */

// 八字排盘 — 太极阴阳图
const iconBazi = <svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="none" stroke="var(--color-gold)" strokeWidth="1.2"/><path d="M16 2A14 14 0 0 1 16 30A7 7 0 0 0 16 16A7 7 0 0 1 16 2" fill="var(--color-gold)" opacity="0.8"/><circle cx="16" cy="9" r="2.5" fill="var(--color-primary-darker)"/><circle cx="16" cy="23" r="2.5" fill="var(--color-text-inverse)"/></svg>;

// 紫微斗数 — 星座命盘
const iconZiwei = <svg width="32" height="32" viewBox="0 0 32 32"><rect x="4" y="4" width="24" height="24" rx="4" fill="none" stroke="var(--color-gold)" strokeWidth="1.2" transform="rotate(45 16 16)"/><circle cx="16" cy="16" r="3" fill="var(--color-gold)" opacity="0.6"/><circle cx="16" cy="6" r="1.5" fill="var(--color-gold)" opacity="0.8"/><circle cx="26" cy="16" r="1.5" fill="var(--color-gold)" opacity="0.8"/><circle cx="16" cy="26" r="1.5" fill="var(--color-gold)" opacity="0.8"/><circle cx="6" cy="16" r="1.5" fill="var(--color-gold)" opacity="0.8"/></svg>;

// 六爻卦象 — 六爻卦线
const iconLiuyao = <svg width="32" height="32" viewBox="0 0 32 32"><line x1="6" y1="6" x2="26" y2="6" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round"/><line x1="6" y1="12" x2="26" y2="12" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round"/><line x1="6" y1="18" x2="17" y2="18" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round"/><line x1="21" y1="18" x2="26" y2="18" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round"/><line x1="6" y1="24" x2="26" y2="24" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round"/></svg>;

// 梅花易数 — 梅花五瓣
const iconMeihua = <svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="10" r="5" fill="none" stroke="var(--color-gold)" strokeWidth="1.2"/><circle cx="22" cy="16" r="5" fill="none" stroke="var(--color-gold)" strokeWidth="1.2"/><circle cx="19" cy="23" r="5" fill="none" stroke="var(--color-gold)" strokeWidth="1.2"/><circle cx="13" cy="23" r="5" fill="none" stroke="var(--color-gold)" strokeWidth="1.2"/><circle cx="10" cy="16" r="5" fill="none" stroke="var(--color-gold)" strokeWidth="1.2"/><circle cx="16" cy="16" r="2.5" fill="var(--color-gold)" opacity="0.6"/></svg>;

// 奇门遁甲 — 九宫格
const iconQimen = <svg width="32" height="32" viewBox="0 0 32 32"><rect x="3" y="3" width="9" height="9" rx="1.5" fill="none" stroke="var(--color-gold)" strokeWidth="1.2"/><rect x="14" y="3" width="9" height="9" rx="1.5" fill="none" stroke="var(--color-gold)" strokeWidth="1.2"/><rect x="25" y="3" width="4" height="9" rx="1" fill="none" stroke="var(--color-gold)" strokeWidth="1"/><rect x="3" y="14" width="9" height="9" rx="1.5" fill="none" stroke="var(--color-gold)" strokeWidth="1.2"/><rect x="14" y="14" width="9" height="9" rx="1.5" fill="var(--color-gold)" opacity="0.3" stroke="var(--color-gold)" strokeWidth="1.2"/><rect x="25" y="14" width="4" height="9" rx="1" fill="none" stroke="var(--color-gold)" strokeWidth="1"/><rect x="3" y="25" width="26" height="4" rx="1" fill="none" stroke="var(--color-gold)" strokeWidth="1.2"/></svg>;

// 铁板神数 — 四柱干支方格
const iconTieban = <svg width="32" height="32" viewBox="0 0 32 32"><rect x="4" y="4" width="24" height="24" rx="2" fill="none" stroke="var(--color-gold)" strokeWidth="1.2"/><line x1="4" y1="16" x2="28" y2="16" stroke="var(--color-gold)" strokeWidth="1"/><line x1="16" y1="4" x2="16" y2="28" stroke="var(--color-gold)" strokeWidth="1"/><circle cx="10" cy="10" r="2" fill="var(--color-gold)" opacity="0.5"/><circle cx="22" cy="22" r="2" fill="var(--color-gold)" opacity="0.5"/><circle cx="10" cy="22" r="1.5" fill="var(--color-gold)" opacity="0.3"/><circle cx="22" cy="10" r="1.5" fill="var(--color-gold)" opacity="0.3"/></svg>;

// 大六壬 — 六壬盘面
const iconDaliuren = <svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="13" fill="none" stroke="var(--color-gold)" strokeWidth="1.2"/><circle cx="16" cy="16" r="8" fill="none" stroke="var(--color-gold)" strokeWidth="0.8" opacity="0.6"/><circle cx="16" cy="16" r="3" fill="none" stroke="var(--color-gold)" strokeWidth="1.2"/><path d="M16 3 L16 8 M29 16 L24 16 M16 29 L16 24 M3 16 L8 16" stroke="var(--color-gold)" strokeWidth="1" opacity="0.8"/><circle cx="16" cy="6" r="1.5" fill="var(--color-gold)" opacity="0.7"/><circle cx="26" cy="16" r="1.5" fill="var(--color-gold)" opacity="0.7"/><circle cx="16" cy="26" r="1.5" fill="var(--color-gold)" opacity="0.7"/></svg>;

// 风水罗盘 — 罗盘指针
const iconFengshui = <svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="13" fill="none" stroke="var(--color-gold)" strokeWidth="1.2"/><circle cx="16" cy="16" r="9" fill="none" stroke="var(--color-gold)" strokeWidth="0.8" opacity="0.5"/><circle cx="16" cy="16" r="2" fill="var(--color-gold)" opacity="0.6"/><path d="M16 3L18 13H14L16 3Z" fill="var(--color-error)" opacity="0.7"/><path d="M16 29L14 19H18L16 29Z" fill="var(--color-text-secondary)" opacity="0.7"/><line x1="16" y1="3" x2="16" y2="7" stroke="var(--color-gold)" strokeWidth="0.8"/><line x1="16" y1="25" x2="16" y2="29" stroke="var(--color-gold)" strokeWidth="0.8"/></svg>;

/** ==================== 数据与类型 ==================== */

/** 工具卡片数据结构 */
interface ToolItem {
  name: string;
  path: string;
  desc: string;
  icon: JSX.Element;
}

/** 东方命理工具列表 — 使用自定义 SVG 图标 */
const EASTERN_TOOLS: ToolItem[] = [
  { name: '八字排盘', path: '/bazi', desc: '四柱八字五行分析，推算命理格局与运势走向', icon: iconBazi },
  { name: '紫微斗数', path: '/ziwei', desc: '紫微十二宫命盘，帝王级命理预测体系', icon: iconZiwei },
  { name: '六爻卦象', path: '/liuyao', desc: '周易古法断卦，通过爻象判断吉凶祸福', icon: iconLiuyao },
  { name: '梅花易数', path: '/meihua', desc: '先天心易占卜，以数起卦灵活便捷', icon: iconMeihua },
  { name: '奇门遁甲', path: '/qimen', desc: '帝王之术，综合时空推演趋吉避凶', icon: iconQimen },
  { name: '铁板神数', path: '/tieban', desc: '铁板神数推算命运，精准数字揭示人生密码', icon: iconTieban },
  { name: '大六壬', path: '/daliuren', desc: '大六壬神课，三式之首推演天机', icon: iconDaliuren },
  { name: '风水罗盘', path: '/fengshui', desc: '环境堪舆学，分析居住与办公风水', icon: iconFengshui },
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

/** 特色说明区数据 */
const FEATURES = [
  {
    icon: BookOpen,
    iconBg: 'rgba(200, 168, 78, 0.12)',
    iconColor: 'var(--color-gold)',
    title: '经典传承',
    desc: '所有算法源自中国传统经典文献，如《周易》《滴天髓》《紫微斗数全书》等，确保命理推演的权威性与准确性',
  },
  {
    icon: Sparkles,
    iconBg: 'rgba(0, 75, 170, 0.15)',
    iconColor: 'var(--color-primary-lighter)',
    title: 'AI 增强',
    desc: '结合现代 AI 技术，提供个性化深度解读，让古老的命理学以更通俗易懂的方式为你指点迷津',
  },
  {
    icon: Layers,
    iconBg: 'rgba(200, 168, 78, 0.12)',
    iconColor: 'var(--color-gold)',
    title: '多维分析',
    desc: '从性格、事业、感情、财运等全方位分析，多个维度交叉验证，为你呈现立体化的命理解读',
  },
];

/** ==================== 东方命理聚合页 ==================== */
export default function EasternPage() {
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
              传承千年智慧
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
            东方命理
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
            传承千年的中国古典命理学体系，从八字到紫微，从六爻到奇门，为你揭示命运的深层密码
          </p>
        </div>
      </section>

      {/* ====== 功能入口网格（3 列 x 2 行） ====== */}
      <section style={{ background: '#0a0e1a', padding: 'var(--space-16) 0 var(--space-24)' }}>
        <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 var(--space-6)' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {EASTERN_TOOLS.map((tool) => (
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
            为什么选择天机东方命理
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
