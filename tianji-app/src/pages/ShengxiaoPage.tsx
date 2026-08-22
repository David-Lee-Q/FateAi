import { useState } from 'react';
import {
  Calendar,
  Palette,
  Hash,
  Compass,
  Users,
  BellRing,
  CalendarDays,
  Clock,
  MessageSquare,
} from 'lucide-react';
import {
  ZODIAC_FORTUNES,
  MONTH_META,
  getMonthlyFortune,
  CURRENT_MONTH_INDEX,
  CURRENT_MONTH_RANGE,
  MONTH_ADVICE,
} from '../data/zodiac2026';

/* ============================
   数据定义（页面级）
   ============================ */

/** 12 生肖数据（与设计稿一致） */
const SHENGXIAO_LIST = [
  { key: 'rat',    name: '鼠', emoji: '🐀', year: '2008' },
  { key: 'ox',     name: '牛', emoji: '🐂', year: '2009' },
  { key: 'tiger',  name: '虎', emoji: '🐅', year: '2010' },
  { key: 'rabbit', name: '兔', emoji: '🐇', year: '2011' },
  { key: 'dragon', name: '龙', emoji: '🐲', year: '2012' },
  { key: 'snake',  name: '蛇', emoji: '🐍', year: '2013' },
  { key: 'horse',  name: '马', emoji: '🐴', year: '2014' },
  { key: 'goat',   name: '羊', emoji: '🐏', year: '2015' },
  { key: 'monkey', name: '猴', emoji: '🐒', year: '2016' },
  { key: 'rooster',name: '鸡', emoji: '🐓', year: '2017' },
  { key: 'dog',    name: '狗', emoji: '🐕', year: '2018' },
  { key: 'pig',    name: '猪', emoji: '🐖', year: '2019' },
];

/** 时间范围 Tab 选项 */
const TIME_TABS = ['本年运势', '本月运势', '年度各月'];

/** 维度样式（各生肖共用，评分与描述由 zodiac2026 数据提供） */
const DIMENSION_STYLE = {
  career: { label: '事业运', gradient: 'linear-gradient(90deg, #4a90d9, #e8d48b)', iconBg: 'rgba(0, 75, 170, 0.1)', iconStroke: '#004baa' },
  love:   { label: '感情运', gradient: 'linear-gradient(90deg, #e88a8a, #c43a3a)', iconBg: 'rgba(196, 58, 58, 0.08)', iconStroke: '#c43a3a' },
  wealth: { label: '财运',   gradient: 'linear-gradient(90deg, #e8d48b, #9a7b2e)', iconBg: 'rgba(200, 168, 78, 0.12)', iconStroke: '#9a7b2e' },
  health: { label: '健康运', gradient: 'linear-gradient(90deg, #6dd5a0, #1a8a5c)', iconBg: 'rgba(26, 138, 92, 0.08)', iconStroke: '#1a8a5c' },
} as const;

const DIMENSION_KEYS = Object.keys(DIMENSION_STYLE) as (keyof typeof DIMENSION_STYLE)[];

/** 太岁标签样式（key 对应 zodiac2026 中的 tags） */
const TAISUI_TAG_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  zhi:  { color: '#1a8a5c', bg: 'rgba(26,138,92,0.1)',  border: 'rgba(26,138,92,0.2)' },
  chong: { color: '#c43a3a', bg: 'rgba(196,58,58,0.1)',  border: 'rgba(196,58,58,0.2)' },
  hai:  { color: '#c87a1a', bg: 'rgba(200,122,26,0.1)',  border: 'rgba(200,122,26,0.2)' },
  xing: { color: '#8a50a0', bg: 'rgba(138,80,160,0.1)',  border: 'rgba(138,80,160,0.2)' },
  po:   { color: '#b0568c', bg: 'rgba(176,86,140,0.1)',  border: 'rgba(176,86,140,0.2)' },
  he:   { color: '#004baa', bg: 'rgba(0,75,170,0.1)',    border: 'rgba(0,75,170,0.2)' },
  liu:  { color: '#2a9d8f', bg: 'rgba(42,157,143,0.1)',  border: 'rgba(42,157,143,0.2)' },
  jing: { color: '#b45309', bg: 'rgba(180,83,9,0.1)',    border: 'rgba(180,83,9,0.2)' },
};

/** 吉凶色点颜色映射 */
const FORTUNE_COLORS: Record<string, { bg: string; shadow: string; text: string }> = {
  ji:    { bg: '#1a8a5c', shadow: 'rgba(26,138,92,0.4)',  text: '#1a8a5c' },
  zhong: { bg: '#c87a1a', shadow: 'rgba(200,122,26,0.4)', text: '#c87a1a' },
  xiong: { bg: '#c43a3a', shadow: 'rgba(196,58,58,0.4)',  text: '#c43a3a' },
};

const FORTUNE_LABEL: Record<string, string> = {
  ji: '吉',
  zhong: '中',
  xiong: '凶',
};

/** 方位角（地图方位，0=正北，顺时针） */
const DIRECTION_ANGLES: Record<string, number> = {
  正北: 0, 北偏西北: 337.5, 西北偏西: 315, 正西: 270,
  西南偏南: 225, 西南偏西: 202.5, 正南: 180, 东南偏南: 135,
  东南: 112.5, 正东: 90, 东北: 45, 东北偏北: 22.5,
};

/** 方位罗盘 */
function DirectionCompass({ direction, color }: { direction: string; color: string }) {
  const angle = DIRECTION_ANGLES[direction] ?? 0;
  const rad = (angle * Math.PI) / 180;
  const x2 = 28 + 17 * Math.sin(rad);
  const y2 = 28 - 17 * Math.cos(rad);
  const lx = 28 + 20 * Math.sin(rad);
  const ly = 28 - 20 * Math.cos(rad);
  return (
    <svg width={56} height={56} viewBox="0 0 56 56" fill="none">
      <circle cx={28} cy={28} r={24} stroke={'#1e2740'} strokeWidth={1.5} />
      <circle cx={28} cy={28} r={2} fill={color} />
      <path d="M28 8v40M8 28h40" stroke={'rgba(30,39,64,0.8)'} strokeWidth={0.5} />
      <path d={`M28 28L${x2.toFixed(1)} ${y2.toFixed(1)}`} stroke={color} strokeWidth={2} strokeLinecap="round" />
      <text x={lx.toFixed(1)} y={ly.toFixed(1)} fontSize={7} fill={color} fontFamily="var(--font-body)" textAnchor="middle" dominantBaseline="middle">
        {direction}
      </text>
    </svg>
  );
}

/** 推荐工具 */
const RECOMMEND_TOOLS = [
  {
    label: '周公解梦',
    desc: '梦境含义查询，AI 智能解析',
    gradient: 'linear-gradient(135deg, rgba(149,117,205,0.12), rgba(149,117,205,0.04))',
    iconColor: '#7e57c2',
  },
  {
    label: '签诗抽签',
    desc: '灵签占卜，获取神明指引',
    gradient: 'linear-gradient(135deg, rgba(200,168,78,0.15), rgba(200,168,78,0.04))',
    iconColor: '#9a7b2e',
  },
  {
    label: '姓名测算',
    desc: '姓名五格分析，命理解读',
    gradient: 'linear-gradient(135deg, rgba(0,75,170,0.12), rgba(0,75,170,0.03))',
    iconColor: '#004baa',
  },
];

/* ============================
   主组件
   ============================ */
export default function ShengxiaoPage() {
  const [selectedZodiac, setSelectedZodiac] = useState<string>('horse');
  const [activeTab, setActiveTab] = useState<number>(0);

  /** 当前选中的生肖对象 */
  const currentZodiac = SHENGXIAO_LIST.find((z) => z.key === selectedZodiac);
  /** 当前生肖的 2026 丙午年运势数据 */
  const f = ZODIAC_FORTUNES[selectedZodiac] ?? ZODIAC_FORTUNES.horse;

  /** 按生肖推算的 12 个月吉凶 */
  const monthlyFortunes = MONTH_META.map((m, i) => ({
    ...m,
    ...getMonthlyFortune(f.branch, m.branch),
    isCurrent: i === CURRENT_MONTH_INDEX,
  }));

  /** 本月（农历七月·申月）运势 */
  const currentMonthMeta = MONTH_META[CURRENT_MONTH_INDEX];
  const currentMonth = getMonthlyFortune(f.branch, currentMonthMeta.branch);

  /** 吉月 / 凶月汇总 */
  const jiMonths = monthlyFortunes.filter((m) => m.fortune === 'ji');
  const xiongMonths = monthlyFortunes.filter((m) => m.fortune === 'xiong');

  /** Tab 可见性 */
  const inTab = (tabs: number[]) => tabs.includes(activeTab);

  const monthFortuneColor = FORTUNE_COLORS[currentMonth.fortune];

  return (
    <div style={{ background: '#0a0e1a', color: '#e8ecf4', fontFamily: 'var(--font-body)' }}>
      {/* ========== 标题区（浅色渐变背景 + 祥云纹装饰） ========== */}
      <section className="relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${'#0a0e1a'}, ${'#111827'})` }}>
        {/* 祥云纹 SVG 装饰 */}
        <svg className="absolute top-0 right-0 pointer-events-none" width={300} height={300} viewBox="0 0 300 300" fill="none" style={{ opacity: 0.06 }}>
          <circle cx={200} cy={80} r={120} stroke={'#004baa'} strokeWidth={0.5} />
          <circle cx={200} cy={80} r={80} stroke={'#004baa'} strokeWidth={0.5} />
          <circle cx={200} cy={80} r={40} stroke={'#c8a84e'} strokeWidth={0.8} />
          <path d="M100 200 Q150 180 200 200 Q250 220 280 180" stroke={'#c8a84e'} strokeWidth={0.5} fill="none" />
          <path d="M60 240 Q120 210 180 240 Q240 270 300 230" stroke={'rgba(0,75,170,0.15)'} strokeWidth={0.5} fill="none" />
        </svg>

        <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6" style={{ maxWidth: 1280 }}>
          {/* 标题 + 年份 */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1
                className="font-bold tracking-tight"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: '#e8ecf4',
                  fontSize: 'clamp(2rem, 5vw, 3.25rem)',
                  textWrap: 'balance',
                  wordBreak: 'keep-all',
                  overflowWrap: 'break-word',
                }}
              >
                生肖运势
              </h1>
              <p className="mt-2 text-base sm:text-lg" style={{ color: '#a0aac0', lineHeight: 1.6 }}>
                十二生肖年度运势，流年太岁吉凶分析
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm shrink-0" style={{ color: '#7a8599' }}>
              <Calendar size={16} />
              <span>2026 丙午年</span>
            </div>
          </div>
        </div>

        {/* 渐变分割线 */}
        <div
          style={{
            height: 1,
            background: `linear-gradient(90deg, transparent, ${'rgba(0,75,170,0.15)'}, ${'rgba(200,168,78,0.8)'}, ${'rgba(0,75,170,0.15)'}, transparent)`,
            opacity: 0.3,
          }}
        />
      </section>

      {/* ========== 生肖选择区（4x3 网格） ========== */}
      <section style={{ background: '#111827' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10" style={{ maxWidth: 1280 }}>
          <h2 className="text-lg font-semibold mb-6" style={{ color: '#e8ecf4' }}>
            <span style={{ color: '#c8a84e' }}>|</span> 选择你的生肖
          </h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-3">
            {SHENGXIAO_LIST.map((zodiac) => {
              const isActive = selectedZodiac === zodiac.key;
              return (
                <div
                  key={zodiac.key}
                  onClick={() => setSelectedZodiac(zodiac.key)}
                  className="flex flex-col items-center gap-2 cursor-pointer rounded-2xl transition-all"
                  style={{
                    padding: '16px 8px',
                    border: `2px solid ${isActive ? '#c8a84e' : 'rgba(30,39,64,0.8)'}`,
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(200,168,78,0.08), rgba(200,168,78,0.03))'
                      : '#111827',
                    boxShadow: isActive ? '0 4px 20px rgba(200,168,78,0.25)' : 'none',
                    transition: 'all 250ms ease',
                  }}
                >
                  <span style={{ fontSize: 36, lineHeight: 1, transition: 'transform 250ms ease', transform: isActive ? 'scale(1.1)' : 'none' }}>
                    {zodiac.emoji}
                  </span>
                  <span
                    className="text-sm truncate"
                    style={{
                      color: isActive ? '#a08630' : '#a0aac0',
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    {zodiac.name}
                  </span>
                  <span className="text-xs truncate" style={{ color: '#7a8599' }}>
                    {zodiac.year}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== 时间范围切换 Tab ========== */}
      <section style={{ background: '#0a0e1a' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6" style={{ maxWidth: 1280 }}>
          <div className="flex items-center gap-3">
            {TIME_TABS.map((tab, idx) => (
              <div
                key={tab}
                onClick={() => setActiveTab(idx)}
                className="transition-all cursor-pointer"
                style={{
                  padding: '8px 20px',
                  fontSize: '0.875rem',
                  borderRadius: 12,
                  border: '1px solid transparent',
                  background: activeTab === idx ? '#004baa' : 'transparent',
                  color: activeTab === idx ? '#0a0e1a' : '#a0aac0',
                  whiteSpace: 'nowrap',
                  transition: 'all 250ms ease',
                }}
              >
                {tab}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== 流年太岁关系区（Tab: 本年运势） ========== */}
      {inTab([0]) && (
        <section style={{ background: '#0a0e1a' }}>
          <div className="mx-auto px-4 sm:px-6 lg:px-8 pb-8" style={{ maxWidth: 1280 }}>
            <div className="p-6 rounded-2xl" style={{ background: '#111827', border: `1px solid ${'rgba(30,39,64,0.8)'}` }}>
              {/* 标题行 */}
              <div className="flex items-center gap-2 mb-4">
                <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
                  <circle cx={10} cy={10} r={8} stroke={'#c8a84e'} strokeWidth={1.5} />
                  <path d="M10 4v6l3 3" stroke={'#c8a84e'} strokeWidth={1.5} strokeLinecap="round" />
                </svg>
                <h3 className="text-base font-semibold" style={{ color: '#e8ecf4' }}>
                  {currentZodiac?.name} · 2026 丙午年太岁关系
                </h3>
              </div>

              {/* 描述 */}
              <p className="text-sm mb-4" style={{ color: '#a0aac0', lineHeight: 1.75 }}>
                {f.taisuiDesc}
              </p>

              {/* 太岁标签 */}
              <div className="flex flex-wrap items-center gap-3">
                {f.tags.map((tag) => {
                  const ts = TAISUI_TAG_STYLES[tag.key] ?? TAISUI_TAG_STYLES.liu;
                  return (
                    <span
                      key={tag.label}
                      className="inline-flex items-center gap-1 shrink-0"
                      style={{
                        padding: '6px 16px',
                        borderRadius: 12,
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        background: ts.bg,
                        color: ts.color,
                        border: `1px solid ${ts.border}`,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {tag.label}
                    </span>
                  );
                })}
                <span className="text-xs" style={{ color: '#7a8599' }}>
                  年度关键词 · {f.keywords}
                </span>
              </div>

              {/* 关系说明 */}
              <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(0,75,170,0.1)' }}>
                <div className="flex items-start gap-3">
                  <svg width={16} height={16} viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5">
                    <circle cx={8} cy={8} r={7} stroke={'#004baa'} strokeWidth={1.2} />
                    <path d="M8 5v4M8 11v0" stroke={'#004baa'} strokeWidth={1.5} strokeLinecap="round" />
                  </svg>
                  <p className="text-sm" style={{ color: '#a0aac0', lineHeight: 1.75 }}>
                    <strong style={{ color: '#7ab8ff' }}>{f.taisuiDetail.split('：')[0]}</strong>
                    ：{f.taisuiDetail.split('：').slice(1).join('：')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========== 综合运势评分（4 维度卡片，Tab: 本年运势） ========== */}
      {inTab([0]) && (
        <section style={{ background: '#0a0e1a' }}>
          <div className="mx-auto px-4 sm:px-6 lg:px-8 pb-8" style={{ maxWidth: 1280 }}>
            <h2 className="text-lg font-semibold mb-6" style={{ color: '#e8ecf4' }}>
              <span style={{ color: '#c8a84e' }}>|</span> 综合运势评分
              <span className="ml-3 text-sm font-medium" style={{ color: '#c8a84e' }}>
                综合 {f.overall} 分
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {DIMENSION_KEYS.map((dimKey) => {
                const dimStyle = DIMENSION_STYLE[dimKey];
                const dim = f.dims[dimKey];
                return (
                  <div
                    key={dimKey}
                    className="rounded-2xl transition-all"
                    style={{
                      background: '#111827',
                      border: `1px solid ${'rgba(30,39,64,0.8)'}`,
                      padding: 24,
                      transition: 'all 250ms ease',
                    }}
                  >
                    {/* 维度标题 + 分数 */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ background: dimStyle.iconBg }}
                        >
                          {/* 事业运图标 */}
                          {dimKey === 'career' && (
                            <svg width={18} height={18} viewBox="0 0 18 18" fill="none">
                              <rect x={3} y={7} width={12} height={8} rx={1.5} stroke={dimStyle.iconStroke} strokeWidth={1.3} />
                              <path d="M6 7V5a3 3 0 016 0v2" stroke={dimStyle.iconStroke} strokeWidth={1.3} strokeLinecap="round" />
                              <path d="M9 10v2" stroke={dimStyle.iconStroke} strokeWidth={1.3} strokeLinecap="round" />
                            </svg>
                          )}
                          {/* 感情运图标 */}
                          {dimKey === 'love' && (
                            <svg width={18} height={18} viewBox="0 0 18 18" fill="none">
                              <path d="M9 15s-5.5-3.5-5.5-7.5a3.5 3.5 0 017 0 3.5 3.5 0 017 0C17.5 11.5 9 15 9 15z" stroke={dimStyle.iconStroke} strokeWidth={1.3} />
                            </svg>
                          )}
                          {/* 财运图标 */}
                          {dimKey === 'wealth' && (
                            <svg width={18} height={18} viewBox="0 0 18 18" fill="none">
                              <circle cx={9} cy={9} r={6.5} stroke={dimStyle.iconStroke} strokeWidth={1.3} />
                              <path d="M9 5v8M7 7l2-2 2 2" stroke={dimStyle.iconStroke} strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                          {/* 健康运图标 */}
                          {dimKey === 'health' && (
                            <svg width={18} height={18} viewBox="0 0 18 18" fill="none">
                              <path d="M9 3v4M5 7l4-4 4 4" stroke={dimStyle.iconStroke} strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M5 11l4 4 4-4" stroke={dimStyle.iconStroke} strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <span className="font-medium text-sm" style={{ color: '#e8ecf4' }}>{dimStyle.label}</span>
                      </div>
                      <span className="text-lg font-bold" style={{ color: '#a08630' }}>{dim.score}</span>
                    </div>

                    {/* 进度条 */}
                    <div style={{ width: '100%', height: 6, borderRadius: 3, background: 'rgba(0,0,0,0.2)', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          borderRadius: 3,
                          width: `${dim.score}%`,
                          background: dimStyle.gradient,
                          transition: 'width 0.6s ease',
                        }}
                      />
                    </div>

                    {/* 描述文字 */}
                    <p
                      className="mt-3 text-sm"
                      style={{
                        color: '#a0aac0',
                        lineHeight: 1.75,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {dim.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ========== 本月运势（Tab: 本月运势） ========== */}
      {inTab([1]) && (
        <section style={{ background: '#0a0e1a' }}>
          <div className="mx-auto px-4 sm:px-6 lg:px-8 pb-8" style={{ maxWidth: 1280 }}>
            <h2 className="text-lg font-semibold mb-6" style={{ color: '#e8ecf4' }}>
              <span style={{ color: '#c8a84e' }}>|</span> 本月运势
            </h2>
            <div className="p-6 rounded-2xl" style={{ background: '#111827', border: `1px solid ${'rgba(30,39,64,0.8)'}` }}>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm" style={{ color: '#a0aac0' }}>
                  <CalendarDays size={16} style={{ color: '#004baa' }} />
                  <span>{CURRENT_MONTH_RANGE} · 农历{currentMonthMeta.lunar}（申月）</span>
                </div>
                <span
                  className="inline-flex items-center gap-1.5 shrink-0"
                  style={{
                    padding: '6px 16px',
                    borderRadius: 12,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    background: monthFortuneColor.bg,
                    color: '#fff',
                  }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />
                  {currentMonthMeta.lunar} · {FORTUNE_LABEL[currentMonth.fortune]}月
                </span>
              </div>
              <p className="text-sm mb-4" style={{ color: '#a0aac0', lineHeight: 1.75 }}>
                {currentMonth.reason}
              </p>
              <div className="p-4 rounded-xl" style={{ background: 'rgba(0,75,170,0.1)' }}>
                <p className="text-sm" style={{ color: '#a0aac0', lineHeight: 1.75 }}>
                  <strong style={{ color: '#7ab8ff' }}>本月建议</strong>
                  ：{MONTH_ADVICE[currentMonth.fortune]}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========== 每月运势一览（Tab: 本月运势 / 年度各月） ========== */}
      {inTab([1, 2]) && (
        <section style={{ background: '#111827' }}>
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ maxWidth: 1280 }}>
            <h2 className="text-lg font-semibold mb-6" style={{ color: '#e8ecf4' }}>
              <span style={{ color: '#c8a84e' }}>|</span> 每月运势一览
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
              {monthlyFortunes.map((m) => {
                const fc = FORTUNE_COLORS[m.fortune];
                const isCurrent = m.isCurrent;
                return (
                  <div
                    key={m.month}
                    title={m.reason}
                    className="flex flex-col items-center gap-2 shrink-0 cursor-pointer transition-all"
                    style={{
                      padding: '12px 14px',
                      borderRadius: 12,
                      background: isCurrent ? 'rgba(200,168,78,0.08)' : '#111827',
                      border: `1px solid ${isCurrent ? 'rgba(200,168,78,0.5)' : 'rgba(30,39,64,0.8)'}`,
                      minWidth: 80,
                      transition: 'all 150ms ease',
                    }}
                  >
                    <span className="text-xs font-medium" style={{ color: '#7a8599' }}>
                      {m.month}{isCurrent ? ' · 本月' : ''}
                    </span>
                    <span className="text-lg font-bold" style={{ color: '#e8ecf4' }}>{m.lunar}</span>
                    {/* 吉凶色点 */}
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: fc.bg,
                        boxShadow: `0 0 6px ${fc.shadow}`,
                        flexShrink: 0,
                      }}
                    />
                    <span className="text-xs" style={{ color: fc.text }}>{FORTUNE_LABEL[m.fortune]}</span>
                  </div>
                );
              })}
            </div>
            {/* 图例 */}
            <div className="flex items-center gap-6 mt-4 text-xs" style={{ color: '#7a8599' }}>
              <span className="flex items-center gap-1.5">
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: FORTUNE_COLORS.ji.bg, boxShadow: `0 0 6px ${FORTUNE_COLORS.ji.shadow}` }} />
                吉月
              </span>
              <span className="flex items-center gap-1.5">
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: FORTUNE_COLORS.zhong.bg, boxShadow: `0 0 6px ${FORTUNE_COLORS.zhong.shadow}` }} />
                平月
              </span>
              <span className="flex items-center gap-1.5">
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: FORTUNE_COLORS.xiong.bg, boxShadow: `0 0 6px ${FORTUNE_COLORS.xiong.shadow}` }} />
                凶月
              </span>
            </div>
          </div>
        </section>
      )}

      {/* ========== 重点月份提醒（Tab: 年度各月） ========== */}
      {inTab([2]) && (
        <section style={{ background: '#111827' }}>
          <div className="mx-auto px-4 sm:px-6 lg:px-8 pb-8" style={{ maxWidth: 1280 }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl" style={{ background: '#0a0e1a', border: `1px solid ${'rgba(30,39,64,0.8)'}` }}>
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: FORTUNE_COLORS.ji.bg, boxShadow: `0 0 6px ${FORTUNE_COLORS.ji.shadow}` }} />
                  <span className="text-sm font-medium" style={{ color: '#e8ecf4' }}>吉月汇总</span>
                </div>
                <p className="text-sm" style={{ color: '#a0aac0', lineHeight: 1.75 }}>
                  {jiMonths.length > 0
                    ? `${jiMonths.map((m) => m.lunar).join('、')}（${jiMonths.map((m) => m.month).join('、')}）运势上佳，利推进事业、合作、投资与搬迁等大事，宜主动布局。`
                    : '今年无明显吉月，以平稳心态按部就班即可。'}
                </p>
              </div>
              <div className="p-5 rounded-xl" style={{ background: '#0a0e1a', border: `1px solid ${'rgba(30,39,64,0.8)'}` }}>
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: FORTUNE_COLORS.xiong.bg, boxShadow: `0 0 6px ${FORTUNE_COLORS.xiong.shadow}` }} />
                  <span className="text-sm font-medium" style={{ color: '#e8ecf4' }}>凶月汇总</span>
                </div>
                <p className="text-sm" style={{ color: '#a0aac0', lineHeight: 1.75 }}>
                  {xiongMonths.length > 0
                    ? `${xiongMonths.map((m) => m.lunar).join('、')}（${xiongMonths.map((m) => m.month).join('、')}）运势偏低，宜守不宜攻，大事宜缓，谨防破财与口舌是非。`
                    : '今年无明显凶月，可从容安排全年事务。'}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========== 开运指南（幸运颜色/数字/方位/贵人方向） ========== */}
      <section style={{ background: '#0a0e1a' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ maxWidth: 1280 }}>
          <h2 className="text-lg font-semibold mb-6" style={{ color: '#e8ecf4' }}>
            <span style={{ color: '#c8a84e' }}>|</span> 开运指南
            <span className="ml-3 text-sm font-medium" style={{ color: '#7a8599' }}>{currentZodiac?.name} · 2026 开运参考</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* 幸运颜色 */}
            <div className="p-5 rounded-xl" style={{ background: '#111827', border: `1px solid ${'rgba(30,39,64,0.8)'}` }}>
              <div className="flex items-center gap-2 mb-3">
                <Palette size={16} style={{ color: '#004baa' }} />
                <span className="text-sm font-medium" style={{ color: '#e8ecf4' }}>幸运颜色</span>
              </div>
              <div className="flex gap-2 mb-2">
                {f.luckyColors.map((c) => (
                  <div
                    key={c.hex}
                    style={{ width: 48, height: 48, borderRadius: 12, border: `2px solid ${'rgba(30,39,64,0.8)'}`, background: c.hex, flexShrink: 0 }}
                  />
                ))}
              </div>
              <p className="text-xs" style={{ color: '#7a8599' }}>{f.luckyColors.map((c) => c.name).join('、')}</p>
            </div>

            {/* 幸运数字 */}
            <div className="p-5 rounded-xl" style={{ background: '#111827', border: `1px solid ${'rgba(30,39,64,0.8)'}` }}>
              <div className="flex items-center gap-2 mb-3">
                <Hash size={16} style={{ color: '#004baa' }} />
                <span className="text-sm font-medium" style={{ color: '#e8ecf4' }}>幸运数字</span>
              </div>
              <div className="flex gap-3">
                {f.luckyNumbers.map((n) => (
                  <span key={n} className="font-bold" style={{ fontFamily: 'var(--font-display)', fontSize: '1.875rem', color: '#c8a84e' }}>
                    {n}
                  </span>
                ))}
              </div>
            </div>

            {/* 幸运方位 */}
            <div className="p-5 rounded-xl" style={{ background: '#111827', border: `1px solid ${'rgba(30,39,64,0.8)'}` }}>
              <div className="flex items-center gap-2 mb-3">
                <Compass size={16} style={{ color: '#004baa' }} />
                <span className="text-sm font-medium" style={{ color: '#e8ecf4' }}>幸运方位</span>
              </div>
              <DirectionCompass direction={f.luckyDirection} color="#c8a84e" />
            </div>

            {/* 贵人方向 */}
            <div className="p-5 rounded-xl" style={{ background: '#111827', border: `1px solid ${'rgba(30,39,64,0.8)'}` }}>
              <div className="flex items-center gap-2 mb-3">
                <Users size={16} style={{ color: '#004baa' }} />
                <span className="text-sm font-medium" style={{ color: '#e8ecf4' }}>贵人方向</span>
              </div>
              <DirectionCompass direction={f.nobleDirection} color="#004baa" />
            </div>
          </div>
        </div>
      </section>

      {/* ========== AI 深度分析 + 月度推送设置（Tab: 本年运势） ========== */}
      {inTab([0]) && (
        <section style={{ background: '#111827' }}>
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ maxWidth: 1280 }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* AI 深度分析（渐变边框卡片） */}
              <div className="lg:col-span-2 relative rounded-2xl p-6 lg:p-8" style={{ background: 'linear-gradient(135deg, rgba(0,75,170,0.03), rgba(200,168,78,0.05))', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)' }}>
                {/* 渐变边框伪元素用内联 div 模拟 */}
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    padding: 1,
                    background: `linear-gradient(135deg, ${'rgba(0,75,170,0.15)'}, ${'#c8a84e'})`,
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                  }}
                />

                {/* 标题行 */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${'#004baa'}, #003580)` }}
                  >
                    <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
                      <path d="M10 2a5 5 0 015 5c0 2-1 3-2 4v3a1 1 0 01-1 1H8a1 1 0 01-1-1v-3C6 10 5 9 5 7a5 5 0 015-5z" stroke="white" strokeWidth={1.2} />
                      <path d="M8 16h4" stroke="white" strokeWidth={1.2} strokeLinecap="round" />
                      <circle cx={10} cy={7} r={1.5} fill="#e8d48b" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ color: '#e8ecf4' }}>AI 深度运势分析</h3>
                    <p className="text-xs" style={{ color: '#7a8599' }}>基于传统命理与现代 AI 算法综合推演 · {currentZodiac?.name}</p>
                  </div>
                </div>

                {/* AI 分析内容 */}
                <div className="space-y-4 text-sm" style={{ color: '#a0aac0', lineHeight: 1.75 }}>
                  {f.aiAnalysis.map((p) => (
                    <p key={p.lead}>
                      <strong style={{ color: '#e8ecf4' }}>{p.lead}</strong>
                      {p.text}
                    </p>
                  ))}
                </div>

                {/* CTA 按钮 */}
                <button
                  className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer"
                  style={{
                    background: '#004baa',
                    color: '#0a0e1a',
                    border: 'none',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                    <path d="M8 2a4 4 0 014 4v2a4 4 0 01-8 0V6a4 4 0 014-4z" stroke="white" strokeWidth={1.2} />
                    <path d="M4 8c-2 1-3 3-3 5h14c0-2-1-4-3-5" stroke="white" strokeWidth={1.2} strokeLinecap="round" />
                  </svg>
                  获取完整年度运势报告
                </button>
              </div>

              {/* 月度推送设置 */}
              <div className="p-6 rounded-xl" style={{ background: '#0a0e1a', border: `1px solid ${'rgba(30,39,64,0.8)'}` }}>
                <div className="flex items-center gap-2 mb-5">
                  <BellRing size={20} style={{ color: '#c8a84e' }} />
                  <h3 className="font-semibold text-sm" style={{ color: '#e8ecf4' }}>月度运势推送</h3>
                </div>
                <p
                  className="text-sm mb-5"
                  style={{
                    color: '#a0aac0',
                    lineHeight: 1.75,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  开启后，每月初一准时推送您的专属月度运势分析，包含详细吉凶提醒与开运建议。
                </p>

                {/* 推送设置列表 */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: '#111827' }}>
                    <div className="flex items-center gap-2">
                      <CalendarDays size={16} style={{ color: '#004baa' }} />
                      <span className="text-sm" style={{ color: '#e8ecf4' }}>推送频率</span>
                    </div>
                    <span className="text-sm" style={{ color: '#a0aac0' }}>每月1次</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: '#111827' }}>
                    <div className="flex items-center gap-2">
                      <Clock size={16} style={{ color: '#004baa' }} />
                      <span className="text-sm" style={{ color: '#e8ecf4' }}>推送时间</span>
                    </div>
                    <span className="text-sm" style={{ color: '#a0aac0' }}>08:00</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: '#111827' }}>
                    <div className="flex items-center gap-2">
                      <MessageSquare size={16} style={{ color: '#004baa' }} />
                      <span className="text-sm" style={{ color: '#e8ecf4' }}>推送渠道</span>
                    </div>
                    <span className="text-sm" style={{ color: '#a0aac0' }}>微信通知</span>
                  </div>
                </div>

                <button
                  className="w-full py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer"
                  style={{
                    background: '#c8a84e',
                    color: '#0a0e1a',
                    border: 'none',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  开启月度推送
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========== 相关推荐 ========== */}
      <section style={{ background: '#0a0e1a' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ maxWidth: 1280 }}>
          <h2 className="text-lg font-semibold mb-6" style={{ color: '#e8ecf4' }}>
            <span style={{ color: '#c8a84e' }}>|</span> 相关推荐
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {RECOMMEND_TOOLS.map((tool) => (
              <div
                key={tool.label}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl cursor-pointer transition-all text-center"
                style={{
                  background: '#111827',
                  border: `1px solid ${'rgba(30,39,64,0.8)'}`,
                  transition: 'all 250ms ease',
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: tool.gradient }}
                >
                  {/* 周公解梦图标 */}
                  {tool.label === '周公解梦' && (
                    <svg width={28} height={28} viewBox="0 0 28 28" fill="none">
                      <circle cx={14} cy={12} r={8} stroke={tool.iconColor} strokeWidth={1.5} />
                      <path d="M14 8v4l3 2" stroke={tool.iconColor} strokeWidth={1.5} strokeLinecap="round" />
                      <path d="M8 22l2-4h8l2 4" stroke={tool.iconColor} strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {/* 签诗抽签图标 */}
                  {tool.label === '签诗抽签' && (
                    <svg width={28} height={28} viewBox="0 0 28 28" fill="none">
                      <rect x={9} y={4} width={10} height={20} rx={1.5} stroke={tool.iconColor} strokeWidth={1.3} />
                      <path d="M12 9h4M12 12h4M12 15h4M12 18h3" stroke={tool.iconColor} strokeWidth={0.8} strokeLinecap="round" />
                      <circle cx={14} cy={22} r={1} fill={'#c8a84e'} />
                    </svg>
                  )}
                  {/* 姓名测算图标 */}
                  {tool.label === '姓名测算' && (
                    <svg width={28} height={28} viewBox="0 0 28 28" fill="none">
                      <rect x={6} y={8} width={16} height={14} rx={2} stroke={tool.iconColor} strokeWidth={1.3} />
                      <path d="M10 8V5a4 4 0 018 0v3" stroke={tool.iconColor} strokeWidth={1.3} strokeLinecap="round" />
                      <path d="M11 15h6M14 12v6" stroke={tool.iconColor} strokeWidth={1} strokeLinecap="round" />
                    </svg>
                  )}
                </div>
                <span className="font-medium text-sm" style={{ color: '#e8ecf4' }}>{tool.label}</span>
                <span
                  className="text-xs"
                  style={{
                    color: '#7a8599',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {tool.desc}
                </span>
              </div>
            ))}
          </div>

          {/* 数据来源脚注 */}
          <p className="mt-6 text-xs" style={{ color: '#5a6478', lineHeight: 1.6 }}>
            太岁关系与年度运势参考 2026 丙午马年公开运势资料（多源交叉），开运信息按传统五行、河图数理与天乙贵人推演，月度吉凶按月建地支刑冲合害推算。内容仅供娱乐参考。
          </p>
        </div>
      </section>
    </div>
  );
}
