import { useState } from 'react';
import {
  Briefcase, Heart, Coins, Sparkles, Settings2,
  Layers, CircleDot, Sunset, Star,
  GitCompareArrows, CheckCircle2, AlertTriangle,
  Download, Bookmark, Share2, CalendarRange,
  Wrench, Compass,
} from 'lucide-react';

/* ============================================
   浅色主题变量覆盖（内联，不依赖全局 dark 主题）
   ============================================ */
const LIGHT: Record<string, string> = {
  '--color-bg': '#0a0e1a',
  '--color-bg-elevated': '#111827',
  '--color-bg-inset': '#0d1220',
  '--color-text': '#e8ecf4',
  '--color-text-secondary': '#a0aac0',
  '--color-text-tertiary': '#6b7590',
  '--color-text-inverse': '#111827',
  '--color-border': '#1e2740',
  '--color-border-light': '#161e35',
  '--color-primary': '#004baa',
  '--color-primary-light': '#1a6fd4',
  '--color-primary-lighter': '#4a90d9',
  '--color-primary-dark': '#003580',
  '--color-primary-darker': '#002060',
  '--color-primary-bg': 'rgba(0,75,170,0.06)',
  '--color-primary-bg-strong': 'rgba(0,75,170,0.12)',
  '--color-gold': '#c8a84e',
  '--color-gold-light': '#e8d48b',
  '--color-gold-dark': '#9a7b2e',
  '--state-success': '#1a8a5c',
  '--state-warning': '#c87a1a',
  '--shadow-sm': '0 1px 3px rgba(0,20,50,0.05)',
  '--shadow-md': '0 4px 12px rgba(0,20,50,0.05)',
  '--shadow-lg': '0 8px 24px rgba(0,20,50,0.05)',
};

/* ---------- 数据定义 ---------- */

/** 报告类型卡片 */
const REPORT_TYPES = [
  { id: 'career', name: '事业运报告', Icon: Briefcase, color: '#004baa', bg: 'rgba(0,75,170,0.12)' },
  { id: 'love', name: '感情运报告', Icon: Heart, color: '#c43a3a', bg: 'rgba(196,58,58,0.08)' },
  { id: 'wealth', name: '财运报告', Icon: Coins, color: '#c8a84e', bg: 'rgba(200,168,78,0.1)' },
  { id: 'yearly', name: '年度综合', Icon: Sparkles, color: '#e8d48b', bg: 'rgba(255,255,255,0.15)', active: true },
  { id: 'custom', name: '自定义主题', Icon: Settings2, color: '#6b7590', bg: '#0d1220' },
] as const;

/** 各体系分析数据 */
const SYSTEMS = [
  {
    id: 'bazi',
    name: '八字分析',
    subtitle: '四柱命盘体系',
    Icon: CircleDot,
    borderColor: '#004baa',
    iconBg: 'rgba(0,75,170,0.12)',
    iconColor: '#004baa',
    scoreBadgeBg: 'rgba(0,75,170,0.12)',
    scoreBadgeColor: '#004baa',
    score: 90,
    barColor: '#004baa',
    tagBg: 'rgba(0,75,170,0.06)',
    tagColor: '#004baa',
    content: '壬水日主生于午月，甲辰流年偏印坐库，事业宫有贵人星入命。下半年食伤泄秀有力，利于创作与表达，九月之后印星化权，升迁机会显著。',
    tags: ['事业上升', '贵人运强'],
  },
  {
    id: 'tarot',
    name: '塔罗分析',
    subtitle: '大阿尔卡纳牌阵',
    Icon: Sunset,
    borderColor: '#7c3aed',
    iconBg: 'rgba(124,58,237,0.08)',
    iconColor: '#7c3aed',
    scoreBadgeBg: 'rgba(124,58,237,0.08)',
    scoreBadgeColor: '#7c3aed',
    score: 85,
    barColor: '#7c3aed',
    tagBg: 'rgba(124,58,237,0.06)',
    tagColor: '#7c3aed',
    content: '当前牌阵显示"战车"正位出现于事业位置，暗示通过意志力和行动可以获得成功。力量牌逆位提醒需注意情绪管理，避免冲动决策。',
    tags: ['行动力强', '需控情绪'],
  },
  {
    id: 'constellation',
    name: '星座分析',
    subtitle: '太阳 + 行星推运',
    Icon: Star,
    borderColor: '#c8a84e',
    iconBg: 'rgba(200,168,78,0.1)',
    iconColor: '#c8a84e',
    scoreBadgeBg: 'rgba(200,168,78,0.1)',
    scoreBadgeColor: '#9a7b2e',
    score: 83,
    barColor: '#c8a84e',
    tagBg: 'rgba(200,168,78,0.08)',
    tagColor: '#9a7b2e',
    content: '木星于今年下半年进入您的事业宫，带来扩张与机遇。土星在合伙宫的行运要求您在合作关系中更加谨慎，适合巩固现有资源。',
    tags: ['木星护佑', '贵人显现'],
  },
] as const;

/** 多体系共识 */
const CONSENSUS = [
  {
    title: '下半年事业运势明显上升',
    desc: '八字、塔罗、星座三大体系均指向 9 月后事业机遇增多，贵人运增强。',
  },
  {
    title: '需要控制情绪与冲动',
    desc: '塔罗力量逆位与八字火旺之象互相印证，提醒保持冷静。',
  },
  {
    title: '学习与自我提升是关键',
    desc: '八字偏印坐库与木星行运均指向技能深造、考取证书的有利时机。',
  },
] as const;

/** 体系分歧 */
const DIVERGENCES = [
  {
    title: '感情运判断存在分歧',
    desc: '八字显示感情宫稳定，但塔罗圣杯二逆位暗示需注意沟通问题。建议关注伴侣间的深层对话。',
  },
  {
    title: '投资时机看法不同',
    desc: '星座认为八月后适合投资布局，八字则建议保守观望至十月。综合建议：小规模试水，不急于重仓。',
  },
] as const;

/** 时间线节点 */
const TIMELINE = [
  {
    dotColor: '#004baa',
    date: '2026 年 7 月',
    tagLabel: '蓄能期',
    tagBg: 'rgba(0,75,170,0.06)',
    tagColor: '#004baa',
    title: '技能提升与资源整合',
    desc: '适合报名培训课程、考取证书。同时梳理人脉资源，为九月机遇期做好铺垫。',
  },
  {
    dotColor: '#c8a84e',
    date: '2026 年 8 月',
    tagLabel: '活跃期',
    tagBg: 'rgba(200,168,78,0.1)',
    tagColor: '#9a7b2e',
    title: '社交拓展与感情升温',
    desc: '社交活动频繁，适合拓展人脉圈。单身者桃花运势上升，已有伴侣者建议安排一次深度旅行。',
  },
  {
    dotColor: '#004baa',
    date: '2026 年 9 月',
    tagLabel: '爆发期',
    tagBg: 'rgba(26,138,92,0.08)',
    tagColor: '#1a8a5c',
    title: '事业突破的关键窗口',
    desc: '贵人运与机遇运同时达到高峰，适合启动重大项目、提出晋升申请或开展新的合作。把握这一关键节点。',
  },
] as const;

/** 推荐工具 */
const RECOMMENDED_TOOLS = [
  { name: '八字排盘', desc: '详细四柱命盘', Icon: Compass, color: '#004baa', bg: 'rgba(0,75,170,0.08)' },
  { name: '塔罗牌阵', desc: '凯尔特十字牌阵', Icon: Sunset, color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
  { name: '星座星盘', desc: '个人本命星盘', Icon: Star, color: '#c8a84e', bg: 'rgba(200,168,78,0.1)' },
  { name: '运势日历', desc: '每日运势提醒', Icon: CalendarRange, color: '#1a8a5c', bg: 'rgba(26,138,92,0.08)' },
] as const;

/** 子维度指标 */
const DIMENSIONS = [
  { label: '事业运', value: 92 },
  { label: '感情运', value: 78 },
  { label: '财运', value: 85 },
  { label: '健康运', value: 88 },
] as const;

/* ============================================
   综合报告结果展示页（浅色主题）
   ============================================ */
export default function ReportPage() {
  const [activeType, setActiveType] = useState('yearly');

  return (
    <div style={LIGHT as React.CSSProperties}>
      {/* ========== Banner：深蓝渐变 + 标题 ========== */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--color-primary-darker) 0%, var(--color-primary-dark) 100%)',
          padding: '3rem 0 2.5rem',
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem' }}>
          <h1
            style={{
              color: '#fff',
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: '0.5rem',
              fontFamily: "'Noto Serif SC', serif",
              wordBreak: 'keep-all',
              overflowWrap: 'break-word',
            }}
          >
            综合报告
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
            跨体系运势分析，多维度解读命运密码
          </p>
        </div>
      </section>

      {/* ========== 页面主体 ========== */}
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '1.5rem 1.5rem 6rem',
        }}
      >
        {/* ========== 报告类型选择 ========== */}
        <section style={{ marginBottom: '2.5rem' }}>
          <div
            style={{
              display: 'flex',
              overflowX: 'auto',
              gap: '1rem',
              paddingBottom: '0.5rem',
              /* 隐藏滚动条 */
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            className="no-scrollbar"
          >
            {REPORT_TYPES.map((t) => {
              const isActive = activeType === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveType(t.id)}
                  style={{
                    flexShrink: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1.25rem 1.25rem',
                    borderRadius: 12,
                    minWidth: 140,
                    cursor: 'pointer',
                    border: isActive ? 'none' : '1px solid var(--color-border-light)',
                    background: isActive
                      ? 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)'
                      : 'var(--color-bg-elevated)',
                    boxShadow: isActive ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                    transition: 'all 150ms ease',
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isActive ? 'rgba(255,255,255,0.15)' : t.bg,
                    }}
                  >
                    <t.Icon
                      size={20}
                      style={{ color: isActive ? '#e8d48b' : t.color }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 600 : 500,
                      whiteSpace: 'nowrap',
                      color: isActive ? '#fff' : 'var(--color-text)',
                    }}
                  >
                    {t.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ========== 报告概要区（大号评分 + 总述 + 子维度） ========== */}
        <section
          style={{
            marginBottom: '2.5rem',
            padding: '1.5rem',
            borderRadius: 12,
            background: 'linear-gradient(135deg, var(--color-primary-darker) 0%, var(--color-primary-dark) 100%)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          {/* 用户信息概览行 */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.25rem',
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.55)',
            }}
          >
            <span>分析周期：2026.07 — 2026.12</span>
            <span>|</span>
            <span>涵盖体系：八字、塔罗、星座</span>
            <span>|</span>
            <span>生成时间：2026-07-11 10:30</span>
          </div>

          {/* 评分 + 总述 */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontWeight: 700,
                  fontSize: 'clamp(3rem, 8vw, 5rem)',
                  color: '#c8a84e',
                  lineHeight: 1,
                }}
              >
                87
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 500, color: '#e8d48b' }}>/100</span>
            </div>
            <div style={{ flex: '1 1 280px', minWidth: 0 }}>
              <p style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: 4 }}>
                事业运势整体向好，下半年有望迎来重大突破
              </p>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: 1.6,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                综合八字、塔罗、星座三大体系的交叉分析，您的 2026
                年下半年事业运势呈现上升趋势，贵人运增强，适合推进重要项目。
              </p>
            </div>
          </div>

          {/* 分隔线 */}
          <div
            style={{
              height: 1,
              margin: '1.5rem 0',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
            }}
          />

          {/* 子维度指标 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1rem' }}>
            {DIMENSIONS.map((d) => (
              <div key={d.label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>
                  {d.label}
                </span>
                <span style={{ fontSize: '1.125rem', fontWeight: 600, color: '#e8d48b' }}>{d.value}</span>
                {/* 小型进度条 */}
                <div
                  style={{
                    width: '100%',
                    height: 4,
                    borderRadius: 2,
                    background: 'rgba(255,255,255,0.12)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${d.value}%`,
                      height: '100%',
                      borderRadius: 2,
                      background: 'linear-gradient(90deg, #e8d48b, #c8a84e)',
                      transition: 'width 400ms ease',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========== 各体系独立分析 ========== */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2
            style={{
              fontSize: '1.125rem',
              fontWeight: 700,
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--color-text)',
            }}
          >
            <Layers size={20} style={{ color: 'var(--color-primary)' }} />
            各体系独立分析
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {SYSTEMS.map((s) => (
              <div
                key={s.id}
                style={{
                  padding: '1.25rem',
                  borderRadius: 12,
                  background: 'var(--color-bg-elevated)',
                  boxShadow: 'var(--shadow-sm)',
                  borderTop: `3px solid ${s.borderColor}`,
                }}
              >
                {/* 卡片头部：图标 + 名称 + 分数 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      background: s.iconBg,
                    }}
                  >
                    <s.Icon size={16} style={{ color: s.iconColor }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: 'var(--color-text)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {s.name}
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', whiteSpace: 'nowrap' }}>
                      {s.subtitle}
                    </span>
                  </div>
                  <span
                    style={{
                      flexShrink: 0,
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '2px 8px',
                      borderRadius: 4,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      background: s.scoreBadgeBg,
                      color: s.scoreBadgeColor,
                    }}
                  >
                    {s.score}分
                  </span>
                </div>

                {/* 评分进度条 */}
                <div
                  style={{
                    width: '100%',
                    height: 6,
                    borderRadius: 3,
                    background: 'var(--color-bg-inset)',
                    overflow: 'hidden',
                    marginBottom: '0.75rem',
                  }}
                >
                  <div
                    style={{
                      width: `${s.score}%`,
                      height: '100%',
                      borderRadius: 3,
                      background: s.barColor,
                      transition: 'width 400ms ease',
                    }}
                  />
                </div>

                {/* 分析文本 */}
                <p
                  style={{
                    fontSize: '0.875rem',
                    lineHeight: 1.75,
                    color: 'var(--color-text-secondary)',
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    marginBottom: '1rem',
                  }}
                >
                  {s.content}
                </p>

                {/* 标签 */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {s.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: '0.75rem',
                        whiteSpace: 'nowrap',
                        background: s.tagBg,
                        color: s.tagColor,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========== 交叉验证区 ========== */}
        <section
          style={{
            marginBottom: '2.5rem',
            padding: '1.5rem',
            borderRadius: 12,
            background: 'var(--color-bg-elevated)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h2
            style={{
              fontSize: '1.125rem',
              fontWeight: 700,
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--color-text)',
            }}
          >
            <GitCompareArrows size={20} style={{ color: 'var(--color-primary)' }} />
            交叉验证
          </h2>

          {/* 共识点 */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
              <CheckCircle2 size={16} style={{ color: '#1a8a5c', flexShrink: 0 }} />
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>多体系共识</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {CONSENSUS.map((c, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: '0.75rem',
                    borderRadius: 8,
                    background: 'rgba(26,138,92,0.06)',
                    borderLeft: '3px solid #1a8a5c',
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: '#1a8a5c',
                      color: '#fff',
                    }}
                  >
                    {i + 1}
                  </span>
                  <p style={{ fontSize: '0.875rem', lineHeight: 1.75, color: 'var(--color-text-secondary)', minWidth: 0 }}>
                    <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{c.title}</span> — {c.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 分歧点 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
              <AlertTriangle size={16} style={{ color: '#c87a1a', flexShrink: 0 }} />
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>体系分歧</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {DIVERGENCES.map((d, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: '0.75rem',
                    borderRadius: 8,
                    background: 'rgba(200,122,26,0.06)',
                    borderLeft: '3px solid #c87a1a',
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: '#c87a1a',
                      color: '#fff',
                    }}
                  >
                    !
                  </span>
                  <p style={{ fontSize: '0.875rem', lineHeight: 1.75, color: 'var(--color-text-secondary)', minWidth: 0 }}>
                    <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{d.title}</span> — {d.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== AI 综合建议 ========== */}
        <section
          style={{
            marginBottom: '2.5rem',
            padding: '1.5rem',
            borderRadius: 12,
            background: 'linear-gradient(135deg, var(--color-primary-darker) 0%, var(--color-primary-dark) 100%)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
            <Sparkles size={20} style={{ color: '#e8d48b' }} />
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#fff' }}>AI 综合建议</h2>
          </div>
          <div
            style={{
              height: 1,
              marginBottom: '1.25rem',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.9)' }}>
              基于三大体系的综合分析，我们建议您在 2026
              年下半年采取"稳中求进"的整体策略。事业方面，九月是一个关键节点，届时贵人运和机遇运同时达到高峰，建议在此之前做好充分准备——包括技能提升、人脉拓展和项目规划。上半年适合打基础、蓄势待发，不宜冒进。
            </p>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.9)' }}>
              感情方面，尽管各体系对感情运的判断略有分歧，但核心建议一致：加强与伴侣的沟通，避免因工作繁忙而忽视情感维护。单身者可在八月社交活动增多时主动出击。财务方面，建议保持稳健的理财策略，十月后可适当增加投资比例。
            </p>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.9)' }}>
              健康方面，注意夏季高温期间的水分补充和作息规律。年底事业忙碌期需警惕过劳，建议提前安排体检并保持适度运动。整体而言，下半年是您运势的上升期，把握机遇的同时保持理性判断，将能获得最大收益。
            </p>
          </div>
        </section>

        {/* ========== 近 3 个月关键节点 ========== */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2
            style={{
              fontSize: '1.125rem',
              fontWeight: 700,
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--color-text)',
            }}
          >
            <CalendarRange size={20} style={{ color: 'var(--color-primary)' }} />
            近 3 个月关键节点
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {TIMELINE.map((item, idx) => (
              <div key={item.date} style={{ display: 'flex', gap: '1rem' }}>
                {/* 左侧时间线 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: item.dotColor,
                    }}
                  />
                  <div
                    style={{
                      width: 2,
                      flex: 1,
                      background: idx < TIMELINE.length - 1 ? 'var(--color-border)' : 'transparent',
                    }}
                  />
                </div>
                {/* 右侧内容 */}
                <div style={{ paddingBottom: '1.5rem', minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap', color: item.tagColor }}>
                      {item.date}
                    </span>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: '0.75rem',
                        whiteSpace: 'nowrap',
                        background: item.tagBg,
                        color: item.tagColor,
                      }}
                    >
                      {item.tagLabel}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      marginBottom: 4,
                      color: 'var(--color-text)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.title}
                  </p>
                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.6,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========== 推荐工具 ========== */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2
            style={{
              fontSize: '1.125rem',
              fontWeight: 700,
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--color-text)',
            }}
          >
            <Wrench size={20} style={{ color: 'var(--color-primary)' }} />
            推荐工具
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {RECOMMENDED_TOOLS.map((tool) => (
              <div
                key={tool.name}
                style={{
                  padding: '1.25rem',
                  borderRadius: 12,
                  background: 'var(--color-bg-elevated)',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--color-border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    background: tool.bg,
                  }}
                >
                  <tool.Icon size={20} style={{ color: tool.color }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>{tool.name}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>{tool.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ========== 固定底部操作栏 ========== */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          background: 'var(--color-bg-elevated)',
          borderTop: '1px solid var(--color-border-light)',
          boxShadow: '0 -2px 12px rgba(0,20,50,0.06)',
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
            padding: '0.75rem 1.5rem',
          }}
        >
          {/* 导出 PDF */}
          <button
            style={{
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '0.625rem 1.25rem',
              borderRadius: 8,
              fontSize: '0.875rem',
              fontWeight: 600,
              background: 'var(--color-primary)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            <Download size={16} />
            <span style={{ whiteSpace: 'nowrap' }}>导出 PDF</span>
          </button>
          {/* 收藏 */}
          <button
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: '0.25rem 0.75rem',
              borderRadius: 8,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-secondary)',
              transition: 'color 150ms ease',
            }}
          >
            <Bookmark size={20} />
            <span style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>收藏</span>
          </button>
          {/* 分享 */}
          <button
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: '0.25rem 0.75rem',
              borderRadius: 8,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-secondary)',
              transition: 'color 150ms ease',
            }}
          >
            <Share2 size={20} />
            <span style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>分享</span>
          </button>
        </div>
      </div>
    </div>
  );
}
