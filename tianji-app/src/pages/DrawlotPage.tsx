import { useState } from 'react';
import {
  BookOpen, ScrollText, MessageCircle, Bookmark, Share2,
  Sparkles, Lightbulb, RotateCw,
} from 'lucide-react';

/* ==============================
   浅色主题变量覆盖（设计稿 light theme）
   ============================== */
const LIGHT_THEME: Record<string, string> = {
  '--color-bg': '#0a0e1a',
  '--color-bg-elevated': '#111827',
  '--color-bg-inset': '#0d1220',
  '--color-bg-overlay': 'rgba(0, 20, 50, 0.5)',
  '--color-text': '#e8ecf4',
  '--color-text-secondary': '#a0aac0',
  '--color-text-tertiary': '#6b7590',
  '--color-text-inverse': '#111827',
  '--color-border': '#1e2740',
  '--color-border-light': '#161e35',
  '--color-primary-bg': 'rgba(0, 75, 170, 0.06)',
  '--color-primary-bg-strong': 'rgba(0, 75, 170, 0.12)',
  '--state-success': '#1a8a5c',
  '--state-warning': '#c87a1a',
};

/* ==============================
   签类型数据
   ============================== */
interface LotType {
  id: string;
  name: string;
  desc: string;
  /** 每种签类型独立的 SVG 图标 */
  icon: React.ReactNode;
}

/** 签类型图标 SVG */
function GuanyinIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <path d="M20 8 C20 8 14 16 14 22 C14 25.3 16.7 28 20 28 C23.3 28 26 25.3 26 22 C26 16 20 8 20 8Z" fill="currentColor" opacity="0.2" />
      <path d="M20 12 C20 12 16 17 16 21 C16 23.2 17.8 25 20 25 C22.2 25 24 23.2 24 21 C24 17 20 12 20 12Z" fill="currentColor" opacity="0.35" />
      <circle cx="20" cy="21" r="2.5" fill="currentColor" opacity="0.6" />
    </svg>
  );
}
function GuandiIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect x="10" y="8" width="20" height="26" rx="2" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <path d="M16 15 H24 M16 20 H24 M16 25 H21" stroke="currentColor" strokeWidth="1.2" opacity="0.4" strokeLinecap="round" />
      <circle cx="20" cy="11" r="1.5" fill="currentColor" opacity="0.4" />
    </svg>
  );
}
function YuelaoIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="14" r="6" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <path d="M20 20 L20 30" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <path d="M14 26 Q20 34 26 26" stroke="currentColor" strokeWidth="1.2" opacity="0.4" fill="none" />
      <circle cx="20" cy="14" r="2" fill="currentColor" opacity="0.35" />
    </svg>
  );
}
function ChegongIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <path d="M20 10 L20 30 M10 20 L30 20" stroke="currentColor" strokeWidth="1.2" opacity="0.35" strokeLinecap="round" />
      <circle cx="20" cy="10" r="2.5" fill="currentColor" opacity="0.3" />
      <circle cx="20" cy="30" r="2.5" fill="currentColor" opacity="0.3" />
      <circle cx="10" cy="20" r="2.5" fill="currentColor" opacity="0.3" />
      <circle cx="30" cy="20" r="2.5" fill="currentColor" opacity="0.3" />
    </svg>
  );
}
function LvzuIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <path d="M20 8 L28 32 L12 32 Z" stroke="currentColor" strokeWidth="1.5" opacity="0.3" fill="none" />
      <circle cx="20" cy="22" r="4" stroke="currentColor" strokeWidth="1.2" opacity="0.35" fill="none" />
      <circle cx="20" cy="22" r="1.5" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

const LOT_TYPES: LotType[] = [
  { id: 'guanyin', name: '观音灵签', desc: '百签 · 观音菩萨', icon: <GuanyinIcon /> },
  { id: 'guandi', name: '关帝灵签', desc: '六十四签 · 关圣帝君', icon: <GuandiIcon /> },
  { id: 'yuelao', name: '月老灵签', desc: '六十签 · 月老星君', icon: <YuelaoIcon /> },
  { id: 'chegong', name: '车公灵签', desc: '六十签 · 车公元帅', icon: <ChegongIcon /> },
  { id: 'lvzu', name: '吕祖灵签', desc: '一百签 · 纯阳帝君', icon: <LvzuIcon /> },
];

/* ==============================
   签诗等级
   ============================== */
const LOT_LEVELS = [
  { level: '上上签', stars: 5 }, { level: '上签', stars: 4 },
  { level: '中上签', stars: 3.5 }, { level: '中签', stars: 3 },
  { level: '中下签', stars: 2.5 }, { level: '下签', stars: 2 }, { level: '下下签', stars: 1 },
];

/* ==============================
   签诗数据（模拟）
   ============================== */
const LOT_POEMS = [
  {
    number: 27, title: '磨砺志气',
    poem: '更君志气勤磨砺\n宝剑锋从磨砺出\n梅花香自苦寒来\n功成名就自然时',
    interpretation: '此签劝勉求签者，应坚持不懈地磨砺自己的志向和才能。就像宝剑需要反复锻造才能锋利，梅花必须经历严寒才能散发幽香，人的成就也需要时间和汗水的积累。只要持之以恒，功成名就之日自然会到来。',
    story: '此签取意自明代《警世贤文》中"勤奋篇"："宝剑锋从磨砺出，梅花香自苦寒来。"古人以铸剑需千锤百炼为喻，告诫世人成功无捷径，唯有勤奋与坚持。历史上诸多名臣名将，如越王勾践卧薪尝胆、太公渭水垂钓十年，皆印证此理。',
    aiInsights: [
      '从您关心的"今年事业运势"来看，此签为上签，总体预示着事业前景向好。签诗中"更君志气勤磨砺"暗示当前阶段需要你主动提升技能、拓展视野，不宜坐等机遇降临。',
      '"宝剑锋从磨砺出"进一步强调，可能在近期会面临一些挑战或压力，但这些正是成长和突破的关键。建议以积极心态面对困难。',
      '"功成名就自然时"表明好消息可能在下半年或年底到来。保持耐心和持续努力，收获的季节终会到来。',
    ],
    suggestions: [
      { title: '方位指引', desc: '贵人方位在东南，工作朝东南方向为宜。出行或搬家可优先考虑朝南朝东的方向。', color: 'var(--color-gold)', svg: 'compass' },
      { title: '吉日良辰', desc: '农历三、六、九为吉日，逢虎日、兔日更佳。重要事务宜安排在上午九时至十一时之间。', color: 'var(--color-primary)', svg: 'calendar' },
      { title: '五行调和', desc: '五行缺水者可多穿蓝黑衣物，桌面摆放水养植物。属火者佩戴玉石饰品可增运势。', color: 'var(--state-success)', svg: 'water' },
      { title: '贵人相助', desc: '近期留意身边属龙、属蛇之人，可能有合作或助运之机。多参加社交活动，广结善缘。', color: 'var(--state-warning)', svg: 'person' },
    ],
  },
  {
    number: 1, title: '开天辟地',
    poem: '天开地辟结良缘\n日吉时良万事全\n耕种田禾大丰收\n一切谋望胜往年',
    interpretation: '此签为大吉之兆，万事顺利，诸事皆宜。事业亨通，财源广进，家庭和睦，是难得的好签。',
    story: '此签取开天辟地之象，寓意万象更新、鸿运当头。上古时期天地初开，万物生长，象征一切美好事物的开端。',
    aiInsights: [
      '此签为大吉之兆，无论事业、财运、感情各方面都呈现向好趋势。',
      '当前是开启新计划、新项目的绝佳时机，把握机遇大胆行动。',
      '人际关系方面也会有新的突破，贵人运旺盛。',
    ],
    suggestions: [
      { title: '方位指引', desc: '正东方为贵人方位，书桌或办公位朝东为佳。', color: 'var(--color-gold)', svg: 'compass' },
      { title: '吉日良辰', desc: '逢一、六日为吉，上午辰时（7-9点）行事最利。', color: 'var(--color-primary)', svg: 'calendar' },
      { title: '五行调和', desc: '五行属木者旺运，可多穿戴绿色系衣物增运。', color: 'var(--state-success)', svg: 'water' },
      { title: '贵人相助', desc: '属鼠、属猴之人为贵人，可主动请教合作。', color: 'var(--state-warning)', svg: 'person' },
    ],
  },
];

/* ==============================
   化解与建议卡片图标 SVG
   ============================== */
function SuggestionIcon({ type }: { type: string }) {
  switch (type) {
    case 'compass':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ color: 'var(--color-gold)' }}>
          <path d="M10 3 L10 12 M10 15 L10 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );
    case 'calendar':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ color: 'var(--color-primary)' }}>
          <rect x="3" y="5" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
          <path d="M3 8 H17 M7 5 V3 M13 5 V3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case 'water':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ color: 'var(--state-success)' }}>
          <path d="M10 3 C10 3 5 8 5 12 C5 14.8 7.2 17 10 17 C12.8 17 15 14.8 15 12 C15 8 10 3 10 3Z" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="10" cy="12" r="2" fill="currentColor" opacity="0.3" />
        </svg>
      );
    case 'person':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ color: 'var(--state-warning)' }}>
          <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.2" />
          <path d="M4 17 C4 14 6.7 12 10 12 C13.3 12 16 14 16 17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

/* ==============================
   推荐工具图标 SVG
   ============================== */
function RecommendIcon({ type }: { type: string }) {
  switch (type) {
    case 'dream':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--color-primary)' }}>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 6 C12 6 9 9 9 12 C9 13.7 10.3 15 12 15 C13.7 15 15 13.7 15 12 C15 9 12 6 12 6Z" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
          <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.3" />
        </svg>
      );
    case 'name':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--color-gold)' }}>
          <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
          <path d="M9 9 H15 M9 12 H15 M9 15 H12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
        </svg>
      );
    case 'zodiac':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--color-primary)' }}>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path d="M7 10 Q12 6 17 10" stroke="currentColor" strokeWidth="1.2" opacity="0.5" fill="none" />
          <path d="M7 14 Q12 18 17 14" stroke="currentColor" strokeWidth="1.2" opacity="0.5" fill="none" />
          <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.15" />
        </svg>
      );
    default:
      return null;
  }
}

/* ==============================
   子组件
   ============================== */

/** Banner 背景装饰：星星 + 祥云 + 光晕 */
function StarDecor() {
  return (
    <svg className="absolute w-full h-full" viewBox="0 0 1280 320" preserveAspectRatio="xMidYMid slice">
      {/* 星星 */}
      <circle cx="80" cy="40" r="1.5" fill="var(--color-gold-light)" style={{ animation: 'twinkle 3s ease-in-out infinite', animationDelay: '0s' }} />
      <circle cx="200" cy="80" r="1" fill="var(--color-gold-light)" style={{ animation: 'twinkle 3s ease-in-out infinite', animationDelay: '0.5s' }} />
      <circle cx="350" cy="30" r="1.2" fill="var(--color-gold-light)" style={{ animation: 'twinkle 3s ease-in-out infinite', animationDelay: '1s' }} />
      <circle cx="500" cy="90" r="0.8" fill="var(--color-gold-light)" style={{ animation: 'twinkle 3s ease-in-out infinite', animationDelay: '1.5s' }} />
      <circle cx="620" cy="50" r="1.5" fill="var(--color-gold-light)" style={{ animation: 'twinkle 3s ease-in-out infinite', animationDelay: '0.3s' }} />
      <circle cx="750" cy="100" r="1" fill="var(--color-gold-light)" style={{ animation: 'twinkle 3s ease-in-out infinite', animationDelay: '2s' }} />
      <circle cx="900" cy="35" r="1.3" fill="var(--color-gold-light)" style={{ animation: 'twinkle 3s ease-in-out infinite', animationDelay: '0.8s' }} />
      <circle cx="1050" cy="70" r="0.8" fill="var(--color-gold-light)" style={{ animation: 'twinkle 3s ease-in-out infinite', animationDelay: '1.2s' }} />
      <circle cx="1180" cy="45" r="1.5" fill="var(--color-gold-light)" style={{ animation: 'twinkle 3s ease-in-out infinite', animationDelay: '1.8s' }} />
      {/* 祥云 */}
      <g style={{ animation: 'cloud-drift 8s ease-in-out infinite', animationDelay: '0s' }} opacity="0.08">
        <path d="M100 200 Q130 180 160 200 Q180 175 210 200 Q230 185 250 200" stroke="var(--color-gold-light)" strokeWidth="1.5" fill="none" />
      </g>
      <g style={{ animation: 'cloud-drift 8s ease-in-out infinite', animationDelay: '2s' }} opacity="0.06">
        <path d="M900 220 Q930 200 960 220 Q980 195 1010 220 Q1030 205 1060 220" stroke="var(--color-gold-light)" strokeWidth="1.5" fill="none" />
      </g>
      <g style={{ animation: 'cloud-drift 8s ease-in-out infinite', animationDelay: '4s' }} opacity="0.05">
        <path d="M500 250 Q530 230 560 250 Q580 225 610 250 Q630 235 660 250" stroke="var(--color-gold-light)" strokeWidth="1.2" fill="none" />
      </g>
      {/* 光晕 */}
      <circle cx="640" cy="160" r="120" fill="var(--color-gold)" style={{ animation: 'glow-pulse 4s ease-in-out infinite' }} opacity="0.03" />
      <circle cx="640" cy="160" r="200" fill="var(--color-primary-light)" style={{ animation: 'glow-pulse 4s ease-in-out infinite', animationDelay: '2s' }} opacity="0.04" />
    </svg>
  );
}

/** 签筒 SVG */
function LotTubeSVG({ shaking }: { shaking: boolean }) {
  return (
    <div style={{ animation: shaking ? 'shake-lot 1.2s ease-in-out' : 'none' }}>
      <svg viewBox="0 0 120 180" fill="none" width="120" height="180">
        <defs>
          <linearGradient id="tube-gradient" x1="60" y1="40" x2="60" y2="170" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#c8a84e" />
            <stop offset="30%" stopColor="#e8d48b" />
            <stop offset="70%" stopColor="#9a7b2e" />
            <stop offset="100%" stopColor="#6b5520" />
          </linearGradient>
          <linearGradient id="tube-rim-gradient" x1="60" y1="36" x2="60" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#e8d48b" />
            <stop offset="100%" stopColor="#c8a84e" />
          </linearGradient>
          <linearGradient id="stick-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5e6b8" />
            <stop offset="100%" stopColor="#c8a84e" />
          </linearGradient>
        </defs>
        {/* 签竹棒 */}
        <rect x="48" y="15" width="5" height="55" rx="2" fill="url(#stick-gradient)" transform="rotate(-5 50 42)" />
        <rect x="55" y="10" width="5" height="60" rx="2" fill="url(#stick-gradient)" transform="rotate(3 57 40)" />
        <rect x="62" y="18" width="5" height="52" rx="2" fill="url(#stick-gradient)" transform="rotate(-2 64 44)" />
        <rect x="42" y="20" width="5" height="50" rx="2" fill="url(#stick-gradient)" transform="rotate(6 44 45)" />
        <rect x="70" y="22" width="5" height="48" rx="2" fill="url(#stick-gradient)" transform="rotate(-4 72 46)" />
        {/* 签筒主体 */}
        <rect x="25" y="40" width="70" height="130" rx="6" fill="url(#tube-gradient)" stroke="#6b5520" strokeWidth="1" />
        {/* 签筒底座 */}
        <rect x="22" y="162" width="76" height="10" rx="4" fill="#6b5520" opacity="0.6" />
        {/* 签筒口 */}
        <rect x="20" y="36" width="80" height="12" rx="4" fill="url(#tube-rim-gradient)" stroke="#6b5520" strokeWidth="0.8" />
        {/* 筒身纹饰 */}
        <line x1="35" y1="60" x2="35" y2="150" stroke="#f5e6b8" strokeWidth="0.5" opacity="0.2" />
        <line x1="85" y1="60" x2="85" y2="150" stroke="#f5e6b8" strokeWidth="0.5" opacity="0.2" />
        <rect x="45" y="95" width="30" height="20" rx="2" fill="none" stroke="#f5e6b8" strokeWidth="0.5" opacity="0.15" />
      </svg>
    </div>
  );
}

/** 分割线 */
function Divider() {
  return (
    <div className="flex items-center gap-4 my-6">
      <div className="flex-1" style={{ height: 1, background: 'linear-gradient(90deg, transparent, var(--color-border), transparent)' }} />
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--color-gold)', opacity: 0.4 }}>
        <path d="M4 8 L12 8" stroke="currentColor" strokeWidth="1" />
        <circle cx="8" cy="8" r="2" fill="currentColor" opacity="0.5" />
      </svg>
      <div className="flex-1" style={{ height: 1, background: 'linear-gradient(90deg, transparent, var(--color-border), transparent)' }} />
    </div>
  );
}

/** AI 解读圆点标记 */
function InsightBullet() {
  return (
    <div className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5" style={{ background: 'var(--color-primary-bg-strong)' }}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <circle cx="6" cy="6" r="4" stroke="var(--color-primary)" strokeWidth="1.2" />
        <circle cx="6" cy="6" r="1.5" fill="var(--color-primary)" />
      </svg>
    </div>
  );
}

/* ==============================
   推荐工具数据
   ============================== */
const RECOMMEND_TOOLS = [
  { name: '周公解梦', desc: '输入梦境关键词，AI 结合传统解梦典籍为您解析梦境寓意。', icon: 'dream', bgColor: 'var(--color-primary-bg)' },
  { name: '姓名测算', desc: '基于姓名笔画、五行、三才配置，AI 深度解析您的姓名运势。', icon: 'name', bgColor: 'rgba(200, 168, 78, 0.08)' },
  { name: '生肖运势', desc: '2025 年十二生肖运势详解，涵盖事业、财运、感情、健康全方位。', icon: 'zodiac', bgColor: 'var(--color-primary-bg)' },
];

/* ==============================
   签诗页面主组件
   ============================== */
export default function DrawlotPage() {
  const [activeType, setActiveType] = useState('guanyin');
  const [shaking, setShaking] = useState(false);
  const [drawnLot, setDrawnLot] = useState<typeof LOT_POEMS[0] | null>(null);
  const [lotLevel, setLotLevel] = useState<typeof LOT_LEVELS[0] | null>(null);
  const [question, setQuestion] = useState('');

  /** 获取当前选中的签类型名称 */
  const activeTypeName = LOT_TYPES.find((t) => t.id === activeType)?.name ?? '观音灵签';

  /** 模拟摇签 */
  const handleDrawLot = () => {
    setShaking(true);
    setDrawnLot(null);
    setLotLevel(null);
    setTimeout(() => {
      const idx = Math.floor(Math.random() * LOT_POEMS.length);
      const levelIdx = Math.floor(Math.random() * LOT_LEVELS.length);
      setDrawnLot(LOT_POEMS[idx]);
      setLotLevel(LOT_LEVELS[levelIdx]);
      setShaking(false);
    }, 1500);
  };

  return (
    <div
      className="min-h-screen antialiased"
      style={{ ...LIGHT_THEME, fontFamily: 'var(--font-body)', background: 'var(--color-bg)', color: 'var(--color-text)' }}
    >
      {/* 页面级动画关键帧 */}
      <style>{`
        /* 摇签动画 */
        @keyframes shake-lot {
          0%, 100% { transform: rotate(0deg); }
          10% { transform: rotate(-8deg); }
          20% { transform: rotate(8deg); }
          30% { transform: rotate(-12deg); }
          40% { transform: rotate(12deg); }
          50% { transform: rotate(-10deg); }
          60% { transform: rotate(10deg); }
          70% { transform: rotate(-6deg); }
          80% { transform: rotate(6deg); }
          90% { transform: rotate(-3deg); }
        }
        /* 星星闪烁 */
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        /* 金色渐变文字 */
        .gold-text {
          background: linear-gradient(135deg, var(--color-gold-light), var(--color-gold), var(--color-gold-dark));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        /* 祥云飘动 */
        @keyframes cloud-drift {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(12px); }
        }
        /* 祈福光晕 */
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        /* 隐藏横向滚动条 */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        /* 签诗古风排版 */
        .poem-classical {
          font-family: 'Noto Serif SC', serif;
          line-height: 2.2;
          letter-spacing: 0.08em;
          font-size: 1.2rem;
          color: var(--color-text);
        }
        /* 签类型卡片基础样式 */
        .lot-type-card {
          position: relative;
          background: var(--color-bg-elevated);
          border: 1px solid var(--color-border-light);
          border-radius: var(--radius-lg);
          padding: var(--space-5) var(--space-6);
          cursor: pointer;
          transition: all var(--transition-base);
          text-align: center;
          min-width: 140px;
          flex-shrink: 0;
        }
        .lot-type-card:hover {
          border-color: var(--color-gold-light);
          box-shadow: 0 4px 16px rgba(200, 168, 78, 0.15);
          transform: translateY(-2px);
        }
        /* 签诗展示卡 */
        .lot-poem-card {
          background: var(--color-bg-elevated);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-lg);
          overflow: hidden;
        }
        .lot-poem-header {
          background: linear-gradient(135deg, var(--color-primary-darker), #0a0f2e);
          padding: var(--space-8) var(--space-8) var(--space-6);
          position: relative;
        }
        .lot-poem-header::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, transparent, var(--color-gold), transparent);
        }
        /* 推荐卡片 */
        .recommend-card {
          background: var(--color-bg-elevated);
          border: 1px solid var(--color-border-light);
          border-radius: var(--radius-lg);
          padding: var(--space-6);
          transition: all var(--transition-base);
          cursor: pointer;
        }
        .recommend-card:hover {
          border-color: var(--color-primary-lighter);
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }
      `}</style>

      {/* ========== Banner 标题区 ========== */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--color-primary-darker) 0%, #0a0f2e 100%)' }}>
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <StarDecor />
        </div>
        <div className="relative mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:pt-14 sm:pb-20" style={{ maxWidth: 'var(--max-width)' }}>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 gold-text"
            style={{ fontFamily: 'var(--font-display)', textWrap: 'balance', wordBreak: 'keep-all', overflowWrap: 'break-word' }}
          >
            签诗抽签
          </h1>
          <p className="text-base sm:text-lg max-w-xl" style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 'var(--leading-relaxed)' }}>
            虚拟摇签体验，AI 解读签诗启示
          </p>
        </div>
      </section>

      {/* ========== 签类型选择 ========== */}
      <section className="py-10 sm:py-12" style={{ background: 'var(--color-bg)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <h2 className="text-lg sm:text-xl font-semibold mb-6" style={{ color: 'var(--color-text)' }}>选择签类型</h2>
          <div className="flex flex-nowrap overflow-x-auto gap-4 pb-2 no-scrollbar">
            {LOT_TYPES.map((t) => {
              const isActive = activeType === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setActiveType(t.id)}
                  className="lot-type-card"
                  style={{
                    borderColor: isActive ? 'var(--color-gold)' : undefined,
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(200,168,78,0.06), rgba(200,168,78,0.02))'
                      : undefined,
                    boxShadow: isActive ? '0 4px 20px rgba(200,168,78,0.2)' : undefined,
                    transform: isActive ? 'translateY(-2px)' : undefined,
                  }}
                >
                  <div className="mb-3 flex justify-center" style={{ color: isActive ? 'var(--color-gold)' : 'var(--color-text-secondary)' }}>
                    {t.icon}
                  </div>
                  <div className="text-sm font-semibold truncate" style={{ color: isActive ? 'var(--color-text)' : 'var(--color-text-secondary)' }}>
                    {t.name}
                  </div>
                  <div className="text-xs mt-1 truncate" style={{ color: 'var(--color-text-tertiary)' }}>{t.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== 意图输入 + 摇签 ========== */}
      <section className="pb-10 sm:pb-12" style={{ background: 'var(--color-bg)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* 左侧：问题输入 */}
            <div className="lg:col-span-3">
              <div className="rounded-xl p-6 sm:p-8" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
                <label className="block text-base font-semibold mb-3" style={{ color: 'var(--color-text)' }}>心中所想</label>
                <p className="text-sm mb-4" style={{ color: 'var(--color-text-tertiary)' }}>写下您想问的事情，或者心中默念即可</p>
                <textarea
                  className="w-full rounded-lg px-4 py-3 text-sm resize-none"
                  rows={3}
                  placeholder="例如：今年事业运势如何？感情能否修成正果？"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  style={{
                    background: 'var(--color-bg-inset)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                    outline: 'none',
                    transition: 'border-color var(--transition-base)',
                  }}
                />
                <div className="flex items-center gap-2 mt-3">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--color-gold)', opacity: 0.6 }}>
                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M8 5 L8 8.5 L10.5 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>心中默念三遍所求之事，再摇签效果更佳</span>
                </div>
              </div>
            </div>

            {/* 右侧：签筒 + 摇签按钮 */}
            <div className="lg:col-span-2 flex flex-col items-center">
              <div className="mb-6">
                <LotTubeSVG shaking={shaking} />
              </div>
              <button
                onClick={handleDrawLot}
                disabled={shaking}
                className="w-full max-w-xs px-8 py-4 rounded-xl text-lg font-semibold transition-all cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))',
                  color: '#fff',
                  boxShadow: '0 4px 20px rgba(200, 168, 78, 0.4)',
                  letterSpacing: '0.08em',
                  opacity: shaking ? 0.6 : 1,
                  cursor: shaking ? 'not-allowed' : 'pointer',
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  {shaking ? (
                    <RotateCw size={20} className="animate-spin" />
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 2 L10 14 M6 10 L10 14 L14 10" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {shaking ? '摇签中...' : '摇签'}
                </span>
              </button>
              <p className="text-xs mt-3 text-center" style={{ color: 'var(--color-text-tertiary)' }}>点击按钮开始虚拟摇签</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 签诗展示区 ========== */}
      {drawnLot && lotLevel && (
        <section className="py-10 sm:py-12" style={{ background: 'var(--color-bg-inset)' }}>
          <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
            <div className="lot-poem-card max-w-3xl mx-auto">
              {/* 签诗头部 */}
              <div className="lot-poem-header text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--color-gold-light)', fontFamily: 'var(--font-display)' }}>
                    第廿七签
                  </span>
                  <span className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full text-sm font-semibold" style={{ background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))', color: '#fff', boxShadow: '0 2px 8px rgba(200, 168, 78, 0.35)' }}>
                    {lotLevel.level}
                  </span>
                </div>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {activeTypeName} · {activeTypeName === '观音灵签' ? '观音菩萨灵应' : activeTypeName === '关帝灵签' ? '关圣帝君灵应' : activeTypeName === '月老灵签' ? '月老星君灵应' : activeTypeName === '车公灵签' ? '车公元帅灵应' : '纯阳帝君灵应'}
                </p>
              </div>

              {/* 签诗正文 */}
              <div className="p-6 sm:p-8">
                {/* 签诗原文 */}
                <div className="text-center mb-6">
                  <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    签诗原文
                  </h3>
                  <div className="poem-classical">
                    {drawnLot.poem.split('\n').map((line, i) => (
                      <span key={i}>
                        {i > 0 && <br />}
                        {line}
                      </span>
                    ))}
                  </div>
                </div>

                <Divider />

                {/* 白话解意 */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                    <BookOpen size={16} />
                    白话解意
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text)', lineHeight: 'var(--leading-relaxed)' }}>
                    {drawnLot.interpretation}
                  </p>
                </div>

                <Divider />

                {/* 签诗典故 */}
                <div className="mb-2">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                    <ScrollText size={16} />
                    签诗典故
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text)', lineHeight: 'var(--leading-relaxed)' }}>
                    {drawnLot.story}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========== AI 解读 ========== */}
      {drawnLot && lotLevel && (
        <section className="py-10 sm:py-12" style={{ background: 'var(--color-bg)' }}>
          <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center rounded-lg" style={{ width: 36, height: 36, background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))' }}>
                  <Sparkles size={16} style={{ color: 'var(--color-text-inverse)' }} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>AI 解读</h2>
                  <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>结合您的问题进行针对性分析</p>
                </div>
              </div>

              <div className="rounded-xl p-6 sm:p-8" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
                {drawnLot.aiInsights.map((insight, i) => (
                  <div key={i} className="flex items-start gap-3 mb-4" style={i === drawnLot.aiInsights.length - 1 ? { marginBottom: 0 } : undefined}>
                    <InsightBullet />
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text)', lineHeight: 'var(--leading-relaxed)' }}>
                      {insight.split(/(上签|事业前景向好|上上签|中签|下签|中上签|中下签|下下签)/).map((seg, j) => {
                        if (['上签', '上上签', '中签', '下签', '中上签', '中下签', '下下签'].includes(seg)) {
                          return <strong key={j} style={{ color: 'var(--color-gold-dark)' }}>{seg}</strong>;
                        }
                        if (seg === '事业前景向好') {
                          return <strong key={j} style={{ color: 'var(--color-primary)' }}>{seg}</strong>;
                        }
                        return <span key={j}>{seg}</span>;
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========== 化解与建议 ========== */}
      {drawnLot && lotLevel && (
        <section className="py-10 sm:py-12" style={{ background: 'var(--color-bg-inset)' }}>
          <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center rounded-lg" style={{ width: 36, height: 36, background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))' }}>
                  <Lightbulb size={16} style={{ color: 'var(--color-text-inverse)' }} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>化解与建议</h2>
                  <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>趋吉避凶，顺势而为</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {drawnLot.suggestions.map((item) => (
                  <div key={item.title} className="rounded-lg p-5" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-light)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <SuggestionIcon type={item.svg} />
                      <h3 className="text-sm font-semibold truncate" style={{ color: 'var(--color-text)' }}>{item.title}</h3>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========== 追问 AI + 保存/分享/重新摇签 ========== */}
      {drawnLot && (
        <section className="py-10 sm:py-12" style={{ background: 'var(--color-bg)' }}>
          <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
            <div className="max-w-3xl mx-auto">
              {/* 追问输入 */}
              <div className="rounded-xl p-6 sm:p-8 mb-6" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
                <h3 className="text-base font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
                  <MessageCircle size={16} style={{ color: 'var(--color-primary)' }} />
                  追问 AI
                </h3>
                <p className="text-sm mb-4" style={{ color: 'var(--color-text-tertiary)' }}>对签诗有更多疑问？可以向 AI 进一步提问</p>
                <div className="flex gap-3">
                  <input
                    type="text"
                    className="flex-1 rounded-lg px-4 py-3 text-sm"
                    placeholder="例如：感情方面具体有什么建议？"
                    style={{
                      background: 'var(--color-bg-inset)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text)',
                      outline: 'none',
                      transition: 'border-color var(--transition-base)',
                    }}
                  />
                  <button className="shrink-0 px-5 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer" style={{ background: 'var(--color-primary)', color: 'var(--color-text-inverse)' }}>
                    追问
                  </button>
                </div>
              </div>

              {/* 操作按钮组 */}
              <div className="flex flex-wrap gap-3 justify-center">
                {/* 保存签诗 */}
                <button className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}>
                  <Bookmark size={16} />
                  保存签诗
                </button>
                {/* 分享好友 */}
                <button className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer" style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}>
                  <Share2 size={16} />
                  分享好友
                </button>
                {/* 重新摇签 */}
                <button
                  onClick={handleDrawLot}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, var(--color-gold), var(--color-gold-dark))', color: '#fff', boxShadow: '0 2px 12px rgba(200, 168, 78, 0.3)' }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 2 L14 8 L2 14 Z" fill="#fff" opacity="0.8" />
                  </svg>
                  重新摇签
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========== 底部推荐工具 ========== */}
      <section className="py-10 sm:py-12" style={{ background: 'var(--color-bg-inset)' }}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: 'var(--max-width)' }}>
          <h2 className="text-lg sm:text-xl font-semibold mb-6" style={{ color: 'var(--color-text)' }}>您可能还感兴趣</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {RECOMMEND_TOOLS.map((item) => (
              <div key={item.name} className="recommend-card">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 flex items-center justify-center rounded-lg" style={{ width: 48, height: 48, background: item.bgColor }}>
                    <RecommendIcon type={item.icon} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold truncate mb-1" style={{ color: 'var(--color-text)' }}>{item.name}</h3>
                    <p className="text-xs" style={{ color: 'var(--color-text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
