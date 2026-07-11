import { Link } from 'react-router-dom';
import {
  Sun, Eye, Moon, Heart,
  TrendingUp, Search,
  GitCompareArrows, Sparkles, FileText,
} from 'lucide-react';

/** ==================== 数据配置 ==================== */

/** 三大体系数据 */
const SYSTEMS = [
  {
    key: 'eastern',
    title: '东方命理',
    iconType: 'taiji' as const,
    tools: [
      { name: '八字排盘', path: '/bazi' },
      { name: '紫微斗数', path: '/ziwei' },
      { name: '六爻卦象', path: '/liuyao' },
      { name: '梅花易数', path: '/meihua' },
      { name: '奇门遁甲', path: '/qimen' },
      { name: '铁板神数', path: '/tieban' },
      { name: '大六壬', path: '/daliuren' },
      { name: '风水方位', path: '/fengshui' },
    ],
  },
  {
    key: 'western',
    title: '西方占卜',
    iconType: 'star-moon' as const,
    tools: [
      { name: '十二星座', path: '/zodiac' },
      { name: '塔罗牌', path: '/tarot' },
      { name: '数字能量', path: '/numerology' },
      { name: '占星骰子', path: '/astrodice' },
      { name: '月相占卜', path: '/moonphase' },
      { name: '符文占卜', path: '/rune' },
    ],
  },
  {
    key: 'folk',
    title: '民俗趣味',
    iconType: 'lantern' as const,
    tools: [
      { name: '周公解梦', path: '/dream' },
      { name: '求签解签', path: '/drawlot' },
      { name: '姓名测算', path: '/nametest' },
      { name: '黄历择日', path: '/almanac' },
      { name: '生肖运势', path: '/shengxiao' },
    ],
  },
];

/** 热门占卜数据 */
const HOT_ITEMS = [
  {
    title: '今日星座运势',
    desc: '每日为你更新十二星座的运势走向，涵盖爱情、事业、财运等维度',
    path: '/zodiac',
    icon: Sun,
    iconBg: 'rgba(0,75,170,0.15)',
    iconColor: 'var(--color-primary-lighter)',
  },
  {
    title: '塔罗牌每日一占',
    desc: '每日抽取一张塔罗牌，结合正逆位含义，获取当日指引与启示',
    path: '/tarot',
    icon: Eye,
    iconBg: 'rgba(200,168,78,0.12)',
    iconColor: 'var(--color-gold)',
  },
  {
    title: '周公解梦',
    desc: '输入梦境关键词，AI 智能解析梦境含义，古今梦境解读对照',
    path: '/dream',
    icon: Moon,
    iconBg: 'rgba(0,75,170,0.15)',
    iconColor: 'var(--color-primary-lighter)',
  },
  {
    title: '生肖本周运势',
    desc: '十二生肖本周综合运势，包含健康、感情、工作等全方位解读',
    path: '/shengxiao',
    icon: Heart,
    iconBg: 'rgba(200,168,78,0.12)',
    iconColor: 'var(--color-gold)',
  },
];

/** AI 洞察数据 */
const AI_ITEMS = [
  {
    title: '综合运势报告',
    desc: '融合多个占卜体系的结果，生成一份全面的综合运势分析报告',
    path: '/report',
    icon: FileText,
    iconBg: 'rgba(0, 75, 170, 0.2)',
    iconColor: 'var(--color-primary-lighter)',
  },
  {
    title: '趋势追踪',
    desc: '追踪你的运势变化趋势，提前预判未来走向与关键节点',
    path: '/trend',
    icon: TrendingUp,
    iconBg: 'rgba(200, 168, 78, 0.15)',
    iconColor: 'var(--color-gold)',
  },
  {
    title: '多维对比',
    desc: '横向对比不同体系间的解读差异，帮助全面理解命运信号',
    path: '/compare',
    icon: GitCompareArrows,
    iconBg: 'rgba(0, 75, 170, 0.2)',
    iconColor: 'var(--color-primary-lighter)',
  },
  {
    title: '个性化建议',
    desc: '基于你的个人命盘信息，定制专属的运势改善建议与行动指南',
    path: '/advice',
    icon: Sparkles,
    iconBg: 'rgba(200, 168, 78, 0.15)',
    iconColor: 'var(--color-gold)',
  },
];

/** 快捷搜索标签 */
const QUICK_TAGS = [
  { label: '今日运势', path: '/zodiac' },
  { label: '做梦了', path: '/dream' },
  { label: '塔罗牌', path: '/tarot' },
  { label: '算卦', path: '/liuyao' },
];

/** ==================== 子组件 ==================== */

/** 自定义 SVG 体系图标 */
function SystemIcon({ type }: { type: 'taiji' | 'star-moon' | 'lantern' }) {
  if (type === 'taiji') {
    // 太极阴阳图 — 东方命理
    return (
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="36" fill="none" stroke="var(--color-gold)" strokeWidth="2" opacity="0.8"/>
        <path d="M40 4A36 36 0 0 1 40 76A18 18 0 0 0 40 40A18 18 0 0 1 40 4" fill="var(--color-gold)" opacity="0.6"/>
        <circle cx="40" cy="22" r="6" fill="var(--color-primary-darker)"/>
        <circle cx="40" cy="58" r="6" fill="#0a0e1a"/>
      </svg>
    );
  }
  if (type === 'star-moon') {
    // 星月图 — 西方占卜
    return (
      <svg width="80" height="80" viewBox="0 0 80 80">
        <path d="M50 10A30 30 0 1 0 50 70A22 22 0 0 1 50 10Z" fill="var(--color-gold)" opacity="0.5" stroke="var(--color-gold)" strokeWidth="1.5"/>
        <polygon points="62,14 65,22 73,22 67,28 69,36 62,31 55,36 57,28 51,22 59,22" fill="var(--color-gold)" opacity="0.7"/>
      </svg>
    );
  }
  // 灯笼图 — 民俗趣味
  return (
    <svg width="80" height="80" viewBox="0 0 80 80">
      <line x1="40" y1="8" x2="40" y2="20" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round"/>
      <rect x="30" y="18" width="20" height="6" rx="2" fill="var(--color-gold)" opacity="0.7"/>
      <ellipse cx="40" cy="46" rx="16" ry="20" fill="none" stroke="var(--color-gold)" strokeWidth="2"/>
      <path d="M24 36Q24 46 40 46Q56 46 56 36" fill="var(--color-gold)" opacity="0.15" stroke="var(--color-gold)" strokeWidth="1"/>
      <line x1="40" y1="26" x2="40" y2="66" stroke="var(--color-gold)" strokeWidth="1" opacity="0.4"/>
      <rect x="30" y="64" width="20" height="4" rx="1.5" fill="var(--color-gold)" opacity="0.6"/>
      <line x1="34" y1="68" x2="34" y2="76" stroke="var(--color-gold)" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
      <line x1="40" y1="68" x2="40" y2="78" stroke="var(--color-gold)" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
      <line x1="46" y1="68" x2="46" y2="76" stroke="var(--color-gold)" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
    </svg>
  );
}

/** 三大体系卡片 */
function SystemCard({ system }: { system: typeof SYSTEMS[number] }) {
  return (
    <div className="glass-card flex flex-col items-center text-center">
      {/* 自定义 SVG 图标 */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <SystemIcon type={system.iconType} />
      </div>
      {/* 标题 */}
      <h3
        className="font-semibold mb-2"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.125rem',
          color: 'var(--color-gold)',
        }}
      >
        {system.title}
      </h3>
      {/* 工具列表 */}
      <div className="flex flex-col items-center gap-1 mt-2">
        {system.tools.map((tool) => (
          <Link key={tool.path} to={tool.path} className="tool-list-item">
            {tool.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

/** ==================== 首页主组件 ==================== */
export default function HomePage() {
  return (
    <div>
      {/* ========== 1. Hero 区域（全屏沉浸式） ========== */}
      <section
        className="relative flex flex-col items-center justify-center text-center overflow-hidden"
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #002060 0%, #0a0a2e 100%)',
          paddingTop: 'var(--navbar-height)',
        }}
      >
        {/* 星空粒子背景 */}
        <div className="starfield">
          <div className="layer-1" />
          <div className="layer-2" />
          <div className="layer-3" />
        </div>

        {/* 主内容 */}
        <div className="content-container relative z-10 flex flex-col items-center" style={{ paddingTop: '10vh' }}>
          {/* 主标题 */}
          <h1
            className="font-bold text-center"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(40px, 6vw, 88px)',
              color: '#ffffff',
              letterSpacing: '0.08em',
              lineHeight: 'var(--leading-tight)',
              marginBottom: 'var(--space-6)',
              textWrap: 'balance',
              wordBreak: 'keep-all',
              overflowWrap: 'break-word',
            }}
          >
            探索命运的密码
          </h1>

          {/* 副标题 */}
          <p
            className="text-center max-w-2xl"
            style={{
              fontSize: 'clamp(var(--text-base), 1.6vw, var(--text-lg))',
              color: 'var(--color-primary-lightest)',
              lineHeight: 'var(--leading-relaxed)',
              marginBottom: 'var(--space-10)',
            }}
          >
            AI 驱动的古今中外运势查询，17+ 占卜体系，为你揭示命运的每一个细节
          </p>

          {/* CTA 按钮组 */}
          <div className="flex flex-wrap items-center justify-center gap-4" style={{ marginBottom: 'var(--space-16)' }}>
            <Link to="/bazi" className="btn-gold">
              开始占卜
            </Link>
            <Link to="/zodiac" className="btn-outline-white">
              了解更多
            </Link>
          </div>
        </div>

        {/* 底部八卦旋转装饰 */}
        <div className="absolute bottom-12 left-1/2" style={{ transform: 'translateX(-50%)' }}>
          <div className="bagua-deco">
            <div className="ring" />
            <div className="ring-inner" />
            <div className="ring-core" />
            <div className="line line-h" />
            <div className="line line-v" />
            <div className="line line-d1" />
            <div className="line line-d2" />
          </div>
        </div>
      </section>

      {/* ========== 2. 三大体系导航区 ========== */}
      <section style={{ background: 'linear-gradient(180deg, #0a0a2e 0%, #0d1220 100%)', padding: 'var(--space-24) 0' }}>
        <div className="content-container">
          <h2 className="section-title text-center" style={{ marginBottom: 'var(--space-4)' }}>
            占卜体系
          </h2>
          <p
            className="section-subtitle text-center"
            style={{ maxWidth: 600, margin: '0 auto var(--space-16)' }}
          >
            涵盖东方、西方、民俗三大占卜传统，为你提供多维度的命运解读
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SYSTEMS.map((system) => (
              <SystemCard key={system.key} system={system} />
            ))}
          </div>
        </div>
      </section>

      {/* ========== 3. 热门占卜区 ========== */}
      <section style={{ background: '#0d1220', padding: 'var(--space-24) 0' }}>
        <div className="content-container">
          <h2 className="section-title text-center" style={{ marginBottom: 'var(--space-16)' }}>
            热门占卜
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOT_ITEMS.map((item) => {
              const IconComp = item.icon;
              return (
                <Link key={item.title} to={item.path} className="hot-card block no-underline">
                  <div className="flex items-center gap-3 mb-4 relative z-10">
                    <div
                      className="flex items-center justify-center"
                      style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: item.iconBg }}
                    >
                      <IconComp size={22} style={{ color: item.iconColor }} />
                    </div>
                    <h4
                      className="font-semibold truncate"
                      style={{ color: 'var(--color-text)', fontSize: 'var(--text-base)' }}
                    >
                      {item.title}
                    </h4>
                  </div>
                  <p
                    className="line-clamp-3 relative z-10"
                    style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)' }}
                  >
                    {item.desc}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== 4. AI 洞察区 ========== */}
      <section style={{ background: 'linear-gradient(180deg, #0d1220 0%, #0a0a2e 100%)', padding: 'var(--space-24) 0' }}>
        <div className="content-container">
          <div className="text-center mb-16">
            <h2 className="section-title" style={{ marginBottom: 'var(--space-4)' }}>
              AI 洞察：多维命运解读
            </h2>
            <p className="section-subtitle" style={{ maxWidth: 640, margin: '0 auto' }}>
              综合八字、塔罗、星座等多个体系，生成跨维度运势报告
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {AI_ITEMS.map((item) => {
              const IconComp = item.icon;
              return (
                <Link key={item.title} to={item.path} className="ai-card block no-underline">
                  <div
                    className="flex items-center justify-center mb-4 relative z-10"
                    style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: item.iconBg }}
                  >
                    <IconComp size={24} style={{ color: item.iconColor }} />
                  </div>
                  <h4
                    className="font-semibold mb-2 relative z-10"
                    style={{ color: 'var(--color-text)', fontSize: 'var(--text-base)' }}
                  >
                    {item.title}
                  </h4>
                  <p
                    className="line-clamp-3 relative z-10"
                    style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)' }}
                  >
                    {item.desc}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== 5. 搜索引导区 ========== */}
      <section style={{ background: '#0a0a2e', padding: 'var(--space-24) 0' }}>
        <div className="content-container flex flex-col items-center text-center">
          <h2 className="section-title" style={{ marginBottom: 'var(--space-4)' }}>
            想知道什么？
          </h2>
          <p className="section-subtitle mb-10" style={{ maxWidth: 480 }}>
            输入你的问题，AI 将从多个占卜体系中为你寻找答案
          </p>

          {/* 搜索框 */}
          <div className="relative w-full flex justify-center mb-6">
            <div className="relative inline-block w-full" style={{ maxWidth: 640 }}>
              <div
                className="absolute top-1/2 flex items-center"
                style={{ left: 20, transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1 }}
              >
                <Search size={20} style={{ color: 'var(--color-text-tertiary)' }} />
              </div>
              <input
                type="text"
                className="search-box w-full"
                placeholder="输入你想了解的，如'明天适合出差吗'..."
              />
            </div>
          </div>

          {/* 快捷标签 */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {QUICK_TAGS.map((tag) => (
              <Link key={tag.label} to={tag.path} className="quick-tag no-underline">
                {tag.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 6. 页脚 ========== */}
      <footer style={{ background: '#060a14', borderTop: '1px solid rgba(255,255,255,0.06)', padding: 'var(--space-12) 0 var(--space-8)' }}>
        <div className="content-container">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* 品牌信息 + 免责声明 */}
            <div style={{ maxWidth: '28rem' }}>
              <span
                className="font-semibold"
                style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', color: 'var(--color-gold)' }}
              >
                天机
              </span>
              <p style={{ marginTop: 'var(--space-2)', color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)', lineHeight: 'var(--leading-relaxed)' }}>
                免责声明：本工具所有占卜结果仅供娱乐参考，不构成任何决策建议。命运掌握在自己手中。
              </p>
            </div>
            {/* 链接 */}
            <div className="flex items-center gap-6">
              <a href="#" className="footer-link no-underline">关于我们</a>
              <a href="#" className="footer-link no-underline">使用条款</a>
              <a href="#" className="footer-link no-underline">隐私政策</a>
            </div>
          </div>
          {/* 版权 */}
          <div className="mt-8 pt-6 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-xs)' }}>
              &copy; 2026 天机 AI 运势查询工具. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
