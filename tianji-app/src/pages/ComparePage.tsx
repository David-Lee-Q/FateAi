import { useState } from 'react';
import {
  GitCompareArrows,
  Loader2,
  Check,
} from 'lucide-react';
import { submitFortuneQuery } from '@/services/api';

/* ============================================================
   常量定义：体系分组、Mock 结果数据
   ============================================================ */

/** 对比体系分组 */
const SYSTEM_GROUPS = [
  {
    category: '东方命理',
    items: [
      { id: 'bazi', name: '八字', checked: true },
      { id: 'ziwei', name: '紫微' },
      { id: 'liuyao', name: '六爻' },
      { id: 'meihua', name: '梅花' },
    ],
  },
  {
    category: '西方占卜',
    items: [
      { id: 'tarot', name: '塔罗', checked: true },
      { id: 'constellation', name: '星座' },
      { id: 'numerology', name: '数字' },
    ],
  },
  {
    category: '民俗',
    items: [
      { id: 'shengxiao', name: '生肖' },
      { id: 'lot', name: '签诗' },
    ],
  },
];

/** 评分维度 */
const RATING_LABELS = ['事业运', '财运', '感情运', '健康运', '贵人运'] as const;

/** 评分条数据类型 */
interface RatingItem {
  label: string;
  value: number;
}

/** 结果卡片数据类型 */
interface ResultCardData {
  id: string;
  name: string;
  conclusion: string;
  tags: string[];
  ratings: RatingItem[];
  iconBg: string;
  iconColor: string;
}

/** Mock 对比结果（与设计稿一致） */
const MOCK_RESULT_CARDS: ResultCardData[] = [
  {
    id: 'bazi',
    name: '八字命理',
    conclusion:
      '命主日柱坐印，当前大运走食伤生财之路。近期财星透干，利于主动出击、拓展新业务。',
    tags: ['食伤生财', '财星透干', '主动出击', '贵人运旺'],
    ratings: [
      { label: '事业运', value: 82 },
      { label: '财运', value: 75 },
      { label: '感情运', value: 60 },
      { label: '健康运', value: 70 },
      { label: '贵人运', value: 88 },
    ],
    iconBg: 'rgba(200,168,78,0.1)',
    iconColor: '#c8a84e',
  },
  {
    id: 'tarot',
    name: '塔罗占卜',
    conclusion:
      '战车正位出现，象征坚定的意志与掌控力。权杖三暗示合作与远见，建议以积极态度推进计划。',
    tags: ['战车正位', '权杖三', '坚定意志', '合作共赢'],
    ratings: [
      { label: '事业运', value: 85 },
      { label: '财运', value: 68 },
      { label: '感情运', value: 72 },
      { label: '健康运', value: 78 },
      { label: '贵人运', value: 80 },
    ],
    iconBg: 'rgba(0,75,170,0.1)',
    iconColor: '#4a90d9',
  },
  {
    id: 'constellation',
    name: '星座运势',
    conclusion:
      '木星进入第二宫带来财富机遇，但需注意天王星对冲可能引发突发变数。整体运势上扬，宜稳中求进。',
    tags: ['木星入二宫', '天王星对冲', '稳中求进', '财富机遇'],
    ratings: [
      { label: '事业运', value: 78 },
      { label: '财运', value: 85 },
      { label: '感情运', value: 55 },
      { label: '健康运', value: 72 },
      { label: '贵人运', value: 76 },
    ],
    iconBg: 'rgba(138,92,246,0.1)',
    iconColor: '#8a5cf6',
  },
];

/** Mock 共识数据 */
const MOCK_CONSENSUS = [
  {
    label: '核心共识',
    text: '三大体系均指向当前为事业发展的有利窗口期，适合主动推进重要决策。',
  },
  {
    label: '财运判断',
    text: '八字与星座在财运维度给出高度一致的正面预判，木星与财星形成共振。',
  },
  {
    label: '贵人相助',
    text: '三个体系均显示近期有贵人运加持，社交活动可能带来意外机遇。',
  },
];

/** Mock 分歧数据 */
const MOCK_DIVERGENCES = [
  {
    label: '感情运势',
    text: '八字认为感情运平平需静待时机，塔罗则暗示感情方面有积极转机，两者结论存在差异。',
  },
  {
    label: '潜在变数',
    text: '星座体系特别提醒天王星对冲带来的突发变数风险，而八字和塔罗对此未有明确警示。',
  },
];

/** Mock AI 综合评分 */
const MOCK_AI_SCORES = [
  { label: '事业运', value: 82 },
  { label: '财运', value: 76 },
  { label: '感情运', value: 62 },
  { label: '健康运', value: 73 },
  { label: '贵人运', value: 81 },
];

/* ============================================================
   子组件
   ============================================================ */

/** 体系图标 SVG（根据体系 id 返回对应图标） */
function SystemIcon({ id, color }: { id: string; color: string }) {
  switch (id) {
    case 'bazi':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          <path d="M2 12h20" />
        </svg>
      );
    case 'tarot':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <path d="M8 6h8" />
          <path d="M8 10h8" />
          <path d="M8 14h3" />
          <circle cx="16" cy="16" r="3" />
          <path d="M16 14v4" />
        </svg>
      );
    case 'constellation':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      );
  }
}

/** 评分条组件 */
function RatingBar({ label, value }: RatingItem) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
      <span style={{ width: 56, flexShrink: 0, fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--color-text-tertiary)', whiteSpace: 'nowrap' }}>
        {label}
      </span>
      <div
        style={{
          flex: 1,
          height: 8,
          background: 'var(--color-bg-inset)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(90deg, var(--color-primary), var(--color-primary-lighter))',
            width: `${value}%`,
            transition: 'width 0.8s ease',
          }}
        />
      </div>
      <span style={{ width: 32, flexShrink: 0, textAlign: 'right', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
        {value}
      </span>
    </div>
  );
}

/** 结果卡片组件 */
function ResultCard({ card }: { card: ResultCardData }) {
  return (
    <div className="result-card" style={{
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-xl)',
      background: 'var(--color-bg-card)',
      overflow: 'hidden',
      transition: 'box-shadow var(--transition-base)',
    }}>
      {/* 卡片头部 */}
      <div style={{
        padding: 'var(--space-5) var(--space-6)',
        borderBottom: '1px solid var(--color-border-light)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
      }}>
        <div style={{
          width: 44,
          height: 44,
          flexShrink: 0,
          borderRadius: 'var(--radius-full)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: card.iconBg,
        }}>
          <SystemIcon id={card.id} color={card.iconColor} />
        </div>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-lg)',
          fontWeight: 600,
          color: 'var(--color-text)',
        }}>
          {card.name}
        </span>
      </div>

      {/* 卡片主体 */}
      <div style={{ padding: 'var(--space-6)' }}>
        {/* 结论 */}
        <p style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-secondary)',
          lineHeight: 'var(--leading-relaxed)',
          marginBottom: 'var(--space-4)',
        }}>
          {card.conclusion}
        </p>

        {/* 关键词标签 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
          {card.tags.map((tag) => (
            <span
              key={tag}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: 'var(--space-1) var(--space-3)',
                fontSize: 'var(--text-xs)',
                fontWeight: 500,
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255,255,255,0.06)',
                color: 'rgba(224,228,240,0.6)',
                whiteSpace: 'nowrap',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 评分条列表 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {card.ratings.map((r) => (
            <RatingBar key={r.label} {...r} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** 雷达图 SVG 组件（与设计稿完全一致） */
function RadarChart() {
  return (
    <div style={{ flexShrink: 0, width: 280, height: 280, position: 'relative' }}>
      <svg viewBox="0 0 280 280" width="280" height="280" xmlns="http://www.w3.org/2000/svg">
        {/* 背景网格（五边形） */}
        <polygon points="140,30 248,95 214,210 66,210 32,95" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <polygon points="140,60 223,105 197,195 83,195 57,105" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <polygon points="140,90 198,115 180,180 100,180 82,115" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        <polygon points="140,120 173,125 163,165 117,165 107,125" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

        {/* 数据多边形（综合评分） */}
        <polygon
          points="140,43 235,100 205,200 80,198 45,98"
          fill="rgba(200,168,78,0.12)"
          stroke="#c8a84e"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* 数据点 */}
        <circle cx="140" cy="43" r="4" fill="#c8a84e" />
        <circle cx="235" cy="100" r="4" fill="#c8a84e" />
        <circle cx="205" cy="200" r="4" fill="#c8a84e" />
        <circle cx="80" cy="198" r="4" fill="#c8a84e" />
        <circle cx="45" cy="98" r="4" fill="#c8a84e" />

        {/* 轴线 */}
        <line x1="140" y1="140" x2="140" y2="30" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <line x1="140" y1="140" x2="248" y2="95" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <line x1="140" y1="140" x2="214" y2="210" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <line x1="140" y1="140" x2="66" y2="210" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <line x1="140" y1="140" x2="32" y2="95" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

        {/* 维度标签 */}
        <text x="140" y="18" textAnchor="middle" fill="rgba(224,228,240,0.7)" fontFamily="Noto Sans SC" fontSize="12" fontWeight="500">事业运</text>
        <text x="260" y="100" textAnchor="start" fill="rgba(224,228,240,0.7)" fontFamily="Noto Sans SC" fontSize="12" fontWeight="500">财运</text>
        <text x="222" y="228" textAnchor="middle" fill="rgba(224,228,240,0.7)" fontFamily="Noto Sans SC" fontSize="12" fontWeight="500">感情运</text>
        <text x="58" y="228" textAnchor="middle" fill="rgba(224,228,240,0.7)" fontFamily="Noto Sans SC" fontSize="12" fontWeight="500">健康运</text>
        <text x="20" y="100" textAnchor="end" fill="rgba(224,228,240,0.7)" fontFamily="Noto Sans SC" fontSize="12" fontWeight="500">贵人运</text>
      </svg>
    </div>
  );
}

/* ============================================================
   主页面组件
   ============================================================ */

export default function ComparePage() {
  /* ---- 状态管理 ---- */
  const [question, setQuestion] = useState('');
  const [selectedSystems, setSelectedSystems] = useState<string[]>(['bazi', 'tarot']);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  /** 切换体系选择 */
  const toggleSystem = (id: string) => {
    setSelectedSystems((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((s) => s !== id) : prev) : [...prev, id]
    );
  };

  /** 提交对比分析 */
  const handleCompare = async () => {
    if (selectedSystems.length < 2) return;
    setLoading(true);
    try {
      await submitFortuneQuery('compare', { question, systems: selectedSystems });
    } catch {
      // 降级使用 Mock 数据
    } finally {
      setShowResult(true);
      setLoading(false);
    }
  };

  /* ---- 渲染 ---- */
  return (
    <div
      style={{
        background: 'linear-gradient(170deg, #0a0f1e 0%, #0d1530 50%, #0a1025 100%)',
        minHeight: '100vh',
      }}
    >
      {/* ==================== 标题区（Banner） ==================== */}
      <section style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: 'var(--space-10) var(--space-6) var(--space-8)' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 3.5vw, 48px)',
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 'var(--leading-tight)',
            letterSpacing: 'var(--tracking-tight)',
            textWrap: 'balance',
            wordBreak: 'keep-all',
            overflowWrap: 'break-word',
          }}
        >
          多维对比
        </h1>
        <p
          style={{
            fontSize: 'var(--text-lg)',
            color: 'rgba(224,228,240,0.55)',
            lineHeight: 'var(--leading-relaxed)',
            marginTop: 'var(--space-3)',
          }}
        >
          不同体系对同一问题的解读，发现共识与分歧
        </p>
      </section>

      {/* ==================== 问题输入区 ==================== */}
      <section style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 var(--space-6) var(--space-10)' }}>
        <textarea
          placeholder="描述你想了解的问题..."
          rows={4}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={{
            width: '100%',
            minHeight: 120,
            padding: 'var(--space-5) var(--space-6)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-lg)',
            lineHeight: 'var(--leading-relaxed)',
            color: '#e0e4f0',
            background: 'rgba(255,255,255,0.04)',
            border: '2px solid rgba(255,255,255,0.1)',
            borderRadius: 'var(--radius-lg)',
            resize: 'vertical',
            transition: 'border-color var(--transition-base), box-shadow var(--transition-base)',
            outline: 'none',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-gold)';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(200,168,78,0.15)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
      </section>

      {/* ==================== 体系选择区 ==================== */}
      <section style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 var(--space-6) var(--space-6)' }}>
        {/* 标题行 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-5)' }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wide)',
            color: 'var(--color-gold)',
          }}>
            选择对比体系
          </span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
            至少选择 2 个体系
          </span>
        </div>

        {/* 体系三列网格 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-8)' }}>
          {SYSTEM_GROUPS.map((group) => (
            <div key={group.category}>
              {/* 分组标题 */}
              <div style={{
                marginBottom: 'var(--space-3)',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'rgba(224,228,240,0.5)',
              }}>
                {group.category}
              </div>

              {/* Checkbox 卡片网格 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
                {group.items.map((item) => {
                  const isChecked = selectedSystems.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleSystem(item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-3)',
                        padding: 'var(--space-3) var(--space-4)',
                        border: `1.5px solid ${isChecked ? 'var(--color-gold)' : 'rgba(255,255,255,0.08)'}`,
                        borderRadius: 'var(--radius-md)',
                        background: isChecked ? 'rgba(200,168,78,0.08)' : 'rgba(255,255,255,0.03)',
                        color: isChecked ? '#fff' : 'rgba(200,206,224,1)',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)',
                        userSelect: 'none',
                      }}
                    >
                      {/* Checkbox 指示器 */}
                      <span style={{
                        width: 20,
                        height: 20,
                        flexShrink: 0,
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isChecked ? 'var(--color-gold)' : 'transparent',
                        border: `2px solid ${isChecked ? 'var(--color-gold)' : 'rgba(255,255,255,0.2)'}`,
                        transition: 'all var(--transition-fast)',
                      }}>
                        {isChecked && <Check size={12} color="#0a0f1e" strokeWidth={2.5} />}
                      </span>
                      {/* 标签文字 */}
                      <span style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                      }}>
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 提交按钮 */}
        <div style={{ marginTop: 'var(--space-8)', textAlign: 'center' }}>
          <button
            type="button"
            onClick={handleCompare}
            disabled={loading || selectedSystems.length < 2}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: 'var(--space-3) var(--space-10)',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-base)',
              fontWeight: 600,
              background: 'linear-gradient(135deg, var(--color-gold-dark), var(--color-gold))',
              color: '#0a0f1e',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              cursor: loading || selectedSystems.length < 2 ? 'not-allowed' : 'pointer',
              transition: 'all var(--transition-base)',
              boxShadow: '0 4px 20px rgba(200,168,78,0.3)',
              opacity: loading || selectedSystems.length < 2 ? 0.5 : 1,
            }}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <GitCompareArrows size={18} />}
            {loading ? '分析中...' : '开始对比分析'}
          </button>
        </div>
      </section>

      {/* ==================== 对比结果区 ==================== */}
      {showResult && (
        <section style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: 'var(--space-12) var(--space-6)' }}>
          {/* 板块标题 */}
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wide)',
            color: 'var(--color-gold)',
            marginBottom: 'var(--space-6)',
          }}>
            对比结果
          </div>

          {/* 结果卡片三列网格 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-6)' }}>
            {MOCK_RESULT_CARDS.map((card) => (
              <ResultCard key={card.id} card={card} />
            ))}
          </div>
        </section>
      )}

      {/* ==================== 共识与分歧区 ==================== */}
      {showResult && (
        <section style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 var(--space-6) var(--space-12)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)' }}>
            {/* 共识点 */}
            <div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-wide)',
                color: 'var(--color-success)',
                marginBottom: 'var(--space-5)',
              }}>
                共识点
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {MOCK_CONSENSUS.map((item) => (
                  <div
                    key={item.label}
                    style={{
                      padding: 'var(--space-4) var(--space-5)',
                      border: '1.5px solid rgba(26,138,92,0.3)',
                      borderRadius: 'var(--radius-lg)',
                      background: 'rgba(26,138,92,0.06)',
                    }}
                  >
                    <div style={{
                      fontSize: 'var(--text-xs)',
                      fontWeight: 600,
                      color: '#2ecc88',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}>
                      {item.label}
                    </div>
                    <div style={{
                      fontSize: 'var(--text-sm)',
                      color: '#c8d8d0',
                      lineHeight: 'var(--leading-relaxed)',
                      marginTop: 'var(--space-1)',
                    }}>
                      {item.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 分歧点 */}
            <div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-wide)',
                color: 'var(--color-warning)',
                marginBottom: 'var(--space-5)',
              }}>
                分歧点
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {MOCK_DIVERGENCES.map((item) => (
                  <div
                    key={item.label}
                    style={{
                      padding: 'var(--space-4) var(--space-5)',
                      border: '1.5px solid rgba(200,168,78,0.3)',
                      borderRadius: 'var(--radius-lg)',
                      background: 'rgba(200,168,78,0.06)',
                    }}
                  >
                    <div style={{
                      fontSize: 'var(--text-xs)',
                      fontWeight: 600,
                      color: 'var(--color-gold-light)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}>
                      {item.label}
                    </div>
                    <div style={{
                      fontSize: 'var(--text-sm)',
                      color: '#d8d0c0',
                      lineHeight: 'var(--leading-relaxed)',
                      marginTop: 'var(--space-1)',
                    }}>
                      {item.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ==================== AI 综合判断区 ==================== */}
      {showResult && (
        <section style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 var(--space-6) var(--space-16)' }}>
          <div style={{
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 'var(--radius-xl)',
            background: 'rgba(255,255,255,0.02)',
            padding: 'var(--space-8)',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-10)', flexWrap: 'wrap' }}>
              {/* 雷达图 */}
              <RadarChart />

              {/* 文字解读 */}
              <div style={{ flex: 1, minWidth: 260 }}>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-xl)',
                  fontWeight: 600,
                  color: '#ffffff',
                  marginBottom: 'var(--space-4)',
                }}>
                  AI 综合判断
                </h3>

                {/* 各维度评分汇总 */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                  gap: 'var(--space-4)',
                  marginBottom: 'var(--space-6)',
                }}>
                  {MOCK_AI_SCORES.map((s) => (
                    <div key={s.label} style={{ textAlign: 'center', padding: 'var(--space-3)' }}>
                      <div style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'var(--text-2xl)',
                        fontWeight: 700,
                        color: 'var(--color-gold)',
                      }}>
                        {s.value}
                      </div>
                      <div style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-text-tertiary)',
                        marginTop: 'var(--space-1)',
                      }}>
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 金色分隔线 */}
                <div style={{
                  width: 40,
                  height: 2,
                  background: 'var(--color-gold)',
                  marginBottom: 'var(--space-5)',
                  borderRadius: 'var(--radius-full)',
                }} />

                {/* 综合评论文本 */}
                <p style={{
                  fontSize: 'var(--text-base)',
                  color: 'rgba(224,228,240,0.7)',
                  lineHeight: 'var(--leading-relaxed)',
                }}>
                  综合三大体系的解读，当前阶段整体运势呈<strong style={{ color: 'var(--color-gold)' }}>积极上扬态势</strong>。
                  事业与贵人运获得高度一致的正面信号，财运稳中有升。需特别关注感情领域存在的体系分歧，
                  建议保持开放心态但不宜急于做出重大情感决定。星座体系提示的突发变数虽未获其他体系佐证，
                  但建议在推进重要计划时预留弹性空间。
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ==================== 响应式补丁（内联媒体查询通过 style 标签注入） ==================== */}
      <style>{`
        /* 结果卡片 hover 效果 */
        .result-card:hover {
          box-shadow: var(--shadow-lg);
        }

        /* 响应式布局 */
        @media (max-width: 768px) {
          .compare-systems-grid {
            grid-template-columns: 1fr !important;
          }
          .compare-result-grid {
            grid-template-columns: 1fr !important;
          }
          .compare-consensus-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
